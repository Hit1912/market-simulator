import SignInForm from "./_component/signin-form";
import Logo from "@/components/logo/logo";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  { icon: TrendingUp, label: "Smart Analytics", desc: "Real-time insights on your spending patterns" },
  { icon: ShieldCheck, label: "Bank-Level Security", desc: "Your data is encrypted end-to-end" },
  { icon: Sparkles, label: "AI-Powered Reports", desc: "Monthly AI summaries delivered to your email" },
];

const SignIn = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-violet-600/15 blur-[100px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-primary/10 blur-[80px] rounded-full pointer-events-none"
      />

      {/* Left Panel — Form */}
      <div className="flex flex-col w-full lg:w-1/2 p-8 md:p-12 relative z-10 justify-between">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Logo url="/" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white glow-text">Welcome back</h1>
              <p className="text-slate-400 mt-2 text-sm">Sign in to your Finora account</p>
            </div>
            <SignInForm />
          </div>
        </motion.div>

        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Finora. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Feature Showcase */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative"
      >
        {/* Glass card */}
        <div className="relative bg-white/3 backdrop-blur-xl border border-white/8 rounded-3xl p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-violet-500/10 blur-3xl rounded-full" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="size-3" />
              AI-Powered Finance Platform
            </div>

            <h2 className="text-4xl font-bold text-white leading-snug tracking-tight mb-4">
              Take control of your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                financial future
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              Finora gives you crystal-clear visibility into your money. Track, analyze, and optimize — all in one beautiful dashboard.
            </p>

            <div className="space-y-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <f.icon className="size-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
