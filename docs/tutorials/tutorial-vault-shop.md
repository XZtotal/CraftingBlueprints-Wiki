# Tutorial: Setting Up a Blueprint Economy with Vault (/cb buy & /cb sell)

CraftingBlueprints integrates directly with **Vault** and any compatible economy provider (such as EssentialsX Economy or TheEconomy), enabling players to purchase recipes using `/cb buy` and sell physical blueprints back to the server using `/cb sell`.

---

## Prerequisites

Ensure the following plugins are loaded on your server:

1. **CraftingBlueprints**
2. **[Vault](https://www.spigotmc.org/resources/vault.34315/)**
3. Any Vault-compatible economy plugin (e.g. **EssentialsX**)

Verify that Vault is active by checking `/cb status` in console.

---

## Step 1: Configure Reusable Economy Templates

To maintain balanced pricing across your server, declare reusable economy templates in `plugins/CraftingBlueprints/blueprints/00_economy_tiers.yml`:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
templates:
  # Tier 1: Novice Equipment
  economy_apprentice:
    price: 1500.0
    sell_price: 375.0
    extra:
      tier: "APPRENTICE"

  # Tier 2: Expert Gear
  economy_journeyman:
    price: 7500.0
    sell_price: 1875.0
    extra:
      tier: "JOURNEYMAN"

  # Tier 3: Endgame Master Artifacts
  economy_master:
    price: 35000.0
    sell_price: 8750.0
    extra:
      tier: "MASTER"
```

---

## Step 2: Configure Blueprint Recipes with Economy Tags

Create blueprint definitions referencing your economy tiers (e.g., `plugins/CraftingBlueprints/blueprints/industrial_tools.yml`):

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  diamond_drill_blueprint:
    blueprint: DIAMOND_PICKAXE
    name: "<gradient:#00AAFF:#00FFAA><bold>Industrial Diamond Drill Blueprint</bold></gradient>"
    permanent: true

    # Inherit Master tier pricing ($35,000 buy / $8,750 sell)
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
      - "<yellow>Purchase Price:</yellow> <green>${price}</green>"
      - "<yellow>Sell Refund Value:</yellow> <gold>${sell_price}</gold>"
      - "<dark_gray><strikethrough>-----------------------------</strikethrough></dark_gray>"
      - "<dark_gray>Run /cb buy diamond_drill_blueprint to purchase.</dark_gray>"
```

Hot-reload your blueprint definitions without restarting:

```text
/cb reload blueprints
```

---

## Step 3: Player Permissions Setup

By default, purchasing and selling permissions are granted to all players:

* `craftingblueprints.buy` (Default: `true`)
* `craftingblueprints.sell` (Default: `true`)

If you manage permissions via **LuckPerms**, you can explicitly configure them:

```bash
# Allow all default players to buy and sell blueprints
lp group default permission set craftingblueprints.buy true
lp group default permission set craftingblueprints.sell true
```

---

## Step 4: Purchasing Blueprints In-Game (`/cb buy`)

Players purchase blueprints through chat commands, supporting two distribution modes:

### Mode A: Direct Virtual Unlock (Default)

When a player runs:

```text
/cb buy diamond_drill_blueprint
```

1. The plugin verifies that Vault has an active economy provider and checks the player's balance.
2. If the player has at least `$35,000`, Vault deducts the cost.
3. The recipe is unlocked directly in the player's profile:
    * The player can immediately craft the Diamond Pickaxe at any crafting table.
    * A level-up sound plays (`ENTITY_PLAYER_LEVELUP`).
    * The recipe is now visible in the player's `/cb menu` dashboard.
4. If the player has insufficient funds, a localized error message displays the missing balance.

### Mode B: Physical Item Grant (`--item`)

If a player wants a physical, tradeable blueprint item (for example, to store in a chest, trade with friends, or frame in their base):

```text
/cb buy diamond_drill_blueprint --item
```

1. Vault deducts `$35,000` from the player's balance.
2. The plugin delivers the physical blueprint item (e.g., high-resolution map or parchment) directly into the player's inventory.
3. **Inventory Overflow Safety**: If the player's inventory is full, the item safely drops at their feet instead of being lost.

---

## Step 5: Selling Physical Blueprints Back (`/cb sell`)

If a player has a physical blueprint in their inventory with a configured `sell_price:`:

1. The player holds the physical blueprint item in their **main hand**.
2. The player executes:
   ```text
   /cb sell
   ```
3. The plugin:
    * Inspects the item's persistent data tag to verify its authenticity.
    * Reads the blueprint's `sell_price` (`$8,750`).
    * Removes 1 blueprint item from the player's main hand.
    * Executes `economy.depositPlayer(player, 8750.0)`.
    * Plays an orb pickup sound and confirms the transaction in chat.

---

## Step 6: Creating Custom GUI Shops with DeluxeMenus

If you want a custom graphical shop interface for your server, you can integrate CraftingBlueprints commands with any menu plugin (e.g., **DeluxeMenus**, **TrMenu**, or **ChestCommands**):

```yaml
# DeluxeMenus Example Button (Diamond Drill Blueprint)
items:
  'drill_blueprint':
    material: FILLED_MAP
    slot: 13
    display_name: '&#00AAFF&lIndustrial Diamond Drill Blueprint'
    lore:
      - '&7Price: &a$35,000'
      - '&7Click to purchase!'
    left_click_commands:
      - '[player] cb buy diamond_drill_blueprint'
    right_click_commands:
      - '[player] cb buy diamond_drill_blueprint --item'
```

This architecture gives you complete visual freedom over your shop menus while CraftingBlueprints guarantees atomic transactions and anti-duplication protection behind the scenes.
