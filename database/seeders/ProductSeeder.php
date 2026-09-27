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
    }
}
