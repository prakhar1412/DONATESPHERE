import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Success = () => (
  <Layout>
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center glow">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Thank You!</h1>
        <p className="text-muted-foreground mb-8">
          Your donation has been processed successfully. A confirmation email has been sent to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/donate">Donate Again</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  </Layout>
);

export default Success;
