import { useEffect, useRef } from 'react';
import './CursorLight.css';

const TRAIL_COUNT = 6;

export default function CursorLight() {
    const spotRef = useRef(null);
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const trailRefs = useRef([]);
    const targetRef = useRef({ x: -500, y: -500 });
    const dotPosRef = useRef({ x: -500, y: -500 });
    const ringPosRef = useRef({ x: -500, y: -500 });
    const spotPosRef = useRef({ x: -500, y: -500 });
    const trailPositions = useRef(
        Array.from({ length: TRAIL_COUNT }, () => ({ x: -500, y: -500 }))
    );
    const rafRef = useRef(null);

    useEffect(() => {
        const onMouseMove = (e) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseDown = () => dotRef.current?.classList.add('clicking');
        const onMouseUp = () => dotRef.current?.classList.remove('clicking');

        const onMouseOver = (e) => {
            const isInteractive = e.target.closest(
                'a, button, [role="button"], .lang-item, .nav-link, .bottom-nav-item, .project-card, .quick-btn, .premium-link, .social-btn, .btn-primary, .btn-outline, .btn-minimal, .shatter-wrap'
            );
            dotRef.current?.classList.toggle('hovering', !!isInteractive);
            ringRef.current?.classList.toggle('hovering', !!isInteractive);
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const animate = () => {
            // Dot — tightly follows
            dotPosRef.current.x = lerp(dotPosRef.current.x, targetRef.current.x, 0.25);
            dotPosRef.current.y = lerp(dotPosRef.current.y, targetRef.current.y, 0.25);
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${dotPosRef.current.x}px, ${dotPosRef.current.y}px)`;
            }

            // Ring — slightly behind dot
            ringPosRef.current.x = lerp(ringPosRef.current.x, targetRef.current.x, 0.14);
            ringPosRef.current.y = lerp(ringPosRef.current.y, targetRef.current.y, 0.14);
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px)`;
            }

            // Spotlight — slowest
            spotPosRef.current.x = lerp(spotPosRef.current.x, targetRef.current.x, 0.1);
            spotPosRef.current.y = lerp(spotPosRef.current.y, targetRef.current.y, 0.1);
            if (spotRef.current) {
                spotRef.current.style.transform = `translate(${spotPosRef.current.x}px, ${spotPosRef.current.y}px)`;
            }

            // Trail daisy-chain
            trailPositions.current[0].x = lerp(trailPositions.current[0].x, dotPosRef.current.x, 0.4);
            trailPositions.current[0].y = lerp(trailPositions.current[0].y, dotPosRef.current.y, 0.4);
            for (let i = 1; i < TRAIL_COUNT; i++) {
                trailPositions.current[i].x = lerp(trailPositions.current[i].x, trailPositions.current[i - 1].x, 0.4);
                trailPositions.current[i].y = lerp(trailPositions.current[i].y, trailPositions.current[i - 1].y, 0.4);
            }
            trailRefs.current.forEach((el, i) => {
                if (el) el.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px)`;
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
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
            <div className="cursor-spotlight" ref={spotRef} />
            {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
                <div key={i} className="cursor-trail" ref={(el) => (trailRefs.current[i] = el)} style={{ '--i': i }} />
            ))}
            <div className="cursor-ring" ref={ringRef} />
            <div className="cursor-dot" ref={dotRef} />
        </>
    );
}
