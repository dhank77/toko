import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

const GUEST_REDIRECTS = [
  '/client',
  '/dashboard',
  '/admin/products',
  '/admin/products/create',
  '/admin/categories',
  '/admin/sub-categories',
  '/settings',
  '/settings/profile',
  '/settings/security',
  '/settings/appearance',
  '/user/confirm-password',
  '/two-factor-challenge',
];

for (const path of GUEST_REDIRECTS) {
  test(`guest visiting ${path} is redirected to login`, async ({
    app,
    browser,
  }) => {
    await app.open(path);

    await expect(browser).toHaveURL(/login/);
  });
}
