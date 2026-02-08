import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const steps = ["Insurance Type", "Personal Details", "Coverage", "Review"];

interface QuoteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteWizard = ({ open, onOpenChange }: QuoteWizardProps) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    insurance_type: "",
    full_name: "",
    email: "",
    phone: "",
    age: "",
    coverage_amount: "",
    message: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("quote_requests").insert({
      insurance_type: form.insurance_type,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      age: form.age ? parseInt(form.age) : null,
      coverage_amount: form.coverage_amount,
      message: form.message || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  const reset = () => {
    setStep(0);
    setSubmitted(false);
    setForm({ insurance_type: "", full_name: "", email: "", phone: "", age: "", coverage_amount: "", message: "" });
    onOpenChange(false);
  };

  const canNext = () => {
    if (step === 0) return !!form.insurance_type;
    if (step === 1) return form.full_name && form.email && form.phone;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); else onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {submitted ? "Quote Submitted!" : "Get a Free Quote"}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Thank you for your interest!</p>
            <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours with personalized quotes.</p>
            <Button onClick={reset}>Close</Button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {steps.map((s, i) => (
                <div key={s} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
                  <span className={`text-[10px] mt-1 block ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                </div>
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <Label>What type of insurance are you looking for?</Label>
                <Select value={form.insurance_type} onValueChange={(v) => update("insurance_type", v)}>
                  <SelectTrigger><SelectValue placeholder="Select insurance type" /></SelectTrigger>
                  <SelectContent>
                    {["Health Insurance", "Motor Insurance", "Life Insurance", "Property Insurance", "Travel Insurance", "Business Insurance"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Enter your full name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Age</Label>
                  <Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="Your age" />
                </div>
                <div>
                  <Label>Desired Coverage Amount</Label>
                  <Select value={form.coverage_amount} onValueChange={(v) => update("coverage_amount", v)}>
                    <SelectTrigger><SelectValue placeholder="Select coverage" /></SelectTrigger>
                    <SelectContent>
                      {["₹5 Lakh", "₹10 Lakh", "₹25 Lakh", "₹50 Lakh", "₹1 Crore", "₹2 Crore+"].map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Additional Requirements (Optional)</Label>
                  <Textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Any specific needs..." />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 bg-muted rounded-lg p-4">
                <p className="text-sm"><strong>Type:</strong> {form.insurance_type}</p>
                <p className="text-sm"><strong>Name:</strong> {form.full_name}</p>
                <p className="text-sm"><strong>Email:</strong> {form.email}</p>
                <p className="text-sm"><strong>Phone:</strong> {form.phone}</p>
                {form.age && <p className="text-sm"><strong>Age:</strong> {form.age}</p>}
                {form.coverage_amount && <p className="text-sm"><strong>Coverage:</strong> {form.coverage_amount}</p>}
                {form.message && <p className="text-sm"><strong>Notes:</strong> {form.message}</p>}
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="bg-primary">Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  {loading ? "Submitting..." : "Submit Quote"}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuoteWizard;
