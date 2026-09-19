import type { createTestPet } from '../../src/factories/pet.factory';
import { type IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import type { APIRequestContext, APIResponse } from 'playwright';
import type { PetClient } from '../../src/clients/pet.client';
import type { Pet } from '../../src/models/pet.model';

export interface PetWorldParameters {
  baseUrl: string;
}

type TestPet = ReturnType<typeof createTestPet>;

export class PetWorld extends World<PetWorldParameters> {
  apiContext?: APIRequestContext;
  petClient?: PetClient;
  pet?: TestPet;
  response?: APIResponse;
  responsePet?: Pet;
  createdPet?: Pet;
  expectedPet?: Pet;

  constructor(options: IWorldOptions<PetWorldParameters>) {
    super(options);
  }
}

setWorldConstructor(PetWorld);
