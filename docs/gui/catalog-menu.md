# Blueprint Catalog (/cb item list)

The blueprint catalog (`/cb item list`) provides an interactive, paginated encyclopedia of all blueprints available on the server.

---

## Opening the Catalog

To open the catalog in-game:

```text
/cb item list
```

**Permission Required**: `craftingblueprints.item.list` (Default: `true` for all players).

---

## Features & Navigation

* **Page Turn Feedback**: Intuitive previous/next page buttons with subtle page-turn sounds.
* **Status Badges**:
  * :white_check_mark: **Unlocked**: The player has already learned this recipe and can craft it.
  * :lock: **Locked**: The player has not yet unlocked this recipe.
  * :hourglass: **Expiring**: The recipe is currently unlocked with limited uses or time remaining.
* **Economy Purchase Integration**: If Vault is installed and the blueprint defines a `price:`, players can click to purchase and unlock the blueprint directly from the catalog.
* **Detailed Info View**: Left-clicking any blueprint opens an expanded recipe inspection card displaying the 3x3 ingredient matrix.

---

## Returning to Previous Menus (`/cb return`)

CraftingBlueprints remembers the player's navigation history in a memory stack:
* Clicking the back button in the catalog or typing `/cb return` brings the player back to their personal menu or previous page smoothly.
