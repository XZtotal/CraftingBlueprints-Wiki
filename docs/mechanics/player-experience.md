# Player Experience & Crafting Mechanics

This guide explores the complete in-game player journey: how players acquire blueprints, inspect technical drafting maps, right-click to memorize schematics, and interact with crafting tables and workstations under active restriction policies.

---

## 1. Blueprint Acquisition

Players encounter blueprints through multiple gameplay avenues:

* **In-Game Economy Catalog**: Purchasing blueprints for server currency via `/cb item list` or `/cb buy`.
* **Dungeon & World Loot**: Discovered inside Bastion Remnants, End Cities, Nether Fortresses, and Ancient Cities.
* **Crate & Quest Rewards**: Rewarded by quest plugins or loot crate keys.
* **Direct Administrative Grants**: Granted by server operators or automated scripts via `/cb give <player> <id> [amount]`.

!!! note "Item Ownership Protection"
    When `item-ownership: true` is enabled in `config.yml`, physical blueprint items are permanently bound to the UUID of the recipient. If an unauthorized player attempts to hold, trade, or right-click the blueprint, an ownership warning is displayed and the unlock is blocked.

---

## 2. Inspecting and Memorizing Schematics

When a player receives a blueprint map (`Material.FILLED_MAP`):

1. **Visual Drafting Inspection**: Holding the map in either hand renders a photorealistic 128x128 pixel drafting schematic featuring the workstation badge, the central item sprite, corner Guilloché rosettes, and remaining craft counts.
2. **Right-Click Memorization**: The player holds the blueprint in their main hand and **Right-Clicks**:
   * A clean chime sound effect plays (`Sound.ENTITY_PLAYER_LEVELUP` or configured sound).
   * Swirling enchanting particles appear at the player's eye level.
   * A localized chat notification confirms the unlock:
     ```text
     [CraftingBlueprints] You have unlocked the blueprint for Obsidian Blade Blueprint!
     ```
   * The physical map item is consumed from the player's hand (unless configured otherwise).
   * The recipe is registered permanently or temporally into the player's account database profile.

---

## 3. The Workbench & Crafting Experience

Once a blueprint is unlocked, the player approaches any standard 3x3 Crafting Table:

### Scenario A: The Blueprint is Unlocked
* Placing ingredients into the matrix immediately generates the crafted output item.
* The player can click to retrieve single items or **Shift-Click** to craft in bulk.
* If the blueprint has limited uses (e.g. 5 crafts), each crafted item decrements the counter in real time. When the counter reaches zero, the recipe locks automatically.

### Scenario B: The Recipe is Restricted & Locked
If the player arranges ingredients for a locked recipe without owning the blueprint:
* **Result Slot Preview**: Governed by `ux.prepare-preview` in `config.yml`:
  * `HIDE_RESULT`: The crafting table output slot remains completely empty.
  * `LOCKED_OVERLAY`: Keeps the output item icon, but appends red warning lore: `<red><bold>Recipe Locked</bold></red>`.
  * `CUSTOM_ITEM`: Renders a custom indicator (e.g. a red Barrier icon).
* **Click Interception**: If the player attempts to click the locked output slot:
  * The craft is instantly cancelled.
  * An informative message is sent to chat explaining which blueprint is missing:
    ```text
    [CraftingBlueprints] You must unlock the Ancient Netherite Battleaxe blueprint before crafting this item!
    ```
  * Ingredients remain completely safe inside the 3x3 grid without duplication, corruption, or loss.

---

## 4. Vanilla Recipe Book Integration

Under `ux.vanilla-recipe-book` in `config.yml`:

```yaml
ux:
  vanilla-recipe-book:
    sync-on-join: true
    sync-on-unlock-expire: true
    hide-locked-recipes: true
```

* **`sync-on-join: true`**: When players log into the server, the plugin synchronizes their unlocked blueprints with their client-side green vanilla Recipe Book.
* **`sync-on-unlock-expire: true`**: When a player unlocks a blueprint or an active timer expires, their Recipe Book updates instantly without requiring a re-log.
* **`hide-locked-recipes: true`**: Hides locked recipes from the client Recipe Book, ensuring players only see items they are authorized to craft.

---

## 5. Shift-Craft Safety & Capacity Math

A frequent vulnerability in Minecraft progression plugins is shift-crafting: players place 64 stacks of ingredients into the matrix, shift-click once, and produce 64 items while the plugin only deducts 1 use from their counter.

CraftingBlueprints prevents this exploit via an atomic **Capacity Math Engine** (`ShiftCraftMath.kt`):

$$\text{ActualCrafts} = \min\left( \text{MatrixCapacity}, \; \text{InventorySpaceCapacity}, \; \text{RemainingUses} \right)$$

1. **Matrix Capacity**: Determines how many items the ingredients can produce.
2. **Inventory Space Capacity**: Evaluates the player's open inventory slots and partial stacks to determine how many items can be received without dropping onto the ground.
3. **Usage Capacity**: Evaluates the remaining uses on the player's active blueprint.

### Real-World Example:
* A player with **2 remaining uses** on a Netherite Sword scroll places materials for 8 swords into the table and shift-clicks.
* The engine crafts **exactly 2 swords**.
* Exactly 2 uses are consumed, locking the blueprint.
* The remaining materials for 6 swords remain completely safe in the crafting matrix. Zero over-crafting is permitted.

---

## 6. Real-Time Recipe Inspection (`/cb info`)

Players can inspect any blueprint recipe directly in-game without opening web browsers:

```text
/cb info <blueprint_id>
```

This opens an interactive inspection menu displaying:
* The 3x3 crafting ingredient matrix or smithing ingredients.
* Active durability mode (Permanent, Countdown Timer, or Remaining Uses).
* Rarity tier, catalog purchase price, and item lore.
