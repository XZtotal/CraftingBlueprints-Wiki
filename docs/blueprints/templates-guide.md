# Reusable Templates (Mixins)

If you are creating dozens or hundreds of custom blueprints, retyping the same lore format, pricing, and visual options for every item quickly becomes repetitive.

CraftingBlueprints features an object-oriented **Template Engine** (Mixins) that allows you to define reusable styling modules once and apply them across multiple blueprints.

---

## 1. Defining Templates

Templates are declared under the root `templates:` section of any blueprint YAML file:

```yaml
templates:
  # Base visual styling for ancient scrolls
  visual_ancient_scroll:
    item:
      material: PAPER
      custom_model_data: 1001
      glowing: true
    rendering:
      background: "texture_parchment_aged"
      tier: "RARE"
      guilloche_border: true

  # Economy & pricing module for Epic tier items
  economy_epic_tier:
    price: 15000.0
    sell_price: 3500.0
    extra:
      tier: "EPIC"
      currency: "VAULT"

  # Shared lore layout card with dynamic placeholders
  lore_standard_card:
    lore:
      - "<gray>Schematic Target:</gray> <white>{blueprint_target}</white>"
      - "<gray>Rarity Tier:</gray> <gold><bold>{tier}</bold></gold>"
      - ""
      - "<yellow>Buy Price:</yellow> <green>${price}</green>"
      - "<yellow>Sell Value:</yellow> <yellow>${sell_price}</yellow>"
      - ""
      - "<dark_gray>Right-click in hand to unlock this recipe.</dark_gray>"
```

---

## 2. Applying Templates to Blueprints

To apply templates to a blueprint, add their names to the `templates:` list:

```yaml
singles:
  ancient_netherite_axe:
    blueprint: NETHERITE_AXE
    name: "<gradient:#FF5555:#FFAA00><bold>Ancient Netherite Battleaxe</bold></gradient>"
    templates:
      - visual_ancient_scroll
      - economy_epic_tier
      - lore_standard_card

    # Specific overrides:
    uses: 5 # Overrides the default unlimited uses
```

---

## 3. Inheritance Rules

When templates are applied, CraftingBlueprints resolves properties following strict precedence:

1. **Direct Blueprint Properties**: Any property defined explicitly on the blueprint itself (e.g. `uses: 5` or `price: 20000.0`) **always takes highest priority**.
2. **Order of Templates**: If two templates define the same setting, the template listed **later** in the `templates:` list overrides the earlier one.
3. **Placeholder Resolution**: Placeholders such as `{price}`, `{tier}`, and `{blueprint_target}` resolve dynamically *after* all templates have been merged.

---

## 4. Best Practices for Large Servers

* Create a dedicated `templates.yml` file in `plugins/CraftingBlueprints/blueprints/` to house all your global templates.
* Separate your templates by tier (e.g. `common_tier`, `rare_tier`, `legendary_tier`).
* When balancing your economy, updating the price in a single template automatically updates hundreds of blueprints across your server instantly on `/cb reload blueprints`.
