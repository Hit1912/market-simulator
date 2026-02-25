import { motion } from "framer-motion";

/**
 * AmbientOrbs — Slow-breathing glowing blobs placed in the background.
 * Adds depth and life to the dark background without distracting.
 */
export function AmbientOrbs() {
    return (
        <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
            <motion.div
                className="absolute top-[5%] left-[8%] w-[28rem] h-[28rem] rounded-full bg-blue-600/8 blur-[100px]"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[10%] right-[5%] w-[22rem] h-[22rem] rounded-full bg-violet-600/8 blur-[90px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
            <motion.div
                className="absolute top-[50%] left-[50%] w-[18rem] h-[18rem] rounded-full bg-cyan-500/5 blur-[80px] -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.3, 1], x: [-30, 30, -30], y: [-20, 20, -20] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
        </div>
    );
}
