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
