import { clsx } from 'clsx';

const variants = {
    default: 'bg-white/[0.03] border border-white/[0.06]',
    glass: 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-card',
    elevated: 'bg-white/[0.05] border border-white/[0.08] shadow-card hover:shadow-card-hover',
    outline: 'bg-transparent border border-white/[0.1]',
    gradient: 'bg-gradient-to-br from-primary-500/10 to-accent-dark/10 border border-primary-500/15',
    ghost: 'bg-transparent',
};

export function Card({
    children,
    variant = 'default',
    hover = false,
    padding = 'md',
    className = '',
    ...props
}) {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={clsx(
                'rounded-2xl transition-all duration-300',
                variants[variant],
                paddings[padding],
                hover && 'hover:border-primary-500/20 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={clsx('mb-4', className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, icon: Icon, className = '' }) {
    return (
        <h3 className={clsx(
            'font-heading text-base font-bold text-white flex items-center gap-2.5',
            className
        )}>
            {Icon && <Icon size={18} className="text-primary-400" />}
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = '' }) {
    return (
        <p className={clsx('text-[0.82rem] text-gray-500 mt-1', className)}>
            {children}
        </p>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={clsx(className)}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={clsx(
            'mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-3',
            className
        )}>
            {children}
        </div>
    );
}
