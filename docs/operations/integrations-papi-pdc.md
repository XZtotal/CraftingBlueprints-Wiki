# Economy, Placeholders & PDC Item Tags

In modern Minecraft networks, CraftingBlueprints is designed to interoperate seamlessly with the broader server ecosystem. Rather than locking features into an isolated silo, CraftingBlueprints provides three high-performance interoperability channels:

1. **Channel 1 (Vault Economy)**: Buy and sell blueprints via server currency with command-based execution.
2. **Channel 2 (PlaceholderAPI Expansion)**: Expose real-time player unlocks, remaining uses, expiration timers, and metadata to scoreboards, TAB lists, and custom menus.
3. **Channel 3 (PersistentDataContainer / PDC)**: Read and verify immutable NBT tags stamped directly into physical blueprint items without executing console commands.

```
                           ┌────────────────────────────────────────┐
                           │        CraftingBlueprints Model        │
                           │  - ID, Target, Time, Uses, Permanence  │
                           │  - price, sell_price, extra sandbox    │
                           └───────────────────┬────────────────────┘
                                               │
         ┌─────────────────────────────────────┼─────────────────────────────────────┐
         ▼                                     ▼                                     ▼
┌──────────────────┐                 ┌──────────────────┐                  ┌──────────────────┐
│ CANAL 1: VAULT   │                 │  CANAL 2: PAPI   │                  │   CANAL 3: PDC   │
│ Direct Economy   │                 │  PlaceholderAPI  │                  │  PersistentData  │
│  Transactions    │                 │    Expansion     │                  │    Container     │
└────────┬─────────┘                 └────────┬─────────┘                  └────────┬─────────┘
         │                                     │                                     │
         ▼                                     ▼                                     ▼
 /cb buy <id> [--item]                DeluxeMenus, TrMenu,                  zAuctionHouse, Trade,
 /cb sell (hand item)                 Scoreboards, TAB,                     ShopGUI+ (NBT Match),
 External Shop Menus                  BetonQuest, ActionBars                Skript, Custom Plugins
```

---

## Channel 1: Vault Economy Integration

CraftingBlueprints connects to **Vault** (`net.milkbowl.vault.economy.Economy`) through an automatic soft-dependency. When any Vault-compatible economy engine (e.g. EssentialsX Economy, CoinsEngine, PlayerPoints, TheNewEconomy) is active, server operators can monetize blueprint progression.

### 1. Configuring Blueprint Prices

Prices are declared at the root level of any blueprint or reusable template in YAML:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  netherite_chestplate_blueprint:
    blueprint: "minecraft:netherite_chestplate"
    name: "<gradient:#434343:#000000><bold>Netherite Plate Blueprint</bold></gradient>"
    permanent: true
    price: 15000.0        # Vault purchase cost
    sell_price: 3500.0    # Vault buyback value
    extra:
      tier: "MYTHIC"
      tradeable: true
```

- **`price`** (*Double*): Cost to purchase blueprint access or a physical voucher. If set to `0.0` or omitted, the blueprint cannot be purchased.
- **`sell_price`** (*Double*): Currency awarded when a player sells the physical blueprint item held in hand. If set to `0.0` or omitted, the blueprint cannot be sold.

!!! tip
    Both `price` and `sell_price` support global scaling during preset deployment via `--price-scale <factor>` and `--sell-ratio <ratio>`. See [Admin Operations](admin-commands.md).

---

### 2. Purchasing Blueprints (`/cb buy`)

Players purchase blueprints using the `/cb buy` command:

```bash
/cb buy <blueprint_id> [--item]
```

- **Permission**: `craftingblueprints.buy` (granted by default).
- **Direct Knowledge Unlock (Default)**: Omitting `--item` deducts `price` from the player's balance and unlocks the blueprint directly in their account profile. The player can immediately craft the recipe.
- **Physical Item Delivery (`--item`)**: Supplying `--item` deducts `price` and deposits a physical, unredeemed blueprint item directly into the player's inventory. If the inventory is full, the transaction is rejected to prevent item loss.

#### Purchase Execution Logic:
1. Validates that `<blueprint_id>` exists in the blueprint registry.
2. Reads `price`. If `price <= 0`, aborts: `<red>This blueprint is not available for purchase.</red>`.
3. Checks if the player already owns the blueprint permanently. If so, aborts: `<red>You already own this blueprint permanently.</red>`.
4. Validates that `economy.getBalance(player) >= price`. If insufficient, aborts with remaining balance feedback.
5. Withdraws funds via `economy.withdrawPlayer(player, price)`.
6. Fires `BlueprintBuyEvent` (see [Developer API](developer-api.md)).
7. Unlocks knowledge or delivers physical item, plays sound `ENTITY_PLAYER_LEVELUP`, and sends confirmation.

---

### 3. Selling Blueprints (`/cb sell`)

Players can liquidate physical blueprint scrolls or vouchers for server currency:

```bash
/cb sell
```

- **Permission**: `craftingblueprints.sell` (granted by default).
- **Execution Workflow**:
  1. Inspects the `ItemStack` held in the player's main hand.
  2. Verifies that the item is an authentic CraftingBlueprints item via its PersistentDataContainer tag.
  3. Resolves the blueprint definition and retrieves `sell_price`. If `sell_price <= 0`, aborts: `<red>This item cannot be sold.</red>`.
  4. Fires `BlueprintSellEvent`.
  5. Removes 1 unit of the item from the main hand.
  6. Deposits funds via `economy.depositPlayer(player, sell_price)` and sends transaction details.

---

### 4. The Command-Only Economy Architecture

A common administrator question is why CraftingBlueprints does not feature a built-in `/cb shop` GUI.

!!! note "Modularity & Ecosystem Freedom"
    In production networks, server owners already maintain dedicated shop infrastructures—such as **DeluxeMenus**, **TrMenu**, **ShopGUI+**, **ChestCommands**, or NPC dialogue engines (Citizens).  

    A hardcoded built-in shop menu forces rigid layouts, limited pagination, and restrictive permission mechanics. Instead, CraftingBlueprints exposes atomic, command-driven endpoints (`/cb buy <id> --item` and `/cb sell`) alongside PlaceholderAPI identifiers. This allows administrators to embed blueprint purchases into **any** existing GUI plugin with complete aesthetic and structural freedom.

#### Example: DeluxeMenus Blueprint Shop Integration
```yaml
items:
  'netherite_chest_blueprint':
    material: PAPER
    slot: 13
    display_name: '&#FFAA00&lNetherite Chestplate Blueprint'
    lore:
      - '&7Cost: &a$15,000'
      - '&7Status: %craftingblueprints_has_netherite_chestplate_blueprint%'
      - ''
      - '&eClick to purchase physical scroll!'
    left_click_requirement:
      requirements:
        has_money:
          type: '>='
          input: '%vault_eco_balance%'
          output: '15000'
    left_click_commands:
      - '[player] cb buy netherite_chestplate_blueprint --item'
      - '[close]'
```

---

## Channel 2: PlaceholderAPI Expansion

When PlaceholderAPI is installed, CraftingBlueprints registers the identifier `craftingblueprints`.

### Identifier Reference Master Table

All dynamic arguments accept both colon (`:`) and underscore (`_`) separators. The colon syntax (`:`) is strongly recommended to eliminate parsing ambiguity when blueprint identifiers contain underscores (e.g. `diamond_sword_blueprint`).

| Identifier | Type | Output / Example | Description |
| :--- | :---: | :--- | :--- |
| `%craftingblueprints_unlocked_total%`<br>`%craftingblueprints_unlocked_count%` | Integer | `14` | Total number of blueprints unlocked by the viewing player. |
| `%craftingblueprints_has:<id>%`<br>`%craftingblueprints_has_<id>%` | Boolean | `true` / `false` | Whether the player has unlocked blueprint `<id>`. |
| `%craftingblueprints_uses_left:<id>%`<br>`%craftingblueprints_uses_<id>%` | Integer | `3` (`0` if unlimited) | Remaining craft/smelt/brew usages for the blueprint. |
| `%craftingblueprints_time_left:<id>%`<br>`%craftingblueprints_time_<id>%` | String | `2d 5h` (`permanent`) | Formatted remaining time until temporal expiration. |
| `%craftingblueprints_is_permanent:<id>%` | Boolean | `true` / `false` | Whether the blueprint is permanently unlocked for the player. |
| `%craftingblueprints_price:<id>%`<br>`%craftingblueprints_price_<id>%` | Double | `15000.0` | Configured Vault purchase cost for blueprint `<id>`. |
| `%craftingblueprints_sell_price:<id>%`<br>`%craftingblueprints_sell_price_<id>%` | Double | `3500.0` | Configured Vault sell value for blueprint `<id>`. |
| `%craftingblueprints_extra:<id>:<key>%`<br>`%craftingblueprints_extra_<id>_<key>%` | Any | `MYTHIC`, `40`, `true` | Reads arbitrary attribute `<key>` from the blueprint's `extra:` YAML sandbox. |

---

### High-Performance Caching & TPS Shielding

On large servers with 100+ players, scoreboards and TAB plugins evaluate placeholders at rates between 1 Hz and 20 Hz. If placeholder evaluations trigger synchronous database I/O, main thread tick lag is guaranteed.

CraftingBlueprints implements a multi-tier cache shielding architecture to guarantee **solid 20.0 TPS**:

```
                       Placeholder Evaluation Requested
                                      │
                         Is entity in memory cache?
                                      │
                     ┌────────────────┴────────────────┐
                     │ YES                             │ NO
                     ▼                                 ▼
         Return value in O(1)              Query database on miss?
                                                       │
                                      ┌────────────────┴────────────────┐
                                      │ FALSE (Default)                 │ TRUE
                                      ▼                                 ▼
                            Return fallback ("")             Is Primary Server Thread?
                            Schedule async load                         │
                                                       ┌────────────────┴────────────────┐
                                                       │ YES                             │ NO
                                                       ▼                                 ▼
                                             Return fallback ("")             Resolve query async
                                             Queue async snapshot             Write to TTL Cache
```

#### Cache Tuning Settings (`config.yml`):
```yaml
placeholderapi:
  # When false (default), evaluating an uncached blueprint or offline player returns
  # fallback data immediately and schedules an asynchronous background fetch.
  query-database-on-cache-miss: false

  # When false (default), synchronous JDBC database queries on the primary server thread
  # are strictly blocked, preventing tick stalls.
  allow-sync-queries-on-main-thread: false
```

#### Performance Guarantees:
1. **`ReadOnlyPlaceholderCache` (Volatile TTL Cache)**: Snapshots resolved for offline players are stored in an isolated, volatile cache with a 15-second TTL. This completely prevents memory leaks and ensures offline profiles never contaminate `PlayerDB.cache`.
2. **Negative Caching (Tombstones)**: If a requested blueprint ID or player UUID does not exist, a tombstone sentinel is recorded for 10 seconds. Typos or deleted blueprints will not flood MySQL or SQLite with redundant lookups.
3. **Single Resolution Pass**: Internal lookups resolve blueprint references in a single pass, eliminating duplicate database inquiries.

---

## Channel 3: PersistentDataContainer (PDC / NBT) Item Tagging

When physical blueprint items are generated (via `/cb give`, `/cb buy --item`, or loot injection), CraftingBlueprints stamps immutable metadata into the item's `PersistentDataContainer` (PDC).

External plugins can authenticate blueprints, inspect remaining durability, and read custom attributes directly from the `ItemStack` without calling commands or listening to chat.

### 1. Root Authentication Tag

Every blueprint item carries the root identification tag:

- **Namespace Key**: `craftingblueprints:craftingblueprints`
- **Data Type**: `PersistentDataType.STRING` (JSON payload)
- **Payload Structure**:
  ```json
  {
    "type": 0,
    "id": "netherite_chestplate_blueprint",
    "uuid": "4f2a8931-18e3-4c59-b1d6-4e58b10e92fa",
    "mapinfo": 128
  }
  ```
  - `type`: Blueprint category integer (`0` = Single, `1` = Package, `2` = Mystery).
  - `id`: Canonical blueprint identifier.
  - `uuid`: Bound player UUID (or `null` if unbound tradeable scroll).
  - `mapinfo`: Extended Edition map ID mapping.

---

### 2. Extensible Extra Attribute PDC Mappings

All attributes defined inside the blueprint's `extra:` YAML block are injected into the PDC using Bukkit's standard `NamespacedKey("craftingblueprints", sanitizedKey)`:

| Extra YAML Declaration | PDC Key | Bukkit PersistentDataType | Example Value |
| :--- | :--- | :--- | :--- |
| `price: 15000.0` | `craftingblueprints:price` | `PersistentDataType.DOUBLE` | `15000.0` |
| `sell_price: 3500.0` | `craftingblueprints:sell_price` | `PersistentDataType.DOUBLE` | `3500.0` |
| `level_required: 40` | `craftingblueprints:level_required` | `PersistentDataType.INTEGER` | `40` |
| `tradeable: true` | `craftingblueprints:tradeable` | `PersistentDataType.BYTE` | `(byte) 1` |
| `tier: "LEGENDARY"` | `craftingblueprints:tier` | `PersistentDataType.STRING` | `"LEGENDARY"` |

---

### 3. Reading PDC Tags in Third-Party Engines

#### Java / Paper API Example:
```java
import org.bukkit.NamespacedKey;
import org.bukkit.inventory.ItemStack;
import org.bukkit.persistence.PersistentDataContainer;
import org.bukkit.persistence.PersistentDataType;

public class BlueprintAuthenticator {
    private static final NamespacedKey TAG_ROOT = new NamespacedKey("craftingblueprints", "craftingblueprints");
    private static final NamespacedKey TAG_PRICE = new NamespacedKey("craftingblueprints", "price");
    private static final NamespacedKey TAG_TIER = new NamespacedKey("craftingblueprints", "tier");

    public static boolean isBlueprint(ItemStack item) {
        if (item == null || !item.hasItemMeta()) return false;
        return item.getItemMeta().getPersistentDataContainer().has(TAG_ROOT, PersistentDataType.STRING);
    }

    public static double getBlueprintPrice(ItemStack item) {
        PersistentDataContainer pdc = item.getItemMeta().getPersistentDataContainer();
        return pdc.getOrDefault(TAG_PRICE, PersistentDataType.DOUBLE, 0.0);
    }

    public static String getBlueprintTier(ItemStack item) {
        PersistentDataContainer pdc = item.getItemMeta().getPersistentDataContainer();
        return pdc.getOrDefault(TAG_TIER, PersistentDataType.STRING, "COMMON");
    }
}
```

#### Skript Integration Example:
```applescript
on rightclick holding paper:
    set {_pdc} to tag "craftingblueprints:craftingblueprints" of nbt of player's tool
    if {_pdc} is set:
        set {_tier} to tag "craftingblueprints:tier" of nbt of player's tool
        set {_price} to tag "craftingblueprints:price" of nbt of player's tool
        send "&6[Blueprint] &7Tier: &e%{_tier}% &7| Value: &a$%{_price}%" to player
```

---

## Dynamic Lore Variable Interpolation

CraftingBlueprints provides automatic, live string interpolation for blueprint lore templates. When generating items, the engine replaces `{key}` variables with their resolved values:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  dragon_slayer_blade:
    blueprint: "minecraft:diamond_sword"
    name: "<gradient:#FF0055:#FFAA00>Dragon Slayer Blade</gradient>"
    permanent: false
    uses: 5
    price: 8000.0
    sell_price: 2000.0
    extra:
      tier: "ANCIENT"
      required_level: 30
    lore:
      - "<gray>Target Recipe:</gray> <white>{blueprint_target}</white>"
      - "<gray>Craft Durability:</gray> <gold>{uses} uses remaining</gold>"
      - "<gray>Item Tier:</gray> <yellow>{tier}</yellow>"
      - "<gray>Required Level:</gray> <aqua>{required_level}</aqua>"
      - ""
      - "<yellow>Purchase Cost:</yellow> <green>${price}</green>"
      - "<yellow>Vendor Buyback:</yellow> <gold>${sell_price}</gold>"
```

### Supported Lore Variables

1. **System Metadata**:
   - `{id}`: Blueprint identifier (`dragon_slayer_blade`).
   - `{blueprint_target}` / `{target}`: Target recipe or item (`minecraft:diamond_sword`).
   - `{permanent}`: Localized permanence boolean (`true`/`false`).
   - `{time}`: Formatted duration string (e.g. `2d 12h`).
   - `{uses}`: Configured or remaining craft uses (`5`).
   - `{price}`: Formatted Vault purchase price.
   - `{sell_price}`: Formatted Vault buyback price.
2. **Arbitrary Extra Attributes**:
   - Any key declared under `extra:` resolves dynamically (case-insensitive), such as `{tier}`, `{required_level}`, or `{category}`.
3. **Safety Fallback**:
   - If an unconfigured placeholder `{unknown}` appears in the lore, the engine preserves the string without throwing exceptions or corrupting item lore.
