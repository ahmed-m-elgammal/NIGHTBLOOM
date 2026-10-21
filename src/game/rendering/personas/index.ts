/**
 * Persona Visual Registry
 * Authority: CHARACTERS.md §1 & spec/Technical Design Document (TDD).md §1.3
 * Adding a new persona requires simply registering its generator function here.
 */

import type { PersonaSpriteGenerator, PersonaSpriteSet } from './types';
import { createMiraPersonaSprites } from './mira';

export * from './types';
export { createMiraPersonaSprites, createMiraSprite } from './mira';

export const PERSONA_REGISTRY: Record<string, PersonaSpriteGenerator> = {
  hero_mira: createMiraPersonaSprites,
  // Future personas:
  // hero_tavi: createTaviPersonaSprites,
  // hero_sela: createSelaPersonaSprites,
};

export function getPersonaSprites(personaId: string): PersonaSpriteSet {
  const generator = PERSONA_REGISTRY[personaId] ?? PERSONA_REGISTRY.hero_mira;
  return generator();
}
