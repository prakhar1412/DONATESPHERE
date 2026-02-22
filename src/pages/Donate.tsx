import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

// Placeholder Stripe Publishable Key - replace with your actual key
const stripePromise = loadStripe("pk_test_51...your_publishable_key");

const presetAmounts = [100, 500, 1000, 2000];

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePreset = (val: number) => {
    setSelected(val);
    setAmount(String(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setIsSubmitting(true);

    try {
      // Create Stripe Checkout Session via backend
      const response = await fetch("http://localhost:5000/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          userEmail: user?.email || "anonymous",
        }),
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Payment Error:", error);
      toast({
        title: "Payment Error",
        description: "Could not initiate payment. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border border-border p-8 card-elevated">
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src="/favicon.jpg" alt="DonateSphere Logo" className="h-10 w-10 rounded-xl object-cover shadow-md animate-float" />
            </div>
            <h1 className="text-2xl font-display font-bold text-center text-foreground mb-1">Make a Donation</h1>
            <p className="text-center text-muted-foreground text-sm mb-6">Choose an amount and donate securely</p>

            <form onSubmit={handleSubmit}>
              {/* Preset amounts */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePreset(val)}
                    className={`rounded-lg py-3 text-sm font-semibold border transition-all ${selected === val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                      }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="amount">Custom Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  placeholder="Enter amount in ₹"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setSelected(null);
                  }}
                  required
                />
              </div>

              <Button className="w-full" size="lg" disabled={!amount || Number(amount) <= 0 || isSubmitting}>
                {isSubmitting ? "Processing..." : `Donate ₹${amount ? Number(amount).toLocaleString('en-IN') : "0"}`}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Payments are processed securely through Stripe.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Donate;
