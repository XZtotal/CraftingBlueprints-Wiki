# Frequently Asked Questions & Support

This guide compiles the top 15 questions asked by server administrators and network operators, followed by official guidelines for reporting bugs and generating diagnostic support bundles.

---

## Top 15 Administrator Frequently Asked Questions

### Section 1: Performance & Scale

#### 1. Does CraftingBlueprints impact server tick rates (TPS) during heavy crafting?
**No.** CraftingBlueprints uses an event-driven, in-memory caching architecture. All recipe lookups, permission checks, and candidate resolutions evaluate in $\mathcal{O}(1)$ time on RAM. Database operations (SQLite/MySQL) execute completely asynchronously on background worker threads, never blocking the primary server tick thread.

#### 2. How many active blueprints can a single server support?
CraftingBlueprints is engineered for high scale. Production networks successfully run thousands of active blueprints simultaneously. The internal `ItemMatcherRegistry` uses pre-compiled regular expressions and indexed hash maps to ensure that evaluation overhead remains near zero regardless of catalog size.

#### 3. Will PlaceholderAPI evaluations cause scoreboard lag?
**No.** The PlaceholderAPI expansion reads directly from in-memory caches. For offline players or uncached blueprints, the engine returns fallback values immediately and queues an asynchronous background fetch into an isolated volatile cache (`ReadOnlyPlaceholderCache`). Database queries on the main thread are strictly blocked by default. See [Economy & Placeholders](integrations-papi-pdc.md).

---

### Section 2: Vault Economy & Shops

#### 4. Why is there no built-in `/cb shop` GUI?
To give server administrators 100% aesthetic and layout freedom. Rather than forcing a rigid, hardcoded GUI layout, CraftingBlueprints provides command-driven endpoints (`/cb buy <id> [--item]` and `/cb sell`) alongside PlaceholderAPI identifiers. This allows operators to seamlessly embed blueprint purchases into existing menu plugins like **DeluxeMenus**, **TrMenu**, or **ShopGUI+**.

#### 5. What is the difference between `/cb buy <id>` and `/cb buy <id> --item`?

- **`/cb buy <id>` (Direct Unlock)**: Deducts Vault funds and immediately unlocks the recipe knowledge in the player's account. No inventory space is required.
- **`/cb buy <id> --item` (Physical Voucher)**: Deducts Vault funds and delivers a physical, tradeable blueprint item (paper, scroll, or map) to the player's inventory. The player can trade it, sell it in an auction house, or right-click to study it later.

#### 6. Can players sell blueprints back to the server?
**Yes.** When a blueprint declares `sell_price: <amount>` in YAML, players holding the physical blueprint item can execute `/cb sell` to liquidate it for Vault currency.

---

### Section 3: Recipe Restrictions & Gating

#### 7. How does CraftingBlueprints handle shift-crafting?
When a player shift-clicks a restricted recipe, CraftingBlueprints calculates the maximum craftable quantity based on available matrix ingredients, remaining player uses (for finite blueprints), and available inventory space. The engine crafts the exact maximum permitted amount and deducts corresponding charges atomically, preventing item loss and duplication.

#### 8. Does CraftingBlueprints modify the Vanilla Recipe Book?
**Yes.** CraftingBlueprints features automatic Recipe Book synchronization. When a player unlocks a blueprint, the corresponding recipe is dynamically added to their vanilla recipe book. If a temporal blueprint expires or runs out of charges, the recipe is immediately removed.

#### 9. Why can my server operators craft restricted recipes without blueprints?
By default, operators inherit the wildcard permission `*`, which grants `craftingblueprints.admin.bypass`. To enforce authentic progression testing for staff, set `op-bypass: false` in `config.yml`. See [Troubleshooting Runbooks](troubleshooting-runbook.md).

---

### Section 4: Multi-Version Paper & Station Mechanics

#### 10. Which Minecraft server versions are supported?
CraftingBlueprints officially supports **Paper, Purpur, and compatible forks** from Minecraft **1.18.2 up to 1.21.x** (and upcoming releases). Multi-version compatibility adapters dynamically handle changes to potion data models, recipe APIs, and sound registries.

#### 11. Is the Minecraft 1.21 Crafter block supported?
**Yes.** CraftingBlueprints natively intercepts redstone-triggered auto-crafting from the 1.21 Crafter block (`CrafterCraftEvent`). When an automated craft fails due to recipe gating, the Crafter plays redstone fail particles and click sounds, preventing automated progression bypasses.

#### 12. Are custom items from ItemsAdder, Nexo, and Oraxen supported?
**Yes.** CraftingBlueprints includes a native `ItemIdentifierProvider` SPI that resolves custom items via exact plugin hooks (`ia:`, `nexo:`, `oraxen:`). This ensures custom items can be gated without colliding with base vanilla materials (e.g. custom ruby swords vs vanilla diamond swords). See [Custom Items Tutorial](tutorials/custom-gear.md).

---

### Section 5: Multi-Server Clusters & MySQL

#### 13. What is the difference between a Master node and a Worker node?

- **Master Node (`is-master: true`)**: The authoritative administrative server (typically the Hub or staging server). Compiles YAML blueprints into the shared database, deploys presets, and manages cluster file synchronization.
- **Worker Node (`is-master: false`)**: Read-only mirror servers (Survival, Skyblock, Minigames). Workers automatically mirror compiled recipes, configuration fragments, and map graphics from the database via heartbeat signals.

#### 14. Do I need an NFS shared drive to run multi-server clusters?
**No.** CraftingBlueprints includes a built-in **Cluster File Distribution Bus** (`cb_cluster_files`). All blueprint YAML files, modular configurations, and custom map PNG textures are synchronized across servers directly through the shared MySQL database with zero NFS or rsync dependencies. See [Network Cluster Tutorial](tutorials/network-cluster.md).

#### 15. What happens if MySQL connection drops temporarily?
CraftingBlueprints maintains an in-memory runtime cache for all active blueprints and online players. If MySQL becomes temporarily unreachable, active gameplay and crafting operations continue uninterrupted from cache. HikariCP handles automatic background reconnection.

---

## Technical Support & Bug Reporting Guidelines

If you encounter unexpected behavior or suspect a bug, our development team is ready to investigate. To ensure swift resolution, please follow these reporting guidelines.

### Official Issue Tracker
Submit all bug reports, documentation corrections, and feature proposals to our official GitHub repository:

- **Repository**: [`XZtotal/CraftingBlueprints-Wiki`](https://github.com/XZtotal/CraftingBlueprints-Wiki)
- **Tracker**: [GitHub Issues](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues)

---

### Pre-Submission Checklist

Before opening an issue, please verify:

1. **Latest Build**: Confirm you are running the latest release of CraftingBlueprints.
2. **Schema Validation**: Run `/cb validate` in-game to ensure the issue is not caused by a YAML syntax error.
3. **Existing Issues**: Search open and closed issues on GitHub to see if your issue has already been addressed.
4. **Isolate Conflicts**: Test if the issue reproduces without conflicting third-party menu or recipe plugins.

---

### Mandatory Diagnostic Bundle Collection

When submitting an issue, attach the following **four essential diagnostic components**:

#### 1. System Status Output
Execute the status command from the server console and paste the output:
```bash
/cb status
```
*Captures: Engine version, server software (Paper/Purpur), Java runtime version, database backend, and Master/Worker node role.*

#### 2. Automated Diagnostic Dump (`/cb export all`)
Generate a complete, non-sensitive audit dump of your server's registered recipes, groups, and restriction rules:
```bash
/cb export all
```
Attach the generated file located at:
`plugins/CraftingBlueprints/exports/system_summary.txt`

#### 3. Console Logs with Debug Mode Enabled
Temporarily activate verbose logging to capture the exact event sequence:

1. Open `plugins/CraftingBlueprints/config.yml` and set:
   ```yaml
   debug: true
   ```

2. Reload via `/cb reload`.
3. Reproduce the bug in-game.
4. Copy the relevant console snippet (from `logs/latest.log`) and wrap it in a code block.
5. Revert `debug: false` once logs are captured.

#### 4. Minimal Reproducible Blueprint Snippet
Provide a minimal YAML snippet that demonstrates the unexpected behavior (e.g. a single blueprint entry or restriction rule). Ensure your snippet starts with the schema header:
```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  bug_reproduction_item:
    blueprint: "minecraft:diamond_sword"
    name: "<red>Test Item</red>"
    permanent: true
```
