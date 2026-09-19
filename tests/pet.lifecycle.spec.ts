import { expect, test } from '@playwright/test';
import { PetClient } from '../src/clients/pet.client';
import { createTestPet } from '../src/factories/pet.factory';
import type { Pet } from '../src/models/pet.model';

test.describe('Pet lifecycle', () => {
  let petClient: PetClient;
  let pet: ReturnType<typeof createTestPet>;

  test.beforeEach(({ request }) => {
    petClient = new PetClient(request);
    pet = createTestPet();
  });

  test.afterEach(async () => {
    await petClient.deletePet(pet.id);
  });

  test('A new pet can be created', async () => {
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

  test('Existing pet can be updated', async () => {
    const createResponse = await petClient.createPet(pet);

    expect(createResponse.status()).toBe(200);

    const createdPet = (await createResponse.json()) as Pet;

    const updatedPet: Pet = {
      ...createdPet,
      name: `${createdPet.name}-updated`,
      status: 'sold',
    };

    const updateResponse = await petClient.updatePet(updatedPet);

    expect(updateResponse.status()).toBe(200);
    expect(updateResponse.headers()['content-type']).toContain('application/json');

    const updateResponseBody = (await updateResponse.json()) as Pet;

    expect(updateResponseBody).toEqual(updatedPet);

    const getResponse = await petClient.getPet(pet.id);

    expect(getResponse.status()).toBe(200);
    expect(getResponse.headers()['content-type']).toContain('application/json');

    const retrievedPet = (await getResponse.json()) as Pet;

    expect(retrievedPet).toEqual(updatedPet);
  });

  test('Existing pet can be deleted', async () => {
    const createResponse = await petClient.createPet(pet);

    expect(createResponse.status()).toBe(200);

    const deleteResponse = await petClient.deletePet(pet.id);

    expect(deleteResponse.status()).toBe(200);

    const getResponse = await petClient.getPet(pet.id);

    expect(getResponse.status()).toBe(404);
  });
});
