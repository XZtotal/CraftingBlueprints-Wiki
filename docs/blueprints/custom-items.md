# Custom Items, CustomModelData & Plugin Interoperability

Modern Minecraft RPG and survival networks rarely rely solely on vanilla items. Plugins such as **ItemsAdder**, **Oraxen**, **Nexo**, **MMOItems**, **EcoItems**, and **MythicMobs** generate hundreds of custom weapons, armor sets, and tools that share identical base vanilla materials (e.g. `DIAMOND_SWORD`, `BOW`, `PAPER`) differentiated only by `CustomModelData`, persistent NBT/PDC tags, or custom crafting recipe keys.

CraftingBlueprints natively inspects and gates custom items without identifier collisions across different custom item plugins.

---

## 1. CustomModelData on Physical Blueprint Items

If your resource pack includes custom 3D models for physical blueprint items (such as ancient parchment scrolls, magical stone tablets, or holographic holocrons):

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  ancient_katana_scroll:
    blueprint: DIAMOND_SWORD
    name: "<gold><bold>Ancient Katana Scroll</bold></gold>"

    # Physical item representation
    item:
      material: PAPER
      custom_model_data: 5012   # Matches your resource pack CustomModelData predicate
      glowing: true

    lore:
      - "<gray>A sacred parchment detailing the</gray>"
      - "<gray>forging of traditional katanas.</gray>"
```

When a player receives this blueprint, their Minecraft client renders the custom 3D model corresponding to `CustomModelData: 5012`.

---

## 2. Gating External Plugin Items (ItemsAdder, Oraxen, Nexo)

CraftingBlueprints hooks into external item plugins using an ordered SPI hierarchy. You can reference custom items directly in the `blueprint:` target field using namespaced prefixes:

### 1. ItemsAdder Compatibility (`ia:`)
Requires the ItemsAdder plugin. Uses the `ia:<namespace:id>` prefix:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  ruby_broadsword_blueprint:
    # Target ItemsAdder custom item
    blueprint: "ia:rpgweapons:ruby_broadsword"
    name: "<red><bold>Ruby Broadsword Blueprint</bold></red>"
    permanent: true

    map:
      theme: dwarven_magma
      frame: rosette
      badge: smithing
```

### 2. Oraxen Compatibility (`oraxen:`)
Requires the Oraxen plugin. Uses the `oraxen:<id>` prefix:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  mythril_pickaxe_blueprint:
    # Target Oraxen custom item ID
    blueprint: "oraxen:mythril_pickaxe"
    name: "<aqua><bold>Mythril Pickaxe Blueprint</bold></aqua>"
    permanent: true

    map:
      theme: technical_slate
      frame: bracket
      badge: crafting
```

### 3. Nexo Compatibility (`nexo:`)
Requires the Nexo plugin. Uses the `nexo:<id>` prefix:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  amethyst_spear_blueprint:
    # Target Nexo custom item ID
    blueprint: "nexo:amethyst_spear"
    name: "<light_purple><bold>Amethyst Spear Blueprint</bold></light_purple>"
    permanent: true
```

### 4. MMOItems Compatibility (`mmoitems:`)
Requires MMOItems. Uses the `mmoitems:<TYPE>:<ID>` format:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  excalibur_relic_blueprint:
    blueprint: "mmoitems:SWORD:EXCALIBUR"
    name: "<gold><bold>Holy Excalibur Blueprint</bold></gold>"
    permanent: true
```

### 5. EcoItems & MythicMobs (Native PDC Hooks)
* **EcoItems**: `ecoitems:<id>` (e.g. `ecoitems:titan_axe`)
* **MythicMobs**: `mythicmobs:<id>` (e.g. `mythicmobs:skeleton_king_crown`)

---

## 3. Pure Vanilla CustomModelData Matching

If your server uses custom items via vanilla datapacks or simple CustomModelData without a heavy plugin framework:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  obsidian_scythe_blueprint:
    # Target material with CustomModelData selector
    blueprint: "diamond_hoe@custom_model_data:1042"
    name: "<dark_purple><bold>Obsidian Scythe Blueprint</bold></dark_purple>"
    permanent: true
```

CraftingBlueprints verifies that the crafted item matches both `Material.DIAMOND_HOE` and `CustomModelData == 1042`. Standard diamond hoes crafted by players remain unaffected.

---

## 4. Gating Custom Datapack Recipes (`recipe:`)

To gate custom crafting table recipes registered via vanilla datapacks or custom crafting engines:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  custom_saddle_recipe:
    # Target recipe namespaced key
    blueprint: "recipe:customcrafting:leather_saddle"
    name: "<gold>Craftable Saddle Blueprint</gold>"
    permanent: true
```

---

## 5. Economy Safety Policy: `fallback-to-vanilla`

In `plugins/CraftingBlueprints/config.yml`:

```yaml
item-matching:
  enabled: true
  fallback-to-vanilla: true
```

### Why is this crucial for server balance?
Imagine your server has 50 custom swords registered in ItemsAdder that use `DIAMOND_SWORD` as their base material.
* If an administrator creates an explicit blueprint for `ia:rpgweapons:flame_blade`, but forgets to configure blueprints for the other 49 custom swords:
    * With `fallback-to-vanilla: true`: The plugin checks if the base vanilla material (`diamond_sword`) is restricted in Whitelist Mode. Since it is, the unconfigured custom swords **safely fall back to requiring the base Diamond Sword blueprint**. Players cannot bypass your progression!
    * With `fallback-to-vanilla: false`: Unconfigured custom swords would be freely craftable by anyone with raw ingredients.

---

## 6. Extensible Metadata (`extra`)

The `extra:` mapping allows you to attach custom key-value pairs to any blueprint. This data is preserved in memory and can be queried by external plugins, Skript, or Denizen:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  shadow_dagger:
    blueprint: IRON_SWORD
    extra:
      required_combat_level: 45
      rpg_class: "ASSASSIN"
      tradeable: false
      custom_stat_multiplier: 1.25
```
