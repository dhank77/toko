import { Link, router, usePage } from '@inertiajs/react';
import {
    Clock,
    HeartHandshake,
    Laptop,
    MapPin,
    Menu,
    MessageCircle,
    Package,
    Phone,
    RotateCcw,
    Search,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Smile,
    Sparkles,
    Star,
    Store,
    Tag,
    ThumbsUp,
    Truck,
    User,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { StoreAccountMenu } from '@/components/store-account-menu';

export interface SubCategoryItem {
    id: number;
    name: string;
    slug: string;
}

export interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    sub_categories: SubCategoryItem[];
}

export type BranchKey =
    | 'maricaya'
    | 'panakkukang'
    | 'pettarani'
    | 'perintis'
    | 'benhil'
    | 'centralpark'
    | 'kelapagading'
    | 'tangerang'
    | 'cikupa';

export interface BranchInfo {
    id: BranchKey;
    name: string;
    region: string;
    label: string;
    address: string;
    phone: string;
    waSales: string;
    hoursWeekday: string;
    hoursWeekend: string;
    mapUrl: string;
}

export const BRANCH_OPTIONS: Record<BranchKey, BranchInfo> = {
    maricaya: {
        id: 'maricaya',
        name: 'Pick N Go Maricaya Makassar',
        region: 'Makassar',
        label: 'Cabang Maricaya Baru - Jl. Kijang No. 5C',
        address: 'Jl. Kijang No.5C RW 9, Maricaya Baru, Kec. Makassar, Kota Makassar, Sulawesi Selatan 90141',
        phone: '(0411) 39 700 200',
        waSales: '0896 590 085 85',
        hoursWeekday: 'Senin - Sabtu (09:00 - 20:00 WITA)',
        hoursWeekend: 'Minggu / Libur Nasional (12:00 - 20:00 WITA)',
        mapUrl: 'https://maps.google.com/?q=Makassar+Notebook+Maricaya',
    },
    panakkukang: {
        id: 'panakkukang',
        name: 'Pick N Go Panakkukang Makassar',
        region: 'Makassar',
        label: 'Cabang Panakkukang - Jl. Pengayoman No. 42',
        address: 'Jl. Pengayoman No. 42, Masale, Panakkukang, Kota Makassar, Sulawesi Selatan 90231',
        phone: '(0411) 39 700 200',
        waSales: '0896 135 222 00',
        hoursWeekday: 'Senin - Sabtu (09:00 - 20:00 WITA)',
        hoursWeekend: 'Minggu / Libur Nasional (12:00 - 20:00 WITA)',
        mapUrl: 'https://maps.google.com/?q=Panakkukang+Makassar',
    },
    pettarani: {
        id: 'pettarani',
        name: 'Pick N Go AP Pettarani',
        region: 'Makassar',
        label: 'Cabang AP Pettarani - Ruko Blok B-7',
        address: 'Jl. A.P. Pettarani Business District Blok B-7, Tamamaung, Makassar 90222',
        phone: '(0411) 39 700 200',
        waSales: '0896 135 222 00',
        hoursWeekday: 'Senin - Sabtu (09:00 - 20:00 WITA)',
        hoursWeekend: 'Minggu / Libur Nasional (12:00 - 20:00 WITA)',
        mapUrl: 'https://maps.google.com/?q=AP+Pettarani+Makassar',
    },
    perintis: {
        id: 'perintis',
        name: 'Pick N Go Perintis Kemerdekaan',
        region: 'Makassar',
        label: 'Cabang Perintis - KM 10 Samping UNHAS',
        address: 'Jl. Perintis Kemerdekaan KM 10 Samping UNHAS, Tamalanrea, Makassar 90245',
        phone: '(0411) 39 700 200',
        waSales: '0896 135 222 00',
        hoursWeekday: 'Senin - Sabtu (09:00 - 20:00 WITA)',
        hoursWeekend: 'Minggu / Libur Nasional (12:00 - 20:00 WITA)',
        mapUrl: 'https://maps.google.com/?q=Perintis+Makassar',
    },
    benhil: {
        id: 'benhil',
        name: 'Jaknot Benhil Jakarta Pusat',
        region: 'Jabodetabek',
        label: 'Cabang Benhil - Jakarta Pusat',
        address: 'Jl. Bendungan Hilir No. 108, RT.13/RW.6, Bendungan Hilir, Tanah Abang, Jakarta Pusat 10210',
        phone: '(021) 39 700 200',
        waSales: '0896 000 000 01',
        hoursWeekday: 'Senin - Sabtu (09:00 - 20:00 WIB)',
        hoursWeekend: 'Minggu / Libur Nasional (12:00 - 20:00 WIB)',
        mapUrl: 'https://maps.google.com/?q=Jaknot+Benhil',
    },
    centralpark: {
        id: 'centralpark',
        name: 'Jaknot Central Park Mall',
        region: 'Jabodetabek',
        label: 'Cabang Central Park Mall - Jakarta Barat',
        address: 'Central Park Mall Lt. LG Blok L-238, Letjen S. Parman Kav. 28, Jakarta Barat 11470',
        phone: '(021) 39 700 200',
        waSales: '0896 000 000 02',
        hoursWeekday: 'Senin - Sabtu (09:00 - 20:00 WIB)',
        hoursWeekend: 'Minggu / Libur Nasional (12:00 - 20:00 WIB)',
        mapUrl: 'https://maps.google.com/?q=Jaknot+Central+Park',
    },
    kelapagading: {
        id: 'kelapagading',
        name: 'Jaknot Kelapa Gading',
        region: 'Jabodetabek',
        label: 'Cabang Kelapa Gading - Jakarta Utara',
        address: 'Ruko Inkopal Blok B No. 39, Jl. Boulevard Barat Raya, Kelapa Gading, Jakarta Utara 14240',
        phone: '(021) 39 700 200',
        waSales: '0896 000 000 03',
        hoursWeekday: 'Senin - Sabtu (09:00 - 20:00 WIB)',
        hoursWeekend: 'Minggu / Libur Nasional (10:00 - 18:00 WIB)',
        mapUrl: 'https://maps.google.com/?q=Jaknot+Kelapa+Gading',
    },
    tangerang: {
        id: 'tangerang',
        name: 'Jaknot Tangerang',
        region: 'Jabodetabek',
        label: 'Cabang Tangerang - Ruko Modernland',
        address: 'Ruko Modern Walk Blok MW No. 16, Jl. Hartono Raya, Modernland, Tangerang 15117',
        phone: '(021) 39 700 200',
        waSales: '0896 000 000 04',
        hoursWeekday: 'Senin - Sabtu (09:00 - 20:00 WIB)',
        hoursWeekend: 'Minggu / Libur Nasional (10:00 - 18:00 WIB)',
        mapUrl: 'https://maps.google.com/?q=Jaknot+Tangerang',
    },
    cikupa: {
        id: 'cikupa',
        name: 'Jaknot Cikupa Tangerang',
        region: 'Jabodetabek',
        label: 'Cabang Cikupa - Citra Raya',
        address: 'Ruko Eco Residence Blok V01 No. 51, Citra Raya, Cikupa, Tangerang 15710',
        phone: '(021) 39 700 200',
        waSales: '0896 000 000 05',
        hoursWeekday: 'Senin - Jumat (10:00 - 20:00 WIB)',
        hoursWeekend: 'Sabtu - Minggu & Libur Nasional (10:00 - 18:00 WIB)',
        mapUrl: 'https://maps.google.com/?q=Jaknot+Cikupa',
    },
};

const POPULAR_SEARCH_KEYWORDS = [
    'senter kepala',
    'kabel charger',
    'holder hp',
    'kursi lipat',
    'tripod bluetooth',
    'pompa elektrik',
    'tas ransel laptop',
    'timbangan digital',
    'bracket tv',
];

interface Props {
    children: React.ReactNode;
    categories?: CategoryItem[];
    activeBranch?: BranchKey;
    onBranchChange?: (branch: BranchKey) => void;
}

export default function StorefrontLayout({
    children,
    categories: propCategories,
    activeBranch: externalBranch,
    onBranchChange,
}: Props) {
    const page = usePage();
    const sharedCategories = (page.props.storeCategories as CategoryItem[] | undefined) || [];
    const sharedCartCount = (page.props.cartCount as number | undefined) || 0;

    const categories = propCategories && propCategories.length > 0 ? propCategories : sharedCategories;

    const branchKeys = Object.keys(BRANCH_OPTIONS) as BranchKey[];
    const [selectedBranch, setSelectedBranch] = useState<BranchKey>(externalBranch || 'maricaya');
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
    const [activeDepartment, setActiveDepartment] = useState(0);
    const [tickerIndex, setTickerIndex] = useState(0);

    // Search state
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Handle branch change
    const handleSelectBranch = (branch: BranchKey) => {
        setSelectedBranch(branch);
        if (onBranchChange) {
            onBranchChange(branch);
        }
        setIsBranchModalOpen(false);
    };

    // Auto rotate the top ticker bar
    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % branchKeys.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [branchKeys.length]);

    const currentBranch = BRANCH_OPTIONS[selectedBranch] || BRANCH_OPTIONS.maricaya;
    const activeTickerBranch = BRANCH_OPTIONS[branchKeys[tickerIndex]];

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKeyword.trim()) return;
        router.get('/', { search: searchKeyword });
    };

    return (
        <div className="min-h-screen bg-[#F7F7F7] font-sans antialiased text-[#222222]">
            {/* ========================================================
                1. TOP BAR (Ticker Branches, Opening Hours, Support)
                ======================================================== */}
            <div className="border-b border-[#e5e5e5] bg-white py-1.5 text-[11px] text-[#666666]">
                <div className="mx-auto flex max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1620px] items-center justify-between px-3 sm:px-4 2xl:px-6">
                    {/* Left: Location & Branch Ticker */}
                    <div className="flex items-center gap-2 truncate">
                        <button
                            type="button"
                            onClick={() => setIsBranchModalOpen(true)}
                            className="flex items-center gap-1 font-semibold text-[#222222] hover:text-[#0099ff] transition-colors cursor-pointer"
                        >
                            <MapPin className="size-3.5 text-[#ff6000]" />
                            <span>{currentBranch.region}</span>
                            <span className="text-[#0099ff] font-normal hover:underline ml-0.5">ganti</span>
                        </button>

                        <span className="text-gray-300">|</span>

                        {/* Rotating Branch Status */}
                        <div className="flex items-center gap-1.5 truncate">
                            <Clock className="size-3 text-gray-400 shrink-0" />
                            <span className="font-medium text-[#444444] truncate">
                                {activeTickerBranch.name}
                            </span>
                            <span className="text-gray-400 hidden md:inline truncate">
                                — {activeTickerBranch.hoursWeekday}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    handleSelectBranch(activeTickerBranch.id);
                                    const el = document.getElementById('toko-kami');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-[#0099ff] hover:underline shrink-0 ml-1 cursor-pointer"
                            >
                                Selengkapnya
                            </button>
                        </div>
                    </div>

                    {/* Right: Informational Links */}
                    <div className="hidden items-center gap-4 sm:flex text-[#555555]">
                        <a href="/#toko-kami" className="hover:text-[#0099ff] transition-colors">Service Center</a>
                        <a href="/#seo-info" className="hover:text-[#0099ff] transition-colors">How to buy</a>
                        <Link href="/client?tab=orders" className="hover:text-[#0099ff] transition-colors">Order Tracking</Link>
                    </div>
                </div>
            </div>

            {/* ========================================================
                2. MAIN HEADER (Logo, Category, Search, Cart, Account)
                ======================================================== */}
            <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-white shadow-xs">
                <div className="mx-auto flex h-16 max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1620px] items-center justify-between gap-4 px-3 sm:px-4 2xl:px-6">
                    {/* Kategori Button */}
                    <button
                        type="button"
                        onClick={() => setIsCategoryDrawerOpen(true)}
                        className="flex items-center gap-2 rounded-lg border border-[#cccccc] bg-[#fafafa] px-3.5 py-2 text-xs font-semibold text-[#444444] hover:bg-[#f0f0f0] hover:border-[#999999] transition-all cursor-pointer shrink-0"
                        aria-label="Buka Kategori"
                    >
                        <Menu className="size-4 text-[#ff6000]" />
                        <span className="hidden sm:inline">Kategori</span>
                    </button>

                    {/* Brand Logo MakassarNotebook */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="size-8">
                                <path d="M 12.0331 20.0119 C 10.2264 19.9492 8.51686 19.5975 6.86925 18.9462 C 5.40864 18.3688 4.05164 17.5578 2.8514 16.5448 C 2.69483 16.4131 2.51397 16.2957 2.49023 16.0603 C 2.48123 15.9716 2.47059 15.8835 2.5587 15.834 C 2.64054 15.7873 2.69809 15.8565 2.75811 15.9005 C 3.93354 16.7556 5.25518 17.3044 6.63165 17.7298 C 7.80462 18.0922 9.00979 18.323 10.2294 18.4663 C 11.0922 18.5669 11.9585 18.6389 12.829 18.5868 C 14.5189 18.4859 16.1919 18.2829 17.807 17.7412 C 18.2814 17.5806 18.7435 17.3858 19.1899 17.1585 C 19.2978 17.0999 19.4104 17.0507 19.5268 17.0112 C 19.6955 16.9602 19.8227 17.0137 19.8922 17.1428 C 19.9664 17.2791 19.9468 17.3882 19.8022 17.5162 C 19.5245 17.7617 19.21 17.9548 18.8914 18.1387 C 17.4367 18.9786 15.8714 19.5056 14.2188 19.788 C 13.4959 19.9097 12.7658 19.9845 12.0331 20.0119 " fill="#0099FF"></path>
                                <path d="M 18.0337 16.4889 C 18.0528 16.3667 18.1317 16.3202 18.2045 16.2897 C 19.0408 15.9392 19.8783 15.5903 20.8142 15.635 C 20.9933 15.6456 21.1696 15.6844 21.3366 15.7499 C 21.5077 15.814 21.5821 15.9214 21.5788 16.1138 C 21.5688 16.6433 21.4577 17.166 21.2515 17.6539 C 21.0398 18.1648 20.7229 18.6108 20.3898 19.0467 C 20.3729 19.0693 20.354 19.0903 20.3333 19.1095 C 20.296 19.1435 20.2499 19.1619 20.2045 19.1345 C 20.1593 19.1073 20.153 19.0601 20.1759 19.011 C 20.1959 18.9682 20.2171 18.9259 20.234 18.882 C 20.4522 18.3173 20.6475 17.7472 20.6953 17.1378 C 20.7028 17.1008 20.7075 17.0634 20.7098 17.0257 C 20.6787 16.5585 20.5718 16.4318 20.1219 16.3901 C 19.6981 16.3532 19.2716 16.3594 18.849 16.4087 C 18.5809 16.4381 18.3128 16.4616 18.0337 16.4889 Z" fill="#0099FF"></path>
                                <path d="M 10.8112 5.97367 C 9.49198 4.28487 7.74508 3.70328 5.67818 4.13919 C 3.56029 4.58574 1.35236 6.81112 2.17699 9.9471 C 2.71928 12.0085 4.63205 13.4386 6.90762 13.466 C 7.05029 13.4562 7.27697 13.4469 7.50229 13.4226 C 7.66133 13.4056 7.81872 13.3713 7.97557 13.3391 C 9.71649 12.9845 11.4994 11.3167 11.6781 9.17506 C 11.7763 7.99773 11.5441 6.91205 10.8112 5.97367 Z M 6.86234 11.9092 C 5.22864 11.9654 3.6773 10.56 3.67621 8.72225 C 3.67629 7.88138 4.0103 7.07496 4.60481 6.4803 C 5.19931 5.88563 6.00565 5.55141 6.84652 5.55112 C 8.6128 5.54867 10.0026 6.94751 10.0294 8.70778 C 10.0555 10.4411 8.57189 11.9547 6.86234 11.9092 Z" fill="#FF8500"></path>
                                <path d="M 20.6701 5.46145 C 19.4747 4.2631 18.0241 3.85666 16.3677 4.06343 C 14.2018 4.33376 11.5787 6.57087 12.4863 9.97846 C 13.1063 12.3026 15.5284 13.7843 17.9182 13.4202 C 20.0111 13.1015 22.043 11.1853 21.9991 8.67676 C 22.0094 7.4315 21.5627 6.35455 20.6701 5.46145 Z M 17.1602 11.9123 C 15.45 11.962 13.9661 10.4684 13.9798 8.72068 C 13.9934 6.96312 15.3917 5.55419 17.1531 5.55419 C 18.9145 5.55419 20.3281 6.95767 20.3291 8.71522 C 20.33 10.4995 18.9317 11.9101 17.1602 11.9123 Z" fill="#FF8500"></path>
                            </svg>

                            <div className="flex flex-col">
                                <div className="text-xl sm:text-2xl font-black tracking-tight text-[#222222] leading-none">
                                    makassar<span className="text-[#0099ff]">notebook</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#ff6000] tracking-tight mt-0.5">
                                    #SudahPastiMurahnya
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Search Bar with Autocomplete Dropdown */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                placeholder="senter kepala, kabel charger, holder hp, kursi lipat..."
                                className="h-10 w-full rounded-lg border border-[#cccccc] bg-[#f0f0f0] pr-10 pl-3.5 text-xs text-[#333333] placeholder-[#999999] focus:bg-white focus:border-[#0099ff] focus:outline-none transition-all shadow-inner"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-[#777777] hover:text-[#0099ff] transition-colors"
                            >
                                <Search className="size-4.5" />
                            </button>
                        </div>

                        {/* Autocomplete Dropdown */}
                        {isSearchFocused && (
                            <div className="absolute left-0 right-0 top-11 z-50 rounded-lg border border-[#e5e5e5] bg-white p-3 shadow-xl">
                                <div className="text-[11px] font-bold text-[#666666] mb-2">Paling Sering Dicari</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {POPULAR_SEARCH_KEYWORDS.map((kw, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setSearchKeyword(kw);
                                                router.get('/', { search: kw });
                                            }}
                                            className="rounded-full bg-[#f2f2f2] px-3 py-1 text-[11px] text-[#444444] hover:bg-[#e6f5ff] hover:text-[#0099ff] transition-colors cursor-pointer"
                                        >
                                            {kw}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Right: Cart & User Account */}
                    <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                        {/* Shopping Cart Button */}
                        <Link
                            href="/client?tab=cart"
                            className="flex items-center gap-2 text-[#333333] hover:text-[#ff6000] transition-colors cursor-pointer"
                        >
                            <div className="relative">
                                <ShoppingCart className="size-5 text-[#ff6000]" />
                                {sharedCartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 flex size-4.5 items-center justify-center rounded-full bg-[#ff0000] text-[10px] font-bold text-white shadow-xs">
                                        {sharedCartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden lg:inline text-xs font-medium">Keranjang Belanja</span>
                        </Link>

                        <span className="text-gray-300 hidden sm:inline">|</span>

                        {/* Akun Saya Dropdown / Login */}
                        <StoreAccountMenu />
                    </div>
                </div>
            </header>

            {/* ========================================================
                CATEGORY DRAWER / MEGA-MENU MODAL
                ======================================================== */}
            {isCategoryDrawerOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsCategoryDrawerOpen(false)}
                    />

                    {/* Drawer content */}
                    <div className="relative z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-6 py-4 bg-[#fafafa]">
                            <div className="flex items-center gap-2">
                                <Menu className="size-5 text-[#ff6000]" />
                                <span className="text-base font-bold text-[#222222]">Semua Kategori</span>
                            </div>
                            <button
                                onClick={() => setIsCategoryDrawerOpen(false)}
                                className="rounded p-1 text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Drawer Body: 2 Columns */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Left: Department List */}
                            <div className="w-1/2 border-r border-[#e5e5e5] overflow-y-auto bg-[#f9f9f9]">
                                {categories.map((cat, idx) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setActiveDepartment(idx)}
                                        className={`w-full text-left px-5 py-3 text-xs font-semibold flex items-center justify-between transition-colors border-l-3 ${
                                            activeDepartment === idx
                                                ? 'bg-white text-[#0099ff] border-[#0099ff]'
                                                : 'text-[#444444] border-transparent hover:bg-white/60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {cat.icon ? (
                                                <span className="text-base">{cat.icon}</span>
                                            ) : (
                                                <Package className="size-4 text-gray-400" />
                                            )}
                                            <span>{cat.name}</span>
                                        </div>
                                        <span className="text-gray-400 text-[10px]">&rsaquo;</span>
                                    </button>
                                ))}
                            </div>

                            {/* Right: Sub-categories list */}
                            <div className="w-1/2 p-6 overflow-y-auto bg-white">
                                {categories[activeDepartment] && (
                                    <div>
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                                            <h4 className="font-bold text-sm text-[#222222]">
                                                {categories[activeDepartment].name}
                                            </h4>
                                            <Link
                                                href={`/categories/${categories[activeDepartment].slug}`}
                                                onClick={() => setIsCategoryDrawerOpen(false)}
                                                className="text-[11px] font-bold text-[#0099ff] hover:underline"
                                            >
                                                Lihat Semua &rarr;
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2">
                                            {categories[activeDepartment].sub_categories &&
                                            categories[activeDepartment].sub_categories.length > 0 ? (
                                                categories[activeDepartment].sub_categories.map((sub) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={`/categories/${categories[activeDepartment].slug}?sub_category=${sub.slug}`}
                                                        onClick={() => setIsCategoryDrawerOpen(false)}
                                                        className="py-1.5 text-xs text-[#555555] hover:text-[#ff6000] hover:translate-x-1 transition-all flex items-center gap-1.5"
                                                    >
                                                        <span className="text-gray-300">&bull;</span>
                                                        <span>{sub.name}</span>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="text-xs text-gray-400 italic py-2">
                                                    Semua produk {categories[activeDepartment].name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                BRANCH SELECTOR MODAL
                ======================================================== */}
            {isBranchModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/60 transition-opacity"
                        onClick={() => setIsBranchModalOpen(false)}
                    />
                    <div className="relative z-50 w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
                            <div className="flex items-center gap-2">
                                <Store className="size-5 text-[#ff6000]" />
                                <h3 className="font-bold text-base text-[#222222]">
                                    Pilih Lokasi Cabang Toko MakassarNotebook
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsBranchModalOpen(false)}
                                className="rounded p-1 text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                            <div>
                                <div className="text-xs font-bold text-[#0099ff] uppercase tracking-wider mb-2">
                                    Cabang Kota Makassar (Pick N Go &amp; Kirim Instan)
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(['maricaya', 'panakkukang', 'pettarani', 'perintis'] as BranchKey[]).map((key) => {
                                        const b = BRANCH_OPTIONS[key];
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleSelectBranch(key)}
                                                className={`p-3 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                                                    selectedBranch === key
                                                        ? 'border-[#0099ff] bg-[#e6f5ff] text-[#0099ff] font-bold shadow-xs'
                                                        : 'border-[#e5e5e5] hover:border-gray-400 bg-white text-[#333333]'
                                                }`}
                                            >
                                                <div className="font-bold text-sm">{b.name}</div>
                                                <div className="text-[11px] text-[#666666] mt-1 line-clamp-2">
                                                    {b.address}
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-2">{b.hoursWeekday}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs font-bold text-[#ff6000] uppercase tracking-wider mb-2">
                                    Cabang Lain (Nasional)
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(['benhil', 'centralpark', 'kelapagading', 'tangerang', 'cikupa'] as BranchKey[]).map((key) => {
                                        const b = BRANCH_OPTIONS[key];
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleSelectBranch(key)}
                                                className={`p-3 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                                                    selectedBranch === key
                                                        ? 'border-[#ff6000] bg-[#fff3eb] text-[#ff6000] font-bold shadow-xs'
                                                        : 'border-[#e5e5e5] hover:border-gray-400 bg-white text-[#333333]'
                                                }`}
                                            >
                                                <div className="font-bold text-sm">{b.name}</div>
                                                <div className="text-[11px] text-[#666666] mt-1 line-clamp-2">
                                                    {b.address}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 border-t border-[#e5e5e5] pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsBranchModalOpen(false)}
                                className="rounded-lg bg-[#0099ff] px-4 py-2 text-xs font-bold text-white hover:bg-[#007acc] transition-colors cursor-pointer"
                            >
                                Konfirmasi Cabang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                MAIN CONTENT AREA
                ======================================================== */}
            <main>{children}</main>

            {/* ========================================================
                3. FOOTER (Pillars, Links, Deep Navy Contact Center, Partners)
                ======================================================== */}
            <footer className="border-t border-[#e5e5e5] bg-white pt-10 text-xs">
                {/* 4 Pillars MakassarNotebook */}
                <div className="mx-auto max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1620px] px-3 sm:px-4 2xl:px-6">
                    <div className="grid grid-cols-2 gap-4 border-b border-[#f0f0f0] pb-8 md:grid-cols-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#e6f5ff] text-[#0099ff]">
                                <Sparkles className="size-6" />
                            </div>
                            <div>
                                <div className="font-bold text-[#222222]">Harga Retail Termurah</div>
                                <div className="text-[11px] text-[#888888]">#SudahPastiMurahnya</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff3eb] text-[#ff6000]">
                                <Store className="size-6" />
                            </div>
                            <div>
                                <div className="font-bold text-[#222222]">Pick N Go di Toko</div>
                                <div className="text-[11px] text-[#888888]">Bebas Antre Kasir &amp; Ongkir</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#e6f5ff] text-[#0099ff]">
                                <ShieldCheck className="size-6" />
                            </div>
                            <div>
                                <div className="font-bold text-[#222222]">Garansi Resmi Toko</div>
                                <div className="text-[11px] text-[#888888]">Klaim Cepat &amp; Mudah</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff3eb] text-[#ff6000]">
                                <Truck className="size-6" />
                            </div>
                            <div>
                                <div className="font-bold text-[#222222]">Kirim Kurir Instan</div>
                                <div className="text-[11px] text-[#888888]">Pengantaran Hari Ini</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Main Links + Contact Center */}
                <div className="mx-auto max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1620px] px-3 sm:px-4 2xl:px-6 py-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Left Navigation Columns */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-xs">
                                <div>
                                    <h5 className="font-bold text-[#222222] mb-2.5">Belanja</h5>
                                    <ul className="space-y-2 text-[#666666]">
                                        <li><Link href="/" className="hover:text-[#0099ff]">Katalog Produk</Link></li>
                                        <li><Link href="/client?tab=orders" className="hover:text-[#0099ff]">Pick N Go Loker</Link></li>
                                        <li><Link href="/client?tab=cart" className="hover:text-[#0099ff]">Keranjang Belanja</Link></li>
                                        <li><a href="/#flash-sale" className="hover:text-[#0099ff]">Flash Sale Harian</a></li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="font-bold text-[#222222] mb-2.5">Bantuan</h5>
                                    <ul className="space-y-2 text-[#666666]">
                                        <li><a href="/#seo-info" className="hover:text-[#0099ff]">Cara Belanja Online</a></li>
                                        <li><a href="/#seo-info" className="hover:text-[#0099ff]">Alur Pick N Go</a></li>
                                        <li><a href="/#toko-kami" className="hover:text-[#0099ff]">Lokasi Toko Cabang</a></li>
                                        <li><Link href="/client?tab=profile" className="hover:text-[#0099ff]">Profil Akun Client</Link></li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="font-bold text-[#222222] mb-2.5">Informasi Perusahaan</h5>
                                    <ul className="space-y-2 text-[#666666]">
                                        <li><a href="#" className="hover:text-[#0099ff]">Tentang Kami</a></li>
                                        <li><a href="#toko-kami" className="hover:text-[#0099ff]">Kontak Kami</a></li>
                                        <li><a href="#" className="hover:text-[#0099ff]">Karir</a></li>
                                        <li><a href="#" className="hover:text-[#0099ff]">Kebijakan Privasi</a></li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="font-bold text-[#222222] mb-2.5">Ikuti Kami</h5>
                                    <ul className="space-y-2 text-[#666666]">
                                        <li>
                                            <a href="https://tiktok.com/@jakartanotebook" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0099ff]">
                                                <span>TikTok</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://instagram.com/jakartanotebook" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0099ff]">
                                                <span>Instagram</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://facebook.com/jakartanotebook" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0099ff]">
                                                <span>Facebook</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://twitter.com/jakartanotebook" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0099ff]">
                                                <span>X (Twitter)</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Newsletter Form */}
                            <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
                                <div className="text-[11px] font-bold text-[#333333]">
                                    Dapatkan <span className="text-[#ff6000]">penawaran menarik</span> kami! Dikirim mingguan
                                </div>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        alert('Terima kasih telah berlangganan newsletter MakassarNotebook!');
                                    }}
                                    className="mt-2 flex max-w-md gap-2"
                                >
                                    <input
                                        type="email"
                                        required
                                        placeholder="Masukkan alamat email Anda"
                                        className="h-8.5 flex-1 rounded-lg border border-[#cccccc] px-3 text-xs placeholder-gray-400 focus:border-[#0099ff] focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="h-8.5 rounded-lg bg-[#0099ff] px-4 text-xs font-bold text-white hover:bg-[#007acc] transition-colors cursor-pointer"
                                    >
                                        Mulai Berlangganan
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Contact Center Box (Deep Navy Header #166397) */}
                        <div id="toko-kami" className="lg:col-span-4 rounded-xl border border-[#166397]/40 bg-white overflow-hidden shadow-xs">
                            <div className="bg-[#166397] p-3.5 text-white font-bold text-sm flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Store className="size-4 text-[#FF6000]" />
                                    <span>Contact Center</span>
                                </div>
                                <span className="text-[10px] font-normal text-white/80">#SudahPastiMurahnya</span>
                            </div>

                            <div className="p-4 space-y-4 text-[11px]">
                                {/* Online Contact */}
                                <div>
                                    <div className="font-bold text-[#222222]">Pembelian Online</div>
                                    <div className="text-[#666666] mt-0.5">Telp : (0411) 39 700 200</div>
                                    <div className="text-[#666666]">
                                        Customer Service (WA) : <strong className="text-[#0099ff]">0899 721 7050</strong>
                                    </div>
                                </div>

                                {/* Offline Store Information */}
                                <div className="border-t border-[#f0f0f0] pt-3">
                                    <div className="flex items-center justify-between font-bold text-[#222222]">
                                        <span>Toko Kami</span>
                                        <button
                                            type="button"
                                            onClick={() => setIsBranchModalOpen(true)}
                                            className="text-[#0099ff] text-[10px] cursor-pointer hover:underline"
                                        >
                                            Ganti
                                        </button>
                                    </div>

                                    <div className="mt-1 font-semibold text-[#0099ff]">
                                        {currentBranch.region}
                                    </div>

                                    {/* Dropdown Branch Selection */}
                                    <select
                                        value={selectedBranch}
                                        onChange={(e) => handleSelectBranch(e.target.value as BranchKey)}
                                        className="mt-1.5 w-full rounded-lg border border-[#cccccc] bg-[#fafafa] p-2 text-xs text-[#333333] focus:border-[#0099ff] focus:outline-none transition-colors cursor-pointer"
                                    >
                                        {branchKeys.map((key) => (
                                            <option key={key} value={key}>
                                                {BRANCH_OPTIONS[key].label}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Active Branch Full Address */}
                                    <div className="mt-2.5 text-[#666666] leading-relaxed">
                                        <div className="font-bold text-[#222222]">{currentBranch.name}</div>
                                        <div className="mt-0.5">{currentBranch.address}</div>
                                        <a
                                            href={currentBranch.mapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-[#0099ff] font-semibold mt-1 hover:underline"
                                        >
                                            <MapPin className="size-3" /> Lihat google maps
                                        </a>
                                    </div>

                                    {/* Contact Sales / COD */}
                                    <div className="mt-2.5 text-[#666666]">
                                        <div>Telp : {currentBranch.phone}</div>
                                        <div>
                                            Whatsapp Sales / COD : <strong className="text-[#0099ff]">{currentBranch.waSales}</strong>
                                        </div>
                                    </div>

                                    {/* Store Operating Hours */}
                                    <div className="mt-2.5 text-[#666666] space-y-0.5">
                                        <div className="font-semibold text-[#333333]">Jam Buka:</div>
                                        <div>{currentBranch.hoursWeekday}</div>
                                        <div>{currentBranch.hoursWeekend}</div>
                                        <div className="text-[#d32f2f] text-[10px] font-medium">*Tutup pada Hari Raya Idul Fitri</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment & Logistics Partners */}
                <div className="bg-[#f9f9f9] border-t border-[#e5e5e5] px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#888888] gap-4">
                    <div>
                        Copyright &copy; 2026 MakassarNotebook.com. All rights reserved | <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-[#555555]">Metode Pembayaran:</span>
                        <div className="flex items-center gap-1.5 font-black text-xs text-[#005580]">
                            <span className="rounded bg-white px-2 py-0.5 border border-[#ddd]">BCA</span>
                            <span className="rounded bg-white px-2 py-0.5 border border-[#ddd]">MANDIRI</span>
                            <span className="rounded bg-white px-2 py-0.5 border border-[#ddd]">BNI</span>
                            <span className="rounded bg-white px-2 py-0.5 border border-[#ddd]">BRI</span>
                            <span className="rounded bg-white px-2 py-0.5 border border-[#ddd] text-[#d32f2f]">QRIS</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Help Button */}
            <aside className="fixed bottom-4 right-4 z-40">
                <a
                    href="https://wa.me/628997217050"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full bg-[#0099ff] px-4 py-2.5 text-xs font-bold text-white shadow-xl hover:bg-[#007acc] transition-all hover:scale-105"
                >
                    <MessageCircle className="size-4 fill-current" />
                    <span>Butuh bantuan? Hubungi kami</span>
                </a>
            </aside>
        </div>
    );
}
