<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'slug',
        'category_id',
        'sub_category_id',
        'brand',
        'color',
        'price',
        'original_price',
        'discount_percent',
        'stock',
        'weight_grams',
        'warranty',
        'package_dimension',
        'overview',
        'description',
        'features',
        'specifications',
        'whats_in_the_box',
        'thumbnail',
        'images',
        'rating',
        'review_count',
        'is_active',
        'is_featured',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'features' => 'array',
            'specifications' => 'array',
            'whats_in_the_box' => 'array',
            'images' => 'array',
            'price' => 'integer',
            'original_price' => 'integer',
            'discount_percent' => 'integer',
            'stock' => 'integer',
            'weight_grams' => 'integer',
            'rating' => 'float',
            'review_count' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            if (empty($product->slug)) {
                $baseSlug = Str::slug($product->name);
                $skuSlug = ! empty($product->sku) ? '-'.Str::slug($product->sku) : '';
                $product->slug = $baseSlug.$skuSlug;
            }

            // Auto calculate discount percent if original price exists and is higher
            if (! empty($product->original_price) && $product->original_price > $product->price) {
                $product->discount_percent = (int) round((($product->original_price - $product->price) / $product->original_price) * 100);
            } elseif (empty($product->original_price)) {
                $product->discount_percent = null;
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }
}
