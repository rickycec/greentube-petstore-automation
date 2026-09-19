import { expect, test } from '@playwright/test';
import { PetClient } from '../src/clients/pet.client';
import { createTestPet } from '../src/factories/pet.factory';

test.describe('Pet request validation', () => {
  let petClient: PetClient;
  let pet: ReturnType<typeof createTestPet>;

  test.beforeEach(({ request }) => {
    petClient = new PetClient(request);
    pet = createTestPet();
  });

  test.afterEach(async () => {
    await petClient.deletePet(pet.id);
  });

  test('Request with an unsupported content type is rejected', async ({ request }) => {
    const response = await request.post('pet', {
      headers: {
        'Content-Type': 'text/plain',
      },
      data: JSON.stringify(pet),
    });

    expect(response.status()).toBe(415);

    const getResponse = await petClient.getPet(pet.id);

    expect(getResponse.status()).toBe(404);
  });
});
