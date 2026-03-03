import { clsx } from 'clsx';

const variants = {
    primary: 'btn-primary',
    secondary: 'bg-white/5 border-1.5 border-white/10 text-white hover:border-accent hover:text-accent',
    outline: 'btn-outline',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'bg-transparent border-1.5 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black hover:border-red-500',
    success: 'bg-transparent border-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500',
    accent: 'btn-primary',
};

const sizes = {
    xs: 'px-3 py-1 text-[0.7rem] gap-1.5',
    sm: 'px-4 py-1.5 text-[0.75rem] gap-2',
    md: 'px-8 py-3.5 text-[0.75rem] gap-3',
    lg: 'px-10 py-4 text-[0.8rem] gap-3.5',
    xl: 'px-12 py-5 text-[0.9rem] gap-4',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    className = '',
    loading = false,
    disabled = false,
    ...props
}) {
    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center font-bold font-mono uppercase tracking-widest',
                'transition-all duration-200 ease-in-out cursor-pointer rounded-none',
                'disabled:opacity-50 disabled:cursor-not-allowed transform-none',
                'relative overflow-hidden active:translate-y-px',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : Icon ? (
                <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
            ) : null}
            {children}
            {IconRight && !loading && <IconRight size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
        </button>
    );
}
