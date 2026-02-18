import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { partnerNames, partnerList } from "@/data/partners";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = ["Provider", "Insurance Type", "Policy", "Details", "Review"];

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

// helper exported for testing and reuse (not currently used in component)
export function computeProviders(policies: Policy[]): string[] {
  const policyProviders = [...new Set(policies.map(p => p.provider).filter(Boolean))] as string[];
  return [...new Set<string>([...policyProviders, ...partnerNames])];
}

const QuoteWizard = ({ open, onOpenChange }: QuoteWizardProps) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dbProviders, setDbProviders] = useState<string[]>([]);
  const [policiesForProvider, setPoliciesForProvider] = useState<Policy[]>([]);
  const { toast } = useToast();
  const [form, setForm] = useState({
    service_provider: "",
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

  // when dialog opens, fetch unique provider names from DB
  useEffect(() => {
    if (open) {
      supabase
        .from("insurance_policies")
        .select("provider", { distinct: true })
        .eq("is_active", true)
        .then(({ data }) => {
          const names = (data as Array<{ provider: string | null }>).
            map((r) => r.provider)
            .filter(Boolean) as string[];
          setDbProviders([...new Set(names)]);
        });
    }
  }, [open]);

  // fetch policies any time the selected provider changes
  useEffect(() => {
    if (open && form.service_provider) {
      supabase
        .from("insurance_policies")
        .select("*")
        .eq("is_active", true)
        .eq("provider", form.service_provider)
        .order("created_at", { ascending: false })
        .then(({ data }) => setPoliciesForProvider((data as Policy[]) ?? []));
    } else {
      setPoliciesForProvider([]);
    }
  }, [form.service_provider, open]);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  // Derived data based on selections
  // combine providers from database with configured partner names
  const providers = [...new Set<string>([...dbProviders, ...partnerNames])];
  
  // insurance types and policies come from the provider-specific fetch
  const insuranceTypes = [...new Set(policiesForProvider.map((p) => p.policy_type))];

  const filteredPolicies = policiesForProvider.filter(
    (p) => p.policy_type === form.insurance_type
  );

  const selectedPolicy = policiesForProvider.find(
    (p) => p.id === form.selected_policy_id
  );

  const selectPolicy = (policy: Policy) => {
    setForm(f => ({ ...f, selected_policy_id: policy.id, selected_policy_name: policy.name }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("quote_requests").insert({
      service_provider: form.service_provider,
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
    setForm({ service_provider: "", insurance_type: "", selected_policy_id: "", selected_policy_name: "", full_name: "", email: "", phone: "", age: "", coverage_amount: "", message: "" });
    onOpenChange(false);
  };

  const canNext = () => {
    if (step === 0) return !!form.service_provider;
    // allow proceeding even when no insurance types exist for the selected
    // provider (general quote request)
    if (step === 1) return insuranceTypes.length === 0 || !!form.insurance_type;
    if (step === 2) return true;
    if (step === 3) return form.full_name && form.email && form.phone;
    return true;
  };

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

            {/* Step 0: Select Provider */}
            {step === 0 && (
              <div className="space-y-3">
                <Label>Select an insurance provider</Label>
                {providers.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No providers available. Please contact an administrator to configure partners or add policies.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {providers.map((p) => {
                      const partner = partnerList.find((pl) => pl.name === p);
                      const logoSrc = partner?.logo;
                      return (
                        <Card
                          key={p}
                          className={`cursor-pointer transition-all ${form.service_provider === p ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
                          onClick={() => {
                            update("service_provider", p);
                            update("insurance_type", "");
                            update("selected_policy_id", "");
                            update("selected_policy_name", "");
                          }}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              {logoSrc ? (
                                <img
                                  src={logoSrc}
                                  alt={p}
                                  className="w-full h-full object-contain rounded-full"
                                />
                              ) : (
                                <span className="text-primary font-bold text-lg">{p.charAt(0)}</span>
                              )}
                            </div>
                            <p className="font-medium text-sm">{p}</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Select Insurance Type */}
            {step === 1 && (
              <div className="space-y-3">
                <Label>What type of insurance from {form.service_provider}?</Label>
                {insuranceTypes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No insurance types found for this provider. You can continue to submit a general quote.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {insuranceTypes.map((t) => (
                      <Card
                        key={t}
                        className={`cursor-pointer transition-all ${form.insurance_type === t ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
                        onClick={() => {
                          update("insurance_type", t);
                          update("selected_policy_id", "");
                          update("selected_policy_name", "");
                        }}
                      >
                        <CardContent className="p-4 text-center">
                          <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
                          <p className="font-medium text-sm">{t}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Policy */}
            {step === 2 && (
              <div className="space-y-3">
                <Label>Choose a specific policy (optional)</Label>
                {filteredPolicies.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No specific policies found. You can proceed to get a general quote.</p>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={form.selected_policy_id}
                      onChange={(e) => {
                        const id = e.target.value;
                        if (id) {
                          const policy = policiesForProvider.find((p) => p.id === id);
                          if (policy) selectPolicy(policy);
                        } else {
                          // clear selection
                          setForm((f) => ({
                            ...f,
                            selected_policy_id: "",
                            selected_policy_name: "",
                          }));
                        }
                      }}
                      className="w-full p-2 border border-border rounded"
                    >
                      <option value="">-- No policy / general quote --</option>
                      {filteredPolicies.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    {selectedPolicy && (
                      <div className="p-2 bg-muted rounded">
                        <p className="text-sm font-semibold">{selectedPolicy.name}</p>
                        {selectedPolicy.description && <p className="text-xs text-muted-foreground mt-1">{selectedPolicy.description}</p>}
                        {selectedPolicy.premium_range && (
                          <Badge variant="secondary" className="text-xs">{selectedPolicy.premium_range}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Personal Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Enter your full name" /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+254 712 345 678" /></div>
                <div><Label>Age</Label><Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="Your age" /></div>
                <div><Label>Additional Requirements (Optional)</Label><Textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Any specific needs..." /></div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-3 bg-muted rounded-lg p-4">
                <p className="text-sm"><strong>Provider:</strong> {form.service_provider}</p>
                <p className="text-sm"><strong>Type:</strong> {form.insurance_type}</p>
                {selectedPolicy && (
                  <>
                    <p className="text-sm"><strong>Policy:</strong> {selectedPolicy.name}</p>
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
              {step < 4 ? (
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
