# NIGHTBLOOM: The Last Signal — Character Bible

All text here is the source for entries in `src/content/locales/en.ts`. In code, every line is referenced by a stable string ID, never inline. Mechanics live in `docs/GDD.md`. Story logic and all chapter scripts live in `docs/STORY_BIBLE.md`, which wins on any conflict.

**Theme line:** "A signal is only worth sending if someone is listening."
Every character is, in some way, learning to send something and trust that it will be heard.

---

## 1. Writing rules

- **Radio captions:** one to two lines, aim for 80 characters or fewer per line, hard limit 100. Format on screen: speaker name in the UI, text only in the string.
- **Story cards:** three lines or fewer, always skippable.
- **Tone:** hopeful, grounded, a little dry. No grimdark, no villain monologues, no exposition dumps.
- **No dialogue trees, relationship meters or voice acting.** Personality comes from voice, tics and barks.
- **Tic budgets:** Mira's "Field note:" on at most about one in three of her lines, and never when she asks for help. "Ticket closed" is reserved for two moments only: the Ch2 install and the Ch5 ending. Other Tavi ticket phrases are fine but sparing.
- **Never blame the nightbloom** in dialogue after Chapter 3 beyond Sela's worries.
- **Accessibility:** do not convey information only through tone or color. Captions name the speaker.
- **String ID convention:** `story.ch<N>.<beat>`, `radio.<charId>.<topic>`, `bark.<charId>.<topic>`, `ledger.<entryId>.title|body`, `char.<charId>.name|role`.

---

## 2. Character sheet template

`Role · Want · Need · Flaw · Fear · Verbal tic · Stress tell · Relationships · Arc beats (per chapter) · Portrait states · Bark tags`

---

## 3. Cast

### 3.1 Mira Vale — playable
- **Role:** field ecologist, signal keeper for the nursery beacon.
- **Want:** get the Tenth Column home.
- **Need:** to accept help and trust a network instead of carrying it all alone.
- **Flaw:** she carries everything herself and under-reports how bad things are.
- **Fear:** that she switches a signal off and someone is still out there (the Ninth Column, six years ago).
- **Verbal tic:** "Field note:" observations. Her Field Ledger entries are written in this voice.
- **Stress tell:** she gets quieter and more precise, not louder.
- **Relationships:**
  - Sela: old colleague; Mira trusts her science, worries about her guilt.
  - Tavi: new ally; Mira respects competence and is amused by the ticket jargon.
  - Idris: has never met him; steady voice on the line.
  - Wren: treats it like a field instrument at first, then like a friend.
- **Arc beats:**

| Ch | Beat |
|---|---|
| 1 | Alone and capable. Relights the beacon she switched off six years ago. |
| 2 | Learns the beacon is bait as well as lifeline, realizes that is what happened to the Ninth, and deflects. |
| 3 | Defends Sela's innocence; says out loud that it wasn't her fault. |
| 4 | Accepts Tavi's instructions without second-guessing, the first time she lets someone else steer. |
| 5 | Asks for help in plain words, wins as a team, and switches the beacon off herself with nobody left out there. |

- **Portrait states:** neutral (calm, level gaze), worried (brows drawn), relieved (small smile). 
- **Bark tags:** `observation`, `low_health`, `clutch`, `relief`.

### 3.2 Dr. Sela Rowan — radio and portrait
- **Role:** nursery botanist. Understands the nightbloom and introduces plant-themed upgrades.
- **Want:** prove the nightbloom is innocent.
- **Need:** to forgive herself and stop hedging.
- **Flaw:** over-qualifies every claim.
- **Fear:** that her own seed stock caused the storm. (Both times the beacon lit in bloom season, the wind came, and she has the logs.)
- **Verbal tic:** corrects herself mid-sentence and uses plant metaphors ("Sorry — no, that's wrong").
- **Stress tell:** slower, more formal speech.
- **Relationships:** Mira (old friend, leans on her steadiness); Tavi (mild friction over caution vs improvisation, grows into mutual respect); Idris (reports seed stock status).
- **Arc beats:**

| Ch | Beat |
|---|---|
| 1 | Warns about the light; guilt appears in a half-sentence. |
| 2 | Quietly checks her own notes for the cause. |
| 3 | Vindicated: the blooms react to the signal, they did not start it. Voice shakes. |
| 4 | Backs Tavi's plan even though it's risky. |
| 5 | Stops hedging and gives direct instructions about the feedback loop. |

- **Portrait states:** neutral, worried (hand near mouth), relieved (eyes closed, exhale).
- **Bark tags:** `plant_metaphor`, `reassurance`, `science_note`.

### 3.3 Tavi Rook — radio and portrait
- **Role:** field mechanic at the Relay Station, pinned behind the wind front, repairing the relay while the convoy moves. Provides parts and instructions for Wren.
- **Want:** a relay that works the first time.
- **Need:** to trust her own work under pressure.
- **Flaw:** hides care behind jokes and refuses credit.
- **Fear:** being the one whose fix fails at the worst moment.
- **Verbal tic:** repair-ticket language ("Ticket opened", "Ticket closed", "Won't fix").
- **Stress tell:** her jokes get shorter and she starts numbering things.
- **Relationships:** Mira (treats her like a good client she's quietly worried about); Sela (argues, then defers on botany); Wren (built from the pieces of Tavi's earlier failed repair); Idris (gives him honest time estimates).
- **Arc beats:**

| Ch | Beat |
|---|---|
| 1 | Introduced on the closing call: "Your signal sounds like a kettle." |
| 2 | Finds the coil, restores the relay, and spots that the storm tracks the beacon. |
| 3 | Supports from the side; practical comfort for Sela. |
| 4 | Backup relay is the pressure test. Hands over Wren. |
| 5 | Owns the final fix. "I won't fail this one." |

- **Portrait states:** neutral (half-smirk, goggles up), worried (goggles down), relieved (grin).
- **Bark tags:** `ticket`, `deadpan`, `repair_status`.

### 3.4 Wren — support drone (ability, not a companion)
- **Role:** small automatic drone. No dialogue.
- **Personality:** chirps. On-screen captions in brackets: "[Wren chirps twice]", "[Wren whirs, pleased]", "[Wren stutters, recovers]".
- **Backstory:** built from the scrap of Tavi's earlier failed repair, making it a small redemption object. Tavi calls it "salvage". She is fond of it and won't admit it.
- **Behavior:** follows at a fixed offset and fires on a timer (see GDD). No pathfinding, no commands, no inventory.
- **Bark tags:** `chirp` (only when Wren fires its first shot in a run, on level-up of Wren upgrades, and on Mira low health).

### 3.5 Warden Idris Kael — optional, radio only
- **Role:** voice of the Tenth Column (the convoy). Low fuel, passengers aboard, a clock behind every line. The Ninth Column never reported in.
- **Want:** deliver everyone alive.
- **Need:** to believe in a signal he can't see.
- **Flaw:** hides his fear behind procedure.
- **Verbal tic:** reports in numbers ("Three hours. Fuel for four.").
- **Stress tell:** shorter sentences.
- **Relationships:** Mira (his only guide), Tavi (trusts her time estimates), Sela (asks after the seed stock).
- **Appears:** Ch1 reward (garbled static only), Ch4 intro, Ch5 phase 2, Ch5 ending. About 6–8 captions total. Cut-safe: nothing depends on him but stakes.
- **Portrait states:** neutral, worried, relieved.

### 3.6 Stormroot — boss
Not a character. It is the Old Core, thorn growth and nightbloom tangled around the ring: a feedback loop with a body, a signal that only listens to itself. It has no dialogue. Sound design and phase colors carry its personality: low harmonic hum that rises in pitch each phase.

### 3.7 Relationship map
| | Mira | Sela | Tavi | Idris |
|---|---|---|---|---|
| **Mira** | | trusts her science | respects her | relies on his voice |
| **Sela** | worries about her | | friction → respect | reports seed status |
| **Tavi** | quietly worried about her | defers on botany | | honest ETAs |
| **Idris** | only guide | asks about seeds | trusts her estimates | |

---

## 4. Enemy personas

Each enemy has an ecological origin, a behavior personality, a readable telegraph and a Field Ledger entry in a different character's voice.

| Enemy | Origin | Personality | Telegraph | Ledger voice |
|---|---|---|---|---|
| **Seedling** | Dormant spores woken by beacon light | Phototropic, drifts toward light, harmless alone | Petals open before contact | Sela |
| **Thornrunner** | Thorn growth riding the wind front | Skittish pack animal, darts and cuts routes | Dust trail plus a short crouch | Mira |
| **Rustwing** | Farm-machine scrap animated by wind | Hovers, "aims", fires slow scrap | Rotor flare, then a pause | Tavi |
| **Briarheart** | Thorn mass grown around a dead tractor engine | Patient, heavy, punishes greed | Ground-ring wind-up | Mira |
| **Stormroot** | The Old Core, overgrown with thorn growth and nightbloom | Not malicious, a feedback loop with a body | Distinct phase colors and sound | Sela and Tavi |

---

## 5. Field Ledger entries

The Ledger unlocks in Chapter 1. An entry is **discovered** the first time that enemy or subject is encountered. Bodies are short (three sentences or fewer).

| Entry ID | Title | Voice | Body |
|---|---|---|---|
| `ledger.seedling` | Seedling | Sela | "Dormant spores, woken by the beacon's light. They lean toward it the way any seedling would. They aren't hungry. They're early." |
| `ledger.bloomed_seedling` | Bloomed Seedling | Sela | "Same spore, better fed. The petals open wider when it's close. Nature doing its best, badly." |
| `ledger.thornrunner` | Thornrunner | Mira | "Field note: thorn growth riding the wind front. Skittish, moves in packs, crouches before it bolts. Watch the dust, not the thorns." |
| `ledger.rustwing` | Rustwing | Tavi | "DEFECT REPORT: scrap rotor, no pilot, wind in the intake. Hovers, aims, fires. Not repairable. Recommendation: do not stand there." |
| `ledger.briarheart` | Briarheart | Mira | "Field note: thorn mass grown around a dead tractor engine. Slow. Patient. It waits for you to get greedy." |
| `ledger.stormroot` | Stormroot | Sela and Tavi | "Sela: The Old Core, the thorn growth and the nightbloom, tangled around the ring. Tavi: A feedback loop with a body. Sela: It isn't angry. Tavi: It's an echo that learned to stand." |
| `ledger.hollow_wind` | Hollow Wind | Mira | "Field note: it doesn't hunt us. It follows the ring. Tonight, the ring is here." |
| `ledger.nightbloom` | Nightbloom | Sela | "The seeds that might bring Aster back. They brighten when the ring spikes, a minute before the wind. They didn't make the storm. I needed to say that out loud." |
| `ledger.beacon` | The Beacon | Tavi | "Old seed-vault beacon. Lifeline and decoy. Ticket status: open, and it's staying open." |
| `ledger.old_core` | The Old Core | Tavi | "Amplifier pylon at the field's heart. Cracked damping coil. It hums, and the hum is getting louder." |
| `ledger.ring` | The Ring | Tavi | "A signal echoing against itself. The Hollow Wind follows it. Louder makes it worse. Quieter makes it stop." |
| `ledger.ninth_column` | The Ninth Column | Mira | "Field note: the Ninth Column was twelve kilometres out when I switched the beacon off. The storm found their radios instead. I don't write the rest down." |

Lore entries unlock on story beats: Old Core at the Ch1 reward; The Ring and The Ninth Column at the Ch2 reveal.

Rewards tied to the Ledger: completing all entries unlocks a portrait frame cosmetic (post-v1).

---

## 6. Chapter radio and card scripts

Moved to `docs/STORY_BIBLE.md` section 8 so story logic and dialogue stay in one place. String IDs follow the convention in section 1, extended in the story bible.

---

## 7. Bark system

**Data model (typed record, validated at dev/test time):**
```text
BarkDef {
  id: string,
  characterId: "mira" | "sela" | "tavi" | "idris" | "wren",
  trigger: BarkTrigger,
  stringId: string,
  cooldownSec: number,       // per-bark
  globalCooldownSec: number, // shared between all barks, start at 12
  chapterRange: [number, number],
  chance: number,            // 0–1, via seeded RNG
  maxPerRun: number
}
```

**Triggers:** `first_kill_<enemyId>`, `low_health` (below 25%), `health_restored`, `level_up_milestone` (every N levels, config), `boss_phase_change`, `near_miss` (survives a hit at 10% health or less), `pulse_clutch` (Pulse hits 5 or more enemies), `long_no_damage` (60 s), `entity_low` (defended entity below 30%), `ability_unlocked`, `objective_complete`, `wren_first_shot`.

**Rules:**
- One bark at a time. Barks never interrupt story cards or level-up screens.
- They display as a short caption with the speaker's name and small portrait and never block input.
- Global cooldown plus per-bark cooldown plus `maxPerRun` prevent spam.
- Reduced-motion setting: no animation on caption entry.
- Adding barks requires only data and strings, not engine code.

### Starter barks (about 36)
| ID | Character | Trigger | Chapters | Line |
|---|---|---|---|---|
| `bark.mira.first_kill_seedling` | Mira | first_kill_seedling | 1 | "Field note: they fall apart easier than they look." |
| `bark.sela.first_kill_seedling` | Sela | first_kill_seedling | 1 | "Sorry. They're only trying to reach the light." |
| `bark.mira.first_kill_thornrunner` | Mira | first_kill_thornrunner | 2–5 | "Field note: fast, fragile. Don't give them a straight line." |
| `bark.tavi.first_kill_rustwing` | Tavi | first_kill_rustwing | 3–5 | "That's a rotor and a bad attitude. Dropped it." |
| `bark.mira.first_kill_briarheart` | Mira | first_kill_briarheart | 4–5 | "Field note: it was a tractor. It's less of one now." |
| `bark.mira.low_health` | Mira | low_health | 1–5 | "I'm fine. I'm fine. Give me a second." |
| `bark.sela.low_health` | Sela | low_health | 1–5 | "Mira, you're bleeding signal. Back off for a moment." |
| `bark.tavi.low_health` | Tavi | low_health | 2–5 | "That's a red light on my console and it's not the relay." |
| `bark.idris.low_health` | Idris | low_health | 4–5 | "Mira, status. Say anything." |
| `bark.mira.health_restored` | Mira | health_restored | 1–5 | "Okay. Okay. Better." |
| `bark.sela.health_restored` | Sela | health_restored | 1–5 | "There she is." |
| `bark.mira.level_up_milestone` | Mira | level_up_milestone | 1–5 | "Field note: the field is adapting. So am I." |
| `bark.tavi.level_up_milestone` | Tavi | level_up_milestone | 2–5 | "Running hot, still running. Good." |
| `bark.sela.level_up_milestone` | Sela | level_up_milestone | 1–5 | "The nursery logged that. Something is growing, even now." |
| `bark.mira.near_miss` | Mira | near_miss | 1–5 | "Too close. I'm quieter when it's too close." |
| `bark.tavi.near_miss` | Tavi | near_miss | 2–5 | "Ticket opened: do not do that again." |
| `bark.mira.pulse_clutch` | Mira | pulse_clutch | 1–5 | "That cleared more than it should have." |
| `bark.tavi.pulse_clutch` | Tavi | pulse_clutch | 2–5 | "Good. I'd have charged for that one." |
| `bark.sela.long_no_damage` | Sela | long_no_damage | 1–5 | "You're moving like water. Keep going." |
| `bark.tavi.long_no_damage` | Tavi | long_no_damage | 2–5 | "No hits in a minute. I'm suspicious, but pleased." |
| `bark.sela.entity_low_patch` | Sela | entity_low | 3 | "The patch is fading. Please — no, don't be gentle. Hold them off." |
| `bark.tavi.entity_low_relay` | Tavi | entity_low | 4 | "Relay's at thirty. I can't push it harder." |
| `bark.idris.entity_low_relay` | Idris | entity_low | 4 | "Relay is failing. Three hours is a long time to be blind." |
| `bark.tavi.ability_coil` | Tavi | ability_unlocked | 2 | "Coil Arc, installed. Try not to light yourself up." |
| `bark.sela.ability_bloomguard` | Sela | ability_unlocked | 3 | "Bloomguard. The petals shield. Sorry, I mean it's a ring of pollen that, yes, shields." |
| `bark.tavi.ability_wren` | Tavi | ability_unlocked | 4 | "Wren will follow you. It's not a companion. It's a tool with opinions." |
| `bark.wren.first_shot` | Wren | wren_first_shot | 4–5 | "[Wren chirps twice]" |
| `bark.wren.low_health` | Wren | low_health | 4–5 | "[Wren stutters, recovers]" |
| `bark.wren.level_up` | Wren | level_up_milestone | 4–5 | "[Wren whirs, pleased]" |
| `bark.tavi.objective_complete` | Tavi | objective_complete | 2–5 | "Done. Logging it." |
| `bark.sela.objective_complete` | Sela | objective_complete | 1–5 | "That's one fewer thing to be afraid of." |
| `bark.mira.objective_complete` | Mira | objective_complete | 1–5 | "We're still here." |
| `bark.mira.boss_phase` | Mira | boss_phase_change | 5 | "New pattern. Adjusting." |
| `bark.sela.boss_phase` | Sela | boss_phase_change | 5 | "That's the loop reacting. It's afraid. I mean — it's responding." |
| `bark.tavi.boss_phase` | Tavi | boss_phase_change | 5 | "Okay, that's new. Write it down." |
| `bark.idris.boss_phase` | Idris | boss_phase_change | 5 | "Convoy to Mira. We see lightning. Hold." |

Add more only as data. Keep a lint test that checks every `stringId` exists, every character has at least three barks, and no caption exceeds the length limit.

---

## 8. Portraits and presentation

- **Per character:** three states (neutral, worried, relieved), built from layered vector parts with theme tokens (face, hair, accessories), so no external art is needed.
- **Card layout:** portrait left, speaker name, caption text. Reduced motion: no slide-in animation.
- **Caption display time:** from string length (config words-per-second), minimum 2.5 s, maximum 7 s. Player can skip with Enter or Space on story cards.

---

## 9. Post-v1 playable heroes (roadmap, not in v1)

Each hero has a different base weapon, one passive, one active skill and one flaw. They reuse existing behavior modules and need new data and strings, not new engine code.

| Hero | Base | Passive | Active | Flaw |
|---|---|---|---|---|
| **Tavi Rook** | Wren from the start, short-range wrench throw | Drones fire 15% faster | Overclock: 4 s of doubled turret fire rate | Low health; personal attack is weak |
| **Dr. Sela Rowan** | Bloomguard from the start; plants lingering damage fields | Healing seeds sometimes drop | Bloom Burst: a field of damaging pollen | Slow movement |
| **Idris Kael** or a **convoy scout** | Fast single-target shot | Move speed bonus | Dash with brief invulnerability instead of Beacon Pulse | Fewer ability slots |

---

## 10. Other expansion directions

- **Ability evolutions:** Coil Arc + Bloomguard becomes "Storm Garden"; Wren + Coil Arc becomes "Tesla Wren". Data-only if the effect model supports `evolve_ability`.
- **Run mutators:** Heavy Wind (stronger gusts), Night Without Moon (reduced visibility), Quiet Seeds (fewer glow-seeds, bigger XP).
- **Seeded daily challenge** (offline, seed derived from the date).
- **Ledger completion cosmetics:** portrait frames, emblem variants.
- **Gamepad and touch support.**
- **More radio voices:** convoy passengers, a seed-bank archivist (Ledger flavor only).
