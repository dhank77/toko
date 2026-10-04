<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'MKN-'.fake()->unique()->numerify('########-####'),
            'user_id' => User::factory(),
            'branch' => 'Panakkukang',
            'fulfillment_type' => 'pick_n_go',
            'status' => 'pending_payment',
            'payment_method' => 'DOKU',
            'payment_status' => 'unpaid',
            'total_amount' => fake()->numberBetween(50000, 5000000),
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (): array => [
            'status' => 'ready_for_pickup',
            'payment_status' => 'paid',
            'pickup_pin' => '123-456',
            'pickup_rack' => 'Rak B-02',
        ]);
    }
}
