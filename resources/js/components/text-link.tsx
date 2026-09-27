import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: Props) {
    return (
        <Link
            className={cn(
                'text-[#0099FF] underline decoration-[#0099FF]/30 underline-offset-4 transition-colors duration-200 ease-out hover:text-[#007ACC] hover:decoration-[#007ACC]',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
