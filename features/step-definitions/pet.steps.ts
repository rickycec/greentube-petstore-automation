import { Given, Then, When } from '@cucumber/cucumber';
import type { PetWorld } from '../support/world';
import { createTestPet } from '../../src/factories/pet.factory';
import assert from 'node:assert/strict';
import type { Pet } from '../../src/models/pet.model';

Given('a new pet payload', function (this: PetWorld) {
  this.pet = createTestPet();
});

When('I create the pet', async function (this: PetWorld) {
  assert.ok(this.petClient, 'PetClient was not initialized');
  assert.ok(this.pet, 'Pet payload was not initialized');

  this.response = await this.petClient.createPet(this.pet);
});

Then('the response status should be {int}', function (this: PetWorld, expectedStatus: number) {
  assert.ok(this.response, 'No API response is available');

  assert.equal(this.response.status(), expectedStatus);
});

Then('the response content type should be JSON', function (this: PetWorld) {
  assert.ok(this.response, 'No API response is available');

  const contentType = this.response.headers()['content-type'] ?? '';

  assert.match(contentType, /application\/json/i);
});

Then('the created pet should match the submitted payload', async function (this: PetWorld) {
  assert.ok(this.response, 'No API response is available');
  assert.ok(this.pet, 'Pet payload was not initialized');

  const createdPet = (await this.response.json()) as Pet;

  assert.deepStrictEqual(createdPet, this.pet);

  this.createdPet = createdPet;
  this.responsePet = createdPet;
});

When('I retrieve the pet by ID', async function (this: PetWorld) {
  assert.ok(this.petClient, 'PetClient was not initialized');
  assert.ok(this.pet, 'Pet payload was not initialized');

  this.response = await this.petClient.getPet(this.pet.id);
});

Then('the retrieved pet should match the created pet', async function (this: PetWorld) {
  assert.ok(this.response, 'No API response is available');
  assert.ok(this.createdPet, 'Created pet response was not stored');

  const retrievedPet = (await this.response.json()) as Pet;

  assert.deepStrictEqual(retrievedPet, this.createdPet);

  this.responsePet = retrievedPet;
});

Given('the pet exists', async function (this: PetWorld) {
  assert.ok(this.petClient, 'PetClient was not initialized');
  assert.ok(this.pet, 'Pet payload was not initialized');

  const createResponse = await this.petClient.createPet(this.pet);

  assert.equal(createResponse.status(), 200);

  const createdPet = (await createResponse.json()) as Pet;

  assert.deepStrictEqual(createdPet, this.pet);

  this.createdPet = createdPet;
  this.responsePet = createdPet;
});

When('I update the pet name and status', async function (this: PetWorld) {
  assert.ok(this.petClient, 'PetClient was not initialized');
  assert.ok(this.createdPet, 'Existing pet was not created');

  this.expectedPet = {
    ...this.createdPet,
    name: `${this.createdPet.name}-updated`,
    status: 'sold',
  };

  this.response = await this.petClient.updatePet(this.expectedPet);
});

Then('the update response should match the requested changes', async function (this: PetWorld) {
  assert.ok(this.response, 'No API response is available');
  assert.ok(this.expectedPet, 'Expected updated pet was not stored');

  const updatedPet = (await this.response.json()) as Pet;

  assert.deepStrictEqual(updatedPet, this.expectedPet);

  this.responsePet = updatedPet;
});

Then('the retrieved pet should match the updated pet', async function (this: PetWorld) {
  assert.ok(this.response, 'No API response is available');
  assert.ok(this.expectedPet, 'Expected updated pet was not stored');

  const retrievedPet = (await this.response.json()) as Pet;

  assert.deepStrictEqual(retrievedPet, this.expectedPet);

  this.responsePet = retrievedPet;
});

When('I delete the pet', async function (this: PetWorld) {
  assert.ok(this.petClient, 'PetClient was not initialized');
  assert.ok(this.pet, 'Pet payload was not initialized');

  this.response = await this.petClient.deletePet(this.pet.id);
});

When(
  'I create the pet with content type {string}',
  async function (this: PetWorld, contentType: string) {
    assert.ok(this.apiContext, 'API request context was not initialized');
    assert.ok(this.pet, 'Pet payload was not initialized');

    this.response = await this.apiContext.post('pet', {
      headers: {
        'Content-Type': contentType,
      },
      data: JSON.stringify(this.pet),
    });
  },
);
