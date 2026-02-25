import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const usePageTransition = (selector: string, dependencies: any[] = []) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            gsap.fromTo(
                elements,
                { opacity: 0, y: 40, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'power4.out',
                    clearProps: 'all',
                }
            );
        }
    }, [selector, ...dependencies]);
};

// Scroll-triggered reveal for elements that come into viewport
export const useScrollReveal = (selector: string) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    clearProps: 'all',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        once: true,
                    },
                }
            );
        });
        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, [selector]);
};

// Number counter animation
export const useCounterAnimation = (selector: string, dependencies: any[] = []) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            gsap.from(el, {
                textContent: 0,
                duration: 1.5,
                ease: 'power1.out',
                snap: { textContent: 1 },
            });
        });
    }, [selector, ...dependencies]);
};

export const useHoverPulse = (selector: string) => {
    useEffect(() => {
        const elements = document.querySelectorAll(selector);
        const handlers: { el: Element; enter: () => void; leave: () => void }[] = [];

        elements.forEach((el) => {
            const enter = () => gsap.to(el, { scale: 1.06, duration: 0.3, ease: 'back.out(1.7)' });
            const leave = () => gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
            el.addEventListener('mouseenter', enter);
            el.addEventListener('mouseleave', leave);
            handlers.push({ el, enter, leave });
        });

        return () => {
            handlers.forEach(({ el, enter, leave }) => {
                el.removeEventListener('mouseenter', enter);
                el.removeEventListener('mouseleave', leave);
            });
        };
    }, [selector]);
};

// Shimmer border animation on hover for cards
export const useCardShimmer = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const enter = () => gsap.to(el, { boxShadow: '0 0 30px 2px rgba(59,130,246,0.2)', duration: 0.4 });
        const leave = () => gsap.to(el, { boxShadow: '0 0 0px 0 rgba(59,130,246,0)', duration: 0.4 });
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        return () => {
            el.removeEventListener('mouseenter', enter);
            el.removeEventListener('mouseleave', leave);
        };
    }, [ref]);
};
