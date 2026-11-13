# Tutorial: Distributing Blueprints via Crates and Quests

Blueprints make fantastic rewards for loot crates, battle passes, and questlines. This tutorial covers how to integrate CraftingBlueprints safely into popular third-party plugins.

---

## 1. The Core Console Reward Command

Whenever a third-party plugin executes a console command to reward a player, use:

```text
cb give %player% <blueprint_id> [amount]
```

> [!NOTE]
> `/cb give` features **Physical Preservation**. If the player's inventory is full when opening a crate or completing a quest, remaining blueprint maps will safely drop to their feet on the ground rather than vanishing into thin air.

---

## 2. Integrating with CrazyCrates

In your CrazyCrates config (e.g. `plugins/CrazyCrates/Crates/MythicCrate.yml`):

```yaml
Prize:
  DisplayName: "<gradient:#FF5555:#FFAA00><bold>Ancient Netherite Blueprint</bold></gradient>"
  DisplayItem: "FILLED_MAP"
  DisplayAmount: 1
  Lore:
    - "<gray>Win a rare schematic allowing you to forge</gray>"
    - "<gray>ancient Netherite equipment.</gray>"
  Commands:
    - "cb give %player% ancient_netherite_smithing 1"
  Chance: 5
  MaxRange: 100
```

---

## 3. Integrating with Quests / BetonQuest

### Quests (by Pukejoy_1 / HappyPikachu)
In your quest rewards configuration:
```yaml
rewards:
  commands:
    - "cb give <player> dragon_slayer_blade 1"
```

### BetonQuest
In `events.yml`:
```yaml
reward_blueprint: "command cb give %player% dragon_slayer_blade 1"
```
