# Tutorial: Gating Netherite Gear Behind Bastion Chests (SMP)

In standard vanilla Minecraft, players often rush Netherite gear within the first 48 hours of an SMP season, trivializing end-game PvE and survival combat. 

This tutorial walks you through setting up a complete end-game progression loop: **locking all Netherite equipment** so that crafting or upgrading it at a Smithing Table strictly requires finding ancient blueprint scrolls hidden within Nether Bastion Remnant chests.

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     Vanilla Bastion Chest       │       │    Player Inventory / Hand      │
│  (minecraft:chests/bastion_*)   │       │                                 │
│                                 │       │  [📜 Netherite Plate Blueprint] │
│  - 45% chance to roll pool      │ ────► │                                 │
│  - Weighted CDF entry selection │       │  Right-Click to study scroll:   │
│  - Replaces low-value trash     │       │  "Knowledge permanently added"  │
└─────────────────────────────────┘       └────────────────┬────────────────┘
                                                           │
                                                           ▼
                                          ┌─────────────────────────────────┐
                                          │     1.20+ Smithing Table        │
                                          │                                 │
                                          │  - Diamond Gear + Ingot         │
                                          │  - Check: Is blueprint known?   │
                                          │    ✔ ALLOW: Upgrades gear       │
                                          │    ❌ DENY: Displays locked GUI  │
                                          └─────────────────────────────────┘
```

---

## Prerequisites

Before starting, ensure you have:
1. CraftingBlueprints installed and running on Paper, Purpur, or compatible fork (1.18.2 – 1.21.x).
2. Administrative permissions (`craftingblueprints.admin.*` or OP).
3. Access to edit server files under `plugins/CraftingBlueprints/`.

---

## Step 1: Restrict Netherite Crafting & Upgrades

To prevent players from forging Netherite gear without blueprints, add the regex pattern `netherite_.*` to the restriction engine.

Open `plugins/CraftingBlueprints/config.yml` (or create a modular file `plugins/CraftingBlueprints/configs/smp_netherite.yml`) and configure:

```yaml
# ============================================================
#                  RECIPE RESTRICTIONS
# ============================================================
restrictions:
  # Match all items starting with "netherite_" (helmets, chestplates, swords, etc.)
  # Crafting, smelting, and smithing table upgrades are intercepted automatically.
  restricted-items:
    - "netherite_.*"
```

> [!NOTE]
> The pattern `netherite_.*` uses regular expressions to match any item key beginning with `netherite_`, including `netherite_helmet`, `netherite_chestplate`, `netherite_leggings`, `netherite_boots`, `netherite_sword`, `netherite_pickaxe`, `netherite_axe`, `netherite_shovel`, and `netherite_hoe`. Vanilla items not matching this pattern (such as Iron and Diamond) remain completely unrestricted.

---

## Step 2: Author the Netherite Blueprints

Now create the declarative blueprint definitions that unlock these recipes.

Create a new file at `plugins/CraftingBlueprints/blueprints/smp_netherite.yml`:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
default:
  permanent: true
  item:
    material: NETHERITE_UPGRADE_SMITHING_TEMPLATE
    glowing: true
  extra:
    tier: "MYTHIC"
    tradeable: true

singles:
  # ==========================================
  # NETHERITE ARMOR SUITE
  # ==========================================
  smp_netherite_helmet:
    blueprint: "minecraft:netherite_helmet"
    name: "<gradient:#434343:#1c1c1c><bold>Ancient Helm Blueprint</bold></gradient>"
    lore:
      - "<gray>Ancient blueprint recovered from the Nether depths.</gray>"
      - "<gray>Unlocks: <white>Netherite Helmet</white></gray>"
      - ""
      - "<gold>Permanent Knowledge</gold>"
      - "<dark_gray>Right-click to permanently study.</dark_gray>"

  smp_netherite_chestplate:
    blueprint: "minecraft:netherite_chestplate"
    name: "<gradient:#434343:#1c1c1c><bold>Ancient Cuirass Blueprint</bold></gradient>"
    lore:
      - "<gray>Ancient blueprint recovered from the Nether depths.</gray>"
      - "<gray>Unlocks: <white>Netherite Chestplate</white></gray>"
      - ""
      - "<gold>Permanent Knowledge</gold>"
      - "<dark_gray>Right-click to permanently study.</dark_gray>"

  smp_netherite_leggings:
    blueprint: "minecraft:netherite_leggings"
    name: "<gradient:#434343:#1c1c1c><bold>Ancient Greaves Blueprint</bold></gradient>"
    lore:
      - "<gray>Ancient blueprint recovered from the Nether depths.</gray>"
      - "<gray>Unlocks: <white>Netherite Leggings</white></gray>"
      - ""
      - "<gold>Permanent Knowledge</gold>"
      - "<dark_gray>Right-click to permanently study.</dark_gray>"

  smp_netherite_boots:
    blueprint: "minecraft:netherite_boots"
    name: "<gradient:#434343:#1c1c1c><bold>Ancient Sollerets Blueprint</bold></gradient>"
    lore:
      - "<gray>Ancient blueprint recovered from the Nether depths.</gray>"
      - "<gray>Unlocks: <white>Netherite Boots</white></gray>"
      - ""
      - "<gold>Permanent Knowledge</gold>"
      - "<dark_gray>Right-click to permanently study.</dark_gray>"

  # ==========================================
  # NETHERITE WEAPONS & TOOLS
  # ==========================================
  smp_netherite_sword:
    blueprint: "minecraft:netherite_sword"
    name: "<gradient:#434343:#1c1c1c><bold>Ancient Blade Blueprint</bold></gradient>"
    lore:
      - "<gray>Ancient blueprint recovered from the Nether depths.</gray>"
      - "<gray>Unlocks: <white>Netherite Sword</white></gray>"
      - ""
      - "<gold>Permanent Knowledge</gold>"
      - "<dark_gray>Right-click to permanently study.</dark_gray>"

  smp_netherite_pickaxe:
    blueprint: "minecraft:netherite_pickaxe"
    name: "<gradient:#434343:#1c1c1c><bold>Ancient Mattock Blueprint</bold></gradient>"
    lore:
      - "<gray>Ancient blueprint recovered from the Nether depths.</gray>"
      - "<gray>Unlocks: <white>Netherite Pickaxe</white></gray>"
      - ""
      - "<gold>Permanent Knowledge</gold>"
      - "<dark_gray>Right-click to permanently study.</dark_gray>"
```

### Anatomy Breakdown:
- **`default:` Block**: Sets `permanent: true`, physical item material (`NETHERITE_UPGRADE_SMITHING_TEMPLATE`), and glowing enchantment glint across all blueprints in this file.
- **`singles:`**: Defines distinct blueprints for each piece of equipment.
- **`extra:`**: Tags each scroll with `tier: "MYTHIC"` in the item's PersistentDataContainer for trade or auction engines.

---

## Step 3: Configure Bastion Chest Loot Injection

To distribute these blueprints naturally in the world, configure the loot injection engine to populate Nether Bastion chests.

Open `plugins/CraftingBlueprints/loot.yml` and add the pool and table mapping:

```yaml
loot:
  enabled: true

  settings:
    max-blueprints-per-container: 2
    replace-trash-if-full: true
    trash-materials:
      - ROTTEN_FLESH
      - BONE
      - STRING
      - GRAVEL
      - ARROW
    luck-affects-chance: true
    luck-modifier: 0.05
    rare-find-sound: true
    rare-find-sound-effect: "UI_TOAST_CHALLENGE_COMPLETE"

  pools:
    nether_bastion_blueprints:
      rolls: { min: 1, max: 2 }
      chance: 0.45   # 45% chance to roll this pool upon opening a bastion chest
      entries:
        - blueprint: "smp_netherite_chestplate"
          weight: 10
        - blueprint: "smp_netherite_sword"
          weight: 15
        - blueprint: "smp_netherite_pickaxe"
          weight: 20
        - blueprint: "smp_netherite_leggings"
          weight: 20
        - blueprint: "smp_netherite_helmet"
          weight: 25
        - blueprint: "smp_netherite_boots"
          weight: 25

  tables:
    # Match all Nether Bastion chest types (treasure, bridge, hoglin_stable, other)
    "minecraft:chests/bastion_*":
      - pool: "nether_bastion_blueprints"
```

### Loot Injection Mechanics:
- **`chance: 0.45`**: 45% of opened Bastion chests will roll for blueprints.
- **`rolls: { min: 1, max: 2 }`**: When successful, the chest yields 1 or 2 blueprint items.
- **Cumulative Distribution Function (CDF)**: Higher weights (`25` for boots vs `10` for chestplate) make the chestplate the rarest and most coveted prize.
- **`replace-trash-if-full: true`**: If vanilla loot fills all 27 slots of a chest, the engine safely replaces low-value items (e.g. bones, arrows, gravel) with the blueprint so the reward is never lost.

---

## Step 4: Verification & In-Game Testing

Reload the plugin and test the complete progression loop in-game.

### 1. Validate Configurations
Execute the syntax validator from the console or in-game:
```bash
/cb validate
```
Ensure `smp_netherite.yml` passes with zero errors.

### 2. Reload Plugin & Loot Tables
```bash
/cb reload
/cb loot reload
```

### 3. Simulate Loot Table Rolls
Test the Bastion chest drop rate across 100 simulated chests without having to explore the Nether:
```bash
/cb loot test minecraft:chests/bastion_treasure 100
```
Review the console or chat output. You should observe roughly 45 chests containing blueprints, with boots/helmets appearing more frequently than chestplates according to configured weights.

### 4. Test Locked Smithing Interception
1. Switch to a non-OP survival player account (or ensure `op-bypass: false`).
2. Open a Smithing Table with a Diamond Chestplate, a Netherite Ingot, and an Upgrade Template.
3. Observe that the result slot is blocked with a locked preview indicator.
4. Execute `/cb cani netherite_chestplate`. The chat reports that you lack the required blueprint.

### 5. Test Scroll Redemption & Unlocking
1. Grant yourself the blueprint scroll:
   ```bash
   /cb give Steve smp_netherite_chestplate
   ```
2. Hold the scroll in your main hand and right-click.
3. You will hear the level-up chime and receive the message:
   ```
   You have unlocked the blueprint: Ancient Cuirass Blueprint!
   ```
4. Return to the Smithing Table: the recipe is now completely unlocked! Upgrade the chestplate normally.
