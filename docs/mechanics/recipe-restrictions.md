# Recipe Restrictions (Whitelist Mode vs Universal Gating)

CraftingBlueprints features an intelligent restriction engine (`RestrictionEngine.kt`) allowing server administrators to choose between **Selective Whitelist Mode** (recommended for Survival SMP) and **Universal Progression Mode** (recommended for Hardcore RPG).

---

## Operating Modes Comparison

Configured in `plugins/CraftingBlueprints/config.yml` under the `restrictions:` block:

```yaml
restrictions:
  # Mode options: 'restricted-only' or 'all'
  mode: "restricted-only"

  # Items, recipes, potions, or enchantments that require blueprints
  restricted-items:
    - "diamond_.*"
    - "netherite_.*"
    - "enchanted_golden_apple"
    - "beacon"
    - "potion:strength.*"
    - "potion:speed.*"
    - "enchantment:mending"
    - "enchantment:sharpness.*"
```

=== "Selective Whitelist Mode (mode: 'restricted-only')"

    * **Default for Modern SMP & Skyblock Servers**.
    * **All standard Minecraft recipes are completely FREE for all players by default!** Players can craft wooden tools, stone pickaxes, iron armor, torches, furnaces, and beds without ever touching a blueprint.
    * **ONLY items matching `restricted-items` require a blueprint.**
    * **Why choose this mode?** It eliminates player frustration. You can introduce custom blueprints for endgame gear (such as Netherite weapons, Beacons, or Mending enchantments) while leaving standard survival crafting 100% natural and unhindered.

=== "Universal Progression Mode (mode: 'all')"

    * **Designed for Hardcore RPG, Skyblock, and Quest Networks**.
    * **Every single craftable item, potion, and enchantment on your server requires a blueprint** before it can be produced.
    * Players must discover, purchase, or unlock blueprints for basic wood, stone, iron, and farming equipment step-by-step.
    * Combine this mode with [Permission Groups](../blueprints/groups-and-packs.md#3-permission-groups-in-configyml-groups) to grant tiers of basic recipes to player ranks automatically.

---

## Pattern Matching Reference Table

The `restricted-items:` list supports exact identifiers, wildcard globs, regular expressions (regex), and category prefixes:

| Pattern Syntax | Category Filtered | Example Matches | Operational Behavior |
| :--- | :--- | :--- | :--- |
| `beacon` | Crafting | `BEACON` | Exact material match. Case-insensitive. |
| `enchanted_golden_apple` | Crafting | `ENCHANTED_GOLDEN_APPLE` | Locks crafting of god apples (if enabled by datapacks). |
| `diamond_.*` | Crafting | `DIAMOND_SWORD`, `DIAMOND_CHESTPLATE`, `DIAMOND_PICKAXE`, etc. | Regex matching all equipment starting with `diamond_`. |
| `netherite_.*` | Crafting & Smithing | `NETHERITE_HELMET`, `NETHERITE_SWORD`, `NETHERITE_AXE`, etc. | Regex matching all Netherite tools, weapons, and armor. |
| `*gold*` | Crafting | `GOLDEN_SWORD`, `GOLDEN_APPLE`, `GOLD_INGOT`, etc. | Wildcard glob matching any item containing "gold". |
| `potion:strength.*` | Alchemy / Brewing | Strength I, Strength II, Extended & Splash variants | Locks brewing of all Strength potion variants. |
| `potion:speed.*` | Alchemy / Brewing | Speed I, Speed II, Splash Speed | Locks brewing of all Speed potion variants. |
| `enchantment:mending` | Anvil / Enchanting | Mending books and items in anvils | Locks combining or applying Mending enchantments. |
| `enchantment:sharpness.*`| Anvil / Enchanting | Sharpness I through Sharpness V | Locks applying Sharpness enchantments. |
| `smelt:iron_ingot` | Furnace / Smelting | Raw iron $\rightarrow$ Iron ingot | Locks smelting iron ingots in furnaces and blast furnaces. |
| `stonecut:.*stairs` | Stonecutter | All stairs cut via stonecutter | Locks stonecutter recipes matching the pattern. |

---

## Category Prefixes & Specificity

By default, an unqualified pattern without a prefix (e.g. `diamond_sword`) matches across all workstations. You can restrict evaluation to specific crafting stations using category prefixes:

* **`craft:` / `item:`**: Evaluates only standard 2x2 and 3x3 crafting workbench recipes.
* **`potion:` / `brew:`**: Evaluates only Brewing Stand potion brewing actions.
* **`enchant:` / `enchantment:`**: Evaluates only Anvil and Enchantment Table operations.
* **`smelt:` / `furnace:`**: Evaluates Furnaces, Blast Furnaces, Smokers, and Campfires.
* **`stonecut:` / `stonecutter:`**: Evaluates Stonecutter workstation recipes.

---

## Testing Gotcha: Operator Bypass (`op-bypass`)

In `plugins/CraftingBlueprints/config.yml`:

```yaml
op-bypass: true
```

!!! warning "Are you testing with /op?"
    If your testing account has server operator status (`/op`), CraftingBlueprints will allow you to craft, brew, and enchant restricted recipes freely, bypassing all locks.
    
    To properly test recipe restrictions as a normal player:
    1. Temporarily deop yourself: `/deop <your_player_name>`
    2. Alternatively, set `op-bypass: false` in `config.yml` and run `/cb reload config`.

To grant bypass rights to staff members or builders without giving them full operator status, assign the LuckPerms permission:

```bash
lp group moderator permission set craftingblueprints.bypass.ownership true
```

---

## Modular Preset Restriction Aggregation

When you install pre-built gameplay presets using `/cb preset apply` (e.g. Hardcore SMP or RPG Tiers), the plugin **never modifies your `config.yml`**.

Instead:
1. `config.yml` remains the sole authority for global operational mode (`restrictions.mode: "restricted-only"`).
2. Presets deploy their required restricted items to `configs/presets/<preset_id>/restrictions.yml`.
3. When the server boots or executes `/cb reload`, the engine performs a mathematical **Set Union** ($A \cup B$) between `config.yml` and all active preset restriction files.
4. When you uninstall a preset (`/cb preset remove <preset_id>`), its restrictions are cleanly purged from memory upon reload with zero leftovers.
