import { useEffect, useState, useCallback, useRef } from 'react';
import './ImageModal.css';

export default function ImageModal({ images = [], initialIndex = 0, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const audioCtxRef = useRef(null);

    // Sync currentIndex when initialIndex changes (e.g., when opening modal for the first time)
    useEffect(() => {
        if (images.length > 0) {
            setCurrentIndex(initialIndex);
        }
    }, [initialIndex, images.length]);

    const playSound = useCallback(() => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.warn('Audio play failed', e);
        }
    }, []);

    const handleNext = useCallback((e) => {
        if (e) e.stopPropagation();
        if (images.length <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % images.length);
        playSound();
    }, [images.length, playSound]);

    const handlePrev = useCallback((e) => {
        if (e) e.stopPropagation();
        if (images.length <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        playSound();
    }, [images.length, playSound]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, handleNext, handlePrev]);

    if (!images || images.length === 0) return null;

    const currentImage = images[currentIndex];

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <button className="image-modal-close-global" onClick={onClose} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>

            {images.length > 1 && (
                <>
                    <button className="image-modal-nav-btn prev" onClick={handlePrev} aria-label="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button className="image-modal-nav-btn next" onClick={handleNext} aria-label="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </>
            )}

            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={currentImage.src || currentImage.imageUrl} 
                    alt={currentImage.alt || currentImage.title || 'Gallery image'} 
                    className="image-modal-img" 
                />
                {images.length > 1 && (
                    <div className="image-modal-counter">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        </div>
    );
}
