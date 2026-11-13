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

All menus in CraftingBlueprints are protected by built-in inventory security features:

* **Slot Locking**: Non-input menu slots are locked. Shift-clicking, dragging, hotkey number swapping, and dropping items out of the interface are intercepted and cancelled immediately.
* **Persistent Tagging**: All visual icons placed inside menus carry an internal security tag.
* **Automatic Purge**: If a player attempts to use client-side glitches, disconnect macros, or inventory desync to pull items out of a menu, the plugin instantly deletes the item the moment it enters their cursor, hotbar, or inventory.
* **Economy Protection**: Menu display items and decorative buttons can never leak into survival gameplay or player inventories.
