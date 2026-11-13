# Multi-Server Synchronization (MySQL)

If you operate a BungeeCord or Velocity network where players switch between different game servers (e.g. Lobby, Survival, Skyblock), you can connect CraftingBlueprints to a central **MySQL or MariaDB** database.

This guarantees that when a player unlocks a blueprint on one server, the recipe is immediately available to them across the entire network.

---

## 1. Network Architecture Overview

```
                      ┌──────────────────────┐
                      │   Central MySQL DB   │
                      └──────────┬───────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
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

!!! caution
    To prevent multiple servers from fighting over YAML files or overwriting changes, you must designate **only one Primary Management Node**.

* **Primary Server (e.g., Lobby or Admin Server)**:
  ```yaml
  file-management:
    sync-from-files: true
    prune-deleted: true
  ```
  This primary server reads your local YAML blueprints from disk and publishes them into the shared MySQL database.

* **All Other Game Servers (Survival, Skyblock, Factions, etc.)**:
  ```yaml
  file-management:
    sync-from-files: false
  ```
  Worker nodes load and cache all registered blueprints directly from the shared MySQL database. They never write or import local YAML files to the database, preventing race conditions.

---

## 3. Database Credentials in config.yml

Configure the connection block in `plugins/CraftingBlueprints/config.yml` on every server:

```yaml
# Set storage engine to mysql
database-type: mysql

# Connection details
database-name: crafting_blueprints
database-host: 127.0.0.1
database-port: 3306
database-user: cb_user
database-password: "your_secure_password"
```

---

## 4. Verifying Connection

After restarting each server, run:

```text
/cb status
```

Confirm that the database reports: `Database Backend: MySQL (HikariCP Connected)`.
