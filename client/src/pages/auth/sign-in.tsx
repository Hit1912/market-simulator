import SignInForm from "./_component/signin-form";
import Logo from "@/components/logo/logo";
import dashboardImg from "../../assets/images/dashboard_.png";
import dashboardImgDark from "../../assets/images/dashboard_dark.png";
import { useTheme } from "@/context/theme-provider";
import { motion } from "framer-motion";

const SignIn = () => {
  const { theme } = useTheme();
  return (
    <div className="grid min-h-svh lg:grid-cols-2 relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-green-500/20 blur-[100px] rounded-full pointer-events-none"
      />

      <div className="flex flex-col gap-4 p-6 md:p-10 md:pt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-2 md:justify-start"
        >
          <Logo url="/" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden bg-muted lg:block -mt-3 overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 flex flex-col items-end justify-end pt-8 pl-8 bg-gradient-to-br from-transparent to-black/20 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-3xl mx-0 pr-5 mb-10"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Hi, I'm your AI-powered personal finance app, <span className="text-green-500">DHR!</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-muted-foreground/80 max-w-xl">
              DHR provides insights, monthly reports, CSV import, recurring transactions, all powered by advanced AI technology. 🚀
            </p>
          </motion.div>
          <div className="relative max-w-3xl h-[70%] w-full overflow-hidden mt-3 rounded-tl-3xl border-t border-l border-white/10 shadow-2xl">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 1.5 }}
              src={theme === "dark" ? dashboardImgDark : dashboardImg}
              alt="Dashboard"
              className="absolute top-0 left-0 w-full h-full object-cover"
              style={{
                objectPosition: "left top",
                transformOrigin: "left top",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
