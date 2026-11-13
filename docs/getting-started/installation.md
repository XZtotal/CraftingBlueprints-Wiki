# Installation & System Requirements

This guide outlines the system prerequisites and step-by-step setup procedure for installing **CraftingBlueprints** on your Minecraft server.

---

## System Requirements

| Requirement | Supported Versions | Notes |
| :--- | :--- | :--- |
| **Server Engine** | **Paper**, **Purpur** (1.18.2 – 1.21.x) | Modern Paper-based forks are required. Legacy CraftBukkit / Spigot alone is not supported. |
| **Java Runtime** | **Java 17** or **Java 21+** | Minecraft 1.20.5+ requires Java 21 minimum. |
| **Database** | SQLite (Embedded) or **MySQL 8.0+ / MariaDB 10.5+** | SQLite is enabled by default with zero configuration required. |

> [!NOTE]
> CraftingBlueprints features automated multi-version adapters. You do not need different builds for 1.18.2, 1.20.4, or 1.21.x; a single `.jar` works across all supported versions out of the box.

---

## Clean Installation in 4 Steps

1. **Download the Jar**: Obtain the latest official `CraftingBlueprints-x.x.x.jar`.
2. **Copy to Plugins**: Place the downloaded `.jar` file directly into your server's `plugins/` directory.
3. **Start or Restart Server**: Start your server.
   > [!WARNING]
   > Do not use the `/reload` or `/reload confirm` command when installing or updating plugins. A clean restart ensures that database drivers and NMS adapters initialize safely.
4. **Verify Console Boot**: Check your server console for the startup banner:
   ```text
   [CraftingBlueprints] Enabling CraftingBlueprints vX.X.X...
   [CraftingBlueprints] Detected Server Engine: Paper 1.20.4
   [CraftingBlueprints] SQLite database connection established.
   [CraftingBlueprints] Loaded X blueprints successfully.
   ```

---

## Verifying Plugin Health

Once the server has fully loaded, run the status diagnostic command in console or as a server operator (`/op`):

```text
/cb status
```

This command reports:
* The detected server engine and multi-version adapter.
* Active database backend status (SQLite or MySQL).
* Total count of blueprints registered in memory.

---

## Recommended Complementary Plugins

CraftingBlueprints works standalone, but integrates seamlessly with common server infrastructure:

* **[Vault](https://www.spigotmc.org/resources/vault.34315/)** + Any Economy Plugin (EssentialsX, Economy): Enables buying and selling blueprints for in-game currency.
* **[LuckPerms](https://luckperms.net/)**: Recommended for managing permission nodes across player ranks. See our [LuckPerms Guide](../commands-permissions/luckperms-guide.md).
* **[PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/)**: Allows displaying remaining blueprint uses and active counts in external scoreboards, chat, and tablists.

---

## Next Step

Now that your plugin is installed, test your first blueprint in 3 minutes with our [Quickstart Guide](quickstart.md).
