# Standalone Setup (SQLite)

By default, CraftingBlueprints uses an embedded **SQLite** database engine. This is the optimal configuration for standalone survival servers, RPG worlds, and minigames operating on a single server instance.

---

## Configuration in config.yml

SQLite requires zero setup:

```yaml
# Storage engine: sqlite
database-type: sqlite

# Database filename (saved as crafting_blueprints.db)
database-name: crafting_blueprints
```

---

## Where Are Player Unlocks Stored?

All unlocked recipes, active timer countdowns, and remaining craft counts are saved directly inside:

```text
plugins/CraftingBlueprints/crafting_blueprints.db
```

---

## Backing Up Your SQLite Database

To create a safe backup of your player blueprint progression:

1. You can safely copy `crafting_blueprints.db` while the server is running.
2. Store the copy in your automated server backup folder.
3. If you ever need to restore, stop the server, replace `crafting_blueprints.db`, and start the server again.
