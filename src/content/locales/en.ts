/**
 * NIGHTBLOOM: The Last Signal — Canonical English String Catalog
 * Authority: CHARACTERS.md §1 & GDD.md §1
 * Strict Rule: In code, every line is referenced by a stable string ID, never inline.
 */

export const en = {
  // App Shell & Title Screen
  'ui.app.title': 'NIGHTBLOOM',
  'ui.app.subtitle': 'THE LAST SIGNAL',
  'ui.title.tagline': 'A signal is only worth sending if someone is listening.',
  'ui.title.btn_start': 'START PATROL',
  'ui.title.btn_dossier': 'FIELD DOSSIER',
  'ui.title.btn_settings': 'AUDIO & CONTROLS',
  'ui.title.controls_hint': 'WASD / ARROW KEYS TO MOVE MIRA · SPACE FOR BEACON PULSE · ESC TO PAUSE',
  'ui.title.version': 'PROTOTYPE V0.1.0 // ENGINE SPEC 1.0',
  'ui.title.system_status': 'SYSTEM: CANVAS 2D // 60 HZ FIXED TIMESTEP',
  'ui.title.sector': 'SECTOR: LOW COUNTRIES OF ASTER // GREY SEASON',

  // In-Game Tactical HUD (GDD §3.1 & UX Spec §3.1)
  'ui.hud.chapter_label': 'CH 1 // THE NURSERY WAKES',
  'ui.hud.phase_label': 'PHASE 1/3',
  'ui.hud.objective_text': 'SURVIVE UNTIL DAWN TRANSMISSION',
  'ui.hud.beacon_status': 'NURSERY BEACON: RELIT (104.2 MHz)',
  'ui.hud.beacon_dist': 'BEACON DIST',
  'ui.hud.coords_label': 'GRID COORD',
  'ui.hud.speed_label': 'VELOCITY',
  'ui.hud.defeated_label': 'DEFEATED',
  'ui.hud.level_prefix': 'LV',
  'ui.hud.xp_label': 'XP',
  'ui.hud.flare_slot': 'FLARE [AUTO]',
  'ui.hud.pulse_slot': 'PULSE [SPACE]',
  'ui.hud.locked_slot': 'SLOT 3 [LOCKED]',
  'ui.hud.btn_pause': 'PAUSE [ESC]',
  'ui.hud.btn_return': 'RETURN TO TITLE',
  'ui.hud.paused_title': 'SIMULATION PAUSED',
  'ui.hud.paused_body': 'Signal clock frozen. All timers halted.',
  'ui.hud.btn_resume': 'RESUME PATROL',

  // Dossier & Character Presentation
  'ui.dossier.badge': 'PERSONA DOSSIER // CLASSIFIED',
  'ui.dossier.sig_freq': 'FREQ 104.2 MHz',
  'ui.dossier.beacon_status': 'NURSERY BEACON: RELIT',
  'ui.dossier.status_active': 'ACTIVE // FIELD DEPLOYED',
  'ui.dossier.btn_back': 'BACK TO TITLE',

  // Operative Sections
  'ui.section.biography': 'BIOGRAPHICAL RECORD & PSYCHOLOGICAL PROFILE',
  'ui.section.telemetry': 'VITAL TELEMETRY & FIELD ATTRIBUTES',
  'ui.section.armaments': 'SIGNATURE ARMAMENTS & ABILITY SUITE',
  'ui.section.transmission': 'TACTICAL RADIO OVERLAY & BARK SIMULATOR',
  'ui.section.ledger': 'FIELD LEDGER // DISCOVERED ENTRIES',

  // Telemetry Labels
  'ui.telemetry.max_health': 'MAX INTEGRITY',
  'ui.telemetry.health_unit': 'HP / BASE',
  'ui.telemetry.velocity': 'VELOCITY',
  'ui.telemetry.velocity_unit': 'PX / SEC',
  'ui.telemetry.seed_magnet': 'SEED MAGNET',
  'ui.telemetry.seed_magnet_unit': 'RADIUS PX',
  'ui.telemetry.recovery': 'I-FRAME',
  'ui.telemetry.recovery_unit': 'RECOVERY S',

  // Radio HUD Overlay
  'ui.radio.live_header': 'LIVE TRANSMISSION // FREQ 104.2 MHz',
  'ui.radio.simulate_prompt': 'TRIGGER FIELD BARK (PROCEDURAL AUDIO):',
  'ui.radio.state_label': 'STATE',
  'ui.radio.signal_label': 'SIG',

  // Psychological Attributes
  'ui.psy.want': 'WANT',
  'ui.psy.need': 'NEED',
  'ui.psy.flaw': 'FLAW',
  'ui.psy.fear': 'FEAR',

  // Mira Vale (Playable Hero)
  'char.mira.name': 'Mira Vale',
  'char.mira.callsign': 'SIGNAL KEEPER',
  'char.mira.role': 'Field Ecologist & Beacon Keeper',
  'char.mira.quote': 'A signal is only worth sending if someone is listening.',
  'char.mira.lore.want': 'Get the Tenth Column safely through the hollow wind to Aster.',
  'char.mira.lore.need': 'To accept help and trust a network instead of carrying it all alone.',
  'char.mira.lore.flaw': 'Carries everything herself and under-reports how severe things are.',
  'char.mira.lore.fear': 'That she switches a signal off and someone is still out there.',
  'char.mira.lore.verbalTic': 'Field note: observations on botany, storm dynamics, and threats.',
  'char.mira.lore.stressTell': 'Gets quieter and noticeably more precise under extreme pressure.',

  // Mira Barks
  'bark.mira.first_kill_seedling': 'Field note: they fall apart easier than they look.',
  'bark.mira.first_kill_seedling.trigger': 'First Spore Defeated',
  'bark.mira.low_health': "I'm fine. I'm fine. Give me a second.",
  'bark.mira.low_health.trigger': 'Signal Critical (<25% HP)',
  'bark.mira.near_miss': 'Too close. I get quieter when it is too close.',
  'bark.mira.near_miss.trigger': 'Near Miss (<10% HP)',
  'bark.mira.pulse_clutch': 'That cleared more than it should have.',
  'bark.mira.pulse_clutch.trigger': 'Pulse Clutch (5+ Foes)',
  'bark.mira.objective_complete': "We're still here.",
  'bark.mira.objective_complete.trigger': 'Objective Secured',

  // Mira Field Ledger
  'ledger.ninth_column.title': 'The Ninth Column',
  'ledger.ninth_column.body': 'Field note: the Ninth Column was twelve kilometres out when I switched the beacon off. The storm found their radios instead. I do not write the rest down.',
  'ledger.hollow_wind.title': 'Hollow Wind',
  'ledger.hollow_wind.body': 'Field note: it does not hunt us. It follows the ring. Tonight, the ring is here.',
  'ledger.thornrunner.title': 'Thornrunner',
  'ledger.thornrunner.body': 'Field note: thorn growth riding the wind front. Skittish, moves in packs, crouches before it bolts. Watch the dust, not the thorns.',

  // Abilities
  'ability.signal_flare.name': 'Signal Flare',
  'ability.signal_flare.desc': 'Auto-targets nearest hostile. Emits high-luminance tracer round.',
  'ability.signal_flare.key': 'PRIMARY [AUTO]',
  'ability.beacon_pulse.name': 'Beacon Pulse',
  'ability.beacon_pulse.desc': 'Radial sonic shockwave. Disperses encroachers and grants 50% damage mitigation.',
  'ability.beacon_pulse.key': 'ACTIVE [SPACEBAR]',
  'ability.coil_arc.name': 'Coil Arc',
  'ability.coil_arc.desc': 'Tavi-calibrated dampening discharge leaping across 3 chained targets.',
  'ability.coil_arc.key': 'PASSIVE [SLOT 2]',

  // Emotion State Labels
  'state.neutral': 'NEUTRAL',
  'state.worried': 'WORRIED',
  'state.relieved': 'RELIEVED',
} as const;

export type StringCatalogKey = keyof typeof en;

export function t(key: StringCatalogKey): string {
  return en[key] ?? key;
}
