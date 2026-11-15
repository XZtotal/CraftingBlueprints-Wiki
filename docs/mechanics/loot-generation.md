# World Loot Generation & Chest Injection (`loot.yml`)

CraftingBlueprints features an event-driven, zero-lag **Loot Generation Engine** that populates natural blueprint schematics into world structure containers, dungeon chests, Trial Chamber vaults (1.21+ / 26.x+), archaeology brush sites (1.20+), fishing treasures, and boss entity drops.

---

## 1. Core Architectural Highlights

* **Zero-Lag Event Interception**: Listens to Paper's native `LootGenerateEvent`. Chests are populated lazily upon first player access—no heavy chunk scanners or background chunk loading.
* **Reusable Probability Pools**: Declare named loot pools with weighted entries, min/max roll bounds, and chance multipliers.
* **Vanilla Table Wildcards & Regex**: Map pools to Minecraft loot tables using exact keys, wildcards (`minecraft:chests/bastion_*`), or regular expressions.
* **Overflow & Trash Replacement (`replace-trash-if-full`)**: If a dungeon chest generates completely full (all 27 slots occupied), the engine replaces configured low-value junk items (e.g. rotten flesh, bones, gravel) so rare blueprints are never lost.
* **Player Luck Scaling**: Supports player Luck attribute scaling (potions, enchantments):

    $$
    \text{Effective Chance} = \text{Base Chance} \times (1.0 + (\text{Player Luck} \times \text{luck-modifier}))
    $$

* **Unbound Ownership**: Blueprints spawned in world loot containers are generated with unassigned ownership (`uuid: null`), allowing discovering players to claim them freely.

---

## 2. Configuration Structure (`loot.yml`)

The loot system is configured in `plugins/CraftingBlueprints/loot.yml`:

```yaml
# ==============================================================================
# CraftingBlueprints - Chest & World Loot Generation Configuration
# ==============================================================================

loot:
  # Master toggle for world loot generation
  enabled: true

  settings:
    # Maximum number of blueprints allowed to spawn in a single container
    max-blueprints-per-container: 2

    # If true and all slots are full, replaces a low-value trash item
    replace-trash-if-full: true
    trash-materials:
      - ROTTEN_FLESH
      - BONE
      - STRING
      - GRAVEL
      - GUNPOWDER

    # Player luck attribute scaling (luck potion, luck effects)
    luck-affects-chance: true
    luck-modifier: 0.05

    # Sound and toast feedback upon discovering a blueprint in a container
    rare-find-sound: true
    rare-find-sound-effect: "UI_TOAST_CHALLENGE_COMPLETE"

  # ----------------------------------------------------------------------------
  # REUSABLE LOOT POOLS
  # ----------------------------------------------------------------------------
  pools:
    tier1_basic:
      rolls:
        min: 1
        max: 1
      chance: 0.25
      entries:
        - blueprint: "iron_sword"
          weight: 40
        - blueprint: "shield"
          weight: 35
        - blueprint: "crossbow"
          weight: 25

    dungeon_arcane:
      rolls:
        min: 1
        max: 2
      chance: 0.30
      entries:
        - blueprint: "diamond_sword"
          weight: 15
        - blueprint: "diamond_chestplate"
          weight: 10
        - blueprint: "potion:strength"
          weight: 20

    mythic_vault:
      rolls:
        min: 1
        max: 1
      chance: 0.40
      entries:
        - blueprint: "netherite_chestplate"
          weight: 10
        - blueprint: "elytra"
          weight: 15
        - blueprint: "enchantment:mending"
          weight: 20

  # ----------------------------------------------------------------------------
  # MINECRAFT LOOT TABLE MAPPINGS
  # ----------------------------------------------------------------------------
  tables:
    # Monster Spawner Dungeons
    "minecraft:chests/simple_dungeon":
      pools:
        - pool_ref: "tier1_basic"
        - chance: 0.10
          entries:
            - blueprint: "golden_apple"
              weight: 20

    # Abandoned Mineshafts
    "minecraft:chests/abandoned_mineshaft":
      pools:
        - pool_ref: "tier1_basic"

    # Desert & Jungle Temples
    "minecraft:chests/desert_pyramid":
      pools:
        - pool_ref: "tier1_basic"
        - chance: 0.15
          entries:
            - blueprint: "tnt"
              weight: 50

    # Nether Fortresses
    "minecraft:chests/nether_bridge":
      pools:
        - chance: 0.35
          entries:
            - blueprint: "brewing_stand"
              weight: 30
            - blueprint: "potion:fire_resistance"
              weight: 40

    # Bastion Remnants (Wildcard matches all bastion chest variants)
    "minecraft:chests/bastion_*":
      pools:
        - chance: 0.45
          entries:
            - blueprint: "netherite_chestplate"
              weight: 15
            - blueprint: "diamond_pickaxe"
              weight: 35

    # Ancient Cities (Deep Dark)
    "minecraft:chests/ancient_city":
      pools:
        - pool_ref: "mythic_vault"

    # End Cities
    "minecraft:chests/end_city_treasure":
      pools:
        - pool_ref: "mythic_vault"

    # Trial Chambers (Minecraft 1.21+ / 26.x+)
    "minecraft:chests/trial_chambers/*":
      pools:
        - chance: 0.35
          entries:
            - blueprint: "mace"
              weight: 10
            - blueprint: "wind_charge"
              weight: 40

    # Archaeology (Minecraft 1.20+)
    "minecraft:archaeology/*":
      pools:
        - chance: 0.20
          entries:
            - blueprint: "sniffer_egg"
              weight: 10

    # Fishing Treasure
    "minecraft:gameplay/fishing/treasure":
      pools:
        - chance: 0.15
          entries:
            - blueprint: "heart_of_the_sea"
              weight: 20
            - blueprint: "trident"
              weight: 10

    # Mob Drops
    "minecraft:entities/wither_skeleton":
      pools:
        - chance: 0.05
          entries:
            - blueprint: "netherite_sword"
              weight: 10
```

---

## 3. Calibrating & Testing Drops (`/cb loot test`)

Administrators can simulate loot rolls in console or in-game without having to manually locate structures in survival worlds:

```text
/cb loot test <table_id> [rolls]
```

* **Example**:
  ```text
  /cb loot test minecraft:chests/bastion_treasure 1000
  ```
* **Output**: Displays statistical summary:
  ```text
  [CraftingBlueprints] Simulated 1,000 rolls for minecraft:chests/bastion_treasure:
  [CraftingBlueprints] Total blueprints rolled: 442 (44.2% drop rate)
  [CraftingBlueprints] - netherite_chestplate: 133 drops (30.1% share)
  [CraftingBlueprints] - diamond_pickaxe: 309 drops (69.9% share)
  ```

---

## 4. Hot-Reloading Loot Tables

When modifying `loot.yml`, reload changes instantly with:

```text
/cb reload config
```
or full reload:
```text
/cb reload all
```
