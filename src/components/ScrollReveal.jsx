import { useEffect, useRef } from 'react';

// Single global IntersectionObserver — no React state, pure DOM
let globalObserver = null;
const observedElements = new Set();

function getObserver() {
    if (globalObserver) return globalObserver;

    globalObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once visible for maximum performance
                    globalObserver.unobserve(entry.target);
                    observedElements.delete(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    return globalObserver;
}

/**
 * ScrollReveal — section wrapper, uses single global observer
 * No React state changes = no re-renders = no lag
 */
export default function ScrollReveal({ children, className = 'scroll-reveal' }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = getObserver();
        obs.observe(el);
        observedElements.add(el);

        return () => {
            obs.unobserve(el);
            observedElements.delete(el);
        };
    }, []);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

/**
 * RevealItem — per-element reveal, uses same global observer
 * Delay is handled via CSS transition-delay
 */
export function RevealItem({ children, delay = 0, className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (delay > 0) {
            el.style.transitionDelay = `${delay}ms`;
        }

        const obs = getObserver();
        obs.observe(el);
        observedElements.add(el);

        return () => {
            obs.unobserve(el);
            observedElements.delete(el);
        };
    }, [delay]);

    return (
        <div ref={ref} className={`reveal-item ${className}`}>
            {children}
        </div>
    );
}
