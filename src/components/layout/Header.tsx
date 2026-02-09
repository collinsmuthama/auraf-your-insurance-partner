import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Auraf Insurance" className="h-24 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-foreground"}`}>Home</Link>
          <Link to="/about" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary" : "text-foreground"}`}>About</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary text-foreground">
              Insurance <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link to="/insurance/individual" className="block px-4 py-2.5 text-sm hover:bg-muted rounded-t-lg">Individual Insurance</Link>
              <Link to="/insurance/business" className="block px-4 py-2.5 text-sm hover:bg-muted rounded-b-lg">Business Insurance</Link>
            </div>
          </div>

          <Link to="/contact" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/contact") ? "text-primary" : "text-foreground"}`}>Contact</Link>
          
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="gap-1"><LayoutDashboard className="h-4 w-4" /> Dashboard</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1"><LogOut className="h-4 w-4" /> Logout</Button>
            </>
          ) : (
            <>
              <Link to="/become-agent">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">Become an Agent</Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-1"><LogIn className="h-4 w-4" /> Login</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4">
          <Link to="/" className="block py-2.5 text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/about" className="block py-2.5 text-sm font-medium" onClick={() => setMobileOpen(false)}>About</Link>
          <button onClick={() => setInsuranceOpen(!insuranceOpen)} className="flex items-center gap-1 py-2.5 text-sm font-medium w-full">
            Insurance <ChevronDown className={`h-3 w-3 transition-transform ${insuranceOpen ? "rotate-180" : ""}`} />
          </button>
          {insuranceOpen && (
            <div className="pl-4">
              <Link to="/insurance/individual" className="block py-2 text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Individual</Link>
              <Link to="/insurance/business" className="block py-2 text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Business</Link>
            </div>
          )}
          <Link to="/contact" className="block py-2.5 text-sm font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block py-2.5 text-sm font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Button variant="ghost" size="sm" onClick={() => { signOut(); setMobileOpen(false); }} className="w-full mt-2">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/become-agent" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">Become an Agent</Button>
              </Link>
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full mt-2">Login</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
