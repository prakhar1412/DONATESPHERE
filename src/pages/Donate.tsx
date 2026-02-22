import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const presetAmounts = [10, 25, 50, 100];

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const handlePreset = (val: number) => {
    setSelected(val);
    setAmount(String(val));
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
              <Heart className="h-6 w-6 text-primary fill-primary animate-float" />
            </div>
            <h1 className="text-2xl font-display font-bold text-center text-foreground mb-1">Make a Donation</h1>
            <p className="text-center text-muted-foreground text-sm mb-6">Choose an amount and donate securely</p>

            {/* Preset amounts */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {presetAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => handlePreset(val)}
                  className={`rounded-lg py-3 text-sm font-semibold border transition-all ${
                    selected === val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="amount">Custom Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setSelected(null);
                }}
              />
            </div>

            <Button className="w-full" size="lg" disabled={!amount || Number(amount) <= 0}>
              Donate ${amount || "0"}
            </Button>

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
