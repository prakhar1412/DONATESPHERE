import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const features = [
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Every transaction is protected with bank-level encryption via Stripe.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Donations are processed in real-time with immediate confirmation emails.",
  },
  {
    icon: BarChart3,
    title: "Track Your Impact",
    description: "View your full donation history and see the difference you're making.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <img src="/favicon.jpg" alt="" className="h-4 w-4 rounded-full object-cover" />
              Give with confidence
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Make Every <span className="text-gradient">Donation</span> Count
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              A simple, secure way to donate and track your generosity. Join thousands making a real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="text-base px-8" asChild>
                <Link to="/donate">Donate Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center text-foreground mb-12">
            Why DonateSphere?
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className="bg-card rounded-xl p-6 card-elevated border border-border"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 font-sans text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hero-gradient rounded-2xl p-12 md:p-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Your generosity can change lives. Start your giving journey today.
            </p>
            <Button size="lg" variant="secondary" className="text-base px-8" asChild>
              <Link to="/donate">Start Donating</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
