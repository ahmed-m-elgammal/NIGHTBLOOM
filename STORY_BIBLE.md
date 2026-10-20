# NIGHTBLOOM: The Last Signal — Story Bible

**Authority:** this file is the source of truth for story logic, geography, timeline and all chapter dialogue. If it conflicts with GDD section 2 or the old chapter scripts, this file wins. Mechanics live in `docs/GDD.md`. Character voice, Field Ledger entries and barks live in `docs/CHARACTERS.md`.

---

## 1. Logline, theme, motifs

**Logline:** In the Grey Season, a field ecologist relights the beacon she once switched off, knowing it will draw a storm, so the last convoy can find the last seed nursery.

**Theme line:** "A signal is only worth sending if someone is listening."

**The twist on the theme:** the villain is a signal that only listens to itself. Stormroot is the **ring**, an echo with a body. Mira's arc is the opposite: she stops being one voice with nobody on the line and learns to ask for help.

**Three motifs the whole story repeats:**
1. **Listening.** Who is on the line, who is not, who answers.
2. **Quiet.** Louder is never the fix. Water muffles the ring (Ch3), louder makes it worse (Ch4), quieter ends it (Ch5).
3. **Bookend.** Mira switched the beacon off once and someone was lost. At the end she switches it off again, and nobody is out there.

---

## 2. The rules that make the story hold

These nine rules are the whole logic. Every line of dialogue must agree with them.

| # | Rule |
|---|---|
| R1 | The **Hollow Wind** is the Grey Season's own storm: dust, dead machinery, thorn growth and dormant spores on a pressure front. It is not alive and not malicious. |
| R2 | It is drawn to a **ring**: a signal that echoes against itself. |
| R3 | The beacon's **Old Core** (an amplifier pylon at the field's heart) has a cracked damping coil, damaged six years ago when the first storm struck. Whenever the beacon transmits, the Old Core rings. The ring grows the longer it runs and the more power is fed through it. **That is why every surge is bigger than the last.** |
| R4 | The storm gathers where the ring is loudest. All night it condenses around the Old Core. **Stormroot** is that gathered mass: thorn growth, scrap and nightbloom wrapped around the Old Core. |
| R5 | With no ring to follow, the wind follows the **nearest strong transmission**. That is a convoy's radios. (This is what happened to the Ninth Column.) |
| R6 | The dust veil blocks stars and satellites, so the beacon is the convoy's **only navigation**. It cannot be switched off until the convoy is in. |
| R7 | The **nightbloom is a barometer, not a cause.** It is ring-sensitive and brightens about a minute before each surge. That glow is the in-game surge warning. |
| R8 | The ring is beaten by making it **quieter**, not louder: either Tavi's antiphase tone cancels it, or the Old Core is destroyed. |
| R9 | Cutting the ring unwinds the gathered storm. It does not cure the Grey Season. |

---

## 3. Locked glossary

Use these words consistently in strings, data IDs and comments. Do not substitute.

| Term | Meaning |
|---|---|
| **Beacon** | The lamp mast Mira lights. What the convoy sees. Its transmitter holds the cracked coil in Ch2. |
| **Old Core** | The amplifier pylon at the field's heart, next to the beacon. Damaged. It rings. It becomes Stormroot. |
| **Ring** | The echo the Old Core makes. What the storm follows. |
| **Relay Station** | Tavi's shack at the Relay Edge. It repeats the beacon's signal to the convoy. |
| **Backup relay** | The second transmitter 200 m up the line from the Relay Station (Ch4). |
| **Carrier / signal** | What the convoy actually hears. |
| **Tenth Column** | The current convoy. Led by Warden Idris Kael. |
| **Ninth Column** | The convoy lost six years ago. |
| **Vault** | The nursery's seed vault. Sela runs it. |
| **Mother patch** | The last living nightbloom patch, at the water margin (Ch3). The vault seeds only wake beside living bloom. |

---

## 4. Geography (one map, five chapters)

| Place | Where | Story use |
|---|---|---|
| **Nursery and vault** | north, off the playable edge | Sela is here. She is the vault's "lungs" and cannot leave. |
| **Beacon + Old Core** | field centre | Mira's home base. The Old Core is visible in every chapter and grows. |
| **Irrigation track** | east | Ch2: rusty harvester with the matching coil. The wind front sits on this track. |
| **Water margin** | south-west | Ch3: the mother patch. Shallow water muffles the ring here. |
| **Relay Edge** | north-east | Ch4: Relay Station (Tavi) and the backup relay 200 m further up. |
| **Beyond the veil** | south | The Tenth Column approaches from here. Never shown. |

---

## 5. Backstory: the Ninth Column

Keep this to **three mentions** so it lands: the Ch2 reveal, the Ch5 exchange with Sela, and one Ledger entry. No flashback cinematics. No named dead characters.

| When | Event |
|---|---|
| Six years ago | A convoy, the **Ninth Column**, was heading for the nursery. Mira lit the beacon for them. The first Hollow Wind struck the field and cracked the Old Core's damping coil. The ring began. |
| Six years ago | The storm closed in on the nursery. Mira **switched the beacon off** to save it. With no ring to follow, the storm followed the nearest signal: the Ninth Column's radios, twelve kilometres out. The Ninth never reported in. |
| Since then | The beacon stayed dark. Sela kept bloom logs and feared the nightbloom was the cause. Mira stopped talking about it. |
| Tonight | The **Tenth Column** is on its way and has no other navigation. Mira relights the beacon, knowing what it will cost. She will not switch it off twice. |

---

## 6. The night clock

All five chapters happen on **one night**. Chapters are separate stretches of it; interlude cards cover the gaps. The playable minutes do not equal story hours.

| Chapter | Night label | Lighting | Convoy status |
|---|---|---|---|
| 1 | **Dusk** | last blue light | unheard, one garbled burst at the end |
| 2 | **Moonless** | deep blue-green | unspoken |
| 3 | **Second Watch** | cold, water-reflective | unspoken |
| 4 | **Small Hours** | darkest, strongest beacon glow | Idris: three hours out |
| 5 | **Before Dawn** | first grey in the east | Idris: twelve minutes at phase 2 |

The Ch5 **Signal Lock** is the convoy's final five minutes. The boss phase begins about five minutes before arrival, which is why the timer is 300 s.

---

## 7. Why nobody else can help, and why Mira cannot leave

| Question | Answer |
|---|---|
| Why doesn't Mira just leave the field? | The beacon is an old hand-keyed vault lamp. It drifts off frequency without a keeper in range. The keeper range is the Nightbloom Field (this is why the map is bounded). And she will not abandon a signal twice. |
| Why doesn't Sela come help? | The vault runs on a manual climate loop. If she leaves it, the seed stock spoils in minutes. She says: "I'm the vault's lungs." |
| Why doesn't Tavi come help? | The wind front is parked on the track between her Relay Station and the field. She is pinned behind it until Wren flies a line over it in Ch4. |
| Why can't the convoy just turn back? | No navigation, low fuel, passengers aboard. |
| Why not shut the beacon down and go to ground? | R5 and R6, and the Ninth Column. |

---

## 8. Chapters: beats and dialogue

String ID convention (extends `docs/CHARACTERS.md` section 1): `story.ch<N>.<beat>` for cards, `radio.<charId>.ch<N>_<beat>` for radio, `system.ch<N>.<beat>` for system text. Radio captions: 100 characters or fewer. Cards: three lines or fewer. All skippable.

### Chapter 1 — The Nursery Wakes · *Dusk*
- **Purpose:** teach the loop, establish stakes and Mira's wound lightly, plant the Old Core as a clue.
- **New information:** the Tenth Column is coming. Mira switched this beacon off once. The big pylon hums.
- **Emotional beat:** resolve; Mira acts alone and capably.
- **Hook:** "Humming isn't supposed to get louder."

| String ID | Speaker | Line |
|---|---|---|
| `story.ch1.intro` | Mira (card) | "Field note: six years ago I switched this beacon off. Tonight it runs." |
| `radio.sela.ch1_lit` | Sela | "The beacon's lit, Mira. The Tenth Column will see it. So will everything else." |
| `radio.mira.ch1_reply` | Mira | "Then we make it worth the trip." |
| `story.ch1.keeper` | Mira (card) | "The old lamp drifts without a keeper in range. I stay on the field." |
| `system.ch1.seeds` | system | "Glow-seeds feed the nursery. Walk through them to collect." |
| `radio.sela.ch1_petals` | Sela | "Those petals track the light. Phototropism. Sorry, plants follow light. Don't let them reach you." |
| `radio.sela.ch1_glow` | Sela | "The blooms brighten about a minute before each surge. I've logged it. I don't understand it. Brace." |
| `system.ch1.bloom_glow` | system | "The blooms are glowing. A surge is coming." |
| `radio.sela.ch1_reward` | Sela | "The Tenth Column caught our signal. It's garbled, but they caught it." |
| `radio.idris.ch1_static` | Idris | "…copy… lamp… south-south-east… say again…" |
| `radio.tavi.ch1_intro` | Tavi | "Tavi Rook, relay station. Your signal sounds like a kettle. I'll fix it." |
| `radio.tavi.ch1_hum` | Tavi | "Also, that big pylon in your field is humming at me. Loud." |
| `radio.mira.ch1_hum` | Mira | "That's the Old Core. It's always hummed." |
| `radio.tavi.ch1_hum2` | Tavi | "Mm. Humming isn't supposed to get louder." |

**Ledger:** Seedling, Bloomed Seedling, Old Core (discovered at reward).

### Chapter 2 — Rustline · *Moonless*
- **Purpose:** introduce Tavi's problem and the ring; the midpoint reveal; surface Mira's wound.
- **New information:** the storm follows the **ring**, not the convoy. With no ring it goes for the nearest signal.
- **Emotional beat:** Mira goes quiet. Sela knows why. Tavi does not.
- **Hook:** the humming is the ring.

| String ID | Speaker | Line |
|---|---|---|
| `story.ch2.intro` | Tavi (card) | "Ticket one: your coil is cracked. Ticket two: a harvester on the track has a match. Ticket three: the wind front is parked on that track, so you go alone." |
| `system.ch2.gust` | system | "Wind front incoming. Move out of the lane." |
| `radio.tavi.ch2_coil` | Tavi | "That's the one. Bring it back to the beacon. I'll talk you through the install." |
| `radio.tavi.ch2_installed` | Tavi | "Coil's in. Ticket closed." |
| `radio.tavi.ch2_ring` | Tavi | "Signal's clean on my end. But there's a ring under it. The beacon is echoing itself." |
| `radio.tavi.ch2_follow` | Tavi | "The storm isn't following the convoy. It's following the ring." |
| `radio.mira.ch2_dark` | Mira | "And if the beacon goes dark?" |
| `radio.tavi.ch2_nearest` | Tavi | "Then it goes for the next-loudest thing. The convoy's radios." |
| `radio.sela.ch2_name` | Sela | "Mira." |
| `radio.mira.ch2_know` | Mira | "I know." |
| `radio.tavi.ch2_what` | Tavi | "Know what?" |
| `radio.mira.ch2_deflect` | Mira | "Field note: the beacon can't go dark. Not tonight." |

**Ledger:** Thornrunner, The Ring, The Ninth Column. **Unlock:** Coil Arc.

### Chapter 3 — The Quiet Water · *Second Watch*
- **Purpose:** Sela's arc. Plant the thematic answer: quiet.
- **New information:** the nightbloom is a barometer, not a cause. Water muffles the ring. The ring doubles every hour.
- **Emotional beat:** Mira tells Sela "You didn't cause it." Sela: "Say it again once I've stopped shaking."
- **Hook:** the beacon cannot carry the convoy through another hour of this. They need a clean line out.

| String ID | Speaker | Line |
|---|---|---|
| `story.ch3.intro` | Sela (card) | "The vault seeds only wake beside living bloom. This patch is the last. If it dies, the Tenth Column carries dust. Please." |
| `radio.sela.ch3_logs` | Sela | "Both times we lit the beacon in bloom season, the wind came. I've read the logs forty times." |
| `radio.mira.ch3_rustwing` | Mira | "Field note: scrap with rotors. They stop before they shoot. Use the pause." |
| `radio.sela.ch3_patch_low` | Sela | "The patch is fading. Hold them off. Gently — no, don't be gentle." |
| `radio.sela.ch3_quiet` | Sela | "Wait. The blooms by the water aren't glowing. The water is muffling the ring." |
| `radio.sela.ch3_proof` | Sela | "The patch stayed dark, and the surge still came. It isn't the flowers. It was never the flowers." |
| `radio.mira.ch3_reply` | Mira | "You didn't cause it." |
| `radio.sela.ch3_shaking` | Sela | "Say it again once I've stopped shaking." |
| `radio.sela.ch3_growing` | Sela | "And Tavi, my logs say the ring doubles every hour. By dawn it will drown the beacon." |
| `radio.tavi.ch3_backup` | Tavi | "Then the convoy needs a clean line. There's a backup relay two hundred meters up from me." |

**Ledger:** Rustwing, Nightbloom (updated). **Unlock:** Bloomguard.

### Chapter 4 — The Broken Relay · *Small Hours*
- **Purpose:** the cost. The fix makes it worse. Mira trusts someone else's plan.
- **New information:** the backup relay is too weak alone, so Tavi routes it through the Old Core's amplifier, which feeds the ring.
- **Emotional beat:** shared responsibility. Tavi blames herself; Mira: "We made it together."
- **Hook:** the ring tripled. The Tenth has a lock. So does the storm.

| String ID | Speaker | Line |
|---|---|---|
| `story.ch4.intro` | Tavi (card) | "The backup relay is two hundred meters up the line. It's too weak to punch the veil. The only amplifier with the gain is the Old Core." |
| `radio.sela.ch4_objects` | Sela | "The Old Core is the ring, Tavi." |
| `radio.tavi.ch4_know` | Tavi | "I know. It's also the only thing out here with the power. I need you both to trust me." |
| `radio.mira.ch4_do_it` | Mira | "Do it. Tell me where to stand." |
| `radio.sela.ch4_backs` | Sela | "…Do it. I'll watch the logs." |
| `radio.idris.ch4_eta` | Idris | "Tenth Column to Mira. Three hours out. Fuel for four. Keep doing whatever you're doing." |
| `radio.mira.ch4_briarheart` | Mira | "Field note: heavy, slow, hits like a tractor because it was one. Don't get greedy." |
| `system.ch4.countdown` | system | "Backup relay online in {time}." |
| `radio.tavi.ch4_clean` | Tavi | "Clean signal. No more kettle. The Tenth Column has a lock. They're close." |
| `radio.sela.ch4_tripled` | Sela | "The ring just tripled, Tavi." |
| `radio.tavi.ch4_mine` | Tavi | "I gave it a better signal to chew. That's on me." |
| `radio.mira.ch4_ours` | Mira | "It's on the plan. We made it together." |
| `radio.tavi.ch4_wren` | Tavi | "This is Wren. I built it from the last thing I couldn't fix. Don't tell it." |
| `radio.wren.ch4_chirp` | Wren | "[Wren chirps twice]" |

**Ledger:** Briarheart. **Unlock:** Wren (it flies the line over the wind front to reach Mira).

### Chapter 5 — Before Dawn · *Before Dawn*
- **Purpose:** pay off every thread. The answer is **quieter, and together.**
- **The plan:** Tavi sends an antiphase tone through the backup relay to cancel the ring. She needs five minutes of clean lock (the Signal Lock). Sela adds: break the Old Core and it is faster.
- **Emotional beat:** Mira asks for help in plain words, with no "Field note:" tic. Then Sela returns Ch3's line.
- **Boss:** Stormroot is the Old Core, overgrown. Two ways to win, both silencing the ring: destroy it, or hold until the antiphase lock completes.

| String ID | Speaker | Line |
|---|---|---|
| `story.ch5.intro` | Mira (card) | "Field note: the field is lit like a festival. All of it, for one signal." |
| `radio.tavi.ch5_plan` | Tavi | "Louder isn't the fix. Quieter is. I can cancel the ring with an antiphase tone." |
| `radio.tavi.ch5_plan2` | Tavi | "I need five minutes of clean lock." |
| `radio.sela.ch5_core` | Sela | "Or break the Old Core itself. It's overgrown, but the core is in there." |
| `radio.mira.ch5_ask` | Mira | "I can't do this alone. I need you both." |
| `radio.tavi.ch5_finally` | Tavi | "Finally." |
| `radio.sela.ch5_here` | Sela | "We're here." |
| `radio.idris.ch5_contact` | Idris | "Tenth Column to Mira. We see your light. Twelve minutes." |
| `system.ch5.lock` | system | "Signal lock: {percent}%" |
| `radio.tavi.ch5_phase2` | Tavi | "It's changing frequency. Stay mobile." |
| `radio.sela.ch5_phase3` | Sela | "It's pulling at the flowers, at you. Use the pulse. Use the pulse!" |
| `radio.tavi.ch5_end_defeat` | Tavi | "Core's silent. Ticket closed. Actually closed." |
| `radio.tavi.ch5_end_timer` | Tavi | "Antiphase holds. The ring is cancelled. It's unwinding." |

**Ledger:** Stormroot, Hollow Wind (updated).

---

## 9. Foreshadowing and payoff

Every planted thing has a payoff. Nothing is introduced without one.

| Plant | Where | Payoff | Where |
|---|---|---|---|
| **Old Core pylon**, hum rising | Ch1 stage 0 (dim hum) | Becomes Stormroot | Ch5 |
| Old Core growth: thorns, then machinery, then a pulse | Ch2 stage 1, Ch3 stage 2, Ch4 stage 3, Ch5 stage 4 | The boss does not appear from nowhere | Ch5 boss |
| **Bloom glow** before each surge | Ch1 | The in-game surge warning; evidence for Sela | Ch3 |
| Water muffles the ring; patch stays dark | Ch3 | "Quieter, not louder" | Ch5 plan |
| "Your signal sounds like a kettle" | Ch1 | "No more kettle." | Ch4 |
| "Ticket closed" | Ch2 | "Actually closed." | Ch5 |
| "Say it again once I've stopped shaking." (Sela) | Ch3 | Mira says it back | Ch5 |
| Mira's "Field note:" tic | Ch1 onward | Dropped when she asks for help | Ch5 |
| Mira switched the beacon off six years ago | Ch1 | She switches it off at the end | Ch5 |
| Wren, built from a failed repair | Ch4 | Tavi's redemption; Wren is the one that crosses the front | Ch4–5 |
| Idris as garbled static | Ch1 | Clear voice, then "Wheels on the field" | Ch4–5 |

**Old Core growth stages (data, one per chapter):** 0 inert pylon, dim hum; 1 thorn tendrils at the base; 2 thorns climbing, faint glow; 3 wrapped in scrap machinery, audible pulse; 4 massive, visibly pulsing; boss: awakens as **Stormroot**. The hum rises in pitch with each stage and carries into Stormroot's boss sound.

---

## 10. Ending sequence

Played in order after victory. Every card is skippable. Both win variants (destroyed, timer) use their own Tavi line from section 8, then the same sequence below.

| Beat | String ID | Speaker | Line |
|---|---|---|---|
| Convoy arrives | `radio.idris.ch5_arrive` | Idris | "Tenth Column to Mira. Wheels on the field. Seeds are moving. Thank you." |
| Sela returns the line | `radio.sela.ch5_ninth` | Sela | "Mira. The Ninth. It wasn't you. It was the ring." |
| | `radio.mira.ch5_shaking` | Mira | "Say it again once I've stopped shaking." |
| Bookend | `story.ch5.switch_off` | Mira (card) | "Field note: I switched the beacon off. This time, nobody is out there waiting." |
| Closing | `story.ch5.final` | Mira (card) | "The Grey Season isn't over. But there's light on the field, and people walking into it." |
| Title line | `story.ch5.theme` | — | "A signal is only worth sending if someone is listening. Tonight, someone was." |

The closing card shows the three portraits together (Mira, Sela, Tavi) in their relieved state. Idris is heard, not seen.

---

## 11. Writing guardrails

- **No new named characters.** The Ninth Column is a name, not a cast. No flashback cinematics. No villain voice. No new factions.
- **Tic budgets:** Mira's "Field note:" on at most about one in three of her lines, and never when she is asking for help. "Ticket closed" is reserved for exactly two moments: Ch2 install and Ch5 ending. Tavi's other ticket phrases ("Ticket opened", "Logged") are fine but sparing.
- **The Ninth Column:** three mentions only (Ch2 reveal, Ch5 exchange with Sela, one Ledger entry).
- **Hopeful tone:** loss is stated plainly and briefly, then the story moves. No mourning scenes.
- **Do not blame the nightbloom** in dialogue after Ch3.
- **Ring terminology** (`ring`, `Old Core`) first appears in Ch1 only as Tavi's "humming". The word "ring" is introduced by Tavi in Ch2.

---

## 12. Story consistency checks (add as tests or a lint step)

1. Every string ID in this file exists in `en.ts` and no radio caption exceeds 100 characters.
2. "Ticket closed" appears only in `radio.tavi.ch2_installed` and `radio.tavi.ch5_end_defeat`.
3. `ledger.ring` and `ledger.ninth_column` unlock only after the Ch2 reveal. `ledger.old_core` unlocks at the Ch1 reward.
4. Every chapter data record has `nightLabelStringId` and `coreGrowthStage`, and Ch1–Ch5 stages are 0–4 in order.
5. Idris speaks clearly only from Ch4. Ch1 is static only.
6. The Signal Lock (300 s) matches Idris's "Twelve minutes" at the start of Ch5 phase 2: phases 2 and 3 take 420 s, which leaves exactly 300 s of convoy approach for the boss phase.
