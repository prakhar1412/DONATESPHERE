import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
    setMobileOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3 font-display text-xl font-bold text-foreground">
          <img src="/favicon.jpg" alt="DonateSphere Logo" className="h-8 w-8 rounded-lg object-cover shadow-sm" />
          DonateSphere
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/donate" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Donate
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    {user.picture ? (
                      <AvatarImage src={user.picture} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    {user.picture ? (
                      <AvatarImage src={user.picture} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <Link to="/" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/dashboard" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          <Link to="/donate" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Donate</Link>

          {user ? (
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
                <Avatar className="h-8 w-8">
                  {user.picture ? (
                    <AvatarImage src={user.picture} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="sm" asChild><Link to="/login">Log in</Link></Button>
              <Button size="sm" asChild><Link to="/signup">Sign up</Link></Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
