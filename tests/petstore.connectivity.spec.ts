import { expect, test } from '@playwright/test';

test.describe('Petstore API connectivity', () => {
  test('Get a pet by status returns a successfull response', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: {
        status: 'available',
      },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBe(true);
  });
});
