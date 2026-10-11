import { expect, test } from 'e2e';

// app.baseUrl ends with '/', so strip it to avoid double-slash URLs (Laravel 404s those).
const baseUrl = (base: string | undefined): string =>
  (base ?? 'https://toko.test').replace(/\/$/, '');

test('passkey endpoints return security urls', async ({ app }) => {
  const response = await fetch(
    `${baseUrl(app.baseUrl)}/.well-known/passkey-endpoints`,
  );

  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    enroll: expect.stringContaining('/settings/security'),
    manage: expect.stringContaining('/settings/security'),
  });
});

test('shipping provinces return data', async ({ app }) => {
  const response = await fetch(`${baseUrl(app.baseUrl)}/shipping/provinces`);

  expect(response.status).toBe(200);
  const json = await response.json();
  expect(Array.isArray(json.data)).toBe(true);
  expect(json.data.length).toBeGreaterThan(0);
  expect(json.data[0]).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
  });
});
