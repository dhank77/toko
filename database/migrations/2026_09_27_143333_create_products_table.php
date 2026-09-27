<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku', 50)->unique();
            $table->string('name', 255);
            $table->string('slug', 255)->unique();

            // Category & Sub-category
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('sub_category_id')->nullable()->constrained('sub_categories')->nullOnDelete();

            // Brand & Varian
            $table->string('brand', 100)->default('Lainnya');
            $table->string('color', 50)->nullable(); // e.g. White, Gray, Black

            // Pricing & Discount
            $table->unsignedBigInteger('price'); // Harga jual aktif
            $table->unsignedBigInteger('original_price')->nullable(); // Harga coret sebelum diskon
            $table->unsignedSmallInteger('discount_percent')->nullable(); // Diskon (persentase)

            // Stock & Weight
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('weight_grams')->default(500); // dalam gram

            // Warranty & Dimension
            $table->string('warranty', 100)->default('7 Hari'); // e.g. 7 Hari, 1 Bulan, 1 Tahun
            $table->string('package_dimension', 100)->nullable(); // e.g. '33 x 14 x 12 cm'

            // Descriptions & Details
            $table->text('overview')->nullable(); // Ringkasan singkat produk
            $table->longText('description')->nullable(); // Deskripsi lengkap

            // Rich attributes from detail.png
            $table->json('features')->nullable(); // [{title: "...", description: "..."}]
            $table->json('specifications')->nullable(); // [{key: "Material", value: "Plastik ABS"}, ...]
            $table->json('whats_in_the_box')->nullable(); // ["1 x Kotak Organizer...", ...]

            // Media
            $table->string('thumbnail', 500)->nullable();
            $table->json('images')->nullable(); // Gallery images array

            // Rating & Metrics
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->unsignedInteger('review_count')->default(0);

            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);

            $table->timestamps();

            // Indexes
            $table->index('category_id');
            $table->index('sub_category_id');
            $table->index('brand');
            $table->index('price');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
