# Tutorial: Gating Netherite Gear Behind Bastion Loot in SMP

In vanilla Minecraft, dedicated players often rush Netherite armor and tools within the first 48 hours of a server launch, trivializing PvE encounters and crashing survival economies.

This step-by-step cookbook tutorial shows you how to configure CraftingBlueprints to **gate all Netherite equipment behind rare, physical blueprint maps** that can only be found in Nether Bastion Remnant loot chests.

---

## Step 1: Enable Whitelist Mode in `config.yml`

Open `plugins/CraftingBlueprints/config.yml` and ensure your server is running in Selective Whitelist Mode with Netherite equipment restricted:

```yaml
# ------------------------------------------------------------ #
# Recipe Restrictions & Whitelist Mode
# ------------------------------------------------------------ #

restrictions:
  # In 'restricted-only' mode, all basic wood, stone, iron, and diamond
  # recipes remain completely free and natural for all players!
  mode: "restricted-only"

  # ONLY items matching this list will require an unlocked blueprint:
  restricted-items:
    - "netherite_sword"
    - "netherite_pickaxe"
    - "netherite_axe"
    - "netherite_shovel"
    - "netherite_hoe"
    - "netherite_helmet"
    - "netherite_chestplate"
    - "netherite_leggings"
    - "netherite_boots"
```

Save the file and execute:
```text
/cb reload config
```

---

## Step 2: Create the Ancient Netherite Blueprint

Create a new file named `netherite_progression.yml` inside `plugins/CraftingBlueprints/blueprints/`:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  ancient_netherite_smithing:
    # Target item unlocked in 3-slot Smithing Table
    blueprint: NETHERITE_CHESTPLATE
    name: "<gradient:#FF5555:#FFAA00><bold>Ancient Netherite Smithing Technique</bold></gradient>"

    # Permanent unlock: once learned, the player can upgrade Netherite indefinitely
    permanent: true
    time: 0
    uses: 0

    # In-game physical item
    item:
      material: FILLED_MAP
      glowing: true

    # Map visual schematic
    map:
      theme: dwarven_magma       # Molten volcanic basalt background
      frame: rosette             # Regal Guilloché corner rosettes
      badge: smithing            # Workstation icon on top-left
      icon_scale: 2
      drop_shadow: true
      item_outline:
        enabled: true
        width: 2
        color: "gold"

    # Lore card
    lore:
      - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
      - "<gray>Classification:</gray> <gold><bold>Ancient Smithing Knowledge</bold></gold>"
      - "<gray>Rarity Tier:</gray> <light_purple>MYTHIC</light_purple>"
      - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
      - "<yellow>Grants the forbidden technique required</yellow>"
      - "<yellow>to forge Netherite gear in a Smithing Table.</yellow>"
      - "<dark_gray><strikethrough>---------------------------------</strikethrough></dark_gray>"
      - "<dark_gray>Hold this map and Right-Click to memorize.</dark_gray>"
```

Reload the blueprints to activate the new schematic:
```text
/cb reload blueprints
```

---

## Step 3: Add to Bastion Chest Loot Tables

You can distribute this blueprint to players via vanilla datapack loot tables or popular loot plugins.

### Option A: Via MythicDrops or CustomLoot Plugin
Configure the console reward command in your loot table configuration:

```yaml
commands:
  - "cb give %player% ancient_netherite_smithing 1"
```

### Option B: Vanilla Datapack Loot Table Injection
In your server datapack (e.g. `data/minecraft/loot_tables/chests/bastion_treasure.json`):

```json
{
  "type": "minecraft:item",
  "name": "minecraft:filled_map",
  "weight": 15,
  "functions": [
    {
      "function": "minecraft:set_nbt",
      "tag": "{PublicBukkitValues:{\"craftingblueprints:id\":\"ancient_netherite_smithing\"}}"
    }
  ]
}
```

---

## Step 4: Verification & Testing in Survival

1. **Test Failure as Unauthorized Player**:
   * Temporarily deop yourself: `/deop <your_player_name>`
   * Place a Diamond Chestplate, a Netherite Upgrade Smithing Template, and a Netherite Ingot into a Smithing Table.
   * The output slot remains locked! Clicking the result warns that you lack the required blueprint.
2. **Grant & Memorize**:
   * Grant yourself the blueprint map: `/cb give <your_player_name> ancient_netherite_smithing 1`
   * Hold the high-resolution map in hand and **Right-Click**. A chime sound plays and chat confirms you have memorized the recipe.
3. **Test Successful Forging**:
   * Return to the Smithing Table. The Netherite Chestplate is now unlocked and crafts successfully!
