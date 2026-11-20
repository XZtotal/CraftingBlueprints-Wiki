# Declarative YAML Anatomy & Physical Items

CraftingBlueprints provides a 100% declarative, file-managed configuration system for defining custom crafting schematics. All blueprint definitions are authored in YAML files placed inside your server's `plugins/CraftingBlueprints/blueprints/` directory.

The engine recursively scans this directory and all nested subfolders in deterministic alphabetical order, compiling blueprints into memory and synchronizing them with your storage database.

---

## Anatomy of a Blueprint File

A blueprint configuration file can declare single blueprints (`singles:`), bundled packs (`packages:`), and randomized mystery scrolls (`mysteries:`), along with reusable templates (`templates:`) and directory-wide defaults (`default:`, `file_default:`).

Here is a complete, production-ready example declaring two distinct single blueprints:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
# ==============================================================================
# CraftingBlueprints - Master Weapons Configuration
# ==============================================================================

singles:
  # ----------------------------------------------------------------------------
  # Netherite Chestplate Blueprint (Permanent Master Schematic)
  # ----------------------------------------------------------------------------
  netherite_chestplate_blueprint:
    blueprint: NETHERITE_CHESTPLATE
    name: "<gradient:#434343:#000000><bold>Netherite Chestplate Blueprint</bold></gradient>"
    lore:
      - "<gray>An ancient smithing schematic recovered from"
      - "<gray>the depths of a Nether Bastion remnant."
      - ""
      - "<yellow>Target:</yellow> <white>{blueprint_target}</white>"
      - "<yellow>Quality:</yellow> <gold>{tier}</gold>"
      - "<yellow>Access:</yellow> <light_purple>Permanent Unlock</light_purple>"
      - ""
      - "<green>Shop Price:</green> <gold>${price}</gold>"
      - "<dark_gray>Right-click in hand to bind this knowledge to your soul.</dark_gray>"
    permanent: true
    time: 0
    uses: 0
    price: 25000.0
    sell_price: 6250.0
    station: SMITHING_TABLE
    item:
      material: NETHER_STAR
      custom_model_data: 3001
      glowing: true
    extra:
      tier: "LEGENDARY"
      category: "armor"
      tradeable: true

  # ----------------------------------------------------------------------------
  # Diamond Pickaxe Blueprint (3-Use Mining Permit)
  # ----------------------------------------------------------------------------
  diamond_pickaxe_permit:
    blueprint: DIAMOND_PICKAXE
    name: "<gradient:#00AAFF:#00FFAA><bold>Diamond Pickaxe Mining Permit</bold></gradient>"
    lore:
      - "<gray>A certified guild permit allowing the forging"
      - "<gray>of heavy diamond excavators."
      - ""
      - "<yellow>Target:</yellow> <white>{blueprint_target}</white>"
      - "<yellow>Charges Remaining:</yellow> <aqua>{uses} crafts</aqua>"
      - ""
      - "<dark_gray>Right-click in hand to claim craft charges.</dark_gray>"
    permanent: false
    time: 0
    uses: 3
    price: 3500.0
    sell_price: 800.0
    station: CRAFTING_TABLE
    item:
      material: PAPER
      custom_model_data: 1042
      glowing: false
    extra:
      tier: "RARE"
      category: "tools"
```

---

## Core Configuration Parameters

Every entry under `singles:` supports the following configuration properties:

| Parameter | Data Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `blueprint` | String | *Mandatory* | The target recipe output, material name (`DIAMOND_SWORD`), potion effect (`SPEED`), enchantment (`SHARPNESS`), or custom item identifier (`ia:weapons:ruby_sword`, `nexo:mythril_axe`). |
| `name` | String | Material Name | The display name shown in item tooltips and inventory menus. Supports MiniMessage tags (`<gradient:...>`, `<bold>`) and legacy color codes (`&6`, `&l`). |
| `lore` | List<String> | Automatic | Tooltip lore lines describing the blueprint. Supports MiniMessage tags and dynamic placeholders (`{uses}`, `{time}`, `{price}`). |
| `permanent` | Boolean | `true` | If `true`, the blueprint provides permanent, unlimited craft access once unlocked. |
| `uses` | Integer | `0` | Finite number of craft/smelt/brew operations allowed. `0` indicates unlimited uses. Only evaluated when `permanent: false`. |
| `time` | String / Long | `0` | Duration of crafting access starting from unlock timestamp (e.g. `1h`, `7d`, `45m`). `0` indicates no time expiration. |
| `price` | Double | `0.0` | Purchase price when buying this blueprint via `/cb buy <id>` or integrated Vault economy shops. |
| `sell_price` | Double | `0.0` | Sell value credited to the player when selling this blueprint via `/cb sell`. |
| `station` | String | `ANY` | Constrains the blueprint to a specific workstation type: `CRAFTING_TABLE`, `BLAST_FURNACE`, `SMOKER`, `FURNACE`, `STONECUTTER`, `BREWING_STAND`, `ANVIL`, `ENCHANTING_TABLE`, or `ANY`. |
| `item` | Map | Domain Default | Configures the physical `ItemStack` visual appearance (`material`, `custom_model_data`, `glowing`). |
| `template` / `templates` | String / List | `null` | Mixin template reference(s) inherited from `templates/` or parent folders. |
| `extra` | Map<String, Any> | `{}` | Extensible sandbox dictionary for custom metadata (PAPI placeholders, PDC tags, and dynamic lore variables). |

!!! note "Station Constraints vs. Output Matching"
    If an item can be produced at multiple stations (such as smelting iron ore in a standard Furnace or a Blast Furnace), setting `station: BLAST_FURNACE` will strictly restrict the recipe to Blast Furnaces while allowing standard furnace operations to remain untouched or governed by separate rules.

---

## Dynamic Lore Placeholders

CraftingBlueprints automatically interpolates dynamic `{placeholder}` tokens inside your `lore:` lines upon item creation and GUI rendering:

### Built-in System Placeholders

| Placeholder | Replacement Description | Example Output |
| :--- | :--- | :--- |
| `{id}` / `{blueprint_id}` | The unique identifier key of the blueprint. | `netherite_chestplate_blueprint` |
| `{blueprint_target}` / `{target}` | The target recipe output or material name. | `NETHERITE_CHESTPLATE` |
| `{bname}` | The formatted display name of the blueprint. | `Netherite Chestplate Blueprint` |
| `{uses}` | The configured or remaining number of craft uses. | `3` |
| `{time}` | The configured or remaining duration. | `7d`, `1h 30m` |
| `{price}` | The configured purchase price formatted to two decimals. | `25000.00` |
| `{sell_price}` | The configured sell price formatted to two decimals. | `6250.00` |
| `{permanent}` | Localized boolean indicating permanent unlock status. | `Permanent`, `Temporary` |

### Custom Placeholders (`extra:`)

Any key-value pair defined under `extra:` can be directly referenced in your lore using `{key}`:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  alchemist_flask:
    blueprint: POTION
    lore:
      - "<gray>Item Grade:</gray> <gold>{tier}</gold>"
      - "<gray>Requires Level:</gray> <aqua>{min_level}</aqua>"
    extra:
      tier: "MYTHIC"
      min_level: 45
```

When generated, `{tier}` resolves to `MYTHIC` and `{min_level}` resolves to `45`.

---

## Physical Item Representation (`item:` block)

In **CraftingBlueprints Standard Edition**, physical blueprint items delivered to players are standard Minecraft items. You can customize their physical presentation using the `item:` block:

```yaml
item:
  material: NETHER_STAR        # Bukkit Material name
  custom_model_data: 3001      # Integer for Resource Packs (ItemsAdder, Nexo, Oraxen)
  glowing: true                # Enchantment glint without displaying enchantment text
```

### Material Fallback Defaults

If the `item:` block or `item.material` is omitted:
- **Single Blueprints**: Defaults to `PAPER`.
- **Package Blueprints**: Defaults to `BOOK`.
- **Mystery Scrolls**: Defaults to `SPONGE`.

```
┌────────────────────────────────────────────────────────┐
│              Standard Edition Physical Item            │
├────────────────────────────────────────────────────────┤
│  Material: NETHER_STAR                                 │
│  CustomModelData: 3001                                 │
│  Enchantment Glint: true                               │
│  PersistentDataContainer (PDC):                        │
│    - craftment-blueprints:craftment-blueprints         │
│    - craftingblueprints:tier = "LEGENDARY"             │
└────────────────────────────────────────────────────────┘
```

!!! tip "Custom Resource Packs & ItemsAdder / Nexo"
    By setting `material: PAPER` (or any utility material) and combining it with `custom_model_data`, you can assign custom 2D textures, 3D scroll models, or antique parchment sprites from your server's resource pack.

---

## The Hierarchical Defaults Engine

To eliminate boilerplate repetition across large networks, CraftingBlueprints provides a two-level defaults cascading engine:

```
[ Root blueprints/ default: ]
             │
             ▼
[ Subfolder (weapons/) default: ]
             │
             ▼
[ File file_default: ]
             │
             ▼
[ Local Blueprint Definition ]
```

### 1. Folder Defaults (`default:`)
A `default:` block declared in **any** `.yml` file within a directory cascades down to all blueprints in that directory and its nested subfolders:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
# blueprints/weapons/defaults.yml
default:
  price: 5000.0
  sell_price: 1250.0
  item:
    material: PAPER
    glowing: true
  extra:
    category: "weapons"
```

Every blueprint defined inside `blueprints/weapons/` (such as `swords.yml`, `axes.yml`) automatically inherits `price: 5000.0`, `material: PAPER`, `glowing: true`, and `category: "weapons"` unless explicitly overridden.

### 2. File Defaults (`file_default:`)
A `file_default:` block applies **only** to the blueprints inside that specific file, overriding any inherited folder default:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
# blueprints/weapons/legendary_axes.yml
file_default:
  price: 25000.0
  extra:
    tier: "LEGENDARY"
    category: "axes"
```

### 3. Severing Inheritance (`inherit: false`)
If a subfolder or file represents special content (such as event items, admin tools, or free quest rewards), you can sever the inheritance chain:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
# blueprints/weapons/admin_items.yml
file_default:
  inherit: false    # Discards all inherited folder defaults
  price: 0.0        # Starts with a completely clean state
  extra:
    category: "admin"
```

---

## Looking for Visual Map Graphics?

!!! note "Extended Edition Technical Drafting Engine"
    If you are running **CraftingBlueprints Extended**, blueprints can render directly on in-game maps (`Material.FILLED_MAP`) with procedural Guilloché security frames, 25 background textures, status seals, and dithered gradient typography.

    See the [Technical Drafting Engine Overview](../extended/drafting-overview.md) to explore map rendering capabilities.

---

## Validating Your Blueprint Configurations

Never restart your production server or guess syntax validity. Use the non-destructive validation CLI:

```text
/cb validate
```

### What `/cb validate` Performs:
1. **Recursive Syntax Verification**: Checks all `.yml` files in `blueprints/` for proper YAML formatting and indentation.
2. **Material & Recipe Resolution**: Verifies that every `blueprint:` target exists on your server version and detects typos.
3. **Collision Detection**: Confirms that blueprint IDs are unique across all files and folders.
4. **Template Integrity**: Verifies that all referenced mixin templates exist within their lexical scope.
5. **Zero Database Modifications**: Runs purely in-memory as a dry-run check without updating your database or interrupting active gameplay.
