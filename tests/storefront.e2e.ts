import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

const CATEGORY_SLUG = 'komputer-laptop';
const PRODUCT_SLUG =
  'kotak-organizer-kabel-charger-wire-cable-management-box-dustproof-ft-400-white';

test('homepage storefront loads', async ({ app, screen }) => {
  await app.open('/');

  await expect(screen.getByPlaceholder('Cari produk di toko...')).toBeVisible();
  await expect(screen.getByText('makassar', { exact: false }).first()).toBeVisible();
  await expect(screen.getByRole('button', 'Buka Kategori')).toBeVisible();
});

test('category page lists products', async ({ app, screen }) => {
  await app.open(`/categories/${CATEGORY_SLUG}`);

  await expect(screen.getByRole('heading', 'Komputer & Laptop')).toBeVisible();
  await expect(screen.getByText('Total', { exact: false })).toBeVisible();
});

test('product detail shows buy box and add to cart toast', async ({
  app,
  screen,
}) => {
  await app.open(`/products/${PRODUCT_SLUG}`);

  await expect(screen.getByText('Atur Jumlah Pembelian')).toBeVisible();
  await expect(screen.getByRole('button', '+ Keranjang')).toBeVisible();
  await expect(screen.getByRole('button', 'Beli Sekarang')).toBeVisible();

  await screen.getByRole('button', '+ Keranjang').tap();
  await expect(
    screen.getByText('Berhasil menambahkan', { exact: false }),
  ).toBeVisible();
});

test('guest buy-now redirects to login', async ({ app, screen, browser }) => {
  await app.open(`/products/${PRODUCT_SLUG}`);

  await screen.getByRole('button', 'Beli Sekarang').tap();
  await expect(browser).toHaveURL(/login/);
});

test('search shows popular keywords dropdown', async ({ app, screen }) => {
  await app.open('/');

  const searchbox = screen.getByPlaceholder('Cari produk di toko...');
  await searchbox.tap();
  await searchbox.pressSequentially('kabel');

  await expect(screen.getByText('Paling Sering Dicari')).toBeVisible();
});

test('category sort updates url and keeps list', async ({
  app,
  screen,
  browser,
}) => {
  await app.open(`/categories/${CATEGORY_SLUG}`);

  await screen
    .getByRole('combobox')
    .filter({ has: screen.getByRole('option', 'Harga Terendah') })
    .selectOption('Harga Terendah');

  await expect(browser).toHaveURL(/sort=price_low/);
  await expect(screen.getByRole('heading', 'Komputer & Laptop')).toBeVisible();
});

test('product breadcrumb home returns to homepage', async ({
  app,
  screen,
  browser,
}) => {
  await app.open(`/products/${PRODUCT_SLUG}`);

  await screen.getByRole('link', 'Home').tap();

  await expect(browser).toHaveURL(/\/$/);
  await expect(screen.getByPlaceholder('Cari produk di toko...')).toBeVisible();
});

test('product related link opens category', async ({
  app,
  screen,
  browser,
}) => {
  await app.open(`/products/${PRODUCT_SLUG}`);

  await screen.getByRole('link', 'Lihat Semua di', { exact: false }).tap();

  await expect(browser).toHaveURL(`/categories/${CATEGORY_SLUG}`);
});

test('cart link as guest redirects to login', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/');

  await screen.getByRole('link', 'Keranjang Belanja').tap();

  await expect(browser).toHaveURL(/login/);
});

test('unknown product slug shows not found', async ({ app, screen }) => {
  await app.open('/products/slug-yang-tidak-ada-xyz');

  await expect(screen.getByText('Not Found').first()).toBeVisible();
});

test('unknown category slug shows not found', async ({ app, screen }) => {
  await app.open('/categories/slug-yang-tidak-ada-xyz');

  await expect(screen.getByText('Not Found').first()).toBeVisible();
});
