/**
 * Persona Sprite Types & Contracts
 * Authority: CHARACTERS.md §1 & spec/Technical Design Document (TDD).md §1.3
 */

import type { SpriteBuffer } from '../buffer';

export type StrideDirection = 'down' | 'up' | 'side';

export interface PersonaSpriteSet {
  down: SpriteBuffer[];
  up: SpriteBuffer[];
  side: SpriteBuffer[];
}

export type PersonaSpriteGenerator = () => PersonaSpriteSet;
