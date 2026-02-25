import Navbar from "@/components/navbar";
import { Outlet } from "react-router-dom";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";
import { Scene3D } from "@/components/effects/scene-3d";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { AmbientOrbs } from "@/components/effects/ambient-orbs";
import { usePageTransition } from "@/hooks/use-gsap";

const AppLayout = () => {
  usePageTransition(".gsap-fade-in");

  return (
    <>
      {/* Three.js background */}
      <Scene3D />

      {/* Ambient orbs (Framer Motion breathing glows) */}
      <AmbientOrbs />

      {/* Mouse-following cursor glow */}
      <CursorGlow />

      <div className="min-h-screen pb-16 relative z-10">
        <Navbar />
        <main className="w-full max-w-full gsap-fade-in">
          <Outlet />
        </main>
      </div>
      <EditTransactionDrawer />
    </>
  );
};

export default AppLayout;
