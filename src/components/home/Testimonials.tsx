import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  { name: "James Mwangi", role: "Insurance Agent, Nairobi", text: "Joining Auraf was the best decision of my career. The instant payout system and dedicated support have helped me grow my business 3x in just 6 months." },
  { name: "Violet Njeri", role: "Insurance Advisor, Nairobi", text: "The platform is incredibly easy to use. I can compare policies and close deals faster than ever before. My clients love the transparency." },
  { name: "Angela Nasembo", role: "Senior Agent, Nairobi", text: "Auraf's training programs and the wide range of insurance products have made it simple to serve diverse customer needs. Highly recommended!" },
  { name: "Andrew John", role: "Insurance Consultant, Nairobi", text: "The commission structure is unmatched in the industry. I earn more while providing better service to my clients. Win-win!" },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          What Our Agents Say
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Hear from agents who have transformed their insurance careers with Auraf.
        </p>

        <div className="max-w-3xl mx-auto relative">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Quote className="h-10 w-10 text-primary/30 mx-auto mb-4" />
              <p className="text-lg mb-6 italic text-muted-foreground">"{testimonials[current].text}"</p>
              <div>
                <p className="font-semibold text-lg">{testimonials[current].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)} className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-primary scale-125" : "bg-primary/30"}`} />
              ))}
            </div>
            <button onClick={() => setCurrent((current + 1) % testimonials.length)} className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
