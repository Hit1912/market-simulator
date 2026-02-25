import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Scroll-aware glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const routes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview" },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions" },
    { href: PROTECTED_ROUTES.REPORTS, label: "Reports" },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Settings" },
  ];

  return (
    <>
      <motion.header
        ref={navRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "w-full px-4 py-3 lg:px-14 sticky top-0 z-50 text-white transition-all duration-500",
          scrolled
            ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-b border-white/5"
        )}
      >
        <div className="w-full flex h-14 max-w-[var(--max-width)] items-center mx-auto">
          <div className="w-full flex items-center justify-between gap-6">

            {/* Left — Logo + Mobile Menu */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex md:hidden bg-white/5 hover:bg-white/10 text-white"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Logo />
            </div>

            {/* Center — Navigation */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {routes.map((route) => {
                const isActive = pathname === route.href ||
                  (route.href !== PROTECTED_ROUTES.OVERVIEW && pathname.startsWith(route.href));
                return (
                  <NavLink key={route.href} to={route.href} className="relative">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "text-white"
                          : "text-white/50 hover:text-white/80"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-white/8 border border-white/10 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10">{route.label}</span>
                    </motion.div>
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="bg-slate-950 border-white/10 text-white p-0">
                <div className="p-6 border-b border-white/5">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {routes.map((route) => {
                    const isActive = pathname === route.href;
                    return (
                      <NavLink
                        key={route.href}
                        to={route.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {route.label}
                      </NavLink>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Right — User actions */}
            <div className="flex items-center">
              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={() => setIsLogoutDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </motion.header>

      <LogoutDialog isOpen={isLogoutDialogOpen} setIsOpen={setIsLogoutDialogOpen} />
    </>
  );
};

export default Navbar;
