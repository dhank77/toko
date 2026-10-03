<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $komputerCategory = Category::firstOrCreate(
            ['name' => 'Komputer & Laptop'],
            ['slug' => 'komputer-laptop', 'icon' => '💻', 'sort_order' => 1, 'is_active' => true]
        );

        $kabelSubCategory = SubCategory::firstOrCreate(
            ['category_id' => $komputerCategory->id, 'name' => 'USB Hub & Converter'],
            ['slug' => 'usb-hub-converter', 'sort_order' => 7, 'is_active' => true]
        );

        // 1. The exact product from detail.png
        Product::updateOrCreate(
            ['sku' => 'OMSCYTWH'],
            [
                'name' => 'Kotak Organizer Kabel Charger Wire Cable Management Box Dustproof - FT-400 - White',
                'slug' => 'kotak-organizer-kabel-charger-wire-cable-management-box-dustproof-ft-400-white',
                'category_id' => $komputerCategory->id,
                'sub_category_id' => $kabelSubCategory->id,
                'brand' => 'Lainnya',
                'color' => 'White',
                'price' => 43700,
                'original_price' => 75000,
                'discount_percent' => 42,
                'stock' => 38,
                'weight_grams' => 1300,
                'warranty' => '7 Hari',
                'package_dimension' => '33 x 14 x 12 cm',
                'overview' => 'Kotak ini berfungsi untuk mengorganisir dan mengatur kabel agar terlihat lebih rapi dan tidak berantakan. Stop kontak dan kabel listrik lainnya akan tersembunyi di balik kotak manajemen kabel ini. Selain membuat meja Anda lebih rapi, juga membuat stop kontak terhindar dari debu yang mengakibatkan kerusakan, sehingga penggunaannya lebih awet dalam jangka panjang.',
                'description' => 'Kotak manajemen kabel serbaguna ini memiliki rongga ventilasi khusus di sisi kiri dan kanan untuk jalur keluar kabel adaptor, charger, dan power strip. Dilengkapi tutup atas yang mudah dibuka dan anti-debu (dustproof), menjaga lingkungan kerja atau meja belajar Anda selalu bersih dan aman dari jangkauan anak-anak atau hewan peliharaan.',
                'features' => [
                    [
                        'title' => 'Kotak Manajemen Kabel Serbaguna',
                        'description' => 'Kotak ini dapat digunakan untuk berbagai kebutuhan mulai dari mengelola kabel komputer, laptop hingga kabel charger smartphone dan tablet. Dengan tampilan kabel yang lebih rapi, maka ruangan Anda akan tampak lebih estetis dan nyaman dilihat.',
                    ],
                    [
                        'title' => 'Desain Anti Debu & Sirkulasi Udara Baik',
                        'description' => 'Dilengkapi penutup atas presisi yang mencegah debu menumpuk di stop kontak dan colokan listrik, serta celah sirkulasi panas agar peralatan listrik tetap dingin.',
                    ],
                ],
                'specifications' => [
                    ['key' => 'Material', 'value' => 'Plastik ABS'],
                    ['key' => 'Dimensi', 'value' => 'Panjang: 32 cm, Lebar: 13 cm, Tinggi: 11 cm'],
                    ['key' => 'Warna', 'value' => 'White (Putih)'],
                ],
                'whats_in_the_box' => [
                    '1 x Kotak Organizer Kabel Charger Wire Cable Management Box Dustproof - FT-400',
                ],
                'thumbnail' => 'https://upload.jaknot.com/2026/07/images/products/3743d3/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpg',
                'images' => [
                    'https://upload.jaknot.com/2026/07/images/products/3743d3/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpg',
                    'https://upload.jaknot.com/2026/07/images/products/33168c/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpeg',
                    'https://upload.jaknot.com/2026/07/images/products/c0fe09/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpeg',
                    'https://upload.jaknot.com/2026/07/images/products/2a09d2/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpeg',
                ],
                'rating' => 5.0,
                'review_count' => 5,
                'is_active' => true,
                'is_featured' => true,
            ]
        );

        // 2. Additional variant (Gray)
        Product::updateOrCreate(
            ['sku' => 'OMSCYTGY'],
            [
                'name' => 'Kotak Organizer Kabel Charger Wire Cable Management Box Dustproof - FT-400 - Gray',
                'slug' => 'kotak-organizer-kabel-charger-wire-cable-management-box-dustproof-ft-400-gray',
                'category_id' => $komputerCategory->id,
                'sub_category_id' => $kabelSubCategory->id,
                'brand' => 'Lainnya',
                'color' => 'Gray',
                'price' => 43700,
                'original_price' => 75000,
                'discount_percent' => 42,
                'stock' => 15,
                'weight_grams' => 1300,
                'warranty' => '7 Hari',
                'package_dimension' => '33 x 14 x 12 cm',
                'overview' => 'Kotak manajemen kabel varian warna Abu-abu (Gray) elegan untuk meja kerja minimalis.',
                'description' => 'Varian warna abu-abu netral dengan finishing matte halus yang menyatu dengan estetika meja modern.',
                'features' => [
                    [
                        'title' => 'Warna Elegan Gray Matte',
                        'description' => 'Cocok untuk tema setup meja kerja dark mode atau monokrom.',
                    ],
                ],
                'specifications' => [
                    ['key' => 'Material', 'value' => 'Plastik ABS'],
                    ['key' => 'Dimensi', 'value' => 'Panjang: 32 cm, Lebar: 13 cm, Tinggi: 11 cm'],
                ],
                'whats_in_the_box' => [
                    '1 x Kotak Organizer Kabel Charger FT-400 - Gray',
                ],
                'thumbnail' => 'https://upload.jaknot.com/2026/07/images/products/33168c/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpeg',
                'images' => [
                    'https://upload.jaknot.com/2026/07/images/products/33168c/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpeg',
                ],
                'rating' => 4.9,
                'review_count' => 3,
                'is_active' => true,
                'is_featured' => false,
            ]
        );

        // 3. Products from the recommendation section in detail.png
        $recommended = [
            [
                'sku' => 'OMHZHCBK',
                'name' => 'Klip Kabel Tempel Cable Clip Management Adhesive Wire Organizer 20 PCS - FC-20',
                'price' => 7900,
                'original_price' => 15000,
                'brand' => 'Taffware',
                'stock' => 120,
            ],
            [
                'sku' => 'OMUAD8BK',
                'name' => 'CHN Klip Pengatur Kabel Organizer Cable Clip 20 PCS - FT8018-3',
                'price' => 5400,
                'original_price' => 12000,
                'brand' => 'CHN',
                'stock' => 85,
            ],
            [
                'sku' => 'ORUA01BK',
                'name' => 'ORICO Cable Clip Cross Holder Manajemen Kabel 1 PCS - CBSX',
                'price' => 3600,
                'original_price' => 14000,
                'brand' => 'ORICO',
                'stock' => 60,
            ],
            [
                'sku' => 'OMCP10WD',
                'name' => 'CARPRIE Kotak Organizer Manajemen Kabel Charger Kayu - FT-100',
                'price' => 68600,
                'original_price' => 111000,
                'brand' => 'CARPRIE',
                'stock' => 20,
            ],
        ];

        foreach ($recommended as $item) {
            Product::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']).'-'.strtolower($item['sku']),
                    'category_id' => $komputerCategory->id,
                    'sub_category_id' => $kabelSubCategory->id,
                    'brand' => $item['brand'],
                    'color' => 'Black',
                    'price' => $item['price'],
                    'original_price' => $item['original_price'],
                    'discount_percent' => (int) round((($item['original_price'] - $item['price']) / $item['original_price']) * 100),
                    'stock' => $item['stock'],
                    'weight_grams' => 250,
                    'warranty' => '7 Hari',
                    'package_dimension' => '15 x 10 x 5 cm',
                    'overview' => 'Aksesoris manajemen kabel berkualitas untuk kerapian meja kerja Anda.',
                    'description' => 'Solusi cepat dan hemat merapikan kabel berserakan di kantor maupun rumah.',
                    'features' => [
                        ['title' => 'Perekat 3M Kuat', 'description' => 'Dapat ditempel di permukaan kayu, kaca, keramik, maupun logam.'],
                    ],
                    'specifications' => [
                        ['key' => 'Material', 'value' => 'Silicone / Plastik'],
                    ],
                    'whats_in_the_box' => [
                        '1 x '.$item['name'],
                    ],
                    'thumbnail' => 'https://upload.jaknot.com/2026/07/images/products/3743d3/original/kotak-organizer-kabel-charger-wire-cable-management-box.jpg',
                    'rating' => 4.8,
                    'review_count' => 12,
                    'is_active' => true,
                    'is_featured' => false,
                ]
            );
        }

        // 4. Products for other departments
        $otherProducts = [
            // Outdoor & Olahraga
            [
                'cat_slug' => 'outdoor-olahraga',
                'sku' => 'PT-CHAIR-144',
                'name' => 'Patio Kursi Lipat Outdoor Camping Portable Oxford 600D Folding Chair',
                'brand' => 'Patio',
                'color' => 'Army Green',
                'price' => 89000,
                'original_price' => 159000,
                'stock' => 50,
                'thumbnail' => 'https://upload.jaknot.com/2025/09/images/products/214dc9/icon/patio-kursi-lipat-outdoor-camping-portable-oxford-600d-folding-chair-pt144.jpg',
            ],
            [
                'cat_slug' => 'outdoor-olahraga',
                'sku' => 'NC-MH12-PRO',
                'name' => 'Nitecore Senter LED NiteLab UHi 40 Tactical IP68 3300 Lumens MH12 Pro',
                'brand' => 'Nitecore',
                'color' => 'Tactical Black',
                'price' => 749000,
                'original_price' => 1150000,
                'stock' => 15,
                'thumbnail' => 'https://upload.jaknot.com/2026/06/images/products/488f77/icon/nitecore-senter-led-nitelab-uhi-40-tactical-ip68-3300-lumens-mh12-pro.png',
            ],
            [
                'cat_slug' => 'outdoor-olahraga',
                'sku' => 'TK-CAMP-2L',
                'name' => 'Teko Alat Masak Camping Outdoor Anodized Aluminium 2L Kapasitas Besar',
                'brand' => 'Fire-Maple',
                'color' => 'Dark Grey',
                'price' => 122600,
                'original_price' => 190900,
                'stock' => 30,
                'thumbnail' => 'https://upload.jaknot.com/2026/07/images/products/deec3d/icon/0.jpg',
            ],
            // Handphone & Tablet
            [
                'cat_slug' => 'handphone-tablet',
                'sku' => 'TW-TYPEC-PD20',
                'name' => 'Taffware Kabel Charger Type-C to Lightning PD 20W Fast Charging Braided',
                'brand' => 'Taffware',
                'color' => 'Black 1.2M',
                'price' => 21900,
                'original_price' => 45000,
                'stock' => 100,
                'thumbnail' => 'https://upload.jaknot.com/2026/06/images/products/4f2ef3/icon/0.jpg',
            ],
            [
                'cat_slug' => 'handphone-tablet',
                'sku' => 'BS-CAR-MOUNT',
                'name' => 'Baseus Car Mount Holder HP Mobil Dashboard & Air Vent Gravity Sensor',
                'brand' => 'Baseus',
                'color' => 'Silver Metallic',
                'price' => 64900,
                'original_price' => 109000,
                'stock' => 40,
                'thumbnail' => 'https://upload.jaknot.com/2026/07/images/products/c6aa8c/icon/0.jpg',
            ],
            // TV & Elektronik
            [
                'cat_slug' => 'tv-elektronik',
                'sku' => 'AP-TRIPOD-SPK',
                'name' => 'Apir Tripod Stand Speaker Audio System Heavy Duty All Metal 97-200cm',
                'brand' => 'Apir',
                'color' => 'Matte Black',
                'price' => 139000,
                'original_price' => 219000,
                'stock' => 25,
                'thumbnail' => 'https://upload.jaknot.com/2026/08/images/products/a32ff1/icon/apir-tripod-stand-speaker-audio-system-97-200cm-all-metal-sps-510m.jpg',
            ],
            [
                'cat_slug' => 'tv-elektronik',
                'sku' => 'GS-HEADPHONE',
                'name' => 'Gorsun Headphone Bluetooth Wireless Over-Ear Foldable Deep Bass E62',
                'brand' => 'Gorsun',
                'color' => 'Matte Grey',
                'price' => 99000,
                'original_price' => 165000,
                'stock' => 35,
                'thumbnail' => 'https://upload.jaknot.com/2026/08/images/products/6007b8/icon/0.jpg',
            ],
            // Rumah Tangga & Dapur
            [
                'cat_slug' => 'rumah-tangga-dapur',
                'sku' => 'QT-GLOVE-LATEX',
                'name' => 'Qitu Sarung Tangan Latex Cuci Piring Waterproof Extra Thick 1 Pasang',
                'brand' => 'Qitu',
                'color' => 'Yellow Large',
                'price' => 12500,
                'original_price' => 22000,
                'stock' => 80,
                'thumbnail' => 'https://upload.jaknot.com/2026/04/images/products/33219f/icon/qitu-sarung-tangan-latex-cuci-piring-cleaning-gloves-extra-thick-a303.png',
            ],
            [
                'cat_slug' => 'rumah-tangga-dapur',
                'sku' => 'ZF-POMPA-BAN',
                'name' => 'Zifei Pompa Ban Mobil Elektrik Portable Inflator Digital LED Screen 150 PSI',
                'brand' => 'Zifei',
                'color' => 'Wireless Battery',
                'price' => 198000,
                'original_price' => 320000,
                'stock' => 22,
                'thumbnail' => 'https://upload.jaknot.com/2026/05/images/products/65d1d6/icon/0.jpg',
            ],
            // Hobi & Mainan
            [
                'cat_slug' => 'hobi-mainan',
                'sku' => 'TK-MOBIL-ROBOT',
                'name' => 'Takara Mainan Mobil Robot Transformers 2in1 Deformation Toy Auto',
                'brand' => 'Takara',
                'color' => 'Jet Black',
                'price' => 32800,
                'original_price' => 59900,
                'stock' => 60,
                'thumbnail' => 'https://upload.jaknot.com/2024/07/images/products/d4cf2b/thumbnail/takara-mainan-mobil-robot-transformers-2in1-deformation-toy-tk21.png',
            ],
            [
                'cat_slug' => 'hobi-mainan',
                'sku' => 'FM-RUBIK-3X3',
                'name' => 'FMA Mainan Kubus Rubik Carbon Fiber Magic Cube 3x3x3 Speed Cube',
                'brand' => 'FMA',
                'color' => 'Carbon Mix Color',
                'price' => 14200,
                'original_price' => 30900,
                'stock' => 90,
                'thumbnail' => 'https://upload.jaknot.com/2025/05/images/products/44265d/thumbnail/fma-mainan-kubus-rubik-carbon-fiber-magic-cube-3x3x3-fmm3.jpg',
            ],
            [
                'cat_slug' => 'hobi-mainan',
                'sku' => 'MG-PIANO-61K',
                'name' => 'Maygiv Piano Digital Elektrik Mainan Anak 61-Key with Microphone',
                'brand' => 'Maygiv',
                'color' => 'Black',
                'price' => 120300,
                'original_price' => 187900,
                'stock' => 18,
                'thumbnail' => 'https://upload.jaknot.com/2026/07/images/products/2d6d09/thumbnail/maygiv-piano-digital-elektrik-mainan-anak-61-key-with-microphone-mq-6185.jpg',
            ],
            [
                'cat_slug' => 'hobi-mainan',
                'sku' => 'SV-DRONE-4K',
                'name' => 'Sivery Drone 4K Dual Camera Stunt Roll Optical Flow Hovering',
                'brand' => 'Sivery',
                'color' => 'Stealth Grey',
                'price' => 229900,
                'original_price' => 380900,
                'stock' => 14,
                'thumbnail' => 'https://upload.jaknot.com/2026/01/images/products/5b529a/thumbnail/sivery-drone-4k-dual-camera-stunt-roll-optical-flow-hovering-1800mah-h16.jpg',
            ],
        ];

        foreach ($otherProducts as $op) {
            $cat = Category::where('slug', $op['cat_slug'])->first();
            if (! $cat) {
                continue;
            }

            $subCat = SubCategory::where('category_id', $cat->id)->first();

            Product::updateOrCreate(
                ['sku' => $op['sku']],
                [
                    'name' => $op['name'],
                    'slug' => Str::slug($op['name']).'-'.strtolower($op['sku']),
                    'category_id' => $cat->id,
                    'sub_category_id' => $subCat?->id,
                    'brand' => $op['brand'],
                    'color' => $op['color'],
                    'price' => $op['price'],
                    'original_price' => $op['original_price'],
                    'discount_percent' => (int) round((($op['original_price'] - $op['price']) / $op['original_price']) * 100),
                    'stock' => $op['stock'],
                    'weight_grams' => 500,
                    'warranty' => '7 Hari',
                    'package_dimension' => '20 x 15 x 10 cm',
                    'overview' => 'Produk berkualitas terbaik MakassarNotebook dengan jaminan harga termurah.',
                    'description' => 'Produk pilihan untuk memenuhi kebutuhan harian Anda dengan standar mutu tinggi.',
                    'features' => [
                        ['title' => 'Kualitas Premium', 'description' => 'Material kokoh dan awet digunakan.'],
                    ],
                    'specifications' => [
                        ['key' => 'Brand', 'value' => $op['brand']],
                        ['key' => 'Warna', 'value' => $op['color']],
                    ],
                    'whats_in_the_box' => [
                        '1 x '.$op['name'],
                    ],
                    'thumbnail' => $op['thumbnail'],
                    'rating' => 4.9,
                    'review_count' => 8,
                    'is_active' => true,
                    'is_featured' => true,
                ]
            );
        }
    }
}
