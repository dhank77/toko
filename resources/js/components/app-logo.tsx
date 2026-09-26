import { usePage } from '@inertiajs/react';
import { Laptop } from 'lucide-react';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#001E2B] text-[#00ED64] shadow-xs">
                <Laptop className="size-4.5" />
            </div>
            <div className="ml-1.5 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-[#001E2B] dark:text-white">
                    Makassar<span className="text-[#00A35C] dark:text-[#00ED64]">Notebook</span>
                </span>
                <span className="text-[10px] text-[#8998A5] leading-none">
                    MKN Omnichannel
                </span>
            </div>
        </>
    );
}
