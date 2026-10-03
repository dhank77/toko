import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    HeartHandshake,
    HelpCircle,
    Info,
    Laptop,
    MapPin,
    Menu,
    MessageCircle,
    Package,
    Phone,
    Play,
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
import { useEffect, useRef, useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';

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

export interface ProductItem {
    id: number | string;
    name: string;
    slug: string;
    sku?: string | null;
    brand?: string | null;
    color?: string | null;
    price: number;
    original_price?: number | null;
    discount_percent?: number | null;
    stock?: number;
    thumbnail?: string | null;
    images?: string[] | null;
    category_id?: number | null;
    sub_category_id?: number | null;
    category?: { id: number; name: string; slug: string; icon?: string | null } | null;
    sub_category?: { id: number; name: string; slug: string } | null;
    rating?: number | null;
    review_count?: number | null;
    is_featured?: boolean;
    // Fallback fields for legacy compatibility
    title?: string;
    badge?: string;
    variant?: string;
    img?: string;
    originalPrice?: number;
    discount?: number;
}

const STATIC_DEPARTMENTS = [
    { name: 'Komputer & Laptop', items: ['Keyboard', 'Mouse', 'Cooling Pad', 'Stand Laptop', 'Webcam', 'USB Hub & Converter', 'Kabel HDMI & DP', 'SSD & Enclosure'] },
    { name: 'Handphone & Tablet', items: ['Kabel Charger & Data', 'Holder HP Mobil & Motor', 'Fast Charger GaN', 'Power Bank', 'Screen Protector'] },
    { name: 'TV & Elektronik', items: ['Bracket TV LED & Monitor', 'Antena Digital DVB-T2', 'Remote TV Universal', 'Android TV Box'] },
    { name: 'Outdoor & Olahraga', items: ['Kursi Lipat Camping', 'Tenda Camping', 'Kompor Gas Portable', 'Senter Tactical LED'] },
    { name: 'Rumah Tangga & Dapur', items: ['Timbangan Dapur Digital', 'Dispenser Sabun Otomatis', 'Lampu Meja LED'] },
    { name: 'Otomotif & Motor', items: ['Holder HP Motor Waterproof', 'Pompa Ban Elektrik Portable', 'Lap Microfiber Mobil'] },
    { name: 'Hobi & Mainan', items: ['Rubik Carbon Fiber', 'Drone Camera 4K', 'Piano Mainan Anak'] },
    { name: 'Kesehatan & Personal Care', items: ['Oximeter Saturasi Oksigen', 'Nebulizer Portable', 'Kacamata Baca Anti Radiasi'] },
];

export default function Welcome({
    categories = [],
    products = [],
    flashSaleProducts = [],
    selectedCategory = 'all',
}: {
    categories?: CategoryItem[];
    products?: ProductItem[];
    flashSaleProducts?: ProductItem[];
    selectedCategory?: string;
}) {
    const { auth } = usePage().props;

    // --- Branch state & data ---
    type BranchKey = 'maricaya' | 'panakkukang' | 'pettarani' | 'perintis' | 'benhil' | 'centralpark' | 'kelapagading' | 'tangerang' | 'cikupa';

    interface BranchInfo {
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

    const branchOptions: Record<BranchKey, BranchInfo> = {
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

    const branchKeys = Object.keys(branchOptions) as BranchKey[];
    const [selectedBranch, setSelectedBranch] = useState<BranchKey>('maricaya');
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
    const [tickerIndex, setTickerIndex] = useState(0);

    const currentBranch = branchOptions[selectedBranch];

    // Auto rotate the top ticker bar
    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % branchKeys.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [branchKeys.length]);

    const activeTickerBranch = branchOptions[branchKeys[tickerIndex]];

    // --- Cart state & Toast ---
    const [cartCount, setCartCount] = useState<number>(0);
    const [cartToast, setCartToast] = useState<string | null>(null);

    const handleAddToCart = (productName: string) => {
        setCartCount((prev) => prev + 1);
        setCartToast(`"${productName}" berhasil ditambahkan ke keranjang!`);
        setTimeout(() => setCartToast(null), 3000);
    };

    // --- Search input & dropdown ---
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const popularSearchKeywords = [
        'senter kepala',
        'teko camping',
        'stand laptop',
        'cooling pad',
        'kursi lipat camping',
        'kabel fast charging',
        'holder hp motor',
        'handuk quick dry',
        'timbangan digital',
    ];

    // --- Flash sale countdown timer ---
    const [timer, setTimer] = useState({ hours: 2, minutes: 27, seconds: 43 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // --- Hero Banner Carousel ---
    const heroSlides = [
        {
            id: 1,
            title: 'Koleksi Tangga Lipat Aluminium',
            subtitle: 'Kuat, Ringan & Fleksibel untuk Rumah & Proyek',
            priceTag: 'Mulai Dari 180RB-an',
            image: 'https://www.jakartanotebook.com/images/banners/2026/09/Tangga_Lipat_(1).jpg',
            link: '#',
            bgColor: '#8c3520',
        },
        {
            id: 2,
            title: 'Aksesoris Telesin Action Camera',
            subtitle: 'Mount, Battery & Grip Lengkap GoPro & Insta360',
            priceTag: 'Diskon Hingga 50%',
            image: 'https://www.jakartanotebook.com/images/banners/2026/09/Telesin_(1).jpg',
            link: '#',
            bgColor: '#166397',
        },
        {
            id: 3,
            title: 'Mobile TV Stand & Bracket Roda',
            subtitle: 'Ideal untuk Presentasi Kantor & Home Cinema',
            priceTag: 'Harga Termurah se-Indonesia',
            image: 'https://www.jakartanotebook.com/images/banners/2026/09/TV_Stand.jpg',
            link: '#',
            bgColor: '#1a365d',
        },
        {
            id: 4,
            title: 'Kebutuhan Anabul Kesayangan',
            subtitle: 'Tempat Minum Otomatis, Sisir & Mainan Hewan',
            priceTag: 'Mulai 15RB-an',
            image: 'https://www.jakartanotebook.com/images/banners/2026/09/Anabul.jpg',
            link: '#',
            bgColor: '#7b341e',
        },
        {
            id: 5,
            title: 'Handuk Dry Quick Microfiber',
            subtitle: 'Daya Serap Tinggi, Cepat Kering & Lembut',
            priceTag: 'Spesial Promo 25RB-an',
            image: 'https://www.jakartanotebook.com/images/banners/2026/09/Handuk_Dry_Quick.jpg',
            link: '#',
            bgColor: '#2c5282',
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    // --- Video Shopping Modal Player ---
    interface VideoItem {
        id: string;
        title: string;
        category: string;
        thumbnailUrl: string;
        videoUrl: string;
    }

    const videoReels: VideoItem[] = [
        {
            id: 'jy3gZy',
            title: 'Smart Tag Bluetooth Anti Hilang Tracker',
            category: 'Smart Gadget',
            thumbnailUrl: 'https://video-shopping.jaknot.com/2026/09/jy3gZy/jy3gZy-1.png',
            videoUrl: 'https://video-shopping.jaknot.com/2026/09/jy3gZy/jy3gZy-1.mp4',
        },
        {
            id: 'AnjlVy',
            title: 'Gembok Koper TSA Angka Kombinasi',
            category: 'Travel & Security',
            thumbnailUrl: 'https://video-shopping.jaknot.com/2026/09/AnjlVy/AnjlVy-1.png',
            videoUrl: 'https://video-shopping.jaknot.com/2026/09/AnjlVy/AnjlVy-1.mp4',
        },
        {
            id: 'znOJoq',
            title: 'Kabel Charger 3 in 1 Fast Charge 66W',
            category: 'Kabel Charger',
            thumbnailUrl: 'https://video-shopping.jaknot.com/2026/09/znOJoq/znOJoq-1.png',
            videoUrl: 'https://video-shopping.jaknot.com/2026/09/znOJoq/znOJoq-1.mp4',
        },
        {
            id: 'AkMPAn',
            title: 'Lakban Aluminium Anti Bocor Tahan Panas',
            category: 'Perkakas Rumah',
            thumbnailUrl: 'https://video-shopping.jaknot.com/2026/09/AkMPAn/AkMPAn-1.png',
            videoUrl: 'https://video-shopping.jaknot.com/2026/09/AkMPAn/AkMPAn-1.mp4',
        },
        {
            id: '4yWO1y',
            title: 'Keyboard Wireless Touchpad Portable',
            category: 'Aksesoris Komputer',
            thumbnailUrl: 'https://video-shopping.jaknot.com/2026/09/4yWO1y/4yWO1y-1.png',
            videoUrl: 'https://video-shopping.jaknot.com/2026/09/4yWO1y/4yWO1y-1.mp4',
        },
        {
            id: 'ak7KYk',
            title: 'Lampu Proyektor Astronaut Nebula Aurora',
            category: 'Lampu Hias & Kamar',
            thumbnailUrl: 'https://video-shopping.jaknot.com/2026/09/ak7KYk/ak7KYk-1.png',
            videoUrl: 'https://video-shopping.jaknot.com/2026/09/ak7KYk/ak7KYk-1.mp4',
        },
    ];

    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

    // --- Maknot Value icons (referensi) ---
    const maknotValues = [
        { label: 'Waktunya Jajan 🎉', img: 'https://assets.jaknot.com/jaknot_value/2026/09/OZm0xG-3.png' },
        { label: 'Just Arrived', img: 'https://assets.jaknot.com/jaknot_value/2026/09/OG5JZe-2.png' },
        { label: 'Gear wajib rider 🚨', img: 'https://assets.jaknot.com/jaknot_value/2026/09/WGvdX7-1.png' },
        { label: 'Inspirasi hari ini ⭐', img: 'https://assets.jaknot.com/jaknot_value/2026/07/wGwg5G-2.png' },
        { label: 'Toko Cabang', img: 'https://assets.jaknot.com/jaknot_value/2026/09/1GzEN3-3.png' },
        { label: 'Beli sekalian 👀', img: 'https://assets.jaknot.com/jaknot_value/2026/07/vNWagZ-3.png' },
        { label: 'Ada barang keren..', img: 'https://assets.jaknot.com/jaknot_value/2026/09/VZLkbG-1.png' },
        { label: 'Coming Soon', img: 'https://assets.jaknot.com/jaknot_value/2026/09/97KO7J-2.png' },
        { label: 'Menarik Nih 👀', img: 'https://assets.jaknot.com/jaknot_value/2026/09/v7VkAN-2.png' },
        { label: 'Whats New', img: 'https://assets.jaknot.com/jaknot_value/2026/09/3ZedGJ-2.png' },
        { label: 'Mungkin butuh..', img: 'https://assets.jaknot.com/jaknot_value/2026/07/1NyEzN-7.png' },
        { label: '🚨 Buat di Mobil', img: 'https://assets.jaknot.com/jaknot_value/2026/08/xGq4KN-1.png' },
        { label: 'Semua Praktis 🤩', img: 'https://assets.jaknot.com/jaknot_value/2026/08/mG38JZ-1.png' },
    ];

    const valueScrollRef = useRef<HTMLDivElement>(null);

    const scrollValues = (direction: 'left' | 'right') => {
        if (valueScrollRef.current) {
            const amount = direction === 'left' ? -260 : 260;
            valueScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    // --- Fallback Flash Sale products (data referensi jika DB belum ada flash sale) ---
    const fallbackFlashSaleProducts = [
        {
            id: 'takara-mobil',
            title: 'Takara Mainan Mobil Robot Transformers 2in1 Deformation Toy',
            badge: 'MAINAN ROBOT',
            price: 32800,
            originalPrice: 59900,
            discount: 46,
            img: 'https://upload.jaknot.com/2024/07/images/products/d4cf2b/thumbnail/takara-mainan-mobil-robot-transformers-2in1-deformation-toy-tk21.png',
        },
        {
            id: 'maygiv-piano',
            title: 'Maygiv Piano Digital Elektrik Mainan Anak 61-Key with Microphone',
            badge: 'PIANO DIGITAL',
            price: 120300,
            originalPrice: 187900,
            discount: 36,
            img: 'https://upload.jaknot.com/2026/07/images/products/2d6d09/thumbnail/maygiv-piano-digital-elektrik-mainan-anak-61-key-with-microphone-mq-6185.jpg',
        },
        {
            id: 'fma-rubik',
            title: 'FMA Mainan Kubus Rubik Carbon Fiber Magic Cube 3x3x3',
            badge: 'RUBIK 3X3',
            price: 14200,
            originalPrice: 30900,
            discount: 55,
            img: 'https://upload.jaknot.com/2025/05/images/products/44265d/thumbnail/fma-mainan-kubus-rubik-carbon-fiber-magic-cube-3x3x3-fmm3.jpg',
        },
        {
            id: 'sivery-drone',
            title: 'Sivery Drone 4K Dual Camera Stunt Roll Optical Flow Hovering',
            badge: 'DRONE 4K',
            price: 229900,
            originalPrice: 380900,
            discount: 40,
            img: 'https://upload.jaknot.com/2026/01/images/products/5b529a/thumbnail/sivery-drone-4k-dual-camera-stunt-roll-optical-flow-hovering-1800mah-h16.jpg',
        },
        {
            id: 'bubblo-pelampung',
            title: 'Bubblo Ban Pelampung Renang Dewasa Inflatable Watermelon 90cm',
            badge: 'PELAMPUNG',
            price: 23800,
            originalPrice: 46900,
            discount: 50,
            img: 'https://upload.jaknot.com/2026/04/images/products/a86925/thumbnail/bubblo-ban-pelampung-renang-dewasa-inflatable-swimming-ring-pvc-90-cm-v06.png',
        },
        {
            id: 'razus-camera',
            title: 'Razus Mainan Balok Susun Vintage Retro Camera Polaroid Bricks',
            badge: 'BRICKS RETRO',
            price: 68400,
            originalPrice: 111900,
            discount: 39,
            img: 'https://upload.jaknot.com/2026/07/images/products/d145cf/thumbnail/razus-mainan-balok-susun-vintage-retro-camera-polaroid-bricks-blok-my97131.jpg',
        },
        {
            id: 'heb-display-box',
            title: 'HEB Display Box Action Figure Case Kotak Pajangan Blindbox',
            badge: 'DISPLAY BOX',
            price: 39100,
            originalPrice: 68900,
            discount: 44,
            img: 'https://upload.jaknot.com/2026/06/images/products/7a1a64/thumbnail/0.jpg',
        },
        {
            id: 'tosie-parrot',
            title: 'Tosie Boneka Burung Beo Pintar Talking Parrot Repeat Voice',
            badge: 'TALKING PARROT',
            price: 66400,
            originalPrice: 108900,
            discount: 40,
            img: 'https://upload.jaknot.com/2026/07/images/products/2e127e/thumbnail/tosie-boneka-burung-beo-pintar-talking-parrot-plush-repeat-voice-n500.png',
        },
    ];

    const activeFlashSaleProducts = flashSaleProducts.length > 0 ? flashSaleProducts : fallbackFlashSaleProducts;

    // --- Popular Categories (data referensi) ---
    const popularCategories = [
        { name: 'Kursi Camping', img: 'https://assets.jaknot.com/popular_category/2026/09/KZ8Ed7-1.png' },
        { name: 'Soft Flask', img: 'https://assets.jaknot.com/popular_category/2026/03/OZmgxN-1.jpg' },
        { name: 'Tenda Camping', img: 'https://assets.jaknot.com/popular_category/2026/03/1Z15OZ-1.jpg' },
        { name: 'Kompor Portable', img: 'https://assets.jaknot.com/popular_category/2026/09/wZRVxZ-1.png' },
        { name: 'Kacamata Olahraga', img: 'https://assets.jaknot.com/popular_category/2026/07/gGOwWG-1.png' },
        { name: 'Masker Motor', img: 'https://assets.jaknot.com/popular_category/2026/01/1Nyxz7-1.jpg' },
        { name: 'Gunting Kuku', img: 'https://assets.jaknot.com/popular_category/2026/09/pGn5qN-1.png' },
        { name: 'Karabiner', img: 'https://assets.jaknot.com/popular_category/2025/11/4N4XPN-1.jpg' },
        { name: 'Lampu Meja', img: 'https://assets.jaknot.com/popular_category/2026/09/lGArYZ-1.png' },
        { name: 'Koleksi Mouse', img: 'https://assets.jaknot.com/popular_category/2026/09/pGaVqZ-1.png' },
        { name: 'Solder & Aksesoris', img: 'https://assets.jaknot.com/popular_category/2026/07/5GzJ93-1.png' },
        { name: 'Lampu Tidur', img: 'https://assets.jaknot.com/popular_category/2026/09/XZrEgN-1.png' },
        { name: 'Kacamata Baca', img: 'https://assets.jaknot.com/popular_category/2026/04/lZyV1Z-1.jpg' },
        { name: 'Timbangan Digital', img: 'https://assets.jaknot.com/popular_category/2026/08/m3v0MN-1.png' },
        { name: 'Tas Pinggang', img: 'https://assets.jaknot.com/popular_category/2026/05/o37y23-1.jpg' },
        { name: 'Tripod HP', img: 'https://assets.jaknot.com/popular_category/2026/08/J3a5zZ-1.png' },
        { name: 'Botol Minum', img: 'https://assets.jaknot.com/popular_category/2026/08/o3aWYN-1.png' },
    ];

    const categoryScrollRef = useRef<HTMLDivElement>(null);
    const scrollCategories = (dir: 'left' | 'right') => {
        if (categoryScrollRef.current) {
            categoryScrollRef.current.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
        }
    };

    // --- Lagi Banyak Dicari (data referensi dari design/jakartanotebook.html) ---
    const mostSearchItems = [
        {
            title: 'Teko Camping',
            count: '703 Produk',
            img: 'https://upload.jaknot.com/2026/07/images/products/deec3d/icon/0.jpg',
        },
        {
            title: 'Stand Laptop',
            count: '645 Produk',
            img: 'https://upload.jaknot.com/2022/10/images/products/e22c0d/icon/aqqef-meja-laptop-desk-monitor-stand-with-usb-30-and-charging-port-aqms5.jpg',
        },
        {
            title: 'Kursi Lipat Camping Outdoor',
            count: '1.447 Produk',
            img: 'https://upload.jaknot.com/2025/09/images/products/214dc9/icon/patio-kursi-lipat-outdoor-camping-portable-oxford-600d-folding-chair-pt144.jpg',
        },
        {
            title: 'Senter',
            count: '341 Produk',
            img: 'https://upload.jaknot.com/2026/06/images/products/488f77/icon/nitecore-senter-led-nitelab-uhi-40-tactical-ip68-3300-lumens-mh12-pro.png',
        },
        {
            title: 'Alat Bantu Tongkat Jalan',
            count: '1.470 Produk',
            img: 'https://upload.jaknot.com/2026/08/images/products/0882e9/icon/0.jpg',
        },
        {
            title: 'Sepeda',
            count: '748 Produk',
            img: 'https://upload.jaknot.com/2024/07/images/products/90b2f8/icon/takezero-tas-sepeda-smartphone-holder-earphone-hole-waterproof-tz47.jpg',
        },
        {
            title: 'Sarung Tangan',
            count: '514 Produk',
            img: 'https://upload.jaknot.com/2026/04/images/products/33219f/icon/qitu-sarung-tangan-latex-cuci-piring-cleaning-gloves-extra-thick-a303.png',
        },
        {
            title: 'Camping Hiking',
            count: '432 Produk',
            img: 'https://upload.jaknot.com/2022/12/images/products/36bd52/icon/lumiparty-kompas-mini-professional-scale-outdoor-hiking-xc-mn0010.jpg',
        },
        {
            title: 'Speaker',
            count: '190 Produk',
            img: 'https://upload.jaknot.com/2026/08/images/products/a32ff1/icon/apir-tripod-stand-speaker-audio-system-97-200cm-all-metal-sps-510m.jpg',
        },
        {
            title: 'Cooling Pad',
            count: '334 Produk',
            img: 'https://upload.jaknot.com/2022/11/images/products/24a38c/icon/segb-notebook-cooling-pad-laptop-ultra-thin-cooler-6-fan-s6.jpg',
        },
    ];

    const getProductImage = (src?: string | null) => {
        if (!src) {
            return 'https://placehold.co/400x400/f5f5f5/999999?text=No+Image';
        }
        if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) {
            return src;
        }
        return `/storage/${src}`;
    };

    // --- Rekomendasi Untukmu Filtering (Database Products + Dynamic Tabs) ---
    const [activeCategoryTab, setActiveCategoryTab] = useState<string>(selectedCategory || 'all');

    useEffect(() => {
        setActiveCategoryTab(selectedCategory || 'all');
    }, [selectedCategory]);

    const handleSelectCategory = (catSlugOrId: string) => {
        setActiveCategoryTab(catSlugOrId);
        router.get(
            '/',
            catSlugOrId === 'all' ? {} : { category: catSlugOrId },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const filteredRecommendations = activeCategoryTab === 'all'
        ? products
        : products.filter((p) => {
            const pCatId = p.category_id ? String(p.category_id) : '';
            const pCatSlug = p.category?.slug ?? '';
            const pCatName = p.category?.name?.toLowerCase() ?? '';
            const target = activeCategoryTab.toLowerCase();

            return pCatId === activeCategoryTab || pCatSlug.toLowerCase() === target || pCatName.includes(target);
        });


    // --- Info Menarik Maknot Articles ---
    const articles = [
        {
            title: '7 Rekomendasi Pompa Ban Manual Terbaik dan Praktis Dibawa Touring',
            desc: 'Berikut adalah rekomendasi pompa ban manual terbaik dengan berbagai fitur yang praktis dibawa bepergian.',
            time: '5 menit baca',
            img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: '13 Rekomendasi Nebulizer Portable Praktis Terbaik 2026 untuk Keluarga',
            desc: 'Butuh nebulizer portable yang cepat dan praktis untuk perjalanan atau penggunaan keluarga di rumah.',
            time: '4 menit baca',
            img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: '8 Lampu Sepeda Depan Belakang, Super Terang dan Mudah Dipasang!',
            desc: 'Temukan pilihan lampu sepeda depan belakang terbaik yang terang dan mudah dipasang di berbagai tipe setang.',
            time: '6 menit baca',
            img: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: '6 Kantong Air Lipat Multifungsi Food Grade untuk Kegiatan Outdoor',
            desc: 'Kantong air lipat multifungsi memiliki banyak fitur mulai dari berbagai ukuran kapasitas hingga bahan BPA-free.',
            time: '3 menit baca',
            img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: '8 Masker N95 Terbaik untuk Melindungi Diri dari Polusi Jalanan Kota',
            desc: 'Temukan pilihan masker N95 terbaik dengan fungsi filtrasi maksimal dan bahan yang nyaman dipakai harian.',
            time: '5 menit baca',
            img: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=400&q=80',
        },
    ];

    // --- Category Mega-Menu Departments (dynamic from DB, fallback to static) ---
    const departments = categories.length > 0
        ? categories.map(cat => ({
            name: `${cat.icon ?? ''} ${cat.name}`.trim(),
            items: cat.sub_categories.map(sub => sub.name),
          }))
        : STATIC_DEPARTMENTS;

    const [activeDepartment, setActiveDepartment] = useState(0);

    return (
        <>
            <Head>
                <title>MakassarNotebook : Toko Online Lengkap &amp; Unik Harga Murah</title>
                <meta name="description" content="Belanja murah, mudah, aman, bergaransi, tersedia pembelian secara online, toko offline, dan COD." />
                <link rel="icon" href="/images/logo-top.png" />
            </Head>

            <div className="min-h-screen bg-[#f7f7f7] font-sans text-xs text-[#333333] antialiased">
                {/* --- TOAST NOTIFICATION --- */}
                {cartToast && (
                    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-[#222222] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in border border-[#0099ff]">
                        <ShoppingCart className="size-4 text-[#0099ff]" />
                        <span>{cartToast}</span>
                    </div>
                )}

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
                                        setSelectedBranch(activeTickerBranch.id);
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
                            <a href="#toko-kami" className="hover:text-[#0099ff] transition-colors">Service Center</a>
                            <a href="#seo-info" className="hover:text-[#0099ff] transition-colors">How to buy</a>
                            <a href="#seo-info" className="hover:text-[#0099ff] transition-colors">Order Tracking</a>
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
                                {/* SVG Brand Icon MakassarNotebook (diadaptasi dari desain referensi) */}
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
                        <div className="relative flex-1 max-w-2xl">
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
                                    type="button"
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
                                        {popularSearchKeywords.map((kw, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setSearchKeyword(kw)}
                                                className="rounded-full bg-[#f2f2f2] px-3 py-1 text-[11px] text-[#444444] hover:bg-[#e6f5ff] hover:text-[#0099ff] transition-colors cursor-pointer"
                                            >
                                                {kw}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Cart & User Account */}
                        <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                            {/* Shopping Cart Button */}
                            <button
                                type="button"
                                onClick={() => handleAddToCart('Keranjang Belanja')}
                                className="flex items-center gap-2 text-[#333333] hover:text-[#ff6000] transition-colors cursor-pointer"
                            >
                                <div className="relative">
                                    <ShoppingCart className="size-5 text-[#ff6000]" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2 flex size-4.5 items-center justify-center rounded-full bg-[#ff0000] text-[10px] font-bold text-white shadow-xs">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden lg:inline text-xs font-medium">My Cart</span>
                            </button>

                            <span className="text-gray-300 hidden sm:inline">|</span>

                            {/* Auth Status */}
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="flex items-center gap-1.5 rounded-lg bg-[#0099ff] px-4 py-2 text-xs font-bold text-white hover:bg-[#007acc] transition-colors"
                                >
                                    <User className="size-3.5" />
                                    <span>Akun Saya</span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={login()}
                                        className="flex items-center gap-1.5 text-[#333333] hover:text-[#0099ff] font-medium transition-colors"
                                    >
                                        <User className="size-4 text-[#777777]" />
                                        <span>Masuk / Daftar</span>
                                    </Link>
                                </div>
                            )}
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

                            {/* Split Layout: Department Sidebar + Subcategories */}
                            <div className="grid grid-cols-12 flex-1 overflow-hidden">
                                {/* Left Departments */}
                                <div className="col-span-5 border-r border-[#e5e5e5] bg-[#fafafa] overflow-y-auto">
                                    {departments.map((dept, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setActiveDepartment(index)}
                                            className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition-colors border-l-4 ${
                                                activeDepartment === index
                                                    ? 'bg-white text-[#0099ff] border-[#0099ff]'
                                                    : 'text-[#444444] border-transparent hover:bg-white/60'
                                            }`}
                                        >
                                            <span>{dept.name}</span>
                                            <ChevronRight className="size-3.5 text-gray-400" />
                                        </button>
                                    ))}
                                </div>

                                {/* Right Subcategories Grid */}
                                <div className="col-span-7 p-6 overflow-y-auto bg-white">
                                    <div className="text-sm font-bold text-[#222222] mb-4 pb-2 border-b border-[#f0f0f0]">
                                        {departments[activeDepartment].name}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {departments[activeDepartment].items.map((sub, sIdx) => (
                                            <button
                                                key={sIdx}
                                                type="button"
                                                onClick={() => {
                                                    setSearchKeyword(sub);
                                                    setIsCategoryDrawerOpen(false);
                                                }}
                                                className="text-left text-xs text-[#555555] hover:text-[#0099ff] hover:underline p-1.5 rounded transition-colors"
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
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
                            className="fixed inset-0 bg-black/50"
                            onClick={() => setIsBranchModalOpen(false)}
                        />
                        <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Store className="size-5 text-[#0099ff]" />
                                    <h3 className="text-base font-bold text-[#222222]">Pilih Lokasi &amp; Toko Cabang</h3>
                                </div>
                                <button
                                    onClick={() => setIsBranchModalOpen(false)}
                                    className="rounded p-1 text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <p className="text-xs text-[#666666] mb-4">
                                Pilih cabang toko offline untuk melihat ketersediaan stok fisik secara real-time dan opsi layanan <strong>Pick N Go (Ambil di Toko)</strong>.
                            </p>

                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                {branchKeys.map((key) => {
                                    const b = branchOptions[key];
                                    const isSelected = selectedBranch === key;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => {
                                                setSelectedBranch(key);
                                                setIsBranchModalOpen(false);
                                            }}
                                            className={`cursor-pointer rounded-lg border p-3 transition-all ${
                                                isSelected
                                                    ? 'border-[#0099ff] bg-[#e6f5ff]'
                                                    : 'border-[#e5e5e5] hover:border-[#0099ff] hover:bg-[#fafafa]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-[#222222]">{b.name}</div>
                                                <span className="rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#0099ff] border border-[#0099ff]/30">
                                                    {b.region}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#666666] mt-1">{b.address}</div>
                                            <div className="text-[10px] text-[#888888] mt-1 flex items-center gap-2">
                                                <Clock className="size-3 text-gray-400" />
                                                <span>{b.hoursWeekday}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================
                    VIDEO SHOPPING PLAYER MODAL
                    ======================================================== */}
                {activeVideo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/80"
                            onClick={() => setActiveVideo(null)}
                        />
                        <div className="relative z-50 w-full max-w-sm rounded-2xl bg-black overflow-hidden shadow-2xl flex flex-col">
                            {/* Close button */}
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                            >
                                <X className="size-4" />
                            </button>

                            {/* Video Player */}
                            <div className="relative aspect-9/16 w-full bg-black">
                                <video
                                    src={activeVideo.videoUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            {/* Video Title & Buy Button */}
                            <div className="bg-[#111111] p-4 text-white">
                                <div className="text-[10px] text-[#ffd166] uppercase font-bold tracking-wider">
                                    {activeVideo.category}
                                </div>
                                <div className="text-sm font-semibold line-clamp-1 mt-0.5">
                                    {activeVideo.title}
                                </div>
                                <button
                                    onClick={() => {
                                        handleAddToCart(activeVideo.title);
                                        setActiveVideo(null);
                                    }}
                                    className="mt-3 w-full rounded-lg bg-[#0099ff] py-2.5 text-xs font-bold text-white hover:bg-[#007acc] transition-colors"
                                >
                                    Beli Produk Ini Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================
                    PAGE MAIN CONTAINER
                    ======================================================== */}
                <main className="mx-auto max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1620px] px-3 sm:px-4 2xl:px-6 pt-3">
                    {/* ========================================================
                        3. HERO BANNER BENTO SECTION (Maknot Layout)
                        ======================================================== */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                        {/* Left Carousel Slider (8 columns) */}
                        <div className="relative overflow-hidden rounded-lg md:col-span-8 h-[290px] xl:h-[350px] 2xl:h-[400px] shadow-xs group bg-[#e5e5e5]">
                            {heroSlides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                            ))}

                            {/* Prev / Next Arrows */}
                            <button
                                type="button"
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors cursor-pointer"
                                aria-label="Slide sebelumnya"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors cursor-pointer"
                                aria-label="Slide berikutnya"
                            >
                                <ChevronRight className="size-5" />
                            </button>

                            {/* Dot Indicators */}
                            <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
                                {heroSlides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`size-2 rounded-full transition-all cursor-pointer ${
                                            i === currentSlide ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right 3 Stacked Banners (4 columns) */}
                        <div className="flex flex-col gap-3 md:col-span-4 h-[290px] xl:h-[350px] 2xl:h-[400px]">
                            {/* Top 2 side-by-side tiles */}
                            <div className="grid grid-cols-2 gap-3 h-[138px] xl:h-[168px] 2xl:h-[193px]">
                                {/* Tile 1: Teko Camping */}
                                <a
                                    href="#"
                                    className="relative block h-full w-full overflow-hidden rounded-lg shadow-xs group"
                                >
                                    <img
                                        src="https://www.jakartanotebook.com/images/banners/2026/09/side-up-(1)_(24).jpg"
                                        alt="Teko Camping"
                                        className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                                    />
                                </a>

                                {/* Tile 2: Cooling Pad */}
                                <a
                                    href="#"
                                    className="relative block h-full w-full overflow-hidden rounded-lg shadow-xs group"
                                >
                                    <img
                                        src="https://www.jakartanotebook.com/images/banners/2026/09/side-up-(2)_(23).jpg"
                                        alt="Cooling Pad"
                                        className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                                    />
                                </a>
                            </div>

                            {/* Bottom Tile: Selfie Screen / Kamera Belakang */}
                            <a
                                href="#"
                                className="relative block flex-1 w-full overflow-hidden rounded-lg shadow-xs group"
                            >
                                <img
                                    src="https://www.jakartanotebook.com/images/banners/2026/09/side-down_(21).jpg"
                                    alt="Selfie Screen"
                                    className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                                />
                            </a>
                        </div>
                    </div>

                    {/* ========================================================
                        4. #SudahPastiMurahnya VALUE BUBBLES
                        ======================================================== */}
                    <div className="mt-4 rounded-lg border border-[#e5e5e5] bg-white p-3 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#ff6000]">#SudahPastiMurahnya</span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => scrollValues('left')}
                                    className="flex size-6 items-center justify-center rounded-full border border-[#dddddd] text-gray-400 hover:text-black hover:border-black cursor-pointer"
                                >
                                    <ChevronLeft className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollValues('right')}
                                    className="flex size-6 items-center justify-center rounded-full border border-[#dddddd] text-gray-400 hover:text-black hover:border-black cursor-pointer"
                                >
                                    <ChevronRight className="size-3.5" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={valueScrollRef}
                            className="flex items-center gap-2 overflow-x-auto pb-1 text-center scrollbar-none scroll-smooth"
                        >
                            {maknotValues.map((val, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSearchKeyword(val.label)}
                                    className="flex flex-col items-center justify-center min-w-[96px] p-2 hover:bg-[#fafafa] rounded-lg transition-colors group cursor-pointer shrink-0"
                                >
                                    <div className="relative size-12 rounded-xl bg-[#fafafa] p-1 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <img
                                            src={val.img}
                                            alt={val.label}
                                            className="size-10 object-contain"
                                            loading="lazy"
                                        />
                                    </div>
                                    <span className="mt-2 text-[11px] font-medium text-[#444444] line-clamp-1">
                                        {val.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ========================================================
                        5. FLASH SALE (HomeParade with Countdown & 8 Products)
                        ======================================================== */}
                    <div className="mt-4 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://static.jakartanotebook.com/frontend/public/images/home/parade/flash-sale.svg?1"
                                    alt="Flash Sale"
                                    className="size-6 object-contain"
                                />
                                <h3 className="text-sm font-bold text-[#222222]">Flash Sale</h3>
                                <span className="rounded bg-[#ffe6e6] px-2 py-0.5 text-[11px] font-bold text-[#d32f2f]">
                                    Mainan
                                </span>
                            </div>

                            {/* Red Countdown Timer */}
                            <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                                <span className="text-[11px] font-sans text-[#666666] mr-1">Berakhir dalam</span>
                                <span className="rounded bg-[#d32f2f] px-2 py-0.5 text-white shadow-xs">
                                    {String(timer.hours).padStart(2, '0')}
                                </span>
                                <span className="text-[#d32f2f] font-bold">:</span>
                                <span className="rounded bg-[#d32f2f] px-2 py-0.5 text-white shadow-xs">
                                    {String(timer.minutes).padStart(2, '0')}
                                </span>
                                <span className="text-[#d32f2f] font-bold">:</span>
                                <span className="rounded bg-[#d32f2f] px-2 py-0.5 text-white shadow-xs">
                                    {String(timer.seconds).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        {/* 8 Product Cards Grid */}
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 2xl:gap-3">
                            {activeFlashSaleProducts.map((p) => {
                                const displayName = p.name || p.title || 'Produk';
                                const displayImg = getProductImage(p.thumbnail || p.img);
                                const displayBadge = p.brand || p.badge;
                                const original = p.original_price ?? p.originalPrice;
                                const discountVal = p.discount_percent ?? p.discount;

                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => handleAddToCart(displayName)}
                                        className="group flex flex-col justify-between rounded-lg border border-transparent p-2 hover:border-[#ff6000] hover:shadow-xs transition-all bg-white cursor-pointer"
                                    >
                                        <div>
                                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#fafafa]">
                                                <img
                                                    src={displayImg}
                                                    alt={displayName}
                                                    className="h-full w-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                />
                                                {displayBadge && (
                                                    <span className="absolute top-1 left-1 rounded bg-[#0099ff] px-1 py-0.5 text-[8px] font-bold text-white uppercase">
                                                        {displayBadge}
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="mt-2 text-[11px] font-medium text-[#222222] line-clamp-2 leading-snug group-hover:text-[#ff6000]">
                                                {displayName}
                                            </h4>
                                        </div>

                                        <div className="mt-2 pt-1 border-t border-[#f5f5f5]">
                                            <div className="text-xs font-bold text-[#222222]">
                                                {formatRupiah(p.price)}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px]">
                                                {original && (
                                                    <span className="text-[#999999] line-through">
                                                        {formatRupiah(original)}
                                                    </span>
                                                )}
                                                {discountVal && (
                                                    <span className="font-bold text-[#d32f2f]">
                                                        {discountVal}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ========================================================
                        6. FULL-WIDTH LONG BANNER (assets.jaknot.com)
                        ======================================================== */}
                    <div className="mt-4 overflow-hidden rounded-lg shadow-xs">
                        <img
                            src="https://assets.jaknot.com/home_image/2026/09/XN2WGM-w-1.jpg"
                            alt="Special Promotion Long Banner"
                            className="w-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* ========================================================
                        7. KATEGORI POPULER (17 items, 10 columns on desktop)
                        ======================================================== */}
                    <div className="mt-4 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://static.jakartanotebook.com/frontend/public/images/home/category-popular/chart.png"
                                    alt="Kategori Populer"
                                    className="size-5 object-contain"
                                />
                                <h3 className="text-sm font-bold text-[#222222]">Kategori Populer</h3>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => scrollCategories('left')}
                                    className="flex size-6 items-center justify-center rounded border border-[#e0e0e0] text-gray-400 hover:text-black cursor-pointer"
                                >
                                    <ChevronLeft className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollCategories('right')}
                                    className="flex size-6 items-center justify-center rounded border border-[#e0e0e0] text-gray-400 hover:text-black cursor-pointer"
                                >
                                    <ChevronRight className="size-3.5" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={categoryScrollRef}
                            className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-center scrollbar-none scroll-smooth"
                        >
                            {popularCategories.map((cat, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        const matched = categories.find(
                                            (c) =>
                                                c.name.toLowerCase().includes(cat.name.toLowerCase()) ||
                                                cat.name.toLowerCase().includes(c.name.toLowerCase())
                                        );
                                        if (matched) {
                                            handleSelectCategory(matched.slug);
                                        } else {
                                            setSearchKeyword(cat.name);
                                        }
                                        const el = document.getElementById('rekomendasi-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="flex flex-col items-center justify-center min-w-[92px] p-2 rounded-lg border border-[#efefef] hover:border-[#0099ff] hover:shadow-xs transition-all text-center group cursor-pointer shrink-0"
                                >
                                    <div className="relative size-14 rounded-full bg-[#fafafa] p-1 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <img
                                            src={cat.img}
                                            alt={cat.name}
                                            className="size-11 object-contain"
                                            loading="lazy"
                                        />
                                    </div>
                                    <span className="mt-2 text-[11px] font-semibold text-[#444444] line-clamp-1">
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ========================================================
                        8. VIDEO SHOPPING (Produk Viral Reels)
                        ======================================================== */}
                    <div className="mt-4 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://static.jakartanotebook.com/frontend/public/images/home/video-shopping/video.svg?1"
                                    alt="Video Shopping"
                                    className="size-5 object-contain"
                                />
                                <h3 className="text-sm font-bold text-[#222222]">Video Shopping</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveVideo(videoReels[0])}
                                className="rounded-lg border border-[#0099ff] px-3 py-1 text-[11px] font-semibold text-[#0099ff] bg-white hover:bg-[#e6f5ff] transition-colors cursor-pointer"
                            >
                                Lihat Semua
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {videoReels.map((v) => (
                                <div
                                    key={v.id}
                                    onClick={() => setActiveVideo(v)}
                                    className="relative aspect-9/16 w-full overflow-hidden rounded-xl bg-black group cursor-pointer shadow-xs"
                                >
                                    <img
                                        src={v.thumbnailUrl}
                                        alt={v.title}
                                        className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    {/* Play icon badge */}
                                    <div className="absolute top-3 left-3 flex size-7 items-center justify-center rounded-full bg-white/80 text-black shadow-md">
                                        <Play className="size-3.5 fill-current ml-0.5 text-[#222222]" />
                                    </div>

                                    {/* Bottom gradient & label */}
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 text-white">
                                        <div className="text-[10px] text-[#ffd166] uppercase font-bold tracking-wider">
                                            {v.category}
                                        </div>
                                        <div className="text-xs font-semibold line-clamp-2 leading-tight mt-0.5">
                                            {v.title}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========================================================
                        9. LAGI BANYAK DICARI (10 Top Keyword Cards)
                        ======================================================== */}
                    <div className="mt-4 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                        <div className="flex items-center gap-2 pb-3 border-b border-[#f0f0f0]">
                            <img
                                src="https://static.jakartanotebook.com/frontend/public/images/home/most-search/search.svg"
                                alt="Lagi Banyak Dicari"
                                className="size-5 object-contain"
                            />
                            <h3 className="text-sm font-bold text-[#222222]">Lagi Banyak Dicari</h3>
                        </div>

                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {mostSearchItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSearchKeyword(item.title)}
                                    className="flex items-center gap-2.5 p-2 rounded-lg border border-[#eeeeee] hover:border-[#0099ff] cursor-pointer bg-[#fafafa] hover:bg-white transition-all group"
                                >
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="size-11 rounded-lg object-contain bg-white p-0.5 border border-[#eaeaea]"
                                        loading="lazy"
                                    />
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-bold text-[#333333] group-hover:text-[#0099ff] truncate">
                                            {item.title}
                                        </div>
                                        <div className="text-[10px] text-[#888888]">{item.count}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========================================================
                        10. REKOMENDASI UNTUKMU (8-Column High-Density Grid)
                        ======================================================== */}
                    <div id="rekomendasi-section" className="mt-4 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://static.jakartanotebook.com/frontend/public/images/home/product-recommended/badge.svg"
                                    alt="Rekomendasi Untukmu"
                                    className="size-5 object-contain"
                                />
                                <h3 className="text-sm font-bold text-[#222222]">Rekomendasi Untukmu</h3>
                            </div>

                            {/* Department category tabs */}
                            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none max-w-full pb-1">
                                <button
                                    type="button"
                                    onClick={() => handleSelectCategory('all')}
                                    className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer whitespace-nowrap ${
                                        activeCategoryTab === 'all'
                                            ? 'bg-[#0099ff] text-white shadow-xs'
                                            : 'bg-[#f0f0f0] text-[#555555] hover:bg-[#e6f5ff] hover:text-[#0099ff]'
                                    }`}
                                >
                                    Semua
                                </button>
                                {categories.map((cat) => {
                                    const isSelected =
                                        activeCategoryTab === cat.slug ||
                                        activeCategoryTab === String(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleSelectCategory(cat.slug)}
                                            className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                                                isSelected
                                                    ? 'bg-[#0099ff] text-white shadow-xs'
                                                    : 'bg-[#f0f0f0] text-[#555555] hover:bg-[#e6f5ff] hover:text-[#0099ff]'
                                            }`}
                                        >
                                            {cat.icon && <span>{cat.icon}</span>}
                                            <span>{cat.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 8-Column Product Grid */}
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 2xl:gap-3.5">
                            {filteredRecommendations.length > 0 ? (
                                filteredRecommendations.map((item) => {
                                    const displayName = item.name || item.title || 'Produk';
                                    const displayImg = getProductImage(item.thumbnail || item.img);
                                    const displayBadge = item.brand || item.badge;
                                    const displayVariant = item.color || item.variant;
                                    const original = item.original_price ?? item.originalPrice;
                                    const discountVal = item.discount_percent ?? item.discount;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => handleAddToCart(displayName)}
                                            className="cursor-pointer group flex flex-col justify-between rounded-lg border border-[#e9e9e9] p-2 hover:border-[#ff6000] hover:shadow-xs transition-all bg-white"
                                        >
                                            <div>
                                                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#fafafa]">
                                                    <img
                                                        src={displayImg}
                                                        alt={displayName}
                                                        className="h-full w-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                    {displayBadge && (
                                                        <span className="absolute top-1 left-1 rounded bg-[#0099ff] px-1 py-0.5 text-[8px] font-bold text-white uppercase">
                                                            {displayBadge}
                                                        </span>
                                                    )}
                                                </div>

                                                <h4 className="mt-2 text-[11px] font-medium text-[#222222] line-clamp-2 leading-snug group-hover:text-[#ff6000]">
                                                    {displayName}
                                                </h4>

                                                {displayVariant && (
                                                    <span className="mt-1 inline-block rounded bg-[#f2f2f2] px-1.5 py-0.5 text-[9px] text-[#666666]">
                                                        {displayVariant}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-2 pt-1 border-t border-[#f5f5f5]">
                                                <div className="text-xs font-bold text-[#222222]">
                                                    {formatRupiah(item.price)}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px]">
                                                    {original && (
                                                        <span className="text-[#999999] line-through">
                                                            {formatRupiah(original)}
                                                        </span>
                                                    )}
                                                    {discountVal && (
                                                        <span className="font-bold text-[#d32f2f]">
                                                            {discountVal}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                                    <Package className="size-10 text-gray-300 mb-2" />
                                    <p className="text-xs font-semibold text-[#555555]">Belum ada produk di kategori ini</p>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCategory('all')}
                                        className="mt-2 text-xs text-[#0099ff] hover:underline font-medium cursor-pointer"
                                    >
                                        Lihat semua produk
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Centered Button */}
                        <div className="mt-6 flex justify-center pb-2">
                            <button
                                type="button"
                                onClick={() => handleSelectCategory('all')}
                                className="rounded-lg border border-[#0099ff] px-8 py-2 text-xs font-bold text-[#0099ff] bg-white hover:bg-[#e6f5ff] transition-colors cursor-pointer"
                            >
                                Lihat Semua Produk
                            </button>
                        </div>
                    </div>

                    {/* ========================================================
                        11. INFO MENARIK MAKNOT (Blog Articles)
                        ======================================================== */}
                    <div className="mt-4 rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://static.jakartanotebook.com/frontend/public/images/home/blog/rss.svg?1"
                                    alt="RSS Blog"
                                    className="size-5 object-contain"
                                />
                                <h3 className="text-sm font-bold text-[#222222]">Info Menarik Maknot</h3>
                            </div>
                            <a
                                href="#"
                                className="rounded-lg border border-[#0099ff] px-3 py-1 text-[11px] font-semibold text-[#0099ff] bg-white hover:bg-[#e6f5ff] transition-colors"
                            >
                                Lihat Semua
                            </a>
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {articles.map((art, idx) => (
                                <div key={idx} className="cursor-pointer group flex flex-col justify-between">
                                    <div>
                                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-[#fafafa]">
                                            <img
                                                src={art.img}
                                                alt={art.title}
                                                className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="mt-1.5 text-[10px] text-gray-400 font-medium">
                                            {art.time}
                                        </div>
                                        <h4 className="mt-1 text-xs font-bold text-[#333333] line-clamp-2 group-hover:text-[#0099ff] leading-snug">
                                            {art.title}
                                        </h4>
                                        <p className="mt-1 text-[11px] text-[#777777] line-clamp-2 leading-relaxed">
                                            {art.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========================================================
                        12. 5 VALUE PROPOSITION PILLARS (Official SVGs)
                        ======================================================== */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 rounded-lg border border-[#e5e5e5] bg-white p-6 text-center shadow-xs">
                        <div className="flex flex-col items-center">
                            <img
                                src="https://static.jakartanotebook.com/frontend/public/images/home/seo/produk-lengkap.svg?1"
                                alt="Produk Terlengkap"
                                className="size-10 mb-2 object-contain"
                            />
                            <div className="text-xs font-bold text-[#222222]">Produk Terlengkap</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">Produk unik, gadget &amp; hobi terlengkap</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <img
                                src="https://static.jakartanotebook.com/frontend/public/images/home/seo/pengiriman-tercepat.svg?1"
                                alt="Pengiriman Tercepat"
                                className="size-10 mb-2 object-contain"
                            />
                            <div className="text-xs font-bold text-[#222222]">Pengiriman Tercepat</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">COD, Pick N Go toko, instant delivery</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <img
                                src="https://static.jakartanotebook.com/frontend/public/images/home/seo/produk-terjamin.svg?1"
                                alt="Produk Terjamin"
                                className="size-10 mb-2 object-contain"
                            />
                            <div className="text-xs font-bold text-[#222222]">Produk Terjamin</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">Garansi resmi &amp; quality check teliti</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <img
                                src="https://static.jakartanotebook.com/frontend/public/images/home/seo/potensi-keuntungan.svg?1"
                                alt="Potensi Keuntungan"
                                className="size-10 mb-2 object-contain"
                            />
                            <div className="text-xs font-bold text-[#222222]">Potensi Keuntungan</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">Cocok untuk reseller &amp; dropshipper</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <img
                                src="https://static.jakartanotebook.com/frontend/public/images/home/seo/harga-termurah.svg?1"
                                alt="Harga Termurah"
                                className="size-10 mb-2 object-contain"
                            />
                            <div className="text-xs font-bold text-[#222222]">Harga Termurah</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">Harga langsung importir tanpa perantara</div>
                        </div>
                    </div>

                    {/* ========================================================
                        13. SEO DESCRIPTION & ABOUT MAKASSARNOTEBOOK
                        ======================================================== */}
                    <section id="seo-info" className="mt-6 rounded-lg border border-[#e5e5e5] bg-white p-6 text-[11px] text-[#666666] leading-relaxed shadow-xs">
                        <h4 className="font-bold text-[#333333] text-xs">
                            MakassarNotebook : Toko Online Lengkap &amp; Unik Harga Murah
                        </h4>
                        <p className="mt-1.5">
                            Selamat datang di <strong>MakassarNotebook</strong>. Kami menyediakan aneka produk unik, perlengkapan komputer &amp; laptop, outdoor gear, peralatan rumah tangga, smartphone accessories, hobi, dan perkakas dengan slogan <strong>#SudahPastiMurahnya</strong>.
                        </p>

                        <h4 className="font-bold text-[#333333] text-xs mt-4">
                            Kenapa Harus Belanja di MakassarNotebook?
                        </h4>
                        <p className="mt-1.5">
                            Tak perlu ragu berbelanja di toko kami. Kami hadir dengan sistem terintegrasi yang memungkinkan Anda belanja secara online melalui website dan mengambil langsung di toko fisik terdekat (<strong>Pick N Go</strong>) tanpa antre panjang dan bebas ongkos kirim. Kami juga melayani pengiriman kilat Instant Courier se-kota Makassar dan reguler ke seluruh pelosok Sulawesi serta Indonesia Timur.
                        </p>

                        <h4 className="font-bold text-[#333333] text-xs mt-4">
                            Peluang Reseller &amp; Dropshipper Indonesia Timur
                        </h4>
                        <p className="mt-1.5">
                            MakassarNotebook mendukung para reseller dan dropshipper dengan fasilitas blind drop-shipping (resi netral tanpa logo toko kami). Dapatkan margin keuntungan optimal dan stok ribuan SKU yang selalu terupdate setiap harinya.
                        </p>
                    </section>

                    {/* ========================================================
                        14. FOOTER & CONTACT CENTER
                        ======================================================== */}
                    <footer className="mt-6 rounded-lg border border-[#e5e5e5] bg-white overflow-hidden shadow-xs">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                            {/* Left Content (8 cols) */}
                            <div className="lg:col-span-8 flex flex-col justify-between">
                                <div>
                                    <div className="text-xs font-bold text-[#333333] mb-2.5">
                                        Download Aplikasi MakassarNotebook
                                    </div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <a href="#" className="hover:opacity-90 transition-opacity">
                                            <img
                                                src="https://static.jakartanotebook.com/frontend/_next/static/media/GooglePlayBadge.f00c35722be9afb9.svg"
                                                alt="Google Play"
                                                className="h-10"
                                            />
                                        </a>
                                        <a href="#" className="hover:opacity-90 transition-opacity">
                                            <img
                                                src="https://static.jakartanotebook.com/frontend/_next/static/media/AppStoreBadge.a11eb355d87f5011.svg"
                                                alt="App Store"
                                                className="h-10"
                                            />
                                        </a>
                                    </div>

                                    {/* Link Columns */}
                                    <div className="grid grid-cols-3 gap-6 text-[11px]">
                                        <div>
                                            <h5 className="font-bold text-[#222222] mb-2.5">Layanan Pelanggan</h5>
                                            <ul className="space-y-1.5 text-[#666666]">
                                                <li><a href="#" className="hover:text-[#0099ff]">Bantuan</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Klaim Garansi Produk</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Biaya Pengiriman</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Indeks Produk</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Konfirmasi Pembayaran</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Lacak Pesanan</a></li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="font-bold text-[#222222] mb-2.5">MakassarNotebook</h5>
                                            <ul className="space-y-1.5 text-[#666666]">
                                                <li><a href="#" className="hover:text-[#0099ff]">Tentang Kami</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Kontak Kami</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Karir</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Blog Edukasi</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Kebijakan Privasi</a></li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="font-bold text-[#222222] mb-2.5">Ikuti Kami</h5>
                                            <ul className="space-y-2 text-[#666666]">
                                                <li>
                                                    <a href="https://tiktok.com/@jakartanotebook" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0099ff]">
                                                        <img src="/images/social-media/tiktok-logo.png" alt="TikTok" className="size-4" onError={(e)=>{ (e.target as HTMLElement).style.display='none'; }} />
                                                        <span>TikTok</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://instagram.com/jakartanotebook" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0099ff]">
                                                        <img src="/images/social-media/instagram-logo.png?2" alt="Instagram" className="size-4" onError={(e)=>{ (e.target as HTMLElement).style.display='none'; }} />
                                                        <span>Instagram</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://facebook.com/jakartanotebook" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0099ff]">
                                                        <img src="/images/social-media/facebook-logo.png?2" alt="Facebook" className="size-4" onError={(e)=>{ (e.target as HTMLElement).style.display='none'; }} />
                                                        <span>Facebook</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://twitter.com/jakartanotebook" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0099ff]">
                                                        <img src="/images/social-media/twitter-logo.png?2" alt="Twitter" className="size-4" onError={(e)=>{ (e.target as HTMLElement).style.display='none'; }} />
                                                        <span>X (Twitter)</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
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

                            {/* Right Contact Center Box (Authentic Deep Navy Header) */}
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
                                            onChange={(e) => setSelectedBranch(e.target.value as BranchKey)}
                                            className="mt-1.5 w-full rounded-lg border border-[#cccccc] bg-[#fafafa] p-2 text-xs text-[#333333] focus:border-[#0099ff] focus:outline-none transition-colors cursor-pointer"
                                        >
                                            {branchKeys.map((key) => (
                                                <option key={key} value={key}>
                                                    {branchOptions[key].label}
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

                                    {/* Bottom Info Strip */}
                                    <div className="bg-[#f2f2f2] p-2.5 rounded-lg text-[10px] text-[#555555] flex justify-between items-center">
                                        <span>Beli langsung / Pick N Go di kota lain</span>
                                        <button
                                            type="button"
                                            onClick={() => setIsBranchModalOpen(true)}
                                            className="text-[#0099ff] font-bold hover:underline cursor-pointer"
                                        >
                                            Selengkapnya
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Logistics Partners */}
                        <div className="bg-[#f9f9f9] border-t border-[#e5e5e5] px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#888888] gap-4">
                            <div>
                                Copyright &copy; 2026 MakassarNotebook.com. All rights reserved | <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                            </div>

                            {/* Partners */}
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

                    {/* Bottom Spacer */}
                    <div className="h-10" />
                </main>

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
        </>
    );
}
