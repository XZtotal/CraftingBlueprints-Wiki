# In-Game Blueprint Editor (/cb item edit)

CraftingBlueprints allows server administrators to inspect and modify blueprint settings visually from inside the game without accessing server files or rebooting the instance.

---

## Opening the Visual Editor

To open the interactive editor for a specific blueprint:

```text
/cb item edit <blueprint_id>
```

**Permission Required**: `craftingblueprints.item.edit` (Default: `op`).

---

## File-Managed Immutability (`[⚡ Archivo]`)

To prevent accidental configuration desynchronization on servers using Git workflows and declarative YAML files:

* **File-Managed Blueprints (`is_file_managed: true`)**:
    * Blueprints loaded from `.yml` files in `blueprints/` display a prominent `[⚡ Archivo]` badge in the interface.
    * These blueprints are **read-only and immutable** from in-game commands and menus.
    * If an operator attempts to modify a file-managed blueprint in-game, the interface notifies them to edit the source `.yml` file directly on disk, preserving Git version control integrity.

* **In-Game Manual Blueprints (`is_file_managed: false`)**:
    * Blueprints created in-game via commands or modifier menus are fully editable.
    * All adjustments are persisted directly to the database and automatically exported to `exports/manual_blueprints.yml`.

---

## Visual Modifier Panels

The in-game editor provides dedicated modifier panels:

```
┌─────────────────────────────────────────────────────────────┐
│                 Edit Blueprint: excalibur                   │
├─────────────────────────────────────────────────────────────┤
│   [Name & Lore]       [Economy & Price]     [Durability]    │
│    MiniMessage         Buy: $15k / Sell      Permanent / Uses│
│                                                             │
│   [Physical Item]     [Map Aesthetics]      [Save & Apply]  │
│    FILLED_MAP / Model  Theme & Frame         Commit to DB   │
└─────────────────────────────────────────────────────────────┘
```

### 1. Name & MiniMessage Lore Editor
* Prompts the administrator in chat to enter new display names or lore lines.
* Full support for MiniMessage gradient tags (`<gradient:#HEX1:#HEX2>`) and context placeholders (`{player}`, `{uses}`, `{time}`, `{price}`).

### 2. Economy & Pricing Controls
* Adjust purchase cost (`price`) and sell refund value (`sell_price`) using intuitive `+100`, `+1000`, `-100`, `-1000` incremental adjustment buttons.

### 3. Durability & Usage Switcher
* Switch between **Permanent Mode**, **Craft-Limited Mode** (setting finite craft counts), and **Time-Limited Mode** (setting countdown timer durations).

### 4. Physical Material & Model Data
* Switch the physical blueprint item between `Material.FILLED_MAP`, `PAPER`, `BOOK`, `NETHER_STAR`, or custom Bukkit items.
* Configure `CustomModelData` integers to bind custom 3D resource pack models.

### 5. Map Aesthetics & Background Selector
* Visually browse and select from the 25 built-in background textures (`dwarven_magma`, `celestial_astral`, `imperial_gold`, `carbon_weave`, `technical_slate`).
* Select corner geometry styles: `bracket`, `chamfer`, `diamond`, `runic`, `rosette`, `star`, or `none`.

---

## Package & Mystery Modifier Menus

For multi-recipe packages (`PackageModifierMenu`) and mystery roll crates (`MysteryModifierMenu`):

* **Anti-Duplicate Invariant**: When adding blueprints from the operator's bottom inventory into a package or mystery container, the system verifies that no item with the identical blueprint ID is already present. Duplicate additions are rejected with error audio feedback.
* **Weight Configuration (`MysteryElementModifierMenu`)**: Operators can click on any reward in a mystery crate to adjust its relative probability weight (`weight: 1..100`). The interface automatically displays the percentage roll probability in real time.
* **Type Safety Guard**: Mystery blueprints cannot be nested inside other mystery blueprints, preventing infinite roll recursion and serialization corruption.

---

## Automatic Exporter & Rolling Backups

Whenever in-game blueprints are saved:

1. The updated definition is persisted to the database.
2. The export engine automatically dumps all in-game blueprints into:
   ```text
   plugins/CraftingBlueprints/exports/manual_blueprints.yml
   ```

3. Periodic rolling backups are created automatically in:
   ```text
   plugins/CraftingBlueprints/exports/backups/manual_blueprints_<timestamp>.yml
   ```

4. If you later declare the same blueprint ID in a file inside `blueprints/`, the plugin adopts the YAML definition, sets `is_file_managed: true`, and removes it from the manual export dump.
