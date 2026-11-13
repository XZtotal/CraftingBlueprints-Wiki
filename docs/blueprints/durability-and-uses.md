# Durability, Limits & Limited Uses

CraftingBlueprints offers three distinct durability models to balance your server's crafting progression. You can make recipes permanent, time-limited, or craft-count limited.

---

## 1. Permanent Recipes

The player learns the recipe once and keeps the ability to craft it indefinitely:

```yaml
singles:
  iron_pickaxe_blueprint:
    blueprint: IRON_PICKAXE
    name: "<white>Iron Pickaxe Schematic</white>"
    permanent: true
    time: 0
    uses: 0
```

* **Best For**: Core tools, basic weapons, and standard survival items where gating is meant as a one-time milestone.

---

## 2. Craft-Count Limited Blueprints (Uses)

The player unlocks the recipe, but each completed craft decrements an internal counter. When the counter reaches zero, the recipe is consumed and automatically locked again:

```yaml
singles:
  dragon_slayer_blade:
    blueprint: NETHERITE_SWORD
    name: "<gradient:#9900EE:#FF0055><bold>Dragon Slayer Forge Scroll</bold></gradient>"
    permanent: false
    time: 0
    uses: 3 # Can craft exactly 3 swords before expiring
```

* **Best For**: Powerful endgame gear, dungeon loot, RPG forge scrolls, or event rewards where you want to prevent players from flooding the server market.
* **Shift-Craft Protection**: If a player crafts with Shift, the plugin calculates the exact number of crafted items and decrements the remaining uses accordingly.

---

## 3. Time-Limited Blueprints (Expiration Timer)

The player unlocks the recipe for a set duration (measured in seconds). After the timer expires, the recipe is revoked:

```yaml
singles:
  weekend_event_crossbow:
    blueprint: CROSSBOW
    name: "<gold><bold>Weekend Tournament Crossbow</bold></gold>"
    permanent: false
    time: 86400 # 24 hours (86400 seconds)
    uses: 0     # Unlimited crafts during those 24 hours
```

Common time conversions:
* **1 Hour**: `3600`
* **12 Hours**: `43200`
* **24 Hours (1 Day)**: `86400`
* **7 Days (1 Week)**: `604800`
* **30 Days (1 Month)**: `2592000`

---

## 4. Combining Time and Uses

You can combine both limits. Whichever limit runs out first will expire the blueprint:

```yaml
singles:
  seasonal_relic_shield:
    blueprint: SHIELD
    permanent: false
    time: 604800 # Expires in 7 days
    uses: 5      # ...or expires after 5 crafts (whichever comes first)
```

---

## How Players Track Remaining Uses

Players can check their active blueprints, remaining time, and craft counts at any time in-game:

1. By running the player menu command:
   ```text
   /cb menu
   ```
2. By hovering over the blueprint item in the catalog (`/cb item list`), which displays live placeholders:
   ```text
   Remaining Uses: 2/5
   Expires in: 3d 14h
   ```
