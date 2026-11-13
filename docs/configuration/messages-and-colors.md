# Messages, Colors & MiniMessage Localization

CraftingBlueprints features a modern **Kyori MiniMessage** localization engine (`me.xztotal.plugins.craftingblueprints.i18n`), replacing legacy section sign (`§`) color codes with rich, component-based formatting, true 24-bit RGB hex colors, multi-stop gradients, and dynamic context placeholders.

---

## Language Configuration & Hot-Reloading

The plugin ships with two canonical language files in `plugins/CraftingBlueprints/`:

* `messages_en.yml` (English)
* `messages_es.yml` (Spanish - canonical primary)

To reload your language files after editing without restarting your server, execute:

```text
/cb reload lang
```

!!! tip "Automatic Per-Player Locale Resolution"
    On Paper servers, CraftingBlueprints automatically detects the Minecraft client language of each connecting player (`player.locale()`). A Spanish player automatically receives Spanish feedback from `messages_es.yml`, while an English player receives English feedback from `messages_en.yml`. If a player's client language is not installed, the plugin falls back to `defaultLocaleRef`.

---

## MiniMessage Formatting Cheat-Sheet

MiniMessage uses intuitive XML-style tags that support 24-bit Truecolor gradients, shadows, and interactive components.

### 1. Hex Colors & Named Colors

=== "Hex Colors (#RRGGBB)"
    ```text
    <#00FFAA>Vibrant Cyan-Green Text</#00FFAA>
    <#FF5555>Coral Warning Alert</#FF5555>
    <color:#38BDF8>Sky Sapphire</color>
    ```

=== "Named Colors"
    ```text
    <gold>Golden Accents</gold>
    <aqua>Technical Blue</aqua>
    <dark_purple>Eldritch Void</dark_purple>
    <green>Successful Action</green>
    ```

---

### 2. Multi-Stop Gradients (`<gradient:#HEX1:#HEX2>`)

Gradients interpolate smoothly across characters, making blueprint names and title headers stand out:

```text
<!-- 2-Color Linear Gradient -->
<gradient:#00AAFF:#00FFAA><bold>Diamond Sword Blueprint</bold></gradient>

<!-- 3-Color Fiery Progression -->
<gradient:#FF0055:#FFAA00:#FFFF00><bold>Netherforged Battleaxe</bold></gradient>

<!-- Mythic Cosmic Violet to Rose -->
<gradient:#9900EE:#FF0077><bold>Scroll of the Astral Relic</bold></gradient>
```

---

### 3. Font Styling & Special Effects

```text
<bold>Bold Text</bold>
<italic>Italic Lore Note</italic>
<underlined>Important Notice</underlined>
<strikethrough>Crossed Out Price</strikethrough>
<obfuscated>Unreadable Secret</obfuscated>
<rainbow>Animated Rainbow Cycle</rainbow>
```

---

### 4. Global Template Macros

CraftingBlueprints registers built-in global template macros that you can reuse in any custom message:

| Macro Tag | Formatted Output | Purpose |
| :--- | :--- | :--- |
| `<prefix>` | `<gradient:#00AAFF:#00FFAA><bold>[CraftingBlueprints]</bold></gradient> ` | Standard plugin chat prefix. |
| `<border>` | `<dark_gray><strikethrough>--------------------------------------------------</strikethrough></dark_gray>` | Clean horizontal divider line for menus and summaries. |
| `<header_prefix>` | `<gradient:#FFAA00:#FF5500><bold>»</bold></gradient> ` | Decorative bullet prefix for command help and lists. |

---

## Dynamic Context Placeholders

When authoring blueprint lore in YAML, configuring GUI buttons, or customizing language strings, use named context placeholders. These placeholders resolve dynamically at runtime:

| Placeholder | Description | Resolved Example |
| :--- | :--- | :--- |
| `{player}` | The username of the interacting player. | `Alex` |
| `{blueprint_name}` | Formatted MiniMessage display name of the blueprint. | `<gradient:#00AAFF:#00FFAA>Diamond Sword Blueprint</gradient>` |
| `{target_item}` | Clean vanilla or custom name of the target recipe output. | `Diamond Sword` |
| `{blueprint_target}` | Alias for `{target_item}`. | `Netherite Chestplate` |
| `{uses}` | Remaining crafting uses (or `Unlimited`). | `3` or `Unlimited` |
| `{time}` | Remaining countdown time before expiration. | `23h 45m` or `Permanent` |
| `{price}` | Vault purchase cost in server economy currency. | `5000.0` |
| `{sell_price}` | Vault sell value refunded when selling back. | `1250.0` |
| `{tier}` | Formatted rarity tier string configured on the blueprint. | `MYTHIC` |
| `{blueprints_count}` | Total number of child recipes included in a package item. | `4` |
| `{pool_size}` | Total possible reward outcomes in a mystery scroll. | `12` |

---

## Production Lore Card Template

Below is a production-ready lore layout demonstrating gradients, named colors, and placeholders for high-tier blueprints:

```yaml
lore:
  - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
  - "<gray>Target Equipment:</gray> <white>{target_item}</white>"
  - "<gray>Schematic Name:</gray> {blueprint_name}"
  - "<gray>Classification:</gray> <gold><bold>{tier}</bold></gold>"
  - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
  - "<yellow>Remaining Forges:</yellow> <white>{uses}</white>"
  - "<yellow>Licensing Duration:</yellow> <aqua>{time}</aqua>"
  - "<yellow>Vault Purchase:</yellow> <green>${price}</green>"
  - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
  - "<dark_gray>Hold map in hand and Right-Click to memorize.</dark_gray>"
```

---

## Interactive Click & Hover Tags

For custom announcement broadcasts or quest dialogues, MiniMessage supports interactive components:

```text
<click:run_command:'/cb menu'><hover:show_text:'<green>Click to open your progress menu!</green>'><yellow>[Click Here to View Blueprints]</yellow></hover></click>
```
