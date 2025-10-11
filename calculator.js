
// calculator.js (fixed)
document.addEventListener("DOMContentLoaded", () => {
  const shipSizeSelect = document.getElementById("shipSize");
  const shipNameInput = document.getElementById("shipName");
  const modContainer = document.getElementById("modContainer");

  const sizeData = {
    2:  { size: 2,  name: "Tiny",        accTS: "4/60/800",  climb: 4,  toughness: 15, mods: 10,  crew: 1,    energy: 10,    cost: 1_000_000 },
    4:  { size: 4,  name: "Small",       accTS: "6/50/700",  climb: 3,  toughness: 20, mods: 20,  crew: 2,    energy: 25,    cost: 2_000_000 },
    8:  { size: 8,  name: "Medium",      accTS: "8/45/600",  climb: 2,  toughness: 25, mods: 25,  crew: 5,    energy: 100,   cost: 5_000_000 },
    12: { size: 12, name: "Large",       accTS: "12/40/500", climb: 1,  toughness: 35, mods: 30,  crew: 50,   energy: 300,   cost: 20_000_000 },
    16: { size: 16, name: "Huge",        accTS: "16/35/400", climb: 0,  toughness: 45, mods: 40,  crew: 300,  energy: 500,   cost: 50_000_000 },
    20: { size: 20, name: "Giant",       accTS: "20/30/300", climb: -1, toughness: 50, mods: 50,  crew: 1000, energy: 1000,  cost: 200_000_000 },
    24: { size: 24, name: "Gargantuan",  accTS: "24/25/200", climb: -2, toughness: 55, mods: 70,  crew: 3000, energy: 2000,  cost: 1_000_000_000 },
    28: { size: 28, name: "Behemoth",    accTS: "28/20/200", climb: -3, toughness: 60, mods: 90,  crew: 8000, energy: 2000,  cost: 5_000_000_000 },
    32: { size: 32, name: "Leviathan",   accTS: "32/20/200", climb: -4, toughness: 70, mods: 120, crew: 20000,energy: 2000,  cost: 10_000_000_000 },
    40: { size: 40, name: "World Killer",accTS: "40/20/200", climb: -5, toughness: 80, mods: 150, crew: 50000,energy: 2000,  cost: 30_000_000_000 }
  };

  // DOM targets for base stats
  const baseStats = {
    sizeNumber: document.getElementById("sizeNumber"),
    accTS:      document.getElementById("accTS"),
    toughness:  document.getElementById("toughness"),
    crew:       document.getElementById("crew"),
    energy:     document.getElementById("energy"),
    baseCost:   document.getElementById("baseCost"),
    modSlots:   document.getElementById("modSlots"),
  };

  // DOM targets for results
  const results = {
    shipNameDisplay:    document.getElementById("shipNameDisplay"),
    shipSizeDisplay:    document.getElementById("shipSizeDisplay"),
    accTS:              document.getElementById("resultAccTS"),
    climbRate:          document.getElementById("climbRate"),
    adjustedToughness:  document.getElementById("adjustedToughness"),
    adjustedCrew:       document.getElementById("adjustedCrew"),
    energy:             document.getElementById("resultEnergy"),
    slotsUsed:          document.getElementById("slotsUsed"),
    slotsRemaining:     document.getElementById("slotsRemaining"),
    modCost:            document.getElementById("modCost"),
    totalCost:          document.getElementById("totalCost"),
    adjustedSpeed:      document.getElementById("adjustedSpeed"),
  };
  
  // === Weapons UI handles + state (paste after `const results = {...};`) ===
const weaponUI = {
  select: document.getElementById('weaponSelect'),
  level: document.getElementById('weaponLevel'),
  qty: document.getElementById('weaponQty'),
  launchers: document.getElementById('weaponLaunchers'),
  ammo: document.getElementById('weaponAmmo'),
  rowQty: document.getElementById('rowWeaponQty'),
  rowLevel: document.getElementById('rowWeaponLevel'),
  rowLaunchers: document.getElementById('rowWeaponLaunchers'),
  rowAmmo: document.getElementById('rowWeaponAmmo'),
  addBtn: document.getElementById('addWeaponBtn'),
  tableBody: document.querySelector('#weaponsTable tbody'),
  listResult: document.getElementById('weaponsListResult'),
  weaponSlotsUsed: document.getElementById('weaponSlotsUsed'),
  weaponCost: document.getElementById('weaponCost'),
  linkModeRow: document.getElementById('rowLinkMode'),
  linkGroupRow: document.getElementById('rowLinkGroup'),
  linkMode: document.getElementById('weaponLinkMode'),
  linkGroup: document.getElementById('weaponLinkGroup'),
};




// Weapon catalog (subset from The Last Parsec vehicular weapons)
// Fields: key, name, range, dmg, rof, shots, mods, cost, notes, type ('level' for Mass Driver)
const WEAPONS = [
  // Auto-Cannons
  {key:'ac_light',   name:'Auto-Cannon (Light)',   range:'50/100/200', dmg:'2d12', rof:'4',  shots:'100', mods:1, cost:50000,  notes:'AP 4, HW, Reaction Fire. Up to 20mm. Reload $200.'},
  {key:'ac_medium',  name:'Auto-Cannon (Medium)',  range:'50/100/200', dmg:'3d8',  rof:'3',  shots:'100', mods:1, cost:100000, notes:'AP 6, HW. 21–30mm. Reload $400.'},
  {key:'ac_heavy',   name:'Auto-Cannon (Heavy)',   range:'75/150/300', dmg:'4d8',  rof:'3',  shots:'100', mods:2, cost:50000,  notes:'AP 8, HW. 31–50mm. Reload $1000.'},

  // Cannons
  {key:'cannon_sm', name:'Cannon (Small)',        range:'50/100/200', dmg:'3d10', rof:'1',  shots:'50',  mods:2, cost:400000, notes:'AP 10, HW, MBT. 1–40mm.'},
  {key:'cannon_med', name:'Cannon (Medium)',       range:'75/150/300', dmg:'4d10', rof:'1',  shots:'40',  mods:3, cost:600000, notes:'AP 20, HW, MBT. 41–60mm.'},
  {key:'cannon_hev', name:'Cannon (Heavy)',        range:'100/200/400',dmg:'5d10', rof:'1',  shots:'30',  mods:4, cost:800000, notes:'AP 30, HW, LBT. 61–80mm.'},
  {key:'cannon_shv', name:'Cannon (Super Heavy)',  range:'150/300/600',dmg:'6d10', rof:'1',  shots:'20',  mods:5, cost:1000000,notes:'AP 40, HW, LBT. 81–200mm.'},

  // Flamethrower (Heavy)
  {key:'flame_heavy',name:'Flamethrower (Heavy)',  range:'See Notes',  dmg:'3d12', rof:'1',  shots:'30',  mods:2, cost:1000,   notes:'HW; Cone or MBT up to 18”. Targets least Armored area. Fuel pod $60.'},

  // Grenade Launcher
  {key:'gren_launcher', name:'Grenade Launcher',   range:'24/48/96',   dmg:'3d6',  rof:'1',  shots:'20',  mods:1, cost:700,    notes:'HW; LBT. Grenades $50 each.'},

  // Lasers (Vehicular)
  {key:'laser_light', name:'Laser (Light)',        range:'150/300/600',dmg:'2d10', rof:'1',  shots:'100', mods:1,  cost:100000,  notes:'AP 5, HW, Reaction Fire. Power core $200.'},
  {key:'laser_med',   name:'Laser (Medium)',       range:'150/300/600',dmg:'3d10', rof:'1',  shots:'100', mods:2,  cost:500000,  notes:'AP 10, HW. Power core $1000.'},
  {key:'laser_heavy', name:'Laser (Heavy)',        range:'150/300/600',dmg:'4d10', rof:'1',  shots:'100', mods:3,  cost:1000000, notes:'AP 15, HW. Power core $2000.'},
  {key:'laser_super', name:'Laser (Super Heavy)',  range:'150/300/600',dmg:'6d10', rof:'1',  shots:'100', mods:5,  cost:2000000, notes:'AP 25, HW. Power core $5000.'},
  {key:'laser_mass',  name:'Laser (Massive)',      range:'150/300/600',dmg:'8d10', rof:'1',  shots:'100', mods:7,  cost:4000000, notes:'AP 40, HW. Size 14+ only. Power core $10K.'},
  {key:'laser_mega',  name:'Laser (Mega)',         range:'150/300/600',dmg:'10d10',rof:'1/2',shots:'100', mods:10, cost:10000000,notes:'AP 50, HW. Size 16+ only. Power core $25K.'},
  
  
  // Ion Cannons
  {key:'io_light',   name:'Ion Cannon (Light)',   range:'100/200/400', dmg:'3d8+2', rof:'4',  	shots:'U', mods:3, cost:100000,  notes:'AP 5, HW, Reaction Fire.'},
  {key:'io_medium',  name:'Ion Cannon (Medium)',  range:'50/100/200', dmg:'3d8',  rof:'3', 		shots:'U', mods:4, cost:500000,  notes:'AP 10, HW.'},
  {key:'io_heavy',   name:'Ion Cannon (Heavy)',   range:'75/150/300', dmg:'4d8',  rof:'3',  	shots:'U', mods:6, cost:1000000, notes:'AP 8, HW.'},
  
 
  // Mass Driver (level-based)
  {key:'mass_driver',   
  name:'Mass Driver (Level X)',  
  range:'100/200/400',   
  dmg:'Xd12', rof:'1',   
  shots:'15',    
  mods:'level/2',   
  cost:'100000*size',   
  notes:'HW. Shots 10 lb per level; $100/level each. Range ×3 in space.', 
  type:'level'},
 
  
// --- Missiles ---
{
  key: 'missile_light',
  name: 'Missile (Light)',
  type: 'missile',                  // special handling
  range: '200/400/800',
  dmg: '6d6',
  rof: '1',
  shots: '12',                    // Shots equals total ammo count
  ammoPerMod: 12,                   // "12/1*"
  costPerAmmo: 50000 / 4,           // "$50K/4" => $12,500 per missile
  launcherModPer: 1,                // 1 Mod per launcher mount
  launcherCost: 50000,                  // set a cost if you want launchers to cost money
  notes: 'AP 8, HW, SBT.'
},


{
  key: 'missile_anti-tank',
  name: 'Missile (Heavy / AT)',
  type: 'missile',
  range: '200/400/800',
  dmg: '8d6',
  rof: '1',
  shots: '8',
  ammoPerMod: 8,                    // "8/1*"
  costPerAmmo: 100000 / 4,          // "$100K/4" => $75,000 each
  launcherModPer: 1,
  launcherCost: 50000,
  notes: 'AP 15, HW, MBT.'
},


// --- Torpedoes ---
{
  key: 'torpedo_light',
  name: 'Torpedo (Light)',
  type: 'torpedo',
  range: '300/600/1200',
  dmg: '8d12',
  rof: '1',
  shots: '8',
  ammoPerMod: 8,                    // "8/1*"
  costPerAmmo: 1000000 / 8 ,         // "$1M/8" => $125,000 each
  launcherModPer: 1,
  launcherCost: 500000,
  notes: 'AP 40, HW, LBT. Space/watercraft only. Half Range in water.'
},
{
  key: 'torpedo_heavy',
  name: 'Torpedo (Heavy)',
  type: 'torpedo',
  range: '300/600/1200',
  dmg: '10d12',
  rof: '1',
  shots: '4',
  ammoPerMod: 4,                    // "4/1*"
  costPerAmmo: 1000000 / 4 ,         // "$1M/4" => $250,000 each
  launcherModPer: 1,
  launcherCost: 500000,
  notes: 'AP 80, HW, LBT. Space/watercraft only. Half Range in water.'
},
  
 // Bombs (Flying Craft Only) — use Bomb Bays + ammo storage
{
  key:'bombs_sm',
  name:'Bombs (Small)',
  type:'bombs',
  range:'Dropped',
  dmg:'6d10',
  rof:'1',
  // ammo handling
  shots:'12',        // show user-entered ammo in the table
  ammoPerMod: 12,      // 12 bombs use 1 Mod (storage)
  // bay cost: if not set, we’ll default to using w.cost as bay cost per mount
  launcherModPer: 1,   // 1 Mod per Bomb Bay (mount)
  launcherCost: 50000,  // null => fall back to w.cost per bay
  cost: 500000 / 12,       // use your existing number as “per bay” cost (leave as-is if you prefer 0)
  notes:'AP 10, HW, LBT. Up to 250 lb. bombs.'
},
{
  key:'bombs_med',
  name:'Bombs (Medium)',
  type:'bombs',
  range:'Dropped',
  dmg:'8d10',
  rof:'1',
  shots:'8',
  ammoPerMod: 8,       // 8 bombs per 1 Mod
  launcherModPer: 1,
  launcherCost: 50000,
  cost: 1000000 / 8,
  notes:'AP 20, HW, 10" radius. 251–500 lb. bombs.'
},
{
  key:'bombs_large',
  name:'Bombs (Large)',
  type:'bombs',
  range:'Dropped',
  dmg:'10d10',
  rof:'1',
  shots:'4',
  ammoPerMod: 4,       // 4 bombs per 1 Mod
  launcherModPer: 1,
  launcherCost: 50000,
  cost: 1000000 / 4,
  notes:'AP 30, HW, 20" radius. 501–1000 lb. bombs.'
},
{
  key:'bombs_bb',
  name:'Bombs (Block Buster)',
  type:'bombs',
  range:'Dropped',
  dmg:'10d10',
  rof:'1',
  shots:'2',
  ammoPerMod: 2,       // 2 bombs per 1 Mod
  launcherModPer: 1,
  launcherCost: 50000,
  cost: 1000000 / 2,
  notes:'AP 40, HW, 30" radius. 1001–4000 lb. bombs.'
},
{
  key:'bombs_cb',
  name:'Bombs (City Buster)',
  type:'bombs',
  range:'Dropped',
  dmg:'10d10',
  rof:'1',
  shots:'1',
  ammoPerMod: 1,       // 1 bomb per 1 Mod
  launcherModPer: 1,
  launcherCost: 50000,
  cost: 1000000,
  notes:'AP 40, HW, 50" radius. 4001–8000 lb. bombs.'
},
 
  
];

// Holds weapons added to this ship
let equippedWeapons = [];


  // Mod definitions (slot cost defaults to 1 unless noted)
  const modDefinitions = {
    "AMCM":                    { label: "AMCM",                    limit: 1,   cost: s => 5000 * s },
    "Armor":                   { label: "Armor",                   limit: "Size", cost: s => 10000 * s },
    "Artificial Intelligence": { label: "Artificial Intelligence", limit: 1,   cost: s => 10000 * s },
    "Atmospheric":             { label: "Atmospheric",             limit: 1,   cost: s => 50000 * s },
    "Bomb Bay":                { label: "Bomb Bay",                limit: "U", cost: s => 50000 * s },
    "Crew Reduction":          { label: "Crew Reduction",          limit: 5,   cost: _ => 10000 },
    "Crew Space":              { label: "Crew Space",              limit: "U", cost: s => 10000 * s },
    "Deflector Screens":       { label: "Deflector Screens",       limit: 1,   cost: s => (s <= 12 ? 2 : s <= 24 ? 3 : 5) * 100000 }, // scaled to plausible cost
    "Electromagnetic Shielding": { label: "Electromagnetic Shielding", limit: 1, cost: s => 5000 * s },
    "Fixed":                   { label: "Fixed",                   limit: "U", cost: s => 0 * s },
    "FTL Drive":               { label: "FTL Drive",               limit: 1,   cost: s => 2_000_000 * s, slotFn: s => Math.ceil(s / 2) },
	"Kalian FTL": {
	  label: "Kalian FTL",
	  limit: 1,
	  cost: s => 4_000_000 * s,         // 4,000,000 × Size
	  slotFn: s => Math.ceil(s / 2)     // same slot rule as regular FTL
	},


    "Fuel Pods":               { label: "Fuel Pods",               limit: "U", cost: s => 100000 * s },
    "Garage / Hangar":         { label: "Garage / Hangar",         limit: "U", cost: s => 1000000 * s },
    "Linked":                  { label: "Linked",                  limit: "U", cost: s => 0 * s },
    "Mercantile":              { label: "Mercantile",              limit: "U", cost: s => 100000 * s },
    "Missile Launcher":        { label: "Missile Launcher",        limit: "U", cost: s => 50000 * s },
    "Passenger Pod":           { label: "Passenger Pod",           limit: "U", cost: s => 50000 * s },
    "Sensor Suite, Galactic":  { label: "Sensor Suite, Galactic",  limit: 1,   cost: s => 100000 * s },
    "Sensor Suite, Planetary": { label: "Sensor Suite, Planetary", limit: 1,   cost: s => 50000 * s },
    "Shields":                 { label: "Shields",                 limit: 1,   cost: s => 25000 * s },
    "Sloped Armor":            { label: "Sloped Armor",            limit: 1,   cost: s => 5000 * s },
    "Speed":                   { label: "Speed",                   limit: "U", cost: s => 100000 * s },
    "Speed Reduction":         { label: "Speed Reduction",         limit: 3,   cost: _ => 0 },
    "Stealth System":          { label: "Stealth System",          limit: 1,   cost: s => 50000 * s },
    "Superstructure":          { label: "Superstructure",          limit: "U", cost: s => 5000000 * s },
    "Targeting System":        { label: "Targeting System",        limit: 1,   cost: s => 10000 * s },
    "Teleporter":              { label: "Teleporter",              limit: "U", cost: _ => 5_000_000 },
    "Torpedo Tubes":           { label: "Torpedo Tubes",           limit: "U", cost: s => 500000 * s },
    "Tractor Beam":            { label: "Tractor Beam",            limit: "U", cost: s => 1000000 * s }
  };



  // Build mod UI
function buildModRows() {
  modContainer.innerHTML = "";
  Object.entries(modDefinitions).forEach(([key, def]) => {
    const row = document.createElement("div");
    row.className = "mod-row";

    const input = document.createElement("input");
    input.id = `mod-${key}`;
    input.className = "mod-control";
    input.dataset.name = key;

    if (def.limit === 1) {
      input.type = "checkbox";
    } else {
      input.type = "number";
      input.min = 0;
      input.step = 1;
      if (def.limit === "Size") {
        input.max = sizeData[parseInt(shipSizeSelect.value, 10)].size;
      } else if (typeof def.limit === "number") {
        input.max = def.limit;
      }
      input.value = 0;
    }

    const label = document.createElement("label");
    label.textContent = ":" + def.label;
    label.htmlFor = input.id;

    row.appendChild(input);
    row.appendChild(label);
    modContainer.appendChild(row);
  });
}

function isLinkableWeapon(w){
  if (!w) return false;
  // Only Auto-Cannons, Cannons, Lasers, Ion Cannons, Mass Driver
  return (
    w.key.startsWith('ac_') ||
    w.key.startsWith('cannon_') ||
    w.key.startsWith('laser_') ||
    w.key.startsWith('io_') ||
    w.key === 'mass_driver'
  );
}




function getMaxMassDriverLevel() {
  const sizeKey = parseInt(shipSizeSelect.value, 10);
  const data = sizeData[sizeKey];
  return Math.max(1, Math.floor(data.size / 2));
}


  function fmt(n) {
    return Number(n).toLocaleString();
  }

  function updateBaseStats() {
    const sizeKey = parseInt(shipSizeSelect.value);
    const data = sizeData[sizeKey];

    // Base Stats
    baseStats.sizeNumber.textContent = data.size;
    baseStats.accTS.textContent = data.accTS;
    baseStats.toughness.textContent = data.toughness;
    baseStats.crew.textContent = data.crew;
    baseStats.energy.textContent = data.energy;
    baseStats.baseCost.textContent = fmt(data.cost);
    baseStats.modSlots.textContent = data.mods;

    // Results header
    results.shipNameDisplay.textContent = shipNameInput.value || "";
    results.shipSizeDisplay.textContent = data.name;
    results.accTS.textContent = data.accTS.split("/").slice(1).join("/");
    results.climbRate.textContent = data.climb;
    results.energy.textContent = data.energy;
  }
  
  
function updateWeaponFormVisibility() {
  const w = WEAPONS.find(x => x.key === weaponUI.select.value);
  const type = w?.type || 'fixed';

  const showAmmoMounts = (type === 'missile' || type === 'torpedo' || type === 'bombs');
  const showLevel = (type === 'level');
  const showQty   = !showAmmoMounts; // fixed/level use quantity

  weaponUI.rowQty.style.display        = showQty ? '' : 'none';
  weaponUI.rowLevel.style.display      = showLevel ? '' : 'none';
  weaponUI.rowLaunchers.style.display  = showAmmoMounts ? '' : 'none';
  weaponUI.rowAmmo.style.display       = showAmmoMounts ? '' : 'none';

 // Mass Driver uses Level; set dynamic max based on Size/2
  if (showLevel) {
    const maxLvl = getMaxMassDriverLevel();
    weaponUI.level.max = String(maxLvl);
    document.querySelector('label[for="weaponLevel"]').textContent = `Level (max ${maxLvl}):`;
    const cur = Math.max(1, parseInt(weaponUI.level.value || '1', 10));
    weaponUI.level.value = String(Math.min(cur, maxLvl));
  }

  // Linked/Fixed controls appear only for linkable weapons
  const linkable = isLinkableWeapon(w);
  weaponUI.linkModeRow.style.display  = linkable ? '' : 'none';
  weaponUI.linkGroupRow.style.display = (linkable && weaponUI.linkMode.value !== 'none') ? '' : 'none';

  // defaults for ammo types
  if (showAmmoMounts) {
    if (!weaponUI.launchers.value || parseInt(weaponUI.launchers.value,10) < 1) weaponUI.launchers.value = 1;
    if (!weaponUI.ammo.value || parseInt(weaponUI.ammo.value,10) < 0) weaponUI.ammo.value = 0;
  }
}
// re-run when mode changes so group selector toggles
weaponUI.linkMode?.addEventListener('change', () => {
  const w = WEAPONS.find(x => x.key === weaponUI.select.value);
  const linkable = isLinkableWeapon(w);
  weaponUI.linkGroupRow.style.display = (linkable && weaponUI.linkMode.value !== 'none') ? '' : 'none';
});



// --- Linked/Fixed helpers: determine effective group present on this entry ---
function computeEffectiveGroup(mode, qty, selectedGroup){
  if (mode !== 'linked' && mode !== 'fixed') return 0;
  const q = Math.max(0, parseInt(qty || 0, 10));
  // If they picked 4 and have 4+ mounts, use 4; otherwise use 2 if they have 2+
  if (selectedGroup === 4 && q >= 4) return 4;
  if (q >= 2) return 2;
  return 0; // not enough mounts for any group
}



// Returns { toHit, dmg, effGroup }:
// - toHit is flat: +1 for 2-group, +2 for 4-group
// - dmg stays "as is": linked = +4 per weapon; fixed = +8 per weapon
function linkFixedBonuses(mode, group, qty){
  const eff = computeEffectiveGroup(mode, qty, group);
  if (!eff) return { toHit: 0, dmg: 0, effGroup: 0 };

  const toHit = (eff === 4 ? 2 : 1); // capped by group size only

  let dmgPerWeapon = 0;
  if (mode === 'linked') dmgPerWeapon = 4;
  else if (mode === 'fixed') dmgPerWeapon = 8;

  const dmg = dmgPerWeapon * eff; // per-weapon dmg, group count weapons

  return { toHit, dmg, effGroup: eff };
}


if (weaponUI.select) weaponUI.select.addEventListener('change', updateWeaponFormVisibility);



  function getAllModInputs() {
    return Array.from(modContainer.querySelectorAll(".mod-control"));
  }

  function getCountForInput(input) {
    if (input.type === "checkbox") return input.checked ? 1 : 0;
    const n = parseInt(input.value, 10);
    return isNaN(n) ? 0 : Math.max(0, n);
  }

function calculateMods() {
    const sizeKey = parseInt(shipSizeSelect.value);
    const data = sizeData[sizeKey];
	

    // Starting (base) values
    let slotsUsed = 0;
	let weaponSlots = 0;
	let weaponCost  = 0;
    let modCost = 0;
    let crew = data.crew;
    let toughness = data.toughness;
    let speed = parseInt(data.accTS.split("/")[1], 10); // middle number = top speed
	let astrogationBonus = 0;


    // Apply mods
    getAllModInputs().forEach(input => {
      const modName = input.dataset.name;
      const def = modDefinitions[modName];
      const count = getCountForInput(input);
      if (!count) return;

      // Cost
      const thisCost = def.cost(data.size) * count;
      modCost += thisCost;
	  
	  

      // Slots (default 1 per count unless special rule)
      const perCountSlots = typeof def.slotFn === "function" ? def.slotFn(data.size) : 1;
      slotsUsed += perCountSlots * count;

      // Specific stat effects (extend as your ruleset dictates)
      switch (modName) {
        case "Armor":
          // +2 Toughness per count in this example
          toughness += 2 * count;
          break;
        case "Speed":
          // +50 to the middle speed term per count
          speed += 50 * count;
          break;
        case "Crew Reduction":
          // Each rank reduces required crew by 20% (stacking multiplicatively)
          for (let i = 0; i < count; i++) {
            crew *= 0.8;
          }
          break;
        case "FTL Drive":
          // No direct stat effect here other than slot usage handled above
          break;
		  
		case "Kalian FTL":
		// same slots handled via slotFn; adds +2 to Astrogation rolls
		astrogationBonus += 2;
		break;

        default:
          // Other mods not implemented with stat effects yet
          break;
      }
    });


// Include weapon slots and cost
equippedWeapons.forEach(ew => {
  const w = WEAPONS.find(x => x.key === ew.key);
  if (!w) return;

  const isAmmoType = (w.type === 'missile' || w.type === 'torpedo' || w.type === 'bombs');

  const mods     = weaponModsFor(w, ew.level, ew.qty, ew.ammo, ew.qty, ew.mode, ew.group);
  const baseCost = weaponCostFor(w, ew.level, data.size, ew.qty, ew.ammo, ew.qty);
  const entryCost = isAmmoType ? baseCost : baseCost * ew.qty;

  weaponSlots += mods;
  weaponCost  += entryCost;
});


slotsUsed += weaponSlots;
modCost   += weaponCost;


const slotsRemaining = Math.max(0, data.mods - slotsUsed);



    // Update DOM
    results.slotsUsed.textContent = slotsUsed;
    results.slotsRemaining.textContent = slotsRemaining;
    results.modCost.textContent = fmt(modCost);
	if (weaponUI) {
	  weaponUI.weaponSlotsUsed.textContent = weaponSlots;
	  weaponUI.weaponCost.textContent = fmt(weaponCost);
	}


    results.totalCost.textContent = fmt(data.cost + modCost);
    results.adjustedCrew.textContent = Math.ceil(crew);
    results.adjustedToughness.textContent = toughness;
    results.adjustedSpeed.textContent = speed;
	const astroEl = document.getElementById("astrogationMod");
	if (astroEl) astroEl.textContent = (astrogationBonus >= 0 ? "+" : "") + astrogationBonus;

	
	
  }

  // Event wiring
  shipSizeSelect.addEventListener("change", () => {
    buildModRows();      // size affects some limits and slotFn
    updateBaseStats();
	
	// If the Mass Driver row is visible, keep the level within new cap
	const w = WEAPONS.find(x => x.key === weaponUI.select.value);
	if (w && w.type === 'level') {
	const maxLvl = getMaxMassDriverLevel();
	weaponUI.level.max = String(maxLvl);
	const cur = Math.max(1, parseInt(weaponUI.level.value || '1', 10));
	weaponUI.level.value = String(Math.min(cur, maxLvl));
}

	
	
	
    calculateMods();
  });

  shipNameInput.addEventListener("input", () => {
    results.shipNameDisplay.textContent = shipNameInput.value || "";
  });

  // Delegate mod input changes
  modContainer.addEventListener("input", calculateMods);

  // Initial render
  buildModRows();
  updateBaseStats();
  calculateMods();
  // === Weapons helpers ===
function populateWeaponSelect(){
  if(!weaponUI.select) return;
  weaponUI.select.innerHTML = '';
  WEAPONS.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.key;
    opt.textContent = w.name;
    weaponUI.select.appendChild(opt);
  });
}





function weaponCostFor(w, level, shipSize, qty, ammo, launchers){
  if (w.type === 'level') {
    return 100000 * shipSize; // Mass Driver, per mount
  }
  if (w.type === 'missile' || w.type === 'torpedo' || w.type === 'bombs') {
    const bays = Math.max(1, parseInt(launchers||1,10)); // launchers or bomb bays
    const ammoCount = Math.max(0, parseInt(ammo||0,10));
    // For bombs: if launcherCost is null, use w.cost as per-bay cost (keeps your current totals)
    const perBayCost = (w.launcherCost == null) ? (w.cost || 0) : (w.launcherCost || 0);
    const launcherCost = bays * perBayCost;
    // missiles/torpedoes may have per-ammo costs; bombs don’t by default
    const ammoCost = (w.costPerAmmo ? ammoCount * w.costPerAmmo : 0);
    return launcherCost + ammoCost;
  }
  // Fixed mounts
  return w.cost || 0;
}

function weaponModsFor(w, level, qty, ammo, launchers, mode, group){
  let baseMods = 0;

  if (w.type === 'level') {
    const lvl = Math.max(1, parseInt(level||1,10));
    baseMods = Math.ceil(lvl/2) * Math.max(1, parseInt(qty||1,10));
  } else if (w.type === 'missile' || w.type === 'torpedo' || w.type === 'bombs') {
    const bays = Math.max(1, parseInt(launchers||1,10));
    const a = Math.max(0, parseInt(ammo||0,10));
    const per = Math.max(1, parseInt(w.ammoPerMod||1,10));
    const ammoMods = Math.ceil(a / per);
    const bayMods = (w.launcherModPer || 1) * bays;
    baseMods = ammoMods + bayMods;
  } else {
    baseMods = (w.mods || 0) * Math.max(1, parseInt(qty||1,10));
  }

  // Halve mods for Linked/Fixed only on linkable weapons
  if (isLinkableWeapon(w) && (mode === 'linked' || mode === 'fixed')) {
    baseMods = Math.ceil(baseMods / 2);  // round up to be conservative
  }

  return baseMods;
}




function addWeapon(){
  const key = weaponUI.select.value;
  const w = WEAPONS.find(x => x.key === key);
  if (!w) return;

  // collect linking/fixed inputs if applicable
  const linkable = isLinkableWeapon(w);
  const mode  = linkable ? weaponUI.linkMode.value : 'none';
  const group = linkable ? parseInt(weaponUI.linkGroup.value || '2', 10) : 2;

  if (w.type === 'missile' || w.type === 'torpedo' || w.type === 'bombs') {
    const launchers = Math.max(1, parseInt(weaponUI.launchers.value || '1', 10));
    const ammo = Math.max(0, parseInt(weaponUI.ammo.value || '0', 10));
    equippedWeapons.push({ key, qty: launchers, ammo, level: 1, mode: 'none', group: 2 });
  } else if (w.type === 'level') {
    const qty = Math.max(1, parseInt(weaponUI.qty.value || '1', 10));
    const maxLvl = getMaxMassDriverLevel();
    const level = Math.min(maxLvl, Math.max(1, parseInt(weaponUI.level.value || '1', 10)));
    equippedWeapons.push({ key, qty, level, ammo: 0, mode, group });
  } else {
    const qty = Math.max(1, parseInt(weaponUI.qty.value || '1', 10));
    equippedWeapons.push({ key, qty, level: 1, ammo: 0, mode, group });
  }

  renderWeapons();
  calculateMods();
}




function removeWeapon(idx){
  equippedWeapons.splice(idx,1);
  renderWeapons();
  calculateMods();
}

function renderWeapons(){
  if (!weaponUI.tableBody) return;
  weaponUI.tableBody.innerHTML = '';
  const sizeKey = parseInt(shipSizeSelect.value, 10);
  const data = sizeData[sizeKey];
  let totalSlots = 0, totalCost = 0;

  equippedWeapons.forEach((ew, i) => {
    const w = WEAPONS.find(x => x.key === ew.key);
    if (!w) return;


	const mods     = weaponModsFor(w, ew.level, ew.qty, ew.ammo, ew.qty, ew.mode, ew.group);
	const baseCost = weaponCostFor(w, ew.level, data.size, ew.qty, ew.ammo, ew.qty);
	const isAmmoType = (w.type === 'missile' || w.type === 'torpedo' || w.type === 'bombs');
	const entryCost = isAmmoType ? baseCost : baseCost * ew.qty;

    totalSlots += mods;
    totalCost  += entryCost;

    const tr = document.createElement('tr');
	
	const prettyName = w.name.replace('Level X', 'Level ' + (w.type === 'level' ? ew.level : ''));
	const dmgDisp    = w.dmg.replace('X', ew.level || '');
	const shotsDisp  = (w.shots === 'ammo') ? String(ew.ammo) : w.shots;
	
	const bonus      = linkFixedBonuses(ew.mode, ew.group, ew.qty);
	const modeLabel  = (ew.mode === 'linked' ? 'Linked' : (ew.mode === 'fixed' ? 'Fixed' : '—'));
	const groupLabel = (bonus.effGroup ? String(bonus.effGroup) : '—');
	
	


    // Columns: name, range, damage, rof, shots, mods, cost, notes, qty(launchers), ammo
	// build row
	const cols = [
	  prettyName, w.range, dmgDisp, w.rof, shotsDisp,
	  String(mods),
	  '$' + Number(entryCost).toLocaleString(),
	  w.notes + (bonus.effGroup
		? ` ( ${modeLabel} x${groupLabel}: +${bonus.toHit} to hit, +${bonus.dmg} dmg; mods halved )`
		: ''),
	  String(ew.qty),
	  isAmmoType ? String(ew.ammo) : '',
	  modeLabel,
	  groupLabel
	]
	
	
    cols.forEach(c => { const td = document.createElement('td'); td.textContent = c; tr.appendChild(td); });
    const tdDel = document.createElement('td');
    const btn = document.createElement('button'); btn.textContent = 'Remove'; btn.onclick = () => removeWeapon(i);
    tdDel.appendChild(btn); tr.appendChild(tdDel);
    weaponUI.tableBody.appendChild(tr);
  });

  weaponUI.weaponSlotsUsed.textContent = totalSlots;
  weaponUI.weaponCost.textContent = Number(totalCost).toLocaleString();


	// Update stat block list
	if (weaponUI.listResult){
	  weaponUI.listResult.innerHTML = '';
	  equippedWeapons.forEach(ew => {
		const w = WEAPONS.find(x => x.key === ew.key); if (!w) return;
		const isAmmoType = (w.type === 'missile' || w.type === 'torpedo' || w.type === 'bombs');
		const prettyName = w.name.replace('Level X', 'Level ' + (w.type === 'level' ? ew.level : ''));
		const dmgDisp    = w.dmg.replace('X', ew.level || '');
		const shotsDisp  = isAmmoType ? String(ew.ammo) : w.shots;

		let line;
		if (isAmmoType) {
		  if (w.type === 'bombs') {
			line = `${prettyName} — ${w.range}, ${dmgDisp}, RoF ${w.rof}, Shots ${shotsDisp} (ammo), Bays ${ew.qty}`;
		  } else {
			line = `${prettyName} — ${w.range}, ${dmgDisp}, RoF ${w.rof}, Shots ${shotsDisp} (ammo), Launchers ${ew.qty}`;
		  }
		} else if (w.type === 'level') {
		  line = `${ew.qty}× ${prettyName} — ${w.range}, ${dmgDisp}, RoF ${w.rof}, Shots ${w.shots}`;
		} else {
		  line = `${ew.qty}× ${prettyName} — ${w.range}, ${dmgDisp}, RoF ${w.rof}, Shots ${w.shots}`;
		}

		// ⬇️ NEW: append link/fixed bonuses + notes
		const bonus = linkFixedBonuses(ew.mode, ew.group, ew.qty);
		const modeLabel  = (ew.mode === 'linked' ? 'Linked' : (ew.mode === 'fixed' ? 'Fixed' : null));
		const groupLabel = (ew.mode === 'none' ? null : (ew.group === 4 ? 4 : 2));
		const parts = [];

		if (w.notes && w.notes.trim()) {
		  parts.push(w.notes.trim());
		}
		if (modeLabel) {
		  parts.push(`${modeLabel} x${groupLabel}: +${bonus.toHit} to hit, +${bonus.dmg} dmg; mods halved`);
		}

		const li = document.createElement('li');
		if (parts.length) {
		  // use innerHTML so the note can be styled
		  li.innerHTML = `${line} <span class="weapon-note">— ${parts.join(' — ')}</span>`;
		} else {
		  li.textContent = line;
		}
		weaponUI.listResult.appendChild(li);
	  });
	}


}



// Wire up the weapons UI
if(weaponUI.addBtn){ weaponUI.addBtn.addEventListener('click', addWeapon); }
populateWeaponSelect();
updateWeaponFormVisibility();  // <-- add this
renderWeapons();


// ======== SAVE/LOAD/SHARE ========

// 1) capture the whole ship state
function captureState() {
  const size = parseInt(shipSizeSelect.value, 10);
  const name = shipNameInput.value || '';

  // collect mods
  const mods = {};
  getAllModInputs().forEach(input => {
    const key = input.dataset.name;
    if (input.type === 'checkbox') {
      mods[key] = input.checked ? 1 : 0;
    } else {
      mods[key] = parseInt(input.value || '0', 10) || 0;
    }
  });

  // weapons (already structured)
  const weapons = equippedWeapons.map(w => ({ ...w }));

  return {
    _v: 1,          // version tag for future migrations
    size, name, mods, weapons
  };
}

// 2) apply a captured state back to the UI
function applyState(state) {
  if (!state || typeof state !== 'object') return;

  // size first (triggers rebuild of mod rows)
  if (typeof state.size === 'number') {
    shipSizeSelect.value = String(state.size);
  }
  buildModRows();      // rows depend on size
  updateBaseStats();

  // name
  if (typeof state.name === 'string') {
    shipNameInput.value = state.name;
    results.shipNameDisplay.textContent = state.name;
  }

  // mods
  if (state.mods && typeof state.mods === 'object') {
    getAllModInputs().forEach(input => {
      const key = input.dataset.name;
      const v = state.mods[key];
      if (input.type === 'checkbox') {
        input.checked = !!v;
      } else {
        input.value = (typeof v === 'number') ? v : 0;
      }
    });
  }

  // weapons
  equippedWeapons = Array.isArray(state.weapons) ? state.weapons.map(w => ({...w})) : [];

  // re-render
  renderWeapons();
  calculateMods();
}

// 3) localStorage save/load
const LS_KEY = 'sw_starship_builder:last';

function saveLocal() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(captureState()));
    alert('Saved to browser storage.');
  } catch (e) {
    alert('Save failed: ' + e.message);
  }
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return alert('No local save found.');
    const state = JSON.parse(raw);
    applyState(state);
    alert('Loaded from browser storage.');
  } catch (e) {
    alert('Load failed: ' + e.message);
  }
}

// 4) download / upload JSON
function downloadJson() {
  const data = JSON.stringify(captureState(), null, 2);
  const blob = new Blob([data], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = (shipNameInput.value || 'starship') + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function importJsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const state = JSON.parse(reader.result);
      applyState(state);
      alert('Imported ship from JSON.');
    } catch (e) {
      alert('Invalid file: ' + e.message);
    }
  };
  reader.readAsText(file);
}

// 5) shareable URL (hash) - base64 of JSON
function encodeShare(state) {
  const s = JSON.stringify(state);
  // unicode-safe base64
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return location.origin + location.pathname + '#ship=' + b64;
}

function decodeShareHash() {
  const h = location.hash || '';
  const tag = '#ship=';
  if (!h.startsWith(tag)) return null;
  try {
    const b64 = h.slice(tag.length);
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function copyShareUrl() {
  const url = encodeShare(captureState());
  navigator.clipboard.writeText(url).then(
    () => alert('Share URL copied to clipboard.'),
    () => alert('Could not copy URL (clipboard blocked).')
  );
}


// Hook up Save/Load buttons
const btnSaveLocal = document.getElementById('btnSaveLocal');
const btnLoadLocal = document.getElementById('btnLoadLocal');
const btnDownload  = document.getElementById('btnDownload');
const btnShareUrl  = document.getElementById('btnShareUrl');
const fileImport   = document.getElementById('fileImport');

btnSaveLocal?.addEventListener('click', saveLocal);
btnLoadLocal?.addEventListener('click', loadLocal);
btnDownload?.addEventListener('click', downloadJson);
btnShareUrl?.addEventListener('click', copyShareUrl);
fileImport?.addEventListener('change', e => {
  const f = e.target.files?.[0];
  if (f) importJsonFile(f);
  e.target.value = ''; // allow re-selecting same file later
});

// Auto-load from URL if present
const shared = decodeShareHash();
if (shared) applyState(shared);


});
