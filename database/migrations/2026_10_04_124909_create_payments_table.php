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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('transaction_reference', 100)->unique();
            $table->string('gateway', 30)->default('doku');
            $table->string('payment_channel', 50)->nullable();
            $table->unsignedBigInteger('amount');
            $table->string('status', 20)->default('pending'); // pending, success, failed, expired
            $table->text('payment_url')->nullable();
            $table->string('va_number', 50)->nullable();
            $table->json('raw_payload')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
