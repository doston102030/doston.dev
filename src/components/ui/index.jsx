import { clsx } from 'clsx';

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    pulse = false,
    className = '',
}) {
    const variants = {
        default: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
        info: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
        gradient: 'bg-gradient-to-r from-primary-500/15 to-accent-dark/15 text-primary-300 border border-primary-500/20',
        ghost: 'bg-white/5 text-gray-400 border border-white/10',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[0.65rem]',
        md: 'px-2.5 py-1 text-[0.72rem]',
        lg: 'px-3 py-1.5 text-[0.78rem]',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 font-semibold rounded-full',
                'tracking-wide uppercase',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {dot && (
                <span className={clsx(
                    'w-1.5 h-1.5 rounded-full',
                    variant === 'success' ? 'bg-emerald-400' :
                        variant === 'danger' ? 'bg-red-400' :
                            variant === 'warning' ? 'bg-amber-400' :
                                'bg-primary-400',
                    pulse && 'animate-pulse'
                )} />
            )}
            {children}
        </span>
    );
}

export function Input({
    label,
    icon: Icon,
    error,
    className = '',
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                    />
                )}
                <input
                    className={clsx(
                        'w-full bg-white/[0.05] border-[1.5px] border-white/[0.08] rounded-xl',
                        'py-3 text-[0.88rem] text-white font-sans',
                        'outline-none transition-all duration-300',
                        'placeholder:text-gray-600',
                        'focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(99,130,255,0.1)]',
                        'focus:bg-white/[0.07]',
                        Icon ? 'pl-10 pr-4' : 'px-4',
                        error && 'border-red-500/50 focus:border-red-500',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-[0.75rem] text-red-400">{error}</span>
            )}
        </div>
    );
}

export function Divider({ className = '' }) {
    return <div className={clsx('h-px bg-white/[0.06] my-4', className)} />;
}

export function Spinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-[2.5px]',
        lg: 'w-10 h-10 border-3',
    };

    return (
        <div
            className={clsx(
                'rounded-full border-primary-500/20 border-t-primary-500 animate-spin',
                sizes[size],
                className
            )}
        />
    );
}
