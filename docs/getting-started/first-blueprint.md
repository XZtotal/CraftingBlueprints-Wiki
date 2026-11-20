# Hands-On Quickstart: Your First Blueprint

This 3-minute hands-on tutorial walks you through creating, validating, granting, and crafting your very first custom blueprint from scratch on a live server.

---

## Goal

We will restrict the crafting of the **Diamond Sword** (`DIAMOND_SWORD`) so that players cannot forge it without first unlocking a physical schematic item.

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│        Player Inventory         │       │          Crafting Table         │
│                                 │       │                                 │
│  [Blueprint: Diamond Sword]     │ ────> │  [Diamond]                      │ ────>  [Diamond Sword]
│  (Right-click to learn/consume) │       │  [Diamond]                      │        (Crafted!)
│                                 │       │  [Stick  ]                      │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## Step 1: Create the Blueprint File

In your server's `plugins/CraftingBlueprints/blueprints/` folder, create a new file named `starter_sword.yml`.

Paste the following production-ready configuration:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
# ==============================================================================
# CraftingBlueprints - Starter Sword Definition
# ==============================================================================

singles:
  starter_diamond_sword:
    blueprint: DIAMOND_SWORD
    name: "<gradient:#00AAFF:#00FFAA><bold>Diamond Sword Schematic</bold></gradient>"
    lore:
      - "<gray>A master blacksmith's technical schematic."
      - "<gray>Grants permanent knowledge to forge diamond swords."
      - ""
      - "<yellow>Right-click in hand to learn!"
    permanent: true
    time: 0
    uses: 0
    price: 1500.0
    sell_price: 375.0
    item:
      material: PAPER
      glowing: true
```

### Key Field Breakdown

| Field | Value | Purpose |
| :--- | :--- | :--- |
| `# yaml-language-server:` | `./blueprint.schema.json` | Enables real-time schema validation and IntelliSense autocompletion in VS Code and IntelliJ IDEA. |
| `starter_diamond_sword` | *(Unique Key)* | The unique identifier used in administrative commands (`/cb give <player> starter_diamond_sword`). |
| `blueprint:` | `DIAMOND_SWORD` | The exact Minecraft recipe output or material targeted by this blueprint. |
| `name:` & `lore:` | MiniMessage text | Display name and description shown in item tooltips, featuring gradients and colors. |
| `permanent: true` | `true` | When unlocked, knowledge is permanent. It never expires over time or runs out of uses. |
| `item:` | `material: PAPER` | The physical representation of the blueprint item in player inventories. |

> [!NOTE]
> **Standard vs. Extended Edition Item Representation**  
> In **CraftingBlueprints Standard Edition**, physical blueprints are rendered as standard Minecraft items (`PAPER`, `BOOK`, or custom models via `custom_model_data`). If running **CraftingBlueprints Extended Edition**, you can additionally declare a `map:` block to render photorealistic 128x128 technical drawings with procedural textures and Guilloché frames.

---

## Step 2: Ensure Recipe Restriction

By default, CraftingBlueprints is permissive: items are craftable unless listed in your restrictions.

Open `plugins/CraftingBlueprints/config.yml` and verify that `diamond_.*` is listed under `restrictions.restricted-items`:

```yaml
restrictions:
  restricted-items:
    - "diamond_.*"
    - "netherite_.*"
```

Save the file.

---

## Step 3: Reload & Validate

Verify your new configuration without restarting the server:

### 1. Validate Syntax (`/cb validate`)
Execute the dry-run validation command:

```text
/cb validate
```

CraftingBlueprints performs an atomic lint check across all YAML files, checking for duplicate IDs, missing materials, and formatting errors. You should see:

```text
[CraftingBlueprints] Validation passed: 0 errors, 0 warnings.
```

### 2. Hot-Reload Blueprints (`/cb reload`)
Apply the changes into live server memory:

```text
/cb reload blueprints
```

The console confirms:

```text
[CraftingBlueprints] Successfully registered 1 new blueprint: starter_diamond_sword.
```

---

## Step 4: In-Game Verification

Join your server and follow this step-by-step test sequence:

### 1. Attempt Crafting Without the Blueprint
Place two Diamonds and a Stick into a Crafting Table.

* **Locked Output Preview**: A red barrier overlay (`LOCKED_OVERLAY`) or locked indicator appears in the result slot.
* **Click Feedback**: Attempting to click the output displays a localized warning message in chat:
  ```text
  You do not have the required blueprint to craft Diamond Sword!
  ```
* **Anti-Exploit Protection**: The ingredients are not consumed, and the sword cannot be shift-crafted.

### 2. Check Progression Status (`/cb cani`)
Run the query command to verify your player permissions:

```text
/cb cani diamond_sword
```

The output will state:
```text
Item: Diamond Sword
Required Blueprint: starter_diamond_sword
Unlocked: NO
```

### 3. Grant the Blueprint Item
Give yourself the physical blueprint item:

```text
/cb give @s starter_diamond_sword
```

A glowing paper item titled **Diamond Sword Schematic** will appear in your inventory.

### 4. Unlock the Blueprint
Hold the schematic in your main hand and **right-click**.
* You will hear an experience chime.
* A message confirms: `Unlocked blueprint: Diamond Sword Schematic!`
* The schematic is registered to your persistent player profile.

### 5. Forge the Sword
Re-open the Crafting Table with two Diamonds and a Stick.
* The Diamond Sword now appears normally in the output slot.
* Click to retrieve your crafted weapon!

---

## Next Steps

Congratulations! You have successfully configured and verified your first blueprint.

* **Explore Recipe Rules**: Discover advanced pattern matching, category prefixes (`smelt:`, `potion:`), and universal gating in [Recipe Restrictions](../progression/recipe-restrictions.md).
* **Organize Permission Tiers**: Group recipes into ranks (`default`, `vip`, `pro`) with [Hierarchical Permission Groups](../progression/permission-groups.md).
* **Modular Configuration**: Learn how to split rules across files in [Modular Configurations](../progression/modular-configs.md).
