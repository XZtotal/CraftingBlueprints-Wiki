# Incident Troubleshooting Runbooks

When operational issues occur on a production server, administrators need rapid, deterministic diagnostics and actionable remediation steps rather than vague advice.

This troubleshooting guide is structured as **five incident runbooks** covering the most common operational challenges encountered in CraftingBlueprints deployments.

---

## Diagnostic Runbook 1: YAML Syntax & Indentation Errors

### Symptoms

- Server console logs BoostedYAML parsing exceptions during startup or upon executing `/cb reload`.
- Blueprints in a specific YAML file are missing from `/cb menu` and `/cb item list`.
- Error logs contain messages such as:
  ```text
  [CraftingBlueprints] Failed to parse blueprint file 'blueprints/weapons.yml':
  org.simpleyaml.exceptions.InvalidConfigurationException: ScannerException: mapping values are not allowed here at line 14, column 18
  ```

### Root Cause Analysis

1. **Tab Indentation**: YAML syntax forbids ASCII tab characters (`\t`). A text editor accidentally inserted a tab instead of spaces.
2. **Missing Colon**: A property key is missing its trailing colon (e.g. `permanent true` instead of `permanent: true`).
3. **Mismatched List Indentation**: List dashes (`-`) are aligned incorrectly with parent mapping keys.
4. **Unquoted Special Characters**: MiniMessage or legacy color tags containing colons, quotes, or brackets without surrounding double quotes (e.g. `name: <red>Sword: Tier 1</red>` instead of `name: "<red>Sword: Tier 1</red>"`).

### Remediation Workflow

#### Step 1: Run In-Game Syntax Validation
Execute the built-in validator to isolate the exact file, line, and column of the syntax defect:
```bash
/cb validate
```

#### Step 2: Interpret the Error Pointer
The validator prints a clear pointer identifying the broken line:
```text
[CraftingBlueprints] Validation Error in 'blueprints/weapons.yml':
Line 14, Column 18:
  13 |   infernal_blade:
  14 |     name: "<red>Infernal Blade
       -------------------------^ (Unclosed string literal)
```

#### Step 3: Enable IDE IntelliSense
To eliminate syntax defects during authoring, add the schema directive at the very top of your YAML file:
```yaml
# yaml-language-server: $schema=./blueprint.schema.json
```
This enables real-time schema validation and red squiggly underlines in VS Code and IntelliJ IDEA. See [IDE Schema Validation](../authoring/ide-schema-validation.md).

#### Step 4: Reload
Once corrected, reload the engine without restarting the server:
```bash
/cb reload
```

---

## Diagnostic Runbook 2: SQLite "Database is Locked" Exceptions

### Symptoms

- Server console outputs SQL exceptions when players disconnect or unlock blueprints:
  ```text
  org.sqlite.SQLiteException: [SQLITE_BUSY] The database file is locked (database table is locked)
      at org.sqlite.core.DB.execute(DB.java:860)
  ```

- Player blueprint progress occasionally fails to persist across server restarts.

### Root Cause Analysis

1. **Journal Mode Contention**: By default, legacy SQLite operates in `DELETE` or `ROLLBACK` journal mode, which acquires an exclusive file lock during write transactions, blocking all concurrent read threads.
2. **Slow Storage or Network Mount**: The SQLite database file resides on a slow HDD, an external USB drive, or a network-attached filesystem (NFS/SMB) that introduces write latency.
3. **Antivirus or Backup Scanning**: An external process (such as Windows Defender or a scheduled backup script) holds an open OS file handle on `craftingblueprints.db`.

### Remediation Workflow

#### Step 1: Enable Write-Ahead Logging (WAL Mode)
Write-Ahead Logging (WAL) is the industry standard for high-concurrency SQLite. It allows multiple simultaneous readers while a background thread writes, eliminating `SQLITE_BUSY` errors.

Open `plugins/CraftingBlueprints/database.yml` and ensure WAL mode is configured:
```yaml
storage:
  type: SQLITE
  sqlite:
    file: "craftingblueprints.db"
    # Enable WAL mode and 5000 ms lock timeout
    journal-mode: "WAL"
    busy-timeout: 5000
    synchronous: "NORMAL"
```

#### Step 2: Manually Activate WAL Mode via SQLite CLI
If running on an existing database, run the following PRAGMA command using any SQLite tool:
```sql
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;
PRAGMA synchronous = NORMAL;
```
Verify the output returns `wal`.

#### Step 3: Local NVMe Storage Verification
Ensure `plugins/CraftingBlueprints/` is stored on a local high-speed SSD or NVMe drive. Never run SQLite across network file shares. For multi-server networks, switch to **MySQL**. See [Multi-Server MySQL Synchronization](../storage/mysql-network-sync.md).

---

## Diagnostic Runbook 3: Operator Bypass Confusion

### Symptoms

- Server operators (OPs) test crafting a restricted recipe and find it is completely unlocked, leading them to believe the restriction engine is broken.
- Conversely, operators report being unable to craft recipes or seeing contradictory outputs from `/cb cani`.

### Root Cause Analysis

1. **Wildcard OP Permissions**: On Paper servers, operators are automatically granted the wildcard node `*`. This grants `craftingblueprints.admin.bypass`, which permits crafting all restricted recipes without possessing blueprints.
2. **`op-bypass` Configuration State**: The setting `op-bypass` in `config.yml` controls whether server operators ignore recipe restrictions.

### Remediation Workflow

#### Step 1: Configure OP Isolation in `config.yml`
To ensure server administrators experience exact player progression during gameplay testing, set `op-bypass: false`:

```yaml
# ------------------------------------------------------------
# PERMISSION & OPERATOR RULES
# ------------------------------------------------------------
# If false, server operators (OPs) MUST possess blueprints to craft
# restricted recipes, guaranteeing authentic gameplay testing.
op-bypass: false
```

#### Step 2: Negate the Admin Bypass Node in LuckPerms
If operators inherit the `*` permission via LuckPerms, explicitly negate the bypass node on the admin group:
```bash
/lp group admin permission set craftingblueprints.admin.bypass false
```

#### Step 3: Test with a Non-OP Account
For definitive verification:

1. Temporarily remove OP: `/deop YourUsername`.
2. Execute `/cb cani <item>` to inspect actual permissions.
3. Test crafting in a 3x3 grid.

---

## Diagnostic Runbook 4: Automated Hopper & Furnace Smelting Exploits

### Symptoms

- Players without smelting blueprints use hoppers to funnel raw iron, gold, or ancient debris into furnaces placed by other players, bypassing smelting restrictions.
- Locked smelting items produce smelted outputs into output hoppers without requiring player interaction.

### Root Cause Analysis

1. In Minecraft, block entities (Furnaces, Blast Furnaces, Smokers) can be automated via redstone and hoppers without an active player inventory click event.
2. The furnace tile was placed before CraftingBlueprints was installed, or tile ownership tracking was not configured.

### Remediation Workflow

#### Step 1: Understand Tile PDC Ownership Tracking
CraftingBlueprints stamps an immutable tile metadata tag (`craftingblueprints:owner`) into the furnace block entity when placed by a player. The furnace operates under the crafting rights of its registered owner.

Inspect the owner of any workstation block:

1. Stand looking directly at the furnace.
2. Execute:
   ```bash
   /cb owner
   ```

3. The chat displays the registered owner UUID and username.

#### Step 2: Enable Hopper Rejection Guards
Open `plugins/CraftingBlueprints/config.yml` and verify hopper anti-exploit rules:

```yaml
furnaces:
  # Intercept hoppers inserting items into smelting stations
  track-hopper-insertions: true

  # If true, hoppers feeding restricted items into a furnace whose owner
  # lacks the smelting blueprint are rejected and halted.
  reject-locked-hopper-items: true

  # Action when unowned furnace receives locked item: REJECT, DROP, or LOCK
  unowned-furnace-action: "REJECT"
```

#### Step 3: Test Hopper Enforcement

1. Place a hopper pointing into the top of a blast furnace.
2. Drop raw ancient debris into the hopper as an unpermitted player.
3. Observe that the item remains in the hopper or is rejected, and the blast furnace does not ignite.

---

## Diagnostic Runbook 5: Blank Maps or Broken Textures (Extended Edition)

### Symptoms

- Blueprints in player inventories render as empty vanilla ocean/land maps, green fields, or missing magenta-and-black textures.
- Custom background images or frame borders configured in `map:` are missing on Worker servers.

### Root Cause Analysis

1. **`images-on-maps` Disabled**: The map drafting compositor is toggled off in `config.yml`.
2. **Missing PNG Assets on Worker Disks**: The Master server configured custom background PNGs in `images/backgrounds/`, but the image files were never synchronized to Worker nodes.
3. **Invalid Image Dimensions**: Custom textures are not exactly 128×128 pixels, or use unsupported color palettes (CMYK instead of sRGB/RGBA).

### Remediation Workflow

#### Step 1: Verify Master Map Settings
Open `plugins/CraftingBlueprints/config.yml` and confirm map rendering is active:
```yaml
extended:
  images-on-maps: true
```

#### Step 2: Verify Image Resolution & Color Space
Check all custom PNG images placed under `plugins/CraftingBlueprints/images/`:

- **Dimensions**: Must be exactly **128 × 128 pixels**.
- **Color Format**: **sRGB / 32-bit RGBA** (with standard 8-bit alpha channel). Non-standard color profiles cause Java `ImageIO` to fail silently.

#### Step 3: Synchronize Cluster Assets via Database Bus
If running a multi-server cluster, pull missing binary assets from MySQL to Worker disks:

On the Worker node:
```bash
/cb cluster files pull --force
```

#### Step 4: Refresh Map Renderers
Force the map graphics engine to re-render all active canvas buffers:
```bash
/cb reload
```
Players holding blueprint maps will see the graphics update instantly without re-logging.
