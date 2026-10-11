<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Ambil nilai pengaturan berdasarkan kunci dengan cache.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::rememberForever("app_setting:{$key}", function () use ($key, $default): mixed {
            $setting = static::where('key', $key)->first();

            return $setting !== null && $setting->value !== null ? $setting->value : $default;
        });
    }

    /**
     * Simpan atau perbarui nilai pengaturan.
     */
    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value !== null ? (string) $value : null]
        );

        Cache::forget("app_setting:{$key}");
    }

    /**
     * Ambil beberapa nilai pengaturan sekaligus.
     *
     * @param  array<string, mixed>  $defaults
     * @return array<string, mixed>
     */
    public static function getMany(array $keys, array $defaults = []): array
    {
        $results = [];

        foreach ($keys as $key) {
            $default = $defaults[$key] ?? null;
            $results[$key] = static::get($key, $default);
        }

        return $results;
    }
}
