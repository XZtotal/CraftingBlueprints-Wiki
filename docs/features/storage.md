# Storage & Multi-Server Synchronization

CraftingBlueprints is architected for both standalone single-server environments and massive multi-server BungeeCord/Velocity proxy networks.

---

## Supported Storage Backends

Configured under the `DATABASE CONFIG` section in `config.yml`:

=== "SQLite (Default)"

    ```yaml
    database-type: sqlite
    database-name: crafting_blueprints # Stored as crafting_blueprints.db
    ```

    * **Zero configuration**: Runs out of the box using embedded SQLite.
    * Ideal for standalone SMP, Survival, or single-server networks.
    * Fully asynchronous worker pool to prevent main-thread server lag during saves.

=== "MySQL / MariaDB"

    ```yaml
    database-type: mysql
    database-host: "127.0.0.1"
    database-port: 3306
    database-name: "crafting_blueprints"
    database-user: "cb_user"
    database-password: "your_secure_password"
    ```

    * High-performance connection pool (HikariCP).
    * Automated schema migrations across plugin version updates.
    * Required for multi-server networks where player unlocks must sync instantly across servers.

---

## Multi-Server Network Architecture

When running multiple game servers connected to a single MySQL database:

```
                      ┌──────────────────────┐
                      │   Central MySQL DB   │
                      └──────────┬───────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Lobby / Admin  │     │   Survival-01   │     │   Survival-02   │
│ (Primary Node)  │     │  (Worker Node)  │     │  (Worker Node)  │
│sync-from-files: │     │sync-from-files: │     │sync-from-files: │
│     TRUE        │     │     FALSE       │     │     FALSE       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Configuration for Network Nodes

1. **Designate One Primary Node (e.g. Hub or Admin Server)**:
   In `config.yml`:
   ```yaml
   file-management:
     sync-from-files: true
     prune-deleted: true
   ```
   This primary node reads your local YAML blueprints from disk and synchronizes them into the central MySQL database.

2. **Configure All Other Servers as Worker Nodes**:
   In `config.yml`:
   ```yaml
   file-management:
     sync-from-files: false
   ```
   Worker nodes read and cache all registered blueprints directly from the shared MySQL database. They never overwrite or conflict with each other.

---

## Automated Backups & In-Game Exporter

CraftingBlueprints automatically maintains rolling backups of blueprints created in-game:

```yaml
in-game-export:
  enabled: true
  directory: "exports"
  file-name: "manual_blueprints.yml"
  auto-export-on-reload: true
  backups:
    enabled: true
    interval: 1h
    max-count: 5 # Keeps 5 rolling hourly backups in exports/backups/
```
