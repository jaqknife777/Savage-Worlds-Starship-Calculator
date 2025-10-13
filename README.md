# Savage Worlds Starship Builder (The Last Parsec)

**Hosted Page:** https://jaqknife777.github.io/Savage-Worlds-Starship-Calculator/

A single-page **HTML/CSS/JS** app to build starships for **Savage Worlds** (The Last Parsec style).  
It calculates base stats by Size, applies Modifications (with slot & cost rules), manages Vehicular Weapons (including launchers/bays & ammo, Mass Drivers with level rules, and link/fix groups), and generates a printable **Starship Stat Block** + **Vehicular Weapons** panel.

> ⚠️ **Unofficial fan project.** Savage Worlds® and The Last Parsec™ are the property of **Pinnacle Entertainment Group**. This tool is for personal/non-commercial use.

---

## ✨ Current Settings and Features

- **Size presets** (Tiny → World Killer): Acc/TS, Climb, Toughness **(Armor)**, Mods, Crew, Energy, Cost.
- **Modifications UI:** input-first rows (controls on the left, labels on the right) with live recalculation.
- **Capacity enforcement:** counters & weapon adds auto-clamp so total **Mod Slots Used ≤ Capacity**.
- **Speed rules**
  - **Speed:** +5 Acc **and** +50 TS per rank.
  - **Speed Reduction:** −5 Acc and −50 TS, **+1 Mod capacity** per rank.
  - Mutually exclusive (UI auto-clears the other).
- **Energy & Fuel Pods**
  - **Fuel Pods:** +50% **base** Energy per pod (additive), **slots = ceil(Size/2)**, **cost = 100k × Size**.
- **Gated / sized mods**
  - **Garage / Hangar:** Size ≥ 12; max **⌊Size/8⌋**; **8 slots** each; **$1,000,000** each.
  - **Superstructure:** Size ≥ **24** (Gargantuan+); **24 slots** each; cost = **$5,000,000**.
  - **Mercantile:** Size ≥ **16** (Huge+); **2 slots** each; **$100,000** each.
  - **Kalian FTL:** like FTL for slots, **cost = 4,000,000 × Size**, grants **+2 Astrogation**.
- **Weapons**
  - Catalog: Auto-Cannons, Cannons, **Ion Cannons**, Lasers, **Flamethrower**, **Grenade Launcher**, Missiles, Torpedoes, Bombs, **Mass Driver**.
  - **Launchers/Bays & ammo** (missiles/torpedoes/bombs): Mods = launchers/bays + ammo bundle storage.
  - **Mass Driver** (level-based):  
    - Damage = **Level d12**; **Mods = ceil(Level/2)** **per mount**  
    - Max Level = **floor(Size/2)** (UI clamps)  
    - Cost = **$100k × Size per mount**; Shots **15**
  - **Linked/Fixed (for linkable weapons only):**  
    - Shown only when **Quantity = 2 or 4**.  
    - **Group size = Quantity**.  
    - **To-hit bonus (capped):** +1 for qty **2**, +2 for qty **4+**.  
    - **Damage bonus (per weapon):** Linked **+4 each**, Fixed **+8 each**.  
    - Missiles/Torps/Bombs, **Grenade Launchers**, and **Flamethrowers** **are not linkable**.
- **Two clean stat panels**
  - **Starship Stat Block** (Adjusted Acc/TS, Toughness (Armor), Crew, Energy, slots, costs).
  - **Vehicular Weapons** (table + notes; totals for weapon slots & weapon cost).
- **Save / Load / Share**
  - Local **Save/Load** (browser localStorage)
  - **Download/Upload** JSON
  - **Share URL** (state in URL hash; no server)

---

## 📜 Credits & Legal

- Savage Worlds® and The Last Parsec™ © Pinnacle Entertainment Group.
- This is an unofficial, non-commercial fan tool.
- Please support the official game and its creators!

---

## 🚀 Quick Start

**Live Demo:** https://jaqknife777.github.io/Savage-Worlds-Starship-Calculator/

**Run locally**
```bash
# Option A: open the file
open index.html     # or double-click it
# Option B (recommended): simple local server
python3 -m http.server 8080
# then visit
http://localhost:8080
