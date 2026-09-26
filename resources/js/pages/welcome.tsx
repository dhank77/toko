import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Headphones,
    HeartHandshake,
    HelpCircle,
    Info,
    Laptop,
    MapPin,
    Menu,
    MessageCircle,
    Package,
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
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    // Branch options including Makassar Maricaya (live JakartaNotebook branch)
    type BranchKey = 'maricaya' | 'panakkukang' | 'pettarani' | 'perintis';

    const branchOptions: Record<BranchKey, {
        id: BranchKey;
        name: string;
        label: string;
        address: string;
        phone: string;
        waSales: string;
        hoursWeekday: string;
        hoursWeekend: string;
        mapUrl: string;
    }> = {
        maricaya: {
            id: 'maricaya',
            name: 'Pick N Go Maricaya Makassar',
            label: 'Cabang Maricaya Baru - Jl. Kijang No. 5C',
            address: 'Jl. Kijang No.5C RW 9, Maricaya Baru, Kec. Makassar, Kota Makassar, Sulawesi Selatan 90141',
            phone: '(0411) 39 700 200',
            waSales: '0896 590 085 85',
            hoursWeekday: '09:00 - 21:00 WITA',
            hoursWeekend: '12:00 - 20:00 WITA',
            mapUrl: 'https://maps.google.com/?q=Makassar+Notebook+Maricaya',
        },
        panakkukang: {
            id: 'panakkukang',
            name: 'Pick N Go Panakkukang',
            label: 'Cabang Panakkukang - Jl. Pengayoman No. 42',
            address: 'Jl. Pengayoman No. 42, Panakkukang, Kota Makassar, Sulawesi Selatan 90231',
            phone: '(0411) 39 700 200',
            waSales: '0896 135 222 00',
            hoursWeekday: '09:00 - 21:00 WITA',
            hoursWeekend: '12:00 - 20:00 WITA',
            mapUrl: 'https://maps.google.com/?q=Panakkukang+Makassar',
        },
        pettarani: {
            id: 'pettarani',
            name: 'Pick N Go AP Pettarani',
            label: 'Cabang AP Pettarani - Ruko Blok B-7',
            address: 'Jl. A.P. Pettarani Business District Blok B-7, Makassar 90222',
            phone: '(0411) 39 700 200',
            waSales: '0896 135 222 00',
            hoursWeekday: '09:00 - 21:00 WITA',
            hoursWeekend: '12:00 - 20:00 WITA',
            mapUrl: 'https://maps.google.com/?q=AP+Pettarani+Makassar',
        },
        perintis: {
            id: 'perintis',
            name: 'Pick N Go Perintis Kemerdekaan',
            label: 'Cabang Perintis - KM 10 Samping UNHAS',
            address: 'Jl. Perintis Kemerdekaan KM 10 Samping UNHAS, Tamalanrea, Makassar 90245',
            phone: '(0411) 39 700 200',
            waSales: '0896 135 222 00',
            hoursWeekday: '09:00 - 21:00 WITA',
            hoursWeekend: '12:00 - 20:00 WITA',
            mapUrl: 'https://maps.google.com/?q=Perintis+Makassar',
        },
    };

    const [selectedBranch, setSelectedBranch] = useState<BranchKey>('maricaya');
    const currentBranch = branchOptions[selectedBranch];
    const [cartCount, setCartCount] = useState<number>(0);
    const [searchKeyword, setSearchKeyword] = useState<string>('senter kepala');

    // Countdown timer for Flash Sale
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

    const formatRupiah = (val: number) => {
        return 'Rp' + val.toLocaleString('id-ID');
    };

    const handleAddToCart = () => {
        setCartCount((prev) => prev + 1);
    };

    // 1. Horizontal Bubbles / #SudahPastiMurahnya items
    const bubbleNav = [
        { label: 'Waktunya Jajan 🥳', icon: '🍿', badge: 'Hot' },
        { label: 'Just Arrived', icon: '📦' },
        { label: 'Gear wajib rider 🏍️', icon: '🛵' },
        { label: 'Inspirasi hari ini ✨', icon: '💡' },
        { label: 'Toko Cabang', icon: '🏪' },
        { label: 'Beli sekalian 👀', icon: '🛒' },
        { label: 'Ada barang keren...', icon: '🕶️' },
        { label: 'Coming Soon', icon: '⏳' },
        { label: 'Menarik Nih 👀', icon: '✨' },
        { label: 'Whats New', icon: '🔥' },
    ];

    // 2. Flash Sale Items (Aneka Lampu)
    const flashSaleProducts = [
        {
            id: 101,
            title: 'LED Strip RGB USB TV Backlight 2M Remote',
            badge: 'LED STRIP',
            price: 32900,
            originalPrice: 59000,
            discount: 46,
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 102,
            title: 'Lampu UV Sterilisasi Kuman Bakteri Portable',
            badge: 'LAMPU UV',
            price: 159500,
            originalPrice: 238000,
            discount: 34,
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 103,
            title: 'Lampu Tidur LED Sensor Gerak Smart Night Light',
            badge: 'Soft light effect',
            price: 53500,
            originalPrice: 91000,
            discount: 42,
            image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 104,
            title: 'Lampu Dinding Solar Tenaga Surya Outdoor Waterproof',
            badge: 'WALL LAMP',
            price: 43900,
            originalPrice: 80000,
            discount: 46,
            image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 105,
            title: 'Perangkap Nyamuk Elektrik UV Light Bionic Suction',
            badge: 'LAMPU NYAMUK',
            price: 180200,
            originalPrice: 274000,
            discount: 35,
            image: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 106,
            title: 'Lampu Lentera Camping Tenda Rechargeable LED',
            badge: 'LAMPU CAMPING',
            price: 116800,
            originalPrice: 183000,
            discount: 37,
            image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 107,
            title: 'Lampu Meja Hias Belajar Arsitek Swing Arm Flexible',
            badge: 'Lampu Meja Hias',
            price: 87800,
            originalPrice: 137000,
            discount: 37,
            image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 108,
            title: 'Lampu Gantung Nordic Retro Natural Travertine Pendant',
            badge: 'Natural Travertine Light',
            price: 186500,
            originalPrice: 282000,
            discount: 35,
            image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=400&q=80',
        },
    ];

    // 3. Kategori Populer
    const popularCategories = [
        { name: 'Kursi Camping', img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=250&q=80' },
        { name: 'Soft Flask', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=250&q=80' },
        { name: 'Tenda Camping', img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=250&q=80' },
        { name: 'Kompor Portable', img: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=250&q=80' },
        { name: 'Kacamata Olahraga', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=250&q=80' },
        { name: 'Masker Motor', img: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=250&q=80' },
        { name: 'Gunting Kuku', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=250&q=80' },
        { name: 'Karabiner', img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=250&q=80' },
        { name: 'Lampu Meja', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=250&q=80' },
        { name: 'Koleksi Mouse', img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=250&q=80' },
    ];

    // 4. Produk Viral Maknot (Video Reels)
    const viralProducts = [
        {
            title: 'Smart Tag Bluetooth Anti Hilang',
            sub: 'cukup',
            img: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: 'Gembok Koper TSA Kunci Angka',
            sub: '',
            img: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: 'Kabel Charger 3 in 1 Fast Charge',
            sub: 'KABEL CHARGER',
            img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: 'Lakban Aluminium Tahan Panas Bocor',
            sub: '',
            img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: 'Keyboard Wireless Bluetooth Mini Touchpad',
            sub: 'KERJANYA',
            img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: 'Lampu Proyektor Astronaut Bintang Aurora',
            sub: 'Bikin Suasana Kamarmu',
            img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
        },
    ];

    // 5. Lagi Banyak Dicari (Live JakartaNotebook Top Keywords)
    const popularSearches = [
        { name: 'Cooling Pad Laptop', count: '1.420 Produk', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=150&q=80' },
        { name: 'Aksesoris Motor', count: '3.210 Produk', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=150&q=80' },
        { name: 'Handuk Quick Dry', count: '850 Produk', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=150&q=80' },
        { name: 'Alat Cukur Elektrik', count: '1.130 Produk', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=150&q=80' },
        { name: 'Bracket TV LED', count: '920 Produk', img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=150&q=80' },
        { name: 'Magnet Neodymium N35', count: '740 Produk', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=150&q=80' },
        { name: 'Senter Kepala LED', count: '1.860 Produk', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=150&q=80' },
        { name: 'Teko Camping 2L', count: '704 Produk', img: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=150&q=80' },
        { name: 'Kursi Lipat Portabel', count: '1.449 Produk', img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=150&q=80' },
        { name: 'Kabel Fast Charging', count: '2.530 Produk', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80' },
    ];

    // 6. Rekomendasi Untukmu (8 Columns high density grid)
    const recommendations = [
        {
            title: 'TaffGUARD Gembok Sepeda Kode Kunci Kombinasi 5 Digit',
            variant: 'Black',
            badge: 'KEAMANAN',
            price: 26200,
            originalPrice: 49000,
            discount: 48,
            img: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Taffware Magnet Gantungan Round Hook Neodymium N35',
            variant: 'Silver',
            badge: 'N35 41kg 36mm',
            price: 21700,
            originalPrice: 42900,
            discount: 50,
            img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'TaffOmicron Fingertip Pulse Oximeter Alat Ukur Saturasi Oksigen',
            variant: 'Red',
            badge: 'PULSE OXIMETER',
            price: 33200,
            originalPrice: 60900,
            discount: 46,
            img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'BAKUJA Lampu Lantai Smart LED Standing Lamp Corner RGB',
            variant: 'Black',
            badge: 'Corner LED RGB',
            price: 158600,
            originalPrice: 211900,
            discount: 26,
            img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'One Two Cups Hand Press Coffee Maker 3in1 20 Bar Espresso',
            variant: 'White',
            badge: '3 in 1 20 Bar',
            price: 293200,
            originalPrice: 401900,
            discount: 28,
            img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'GIYU Face Shield Kacamata Pelindung Wajah Anti Droplet',
            variant: 'Transparan',
            badge: 'FACE SHIELD',
            price: 18100,
            originalPrice: 34900,
            discount: 49,
            img: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Taffware Klem F Clamp Jepit Papan Kayu Heavy Duty 80x200mm',
            variant: 'No Color 80x200 mm',
            badge: 'KLEM JEPIT F',
            price: 26900,
            originalPrice: 50900,
            discount: 48,
            img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'TaffPACK Lakban Super Strong Grid Fiber Tape 20M x 10mm',
            variant: 'Transparent 10 mm',
            badge: 'SUPER STRONG',
            price: 5900,
            originalPrice: 16900,
            discount: 66,
            img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'TaffSPORT Kantong Air Minum Water Bladder Bite Valve 2L',
            variant: 'White',
            badge: 'Water Bladder 2L',
            price: 57900,
            originalPrice: 97000,
            discount: 41,
            img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'NITECORE Baterai Isi Ulang 21700 Li-ion Button Top 3.6V 5000mAh',
            variant: 'Black/Yellow',
            badge: 'NL2150 5000mAh',
            price: 263700,
            originalPrice: 355000,
            discount: 26,
            img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Taffware Katrol Kerekan Mini Serbaguna Swivel Pulley M50',
            variant: 'Silver M50',
            badge: 'KATROL M50',
            price: 43100,
            originalPrice: 74900,
            discount: 43,
            img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'SVOCK Sarung Cover Jok Mobil Full Set Polyester Breathable',
            variant: 'Black/Gray',
            badge: 'COVER JOK',
            price: 164800,
            originalPrice: 245900,
            discount: 33,
            img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'PTLOM Tempat Makan Minum Hewan Peliharaan Otomatis',
            variant: 'Gray',
            badge: 'PET FEEDER',
            price: 29700,
            originalPrice: 54000,
            discount: 46,
            img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'TaffPACK Isolasi Lakban Asetat Tahan Panas 30M 12mm',
            variant: 'Black 30M 12mm',
            badge: 'LAKBAN TAHAN PANAS',
            price: 17400,
            originalPrice: 36900,
            discount: 53,
            img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'OTOHEROES Tutup Pentil Ban Mobil Motor Neon Glow in Dark',
            variant: 'Blue',
            badge: 'TUTUP PENTIL BAN',
            price: 3000,
            originalPrice: 13000,
            discount: 79,
            img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'TaffSPORT Cover Jok Sadel Sepeda Sporty Empuk Busa Tebal',
            variant: 'Red',
            badge: 'Sadel Sepeda Sporty',
            price: 13000,
            originalPrice: 28900,
            discount: 56,
            img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Orico Dual Bay M.2 NVMe SSD Enclosure Tool-Free 10Gbps',
            variant: 'Gray',
            badge: 'NVME ENCLOSURE',
            price: 345000,
            originalPrice: 510000,
            discount: 32,
            img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Xiaomi Youpin Desk Lamp Monitor Screenbar Touch Sensor',
            variant: 'Black',
            badge: 'SCREENBAR LED',
            price: 215000,
            originalPrice: 330000,
            discount: 35,
            img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Baseus 7-in-1 USB-C Hub HDMI 4K 100W PD Ultra Slim',
            variant: 'Space Gray',
            badge: '7 IN 1 HUB',
            price: 269000,
            originalPrice: 420000,
            discount: 36,
            img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Edifier Wireless Bluetooth 5.3 Earphones Low Latency',
            variant: 'Black',
            badge: 'BT 5.3 ANC',
            price: 175000,
            originalPrice: 285000,
            discount: 38,
            img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Remax Gaming Mechanical Keyboard 68-Keys Hot-Swap RGB',
            variant: 'White/Blue',
            badge: 'HOT-SWAP RGB',
            price: 389000,
            originalPrice: 580000,
            discount: 33,
            img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'Taffware Pompa Ban Elektrik Portable LCD Digital 150 PSI',
            variant: 'Black',
            badge: '150 PSI SMART',
            price: 198000,
            originalPrice: 325000,
            discount: 39,
            img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'TaffSPORT Tas Ransel Sepeda Hydration Backpack Water Bladder',
            variant: 'Dark Green',
            badge: 'HYDRATION PACK',
            price: 68500,
            originalPrice: 120000,
            discount: 43,
            img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=350&q=80',
        },
        {
            title: 'TaffSTUDIO Ring Light LED Selfie Dimmable Tripod Stand 26cm',
            variant: 'Black 26cm',
            badge: 'RING LIGHT 26CM',
            price: 49900,
            originalPrice: 85000,
            discount: 41,
            img: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=350&q=80',
        },
    ];

    // 7. Info Menarik Maknot
    const articles = [
        {
            title: '7 Rekomendasi Pompa Ban Manual Terbaik dan Praktis',
            desc: 'Berikut adalah rekomendasi pompa ban manual terbaik dengan berbagai fitur yang praktis dibawa bepergian.',
            img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: '13 Rekomendasi Nebulizer Portable Praktis Terbaik 2026',
            desc: 'Butuh nebulizer portable yang cepat dan praktis untuk perjalanan atau penggunaan keluarga di rumah.',
            img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: '8 Lampu Sepeda Depan Belakang, Terang dan Mudah Dipasang!',
            desc: 'Temukan pilihan lampu sepeda depan belakang terbaik yang terang dan mudah dipasang di berbagai tipe setang.',
            img: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: '6 Kantong Air Lipat Multifungsi untuk Kegiatan Outdoor',
            desc: 'Kantong air lipat multifungsi memiliki banyak fitur mulai dari berbagai ukuran kapasitas hingga bahan food grade.',
            img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80',
        },
        {
            title: '8 Masker N95 Terbaik untuk Melindungi dari Debu dan Polusi',
            desc: 'Temukan pilihan masker N95 terbaik dengan fungsi filtrasi dan bahan yang nyaman untuk aktivitas harian.',
            img: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=400&q=80',
        },
    ];

    return (
        <>
            <Head title="MakassarNotebook.com - Belanja Murah Gadget & Aksesoris Unik #SudahPastiMurahnya" />

            <div className="min-h-screen bg-[#f7f7f7] font-sans text-[#333333] text-xs">
                {/* 1. TOP HEADER BAR */}
                <div className="border-b border-[#e5e5e5] bg-white py-1.5 text-[11px] text-[#666666]">
                    <div className="mx-auto flex max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1620px] items-center justify-between px-3 sm:px-4 2xl:px-6">
                        <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="size-3.5 text-[#0099ff]" />
                            <span className="font-semibold text-[#222222]">Makassar</span>
                            <button
                                onClick={() => {
                                    const branches: BranchKey[] = ['maricaya', 'panakkukang', 'pettarani', 'perintis'];
                                    const nextIdx = (branches.indexOf(selectedBranch) + 1) % branches.length;
                                    setSelectedBranch(branches[nextIdx]);
                                }}
                                className="text-[#0099ff] hover:text-[#007acc] hover:underline cursor-pointer"
                            >
                                ganti
                            </button>
                            <span className="text-gray-300">|</span>
                            <span className="truncate">
                                {currentBranch.name} | Senin - Sabtu (09:00 - 21:00 WITA), Tutup pada Hari Libur Nasional
                            </span>
                            <a href="#toko-kami" className="text-[#0099ff] hover:text-[#007acc] hover:underline ml-1">
                                Selengkapnya
                            </a>
                        </div>
                        <div className="hidden items-center gap-4 sm:flex">
                            <a href="#" className="hover:text-[#0099ff]">Service Center</a>
                            <a href="#" className="hover:text-[#0099ff]">How to buy</a>
                            <a href="#" className="hover:text-[#0099ff]">Order Tracking</a>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN HEADER (Logo, Category, Search, Cart, Login) */}
                <header className="sticky top-0 z-50 border-b border-[#e5e5e5] bg-white shadow-xs">
                    <div className="mx-auto flex h-18 max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1620px] items-center justify-between gap-4 px-3 sm:px-4 2xl:px-6">
                        {/* Logo JakartaNotebook / MakassarNotebook Style */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-black tracking-tight text-[#222222]">
                                        makassar<span className="text-[#0099ff]">notebook</span>
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold tracking-tight text-[#ff6000]">
                                    #SudahPastiMurahnya
                                </span>
                            </div>
                        </Link>

                        {/* Category Dropdown Button */}
                        <button
                            type="button"
                            className="hidden md:flex items-center gap-2 rounded-lg border border-[#d6d6d6] bg-[#fafafa] px-3.5 py-2 text-xs font-semibold text-[#444444] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
                        >
                            <Menu className="size-4 text-[#ff6000]" />
                            <span>Kategori</span>
                        </button>

                        {/* Search Bar with Orange Icon */}
                        <div className="relative flex-1 max-w-2xl">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="senter kepala, kabel charger, holder hp..."
                                className="h-10 w-full rounded-lg border border-[#cccccc] bg-[#f0f0f0] pr-10 pl-3.5 text-xs text-[#333333] placeholder-[#b3b3b3] focus:bg-white focus:border-[#0099ff] focus:ring-1 focus:ring-[#0099ff] focus:outline-none transition-colors"
                            />
                            <button
                                type="button"
                                className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-[#777777] hover:text-[#0099ff] transition-colors cursor-pointer"
                            >
                                <Search className="size-4.5" />
                            </button>
                        </div>

                        {/* My Cart & Auth */}
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <button
                                type="button"
                                className="flex items-center gap-2 text-[#333333] hover:text-[#ff6000]"
                            >
                                <div className="relative">
                                    <ShoppingCart className="size-5 text-[#ff6000]" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-[#ff6000] text-[10px] text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden lg:inline">My Cart</span>
                            </button>

                            <span className="text-gray-300 hidden sm:inline">|</span>

                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="flex items-center gap-1.5 rounded bg-[#0099ff] px-4 py-2 text-xs font-bold text-white hover:bg-[#007acc]"
                                >
                                    <User className="size-3.5" />
                                    <span>Akun Saya</span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={login()}
                                        className="flex items-center gap-1.5 text-[#333333] hover:text-[#ff6000]"
                                    >
                                        <User className="size-4 text-[#777777]" />
                                        <span>Masuk / Daftar</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* 3. HERO BENTO BANNER (Big banner left, 3 small banners right) */}
                <main className="mx-auto max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1620px] px-3 sm:px-4 2xl:px-6 pt-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                        {/* Left Big Carousel Banner (Terracotta/Orange Baking Banner) */}
                        <div className="relative overflow-hidden rounded bg-[#b4533c] text-white md:col-span-8 h-[290px] xl:h-[350px] 2xl:h-[400px] p-8 2xl:p-10 flex flex-col justify-between shadow-xs">
                            <div className="relative z-10 max-w-sm">
                                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl leading-snug">
                                    Koleksi Baru
                                    <br />
                                    Buat <span className="text-white underline decoration-[#ffd166]">Hobi Baking</span>
                                </h2>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-sm font-medium">Mulai Dari</span>
                                    <span className="text-3xl font-extrabold text-[#ffd166]">13RB<span className="text-sm font-semibold">-an</span></span>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="mt-6 inline-block rounded bg-[#8c3520] px-6 py-2 text-xs font-bold text-white hover:bg-[#722b1a] transition-colors"
                                >
                                    LIHAT KOLEKSI
                                </button>
                            </div>

                            {/* Background Image of Baking Mixer / Kitchen */}
                            <img
                                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80"
                                alt="Hobi Baking"
                                className="absolute right-0 top-0 h-full w-3/5 object-cover object-center opacity-90 mix-blend-luminosity"
                            />

                            {/* Carousel Arrows & Dots */}
                            <button className="absolute left-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">
                                <ChevronLeft className="size-4" />
                            </button>
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">
                                <ChevronRight className="size-4" />
                            </button>
                            <div className="absolute bottom-3 right-6 flex items-center gap-1.5 z-10">
                                <span className="size-1.5 rounded-full bg-white" />
                                <span className="size-1.5 rounded-full bg-white/40" />
                                <span className="size-1.5 rounded-full bg-white/40" />
                                <span className="size-1.5 rounded-full bg-white/40" />
                            </div>
                        </div>

                        {/* Right Stacked 3 Banners */}
                        <div className="flex flex-col gap-3 md:col-span-4 h-[290px] xl:h-[350px] 2xl:h-[400px]">
                            {/* Top 2 side-by-side tiles */}
                            <div className="grid grid-cols-2 gap-3 h-[138px] xl:h-[168px] 2xl:h-[193px]">
                                {/* Tile 1: Teko Camping (Blue) */}
                                <div className="relative overflow-hidden rounded bg-[#1f4e79] p-3 text-white flex flex-col justify-between">
                                    <div className="relative z-10">
                                        <div className="text-[11px] font-bold leading-tight">Teko Alat Masak Camping 2L</div>
                                        <div className="text-[10px] text-gray-300 line-through mt-1">Rp190.900</div>
                                        <div className="text-sm font-bold text-[#ffd166]">Rp122.600</div>
                                    </div>
                                    <img
                                        src="https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=250&q=80"
                                        alt="Teko Camping"
                                        className="absolute right-0 bottom-0 size-20 object-cover opacity-85"
                                    />
                                </div>

                                {/* Tile 2: Cegah Laptop Overheat (Light Blue) */}
                                <div className="relative overflow-hidden rounded bg-[#d9e1f2] p-3 text-[#1f4e79] flex flex-col justify-between">
                                    <div className="relative z-10">
                                        <div className="text-[11px] font-bold leading-tight">Cegah Laptop Overheat</div>
                                        <div className="text-[10px] text-gray-500 line-through mt-1">Rp175.900</div>
                                        <div className="text-sm font-bold text-[#c00000]">Rp111.700</div>
                                    </div>
                                    <img
                                        src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=250&q=80"
                                        alt="Cooling Pad"
                                        className="absolute right-0 bottom-0 size-20 object-cover"
                                    />
                                </div>
                            </div>

                            {/* Bottom Tile: Kamera Belakang (Yellow/Peach) */}
                            <div className="relative overflow-hidden rounded bg-[#fce4d6] p-4 text-[#833c0c] flex-1 flex flex-col justify-between">
                                <div className="relative z-10 max-w-[180px]">
                                    <div className="text-xs font-bold leading-snug">Preview Kamera Belakang Real-Time</div>
                                    <div className="text-[10px] text-gray-500 line-through mt-1">Rp292.900</div>
                                    <div className="text-base font-bold text-[#c00000]">Rp194.400</div>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80"
                                    alt="Kamera Belakang"
                                    className="absolute right-2 bottom-2 size-28 object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. #SudahPastiMurahnya HORIZONTAL BUBBLES */}
                    <div className="mt-5 bg-white p-3 rounded border border-[#e5e5e5]">
                        <div className="text-xs font-bold text-[#222222] mb-3">#SudahPastiMurahnya</div>
                        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-center scrollbar-none">
                            {bubbleNav.map((b, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="flex flex-col items-center justify-center min-w-[95px] p-2 hover:bg-[#fafafa] rounded transition-colors group"
                                >
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-[#f0f0f0] text-xl group-hover:scale-105 transition-transform">
                                        {b.icon}
                                    </div>
                                    <span className="mt-2 text-[11px] font-medium text-[#444444] leading-tight">
                                        {b.label}
                                    </span>
                                </button>
                            ))}
                            <button className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#dcdcdc] text-gray-400 hover:text-black hover:border-black">
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* 5. FLASH SALE (Aneka Lampu with Red Countdown Boxes) */}
                    <div className="mt-4 bg-white p-4 rounded border border-[#e5e5e5]">
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <Zap className="size-4.5 text-[#0099ff] fill-current" />
                                <h3 className="text-sm font-bold text-[#222222]">Flash Sale</h3>
                                <span className="text-xs text-[#777777]">Aneka Lampu</span>
                            </div>

                            {/* Red Timer Boxes */}
                            <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                                <span className="text-[11px] font-sans text-[#666666]">Berakhir dalam</span>
                                <span className="rounded bg-[#d32f2f] px-1.5 py-0.5 text-white">
                                    {String(timer.hours).padStart(2, '0')}
                                </span>
                                <span className="text-[#d32f2f]">:</span>
                                <span className="rounded bg-[#d32f2f] px-1.5 py-0.5 text-white">
                                    {String(timer.minutes).padStart(2, '0')}
                                </span>
                                <span className="text-[#d32f2f]">:</span>
                                <span className="rounded bg-[#d32f2f] px-1.5 py-0.5 text-white">
                                    {String(timer.seconds).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        {/* 8 Product Items */}
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 2xl:gap-3.5">
                            {flashSaleProducts.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={handleAddToCart}
                                    className="cursor-pointer group flex flex-col justify-between rounded border border-transparent p-1.5 hover:border-[#ff6000] hover:shadow-xs transition-all"
                                >
                                    <div>
                                        <div className="relative aspect-square w-full overflow-hidden rounded bg-[#fafafa]">
                                            <img
                                                src={p.image}
                                                alt={p.title}
                                                className="h-full w-full object-cover group-hover:scale-103 transition-transform"
                                            />
                                            <span className="absolute top-1 left-1 rounded bg-black/60 px-1 py-0.2 text-[9px] text-white">
                                                {p.badge}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs font-bold text-[#222222]">
                                            {formatRupiah(p.price)}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px]">
                                            <span className="text-[#999999] line-through">{formatRupiah(p.originalPrice)}</span>
                                            <span className="font-bold text-[#d32f2f]">{p.discount}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 6. WIDE PROMO BANNER (Cyan Promo Gajian Aksesoris Renang) */}
                    <div className="mt-4 overflow-hidden rounded bg-gradient-to-r from-[#0099cc] via-[#00b4d8] to-[#0077b6] p-4 text-white flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#ffd166] text-[#003566] px-3 py-1 font-black text-sm uppercase rounded">
                                PROMO GAJIAN
                            </div>
                            <div>
                                <div className="text-base font-black tracking-tight">
                                    AKSESORIS RENANG MULAI DARI <span className="text-[#ffd166]">30RB-AN</span>
                                </div>
                                <div className="text-[11px] text-white/90">
                                    Pakai Kode Voucher: <strong className="bg-black/30 px-1.5 py-0.5 rounded text-white">GAJIANMAINAIR</strong>
                                </div>
                            </div>
                        </div>
                        <button className="hidden sm:inline-block rounded bg-[#ffd166] px-5 py-2 text-xs font-bold text-[#003566] hover:bg-[#ffe082]">
                            Lihat Koleksi
                        </button>
                    </div>

                    {/* 7. KATEGORI POPULER (10 rounded category cards) */}
                    <div className="mt-4 bg-white p-4 rounded border border-[#e5e5e5]">
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <span className="text-[#ff6000]">⭐</span>
                                <h3 className="text-sm font-bold text-[#222222]">Kategori Populer</h3>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="size-6 flex items-center justify-center rounded border border-[#e0e0e0] text-gray-400 hover:text-black">
                                    <ChevronLeft className="size-3.5" />
                                </button>
                                <button className="size-6 flex items-center justify-center rounded border border-[#e0e0e0] text-gray-400 hover:text-black">
                                    <ChevronRight className="size-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 2xl:gap-3">
                            {popularCategories.map((cat, i) => (
                                <div
                                    key={i}
                                    className="cursor-pointer group flex flex-col items-center justify-center p-2 rounded border border-[#efefef] hover:border-[#0099ff] hover:shadow-xs transition-all text-center"
                                >
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="size-14 object-contain group-hover:scale-105 transition-transform"
                                    />
                                    <span className="mt-2 text-[11px] font-semibold text-[#444444] line-clamp-1">
                                        {cat.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 8. PRODUK VIRAL JAKNOT (Video Reels Layout) */}
                    <div className="mt-4 bg-white p-4 rounded border border-[#e5e5e5]">
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📱</span>
                                <h3 className="text-sm font-bold text-[#222222]">Produk Viral Maknot</h3>
                            </div>
                            <button className="rounded border border-[#0099ff] px-3 py-1 text-[11px] font-semibold text-[#0099ff] bg-white hover:bg-[#e6f5ff]">
                                Lihat Semua
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {viralProducts.map((v, i) => (
                                <div
                                    key={i}
                                    className="relative aspect-9/16 w-full overflow-hidden rounded bg-black group cursor-pointer shadow-xs"
                                >
                                    <img
                                        src={v.img}
                                        alt={v.title}
                                        className="h-full w-full object-cover opacity-85 group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute top-3 left-3 flex size-6 items-center justify-center rounded-full bg-white/70 text-black">
                                        <Play className="size-3 fill-current ml-0.5" />
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 text-white">
                                        {v.sub && (
                                            <div className="text-[10px] text-[#ffd166] uppercase font-bold">
                                                {v.sub}
                                            </div>
                                        )}
                                        <div className="text-xs font-semibold line-clamp-2 leading-tight">
                                            {v.title}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 9. LAGI BANYAK DICARI (10 Pill search items) */}
                    <div className="mt-4 bg-white p-4 rounded border border-[#e5e5e5]">
                        <div className="flex items-center gap-2 pb-3 border-b border-[#f0f0f0]">
                            <Search className="size-4 text-[#0099ff]" />
                            <h3 className="text-sm font-bold text-[#222222]">Lagi Banyak Dicari</h3>
                        </div>

                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {popularSearches.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2.5 p-2 rounded border border-[#eeeeee] hover:border-[#0099ff] cursor-pointer bg-[#fafafa] hover:bg-white transition-all"
                                >
                                    <img src={item.img} alt={item.name} className="size-10 rounded object-cover" />
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-bold text-[#333333] truncate">{item.name}</div>
                                        <div className="text-[10px] text-[#888888]">{item.count}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 10. REKOMENDASI UNTUKMU (The signature 8-column high-density Jaknote grid) */}
                    <div className="mt-4 bg-white p-4 rounded border border-[#e5e5e5]">
                        <div className="flex items-center gap-2 pb-3 border-b border-[#f0f0f0]">
                            <span className="text-[#ff6000]">⭐</span>
                            <h3 className="text-sm font-bold text-[#222222]">Rekomendasi Untukmu</h3>
                        </div>

                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 2xl:gap-3.5">
                            {recommendations.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={handleAddToCart}
                                    className="cursor-pointer group flex flex-col justify-between rounded border border-[#e9e9e9] p-2 hover:border-[#ff6000] hover:shadow-xs transition-all bg-white"
                                >
                                    <div>
                                        <div className="relative aspect-square w-full overflow-hidden rounded bg-[#fafafa]">
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className="h-full w-full object-cover group-hover:scale-103 transition-transform"
                                            />
                                            {item.badge && (
                                                <span className="absolute top-1 left-1 rounded bg-[#0099ff] px-1 py-0.2 text-[8px] font-bold text-white uppercase">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="mt-2 text-[11px] font-medium text-[#222222] line-clamp-2 leading-snug group-hover:text-[#ff6000]">
                                            {item.title}
                                        </h4>

                                        {item.variant && (
                                            <span className="mt-1 inline-block rounded bg-[#f2f2f2] px-1.5 py-0.2 text-[9px] text-[#666666]">
                                                {item.variant}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 pt-1 border-t border-[#f5f5f5]">
                                        <div className="text-xs font-bold text-[#222222]">
                                            {formatRupiah(item.price)}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px]">
                                            <span className="text-[#999999] line-through">
                                                {formatRupiah(item.originalPrice)}
                                            </span>
                                            <span className="font-bold text-[#d32f2f]">{item.discount}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Centered Button */}
                        <div className="mt-6 flex justify-center pb-2">
                            <button className="rounded border border-[#0099ff] px-8 py-2 text-xs font-bold text-[#0099ff] bg-white hover:bg-[#e6f5ff] transition-colors">
                                Lihat Selanjutnya
                            </button>
                        </div>
                    </div>

                    {/* 11. INFO MENARIK JAKNOT / MAKNOT (Articles) */}
                    <div className="mt-4 bg-white p-4 rounded border border-[#e5e5e5]">
                        <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                            <div className="flex items-center gap-2">
                                <span className="text-base">📰</span>
                                <h3 className="text-sm font-bold text-[#222222]">Info Menarik Maknot</h3>
                            </div>
                            <button className="rounded border border-[#0099ff] px-3 py-1 text-[11px] font-semibold text-[#0099ff] bg-white hover:bg-[#e6f5ff]">
                                Lihat Semua
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {articles.map((art, idx) => (
                                <div key={idx} className="cursor-pointer group flex flex-col justify-between">
                                    <div>
                                        <div className="aspect-video w-full overflow-hidden rounded bg-[#fafafa]">
                                            <img
                                                src={art.img}
                                                alt={art.title}
                                                className="h-full w-full object-cover group-hover:scale-103 transition-transform"
                                            />
                                        </div>
                                        <h4 className="mt-2 text-xs font-bold text-[#333333] line-clamp-2 group-hover:text-[#0099ff]">
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

                    {/* 12. VALUE PROPOSITION STRIP (5 Icons) */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 bg-white p-6 rounded border border-[#e5e5e5] text-center">
                        <div className="flex flex-col items-center">
                            <Package className="size-8 text-[#0099ff] mb-2" />
                            <div className="text-xs font-bold text-[#222222]">Produk Terlengkap</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">Produk lengkap dan unik</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <Truck className="size-8 text-[#0099ff] mb-2" />
                            <div className="text-xs font-bold text-[#222222]">Pengiriman Tercepat</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">COD, Pickup, 1-day shipping tersedia</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <ShieldCheck className="size-8 text-[#0099ff] mb-2" />
                            <div className="text-xs font-bold text-[#222222]">Produk Terjamin</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">Toko terpercaya sejak 2026</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <Sparkles className="size-8 text-[#0099ff] mb-2" />
                            <div className="text-xs font-bold text-[#222222]">Potensi Keuntungan</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">Jual kembali dengan margin maksimal</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <Tag className="size-8 text-[#0099ff] mb-2" />
                            <div className="text-xs font-bold text-[#222222]">Harga Termurah</div>
                            <div className="text-[10px] text-[#777777] mt-0.5">Murah langsung dari sumbernya</div>
                        </div>
                    </div>

                    {/* 13. SEO DESCRIPTION / KENAPA HARUS DI MAKASSARNOTEBOOK */}
                    <div className="mt-6 bg-white p-6 rounded border border-[#e5e5e5] text-[11px] text-[#666666] leading-relaxed">
                        <h4 className="font-bold text-[#333333] text-xs">MakassarNotebook, Belanja #SudahPastiMurahnya</h4>
                        <p className="mt-1">
                            Selamat datang di MakassarNotebook, destinasi belanja online terbaik yang menyediakan barang-barang unik dan inovatif. Dengan slogan #SudahPastiMurahnya, MakassarNotebook menyediakan berbagai produk untuk memenuhi kebutuhan Anda.
                            Mulai dari peralatan rumah tangga, aksesoris komputer, perlengkapan outdoor, perlengkapan hobi, hingga smart home dengan harga terjangkau.
                        </p>

                        <h4 className="font-bold text-[#333333] text-xs mt-4">Kenapa Harus di MakassarNotebook?</h4>
                        <p className="mt-1">
                            Tak perlu ragu berbelanja di MakassarNotebook, destinasi belanja online terpercaya dengan jaringan toko fisik di kota Makassar (Panakkukang, Pettarani, dan Perintis Kemerdekaan / UNHAS). Semua barang telah melalui pemeriksaan ketat serta dikemas secara hati-hati agar bisa sampai dengan aman di tangan Anda.
                            Kami juga membuka peluang kemitraan bagi dropshipper se-Indonesia Timur dengan resi netral tanpa logo toko kami.
                        </p>
                    </div>

                    {/* 14. FOOTER (Download app, Links, & Blue Contact Center Box) */}
                    <footer className="mt-6 bg-white border border-[#e5e5e5] rounded overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                            {/* Left Content (9 cols) */}
                            <div className="lg:col-span-8 flex flex-col justify-between">
                                <div>
                                    <div className="text-xs font-bold text-[#333333] mb-2">Download Aplikasi MakassarNotebook</div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                            alt="Google Play"
                                            className="h-9 cursor-pointer"
                                        />
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                            alt="App Store"
                                            className="h-9 cursor-pointer"
                                        />
                                    </div>

                                    {/* 3 Link Columns */}
                                    <div className="grid grid-cols-3 gap-4 text-[11px]">
                                        <div>
                                            <h5 className="font-bold text-[#222222] mb-2">Layanan Pelanggan</h5>
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
                                            <h5 className="font-bold text-[#222222] mb-2">MakassarNotebook</h5>
                                            <ul className="space-y-1.5 text-[#666666]">
                                                <li><a href="#" className="hover:text-[#0099ff]">Tentang Kami</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Kontak Kami</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Karir</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Blog</a></li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="font-bold text-[#222222] mb-2">Ikuti Kami</h5>
                                            <ul className="space-y-1.5 text-[#666666]">
                                                <li><a href="#" className="hover:text-[#0099ff]">Tiktok</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Instagram</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">Facebook</a></li>
                                                <li><a href="#" className="hover:text-[#0099ff]">X</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Newsletter Form */}
                                <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
                                    <div className="text-[11px] font-bold text-[#333333]">
                                        Dapatkan <span className="text-[#ff6000]">penawaran menarik</span> kami! Dikirim mingguan
                                    </div>
                                    <div className="mt-2 flex max-w-md gap-2">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-8 flex-1 rounded border border-[#cccccc] px-3 text-xs placeholder-gray-400 focus:outline-none"
                                        />
                                        <button className="h-8 rounded bg-[#0099ff] px-4 text-xs font-bold text-white hover:bg-[#007acc]">
                                            Mulai Berlangganan
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Contact Center Box (Blue Card matching JakartaNotebook Design System) */}
                            <div id="toko-kami" className="lg:col-span-4 rounded-lg border border-[#166397]/30 bg-white overflow-hidden shadow-xs">
                                <div className="bg-[#166397] p-3 text-white font-bold text-sm flex items-center justify-between">
                                    <span>Contact Center</span>
                                    <span className="text-[10px] font-normal text-white/80">#SudahPastiMurahnya</span>
                                </div>
                                <div className="p-4 space-y-4 text-[11px]">
                                    <div>
                                        <div className="font-bold text-[#222222]">Pembelian Online</div>
                                        <div className="text-[#666666] mt-0.5">Telp : (0411) 39 700 200</div>
                                        <div className="text-[#666666]">Customer Service (WA) : <strong className="text-[#0099ff]">0899 721 7050</strong></div>
                                    </div>

                                    <div className="border-t border-[#f0f0f0] pt-3">
                                        <div className="flex items-center justify-between font-bold text-[#222222]">
                                            <span>Toko Kami</span>
                                            <span
                                                onClick={() => {
                                                    const branches: BranchKey[] = ['maricaya', 'panakkukang', 'pettarani', 'perintis'];
                                                    const nextIdx = (branches.indexOf(selectedBranch) + 1) % branches.length;
                                                    setSelectedBranch(branches[nextIdx]);
                                                }}
                                                className="text-[#0099ff] text-[10px] cursor-pointer hover:underline"
                                            >
                                                Ganti
                                            </span>
                                        </div>
                                        <div className="mt-1 font-semibold text-[#333333]">
                                            Makassar
                                        </div>

                                        <select
                                            value={selectedBranch}
                                            onChange={(e) => setSelectedBranch(e.target.value as BranchKey)}
                                            className="mt-1.5 w-full rounded-lg border border-[#cccccc] bg-[#fafafa] p-2 text-xs text-[#333333] focus:border-[#0099ff] focus:outline-none transition-colors cursor-pointer"
                                        >
                                            {(Object.keys(branchOptions) as BranchKey[]).map((key) => (
                                                <option key={key} value={key}>
                                                    {branchOptions[key].label}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="mt-2.5 text-[#666666] leading-relaxed">
                                            <div className="font-semibold text-[#222222]">{currentBranch.name}</div>
                                            <div>{currentBranch.address}</div>
                                            <a
                                                href={currentBranch.mapUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[#0099ff] font-semibold mt-1 hover:underline"
                                            >
                                                <MapPin className="size-3" /> Lihat google maps
                                            </a>
                                        </div>

                                        <div className="mt-2.5 text-[#666666]">
                                            <div>Telp : {currentBranch.phone}</div>
                                            <div>Whatsapp Sales / COD : <strong className="text-[#0099ff]">{currentBranch.waSales}</strong></div>
                                        </div>

                                        <div className="mt-2.5 text-[#666666]">
                                            <div className="font-semibold text-[#333333]">Jam buka:</div>
                                            <div>Senin - Sabtu : {currentBranch.hoursWeekday}</div>
                                            <div>Minggu/Libur Nasional : {currentBranch.hoursWeekend}</div>
                                            <div>Idul Fitri : libur</div>
                                        </div>
                                    </div>

                                    {/* Small Bottom Strip */}
                                    <div className="bg-[#f2f2f2] p-2.5 rounded-lg text-[10px] text-[#555555] flex justify-between items-center">
                                        <span>Beli langsung/self pickup di kota lainnya</span>
                                        <a href="#" className="text-[#0099ff] font-bold hover:underline">Selengkapnya</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Copyright & Payment Partners */}
                        <div className="bg-[#f9f9f9] border-t border-[#e5e5e5] px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#888888] gap-3">
                            <div>
                                Copyright, 2026. All rights reserved | <a href="#" className="hover:underline">Terms & Conditions</a>
                            </div>

                            <div className="flex items-center gap-3">
                                <span>Our partners</span>
                                <div className="flex items-center gap-2 font-bold text-xs text-[#005580]">
                                    <span className="rounded bg-white px-1.5 py-0.5 border border-[#ddd]">BCA</span>
                                    <span className="rounded bg-white px-1.5 py-0.5 border border-[#ddd]">MANDIRI</span>
                                    <span className="rounded bg-white px-1.5 py-0.5 border border-[#ddd]">BNI</span>
                                    <span className="rounded bg-white px-1.5 py-0.5 border border-[#ddd]">BRI</span>
                                    <span className="rounded bg-white px-1.5 py-0.5 border border-[#ddd]">QRIS</span>
                                </div>
                            </div>
                        </div>
                    </footer>

                    {/* Bottom Padding for floating button */}
                    <div className="h-10" />
                </main>

                {/* Floating WhatsApp Help Button (matching bottom right of jakartanotebook.png) */}
                <aside className="fixed bottom-4 right-4 z-50">
                    <a
                        href="https://wa.me/628997217050"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-full bg-[#0099ff] px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-[#007acc] transition-all"
                    >
                        <MessageCircle className="size-4 fill-current" />
                        <span>Butuh bantuan? Hubungi kami</span>
                    </a>
                </aside>
            </div>
        </>
    );
}
