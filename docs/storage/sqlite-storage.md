# Standalone Setup (SQLite & Concurrency)

CraftingBlueprints provides a fully autonomous, embedded **SQLite** relational storage engine enabled by default. This architecture is purpose-built for standalone Minecraft servers—such as Survival (SMP), Skyblock, RPG realms, Minigames, and creative building worlds—operating on a single Paper, Purpur, or Spigot instance.

Unlike traditional plugins that require external database software or suffer from file-lock exceptions, CraftingBlueprints combines embedded SQLite with **Write-Ahead Logging (WAL)**, asynchronous non-blocking connection pooling, and **Positional Array JSON Serialization** to deliver high-concurrency throughput with zero external dependencies.

---

## Zero-Configuration Standalone Deployment

When you install CraftingBlueprints on a standalone server, no database configuration or credential setup is required. Upon boot, the plugin initializes an embedded SQLite instance backed by HikariCP and creates the database file directly inside your plugin directory:

```text
your-server/
└── plugins/
    └── CraftingBlueprints/
        ├── craftingblueprints.db         # Authoritative SQLite database file
        ├── craftingblueprints.db-wal     # Write-Ahead Log journal (active during runtime)
        └── craftingblueprints.db-shm     # Shared-memory index for concurrent readers
```

### Default Database Configuration

The storage configuration is defined in `plugins/CraftingBlueprints/config.yml`:

```yaml
# ------------------------------------------------------------ #
# DATABASE STORAGE CONFIGURATION
# ------------------------------------------------------------ #

# Storage engine backend: sqlite or mysql (default: sqlite)
database-type: sqlite

# Database filename (default: crafting_blueprints or craftingblueprints)
database-name: craftingblueprints

# ------------------------------------------------------------ #
# CLUSTER & NETWORK ROLES
# ------------------------------------------------------------ #
# Standalone servers operate in standalone mode (leave is-master: false).
# This server does not broadcast multi-server network reload signals.
is-master: false
```

> [!NOTE]
> **Automatic Schema Provisioning**  
> On the first startup, CraftingBlueprints automatically applies all initial database migrations ($V_1 \dots V_5$), generating player data tables (`cb_player_data`), blueprint registries (`ITEM_BLUEPRINTS`), and version ledgers (`cb_schema_version`). No manual `.sql` script execution is ever needed.

---

## WAL Mode & High-Concurrency Pragma Tuning

The primary limitation of traditional SQLite implementations in Minecraft plugins is the `database is locked` error (`SQLiteBusyException`). In standard rollback-journal mode, any write transaction locks the entire database file, causing read operations from player inventory clicks or join checks to fail or stall the server tick loop.

CraftingBlueprints completely eliminates this limitation by configuring SQLite in **Write-Ahead Logging (WAL)** mode backed by high-performance PRAGMAs:

```
  Traditional Rollback Journal (Blocking):
  ┌────────────────┐     Blocks Entire File     ┌────────────────┐
  │  Write Worker  ├───────────────────────────►│  Database File │ ◄── [READ BLOCKED!]
  └────────────────┘                            └────────────────┘

  CraftingBlueprints WAL Architecture (Non-Blocking Concurrency):
  ┌────────────────┐       Appends Writes       ┌────────────────┐
  │  Write Worker  ├───────────────────────────►│   .db-wal Log  │
  └────────────────┘                            └───────┬────────┘
                                                        │ Background Checkpoint
  ┌────────────────┐     Reads Point-in-Time    ┌───────▼────────┐
  │ 100+ Readers   ├───────────────────────────►│ craftingblueprints.db
  │ (Joins/Clicks) │     (via .db-shm index)    │  (Never Locked)│
  └────────────────┘                            └────────────────┘
```

### Automated PRAGMA Settings

During pool initialization in `HikariConnectionProvider`, CraftingBlueprints applies three critical SQLite connection pragmas:

```sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA busy_timeout = 5000;
```

### 1. `PRAGMA journal_mode = WAL;` (Write-Ahead Logging)
* **Mechanics**: Instead of modifying the database file directly or writing to a rollback journal, writes are sequentially appended to a companion file (`craftingblueprints.db-wal`).
* **Concurrency Guarantee**: **Readers never block writers, and writers never block readers.** While a background thread writes player profile saves, concurrent threads can read blueprint recipes, menu catalogs, and permissions without waiting.

### 2. `PRAGMA synchronous = NORMAL;` (I/O Optimization)
* **Mechanics**: In `NORMAL` mode, the database engine syncs to disk at critical WAL checkpoint intervals rather than on every single commit.
* **Performance Gain**: Reduces filesystem `fsync()` system calls by over 70%, drastically decreasing disk write latency on solid-state drives (SSDs) and NVMe storage during high player activity bursts.
* **Durability Guarantee**: Fully crash-resistant against application crashes and server process terminations.

### 3. `PRAGMA busy_timeout = 5000;` (Contention Buffer)
* **Mechanics**: If a transaction encounters a transient lock contention during a WAL checkpoint, SQLite will not immediately throw a `database is locked` exception.
* **Resolution**: The connection handler pauses and retries automatically for up to **5,000 milliseconds (5 seconds)**. In practice, internal write tasks complete within 1–3 milliseconds, ensuring zero interrupted user transactions.

> [!TIP]
> **HikariCP Connection Pool Baseline**  
> Even with SQLite, CraftingBlueprints utilizes a pooled `HikariDataSource` with `maximumPoolSize: 10` and `minimumIdle: 2`. This pool services asynchronous background tasks simultaneously without thread starvation while keeping disk locks fully isolated.

---

## Positional Array JSON Serialization (69% Byte Reduction)

Minecraft servers with active economies and hundreds of unlocked blueprints accumulate thousands of persistent player records. Storing this information using verbose JSON objects introduces massive overhead due to repeating property keys.

CraftingBlueprints solves this by serializing player blueprints into an ultra-compact **3-Element Positional Array** in `cb_player_data`:

$$\text{BlueprintPayload} = [ \text{Index}_0, \text{Index}_1, \text{Index}_2 ] = [ \text{isPermanent}, \text{finishDate}, \text{uses} ]$$

```
   Index 0 (Boolean)         Index 1 (Long)            Index 2 (Int)
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│     isPermanent      │  │      finishDate      │  │         uses         │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ true: Indefinite     │  │ Epoch milliseconds   │  │ Remaining crafts     │
│ false: Timed/Limited │  │ (0 if unlimited)     │  │ (0 if unlimited)     │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

### Verbose Anti-Pattern vs. Positional Array

#### Verbose Format (Legacy / Naive JSON)
```json
// ❌ Redundant ASCII keys repeated for EVERY unlocked recipe
{
  "blueprints": {
    "diamond_sword": {
      "isPermanent": true,
      "finishDate": 0,
      "uses": 0
    },
    "furnace:cooked_beef": {
      "isPermanent": false,
      "finishDate": 1731510000000,
      "uses": 25
    }
  }
}
```

#### CraftingBlueprints Positional Array Format
```json
//  Positional array with dual-tier namespaced dictionary keys
{
  "blueprints": {
    "diamond_sword": [true, 0, 0],
    "furnace:cooked_beef": [false, 1731510000000, 25],
    "blast_furnace:nexo:mythril_ingot": [false, 0, 32],
    "ia:rpgweapons:excalibur": [true, 0, 0]
  }
}
```

### Storage Footprint Benchmark

| Format | 1 Blueprint | 100 Blueprints | 250 Blueprints | Space Reduction |
| :--- | :---: | :---: | :---: | :---: |
| **Verbose Object** | ~90 bytes | ~9.2 KB | ~23.0 KB | Baseline |
| **Positional Array** | ~28 bytes | ~2.9 KB | ~7.2 KB | **~69% Reduction** |

### Dual-Tier Namespaces in Dictionary Keys

Rather than adding numeric flags or nested station objects to the array, all workstation and custom item provider specificity is encoded directly into the map key:

1. **Origin Namespace**: Identifies vanilla or third-party items (`diamond_sword`, `ia:weapons:excalibur`, `nexo:ruby_blade`, `mmoitems:SWORD:TITAN`).
2. **Station Constraint Prefix**: Enforces specific workstation routing (`furnace:cooked_beef`, `smoker:cooked_beef`, `blast_furnace:iron_ingot`, `stonecutter:stone_bricks`, `enchant_table:sharpness`). Universal blueprints omit the station prefix.

> [!NOTE]
> **In-Memory $O(1)$ Hash Map Lookups**  
> When a player clicks an item in a Crafting Table or Smoker, the engine queries `PlayerDB.cache` using an exact key lookup ($O(1)$ complexity). No array scanning, JSON traversal, or regex evaluation occurs on the main server thread.

---

## Keyed FIFO Task Dispatcher & Concurrency Safety

All database write operations execute on asynchronous background daemon worker threads. To eliminate race conditions (*final de carrera*) where rapid player actions (e.g., shift-crafting or quick inventory clicks) could interleave with pending database flushes:

1. **Keyed Serial Partitioning (Striped Actor Pattern)**: Tasks are partitioned by player `UUID`. For any single player, task $N+1$ never begins until task $N$ has finished executing.
2. **Critical Section Protection (`User.lock`)**: Each player profile encapsulates an internal `ReentrantLock`. In-memory state changes (`addBlueprints`, `tryUse`) and serialization snapshots (`User.toHashMap()`) acquire this lock, preventing torn reads.
3. **Pre-Evaluation Task Gate**: If a background calculation is actively executing for a player, workstation rules intercept further craft attempts with a temporary safety notice (`warning.wait_for_craft`), resolving automatically in microseconds without stalling server TPS.

---

## Custom Database Path (`sqlite-database-path`)

By default, the SQLite database resides in `plugins/CraftingBlueprints/craftingblueprints.db`. If you operate local staging instances or wish to place the database file on a high-speed NVMe or RAM disk, you can configure a custom location using `sqlite-database-path`.

In `plugins/CraftingBlueprints/config.yml`:

```yaml
# ------------------------------------------------------------ #
# ADVANCED SQLITE PATH
# ------------------------------------------------------------ #
# Specify a custom path for the SQLite database file.
# - Absolute paths: "D:/minecraft_data/craftingblueprints.db"
# - Relative paths: resolved relative to the server root (two directories above plugins/)
sqlite-database-path: "run/shared/craftingblueprints.db"
```

### Resolution Rules:
* **Absolute Path**: If the path begins with a drive letter (Windows: `C:\...`) or root slash (Linux: `/mnt/storage/...`), CraftingBlueprints uses that exact path.
* **Relative Path**: If a relative path is provided, it is resolved relative to the server directory (e.g., `run/shared/craftingblueprints.db`), allowing multiple local test servers (1.20.4 and 1.21.x) to test against a unified database file.

---

## Live Backup & Restore Procedures

Because SQLite operates in WAL mode with asynchronous transactions, you can safely back up your database while the server is live and players are crafting.

### Live Hot Backup (Server Running)

To create a consistent live backup without stopping the server:

1. **Check Point & Copy**: Ensure you copy all three database files simultaneously:
   ```bash
   cp craftingblueprints.db /backup/location/
   cp craftingblueprints.db-wal /backup/location/ 2>/dev/null || true
   cp craftingblueprints.db-shm /backup/location/ 2>/dev/null || true
   ```
2. **SQLite CLI Backup Tool (Recommended)**:
   ```bash
   sqlite3 plugins/CraftingBlueprints/craftingblueprints.db ".backup 'backups/backup_$(date +%Y%m%d_%H%M%S).db'"
   ```

> [!WARNING]
> **Never Copy Only the `.db` File When `.db-wal` Exists!**  
> If `.db-wal` is present on disk, active uncommitted transactions reside in the WAL log. Copying only `craftingblueprints.db` without `craftingblueprints.db-wal` will result in an incomplete or outdated database backup.

### Restoring from Backup

1. Safely stop the Minecraft server:
   ```text
   /stop
   ```
2. Navigate to `plugins/CraftingBlueprints/` and remove any lingering journal files:
   ```bash
   rm -f craftingblueprints.db-wal craftingblueprints.db-shm
   ```
3. Replace `craftingblueprints.db` with your verified backup `.db` file.
4. Start the server. CraftingBlueprints will verify schema integrity on boot and resume operations immediately.

---

## Diagnostic Verification

To inspect your SQLite storage engine and verify connection pool health from within the game or server console:

```text
/cb status
```

Expected diagnostic output:

```text
--------------------------------------------------
 CraftingBlueprints - Storage Engine Diagnostics
--------------------------------------------------
 Database Engine: SQLITE (Embedded Relational)
 Pool State: ACTIVE (HikariPool-1)
 Active Connections: 1 / 10 (Idle: 2)
 Journal Mode: WAL (Write-Ahead Logging)
 Synchronous Pragma: NORMAL
 Busy Timeout: 5000 ms
 Cached Player Profiles: 42 resident in RAM
 Registered Blueprint Items: 128 loaded
--------------------------------------------------
```
