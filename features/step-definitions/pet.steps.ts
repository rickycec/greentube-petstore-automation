import { Given, Then, When } from '@cucumber/cucumber';
import { PetWorld } from '../support/world';
import { createTestPet } from '../../src/factories/pet.factory';
import assert from 'node:assert';
import { Pet } from '../../src/models/pet.model';

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
