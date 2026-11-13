# Server Blueprint Catalog (/cb item list)

The server blueprint catalog (`/cb item list`) provides players with an interactive, paginated encyclopedia of every crafting blueprint available on the server.

---

## Opening the Catalog

To open the catalog in-game:

```text
/cb item list
```

**Permission Required**: `craftingblueprints.item.list` (Granted to all players by default).

---

## Features & Navigation

```
┌─────────────────────────────────────────────────────────────┐
│               Blueprint Catalog (Page 1 / 3)                │
├─────────────────────────────────────────────────────────────┤
│  [Blade]   [Armor]   [Bow]    [Potion]   [Drill]   [Relic]  │
│    ✅        🔒        🔒        ⏳        🔒        ✅     │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [◄ Previous]             [Page 1]              [Next ►]    │
└─────────────────────────────────────────────────────────────┘
```

### 1. Paginated Windowing & Audio Feedback
* **Smooth Pagination**: Clicking the navigation arrows shifts through pages seamlessly with page-turn audio feedback (`playPageTurnSound()`).
* **Database-Windowed Pagination**: On networks with hundreds of blueprints, the catalog queries database pages incrementally without loading unneeded items into memory, ensuring zero tick drops.

### 2. Status Indicators & Badges
Each blueprint item displayed in the catalog shows an intuitive status indicator:

* :white_check_mark: **Unlocked**: The player has learned this recipe and can craft it freely.
* :lock: **Locked**: The player has not yet unlocked this recipe. Hovering displays the purchase price or acquisition hint.
* :hourglass: **Expiring**: The recipe is currently active with limited uses or a countdown timer.
* `[⚡ Archivo]` **File-Managed**: Displayed for server administrators indicating the blueprint is declared in YAML files on disk.

### 3. One-Click Vault Economy Purchase
If Vault is installed and the blueprint declares a `price:` field:
* The item lore displays: `<yellow>Catalog Price:</yellow> <green>${price}</green>`.
* **Left-Clicking** a locked blueprint prompts a purchase confirmation dialogue.
* If the player has sufficient balance:
  1. Vault deducts the cost from the player's account.
  2. The blueprint is unlocked immediately.
  3. A celebration sound plays, and the status icon transitions from :lock: to :white_check_mark:.

### 4. Interactive 3x3 Recipe Inspector
* **Right-Clicking** any blueprint in the catalog opens an expanded inspection card:
  * Renders the exact 3x3 crafting matrix, smithing template arrangement, or brewing stand ingredients.
  * Displays required materials, output item yields, and lore descriptions.

---

## The Return Navigation Stack (`/cb return`)

CraftingBlueprints maintains an in-memory LIFO (Last-In, First-Out) navigation stack per player session via `MenuSessionManager`:

* When a player navigates from the personal dashboard (`/cb menu`) into the catalog (`/cb item list`), and then into a detailed recipe inspection view:
  * Clicking the **Back** button or typing `/cb return` pops the last menu and re-opens the catalog on the exact page they were browsing.
  * Typing `/cb return` again returns them to their personal dashboard.
* **ESC Exit Context Preservation**: If a player accidentally closes a menu by pressing the ESC key, `lastClosedMenu` remembers their active context. Running `/cb return` instantly restores the interface right where they left off.
