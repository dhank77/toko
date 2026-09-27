<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * @var array<int, array{name: string, icon: string, sub_categories: list<string>}>
     */
    private array $data = [
        [
            'name' => 'Komputer & Laptop',
            'icon' => '💻',
            'sub_categories' => ['Keyboard', 'Mouse', 'Cooling Pad', 'Stand Laptop', 'Webcam', 'Pelindung Laptop', 'USB Hub & Converter', 'Kabel HDMI & DP', 'SSD & Enclosure'],
        ],
        [
            'name' => 'Handphone & Tablet',
            'icon' => '📱',
            'sub_categories' => ['Kabel Charger & Data', 'Holder HP Mobil & Motor', 'Fast Charger GaN', 'Stylus Pen', 'Power Bank', 'Cooler HP Gaming', 'Screen Protector'],
        ],
        [
            'name' => 'TV & Elektronik',
            'icon' => '📺',
            'sub_categories' => ['Bracket TV LED & Monitor', 'Antena Digital DVB-T2', 'Remote TV Universal', 'Android TV Box', 'Kabel Audio Optik', 'Converter Audio DAC'],
        ],
        [
            'name' => 'Outdoor & Olahraga',
            'icon' => '🏕️',
            'sub_categories' => ['Kursi Lipat Camping', 'Tenda Camping', 'Kompor Gas Portable', 'Soft Flask & Water Bladder', 'Karabiner & Paracord', 'Senter Tactical LED'],
        ],
        [
            'name' => 'Rumah Tangga & Dapur',
            'icon' => '🏠',
            'sub_categories' => ['Alat Masak Camping', 'Timbangan Dapur Digital', 'Dispenser Sabun Otomatis', 'Rak Organizer Serbaguna', 'Lampu Meja LED', 'Perangkap Nyamuk'],
        ],
        [
            'name' => 'Otomotif & Motor',
            'icon' => '🏍️',
            'sub_categories' => ['Holder HP Motor Waterproof', 'Cover Jok Motor & Mobil', 'Pompa Ban Elektrik Portable', 'Tutup Pentil Glow in Dark', 'Lap Microfiber Mobil'],
        ],
        [
            'name' => 'Hobi & Mainan',
            'icon' => '🎮',
            'sub_categories' => ['Rubik Carbon Fiber', 'Bricks & Balok Susun', 'Drone Camera 4K', 'Display Box Action Figure', 'Piano Mainan Anak', 'Boneka Talking Parrot'],
        ],
        [
            'name' => 'Kesehatan & Personal Care',
            'icon' => '💊',
            'sub_categories' => ['Oximeter Saturasi Oksigen', 'Alat Bantu Tongkat Lipat', 'Gunting Kuku Set Stainless', 'Nebulizer Portable', 'Kacamata Baca Anti Radiasi'],
        ],
    ];

    public function run(): void
    {
        foreach ($this->data as $index => $categoryData) {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($categoryData['name'])],
                [
                    'name' => $categoryData['name'],
                    'icon' => $categoryData['icon'],
                    'is_active' => true,
                    'sort_order' => $index,
                ]
            );

            foreach ($categoryData['sub_categories'] as $subIndex => $subName) {
                SubCategory::firstOrCreate(
                    ['slug' => Str::slug($subName)],
                    [
                        'category_id' => $category->id,
                        'name' => $subName,
                        'is_active' => true,
                        'sort_order' => $subIndex,
                    ]
                );
            }
        }
    }
}
