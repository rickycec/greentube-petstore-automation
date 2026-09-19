import { expect, test } from '@playwright/test';
import { PetClient } from '../src/clients/pet.client';
import { createTestPet } from '../src/factories/pet.factory';
import type { Pet } from '../src/models/pet';

test.describe('PetModel lifecycle', () => {
  let petClient: PetClient;
  let pet: ReturnType<typeof createTestPet>;

  test.beforeEach(({ request }) => {
    petClient = new PetClient(request);
    pet = createTestPet();
  });

  test.afterEach(async () => {
    await petClient.deletePet(pet.id);
  });

  test('Created pet matches the pet returned by id', async () => {
    const createResponse = await petClient.createPet(pet);

    expect(createResponse.status()).toBe(200);
    expect(createResponse.headers()['content-type']).toContain('application/json');

    const createdPet = (await createResponse.json()) as Pet;

    expect(createdPet).toEqual(pet);

    const getResponse = await petClient.getPet(pet.id);

    expect(getResponse.status()).toBe(200);
    expect(getResponse.headers()['content-type']).toContain('application/json');

    const retrievedPet = (await getResponse.json()) as Pet;

    expect(retrievedPet).toEqual(createdPet);
  });
});
