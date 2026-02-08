import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Auraf Insurance" className="h-12 w-auto mb-4 brightness-200" />
            <p className="text-sm opacity-80">Your trusted partner for insurance solutions. We connect you with the best policies from top insurance companies.</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Home</Link>
              <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">About Us</Link>
              <Link to="/insurance/individual" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Individual Insurance</Link>
              <Link to="/insurance/business" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Business Insurance</Link>
              <Link to="/become-agent" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Become an Agent</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Insurance</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm opacity-80">Health Insurance</span>
              <span className="text-sm opacity-80">Motor Insurance</span>
              <span className="text-sm opacity-80">Life Insurance</span>
              <span className="text-sm opacity-80">Property Insurance</span>
              <span className="text-sm opacity-80">Travel Insurance</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Phone className="h-4 w-4" /> +91 98765 43210
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Mail className="h-4 w-4" /> info@aurafinsurance.com
              </div>
              <div className="flex items-start gap-2 text-sm opacity-80">
                <MapPin className="h-4 w-4 mt-0.5" /> Mumbai, Maharashtra, India
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-6 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Auraf Insurance. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
