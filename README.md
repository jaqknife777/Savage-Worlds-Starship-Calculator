# Savage Worlds Starship Builder (The Last Parsec)

A single-page HTML/CSS/JS app to build starships for **Savage Worlds** (Last Parsec style).  
It calculates base stats by Size, applies **Modifications**, and manages **Vehicular Weapons** (including missiles/torpedoes/bombs with launchers/bays + ammo bundles). A printable **Starship Stat Block** is generated as you edit.

> ⚠️ Unofficial fan project. Savage Worlds® and The Last Parsec™ are the property of Pinnacle Entertainment Group. This tool is for personal/non-commercial use.

---

## ✨ Features

- **Size presets** (Tiny → World Killer) with base Acc/TS, Climb, Toughness, Crew, Energy, Mod Slots, Cost.
- **Modifications panel**  
  - Input-first layout with controls right-aligned, labels left-aligned.  
  - Per-mod slot and cost rules (Armor, FTL, Deflector Screens, etc).  
  - Dynamic limits (e.g., “Size”-limited mods, numeric caps).  
  - Live effects: Toughness, Speed, Crew, Slots, Costs.
- **Vehicular Weapons system**
  - Fixed/energy/gun families (Lasers, Cannons, Auto-Cannons, etc.).
  - **Mass Driver (level-based)**: damage = *Level*d12; **Mods = ceil(Level/2) per mount**; **max Level = floor(Size/2)**; **Cost = $100k × Size per mount**; Shots 15.  
  - **Missiles / Torpedoes**: require **Launchers** (mounts) + **Ammo**; **Mods = launchers + ceil(ammo / per-mod bundle)**; cost scales by ammo (and optional launcher cost).
  - **Bombs**: require **Bomb Bays** + **Ammo**; same bundle logic (Small 12/1, Medium 8/1, Large 4/1, Block Buster 2/1, City Buster 1/1).  
  - Notes rendered in the stat block (e.g., AP/HW/template rules).
- **Separate “Vehicular Weapons” block** under the stat block with totals (slots & cost).
- Clean, dark UI; responsive; no build step—**just open `index.html`**.

---

## 🚀 Quick Start

```bash
# clone
git clone https://github.com/<you>/<repo>.git
cd <repo>

# run (no build step)
# Option A: Double-click index.html
# Option B: Serve locally (recommended for CORS-safe file URLs)
python3 -m http.server 8080
# then open http://localhost:8080

.
├── index.html        # App layout: Size picker, Modifications, Weapons UI, Stat Blocks
├── style.css         # Theme + layout rules (grid for stat block; right/left alignment for mods)
└── calculator.js     # All logic: data tables, UI building, calculations, rendering
