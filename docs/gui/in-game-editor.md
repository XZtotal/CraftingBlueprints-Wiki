# In-Game Blueprint Editor (/cb item edit)

CraftingBlueprints allows server administrators to modify blueprint settings visually without opening text editors or rebooting the server.

---

## Opening the Editor

To open the in-game editor for a specific blueprint:

```text
/cb item edit <blueprint_id>
```

**Permission Required**: `craftingblueprints.item.edit` (Default: `op`).

---

## Available Options in the Editor Panel

The visual editor presents interactive buttons allowing you to:

1. **Adjust Pricing**: Increase or decrease purchase (`price`) and sell (`sell_price`) values.
2. **Toggle Durability**: Switch between **Permanent**, **Craft-Limited**, and **Time-Limited** modes.
3. **Change Physical Material**: Switch the physical item between `FILLED_MAP`, `PAPER`, `BOOK`, or other Bukkit items.
4. **Select Map Backgrounds**: Visually browse and select from the 20+ built-in background textures.
5. **Adjust Rarity Tiers**: Switch between `COMMON`, `UNCOMMON`, `RARE`, `EPIC`, and `MYTHIC`.

---

## Saving Changes

* Clicking **Save & Apply** automatically writes the updated settings back to the corresponding YAML file in `plugins/CraftingBlueprints/blueprints/`.
* The plugin hot-reloads the updated blueprint immediately across the server without a restart.
