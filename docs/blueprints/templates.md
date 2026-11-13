# Templates & Inheritance

CraftingBlueprints features an object-oriented template system (**Mixins**) that eliminates configuration duplication across hundreds of blueprints.

---

## Defining Templates

Templates are declared under the root `templates:` section in any blueprint YAML file. Each template can define visual properties, lore components, prices, or metadata:

```yaml
templates:
  # Base visual styling for enchanted scrolls
  scroll_visuals:
    item:
      material: PAPER
      custom_model_data: 501
      glowing: true

  # Standard shop pricing for Epic tier
  epic_pricing:
    price: 10000.0
    sell_price: 2500.0
    extra:
      tier: "EPIC"

  # Standard lore template with dynamic placeholders
  standard_lore_card:
    lore:
      - "<gray>Schematic Target:</gray> <white>{blueprint_target}</white>"
      - "<gray>Rarity Tier:</gray> <light_purple><bold>{tier}</bold></light_purple>"
      - ""
      - "<yellow>Buy Price:</yellow> <green>${price}</green>"
      - "<yellow>Sell Value:</yellow> <yellow>${sell_price}</yellow>"
      - ""
      - "<dark_gray>Right-click in hand to unlock this schematic.</dark_gray>"
```

---

## Applying Templates to Blueprints

To apply templates, list them under the `templates:` list within any blueprint. Templates are merged in order:

```yaml
singles:
  shadow_bow:
    blueprint: BOW
    name: "<gradient:#9900EE:#FF0055><bold>Shadow Bow Blueprint</bold></gradient>"
    templates:
      - scroll_visuals
      - epic_pricing
      - standard_lore_card
    # Specific overrides:
    uses: 5 # Overrides default unlimited uses
```

### Inheritance Rules

1. **Order Precedence**: Templates listed later override conflicting properties from earlier templates.
2. **Explicit Override**: Any property directly defined on the blueprint itself (e.g. `uses: 5` or `price: 12000.0`) takes highest priority over all inherited templates.
3. **Placeholder Resolution**: Placeholders such as `{blueprint_target}`, `{price}`, `{sell_price}`, and `{tier}` are resolved dynamically after all templates have merged.

---

## Blueprint Groups (`groups:`)

In addition to single blueprints, you can define **Blueprint Groups** (`Type 1`) that unlock multiple recipes simultaneously:

```yaml
groups:
  blacksmith_apprentice_pack:
    name: "<gold><bold>Apprentice Blacksmithing Pack</bold></gold>"
    price: 25000.0
    items:
      - IRON_SWORD
      - IRON_PICKAXE
      - IRON_AXE
      - IRON_SHOVEL
      - IRON_HOE
    lore:
      - "<gray>Unlocks the complete set of Iron tools.</gray>"
```

When a player unlocks a blueprint group, all child recipes are unlocked instantly.
