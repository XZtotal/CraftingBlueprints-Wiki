# Command Reference

All CraftingBlueprints commands originate from the master `/cb` command (alias: `/craftingblueprints`).

---

## Master Command Reference Table

| Command Syntax | Arguments & Parameters | Required Permission | Allowed Senders | Operational Description |
| :--- | :--- | :--- | :--- | :--- |
| `/cb menu` | None | `craftingblueprints.menu` | Players | Opens your personal blueprint progression dashboard. |
| `/cb return` | None | `craftingblueprints.return` | Players | Re-opens the previous menu in the navigation history stack. |
| `/cb item list` | None | `craftingblueprints.item.list` | Players | Opens the paginated server blueprint catalog and economy shop. |
| `/cb item edit` | `<blueprint_id>` | `craftingblueprints.item.edit` | Operators | Opens the visual in-game GUI modifier for a blueprint. |
| `/cb info` | `[blueprint_id]` | `craftingblueprints.info` | Players / Console | Opens the detailed 3x3 recipe inspector and durability stats. |
| `/cb give` | `<player> <id> [amount]` | `craftingblueprints.give` | Operators / Console | Gives physical blueprint items to a player with overflow protection. |
| `/cb reload` | `[all\|blueprints\|config\|lang]` | `craftingblueprints.reload` | Operators / Console | Hot-reloads configuration files, language strings, or YAML blueprints. |
| `/cb validate` | None | `craftingblueprints.admin` | Operators / Console | Executes a dry-run linting pass over all blueprint files in `blueprints/`. |
| `/cb status` | None | `craftingblueprints.status` | Operators / Console | Displays system diagnostics, database latency, and health metrics. |
| `/cb preset` | `<list\|apply\|remove\|export\|download>` | `craftingblueprints.admin.preset`| Operators / Console | Manages pre-built modality packs in the `presets/` repository. |
| `/cb generate` | `<source> [flags]` | `craftingblueprints.admin.generate`| Operators / Console | Scans Bukkit recipes or plugins and auto-scaffolds YAML blueprints. |

---

## Detailed Command Explanations & Operational Safety

### `/cb give <player> <blueprint_id> [amount]`
Grants physical blueprint items directly to a target player:
* **Quantity Bounds**: The `amount` parameter strictly requires a positive integer between `1` and `2304` (the maximum physical capacity of a player inventory: $36 \text{ slots} \times 64 \text{ items}$). Negative numbers, `0`, non-numeric strings, or exorbitant numbers are rejected immediately with localized error feedback.
* **Physical Overflow Safety**: When giving items to a player whose inventory is full, CraftingBlueprints uses an atomic safe-drop protocol. Instead of dropping items into the void or deleting them, leftover items are dropped safely into the world directly at the player's location (`world.dropItem(...)`).

```text
# Give Steve 1 Ancient Netherite Battleaxe blueprint
/cb give Steve ancient_netherite_axe 1

# Give Alex 5 3-use magic scrolls via console
/cb give Alex astral_blade_scroll 5
```

---

### `/cb reload [all|blueprints|config|lang]`
Hot-reloads plugin subsystems instantly on live servers without disconnects or lag spikes:

* `/cb reload all`: Full reload of `config.yml`, language files, and declarative YAML blueprints.
* `/cb reload blueprints`: Re-reads and recompiles all files in `blueprints/`, updates the shared database, and emits a network sync signal to worker nodes.
* `/cb reload config`: Reloads `config.yml` (groups, restrictions, crafter rules, cache).
* `/cb reload lang`: Hot-reloads `messages_en.yml` and `messages_es.yml` translations.

---

### `/cb validate`
Executes an offline dry-run verification across all blueprint files in `blueprints/`:
* **Zero Database Modifications**: Performs no database inserts, updates, or prunings.
* **Semantic Verification**: Verifies that every Bukkit `Material`, `PotionType`, and `Enchantment` exists on the current server version.
* **Visual Key Linting**: Recursively validates `map:` blocks against valid themes, frames, and badges.
* **Levenshtein Suggestions**: Automatically emits helpful "Did you mean?" suggestions for minor typos (e.g. `roseta` $\rightarrow$ `rosette`).
* **Line-Number Error Context**: In the event of a syntax error, reports the exact file path, line number, column, and error description.

---

### `/cb status`
Displays comprehensive system diagnostics:

```text
[CraftingBlueprints] ========== System Status ==========
[CraftingBlueprints] Version: 4.1.0 | Engine: Paper 1.20.4
[CraftingBlueprints] Active Adapter: Adapter_v1_20_R3 (VAL Native)
[CraftingBlueprints] Storage Backend: MySQL (HikariCP Active)
[CraftingBlueprints] Database Latency: 1.42 ms | Pool: 10 total (8 idle, 2 active)
[CraftingBlueprints] Blueprints Registered: 42 (36 singles, 4 packages, 2 mysteries)
[CraftingBlueprints] Node Role: Primary Master Node (sync-from-files: true)
[CraftingBlueprints] Active Cached Profiles: 14 / 500 max
[CraftingBlueprints] Pre-Quantized Map Buffers: 42 / 500 cached (~672 KB)
[CraftingBlueprints] ======================================
```
