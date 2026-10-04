<?php

use App\Http\Controllers\Api\PaymentWebhookController;
use Illuminate\Support\Facades\Route;

// Prefix "/api" ditambahkan otomatis oleh Laravel.
Route::post('/webhooks/doku', [PaymentWebhookController::class, 'handleDoku'])->name('webhooks.doku');
