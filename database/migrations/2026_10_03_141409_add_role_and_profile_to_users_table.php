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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('email')->index();
            $table->string('phone', 30)->nullable()->after('role');
            $table->text('address')->nullable()->after('phone');
            $table->string('city', 100)->nullable()->default('Makassar')->after('address');
            $table->string('postal_code', 20)->nullable()->after('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'address', 'city', 'postal_code']);
        });
    }
};
