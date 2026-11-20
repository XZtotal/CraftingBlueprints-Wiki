# Installation & System Requirements

This guide provides the system prerequisites, compatibility specifications, directory layout, and a clean installation workflow for deploying **CraftingBlueprints** on your Minecraft server or multi-server network.

---

## System Requirements & Compatibility Matrix

CraftingBlueprints is engineered specifically for modern Paper-based server software. It features an automated Version Abstraction Layer that dynamically detects server capabilities at runtime, enabling a single `.jar` distribution to support all listed environments:

| Component | Supported Version / Specification | Technical Notes |
| :--- | :--- | :--- |
| **Server Engine** | **Paper**, **Purpur** (`1.18.2` – `1.21.x`, `26.x+`) | Modern Paper forks are required. Legacy Spigot and CraftBukkit are not supported due to missing Adventure, PersistentDataContainer (PDC), and event lifecycle APIs. Forward-compatible with Minecraft 26.x releases. |
| **Java Runtime (JVM)** | **Java 17**, **Java 21**, or **Java 25+** | Minecraft 1.18.2–1.20.4 requires Java 17+. Minecraft 1.20.5+ and 1.21+ require Java 21+. Paper 26.x runs on Java 25+. The plugin is compiled with a Java 17 bytecode release target, executing natively and forward-compatibly across Java 17, 21, and 25+. |
| **Storage Engine** | **SQLite** (Embedded) or **MySQL 8.0+ / MariaDB 10.5+** | Single servers run out-of-the-box on embedded SQLite with WAL (Write-Ahead Logging) concurrency. Multi-server networks connect to a shared MySQL/MariaDB database with HikariCP connection pooling. |
| **Network Proxies** | Velocity, BungeeCord, Waterfall | Full support for multi-server networks with instant heartbeat cache synchronization and database-backed cluster file mirroring. |

### Optional Integrations

While CraftingBlueprints functions completely standalone, it seamlessly integrates with the following industry-standard plugins:

* **[Vault](https://www.spigotmc.org/resources/vault.34315/)** + Economy Provider (EssentialsX, etc.): Enables buying and selling physical blueprints via `/cb buy` and `/cb sell`.
* **[LuckPerms](https://luckperms.net/)**: Recommended permissions manager for hierarchical recipe progression groups (`craftingblueprints.group.<id>`).
* **[PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/)**: Exposes remaining blueprint uses, active unlock counts, and expiration timers for scoreboards, tablists, and custom chat formats.
* **Custom Item Plugins**: Out-of-the-box support for custom gear and textures from **ItemsAdder**, **Nexo**, **Oraxen**, **MMOItems**, and **EcoItems**.

> [!NOTE]
> **Dynamic Version Adapters**  
> You do not need to download version-specific JAR files. CraftingBlueprints automatically binds modern Paper capabilities (such as Minecraft 1.21 redstone Crafter block interception, 3-slot Smithing Tables, and Adventure component titles) on compatible versions, while maintaining clean backward compatibility on earlier Paper releases.

---

## Clean 3-Step Installation Flow

Follow this 3-step installation procedure to deploy CraftingBlueprints cleanly on your server:

### Step 1: Place the JAR in `plugins/`
Download the official `CraftingBlueprints-x.x.x.jar` and place it directly into your server's `plugins/` directory:

```text
your-server/
└── plugins/
    └── CraftingBlueprints-x.x.x.jar
```

### Step 2: Start the Server
Start your server executable. During initial boot, CraftingBlueprints automatically generates the primary configuration files, directory hierarchy, and default blueprint templates.

> [!WARNING]
> **Never Use `/reload` During Installation**  
> Do not use the Bukkit `/reload` or `/reload confirm` command when installing or upgrading plugins. Doing so can cause memory leaks, corrupt database connection pools, and break event listeners. Always perform a clean server reboot or use the dedicated `/cb reload` command for plugin configuration updates.

### Step 3: Verify the Console Startup Banner
Review your server console log to verify that CraftingBlueprints initialized successfully. You should see a clean startup banner similar to:

```text
[CraftingBlueprints] Enabling CraftingBlueprints v2.0.0...
[CraftingBlueprints] Detected Server Engine: Paper 1.21.1 (Adapter: Adapter_v1_21_R1)
[CraftingBlueprints] SQLite database connection established: plugins/CraftingBlueprints/crafting_blueprints.db
[CraftingBlueprints] Loaded 3 blueprint groups: default (142 recipes), vip (157 recipes), pro (210 recipes).
[CraftingBlueprints] Successfully registered 42 blueprints from YAML files.
[CraftingBlueprints] CraftingBlueprints enabled successfully.
```

---

## First-Run Directory Anatomy

Upon first launch, CraftingBlueprints provisions an organized directory structure under `plugins/CraftingBlueprints/`:

```text
plugins/CraftingBlueprints/
├── config.yml                  # Primary server configuration (database, restrictions, workstations)
├── messages_en.yml             # Localized MiniMessage text strings (English default)
├── messages_es.yml             # Localized MiniMessage text strings (Spanish)
├── blueprint.schema.json       # JSON Schema definition for real-time IDE autocompletion
├── blueprints/                 # Active declarative YAML blueprint definition files
│   ├── blueprint.schema.json   # Local copy for relative YAML schema referencing
│   └── example_blueprints.yml  # Reference definitions with detailed syntax comments
├── configs/                    # Modular configuration overrides (groups, restrictions)
│   └── presets/                # Modular configs deployed by 1-Click Presets
├── presets/                    # Inactive repository for preset packs, folders, and .zip archives
├── exports/                    # Automated diagnostic exports and manual blueprint backups
│   ├── manual_blueprints.yml   # Blueprints created via in-game commands
│   ├── minecraft_recipes.txt   # Runtime dump of all Bukkit recipes detected on server
│   ├── groups_recipes.txt      # Diagnostic audit of group inheritance and recipe matching
│   └── system_summary.txt      # System metrics, database status, and active rule counts
├── images/                     # Custom visual assets for map drafting (Extended Edition)
└── crafting_blueprints.db      # SQLite database file (when database-type: sqlite)
```

### Directory Roles & Functions

* **`config.yml`**: The central configuration file. Defines database credentials (`sqlite` or `mysql`), base recipe restriction rules (`restrictions.restricted-items`), global group hierarchies (`groups:`), workstation interception toggles, and performance settings.
* **`blueprints/`**: The directory scanned by the declarative blueprint loader. Place all `.yml` files defining single blueprints (`singles:`), packages (`packages:`), and mystery scrolls (`mysteries:`) here. Files can be organized into arbitrary subfolders (e.g. `blueprints/weapons/`, `blueprints/armor/`).
* **`configs/`**: Modular configuration directory. Any YAML file placed in this folder containing a `groups:` or `restrictions:` section is parsed and merged into server memory via mathematical set union without modifying `config.yml`.
* **`presets/`**: Inactive preset pack repository. Downloaded or custom `.zip` and folder preset archives reside here safely without affecting the live server until applied via `/cb preset apply`.
* **`exports/`**: Non-destructive diagnostic output folder. Contains automated text audits of server recipes, permission group resolutions, and rolling backups of in-game manual blueprints.

---

## Post-Install Health Verification

After the server boots, verify system health using built-in administrative diagnostic commands.

### 1. Inspect System Status (`/cb status`)
Execute the status command from your server console or as an operator:

```text
/cb status
```

This diagnostic report provides real-time verification of all core subsystems:
* **Engine & Version Adapter**: Confirms the active Paper version and corresponding capability adapter (`Adapter_v1_21_R1`, `Adapter_v1_20_R3`, or `Adapter_v1_18_R2`).
* **Storage Backend**: Confirms connection health (`SQLite (Connected)` or `MySQL (HikariCP Active)`), connection pool statistics, and round-trip query latency.
* **Blueprint Metrics**: Reports total loaded blueprints across `singles`, `packages`, and `mysteries`.
* **Network Node Role**: Displays whether the server operates as a **Master Node** (`is-master: true`) or a **Worker Node** (`is-master: false`).
* **Group & Restriction Counts**: Summarizes loaded permission groups and active recipe restriction patterns.

### 2. Test Configuration Reload (`/cb reload`)
Test the plugin's hot-reload pipeline:

```text
/cb reload
```

This verifies that the configuration loader, group inheritance engine, and restriction parser execute cleanly without errors or console warnings.

---

## Next Steps

Now that CraftingBlueprints is installed and running:
* **Fast-Track Onboarding**: Deploy balanced, production-ready recipe suites in 30 seconds using [1-Click Presets](presets-quickstart.md).
* **Hands-On Quickstart**: Author, grant, and craft your very first custom blueprint in under 3 minutes with our [First Blueprint Tutorial](first-blueprint.md).
* **Learn Progression Gating**: Understand how to gate endgame equipment using the [Recipe Restriction Engine](../progression/recipe-restrictions.md).
