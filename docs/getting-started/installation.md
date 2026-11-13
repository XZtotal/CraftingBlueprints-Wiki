# Installation & System Requirements

This guide provides the system prerequisites, compatibility matrix, and a clean 4-step installation procedure for deploying **CraftingBlueprints** on modern Minecraft servers.

---

## System Requirements & Compatibility

CraftingBlueprints is engineered specifically for modern Paper-based server software. It features automated version adapters that load dynamically depending on your server runtime. A single `.jar` file supports all listed versions.

| Requirement | Supported Versions | Operational Notes |
| :--- | :--- | :--- |
| **Server Engine** | **Paper**, **Purpur** (1.18.2 – 1.21.x) | Modern Paper forks are required. Legacy CraftBukkit and standalone Spigot are not supported due to missing Adventure and PDC APIs. |
| **Java Runtime** | **Java 17** or **Java 21+** | Minecraft 1.18.2–1.20.4 runs on Java 17 or 21. Minecraft 1.20.5+ and 1.21+ strictly require **Java 21** minimum. |
| **Database** | **SQLite** (Default) or **MySQL 8.0+ / MariaDB 10.5+** | Standalone servers run on embedded SQLite with zero setup. Multi-server networks connect to MySQL via built-in HikariCP connection pooling. |
| **Network Proxies** | Velocity, BungeeCord, Waterfall | Full support for cross-server networks via shared MySQL and real-time heartbeat sync signals. |

!!! note "Automated Version Abstraction Layer"
    CraftingBlueprints uses an internal Version Abstraction Layer. You do not need separate builds for 1.18.2, 1.20.4, or 1.21.x. Advanced features (such as 1.21 Crafter block interception or 1.20 3-slot Smithing Tables) activate automatically when running on compatible server versions and remain safely dormant on older versions.

---

## Clean Installation in 4 Steps

=== "Paper / Purpur (Single Server)"

    1. **Download the Plugin**: Obtain the latest official `CraftingBlueprints-x.x.x.jar`.
    2. **Place in Plugins Directory**: Copy the `.jar` directly into your server's `plugins/` directory:
       ```text
       your-server/
       └── plugins/
           └── CraftingBlueprints-x.x.x.jar
       ```

    3. **Start the Server**: Start the server to generate default configuration files, bundled templates, and sample blueprints.
       !!! warning "Avoid /reload"
           Never use the Bukkit `/reload` or `/reload confirm` command when installing or updating plugins. A clean restart ensures that database connection pools, file watchers, and version adapters initialize safely.
    
    4. **Verify Boot Output**: Review your server console for the startup diagnostics banner:
       ```text
       [CraftingBlueprints] Enabling CraftingBlueprints vX.X.X...
       [CraftingBlueprints] Detected Server Engine: Paper 1.20.4 (Adapter: Adapter_v1_20_R3)
       [CraftingBlueprints] SQLite database connection established: plugins/CraftingBlueprints/crafting_blueprints.db
       [CraftingBlueprints] Loaded 3 blueprint groups: default (142 recipes), vip (157 recipes), pro (210 recipes).
       [CraftingBlueprints] Successfully registered 42 blueprints from YAML files.
       ```

=== "Multi-Server Network (Bungee / Velocity)"

    1. **Install on Every Server**: Copy `CraftingBlueprints-x.x.x.jar` into the `plugins/` directory of each sub-server (Hub, Survival, Skyblock, etc.).
    2. **Configure Central MySQL**: On every server, open `plugins/CraftingBlueprints/config.yml` and set `database-type: mysql` with your shared database credentials.
    3. **Enforce the Golden Rule**:
        * Designate **one Primary Management Server** (e.g., Hub/Admin) with:
          ```yaml
          file-management:
            sync-from-files: true
          ```

        * Configure **all Worker Servers** (Survival, Skyblock, etc.) with:
          ```yaml
          file-management:
            sync-from-files: false
          ```

    4. **Start Servers & Confirm Sync**: Start the primary server first, then the worker nodes. Review our [Multi-Server Setup Guide](../storage/mysql-multiserver.md) for network-specific connection pooling advice.

---

## First-Run Diagnostics (`/cb status`)

Once your server has fully started, verify the operational health of CraftingBlueprints by running the status diagnostic command in console or as a server operator:

```text
/cb status
```

This diagnostic report provides immediate insight into your deployment:

* **Engine & Version Adapter**: Confirms the active Paper version and corresponding capability adapter (Smithing Table 3-slot, Data Components, Crafter block).
* **Database Backend**: Displays active connection status (`SQLite (Connected)` or `MySQL (HikariCP Active)`), active connection pool statistics, and round-trip query latency.
* **Blueprint Counts**: Reports the total number of blueprints registered across all categories (`singles`, `packages`, `mysteries`).
* **File Management Mode**: Shows whether the node is running as a **Master Node** (`sync-from-files: true`) or a **Worker Node** (`sync-from-files: false`).
* **Map Cache & Resources**: Displays loaded player profiles, blueprint definitions, and cached map images.

---

## Recommended Complementary Plugins

While CraftingBlueprints works completely standalone with vanilla Minecraft economies, it integrates seamlessly with industry-standard server plugins:

* **[Vault](https://www.spigotmc.org/resources/vault.34315/)** + Economy Provider (EssentialsX, Economy): Enables buying and selling blueprints directly through the `/cb item list` catalog GUI.
* **[LuckPerms](https://luckperms.net/)**: The recommended permissions plugin for managing player progression tiers and recipe groups (`craftingblueprints.group.<id>`). See our [LuckPerms Guide](../commands-permissions/luckperms-guide.md).
* **[PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/)**: Allows surfacing remaining blueprint uses, active unlock counts, and expiration timers in scoreboards, tablists, and chat formats.
* **Custom Item Plugins**: Full support for custom weapons, tools, and armor from [ItemsAdder](../blueprints/custom-items.md), [Oraxen](../blueprints/custom-items.md), [Nexo](../blueprints/custom-items.md), [MMOItems](../blueprints/custom-items.md), [EcoItems](../blueprints/custom-items.md), and [MythicMobs](../blueprints/custom-items.md).

---

## Next Steps

Now that CraftingBlueprints is installed and healthy, test your first custom blueprint in under 3 minutes with our [Quickstart Guide](quickstart.md).
