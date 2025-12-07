import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, User, LogOut, ChevronDown, Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  isLoggedIn?: boolean;
  userType?: 'farmer' | 'company' | 'admin';
}

export function Navbar({
  isLoggedIn = false,
  userType
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, isLoading } = useAuth();

  const navLinks = [{
    href: "/",
    label: "Home"
  }, {
    href: "/learn",
    label: "Learn"
  }, {
    href: "/marketplace",
    label: "Marketplace"
  }];

  const getDashboardLink = () => {
    switch (userType) {
      case 'farmer':
        return '/farmer/dashboard';
      case 'company':
        return '/company/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Redirect to home page
    navigate("/", { replace: true });
  };

  const displayName = isLoading ? 'Loading...' : (firstName || 'User');

  return <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            Karbo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => <Link key={link.href} to={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'}`}>
            {link.label}
          </Link>)}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? <>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </> : <>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </>}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden py-4 border-t border-border animate-fade-up">
        <div className="flex flex-col gap-2">
          {navLinks.map(link => <Link key={link.href} to={link.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`} onClick={() => setMobileMenuOpen(false)}>
            {link.label}
          </Link>)}
          <div className="border-t border-border my-2" />
          {isLoggedIn ? <>
            <Link to={getDashboardLink()} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-muted text-left w-full">
              Logout
            </button>
          </> : <div className="flex flex-col gap-2 px-4">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>}
        </div>
      </div>}
    </div>
  </nav>;
}