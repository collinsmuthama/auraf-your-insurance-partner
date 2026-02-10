import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = ["Insurance Type", "Choose Policy", "Personal Details", "Review"];

interface QuoteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Policy {
  id: string;
  name: string;
  policy_type: string;
  provider: string | null;
  premium_range: string | null;
  description: string | null;
}

const QuoteWizard = ({ open, onOpenChange }: QuoteWizardProps) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const { toast } = useToast();
  const [form, setForm] = useState({
    insurance_type: "",
    selected_policy_id: "",
    selected_policy_name: "",
    full_name: "",
    email: "",
    phone: "",
    age: "",
    coverage_amount: "",
    message: "",
  });

  useEffect(() => {
    if (open) {
      supabase.from("insurance_policies").select("*").eq("is_active", true)
        .order("created_at", { ascending: false })
        .then(({ data }) => setPolicies((data as Policy[]) ?? []));
    }
  }, [open]);

  useEffect(() => {
    if (form.insurance_type) {
      setFilteredPolicies(
        policies.filter(p => p.policy_type.toLowerCase() === form.insurance_type.toLowerCase())
      );
      setForm(f => ({ ...f, selected_policy_id: "", selected_policy_name: "" }));
    }
  }, [form.insurance_type, policies]);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const selectPolicy = (policy: Policy) => {
    setForm(f => ({ ...f, selected_policy_id: policy.id, selected_policy_name: policy.name }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("quote_requests").insert({
      insurance_type: form.insurance_type,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      age: form.age ? parseInt(form.age) : null,
      coverage_amount: form.coverage_amount,
      message: form.selected_policy_name
        ? `Policy: ${form.selected_policy_name}${form.message ? ` | ${form.message}` : ""}`
        : form.message || null,
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
    setForm({ insurance_type: "", selected_policy_id: "", selected_policy_name: "", full_name: "", email: "", phone: "", age: "", coverage_amount: "", message: "" });
    onOpenChange(false);
  };

  const insuranceTypes = [...new Set(policies.map(p => p.policy_type))];

  const canNext = () => {
    if (step === 0) return !!form.insurance_type;
    if (step === 1) return true; // policy selection is optional
    if (step === 2) return form.full_name && form.email && form.phone;
    return true;
  };

  const selectedPolicy = policies.find(p => p.id === form.selected_policy_id);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); else onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
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
                    {(insuranceTypes.length > 0
                      ? insuranceTypes
                      : ["Health Insurance", "Motor Insurance", "Life Insurance", "Property Insurance", "Travel Insurance", "Business Insurance"]
                    ).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <Label>Choose a specific policy (optional)</Label>
                {filteredPolicies.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No specific policies found for "{form.insurance_type}". You can proceed to get a general quote.</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {filteredPolicies.map((p) => (
                      <Card
                        key={p.id}
                        className={`cursor-pointer transition-all ${
                          form.selected_policy_id === p.id
                            ? "ring-2 ring-primary border-primary"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => selectPolicy(p)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="font-semibold text-sm">{p.name}</span>
                              </div>
                              {p.provider && <p className="text-xs text-muted-foreground">Provider: {p.provider}</p>}
                              {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
                            </div>
                            {p.premium_range && (
                              <Badge variant="secondary" className="text-xs whitespace-nowrap">{p.premium_range}</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
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
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+254 712 345 678" />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="Your age" />
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
                {selectedPolicy && (
                  <>
                    <p className="text-sm"><strong>Policy:</strong> {selectedPolicy.name}</p>
                    {selectedPolicy.provider && <p className="text-sm"><strong>Provider:</strong> {selectedPolicy.provider}</p>}
                    {selectedPolicy.premium_range && <p className="text-sm"><strong>Premium:</strong> {selectedPolicy.premium_range}</p>}
                  </>
                )}
                <p className="text-sm"><strong>Name:</strong> {form.full_name}</p>
                <p className="text-sm"><strong>Email:</strong> {form.email}</p>
                <p className="text-sm"><strong>Phone:</strong> {form.phone}</p>
                {form.age && <p className="text-sm"><strong>Age:</strong> {form.age}</p>}
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
