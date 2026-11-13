# Installation & Requirements

This page details the technical prerequisites and installation procedure for **CraftingBlueprints**.

---

## System Requirements

| Requirement | Supported Versions | Notes |
| :--- | :--- | :--- |
| **Java Runtime** | **Java 17** or **Java 21+** | Minecraft 1.20.5+ requires Java 21. |
| **Server Engine** | **Paper**, **Purpur** (1.18.2 – 1.21.x) | Spigot/Bukkit alone is not recommended; modern Paper APIs are required. |
| **Database** | SQLite (embedded) or **MySQL 8.0+ / MariaDB 10.5+** | SQLite is enabled by default with zero configuration required. |

> [!NOTE]
> CraftingBlueprints includes multi-version internal adapters (`adapter-v1_18_R2`, `adapter-v1_20_R3`, `adapter-v1_21_R1`). You do not need to download separate builds for different Minecraft versions.

---

## Step-by-Step Installation

1. **Download the Jar**: Obtain the latest release of `CraftingBlueprints-x.x.x.jar`.
2. **Place in Plugins Directory**: Move the file into your server's `plugins/` folder.
3. **Start or Restart Server**: Start your Minecraft server. Avoid using `/reload` commands; a clean restart is strongly recommended to load database drivers and NMS adapters safely.
4. **Verify Boot Output**: Look for the following lines in your server console:
   ```text
   [CraftingBlueprints] Enabling CraftingBlueprints vX.X.X...
   [CraftingBlueprints] Detected Server Engine: Paper 1.20.4
   [CraftingBlueprints] Multi-version adapter initialized successfully.
   [CraftingBlueprints] SQLite database connection established.
   [CraftingBlueprints] Loaded X blueprints in Y ms.
   ```
5. **Run Verification Command**: As an operator or in console, execute:
   ```text
   /cb status
   ```
   This displays memory usage, active database engine, registered blueprints, and health status.

---

## Generated File Structure

After the first boot, CraftingBlueprints generates the following folder hierarchy in `plugins/CraftingBlueprints/`:

```text
plugins/CraftingBlueprints/
├── config.yml                 # Primary configuration (database, storage, options)
├── messages_en.yml            # English translation & MiniMessage formatting
├── messages_es.yml            # Spanish translation & MiniMessage formatting
├── blueprints/                # YAML blueprint definitions
│   └── example_blueprints.yml # Out-of-the-box blueprint examples
├── presets/                   # Inactive preset repository (zips, folders, blueprints)
├── images/                    # Custom map backgrounds, badges, and watermarks
│   └── backgrounds/           # Procedural textures and custom artwork
└── exports/                   # In-game blueprint exports and diagnostic reports
```
