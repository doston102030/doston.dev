/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // CSS variable-based theme colors
                bg: 'var(--bg)',
                bg2: 'var(--bg2)',
                surface: 'var(--surface)',
                surface2: 'var(--surface2)',
                border: 'var(--border)',
                text: 'var(--text)',
                'text-muted': 'var(--text-muted)',
                'text-dim': 'var(--text-dim)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    2: 'var(--accent2)',
                    3: 'var(--accent3)',
                },
                glow: 'var(--glow)',
                // Solid design colors
                primary: {
                    DEFAULT: '#6d63ff',
                    light: '#8b7fff',
                    dark: '#5a52e0',
                    50: '#f0eeff',
                    100: '#e0dcff',
                    200: '#c2b9ff',
                    300: '#a396ff',
                    400: '#8b7fff',
                    500: '#6d63ff',
                    600: '#5a52e0',
                    700: '#4741b8',
                    800: '#343190',
                    900: '#212068',
                },
                cyan: {
                    DEFAULT: '#22d3ee',
                    light: '#67e8f9',
                    dark: '#0891b2',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                heading: ['Space Grotesk', 'sans-serif'],
                mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'xl': '14px',
                '2xl': '20px',
                '3xl': '24px',
            },
            boxShadow: {
                'glow': '0 0 30px rgba(109, 99, 255, 0.15)',
                'glow-lg': '0 0 50px rgba(109, 99, 255, 0.25)',
                'card': 'var(--card-shadow)',
                'card-hover': 'var(--card-shadow-hover)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease forwards',
                'fade-up': 'fadeInUp 0.7s ease both',
                'float': 'float 4s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s infinite',
                'gradient-shift': 'gradientShift 6s ease infinite',
                'marquee': 'marqueeScroll 40s linear infinite',
                'blink': 'blink 1s step-end infinite',
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(30px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 30px rgba(99, 130, 255, 0.12)' },
                    '50%': { boxShadow: '0 0 50px rgba(99, 130, 255, 0.22)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                marqueeScroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-33.333%)' },
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
            },
        },
    },
    plugins: [],
}
