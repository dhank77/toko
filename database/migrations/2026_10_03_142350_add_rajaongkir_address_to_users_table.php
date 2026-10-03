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
            $table->string('province', 100)->nullable()->after('city');
            $table->string('province_id', 20)->nullable()->after('province');
            $table->string('city_id', 20)->nullable()->after('city');
            $table->string('district', 100)->nullable()->after('city_id');
            $table->string('district_id', 20)->nullable()->after('district');
            $table->string('subdistrict', 100)->nullable()->after('district_id');
            $table->string('subdistrict_id', 20)->nullable()->after('subdistrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'province',
                'province_id',
                'city_id',
                'district',
                'district_id',
                'subdistrict',
                'subdistrict_id',
            ]);
        });
    }
};
