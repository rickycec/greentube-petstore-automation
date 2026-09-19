import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Pet } from '../models/pet.model';

export class PetClient {
  constructor(private readonly request: APIRequestContext) {}

  createPet(pet: Pet): Promise<APIResponse> {
    return this.request.post('pet', {
      data: pet,
    });
  }

  getPet(petId: number): Promise<APIResponse> {
    return this.request.get(`pet/${petId}`);
  }

  updatePet(pet: Pet): Promise<APIResponse> {
    return this.request.put('pet', {
      data: pet,
    });
  }

  deletePet(petId: number): Promise<APIResponse> {
    return this.request.delete(`pet/${petId}`);
  }
}
