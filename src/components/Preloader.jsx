import React, { useState, useEffect } from 'react';
import './Preloader.css';

const Preloader = () => {
    const [visible, setVisible] = useState(true);
    const [typedText, setTypedText] = useState("");
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    const fullText = "SYSTEM.INITIALIZE('DOSTON_DEV_PORTFOLIO');";

    useEffect(() => {
        // Lock scroll
        document.documentElement.classList.add('lock-scroll');
        document.body.classList.add('lock-scroll');

        // Typing Effect
        let charIndex = 0;
        const typingInterval = setInterval(() => {
            if (charIndex <= fullText.length) {
                setTypedText(fullText.slice(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 40);

        // Progress Simulation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev < 100) {
                    const diff = Math.random() * 15;
                    const next = Math.min(prev + diff, 100);
                    return next;
                }
                clearInterval(progressInterval);
                return 100;
            });
        }, 150);

        return () => {
            clearInterval(typingInterval);
            clearInterval(progressInterval);
            document.documentElement.classList.remove('lock-scroll');
            document.body.classList.remove('lock-scroll');
        };
    }, []);

    useEffect(() => {
        if (progress === 100) {
            let timeout2;
            // Wait a bit before fading out
            const timeout1 = setTimeout(() => {
                setFadeOut(true);
                timeout2 = setTimeout(() => {
                    setVisible(false);
                    // Force-remove lock-scroll from everywhere
                    document.documentElement.classList.remove('lock-scroll');
                    document.body.classList.remove('lock-scroll');
                    // Reset any inline styles that might block scroll
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.documentElement.style.overflow = '';
                    window.scrollTo(0, 0);
                }, 1000);
            }, 500);

            return () => {
                clearTimeout(timeout1);
                clearTimeout(timeout2);
                // Safety: always unlock on cleanup
                document.documentElement.classList.remove('lock-scroll');
                document.body.classList.remove('lock-scroll');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.documentElement.style.overflow = '';
            };
        }
    }, [progress]);

    if (!visible) return null;

    return (
        <div className={`preloader-retro-wrapper ${fadeOut ? 'exit-sequence' : ''}`}>
            <div className="retro-scanlines"></div>
            <div className="retro-grain"></div>

            <div className="preloader-content-minimal">
                <div className="terminal-header">
                    <div className="terminal-dot red"></div>
                    <div className="terminal-dot yellow"></div>
                    <div className="terminal-dot green"></div>
                </div>

                <div className="terminal-body">
                    <div className="typing-container">
                        <span className="prompt">&gt;</span>
                        <span className="typed-text">{typedText}</span>
                        <span className="cursor-blink"></span>
                    </div>

                    <div className="status-container">
                        <span className="status-text">LOADING_ASSETS...</span>
                        <span className="status-percent">{Math.floor(progress)}%</span>
                    </div>

                    <div className="minimal-progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="terminal-footer">
                    <span>© 2026 ADHAMJONOV_DOSTON</span>
                    <span>v1.0.42_STABLE</span>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
