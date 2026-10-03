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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('branch')->default('Panakkukang');
            $table->string('fulfillment_type', 30)->default('pick_n_go'); // pick_n_go, delivery
            $table->string('status', 30)->default('ready_for_pickup'); // pending, processing, ready_for_pickup, shipped, completed, cancelled
            $table->string('pickup_pin', 20)->nullable();
            $table->string('pickup_rack', 50)->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('courier', 100)->nullable();
            $table->string('tracking_number', 100)->nullable();
            $table->string('payment_method', 50)->default('QRIS');
            $table->string('payment_status', 30)->default('paid'); // unpaid, paid
            $table->unsignedBigInteger('total_amount');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_name');
            $table->string('sku', 50)->nullable();
            $table->unsignedBigInteger('price');
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedBigInteger('subtotal');
            $table->string('thumbnail', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
