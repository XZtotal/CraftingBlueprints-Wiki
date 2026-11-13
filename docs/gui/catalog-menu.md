# Blueprint Catalog & Item Management (/cb item list)

The blueprint catalog (`/cb item list`) provides an interactive, paginated overview of all blueprints registered in the server's database (`ItemDB`). It serves as both an encyclopedia of available recipes and an administrative management portal.

---

## Opening the Catalog

To open the catalog in-game:

```text
/cb item list
```

* **Command**: `/cb item list`
* **Permission Required**: `craftingblueprints.item.list`
* **Default Access**: `false` (Operators and staff members by default; can be assigned to players via LuckPerms).

---

## Interface Overview & Navigation

```text
┌─────────────────────────────────────────────────────────────┐
│                 Item List (Page 1 / 3)                      │
├─────────────────────────────────────────────────────────────┤
│  [Blade]   [Armor]   [Bow]    [Potion]   [Drill]   [Relic]  │
│ [⚡Archivo] [⚡Archivo]         [⚡Archivo]                  │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [◄ Previous]             [Page 1]              [Next ►]    │
└─────────────────────────────────────────────────────────────┘
```

### 1. Database-Windowed Pagination
* **Asynchronous Database Queries**: On networks with hundreds of blueprints, the interface queries database rows in chunks (45 items per page) on an asynchronous thread, ensuring zero main-thread tick lag.
* **Audio Feedback**: Navigating between pages triggers page-turn sound effects (`playPageTurnSound()`).

### 2. File-Managed Badges (`[⚡ Archivo]`)
Blueprints loaded directly from declarative YAML files in `blueprints/` display a prominent badge:

```text
[⚡ Archivo]
```

This badge signals that the blueprint's configuration is managed by source files on disk.

---

## Click Interactions

Clicking any blueprint in the catalog triggers distinct actions based on the mouse button and player permissions:

### Left-Click: In-Game Editor or Immutability Warning
* **File-Managed Blueprints (`isFileManaged: true`)**:
    * If an operator or staff member left-clicks a file-managed blueprint, the plugin blocks the action and displays a localized warning (`warning.item.file_managed_immutable`).
    * The interface instructs the administrator to edit the corresponding `.yml` file in `plugins/CraftingBlueprints/blueprints/` directly on disk, preserving version control and Git tracking.
* **Database / In-Game Blueprints (`isFileManaged: false`)**:
    * If the player possesses `craftingblueprints.item.edit` (or operator status), left-clicking opens the live modifier GUI (`SingleModifyMenu`, `PackageModifierMenu`, or `MysteryModifierMenu`).
    * Without this permission, the player receives a permission denial warning (`warning.command.no_permission`).

### Right-Click: Technical Status Inspection (`SingleInfoMenu`)
Right-clicking any blueprint opens its technical inspection card:

* **Item Representation (Center Slot)**: Displays the blueprint's material, custom model data, name, and lore.
* **Permanence Indicator**:
    * **Emerald Block**: The blueprint grants permanent recipe access (`permanent: true`).
    * **Redstone Block**: The blueprint has limited durability or temporal validity (`permanent: false`).
* **Craft Usage Allowance**: An anvil icon displaying allowed craft uses (`uses: <amount>`).
* **Duration License**: A clock icon displaying the temporal duration (`time: <duration>`).
* **Back Button**: Returns directly to the previous catalog page.

---

## Architectural Note: Chat-Based Economy Purchases

In CraftingBlueprints, economy transactions are decoupled from inventory menus:

* **Why No In-GUI Purchasing?** Executing financial withdrawals and item grants inside clickable menus is vulnerable to client-side inventory desync, auto-clicker macros, and race conditions.
* **How Players Purchase Blueprints**: Players purchase blueprints safely via chat commands:
  ```text
  # Direct unlock to player profile
  /cb buy <blueprint_id>

  # Or receive as a physical item
  /cb buy <blueprint_id> --item
  ```
* Review the [Vault Economy Guide](../tutorials/tutorial-vault-shop.md) for full configuration instructions.

---

## The Return Navigation Stack (`/cb return`)

CraftingBlueprints maintains an in-memory navigation stack for each active player session:

* **Breadcrumb Navigation**: If an administrator navigates from `/cb item list` into an item modifier menu or inspection card, clicking the barrier/back button or running `/cb return` pops the stack and restores the catalog at the exact page.
* **ESC Exit Context**: If closed with ESC, running `/cb return` re-opens the last active menu.
