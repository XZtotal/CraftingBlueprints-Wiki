# Pre-Built Presets (/cb preset)

CraftingBlueprints includes a modular **Preset Engine** that allows you to download, test, and install pre-configured blueprint packs with a single command.

---

## What is a Preset?

A Preset is a self-contained archive or folder located inside `plugins/CraftingBlueprints/presets/` containing:
* Blueprint YAML definitions.
* Custom templates and lore styles.
* Associated map background textures.
* Optional recipe restriction rules.

Presets allow server owners to add entire themed progression lines (such as an MMORPG Weapons Pack or an Industrial Tools Pack) without writing YAML files from scratch.

---

## Preset Commands

### 1. Listing Available Presets
To see all preset packages located in your `presets/` folder:

```text
/cb preset list
```

### 2. Applying / Installing a Preset
To deploy a preset pack to your live server:

```text
/cb preset apply <preset_name>
```

#### Modifying Settings on Install
You can adjust prices, uses, or prefixes dynamically when deploying a preset:

```text
# Multiply all prices in the pack by 1.5 (+50% cost)
/cb preset apply rpg_weapons --price-mult=1.5

# Force all blueprints in the pack to have a 5-use limit
/cb preset apply battle_axes --uses=5

# Add a prefix to all blueprint IDs in the pack
/cb preset apply medieval_pack --prefix="smp_"
```

### 3. Removing a Preset
To cleanly uninstall a deployed preset pack and remove its blueprints:

```text
/cb preset remove <preset_name>
```

### 4. Exporting Your Custom Blueprints as a Preset
If you created blueprints in-game or authored custom files that you want to share with other servers:

```text
/cb preset export <new_pack_name>
```
The plugin bundles the blueprints and creates a distributable package inside `plugins/CraftingBlueprints/presets/`.
