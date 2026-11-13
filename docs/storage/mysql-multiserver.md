# Multi-Server Synchronization (MySQL / MariaDB)

If you operate a BungeeCord or Velocity network where players switch between different game servers (e.g. Lobby, Survival, Skyblock, Factions), you can connect CraftingBlueprints to a central **MySQL or MariaDB** database.

This guarantees that when a player unlocks a blueprint on one server, their recipe knowledge, remaining craft counts, and active expiration timers synchronize instantly across every server on the network.

---

## 1. Network Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │          Central MySQL / MariaDB DB          │
                      │  - cb_player_data        - cb_sync_signals   │
                      │  - ITEM_BLUEPRINTS       - cb_reservations   │
                      └──────────────────────┬───────────────────────┘
                                             │
                     ┌───────────────────────┼───────────────────────┐
                     │ (Heartbeat & Signals) │                       │
                     ▼                       ▼                       ▼
            ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
            │  Lobby / Admin  │     │   Survival-01   │     │    Skyblock     │
            │ (Primary Node)  │     │  (Worker Node)  │     │  (Worker Node)  │
            │sync-from-files: │     │sync-from-files: │     │sync-from-files: │
            │      TRUE       │     │     FALSE       │     │     FALSE       │
            └─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 2. The Golden Rule of Multi-Server Networks

!!! caution "The Golden Rule: One Primary Node Only"
    To prevent database divergence, split-brain conflicts, and race conditions, you must designate **strictly ONE Primary Management Node** on your entire network (typically your Hub, Lobby, or Staff server).
    
    All other sub-servers (Survival, Skyblock, Factions, Prison) must operate as **Worker Nodes**.

### Configuration Comparison:

=== "Primary Management Node (Hub / Admin)"
    ```yaml
    file-management:
      # ENABLED ONLY ON THIS SERVER:
      sync-from-files: true
      prune-deleted: true
      auto-reload:
        enabled: true
    ```
    * This primary server reads your local YAML blueprints in `blueprints/` and synchronizes them into the shared MySQL database.
    * Whenever you edit files or run `/cb reload`, the primary node writes changes to the database and dispatches a network signal ping (`cb_sync_signals`).

=== "Worker Nodes (Survival, Skyblock, etc.)"
    ```yaml
    file-management:
      # STRICTLY FALSE ON ALL GAME SERVERS:
      sync-from-files: false
      prune-deleted: false
      auto-reload:
        enabled: false
    ```
    * Worker nodes load all registered blueprints directly from the shared MySQL database into memory.
    * They **never** overwrite the database with local files, ensuring 100% data consistency.
    * They automatically detect database signal pings from the primary node and refresh their memory cache in real time with zero manual commands.

---

## 3. Database Credentials Configuration

Configure the database connection block in `plugins/CraftingBlueprints/config.yml` on every server:

```yaml
# Set storage backend to mysql
database-type: mysql

# Shared database parameters
database-name: crafting_blueprints
database-host: 127.0.0.1
database-port: 3306
database-user: cb_user
database-password: "your_secure_password"
```

### MariaDB / MySQL Privilege Setup (SQL)
Run these queries on your database server to provision the user and database cleanly:

```sql
CREATE DATABASE IF NOT EXISTS crafting_blueprints CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'cb_user'@'%' IDENTIFIED BY 'your_secure_password';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, LOCK TABLES 
ON crafting_blueprints.* TO 'cb_user'@'%';

FLUSH PRIVILEGES;
```

---

## 4. Real-Time Heartbeat Signal Ping (`cb_sync_signals`)

In traditional plugins, updating configurations on a multi-server network requires running `/reload` on every single sub-server. CraftingBlueprints eliminates this operational friction:

1. **Master Reload**: An administrator edits a blueprint YAML file on the primary node and runs `/cb reload blueprints` (or lets the auto-reloader detect the file save).
2. **Signal Dispatch**: The master node writes the updated blueprints to MySQL and emits an atomic reload signal into the `cb_sync_signals` table.
3. **Automatic Worker Invalidation**: During their background heartbeat cycle (every 3 to 5 seconds), all worker nodes detect the new signal timestamp, invalidate their local blueprint caches, and reload the updated definitions from MySQL.
4. **Outcome**: All sub-servers update within seconds without a single console command or server restart.

---

## 5. Cross-Server Map Virtualization & PDC Relinking

In cross-server networks, Minecraft map IDs frequently clash:
* Map ID `104` on the Survival server might be a Diamond Sword blueprint.
* Map ID `104` on the Lobby server might be the server spawn hub map.

CraftingBlueprints solves this using **PDC Visual Key Virtualization**:
* The physical map item stores the normalized `visual_key` in its PersistentDataContainer (`cb_map:single:diamond_sword:...`).
* When a player switches from Survival to Lobby via Bungee/Velocity, the `MapRelinkListener` intercepts the item upon player join or inventory open.
* It queries the local server's `BlueprintMapRegistry` and re-links the item's `MapView` to the local canonical Map ID in-place.
* **Guaranteed Outcome**: The physical map always renders the correct blueprint graphic on the local server without ever overwriting or corrupting world maps on that server.

---

## 6. Player Lifecycle & Quick-Relog Protection

When players switch rapidly between servers (e.g. clicking a portal or executing `/server survival`):
* `WaitingManager` and `cb_reservations` prevent race conditions where Server B attempts to load player data before Server A has finished flushing recent crafts to MySQL.
* If a player rejoins within milliseconds, active memory state is preserved with atomic monitor locks, eliminating lost updates and rollback glitches.
