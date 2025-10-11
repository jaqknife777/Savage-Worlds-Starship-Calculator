# Savage Worlds Starship Builder (The Last Parsec)

A single-page HTML/CSS/JS app to build starships for **Savage Worlds** (Last Parsec style).  
It calculates base stats by Size, applies **Modifications**, manages **Vehicular Weapons** (missiles/torpedoes/bombs with launchers/bays + ammo bundles, Mass Drivers with level rules), and generates a printable **Starship Stat Block**.

> ⚠️ Unofficial fan project. Savage Worlds® and The Last Parsec™ are the property of Pinnacle Entertainment Group. This tool is for personal/non-commercial use.

---

## ✨ Features

- **Size presets** (Tiny → World Killer) with Acc/TS, Climb, Toughness, Crew, Energy, Mod Slots, Cost.
- **Modifications** (input-first layout; controls right-aligned, labels left-aligned) with live effects on stats.
- **Vehicular Weapons**
  - Auto-Cannons, Cannons, Lasers, Flamethrower, Grenade Launcher, etc.
  - **Mass Driver (level-based)**  
    - Damage = *Level*d12  
    - **Mods = ceil(Level/2) per mount**  
    - **Max Level = floor(Size/2)** (auto-clamped in UI)  
    - **Cost = $100k × Size per mount**; Shots 15
  - **Missiles & Torpedoes**: require **Launchers** + **Ammo**  
    - **Mods = launchers + ceil(ammo / bundle)** (e.g., 12/1)  
    - **Cost = launcherCost × launchers + costPerAmmo × ammo**
  - **Bombs**: require **Bomb Bays** + **Ammo**  
    - Bundles: Small **12/1**, Medium **8/1**, Large **4/1**, Block Buster **2/1**, City Buster **1/1**  
    - Mods and cost handled like missiles (bays act as launchers)
  - Notes (AP/HW/templates/range notes) are rendered in the weapons list.
- **Two clean stat panels**
  - **Starship Stat Block**
  - **Vehicular Weapons** (separate block with slots & cost totals)
- **Save / Load / Share**
  - **Save Locally** (browser `localStorage`)
  - **Load Local**
  - **Download JSON** / **Upload JSON**
  - **Share URL** (state encoded in the URL hash; no server required)

---

## 🚀 Quick Start

# Option A: double-click index.html
# Option B (recommended): serve locally
python3 -m http.server 8080
# open http://localhost:8080

## 📁 Project Structure
├── index.html        # App layout: Size picker, Modifications, Weapons UI, Stat Blocks
├── style.css         # Theme + layout rules (grid for stat block; right/left alignment for mods)
└── calculator.js     # All logic: data tables, UI building, calculations, rendering
