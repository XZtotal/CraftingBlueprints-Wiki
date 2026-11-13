# Messages, Colors & MiniMessage

CraftingBlueprints uses Kyori **MiniMessage** for rich, modern text formatting across chat messages, GUI titles, and blueprint item lore.

---

## Language Files

CraftingBlueprints ships with two default language files:

* `plugins/CraftingBlueprints/messages_en.yml` (English)
* `plugins/CraftingBlueprints/messages_es.yml` (Spanish)

You can customize any message in these files. To apply changes without restarting your server, execute:

```text
/cb reload lang
```

---

## MiniMessage Formatting Cheat-Sheet

MiniMessage replaces legacy `&a` / `§a` color codes with intuitive, tag-based styling that supports true 24-bit RGB colors and gradients.

### 1. Hex Colors & Named Colors
You can use standard color names or precise hex color codes:

```text
<#00FFAA>Teal Text</#00FFAA>
<gold>Golden Text</gold>
<color:#FF5555>Custom Red</color>
```

### 2. Multi-Color Gradients
Create smooth transitions between two or more hex colors:

```text
<gradient:#00AAFF:#00FFAA><bold>Diamond Sword Blueprint</bold></gradient>
<gradient:#FF0055:#FFAA00:#FFFF00>Fiery Battleaxe</gradient>
```

### 3. Font Formatting
Add emphasis and typography effects:

```text
<bold>Bold Text</bold>
<italic>Italic Text</italic>
<underlined>Underlined Text</underlined>
<strikethrough>Strikethrough</strikethrough>
<rainbow>Rainbow Animation</rainbow>
```

---

## Dynamic Placeholders

When authoring blueprint lore in YAML or customizing language messages, use context placeholders. They resolve dynamically in real time:

| Placeholder | Resolves To | Example Output |
| :--- | :--- | :--- |
| `{player}` | The player's username. | `Steve` |
| `{blueprint_target}` | The clean name of the recipe's result material. | `Diamond Sword` |
| `{blueprint_name}` | The formatted display name of the blueprint. | `Ancient Battleaxe` |
| `{price}` | Purchase cost in economy currency. | `5000.0` |
| `{sell_price}` | Sell value in economy currency. | `1200.0` |
| `{uses}` | Remaining crafting uses (or `Unlimited`). | `5` |
| `{time}` | Remaining time before expiration. | `23h 45m` |
| `{tier}` | Rarity tier name. | `MYTHIC` |

### Example: Lore Card with Placeholders

```yaml
lore:
  - "<gray>Target Equipment:</gray> <white>{blueprint_target}</white>"
  - "<gray>Rarity Tier:</gray> <gold><bold>{tier}</bold></gold>"
  - ""
  - "<yellow>Remaining Crafts:</yellow> <white>{uses}</white>"
  - "<yellow>Shop Value:</yellow> <green>${price}</green>"
  - ""
  - "<dark_gray>Right-click in hand to unlock this recipe.</dark_gray>"
```
