import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    const fetchDonations = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`http://localhost:5000/api/donations/${user.email}`);
          if (res.ok) {
            const data = await res.json();
            setDonations(data);
          }
        } catch (err) {
          console.error("Failed to fetch donations", err);
        }
      }
    };
    fetchDonations();
  }, [user]);

  // Show nothing while auth is loading
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              {user.picture ? <AvatarImage src={user.picture} alt={user.name} /> : null}
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-1">
                Welcome back, {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-muted-foreground">Here's an overview of your giving history.</p>
            </div>
          </div>

          {/* Provider badge */}
          {user.provider === "google" && (
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-xs font-medium mb-6 border border-blue-200 dark:border-blue-800">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Signed in with Google
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-5 card-elevated">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Total Donated</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-sans">${totalDonated}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 card-elevated">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Donations</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-sans">{donations.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 card-elevated">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src="/favicon.jpg" alt="" className="h-full w-full object-cover" />
                </div>
                <span className="text-sm text-muted-foreground">Impact Level</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-sans">Gold</p>
            </div>
          </div>

          {/* Donate CTA */}
          <div className="hero-gradient rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-primary-foreground font-sans">Ready to give again?</h3>
              <p className="text-primary-foreground/80 text-sm">Every contribution makes a difference.</p>
            </div>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>

          {/* Donations table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden card-elevated">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground font-sans">Recent Donations</h3>
            </div>
            <div className="divide-y divide-border">
              {donations.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">${d.amount}.00</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {d.date}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full capitalize">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
