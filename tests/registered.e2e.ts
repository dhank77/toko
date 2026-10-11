import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

// Authenticated buyer coverage. Needs the seeded verified customer:
//   php artisan tinker --execute 'App\Models\User::updateOrCreate(["email" => "e2e-buyer@example.com"], ["name" => "E2E Buyer", "password" => Hash::make("Password123"), "role" => "customer", "email_verified_at" => now()]);'
const BUYER_EMAIL = 'e2e-buyer@example.com';
const BUYER_PASSWORD = 'Password123';

test('new buyer lands on email verification', async ({
  app,
  screen,
  browser,
}) => {
  const stamp = Date.now();

  await app.open('/register');
  await screen.getByPlaceholder('Contoh: Muhammad Ilham').fill(`Verify ${stamp}`);
  await screen
    .getByPlaceholder('nama@email.com')
    .fill(`verify+${stamp}@example.com`);
  await screen.getByPlaceholder('Minimal 8 karakter').fill('Password123');
  await screen.getByPlaceholder('Ulangi kata sandi').fill('Password123');
  await screen.getByRole('button', 'Daftar Sebagai Pembeli').tap();

  // Registration sends the verification mail, so allow extra time.
  await expect(browser).toHaveURL(/email\/verify/, { timeout: 30_000 });
  await expect(
    screen.getByRole('button', 'Resend verification email'),
  ).toBeVisible();
});

test('verified buyer logs in to client portal', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/login');
  await screen.getByPlaceholder('email@example.com').fill(BUYER_EMAIL);
  await screen.getByPlaceholder('Password').fill(BUYER_PASSWORD);
  await screen.getByRole('button', 'Log in').tap();

  await expect(browser).toHaveURL(/client/);
  await expect(screen.getByText('Halo, E2E Buyer!')).toBeVisible();
  await expect(
    screen.getByRole('button', 'Profil & Kontak Pembeli'),
  ).toBeVisible();
  await expect(
    screen.getByRole('button', 'Riwayat Pesanan', { exact: false }),
  ).toBeVisible();
  await expect(
    screen.getByRole('button', 'Keranjang Belanja', { exact: false }),
  ).toBeVisible();

  await screen.getByRole('button', 'Keranjang Belanja', { exact: false }).tap();
  await expect(
    screen.getByRole('heading', 'Keranjang Belanja Anda Masih Kosong'),
  ).toBeVisible();

  await app.open('/settings/profile');
  await expect(screen.getByRole('heading', 'Profile')).toBeVisible();
  await expect(screen.getByRole('button', 'Save')).toBeVisible();
});
