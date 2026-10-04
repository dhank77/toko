<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'transaction_reference' => 'MKN-'.fake()->unique()->numerify('########-####'),
            'gateway' => 'doku',
            'payment_channel' => null,
            'amount' => fake()->numberBetween(50000, 5000000),
            'status' => 'pending',
            'payment_url' => fake()->url(),
        ];
    }
}
