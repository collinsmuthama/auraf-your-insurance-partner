import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } else {
      toast({ title: "Message Sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact Us</h1>
            <p className="text-lg opacity-90">We'd love to hear from you. Get in touch with our team.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Get in Touch</h2>
                <div className="space-y-6 mb-8">
                  {[
                    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                    { icon: Mail, label: "Email", value: "info@aurafinsurance.com" },
                    { icon: MapPin, label: "Address", value: "Mumbai, Maharashtra, India" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg overflow-hidden border border-border h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  />
                </div>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="How can we help?" />
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} placeholder="Your message..." />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-primary">
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* WhatsApp Float */}
      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
};

export default Contact;
