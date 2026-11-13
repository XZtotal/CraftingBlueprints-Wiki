# Pre-Built Presets (/cb preset)

New server administrators frequently encounter the "blank-page problem": having to manually write dozens of YAML blueprints, permission groups, and recipe restrictions before seeing how the plugin transforms gameplay.

CraftingBlueprints solves this with a modular **Preset Engine** (`/cb preset`) that allows you to preview, deploy, customize, and cleanly uninstall balanced, production-ready progression packs with a single command.

---

## What is a Preset Package?

A Preset is a self-contained archive (`.zip`) or directory placed inside `plugins/CraftingBlueprints/presets/` with a modular structure:

```text
plugins/CraftingBlueprints/presets/<preset_id>/
├── preset.yml             # Metadata manifest (id, name, author, version, description)
├── blueprints/            # Blueprint recipes (00_templates.yml, weapons.yml, armor.yml)
├── images/                # Visual map assets (backgrounds/, badges/, frames/)
└── config/                # Modular configuration files (groups.yml, restrictions.yml)
```

### The Inactive Repository vs Deployed Targets
* **Inactive Repository (`plugins/CraftingBlueprints/presets/`)**: You can store, download, and organize preset `.zip` bundles or folders here without triggering live server imports or altering your database.
* **Active Deployment Targets**: Presets only become active in-game when deployed via `/cb preset apply <id> --confirm`:
    * Blueprints deploy to: `plugins/CraftingBlueprints/blueprints/presets/<id>/...`
    * Images deploy to: `plugins/CraftingBlueprints/images/presets/<id>/...`
    * Configurations deploy to: `plugins/CraftingBlueprints/configs/presets/<id>/...`

---

## Built-In Modality Presets (`PresetCatalog`)

CraftingBlueprints ships with 4 built-in, production-balanced presets:

| Preset ID | Display Title | Templates | Blueprints Breakdown | Progression & Gameplay Model |
| :--- | :--- | :--- | :--- | :--- |
| `hardcore_smp` | Hardcore SMP Survival | `4` | `42` total (`36` singles, `4` packages, `2` mysteries) | `restricted-only`: Basic wood/stone free; iron unlocked via default group; Diamond, Netherite, Mending, and high-tier potions require blueprints with `forge` and `royal` map themes. |
| `rpg_tiers` | RPG Progression Tiers (T1–T5) | `5` | `34` total (`28` singles, `4` packages, `2` mysteries) | `restricted-only`: T1 apprentice through T5 mythic weapons, armors, runes, and class kits unlocking via tiered blueprints (`bracket` -> `rosette`). |
| `skyblock_coop` | Skyblock Co-op & Automation | `4` | `28` total (`22` singles, `4` packages, `2` mysteries) | `restricted-only`: Island basics and farming free; diamond/netherite tools, beacons, shulker boxes, and silk touch require blueprints. |
| `prison_ranks` | OP Prison Ranks & Pickaxes | `4` | `26` total (`22` singles, `2` packages, `2` mysteries) | `restricted-only`: Progressive ranks (`default` -> `rank_b` -> `rank_c` -> `rank_prestigious`) unlock tiered drills, efficiency, and fortune pickaxes. |

---

## Preset Command Interface

### 1. Listing Presets (`/cb preset list`)
Lists all built-in presets and local packages discovered in `presets/`:

```text
/cb preset list
```

---

### 2. Previewing & Applying Presets (`/cb preset apply`)

Before modifying your live server, execute a dry-run preview:

```text
/cb preset apply hardcore_smp --dry-run
```

The plugin analyzes the preset and displays the exact blueprint counts, target file paths, and collision checks without writing to disk or database.

To deploy the preset permanently, pass `--confirm`:

```text
/cb preset apply hardcore_smp --confirm
```

#### Dynamic Modifiers on Install:
You can scale prices, set usage limits, or isolate IDs during deployment:

```text
# Multiply all prices by 1.5 (+50% cost)
/cb preset apply rpg_tiers --price-mult=1.5 --confirm

# Alternatively, use price increase percentage:
/cb preset apply rpg_tiers --price-increase=+25% --confirm

# Force all blueprints to have a finite 5-use craft limit:
/cb preset apply hardcore_smp --uses=5 --confirm

# Scale existing time durations by 2x:
/cb preset apply hardcore_smp --time-scale=2.0 --confirm

# Isolate under a custom prefix folder (prevents ID collisions):
/cb preset apply rpg_tiers --prefix="season2" --confirm

# Filter to selectively import only swords and armor:
/cb preset apply hardcore_smp --filter=".*(sword|armor).*" --confirm
```

---

### 3. Clean Uninstallation (`/cb preset remove <id>`)

Administrators can completely uninstall an active preset without leaving leftover residues (*zero-leftovers*):

```text
/cb preset remove hardcore_smp
```

This command:
1. Safely deletes deployed folders across `blueprints/presets/hardcore_smp/`, `images/presets/hardcore_smp/`, and `configs/presets/hardcore_smp/`.
2. Clears image caches and reloads groups and recipe restrictions.
3. Automatically prunes the recipes from the database and broadcasts a sync signal to all worker nodes.

---

### 4. Exporting Custom Blueprints (`/cb preset export`)

To bundle existing blueprints into a shareable preset package:

```text
/cb preset export my_custom_pack --zip
```

Creates a distributable `my_custom_pack.zip` archive inside `plugins/CraftingBlueprints/presets/` containing your blueprint YAMLs, images, and config files.

---

## Zero `config.yml` Mutation Rule

Deploying or removing presets **NEVER modifies your `config.yml`**.

* **Why?** Directly appending or deleting lines from `config.yml` often corrupts custom comments, destroys formatting, and creates merge conflicts in Git.
* **The Solution**: Presets deploy modular configuration files to `configs/presets/<id>/groups.yml` and `configs/presets/<id>/restrictions.yml`. The plugin's engine aggregates these modular files in memory dynamically at runtime.

---

## Master / Worker Safety Guard

In multi-server MySQL networks:
* Preset modifications (`apply`, `remove`, `export`) are strictly restricted to the **Primary Management Node** (`sync-from-files: true`).
* Executing `/cb preset apply` on a Worker Node (`sync-from-files: false`) is blocked immediately with a clear localized error redirecting you to execute the command on the master server.
