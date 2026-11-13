# Standalone Server Storage (SQLite)

By default, CraftingBlueprints uses an embedded **SQLite** relational database engine. This is the optimal configuration for standalone Survival servers, Skyblock worlds, RPG realms, and minigames operating on a single server instance.

---

## Zero-Configuration Setup

SQLite requires zero external software, no database servers, and no user management. CraftingBlueprints automatically provisions the database file and manages schema migrations on startup.

In `plugins/CraftingBlueprints/config.yml`:

```yaml
# ------------------------------------------------------------ #
# Database Storage Configuration
# ------------------------------------------------------------ #

# Storage engine backend: sqlite
database-type: sqlite

# Database filename (saved as crafting_blueprints.db)
database-name: crafting_blueprints
```

---

## File Location & Data Schema

All persistent data is stored directly in a single file inside your plugin directory:

```text
your-server/
└── plugins/
    └── CraftingBlueprints/
        └── crafting_blueprints.db
```

This database maintains:

* **`cb_player_data`**: All unlocked blueprints, remaining craft usage counts, and expiration timestamps per player UUID.
* **`ITEM_BLUEPRINTS`**: Blueprints created in-game via GUI or commands (`is_file_managed: false`).
* **`cb_schema_version`**: Automated schema migration version markers.

---

## Performance & Concurrency Architecture

* **Zero Main-Thread Blocking**: All database read and write operations execute on asynchronous background daemon worker threads. Player crafting, inventory clicks, and server ticks are never blocked waiting for disk I/O.
* **Keyed FIFO Task Dispatcher**: Writes for each player are strictly queued in First-In-First-Out order, guaranteeing atomic check-and-consume invariants even during high-frequency crafting events.
* **Capacity**: Embedded SQLite handles single-server workloads effortlessly, supporting over 150+ concurrent active players with sub-millisecond local query latencies.

---

## Live Backup & Restore Procedures

Because CraftingBlueprints uses asynchronous transactions, you can safely back up your database while the server is live:

### Creating a Backup
1. Navigate to `plugins/CraftingBlueprints/`.
2. Copy `crafting_blueprints.db` to your backup directory or cloud storage.
3. You can safely run this copy operation from a scheduled backup script while players are online.

### Restoring from Backup
1. Stop the server safely:
   ```text
   /stop
   ```

2. Replace `plugins/CraftingBlueprints/crafting_blueprints.db` with your backup copy.
3. Start the server. The plugin validates the database integrity upon boot and resumes operations immediately.
