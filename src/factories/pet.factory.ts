import type { Pet } from '../models/pet';

interface TestPet extends Pet {
  id: number;
}

export function createTestPet(overrides: Partial<Pet> = {}): TestPet {
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
