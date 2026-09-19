import { Pet } from '../models/pet';

export function createTestPet(overrides: Partial<Pet> = {}): Pet {
  const id = overrides.id ?? Date.now();

  return {
    category: {
      id: 1,
      name: 'Dogs',
    },
    name: `pet-${id}`,
    photoUrls: [`https://example.com/pets/${id}.jpg`],
    tags: [
      {
        id: 1,
        name: 'automation',
      },
    ],
    status: 'available',
    ...overrides,
    id,
  };
}
