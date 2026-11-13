# Tutorial: Distributing Blueprints via Crates & Quests

Blueprints make fantastic high-value rewards for loot crates, battle passes, dungeon boss drops, and questlines. Because CraftingBlueprints guarantees **Physical Overflow Preservation**, players will never lose blueprint items even if their inventories are completely full when completing a quest or opening a crate.

---

## 1. The Core Console Reward Command

Whenever a third-party plugin executes a console command to reward an online player, execute:

```text
cb give %player% <blueprint_id> [amount]
```

!!! note "Physical Preservation Guarantee"
    If the recipient's inventory happens to be 100% full when a crate opens or a quest finishes, CraftingBlueprints automatically drops the leftover blueprint items safely onto the ground directly at the player's feet (`world.dropItem(...)`). No items ever vanish into thin air.

---

## 2. Integrating with CrazyCrates

In your CrazyCrates configuration (e.g. `plugins/CrazyCrates/Crates/MythicCrate.yml`), add the blueprint as a reward prize:

```yaml
Crate:
  CrateType: CSGO
  CrateName: "<gradient:#9900EE:#FF0055><bold>Mythic Forge Crate</bold></gradient>"

Prizes:
  AncientNetheriteBlueprint:
    DisplayName: "<gradient:#FF5555:#FFAA00><bold>Ancient Netherite Blueprint</bold></gradient>"
    DisplayItem: "FILLED_MAP"
    DisplayAmount: 1
    Lore:
      - "<gray>Win a rare schematic allowing you to forge</gray>"
      - "<gray>endgame Netherite equipment in Smithing Tables.</gray>"
      - ""
      - "<yellow>Chance:</yellow> <gold>5%</gold>"
    MaxRange: 100
    Chance: 5
    Commands:
      # Console execution command:
      - "cb give %Player% ancient_netherite_smithing 1"
```

---

## 3. Integrating with Quests (by Pukejoy_1 / HappyPikachu)

In your Quests configuration file (`plugins/Quests/quests.yml`):

```yaml
quests:
  custom_blacksmith_trial:
    name: "The Master Blacksmith's Trial"
    npc-giver-id: 12
    redo-delay: 86400
    stages:
      ordered:
        '1':
          break-block-names:
            - ANCIENT_DEBRIS
          break-block-amounts:
            - 8
    rewards:
      money: 5000
      exp: 1200
      commands:
        # Reward the player with the 3-use magic forge scroll
        - "cb give <player> astral_blade_scroll 1"
```

---

## 4. Integrating with BetonQuest

In your BetonQuest events configuration (`plugins/BetonQuest/default/events.yml`):

```yaml
events:
  # Command event executed from console
  reward_netherite_blueprint: "command cb give %player% ancient_netherite_smithing 1"
  reward_rpg_scroll: "command cb give %player% astral_blade_scroll 1"
```

In your quest conversation or objective rewards:

```yaml
conversations:
  dungeon_master:
    quester: "Dungeon Master"
    first: "greeting"
    NPC_options:
      greeting:
        text: "You have defeated the Nether Abomination! Here is the ancient smithing schematic."
        events:
          - "reward_netherite_blueprint"
```
