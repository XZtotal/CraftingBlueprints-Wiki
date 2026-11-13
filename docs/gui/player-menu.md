# Player Unlocked Blueprints Menu (/cb menu)

The personal player menu (`/cb menu`) provides players with an interactive graphical interface to view all crafting, enchantment, and potion blueprints they have unlocked on the server.

---

## Opening the Menu

Any player with the `craftingblueprints.menu` permission (granted by default to all players) can open their unlocked blueprints list at any time:

```text
/cb menu
```

Staff and administrators can inspect another player's unlocked blueprints by specifying their username (requires `craftingblueprints.menu.others`):

```text
/cb menu <player_name>
```

---

## Interface Layout & Navigation

```text
┌─────────────────────────────────────────────────────────────┐
│              Unlocked Blueprints (Page 1 / 2)               │
├─────────────────────────────────────────────────────────────┤
│  [Close]  [ ]  [◄ Prev]  [ ]  [ ]  [ ]  [Next ►]  [ ] [Filter]│
├─────────────────────────────────────────────────────────────┤
│  [Sword]   [Pickaxe]   [Armor]    [Potion]   [Enchant] ...  │
│  Unlocked  Unlocked    Unlocked   3/5 Uses   24h Left       │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Control Bar (Top Row)
* **Slot 0: Close / Back (`Barrier`)**: Closes the interface, or returns to the previous menu in the navigation stack if opened from another menu (`/cb return`).
* **Slot 2: Previous Page (`Arrow`)**: Navigates to the preceding page of unlocked recipes.
* **Slot 6: Next Page (`Arrow`)**: Advances to the subsequent page of unlocked recipes.
* **Slot 8: Sorter & Filter (`Hopper`)**: Cycles between 3 display sort orders:
    * **By Category & Type**: Groups recipes logically by item family and crafting station.
    * **Alphabetical (A -> Z)**: Orders blueprints alphabetically by display name.
    * **Alphabetical (Z -> A)**: Orders blueprints in reverse alphabetical order.

### 2. Unlocked Recipes Grid (Slots 9 – 53)
The lower 5 rows provide 45 slots per page displaying all recipes the player has unlocked:

* **Crafting Recipes**: Unlocked crafting table and furnace items.
* **Smithing Upgrades**: Unlocked Netherite and equipment modifications.
* **Alchemy & Potions**: Unlocked brewing stand formulas.
* **Enchantments**: Unlocked enchanting table upgrades.

Each displayed icon presents the recipe's active durability parameters, showing remaining craft counts (for finite blueprints) or real-time expiration countdowns (for timed licenses).

---

## Anti-Steal Item Protection & Inventory Security

All menus in CraftingBlueprints are protected by built-in inventory security features:

* **Slot Locking**: Non-input menu slots are locked. Shift-clicking, dragging, hotkey number swapping, and dropping items out of the interface are intercepted and cancelled immediately.
* **Persistent Tagging**: All visual icons placed inside menus carry an internal security tag (`MENU_TYPE`).
* **Automatic Purge**: If a player attempts to use client-side glitches, disconnect macros, or inventory desync to pull items out of a menu, the plugin instantly deletes the item the moment it enters their cursor, hotbar, or inventory.
* **Economy Protection**: Menu display items and decorative buttons can never leak into survival gameplay or player inventories.
