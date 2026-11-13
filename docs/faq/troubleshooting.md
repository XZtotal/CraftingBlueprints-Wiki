# Troubleshooting Common Issues

This guide provides structured, step-by-step diagnostic workflows for resolving the most frequent operational challenges encountered by server administrators.

---

## 1. Issue: "Maps appear completely blank or show terrain"

If blueprint items given to players appear as blank gray maps or show vanilla terrain maps instead of custom schematics:

### Diagnostic Steps:
* **Verify Master Config**: Ensure `images-on-maps: true` is enabled in `plugins/CraftingBlueprints/config.yml`. If false, maps will not render custom graphics.
* **Verify Custom PNG Dimensions & Format**:
    * Custom background images must be placed in `plugins/CraftingBlueprints/images/backgrounds/`.
    * The image **must be exactly 128 x 128 pixels**.
    * The image must be in **32-bit RGBA PNG** format.
* **Verify Cross-Server Map Re-Linking**: On BungeeCord/Velocity networks, verify that the Primary Node has `sync-from-files: true` and all Worker Nodes have `sync-from-files: false`. When players switch servers, the plugin automatically re-links items to the local server's canonical Map ID upon inventory open.
* **Reload Map System**: Run `/cb reload all` to refresh the map buffer cache.

---

## 2. Issue: "Players can craft items without unlocking blueprints"

If players are able to craft recipes that you intended to lock:

### Diagnostic Steps:
* **Check for Operator Bypass (`op-bypass`)**: Are you testing with a player account that has `/op`? By default, `op-bypass: true` in `config.yml` allows operators to craft freely. Run `/deop <your_player_name>` or set `op-bypass: false` in `config.yml` and run `/cb reload config`.
* **Check your Restriction Mode**: In `config.yml`, verify `restrictions.mode: "restricted-only"`. Unlisted recipes are completely free for all players by default. Ensure your target item pattern (e.g. `diamond_.*`, `netherite_.*`, `beacon`) is explicitly listed under `restricted-items`.
* **Check Permission Group Grants**: Run `/lp user <player> permission check craftingblueprints.group.<id>` to verify the player has not inherited a permission group unlocking that category.

---

## 3. Issue: "YAML syntax errors or failed reloads"

If the server console reports an error when loading blueprint files:

### Diagnostic Steps:
* **Run Dry-Run Validation**: In console or in-game, execute `/cb validate`. The validator reports the exact file path, line number, and column.
* **Check Indentation**: YAML strictly prohibits tab characters. Always use standard spaces for indentation.
* **Atomic Fail-Safe Protection**: If a YAML file contains syntax errors, CraftingBlueprints triggers an **atomic abort**. Zero database records are modified, zero blueprints are pruned, and your live server continues running with the previous valid configuration until you fix the typo.

---

## 4. Issue: "Preset or Scaffolder rejected on Worker Node"

If executing `/cb preset apply` or `/cb generate` results in an error:
```text
[CraftingBlueprints] Command rejected: This server is configured as a Worker Node (sync-from-files: false).
```

### Cause & Solution:
To prevent database divergence and split-brain conflicts across multi-server MySQL networks, all file generation and preset deployments **must be executed on your designated Primary Management Node** (`sync-from-files: true`).
* Connect to your Hub or Lobby server and execute the command there.
* The master server will update the shared database and broadcast an atomic sync signal (`cb_sync_signals`) to all worker nodes automatically.

---

## 5. Issue: "Minecraft 1.21 Crafters continue auto-crafting locked recipes"

If automated redstone Crafter blocks are mass-producing restricted recipes:

### Diagnostic Checklist:
1. Open `plugins/CraftingBlueprints/config.yml`.
2. Verify that the Crafter interception block is configured:
   ```yaml
   crafter:
     block-restricted: true
     fail-effect: true
   ```
3. Run `/cb reload config`.
4. Ensure the item being produced matches your `restrictions.restricted-items` list.
