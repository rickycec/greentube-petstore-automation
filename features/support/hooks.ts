import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import type { PetWorld } from './world';
import { request } from 'playwright';
import { PetClient } from '../../src/clients/pet.client';

setDefaultTimeout(30_000);

Before(async function (this: PetWorld) {
  const baseURL = this.parameters.baseUrl;

  this.apiContext = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  });

  this.petClient = new PetClient(this.apiContext);
});

After(async function (this: PetWorld) {
  try {
    if (this.petClient && this.pet) {
      await this.petClient.deletePet(this.pet.id);
    }
  } finally {
    await this.apiContext?.dispose();
  }
});
