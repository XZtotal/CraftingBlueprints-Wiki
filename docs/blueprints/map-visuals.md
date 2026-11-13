# Map Schematics, Visuals & Guilloche Frames

CraftingBlueprints features an advanced map rendering engine that composites photorealistic technical drafting schematics, recipe grids, mathematical banknote-style borders, and custom artwork directly onto in-game Minecraft Maps.

---

## Enabling Map Graphics

Ensure the following setting is active in `plugins/CraftingBlueprints/config.yml`:

```yaml
# Enable high-resolution rendered schematics on Minecraft maps
images-on-maps: true
```

When enabled, any blueprint using `item.material: FILLED_MAP` renders a custom 128x128 pixel visual schematic.

---

## Built-In Background Catalog

CraftingBlueprints includes over 20 pre-calibrated background textures that you can reference immediately by name:

| Texture ID | Aesthetic Style & Theme |
| :--- | :--- |
| `texture_blueprint_grid` | Classic cyan technical drafting blueprint grid. |
| `texture_isometric_drafting` | 30-degree isometric engineering grid with focal guide lines. |
| `texture_technical_slate` | Matte dark charcoal architectural slate with subtle measurements. |
| `texture_carbon_weave` | High-tech diagonal carbon fiber weave. |
| `texture_hex_cyber_grid` | Futuristic glowing honeycomb matrix. |
| `texture_celestial_astral` | Deep midnight astral constellation charts. |
| `texture_dwarven_magma` | Chiseled volcanic basalt with glowing magma veins. |
| `texture_frost_crystal` | Glacial crystalline frost patterns with cold cyan specular highlights. |
| `texture_imperial_gold` | Opulent baroque gold-leaf filigree over royal velvet. |
| `texture_nautical_astrolabe` | Antique marine navigation chart with brass astrolabe rings. |
| `texture_parchment_aged` | Weathered ancient papyrus with burned edges. |
| `texture_rainbow_aurora` | Shifting northern lights atmospheric gradient. |
| `texture_rainbow_bismuth` | Stepped geometric bismuth crystal rainbow staircase. |
| `texture_rainbow_holofoil` | Prismatic holographic trading card sheen. |
| `texture_rainbow_nebula` | Deep cosmos stellar nebula with stellar dust clouds. |
| `texture_riveted_steel` | Heavy industrial boiler plate with reinforced rivets. |
| `texture_royal_damask` | Ornate gothic floral damask tapestry. |
| `texture_sandstone_hieroglyph` | Weathered desert sandstone with carved glyphs. |
| `texture_transmutation_circle` | Alchemical transmutation geometric circle. |
| `texture_verdigris_botanical` | Oxidized copper flora with intricate vine traceries. |
| `texture_void_grimoire` | Eldritch void energy fractures and cosmic rifts. |

---

## Configuring Visuals on a Blueprint

Add the `rendering:` section to any blueprint definition:

```yaml
rendering:
  # Any built-in texture ID or custom PNG name
  background: "texture_dwarven_magma"

  # Rarity tier: COMMON, UNCOMMON, RARE, EPIC, MYTHIC
  tier: "MYTHIC"

  # Enable mathematical banknote-style spirograph security borders
  guilloche_border: true

  # Overlays the 3x3 crafting matrix in the corner of the map
  show_ingredients: true
```

---

## Rarity Tiers (Tier Aesthetics)

The `tier:` property automatically themes the outer border, corner geometry, and gradient highlights of the map:

* **`COMMON`**: Clean monochrome border. Ideal for basic wooden and stone tools.
* **`UNCOMMON`**: Subtle emerald green palette with reinforced geometric corners.
* **`RARE`**: Azure sapphire styling with decorative corner brackets.
* **`EPIC`**: Royal amethyst filigree with ornate rosette accents.
* **`MYTHIC`**: Iridescent celestial styling featuring multi-frequency **Guilloche curves** (spirograph bank-note security patterns) that prevent visual repetition.

---

## Using Custom Background Images

You can import your own server logos, custom artwork, or guild emblems:

1. Create a **128x128 pixel** image in **32-bit RGBA PNG** format.
2. Place the file inside:
   ```text
   plugins/CraftingBlueprints/images/backgrounds/my_custom_logo.png
   ```
3. Reference the file in your YAML blueprint without the `.png` extension:
   ```yaml
   rendering:
     background: "my_custom_logo"
   ```
4. Run `/cb reload blueprints` to load the image immediately without restarting the server.
