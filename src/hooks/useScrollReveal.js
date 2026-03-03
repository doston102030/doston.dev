import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered reveal animations
 * Uses IntersectionObserver for performance
 */
export function useScrollReveal(options = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element); // Only animate once
                }
            },
            {
                threshold: options.threshold || 0.15,
                rootMargin: options.rootMargin || '0px 0px -60px 0px',
            }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return [ref, isVisible];
}
