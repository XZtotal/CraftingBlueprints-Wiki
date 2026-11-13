# Tutorial: Setting Up a Blueprint Economy Shop (Vault)

CraftingBlueprints integrates directly with **Vault** and your server's economy provider (EssentialsX, Economy, etc.), allowing players to purchase and sell blueprints using server currency directly from the interactive `/cb item list` catalog GUI.

---

## Prerequisites

Ensure the following plugins are installed on your server:

1. **CraftingBlueprints**
2. **[Vault](https://www.spigotmc.org/resources/vault.34315/)**
3. Any Vault-compatible economy plugin (e.g. **EssentialsX Economy**, **TheEconomy**)

---

## Step 1: Configure Reusable Economy Templates

To maintain consistent pricing across your server, create an economy template file at `plugins/CraftingBlueprints/blueprints/00_economy_tiers.yml`:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
templates:
  # Tier 1: Apprentice Gear
  economy_apprentice:
    price: 1500.0
    sell_price: 375.0
    extra:
      tier: "APPRENTICE"

  # Tier 2: Journeyman Equipment
  economy_journeyman:
    price: 7500.0
    sell_price: 1875.0
    extra:
      tier: "JOURNEYMAN"

  # Tier 3: Master Artifacts
  economy_master:
    price: 35000.0
    sell_price: 8750.0
    extra:
      tier: "MASTER"
```

---

## Step 2: Configure Blueprint Shop Items

Create your blueprint definitions referencing the economy templates (e.g. `plugins/CraftingBlueprints/blueprints/industrial_tools.yml`):

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  diamond_drill_blueprint:
    blueprint: DIAMOND_PICKAXE
    name: "<gradient:#00AAFF:#00FFAA><bold>Industrial Diamond Drill Blueprint</bold></gradient>"
    permanent: true

    # Inherit Master tier economy ($35,000 buy / $8,750 sell)
    templates:
      - economy_master

    item:
      material: FILLED_MAP
      glowing: true

    map:
      theme: technical_slate
      frame: bracket
      badge: crafting

    lore:
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<gray>Target Equipment:</gray> <white>{target_item}</white>"
      - "<gray>Tier Classification:</gray> <gold><bold>{tier}</bold></gold>"
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<yellow>Catalog Buy Price:</yellow> <green>${price}</green>"
      - "<yellow>Catalog Sell Value:</yellow> <gold>${sell_price}</gold>"
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<dark_gray>Left-Click in catalog to purchase with Vault.</dark_gray>"
```

Reload the blueprints to update the catalog:
```text
/cb reload blueprints
```

---

## Step 3: The In-Game Purchasing Flow

1. The player opens the server catalog:
   ```text
   /cb item list
   ```
2. The player browses through the pages. Blueprints with a configured `price:` display their cost and a :lock: locked indicator.
3. The player **Left-Clicks** the `Industrial Diamond Drill Blueprint`:
    * A confirmation menu opens displaying the `$35,000` purchase price and the player's current balance.
4. Upon clicking **Confirm Purchase**:
    * Vault checks the player's account balance.
    * If funds are sufficient, Vault deducts `$35,000`.
    * The blueprint is unlocked immediately on the player's account.
    * A chime sound plays, and the status icon switches to :white_check_mark: **Unlocked**!

---

## Step 4: Selling Blueprints Back to the Catalog

If a player has an unlearned physical blueprint item in their inventory that defines a `sell_price:`:
* Players can run `/cb sell` (or click the sell icon in the catalog GUI) to surrender the physical item and receive the configured refund value (`$8,750`) deposited into their Vault economy balance.
