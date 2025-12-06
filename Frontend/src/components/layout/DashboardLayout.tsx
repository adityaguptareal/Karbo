import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, Bell, User, ChevronDown, LogOut, Settings, Home } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}
interface DashboardLayoutProps {
  navItems: NavItem[];
  userType: 'farmer' | 'company' | 'admin';
  userName: string;
  children: React.ReactNode;
}
export function DashboardLayout({
  navItems,
  userType,
  userName,
  children
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const userTypeColors = {
    farmer: 'bg-primary',
    company: 'bg-secondary',
    admin: 'bg-accent'
  };
  return <div className="min-h-screen bg-muted/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-semibold text-foreground hidden sm:block">
                ​Karbo
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <Home className="w-5 h-5" />
              </Link>
            </Button>
            
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground", userTypeColors[userType])}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{userName}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/company/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/login" className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn("fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border transition-transform lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
          <nav className="p-4 space-y-1">
            {navItems.map(item => {
            const isActive = location.pathname === item.href;
            return <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>;
          })}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>;
}