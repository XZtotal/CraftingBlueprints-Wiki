# Player Journey & Crafting Mechanics

This page details how players discover, learn, and craft using blueprints in-game, as well as the safety checks enforced by CraftingBlueprints.

---

## 1. Acquiring a Blueprint

Players can obtain blueprints through multiple gameplay avenues:

* **Admin Grant**: Direct commands from administrators or console (`/cb give <player> <blueprint> [amount]`).
* **Loot & Chests**: Dropped from dungeon chests, mob bosses, or Bastion remnants.
* **Crates & Quests**: Rewarded via quest plugins (Quests, BetonQuest) or crate plugins (CrazyCrates, ExcellentCrates).
* **Server Catalog / Shop**: Purchased in-game using Vault currency via `/cb item list`.

---

## 2. Inspecting and Learning

When a player receives a blueprint:

1. **Visual Inspection**: If configured as a map (`item.material: FILLED_MAP`), the player can hold it to view the full schematic, rarity tier, and required ingredients.
2. **Learning the Recipe**: The player holds the blueprint item in their main hand and **right-clicks**.
3. **Consumption & Unlock**: The item is consumed (unless configured otherwise), and the recipe is permanently or temporally registered to the player's account.

---

## 3. The Crafting Experience

When the player places materials into a crafting table:

### If the Blueprint is Unlocked:
* The crafting table displays the result item normally.
* The player can craft single items or use **Shift-Click** to craft entire stacks.
* If the blueprint has limited uses (e.g., 3 uses), the remaining uses count down after each successful craft.

### If the Recipe is Restricted & Not Unlocked:
* The craft is blocked.
* The player receives an immediate, informative chat message explaining that they need the corresponding blueprint.
* Ingredients remain safely inside the crafting matrix without duplication or loss.

---

## 4. Shift-Craft Safety

In standard Minecraft plugins, shift-clicking a recipe can cause desynchronizations or exploit limited-use counters.

CraftingBlueprints calculates the player's available inventory space and ingredient counts before crafting:
* If the player crafts a batch of 4 items with a 5-use blueprint, exactly 4 uses are consumed, leaving 1 use remaining.
* If the player's inventory lacks space for the full stack, the craft limits itself to what can fit safely, preventing item loss.
