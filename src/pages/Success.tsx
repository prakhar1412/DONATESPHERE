import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [donation, setDonation] = useState<any>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        // Check session status recursively if needed, but for Stripe Embedded redirect, 
        // the session is usually 'complete' by the time they hit return_url.
        const res = await fetch(`http://localhost:5000/api/payments/session-status?session_id=${sessionId}`);

        if (res.ok) {
          const data = await res.json();
          if (data.status === 'complete') {
            setDonation(data.donation);
            setStatus("success");
          } else if (data.status === 'open') {
            // Redirect back to checkout if session is still open
            window.location.href = "/donate";
          } else {
            setStatus("error");
          }
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Confirmation error:", err);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (!sessionId) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md w-full"
        >
          {status === "loading" ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">Verifying Payment...</h1>
              <p className="text-muted-foreground">Please wait while we confirm your donation.</p>
            </div>
          ) : status === "success" ? (
            <>
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center glow text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">Thank You!</h1>
              <p className="text-muted-foreground mb-2">
                Your donation {donation ? `of ₹${donation.amount.toLocaleString('en-IN')}` : ""} has been processed successfully.
              </p>
              <p className="text-muted-foreground mb-8 text-sm">
                A confirmation email has been sent to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/donate">Donate Again</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <XCircle className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">Oops!</h1>
              <p className="text-muted-foreground mb-8">
                We couldn't verify your payment. If you believe this is an error, please contact support.
              </p>
              <Button asChild>
                <Link to="/donate">Try Again</Link>
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Success;
