import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Mail, MessageSquare, Eye, Reply, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string | null;
  created_at: string;
}

interface QuoteRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  insurance_type: string;
  message: string | null;
  status: string;
  created_at: string;
}

const ContactQuotesTab = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selected, setSelected] = useState<ContactMessage | QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyType, setReplyType] = useState<"contact" | "quote" | null>(null);
  const { toast } = useToast();
  const { user, role } = useAuth();

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching contacts:", error);
    } else {
      setContacts((data as ContactMessage[]) ?? []);
    }
  };

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching quotes:", error);
    } else {
      setQuotes((data as QuoteRequest[]) ?? []);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchContacts(), fetchQuotes()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const sendReply = async () => {
    if (role !== "admin") {
      toast({ title: "Not allowed", description: "Only admins can send replies.", variant: "destructive" });
      return;
    }
    if (!replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive"
      });
      return;
    }

    if (!selected || !replyType) {
      toast({
        title: "Error",
        description: "No item selected.",
        variant: "destructive"
      });
      return;
    }

    setResponding(true);
    try {
      const itemId = selected.id;
      const email = selected.email;
      const fullName = replyType === "contact" ? (selected as ContactMessage).name : (selected as QuoteRequest).full_name;
      const tableName = replyType === "contact" ? "contact_messages" : "quote_requests";

      // Send email notification
      const emailSubject = replyType === "contact" 
        ? "Re: Your Message to Auraf Insurance"
        : "Your Quote Request - Auraf Insurance";

      const emailHtml = replyType === "contact"
        ? `<h2>Hi ${fullName},</h2>
           <p>Thank you for reaching out to us. Here's our response:</p>
           <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${replyMessage}</p>
           <p>Best regards,<br/>Auraf Insurance Team</p>`
        : `<h2>Hi ${fullName},</h2>
           <p>Thank you for your quote request. Here's our response:</p>
           <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${replyMessage}</p>
           <p>Best regards,<br/>Auraf Insurance Team</p>`;

      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          to: email,
          subject: emailSubject,
          html: emailHtml
        }
      });

      if (emailError) {
        console.error("Email send error:", emailError);
        toast({
          title: "Warning",
          description: "Reply recorded but email failed. You may need to contact them manually.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Reply sent successfully!",
          variant: "default"
        });
      }

      // Update status to "responded"
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ 
          status: "responded",
          responded_at: new Date().toISOString(),
          responded_by: user?.id
        })
        .eq("id", itemId);

      if (updateError) {
        console.error("Update error:", updateError);
        toast({
          title: "Error",
          description: "Failed to update status.",
          variant: "destructive"
        });
      } else {
        if (replyType === "contact") {
          await fetchContacts();
        } else {
          await fetchQuotes();
        }
        setSelected(null);
        setReplyMessage("");
        setReplyType(null);
      }
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description: "An error occurred while sending the reply.",
        variant: "destructive"
      });
    } finally {
      setResponding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "read":
        return "bg-blue-100 text-blue-800";
      case "responded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openReplyDialog = async (item: ContactMessage | QuoteRequest, type: "contact" | "quote") => {
    setSelected(item);
    setReplyType(type);
    setReplyMessage("");

    if (type === "contact") {
      try {
        if ((item as ContactMessage).status !== "read") {
          const { error } = await supabase
            .from("contact_messages")
            .update({ status: "read", read_at: new Date().toISOString() })
            .eq("id", item.id);

          if (error) {
            console.error("Failed to mark as read:", error);
            toast({ title: "Error", description: "Could not mark message as read.", variant: "destructive" });
          } else {
            await fetchContacts();
            setSelected((prev) => prev ? ({ ...prev, status: "read" } as ContactMessage) : prev);
          }
        }
      } catch (err) {
        console.error("Error marking contact as read:", err);
      }
    }
  };

  return (
    <Tabs defaultValue="contacts" className="space-y-6">
      <TabsList>
        <TabsTrigger value="contacts" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Contact Messages
        </TabsTrigger>
        <TabsTrigger value="quotes" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Quote Requests
        </TabsTrigger>
      </TabsList>

      <TabsContent value="contacts" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : contacts.length === 0 ? (
              <p className="text-gray-500">No contact messages yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell>{contact.phone || "-"}</TableCell>
                        <TableCell>
                          {new Date(contact.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contact.status || "pending")}>
                            {contact.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openReplyDialog(contact, "contact")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Contact Message Details</DialogTitle>
                              </DialogHeader>
                              {selected && !("insurance_type" in selected) && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="font-semibold">Name</Label>
                                      <p>{(selected as ContactMessage).name}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Email</Label>
                                      <p>{(selected as ContactMessage).email}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Phone</Label>
                                      <p>{(selected as ContactMessage).phone || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Status</Label>
                                      <p>
                                        <Badge className={getStatusColor((selected as ContactMessage).status || "pending")}>
                                          {(selected as ContactMessage).status || "pending"}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Subject</Label>
                                    <p className="mt-1">{(selected as ContactMessage).subject}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Message</Label>
                                    <p className="mt-2 p-3 bg-gray-50 rounded whitespace-pre-wrap">
                                      {(selected as ContactMessage).message}
                                    </p>
                                  </div>
                                  <div>
                                    <Label htmlFor="reply" className="font-semibold">
                                      Your Reply
                                    </Label>
                                    <Textarea
                                      id="reply"
                                      placeholder="Type your response here..."
                                      value={replyMessage}
                                      onChange={(e) => setReplyMessage(e.target.value)}
                                      className="mt-2"
                                      rows={5}
                                    />
                                  </div>
                                          <Button
                                            onClick={sendReply}
                                            disabled={responding || role !== "admin"}
                                            className="w-full"
                                          >
                                            <Reply className="h-4 w-4 mr-2" />
                                            {responding ? "Sending..." : "Send Reply"}
                                          </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="quotes" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Quote Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : quotes.length === 0 ? (
              <p className="text-gray-500">No quote requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Insurance Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.full_name}</TableCell>
                        <TableCell>{quote.email}</TableCell>
                        <TableCell>{quote.insurance_type}</TableCell>
                        <TableCell>
                          {new Date(quote.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(quote.status)}>
                            {quote.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openReplyDialog(quote, "quote")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Quote Request Details</DialogTitle>
                              </DialogHeader>
                              {selected && "insurance_type" in selected && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="font-semibold">Name</Label>
                                      <p>{(selected as QuoteRequest).full_name}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Email</Label>
                                      <p>{(selected as QuoteRequest).email}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Phone</Label>
                                      <p>{(selected as QuoteRequest).phone || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Insurance Type</Label>
                                      <p>{(selected as QuoteRequest).insurance_type}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label className="font-semibold">Status</Label>
                                      <p>
                                        <Badge className={getStatusColor((selected as QuoteRequest).status)}>
                                          {(selected as QuoteRequest).status}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                  {(selected as QuoteRequest).message && (
                                    <div>
                                      <Label className="font-semibold">Additional Details</Label>
                                      <p className="mt-2 p-3 bg-gray-50 rounded whitespace-pre-wrap">
                                        {(selected as QuoteRequest).message}
                                      </p>
                                    </div>
                                  )}
                                  <div>
                                    <Label htmlFor="reply" className="font-semibold">
                                      Your Response
                                    </Label>
                                    <Textarea
                                      id="reply"
                                      placeholder="Provide quote details, special offers, or next steps..."
                                      value={replyMessage}
                                      onChange={(e) => setReplyMessage(e.target.value)}
                                      className="mt-2"
                                      rows={5}
                                    />
                                  </div>
                                  <Button
                                    onClick={sendReply}
                                    disabled={responding}
                                    className="w-full"
                                  >
                                    <Reply className="h-4 w-4 mr-2" />
                                    {responding ? "Sending..." : "Send Response"}
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ContactQuotesTab;
