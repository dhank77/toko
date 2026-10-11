import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('login page renders', async ({ app, screen }) => {
  await app.open('/login');

  await expect(screen.getByRole('heading', 'Log in to your account')).toBeVisible();
  await expect(screen.getByPlaceholder('email@example.com')).toBeVisible();
  await expect(screen.getByPlaceholder('Password')).toBeVisible();
  await expect(screen.getByRole('link', 'Masuk dengan Google')).toBeVisible();
  await expect(screen.getByRole('button', 'Log in')).toBeVisible();
  await expect(screen.getByRole('link', 'Sign up')).toBeVisible();
});

test('register page renders buyer form', async ({ app, screen }) => {
  await app.open('/register');

  await expect(
    screen.getByRole('heading', 'Daftar Akun Pembeli (Client)'),
  ).toBeVisible();
  await expect(screen.getByPlaceholder('Contoh: Muhammad Ilham')).toBeVisible();
  await expect(screen.getByPlaceholder('nama@email.com')).toBeVisible();
  await expect(screen.getByRole('button', 'Daftar Sebagai Pembeli')).toBeVisible();
  await expect(screen.getByRole('link', 'Masuk ke Akun')).toBeVisible();
});

test('forgot password page renders', async ({ app, screen }) => {
  await app.open('/forgot-password');

  await expect(screen.getByRole('heading', 'Forgot password')).toBeVisible();
  await expect(screen.getByPlaceholder('email@example.com')).toBeVisible();
  await expect(
    screen.getByRole('button', 'Email password reset link'),
  ).toBeVisible();
});

test('reset password page renders with token', async ({ app, screen }) => {
  await app.open('/reset-password/tokenpalsu123?email=test@example.com');

  await expect(screen.getByText('Reset password').first()).toBeVisible();
  await expect(screen.getByRole('button', 'Reset password')).toBeVisible();
});

test('invalid login shows error', async ({ app, screen }) => {
  await app.open('/login');

  await screen.getByPlaceholder('email@example.com').fill('tidakada@example.com');
  await screen.getByPlaceholder('Password').fill('salah-password-123');
  await screen.getByRole('button', 'Log in').tap();

  await expect(
    screen.getByText('These credentials do not match our records.'),
  ).toBeVisible();
});

test('google redirect leaves the app', async ({ app, browser }) => {
  await app.open('/auth/google/redirect');

  await expect(browser).toHaveURL(/google/);
});

test('email verification page requires login', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/email/verify');

  await expect(browser).toHaveURL(/login/);
  await expect(
    screen.getByRole('heading', 'Log in to your account'),
  ).toBeVisible();
});
