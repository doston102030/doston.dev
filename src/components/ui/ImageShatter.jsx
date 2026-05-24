import { useRef, useCallback } from 'react';
import './ImageShatter.css';

const COLS = 6;
const ROWS = 5;

export default function ImageShatter({ src, alt, className, onClick, onError }) {
    const containerRef = useRef(null);

    const handleMouseEnter = useCallback(() => {
        const cells = containerRef.current?.querySelectorAll('.shatter-cell');
        cells?.forEach(cell => {
            const cx = parseFloat(cell.dataset.cx);
            const cy = parseFloat(cell.dataset.cy);
            const dist = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2);
            const angle = Math.atan2(cy - 0.5, cx - 0.5);
            const force = 28 + dist * 55;
            const tx = Math.cos(angle) * force + (Math.random() - 0.5) * 12;
            const ty = Math.sin(angle) * force + (Math.random() - 0.5) * 12;
            const rot = (Math.random() - 0.5) * 22;
            const sc = 0.85 + Math.random() * 0.2;
            cell.style.setProperty('--tx', `${tx}px`);
            cell.style.setProperty('--ty', `${ty}px`);
            cell.style.setProperty('--rot', `${rot}deg`);
            cell.style.setProperty('--sc', sc);
            cell.style.setProperty('--delay', `${dist * 60}ms`);
            cell.classList.add('shattered');
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        const cells = containerRef.current?.querySelectorAll('.shatter-cell');
        cells?.forEach(cell => {
            cell.style.setProperty('--delay', '0ms');
            cell.classList.remove('shattered');
        });
    }, []);

    const cells = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cx = (c + 0.5) / COLS;
            const cy = (r + 0.5) / ROWS;
            const bpx = COLS > 1 ? (c / (COLS - 1)) * 100 : 0;
            const bpy = ROWS > 1 ? (r / (ROWS - 1)) * 100 : 0;
            cells.push({ r, c, cx, cy, bpx, bpy });
        }
    }

    return (
        <div
            ref={containerRef}
            className={`shatter-wrap ${className || ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {cells.map(({ r, c, cx, cy, bpx, bpy }) => (
                <div
                    key={`${r}-${c}`}
                    className="shatter-cell"
                    data-cx={cx}
                    data-cy={cy}
                    style={{
                        left: `${(c / COLS) * 100}%`,
                        top: `${(r / ROWS) * 100}%`,
                        width: `${100 / COLS}%`,
                        height: `${100 / ROWS}%`,
                        backgroundImage: `url(${src})`,
                        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                        backgroundPosition: `${bpx}% ${bpy}%`,
                    }}
                />
            ))}
            <div className="shatter-glow" />
            {onError && (
                <img
                    src={src}
                    alt=""
                    style={{ display: 'none' }}
                    onError={onError}
                />
            )}
        </div>
    );
}
