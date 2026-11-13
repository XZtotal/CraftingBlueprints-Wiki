# Tutorial: Gating Netherite Gear in an SMP

In vanilla Minecraft, players often rush Netherite gear within a few days of a server launch. This tutorial walks you through setting up CraftingBlueprints to **gate Netherite armor and tools** behind rare blueprints found in Bastion Remnants.

---

## Step 1: Enable Selective Recipe Restrictions

Open `plugins/CraftingBlueprints/config.yml` and configure the restriction block:

```yaml
restrictions:
  mode: "restricted-only"
  restricted-items:
    - "netherite_sword"
    - "netherite_pickaxe"
    - "netherite_axe"
    - "netherite_shovel"
    - "netherite_hoe"
    - "netherite_helmet"
    - "netherite_chestplate"
    - "netherite_leggings"
    - "netherite_boots"
```

* This keeps all wooden, stone, iron, and diamond gear freely craftable without blueprints.
* Only Netherite items will require unlocking.

---

## Step 2: Create the Ancient Netherite Blueprint

Create a new file named `plugins/CraftingBlueprints/blueprints/netherite_progression.yml`:

```yaml
singles:
  ancient_netherite_smithing:
    blueprint: NETHERITE_CHESTPLATE
    name: "<gradient:#FF5555:#FFAA00><bold>Ancient Netherite Smithing Technique</bold></gradient>"
    permanent: true

    item:
      material: FILLED_MAP
      glowing: true

    rendering:
      background: "texture_dwarven_magma"
      tier: "MYTHIC"
      guilloche_border: true
      show_ingredients: true

    lore:
      - "<gray>Type:</gray> <gold>Ancient Smithing Knowledge</gold>"
      - "<gray>Rarity:</gray> <light_purple>Mythic</light_purple>"
      - ""
      - "<yellow>Grants the forbidden knowledge to forge</yellow>"
      - "<yellow>and upgrade Netherite equipment.</yellow>"
      - ""
      - "<dark_gray>Right-click with this map in hand to unlock.</dark_gray>"
```

Run `/cb reload all` to load the changes.

---

## Step 3: Distribute the Blueprint via Dungeon Loot

You can add this blueprint to Nether Bastion chests using standard server loot plugins or datapacks by executing:

```text
cb give %player% ancient_netherite_smithing 1
```

---

## Step 4: Verification

1. Try upgrading a diamond chestplate to Netherite in a Smithing Table without learning the blueprint. The output slot will remain locked.
2. Right-click the `Ancient Netherite Smithing Technique` map.
3. Return to the Smithing Table: the Netherite upgrade is now unlocked and crafts successfully!
