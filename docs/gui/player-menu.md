# Player Progression Dashboard (/cb menu)

The personal player progression dashboard (`/cb menu`) provides players with an interactive graphical interface to track their unlocked blueprints, monitor active countdown timers, check remaining craft uses, and navigate the server's crafting encyclopedia.

---

## Opening the Menu

Any player with the `craftingblueprints.menu` permission (granted by default to all players) can open their dashboard at any time:

```text
/cb menu
```

---

## Interface Layout & Key Components

The player menu features an intuitive layout designed with custom Kyori Adventure component titles:

```
┌─────────────────────────────────────────────────────────────┐
│                   [CraftingBlueprints]                      │
├─────────────────────────────────────────────────────────────┤
│  [Player Head]      [Active Timers]     [Expiring Uses]     │
│   Progression        3 Licensings        2 Limited Crafts   │
│                                                             │
│                                                             │
│  [Catalog Button]                      [Close / Return]     │
│   Browse All (/cb item list)            Back to Previous    │
└─────────────────────────────────────────────────────────────┘
```

### 1. Player Profile Head
* **Display Name**: The player's custom textured skin skull.
* **Progression Lore**:
  * Total blueprints unlocked on this server.
  * Server completion percentage (e.g. `14 / 42 Blueprints Unlocked (33.3%)`).
  * Lifetime crafts completed using blueprints.

### 2. Active Expirations & Timer Monitoring
* Displays all blueprints that have active temporal countdowns (e.g., 24-hour licenses, weekly guild permits).
* Shows exact real-time remaining duration (e.g. `Expires in: 3d 14h 22m`).
* Displays blueprints with finite craft counters (e.g. `Remaining Forges: 2 / 5 crafts`).

### 3. One-Click Catalog Shortcut
* Clicking the centered book icon jumps directly to the server's public blueprint catalog (`/cb item list`), allowing players to browse locked schematics or purchase missing recipes.

### 4. Navigation Stack & Return Button (`/cb return`)
* If opened from another interface, clicking the return button smoothly re-opens the parent menu without losing context or page position.

---

## Anti-Steal Item Protection & Inventory Security

All menus in CraftingBlueprints inherit from `BaseMenu.kt` and are protected by an automated, low-level anti-steal security engine:

* **Slot Locking**: Non-input menu slots are locked. Shift-clicking, dragging, hotkey swapping, and dropping items out of the interface are intercepted and cancelled immediately.
* **PDC Menu Tagging**: All visual icons placed inside menus are tagged with a Persistent Data Container marker (`ItemPDT(ItemManager.MENU_TYPE)`).
* **Purge Engine**: If a player attempts to exploit client-side glitches, disconnect macros, or death drops to extract GUI items, the `ItemInteractListener` intercepts the item on cursor, hotbar, pickup, block placement, or death, and **instantly purges** the phantom item.
* Zero menu items can ever leak into the server's survival economy.
