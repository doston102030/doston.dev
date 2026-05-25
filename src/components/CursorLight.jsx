import { useEffect, useRef } from 'react';
import './CursorLight.css';

const TRAIL_COUNT = 6;

export default function CursorLight() {
    const spotRef = useRef(null);
    const dotRef = useRef(null);
    const trailRefs = useRef([]);
    const targetRef = useRef({ x: -500, y: -500 });
    const posRef = useRef({ x: -500, y: -500 });
    const spotPosRef = useRef({ x: -500, y: -500 });
    const trailPositions = useRef(
        Array.from({ length: TRAIL_COUNT }, () => ({ x: -500, y: -500 }))
    );
    const rafRef = useRef(null);

    useEffect(() => {
        const onMouseMove = (e) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseDown = () => {
            dotRef.current?.classList.add('clicking');
        };

        const onMouseUp = () => {
            dotRef.current?.classList.remove('clicking');
        };

        const onMouseOver = (e) => {
            const target = e.target;
            const isInteractive = target.closest('a, button, [role="button"], .lang-item, .nav-link, .bottom-nav-item, .project-card, .quick-btn, .premium-link, .social-btn, .btn-primary, .btn-outline, .btn-minimal');

            if (isInteractive) {
                dotRef.current?.classList.add('hovering');
            } else {
                dotRef.current?.classList.remove('hovering');
            }
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const animate = () => {
            // Main dot tightly follows cursor — use transform for GPU acceleration
            posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.22);
            posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.22);

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
            }

            // Spotlight slowly lags behind
            spotPosRef.current.x = lerp(spotPosRef.current.x, targetRef.current.x, 0.18);
            spotPosRef.current.y = lerp(spotPosRef.current.y, targetRef.current.y, 0.18);

            if (spotRef.current) {
                spotRef.current.style.transform = `translate(${spotPosRef.current.x}px, ${spotPosRef.current.y}px)`;
            }

            // Trail daisy-chain
            trailPositions.current[0].x = lerp(trailPositions.current[0].x, posRef.current.x, 0.4);
            trailPositions.current[0].y = lerp(trailPositions.current[0].y, posRef.current.y, 0.4);

            for (let i = 1; i < TRAIL_COUNT; i++) {
                trailPositions.current[i].x = lerp(trailPositions.current[i].x, trailPositions.current[i - 1].x, 0.4);
                trailPositions.current[i].y = lerp(trailPositions.current[i].y, trailPositions.current[i - 1].y, 0.4);
            }

            trailRefs.current.forEach((el, i) => {
                if (el) {
                    el.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px)`;
                }
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mouseover', onMouseOver, { passive: true });
        window.addEventListener('mousedown', onMouseDown, { passive: true });
        window.addEventListener('mouseup', onMouseUp, { passive: true });
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            {/* Large soft spotlight */}
            <div className="cursor-spotlight" ref={spotRef} />

            {/* Trail particles */}
            {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
                <div
                    key={i}
                    className="cursor-trail"
                    ref={(el) => (trailRefs.current[i] = el)}
                    style={{ '--i': i }}
                />
            ))}

            {/* Main cursor dot */}
            <div className="cursor-dot" ref={dotRef} />
        </>
    );
}
