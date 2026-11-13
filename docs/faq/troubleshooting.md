# Troubleshooting Common Issues

This guide provides structured, step-by-step diagnostic workflows for resolving the most frequent operational challenges encountered by server administrators.

---

## 1. Issue: "Maps appear completely blank or show terrain"

If blueprint items given to players appear as blank gray maps or show vanilla terrain maps instead of custom schematics:

### Diagnostic Checklist:
1. **Verify Master Config**:
   Open `plugins/CraftingBlueprints/config.yml` and verify:
   ```yaml
   images-on-maps: true
   ```
   If set to `false`, maps will not render custom graphics.
2. **Verify Custom PNG Dimensions & Format**:
   If using custom images:
   * The file must reside in `plugins/CraftingBlueprints/images/backgrounds/`.
   * The image **must be exactly 128 x 128 pixels**. Any other dimensions will fail to load or be rejected.
   * The file must be **32-bit RGBA PNG** format. Progressive JPEGs, animated GIFs, and WebP formats are not supported.
3. **Verify Cross-Server Map Re-Linking**:
   If this occurs when players transfer from another server on a BungeeCord/Velocity network:
   * Verify that the Primary Node has `sync-from-files: true` and all Worker Nodes have `sync-from-files: false`.
   * Ensure that all sub-servers are connected to the exact same MySQL database.
   * CraftingBlueprints' `MapRelinkListener` will automatically intercept the item and bind it to the local server's canonical Map ID in-place upon inventory open.
4. **Reload Map System**:
   Execute:
   ```text
   /cb reload all
   ```

---

## 2. Issue: "Players can craft items without unlocking blueprints"

If players are able to craft recipes that you intended to lock:

### Diagnostic Checklist:
1. **Check for Operator Bypass (`op-bypass`)**:
   Are you testing with a player account that has `/op` status?
   By default, `op-bypass: true` in `config.yml` allows all server operators to craft, brew, and enchant restricted recipes freely.
   * **Fix**: Temporarily deop your account: `/deop <your_player_name>` or set `op-bypass: false` in `config.yml` and run `/cb reload config`.
2. **Check your Restriction Mode**:
   In `plugins/CraftingBlueprints/config.yml`:
   * If `restrictions.mode: "restricted-only"`, recipes are **only locked if they match an entry in `restricted-items`**. Unlisted recipes are completely free for all players by default!
   * Verify that your target item pattern (e.g. `diamond_.*`, `netherite_.*`, `beacon`) is explicitly listed under `restricted-items`.
3. **Check Permission Group Grants**:
   Run `/lp user <player> permission check craftingblueprints.group.<id>` to ensure the player has not been granted a permission group that already unlocks that recipe category.

---

## 3. Issue: "YAML syntax errors or failed reloads"

If the server console reports an error when loading blueprint files:

### Diagnostic Checklist:
1. **Run Dry-Run Validation**:
   In console or in-game, execute:
   ```text
   /cb validate
   ```
2. **Review the Diagnostic Output**:
   The validator reports:
   * The exact file path and line number of the error.
   * Indentation errors (remember: YAML strictly prohibits tab characters; always use standard spaces).
   * Typo suggestions via Levenshtein distance (e.g. `roseta` $\rightarrow$ `rosette`).
3. **Rest Assured with Atomic Fail-Safe**:
   If a YAML file has a syntax error, CraftingBlueprints triggers an **atomic abort**. Zero database records are modified, zero blueprints are pruned, and your live server continues running with the previous valid configuration until you fix the typo!

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
