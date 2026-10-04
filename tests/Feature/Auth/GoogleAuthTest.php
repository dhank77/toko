<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

test('login page displays google login button', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
    $response->assertSee('Masuk dengan Google');
});

test('user is redirected to google oauth', function () {
    Socialite::fake('google');

    $response = $this->get(route('auth.google.redirect'));

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('socialite.fake/google/authorize');
});

test('new user can authenticate and register via google', function () {
    $fakeUser = SocialiteUser::fake([
        'id' => 'google-unique-id-123',
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'avatar' => 'https://lh3.googleusercontent.com/a/fake-photo',
    ]);

    Socialite::fake('google', $fakeUser);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard', absolute: false));
    $this->assertAuthenticated();

    $user = User::where('email', 'budi@example.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->google_id)->toBe('google-unique-id-123')
        ->and($user->name)->toBe('Budi Santoso')
        ->and($user->avatar)->toBe('https://lh3.googleusercontent.com/a/fake-photo')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->role)->toBe('customer');
});

test('existing user with same email can authenticate and link google account', function () {
    $existingUser = User::factory()->create([
        'email' => 'siti@example.com',
        'name' => 'Siti Aminah',
        'google_id' => null,
    ]);

    $fakeUser = SocialiteUser::fake([
        'id' => 'google-siti-id-456',
        'name' => 'Siti Aminah',
        'email' => 'siti@example.com',
        'avatar' => 'https://lh3.googleusercontent.com/a/siti-photo',
    ]);

    Socialite::fake('google', $fakeUser);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard', absolute: false));
    $this->assertAuthenticatedAs($existingUser);

    $existingUser->refresh();
    expect($existingUser->google_id)->toBe('google-siti-id-456')
        ->and($existingUser->avatar)->toBe('https://lh3.googleusercontent.com/a/siti-photo');
});

test('google login gracefully redirects to login on provider error', function () {
    Socialite::fake('google', function () {
        throw new Exception('OAuth access denied');
    });

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['email']);
    $this->assertGuest();
});
