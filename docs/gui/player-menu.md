# Player Progression Menu (/cb menu)

The personal player menu (`/cb menu`) gives players an overview of their unlocked blueprints, active time limits, remaining craft uses, and personal crafting statistics.

---

## Opening the Menu

Any player with the `craftingblueprints.menu` permission (granted by default) can open their personal dashboard using:

```text
/cb menu
```

---

## Menu Layout & Components

The interface displays:

1. **Player Skull Profile**:
   * Shows total blueprints unlocked.
   * Percentage of server blueprints discovered.
   * Personal crafting statistics.

2. **Active Timers & Expirations**:
   * Displays all recipes that have active time countdowns or craft limits.
   * Shows exact time remaining (e.g. `Expires in 3d 14h`).
   * Shows remaining craft counts (e.g. `2/5 uses remaining`).

3. **Catalog Shortcut**:
   * One-click button to jump directly to the server's public blueprint catalog (`/cb item list`).

4. **Return Button**:
   * If navigated from a previous menu, clicking the return button or running `/cb return` navigates back smoothly without losing context.

---

## Anti-Steal Item Protection

All GUI menus in CraftingBlueprints are protected by an internal anti-steal engine. Players cannot drag, shift-click, drop, or duplicate items out of the interface. Any stray GUI item detected on cursor, hotbar, or death is instantly cancelled and purged.
