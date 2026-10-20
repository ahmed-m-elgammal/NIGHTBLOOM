import { z } from 'zod';
import { StringCatalogKey } from '../../../content/locales/en';

export const EmotionStateSchema = z.enum(['neutral', 'worried', 'relieved']);
export type EmotionState = z.infer<typeof EmotionStateSchema>;

export const BarkSchema = z.object({
  id: z.string(),
  triggerId: z.custom<StringCatalogKey>(),
  lineId: z.custom<StringCatalogKey>(),
  emotion: EmotionStateSchema,
  speakerNameId: z.custom<StringCatalogKey>(),
});
export type Bark = z.infer<typeof BarkSchema>;

export const LedgerEntrySchema = z.object({
  id: z.string(),
  titleId: z.custom<StringCatalogKey>(),
  bodyId: z.custom<StringCatalogKey>(),
  speakerNameId: z.custom<StringCatalogKey>(),
});
export type LedgerEntry = z.infer<typeof LedgerEntrySchema>;

export const AbilityConfigSchema = z.object({
  id: z.string(),
  nameId: z.custom<StringCatalogKey>(),
  descId: z.custom<StringCatalogKey>(),
  type: z.enum(['primary', 'active', 'passive']),
  keyBindingId: z.custom<StringCatalogKey>().optional(),
  cooldownSec: z.number().positive(),
  iconType: z.enum(['flare', 'pulse', 'coil', 'bloom', 'wren']),
  parameters: z.record(z.union([z.string(), z.number()])),
});
export type AbilityConfig = z.infer<typeof AbilityConfigSchema>;

export const PersonaDefSchema = z.object({
  id: z.string(),
  nameId: z.custom<StringCatalogKey>(),
  callsignId: z.custom<StringCatalogKey>(),
  roleId: z.custom<StringCatalogKey>(),
  quoteId: z.custom<StringCatalogKey>(),
  lore: z.object({
    wantId: z.custom<StringCatalogKey>(),
    needId: z.custom<StringCatalogKey>(),
    flawId: z.custom<StringCatalogKey>(),
    fearId: z.custom<StringCatalogKey>(),
    verbalTicId: z.custom<StringCatalogKey>(),
    stressTellId: z.custom<StringCatalogKey>(),
  }),
  baseStats: z.object({
    maxHealth: z.number().positive(),
    moveSpeed: z.number().positive(),
    hitInvulnerabilitySec: z.number().positive(),
    pickupRadius: z.number().positive(),
  }),
  abilities: z.array(AbilityConfigSchema),
  ledgerNotes: z.array(LedgerEntrySchema),
  starterBarks: z.array(BarkSchema),
});
export type PersonaDef = z.infer<typeof PersonaDefSchema>;
