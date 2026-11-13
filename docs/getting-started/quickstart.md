# Quickstart Guide

This guide walks you through the core gameplay loops of CraftingBlueprints, from acquiring your first blueprint item to crafting custom gear.

---

## 1. What is a Blueprint?

A **Blueprint** represents technical knowledge required to craft an item. In CraftingBlueprints, blueprints exist in two primary forms:

1. **Physical Blueprint (Map or Item)**: An in-game item (by default rendered on a Minecraft map with full schematics and instructions). Players can inspect it, trade it, store it in chests, or use it to learn the recipe.
2. **Unlocked Recipe (Player Data)**: Once discovered or consumed, the player's account (UUID) permanently unlocks the ability to craft that recipe across the server network.

---

## 2. Testing Your First Blueprint

To quickly test the plugin in-game:

1. Ensure you have the `craftingblueprints.give` permission or are server operator (`/op`).
2. Give yourself one of the default example blueprints:
   ```text
   /cb give <your_name> default_sword 1
   ```
3. Open your inventory. You will receive a rendered technical blueprint showing the schematic, required ingredients, and target item.
4. Open the blueprint catalog GUI:
   ```text
   /cb menu
   ```
   Or browse the registered list:
   ```text
   /cb item list
   ```

---

## 3. The Crafting Experience

Depending on your server configuration:

* **Ownership Checking**: If `item-ownership: true` in `config.yml`, blueprints are bound to the player who unlocked them.
* **Standard Crafting Table**: When placing the required ingredients in a crafting table, the plugin intercepts the recipe event:
  * If the player **owns or holds** the required blueprint, the item crafts normally with full shift-click capacity support.
  * If the player **does not own** the blueprint, crafting is blocked with an informative message.
* **Crafter Block (1.21+)**: Redstone-driven Crafter blocks check the surrounding context or designated permissions before executing automated crafts.

---

## 4. Next Steps

* [Define custom blueprints in YAML](../blueprints/configuration.md)
* [Explore aesthetic map backgrounds and guilloche frames](../blueprints/visuals.md)
* [Review all commands and permissions](../features/commands-permissions.md)
