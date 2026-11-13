# Potions & Smithing Upgrades

In addition to standard 3x3 crafting tables, CraftingBlueprints supports gating **Alchemy (Brewing Stands)** and **Smithing Table Upgrades**.

---

## 1. Gating Alchemy & Potions

You can lock high-tier combat potions (e.g., Strength II, Invisibility, Turtle Master) behind alchemy blueprints.

### Step 1: Restrict the Potion in config.yml
In `plugins/CraftingBlueprints/config.yml`:

```yaml
restrictions:
  mode: "restricted-only"
  restricted-items:
    - "potion:strength.*"
    - "potion:invisibility.*"
```

### Step 2: Create the Alchemy Blueprint
In `plugins/CraftingBlueprints/blueprints/potions.yml`:

```yaml
singles:
  strength_potion_recipe:
    blueprint: POTION
    name: "<gradient:#FF0000:#FF7700><bold>Elixir of Greater Strength</bold></gradient>"
    permanent: true
    rendering:
      background: "texture_transmutation_circle"
      tier: "RARE"
    lore:
      - "<gray>Unlocks the ability to brew Strength potions.</gray>"
```

When a player places blaze powder and brewing ingredients into a Brewing Stand, the brewing process only completes if the player has unlocked the required blueprint.

---

## 2. Gating Smithing Table Upgrades (Netherite & Armor Trims)

Minecraft 1.20+ introduced the revised Smithing Table with Netherite Upgrade Templates and Armor Trims.

### Restricting Netherite Upgrades
To prevent players from upgrading Diamond gear into Netherite without finding an ancient forge schematic:

In `config.yml`:
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

In your blueprint file:
```yaml
singles:
  ancient_netherite_forging:
    blueprint: NETHERITE_CHESTPLATE
    name: "<gold><bold>Ancient Netherite Smithing Technique</bold></gold>"
    permanent: true
    rendering:
      background: "texture_dwarven_magma"
      tier: "EPIC"
      guilloche_border: true
```

If an unauthorized player places a Diamond chestplate, netherite ingot, and upgrade template into the smithing table, the output slot remains locked until they unlock the blueprint.
