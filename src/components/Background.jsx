import './Background.css';

export default function Background() {
    return (
        <div className="fixed inset-0 bg-bg -z-[100] overflow-hidden will-change-transform [transform:translateZ(0)]">
            <div className="retro-grid" />
            <div className="retro-scanlines" />
            <div className="retro-corner-glow" />
            <div className="retro-grain" />
        </div>
    );
}
