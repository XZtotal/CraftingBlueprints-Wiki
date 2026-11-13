# Quickstart: Your First Blueprint in 3 Minutes

Follow this quick tutorial to create, grant, and craft your very first custom blueprint.

---

## 1. Create a Test Blueprint File

Navigate to your server directory and create a new YAML file named `test_sword.yml` inside:

```text
plugins/CraftingBlueprints/blueprints/test_sword.yml
```

Paste the following configuration:

```yaml
singles:
  obsidian_blade:
    # Target Bukkit recipe to unlock
    blueprint: DIAMOND_SWORD
    name: "<gradient:#9900EE:#FF0055><bold>Obsidian Blade Blueprint</bold></gradient>"

    # Durability & limits (permanent = player keeps the recipe forever)
    permanent: true
    time: 0
    uses: 0

    # Physical item representation
    item:
      material: FILLED_MAP
      glowing: true

    # Visual map aesthetic
    rendering:
      background: "texture_dwarven_magma"
      tier: "EPIC"
      guilloche_border: true
      show_ingredients: true

    # Lore description
    lore:
      - "<gray>Schematic Target:</gray> <white>{blueprint_target}</white>"
      - ""
      - "<dark_gray>Right-click with this map in hand to unlock the recipe.</dark_gray>"
```

---

## 2. Hot-Reload the Blueprints

Back in your server console or in-game as an operator, execute:

```text
/cb reload blueprints
```

You will see confirmation that `test_sword.yml` was parsed and registered without needing a server restart.

!!! tip
    Before deploying complex YAML files on a live server, run `/cb validate` to check for typos or invalid material names.

---

## 3. Grant the Blueprint to Yourself

Give yourself the blueprint using the `/cb give` command:

```text
/cb give <your_player_name> obsidian_blade 1
```

Look at your inventory. You will receive a high-resolution map item rendering the Dwarven Magma background, the crafting ingredients matrix, and the Epic tier Guilloche border.

---

## 4. Learn and Craft

1. **Hold the map** in your main hand and **right-click**. You will receive a message confirming that you have permanently unlocked the recipe.
2. Open a standard crafting table.
3. Place two diamonds and a stick into the matrix. The diamond sword will craft normally.
4. If you have enabled [Recipe Restrictions](../mechanics/recipe-restrictions.md), any player without the blueprint who attempts to craft that item will be blocked with an informative message.

---

## What's Next?

* [Understand all settings in config.yml](../configuration/config-guide.md)
* [Explore advanced YAML properties and limits](../blueprints/basic-blueprint-yaml.md)
* [Learn how to create limited-use scrolls (e.g. 5 crafts)](../blueprints/durability-and-uses.md)
