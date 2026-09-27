import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <AppLogoIcon className="size-7 shrink-0" />
            <div className="flex flex-col text-left">
                <span className="text-base font-black tracking-tight text-[#222222] dark:text-white leading-none">
                    makassar<span className="text-[#0099FF]">notebook</span>
                </span>
                <span className="text-[9px] font-bold text-[#FF6000] tracking-tight leading-tight mt-0.5">
                    #SudahPastiMurahnya
                </span>
            </div>
        </div>
    );
}
