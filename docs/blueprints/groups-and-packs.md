# Blueprint Packs & Group Unlocks

In addition to single-recipe blueprints, CraftingBlueprints allows you to define **Blueprint Groups** (`groups:`). A Blueprint Group is a single item or unlockable package that grants access to multiple recipes simultaneously.

---

## When Should You Use Groups?

* **Armor Sets**: Granting access to the complete 4-piece set (Helmet, Chestplate, Leggings, Boots).
* **Class & Profession Packs**: Unlocking a blacksmith's complete tool line (Sword, Pickaxe, Axe, Shovel, Hoe).
* **Builder Kits**: Unlocking all varieties of decorated blocks, terracotta, or concrete recipes at once.

---

## Configuration Example: Diamond Armor Pack

Create a blueprint entry under the `groups:` root key in any blueprint YAML file:

```yaml
groups:
  diamond_knight_armor_pack:
    name: "<gradient:#00AAFF:#00FFAA><bold>Diamond Knight Armor Pack</bold></gradient>"

    # List of all recipe materials unlocked together
    items:
      - DIAMOND_HELMET
      - DIAMOND_CHESTPLATE
      - DIAMOND_LEGGINGS
      - DIAMOND_BOOTS

    # Optional price when purchased through the catalog
    price: 35000.0
    sell_price: 8000.0

    # Physical item given when distributing this group
    item:
      material: BOOK
      glowing: true

    # Lore description
    lore:
      - "<gray>Package Type:</gray> <yellow>Complete Armor Set</yellow>"
      - "<gray>Contents:</gray> <white>Helmet, Chestplate, Leggings, Boots</white>"
      - ""
      - "<yellow>Shop Price:</yellow> <green>${price}</green>"
      - ""
      - "<dark_gray>Right-click in hand to unlock all 4 recipes.</dark_gray>"
```

---

## In-Game Player Experience

1. **Receiving the Pack**: When given via command (`/cb give <player> diamond_knight_armor_pack 1`) or purchased in `/cb item list`, the player receives the designated physical item (e.g. an enchanted book).
2. **Unlocking**: The player right-clicks with the item in hand.
3. **Instant Access**: All child recipes listed under `items:` are unlocked immediately and saved to the player's account.
4. **Catalog Inspection**: In `/cb item list`, the player can click on the pack to view the individual recipes included inside.
