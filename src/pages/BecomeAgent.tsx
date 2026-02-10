import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, BadgeDollarSign, TrendingUp, Award, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  { icon: BadgeDollarSign, title: "Instant Payouts", desc: "Get paid instantly for every policy you sell." },
  { icon: TrendingUp, title: "Unlimited Earnings", desc: "No cap on commissions — the more you sell, the more you earn." },
  { icon: Users, title: "Dedicated Support", desc: "Personal relationship manager to help you grow." },
  { icon: Award, title: "Rewards & Incentives", desc: "Monthly bonuses, annual trips, and special perks." },
];

const BecomeAgent = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", date_of_birth: "",
    address: "", city: "", state: "", pincode: "",
    experience_years: "", previous_company: "", license_number: "",
    pan_number: "", bank_name: "", account_number: "", ifsc_code: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const uploadIdDocument = async (): Promise<string | null> => {
    if (!idFile) return null;
    setUploading(true);
    const fileExt = idFile.name.split(".").pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage.from("agent-documents").upload(filePath, idFile);
    setUploading(false);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: urlData } = supabase.storage.from("agent-documents").getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!idFile) {
      toast({ title: "ID Required", description: "Please upload a valid ID document.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const docUrl = await uploadIdDocument();
    
    if (!docUrl) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("agent_applications").insert({
        ...form,
        experience_years: form.experience_years ? parseInt(form.experience_years) : null,
        id_document_url: docUrl,
      });
      
      if (error) {
        console.error("Submission error:", error);
        toast({ 
          title: "Error", 
          description: error.message || "Failed to submit application. Please try again.",
          variant: "destructive" 
        });
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Personal Info", "Experience", "ID Upload", "Bank Details"];

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-accent mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Application Submitted!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">Thank you for your interest in joining Auraf. Our team will review your application and contact you within 48 hours.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-secondary/90 to-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Become an Auraf Agent</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">Start your journey as an insurance advisor and earn unlimited commissions.</p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {/* Progress */}
                <div className="flex gap-1 mb-8">
                  {steps.map((s, i) => (
                    <div key={s} className="flex-1">
                      <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
                      <span className={`text-xs mt-1 block text-center ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>{s}</span>
                    </div>
                  ))}
                </div>

                {step === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label>Full Name *</Label><Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required /></div>
                      <div><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} /></div>
                      <div><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required /></div>
                      <div><Label>Phone *</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} required /></div>
                    </div>
                    <div><Label>Address</Label><Input value={form.address} onChange={(e) => update("address", e.target.value)} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div><Label>City</Label><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                      <div><Label>State</Label><Input value={form.state} onChange={(e) => update("state", e.target.value)} /></div>
                      <div><Label>Pincode</Label><Input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} /></div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Professional Experience</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label>Years of Experience</Label><Input type="number" value={form.experience_years} onChange={(e) => update("experience_years", e.target.value)} /></div>
                      <div><Label>Previous Company</Label><Input value={form.previous_company} onChange={(e) => update("previous_company", e.target.value)} /></div>
                      <div><Label>License Number</Label><Input value={form.license_number} onChange={(e) => update("license_number", e.target.value)} /></div>
                      <div><Label>PAN Number</Label><Input value={form.pan_number} onChange={(e) => update("pan_number", e.target.value)} /></div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>ID Document Upload</h3>
                    <p className="text-sm text-muted-foreground mb-4">Please upload a valid government-issued ID (Aadhaar, PAN Card, Passport, or Driving License).</p>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <Label htmlFor="id-upload" className="cursor-pointer text-primary hover:underline font-medium">
                        {idFile ? idFile.name : "Click to upload ID document"}
                      </Label>
                      <Input
                        id="id-upload"
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
                      />
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG, or PDF (max 5MB)</p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Bank Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label>Bank Name</Label><Input value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} /></div>
                      <div><Label>Account Number</Label><Input value={form.account_number} onChange={(e) => update("account_number", e.target.value)} /></div>
                      <div><Label>IFSC Code</Label><Input value={form.ifsc_code} onChange={(e) => update("ifsc_code", e.target.value)} /></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
                  {step < 3 ? (
                    <Button onClick={() => setStep(step + 1)} className="bg-primary" disabled={
                      (step === 0 && (!form.full_name || !form.email || !form.phone)) ||
                      (step === 2 && !idFile)
                    }>Next</Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={loading || uploading} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      {loading || uploading ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeAgent;
