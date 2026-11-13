# Tutorial: 3-Use Magic Forge Scrolls for RPG Servers

In MMORPG, fantasy, and dungeon servers, legendary equipment should feel rare and earned. Giving players permanent access to endgame weapons can quickly flood the player market and break economic tiers.

This tutorial guides you through creating a **Limited-Use Magic Forge Scroll** that allows an adventurer to craft a legendary weapon **exactly 3 times** before the scroll's magic dissolves and the recipe locks again.

---

## Step 1: Restrict the Target Weapon

Open `plugins/CraftingBlueprints/config.yml` and ensure your target weapon is restricted:

```yaml
restrictions:
  mode: "restricted-only"
  restricted-items:
    - "netherite_sword"
```

---

## Step 2: Configure the 3-Use Magic Scroll

Create a new file named `rpg_forge_scrolls.yml` inside `plugins/CraftingBlueprints/blueprints/`:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  astral_blade_scroll:
    # Target item to unlock
    blueprint: NETHERITE_SWORD
    name: "<gradient:#9900EE:#00FFFF><bold>Scroll of the Astral Blade</bold></gradient>"

    # Durability Model: 3 crafts only; no temporal timer
    permanent: false
    time: 0
    uses: 3

    # Physical item: Enchanted Ancient Parchment
    item:
      material: PAPER
      custom_model_data: 2005
      glowing: true

    # Visual map aesthetic if inspected in catalog
    map:
      theme: void_grimoire      # Deep obsidian violet arcane grimoire
      frame: runic              # Gothic runic apex corner architecture
      badge: smithing           # Workstation plaque
      icon_scale: 2
      drop_shadow: true
      stamp:
        show: true
        style: wax_seal
        text: "3x"
        border_color: "#a855f7"

    # Lore card with dynamic uses placeholder
    lore:
      - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
      - "<gray>Artifact Type:</gray> <light_purple>Arcane Forge Scroll</light_purple>"
      - "<gray>Remaining Forges:</gray> <yellow><bold>{uses} / 3 crafts</bold></yellow>"
      - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
      - "<yellow>Allows a master smith to forge the Astral</yellow>"
      - "<yellow>Blade up to 3 times before dissolving.</yellow>"
      - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
      - "<dark_gray>Right-click in hand to bind this knowledge.</dark_gray>"
```

Hot-reload the blueprints:
```text
/cb reload blueprints
```

---

## Step 3: Grant the Scroll & Test Progression

### 1. Granting the Scroll via Command:
```text
/cb give Steve astral_blade_scroll 1
```

### 2. Binding the Knowledge:
The player places the scroll into their main hand and **Right-Clicks**. A sound effect plays, and the player unlocks 3 crafting uses.

### 3. First Craft (Counter: 3 $\rightarrow$ 2):
The player crafts their first sword. Chat and action bar notify the player:
```text
[CraftingBlueprints] Recipe crafted! Remaining uses: 2
```

### 4. Shift-Click Bulk Crafting Test:
* If the player places materials for 5 swords into the crafting matrix and **Shift-Clicks**:
* The engine evaluates: $\min(\text{MatrixCrafts: 5}, \; \text{InventorySpace: 36}, \; \text{RemainingUses: 2}) = \mathbf{2}$.
* Exactly 2 swords are crafted into their inventory.
* Remaining uses decrement from 2 to 0.
* The recipe immediately locks, and the remaining materials for 3 swords remain safely untouched inside the crafting table!
