import { useEffect, useRef } from "react";

/**
 * CursorGlow — A subtle glowing orb that follows the mouse cursor.
 * Adds a premium, interactive feel to the whole app.
 */
export function CursorGlow() {
    const glowRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0, y: 0 });
    const raf = useRef<number>(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            pos.current = { x: e.clientX, y: e.clientY };
        };

        const tick = () => {
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${pos.current.x - 200}px, ${pos.current.y - 200}px)`;
            }
            raf.current = requestAnimationFrame(tick);
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        raf.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-0 rounded-full"
            style={{
                background:
                    "radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 40%, transparent 70%)",
                willChange: "transform",
            }}
        />
    );
}
