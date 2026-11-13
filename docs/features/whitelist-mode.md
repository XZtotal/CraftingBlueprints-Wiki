# Whitelist Mode & Recipe Restrictions

CraftingBlueprints features a flexible restriction engine that gives server administrators fine-grained control over which items require blueprints and which items can be crafted freely.

---

## Operational Modes

Configured in `config.yml` under the `restrictions:` block:

```yaml
restrictions:
  # Operational mode: 'all' or 'restricted-only'
  mode: "restricted-only"

  # Items that require blueprints when mode is 'restricted-only'
  restricted-items:
    - "diamond_.*"
    - "netherite_.*"
    - "enchanted_golden_apple"
    - "beacon"
    - "potion:strength.*"
    - "potion:speed.*"
    - "enchantment:mending"
```

### 1. `mode: "all"` (Total Blueprint Gating)
* Every craftable item, potion, and enchantment on the server requires the corresponding blueprint to be unlocked before crafting.
* Ideal for hardcore RPG, tech progression, and MMO-style servers where crafting knowledge must be unlocked step-by-step.

### 2. `mode: "restricted-only"` (Selective Blueprint Mode)
* **All standard Minecraft recipes are freely craftable by default** without needing any blueprints.
* **Only items matching `restricted-items` require a blueprint.**
* Ideal for survival, SMP, and economy servers where you only want high-tier endgame gear (Netherite armor, enchanted golden apples, beacons, mending) locked behind quest rewards or dungeon loot blueprints.

---

## Pattern Matching Syntax

The `restricted-items` list supports exact material names, category prefixes, and regular expressions:

| Pattern Example | Description |
| :--- | :--- |
| `beacon` | Exactly matches `BEACON`. |
| `diamond_.*` | Matches all Diamond gear (`DIAMOND_SWORD`, `DIAMOND_CHESTPLATE`, etc.). |
| `netherite_.*` | Matches all Netherite tools, weapons, and armor. |
| `potion:strength.*` | Restricts standard and upgraded Strength brewing recipes. |
| `enchantment:mending` | Restricts applying Mending enchantments in anvils. |

---

## Modular Preset Overrides

CraftingBlueprints also allows community presets and modality packs to specify their own `restrictions.yml` files inside `presets/<pack_name>/restrictions.yml`. When a preset is deployed with `/cb preset apply <pack>`, the restricted list is merged automatically without corrupting your base `config.yml`.
