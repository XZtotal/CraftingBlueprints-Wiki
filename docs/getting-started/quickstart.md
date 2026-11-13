# Quickstart: Your First Blueprint in 3 Minutes

This hands-on walkthrough guides you through creating, testing, granting, and crafting your very first custom blueprint on a live server.

---

## 1. Create a Test Blueprint File

Navigate to your server directory and create a new YAML file named `obsidian_blade.yml` inside the `blueprints/` directory:

```text
plugins/CraftingBlueprints/blueprints/obsidian_blade.yml
```

Paste the following production-ready configuration:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  obsidian_blade:
    # 1. Target Minecraft recipe to unlock
    blueprint: DIAMOND_SWORD
    name: "<gradient:#9900EE:#FF0055><bold>Obsidian Blade Blueprint</bold></gradient>"

    # 2. Durability & Limits (permanent = unlocked forever)
    permanent: true
    time: 0
    uses: 0

    # 3. Economy Pricing (Requires Vault)
    price: 5000.0
    sell_price: 1250.0

    # 4. In-Game Physical Item Representation
    item:
      material: FILLED_MAP
      glowing: true

    # 5. Visual Map Drafting Aesthetic
    map:
      theme: forge              # Volcanic basalt & ember background
      frame: rosette            # Regal gilded corner rosettes
      badge: smithing           # Workstation icon on top-left
      icon_scale: 2             # Sharp 2x pixel-art scaling
      drop_shadow: true         # Soft ambient item shadow

    # 6. MiniMessage Lore Description
    lore:
      - "<gray>Target Equipment:</gray> <white>{blueprint_name}</white>"
      - "<gray>Status:</gray> <green>Permanent Unlock</green>"
      - ""
      - "<yellow>Shop Value:</yellow> <gold>${price}</gold>"
      - ""
      - "<dark_gray>Hold this map and Right-Click to memorize the schematic.</dark_gray>"
```

---

## 2. Dry-Run Syntax Validation (`/cb validate`)

Before reloading your live server, execute the dry-run validator command in your server console or in-game:

```text
/cb validate
```

CraftingBlueprints parses all YAML files in `blueprints/` and verifies:
* All Bukkit materials and recipe identifiers are valid on your server version.
* Map themes, frames, and badge identifiers conform to the visual rendering engine.
* YAML indentation and structure are completely error-free.

If everything is valid, the console displays:
```text
[CraftingBlueprints] Validation passed: 1 blueprint file verified with 0 errors and 0 warnings.
```

---

## 3. Hot-Reload the Blueprints

Apply your new file to the live server with zero downtime and zero lag:

```text
/cb reload blueprints
```

You will see immediate console confirmation that `obsidian_blade.yml` was parsed, synchronized to the database, and registered in runtime memory.

!!! tip "Automatic File Watcher"
    If `file-management.auto-reload.enabled: true` is active in `config.yml`, you do not even need to type `/cb reload blueprints`. The plugin detects file saves on disk and hot-reloads automatically after a short 1.5-second debounce window.

---

## 4. Grant the Blueprint Item to Yourself

Give yourself the blueprint using the `/cb give` command:

```text
/cb give <your_player_name> obsidian_blade 1
```

Look at your hotbar. You will receive a high-resolution in-game map (`Material.FILLED_MAP`) rendering the volcanic Dwarven Forge theme, the central Diamond Sword sprite, the Smithing Table workstation badge, and the Guilloche corner rosettes.

!!! note "Overflow Safety Guarantee"
    If your inventory happens to be completely full when running `/cb give`, CraftingBlueprints automatically drops the leftover items safely onto the ground directly at your feet, preventing silent item deletion.

---

## 5. Unlock and Craft in Survival

1. **Memorize the Blueprint**: Place the map in your main hand and **Right-Click**. A sound effect plays and chat confirms:
   ```text
   [CraftingBlueprints] You have unlocked the blueprint for Obsidian Blade Blueprint!
   ```
   The physical map is consumed from your hand.
2. **Open a Crafting Table**: Place two diamonds and a stick into the 3x3 crafting matrix. The Diamond Sword appears in the result slot and crafts normally.
3. **Test Whitelist Protection**:
   * Open `plugins/CraftingBlueprints/config.yml` and ensure `restrictions.mode: "restricted-only"` with `diamond_.*` included in `restricted-items`.
   * Either temporarily deop yourself (`/deop <your_name>`) or set `op-bypass: false` in `config.yml`.
   * Have an unauthorized player (or test account) place the same ingredients into the crafting table: the recipe will be locked, and the player will be notified that they lack the required blueprint!

---

## Next Steps & Deep Exploration

* [Examine the Line-by-Line Configuration Guide](../configuration/config-guide.md)
* [Learn Full YAML Blueprint Properties & Fields](../blueprints/basic-blueprint-yaml.md)
* [Create Limited-Use Scrolls (e.g., 3 crafts or 24 hours)](../blueprints/durability-and-uses.md)
* [Configure Whitelist Mode for SMP Servers](../mechanics/recipe-restrictions.md)
