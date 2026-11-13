# Tutorial: Setting Up a Blueprint Economy Shop (Vault)

CraftingBlueprints integrates directly with **Vault** and your server's economy provider (EssentialsX, Economy, etc.), allowing players to purchase and sell blueprints using server currency directly from the `/cb item list` catalog GUI.

---

## Prerequisites

Ensure the following plugins are installed on your server:
* **CraftingBlueprints**
* **Vault**
* Any compatible economy provider (e.g. EssentialsX Economy)

---

## Step 1: Configure Blueprint Prices

In any blueprint file inside `plugins/CraftingBlueprints/blueprints/`, add the `price:` and `sell_price:` fields:

```yaml
singles:
  diamond_drill_blueprint:
    blueprint: DIAMOND_PICKAXE
    name: "<gradient:#00AAFF:#00FFAA><bold>Industrial Diamond Drill Blueprint</bold></gradient>"
    permanent: true

    # Economy settings
    price: 15000.0   # Cost to purchase via catalog GUI
    sell_price: 3500.0 # Refund given if sold back

    lore:
      - "<gray>Target Item:</gray> <white>{blueprint_target}</white>"
      - "<yellow>Purchase Cost:</yellow> <green>${price}</green>"
      - "<yellow>Sell Value:</yellow> <yellow>${sell_price}</yellow>"
```

Reload the blueprints:
```text
/cb reload blueprints
```

---

## Step 2: In-Game Purchasing Flow

1. Player types:
   ```text
   /cb item list
   ```
2. The player browses the catalog. Blueprints with a configured price display their cost.
3. Left-clicking an unlocked blueprint prompts the purchase confirmation.
4. If the player has sufficient funds:
   * Vault deducts `$15,000` from their account.
   * The blueprint is unlocked immediately.
   * The status badge changes from :lock: to :white_check_mark:.
