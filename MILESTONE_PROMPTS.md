# NIGHTBLOOM — Milestone Prompts

How to use this file:

1. Put `CLAUDE.md` in the project root and `GDD.md`, `STORY_BIBLE.md`, `CHARACTERS.md` and this file in `docs/`.
2. Open Claude Code in the project folder.
3. Paste the **Kickoff prompt** first. Then paste one milestone prompt at a time.
4. After each milestone: check the result yourself (run it, play it), then use the **Review prompt**. Only then paste the next milestone.

Each prompt is short on purpose. The details live in `CLAUDE.md` and the docs, which Claude re-reads each session.

---

## Kickoff prompt (paste first)

```text
Read CLAUDE.md, docs/GDD.md, docs/STORY_BIBLE.md and docs/CHARACTERS.md fully. Do not write code yet.

Reply with:
1. A summary of the game and the architecture rules in 10 bullets or fewer.
2. Any contradictions, ambiguities or missing information you found, each with the assumption you propose.
3. The list of milestones you will follow from docs/MILESTONE_PROMPTS.md.

Then stop and wait for my approval.
```

---

## Milestone A — Project and movement

```text
Do Milestone A, following CLAUDE.md and docs/GDD.md.

Scope:
- Initialize Vite + React + TypeScript (strict), ESLint, Prettier, Vitest, and the npm scripts listed in CLAUDE.md (stub the ones with nothing to run yet).
- Create the folder structure from CLAUDE.md, adding only what this milestone needs.
- Central theme tokens (src/content/theme), string catalog (src/content/locales/en.ts), and a config file for player and map values. CSS variables generated from tokens.
- One requestAnimationFrame loop with a fixed timestep and delta clamp, with dispose().
- Seeded RNG utility with a unit test.
- Draw the layered field on Canvas using tokens (ground, flower patches, a few props, the beacon).
- Move Mira with WASD and arrows, smooth camera follow, bounded map.
- A minimal title screen and game screen in React with start/quit that fully disposes the loop and listeners.
- README with setup, commands and controls.

Done when: typecheck, lint, test, build all pass and I can run `npm run dev`, press Start, move Mira around the map, and return to the title with no console errors.
Then commit, report, and stop for my approval.
```

## Milestone B — Core combat

```text
Do Milestone B, following CLAUDE.md and docs/GDD.md.

Scope:
- Seedling enemy as data plus a chase behavior module.
- Safe spawn system near the camera boundary: never on the player, never inside obstacles, with an escape route. Spawns use the seeded RNG and a config cap.
- Uniform-grid spatial hash for collision queries.
- Contact damage, Mira health, hit invulnerability, hit feedback, health HUD.
- Signal Flare auto-attack that targets the nearest enemy in range, projectile hits, enemy defeat, glow-seed drops and pickup with drift toward Mira.
- Procedural vector sprites via a SpriteFactory using theme tokens, plus a first minimal Web Audio set (shot, hit, pickup).
- Unit tests for targeting, spawn safety, damage, and spatial hash.

Done when: all quality gates pass, I can fight Seedlings for several minutes at 60 FPS, die, and restart cleanly.
Then commit, report, and stop for my approval.
```

## Milestone C — XP and upgrades

```text
Do Milestone C, following CLAUDE.md and docs/GDD.md (sections 4.3–4.5).

Scope:
- XP table in config, XP bar, level-up that pauses the simulation, three-card level-up UI with keyboard navigation (arrows + Enter, keys 1–3), reroll (1) and skip.
- Data-driven upgrade pool with Zod schemas, max levels, the add/multiply/grant_ability/set_flag effect model, and fallback cards. Include every upgrade in the GDD that is valid before Chapter 2.
- Ability slots (3) with Signal Flare in slot 1.
- Beacon Pulse on Space (configurable binding) with a cooldown indicator.
- Description strings formatted from data values.
- Tests: XP thresholds, level-ups, max levels, distinct cards, fallbacks, effect application, cooldowns, no double-pick, no stuck pause.

Done when: all gates pass and I can level up several times in a run, choose or reroll or skip, and use Beacon Pulse.
Then commit, report, and stop for my approval.
```

## Milestone D1 — Chapter foundation and save

```text
Do Milestone D1, following CLAUDE.md and docs/GDD.md (sections 4.6, 6, 8).

Scope:
- Chapter, phase, objective and wave-schedule schemas with Zod and cross-reference validation. `npm run validate:content` runs them.
- Objective system: survive_timer first, with room for defend_entity, collect_item and defeat_boss later.
- Phase snapshots in memory and Retry-from-Phase on defeat; starting picks per chapter.
- Story/interlude cards and the bark system skeleton (data model, cooldowns, one-at-a-time display) using CHARACTERS.md strings.
- SaveService with schemaVersion, Zod validation, migrations and graceful recovery. Title screen Start/Continue/Chapter Select and a Results screen.
- Scoring system.
- Tests: save validation and migration, corrupt save recovery, phase retry restore, wave schedule determinism, bark cooldowns, scoring.

Done when: all gates pass. A stub chapter can be played start to finish, win and lose both reach Results, Continue works after reload.
Then commit, report, and stop for my approval.
```

## Milestone D2 — Full Chapter 1

```text
Do Milestone D2, following CLAUDE.md, docs/GDD.md (Chapter 1), docs/STORY_BIBLE.md and docs/CHARACTERS.md.

Scope:
- Full Chapter 1 as data: four phases totalling 660 s, tutorial captions, Bloomed Seedling variant, Beacon Pulse prompt, storm surge ending.
- Field Ledger screen with the Seedling and Bloomed Seedling entries and Chapter 1 reward (Ledger plus Pickup Radius upgrade unlocked in the save).
- Chapter 1 story cards, radio captions and barks from STORY_BIBLE.md (chapter scripts) and CHARACTERS.md (barks).
- Balance pass against the Chapter 1 targets (GDD section 9). Add the headless balance bot and a clear-rate report.
- An integration test that runs Chapter 1 headlessly with a fixed seed.
- Story props per STORY_BIBLE section 9: Old Core pylon at growth stage 0, the bloom-glow warning before each surge, and the night label on chapter cards.

Done when: all gates pass and I can play Chapter 1 end to end (about 11 minutes), earn the reward, see it persist after reload, and replay.
Then commit, report, and stop for my approval. This is the vertical-slice checkpoint, so list anything you think should change before scaling to five chapters.
```

## Milestone E1 — Thornrunner, Rustwing, Chapters 2 and 3

```text
Do Milestone E1, following CLAUDE.md, docs/GDD.md (Chapters 2–3), docs/STORY_BIBLE.md and docs/CHARACTERS.md.

Scope:
- Thornrunner and Rustwing enemies with telegraphs, projectiles, visuals and sounds, plus their Ledger entries.
- Gust lane hazard (telegraphed), collect_item objective (Coil Run) and defend_entity objective (Nightbloom Patch), including their fail states.
- Coil Arc and Bloomguard abilities with their upgrades and unlock rules.
- Chapters 2 and 3 as data using existing systems and the shared map framework, with chapter-specific lighting, weather and props.
- Chapter story cards, radio and barks from STORY_BIBLE.md (chapter scripts) and CHARACTERS.md (barks).
- Tests for each new behavior, both objectives and unlock flow, and bot clear-rate checks against the GDD targets.
- Story props: Old Core at growth stages 1 and 2, the wind front cutting Tavi off in Chapter 2, and the quiet-water margin (the patch stays dark) in Chapter 3.

Done when: all gates pass and Chapters 2 and 3 play start to finish with working rewards.
Then commit, report, and stop for my approval.
```

## Milestone E2 — Briarheart, Wren, Chapter 4

```text
Do Milestone E2, following CLAUDE.md, docs/GDD.md (Chapter 4), docs/STORY_BIBLE.md and docs/CHARACTERS.md.

Scope:
- Briarheart elite with telegraphed slam, visuals, sounds and Ledger entry.
- Wren follower turret ability and its upgrades.
- Backup relay defend_entity phase with a visible countdown and relay integrity.
- Chapter 4 as data, including Idris radio lines if enabled.
- Ability-slot pressure: verify the choice of two among Coil Arc, Bloomguard and Wren works in the UI and is tested.
- Tests and bot clear-rate checks against GDD targets.
- Story props: Old Core at growth stage 3, the backup relay routed through the Old Core amplifier with a visibly stronger surge afterwards, and Wren crossing the wind front.

Done when: all gates pass and Chapter 4 plays start to finish with working rewards.
Then commit, report, and stop for my approval.
```

## Milestone E3 — Stormroot and Chapter 5

```text
Do Milestone E3, following CLAUDE.md, docs/GDD.md (section 5.3 and Chapter 5), docs/STORY_BIBLE.md and docs/CHARACTERS.md.

Scope:
- Stormroot boss with a health bar, three HP-threshold phases, Root Lash, Spore Ring and Gale Pull with distinct telegraphs, recovery windows and phase colors/sounds. Beacon Pulse must cancel Gale Pull.
- defeat_boss_or_survive_timer objective with the 300 s Signal Lock and the two ending variants.
- Chapter 5 as data (four phases), ending sequence, Dawn Signal emblem and Score Attack mode.
- Campaign completion screen with campaign stats.
- Boss tests with at least three different builds using the balance bot, plus phase-retry coverage for Chapter 5.
- Story: the Old Core becomes Stormroot (growth stage 4, then the boss), the Signal Lock is presented as Tavi's antiphase lock and the convoy's final approach, and the ending sequence in STORY_BIBLE section 10 plays, including Mira switching the beacon off.

Done when: all gates pass and the full campaign can be completed from a fresh save.
Then commit, report, and stop for my approval.
```

## Milestone F1 — Art and audio pass

```text
Do Milestone F1, following CLAUDE.md (art and audio pipeline) and docs/GDD.md (section 7).

Scope:
- Replace remaining placeholder shapes with the deliberate procedural vector art set from the GDD asset list. Keep one consistent style.
- Layered portrait components for Mira, Sela, Tavi and Idris with three states.
- Weather overlays and chapter lighting variants. Respect reduced flashes/motion.
- Full Web Audio SFX set, an ambient drone and a boss phase layer. Volume controls work.
- Asset manifest, loader with dev warnings and production fallbacks. CREDITS.md updated for every external asset (or "none").

Done when: all gates pass and no placeholder art remains.
Then commit, report, and stop for my approval.
```

## Milestone F2 — UI, settings and accessibility

```text
Do Milestone F2, following CLAUDE.md and docs/GDD.md (section 8).

Scope:
- Finish every screen in GDD 8.1, including Credits/Notices and Chapter Select with clear locked states.
- Settings: volumes, screen shake, reduced flashes/motion, high contrast, key reference, rebind Beacon Pulse, reset save with confirmation.
- Keyboard navigation, visible focus and accessible labels everywhere. No information by color alone.
- Responsive layout. A clear desktop-keyboard-only notice on narrow/touch devices.
- Playwright smoke test for the full UI flow.

Done when: all gates pass and I can complete the full UI flow with the keyboard alone.
Then commit, report, and stop for my approval.
```

## Milestone F3 — Release hardening

```text
Do Milestone F3, following CLAUDE.md and docs/GDD.md (section 10).

Scope:
- Walk the v1 acceptance criteria in GDD section 10 one by one and report pass/fail with evidence.
- Fix stuck-pause, timer, listener, restart and spawn-cap issues. Check for uncaught production errors.
- Performance check at peak enemy counts. Note results.
- Final balance bot run for all five chapters and the boss builds.
- README complete: setup, commands, controls, supported browsers, accessibility, credits, known limitations.

Done when: every acceptance criterion passes or is listed as a known limitation that I approve.
Then commit, report, and stop for my approval.
```

---

## Review prompt (use after each milestone)

```text
Review what you just built against CLAUDE.md and docs/GDD.md. Do not add features.

Check and report:
1. Any file over about 300 lines or doing unrelated work.
2. Any hard-coded color, user-facing string or balance number.
3. Any simulation code that imports React, uses Math.random or leaks timers/listeners.
4. Missing tests for new logic.
5. Anything from the milestone scope that is not finished.
6. Any story text, string ID or term that disagrees with docs/STORY_BIBLE.md (glossary, tic budgets, ETAs).

Fix real violations, rerun all quality gates, and report the results.
```

## Balance prompt (use when a chapter feels too easy or hard)

```text
Run the balance bot on Chapter N with at least 30 seeds and report: clear rate, average player level at end, peak live enemies, and median time of first damage.
Compare to GDD section 9. Propose config-only changes (spawn rates, mixes, stat multipliers), apply them, rerun, and show before and after. Do not change engine code.
```

## Scope-guard prompt (use if the agent starts expanding)

```text
Stop. Compare your current changes to the milestone scope. List what is out of scope, revert it or move it to a "Deferred" list in README.md, and continue with only the milestone scope.
```
