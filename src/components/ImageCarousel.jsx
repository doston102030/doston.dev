import { useState, useRef, useCallback, useEffect } from 'react';
import './ImageCarousel.css';

export default function ImageCarousel({ images = [], autoPlay = false, interval = 4000 }) {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const touchStartRef = useRef(0);

    const slides = images.length > 0 ? images : [
        { src: '/avatar.jpg', alt: 'Photo 1' },
    ];

    const goTo = useCallback((idx) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent(idx);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [isTransitioning]);

    const next = useCallback(() => {
        goTo((current + 1) % slides.length);
    }, [current, slides.length, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + slides.length) % slides.length);
    }, [current, slides.length, goTo]);

    useEffect(() => {
        if (!autoPlay || slides.length <= 1) return;
        const itv = setInterval(next, interval);
        return () => clearInterval(itv);
    }, [autoPlay, interval, next, slides.length]);

    const onTouchStart = (e) => {
        touchStartRef.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        const diff = touchStartRef.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
    };

    if (slides.length === 0) return null;

    return (
        <div
            className="carousel-wrapper"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="carousel-track-wrapper">
                <div className="carousel-track">
                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className={`carousel-slide ${i === current ? 'active' : ''}`}
                        >
                            <img
                                src={slide.src}
                                alt={slide.alt || `Slide ${i + 1}`}
                                className="carousel-image"
                                loading="eager"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        className="carousel-btn carousel-btn-prev"
                        onClick={prev}
                        aria-label="Previous"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        className="carousel-btn carousel-btn-next"
                        onClick={next}
                        aria-label="Next"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots */}
            {slides.length > 1 && (
                <div className="carousel-dots">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={`carousel-dot ${i === current ? 'active' : ''}`}
                            onClick={() => goTo(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Counter */}
            {slides.length > 1 && (
                <div className="carousel-counter">
                    <span className="carousel-counter-current">{String(current + 1).padStart(2, '0')}</span>
                    <span className="carousel-counter-sep">/</span>
                    <span>{String(slides.length).padStart(2, '0')}</span>
                </div>
            )}
        </div>
    );
}
