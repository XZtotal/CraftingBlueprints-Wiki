# Map Graphics & Aesthetic Rendering

CraftingBlueprints contains an internal map rendering engine that composites photorealistic technical drafting schematics, recipe grids, mathematical borders, and custom background artwork directly onto in-game Minecraft Maps.

---

## Enabling Map Graphics

To enable map schematics in `config.yml`:

```yaml
# Enable high-resolution rendered schematics on Minecraft maps
images-on-maps: true
```

When enabled, physical blueprints given to players with `item.material: FILLED_MAP` display custom 128x128 pixel-art schematics.

---

## Built-In Background Textures

CraftingBlueprints includes over 20 pre-rendered, mathematically calibrated background textures ready for use in any blueprint definition:

| Texture ID | Theme & Aesthetic Description |
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

In your blueprint YAML file, define the `rendering:` section:

```yaml
rendering:
  background: "texture_celestial_astral" # Any built-in ID or custom PNG name
  tier: "MYTHIC"                         # COMMON, UNCOMMON, RARE, EPIC, MYTHIC
  guilloche_border: true                 # Mathematical guilloche frame
  show_ingredients: true                 # Displays the 3x3 crafting matrix overlay
  watermark: "custom_watermark_crest"    # Subtle center watermark
```

---

## Rarity Tiers & Mathematical Guilloche

Each rarity tier automatically adjusts the map's outer border, internal gradient mesh, and visual accents:

* **COMMON**: Clean monochrome border, optimal for basic tools and vanilla items.
* **UNCOMMON**: Subtle emerald/forest accents with reinforced geometric corners.
* **RARE**: Sapphire/azure palette with decorative corner brackets.
* **EPIC**: Royal amethyst filigree with intricate rosette corners.
* **MYTHIC**: Celestial iridescence featuring multi-frequency **guilloche curves** (spirograph bank-note security patterns) that prevent visual repetition.

---

## Custom Backgrounds & Images

You can place your own custom `.png` images inside:
```text
plugins/CraftingBlueprints/images/backgrounds/
```
Ensure your images are **128x128 pixels** in standard 32-bit RGBA PNG format. Once placed, reference them directly in your YAML blueprints by filename without the extension:

```yaml
rendering:
  background: "my_custom_texture"
```
Then run `/cb reload blueprints` to load the new artwork without restarting the server.
