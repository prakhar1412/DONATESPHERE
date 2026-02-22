import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50 py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold text-foreground mb-3">
            <img src="/favicon.jpg" alt="DonateSphere Logo" className="h-7 w-7 rounded-md object-cover shadow-sm" />
            DonateSphere
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Making generosity simple, secure, and impactful. Every donation counts.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Platform</h4>
          <div className="space-y-2">
            <Link to="/donate" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Donate</Link>
            <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Account</h4>
          <div className="space-y-2">
            <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
            <Link to="/signup" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Sign up</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} DonateSphere. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
