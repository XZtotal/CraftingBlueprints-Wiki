# Map Schematics, Visuals & Guilloche Frames

CraftingBlueprints features an advanced in-game map rendering engine that composites photorealistic technical drafting schematics, banknote-grade Guilloché security borders, procedural item outlines, and custom artwork directly onto in-game Minecraft Maps (`Material.FILLED_MAP`).

---

## Enabling Map Graphics

Ensure map graphics are active in `plugins/CraftingBlueprints/config.yml`:

```yaml
# Enable fabulous BlueprintsItems with images on maps
images-on-maps: true
```

When active, any blueprint configured with `item.material: FILLED_MAP` renders a custom 128x128 pixel visual schematic when held in a player's hand or mounted in an Item Frame.

---

## The Canonical `map:` Configuration Block

Map aesthetics are configured declaratively under the `map:` block of any blueprint:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  excalibur_blade:
    blueprint: NETHERITE_SWORD
    name: "<gradient:#FFD700:#FFA500><bold>Excalibur Holy Blade</bold></gradient>"
    permanent: true

    item:
      material: FILLED_MAP
      glowing: true

    map:
      # 1. Base Background Canvas (Theme name or image filename in images/backgrounds/)
      theme: imperial_gold

      # 2. Corner Geometry Style: bracket, chamfer, diamond, runic, rosette, star, none
      frame: rosette

      # 3. Workstation Plaque Badge: crafting, anvil, brewing, smithing, furnace, none
      badge: smithing

      # 4. Central Item Sprite Scaling & Ambient Shadow
      icon_scale: 2            # Integer scale (1 to 4) using sharp nearest-neighbor interpolation
      drop_shadow: true        # Subtle 2px ambient occlusion shadow behind item sprite

      # 5. Procedural Item Contour Outline
      item_outline:
        enabled: true
        width: 2               # Thickness in pixels (1 to 8)
        color: "rainbow"       # 'rainbow', hex '#ffd700', or gradient
        opacity: 100

      # 6. Technical Cartesian Drafting Grid & Measurement Ticks
      grid:
        show: true
        color: "#334155"
        ticks: true
        ticks_color: "#64748b"

      # 7. Typography Nameplate Banner
      title:
        show: true
        text: "%blueprint_name%" # Supports %blueprint_name% and %bname%
        color: "gold"
        shadow: true

      # 8. Top-Right Status Wax Seal Stamp
      stamp:
        show: true
        style: wax_seal        # wax_seal, clock, box, plaque, none
        text: "PERM"
        border_color: "#22c55e"
```

---

## Complete Catalog of 25 Built-In Textures

CraftingBlueprints bundles 25 pre-calibrated background textures located in `plugins/CraftingBlueprints/images/backgrounds/`. You can reference them directly by name (with or without the `texture_` prefix or `.png` extension):

| Texture Identifier | Theme Category | Aesthetic Description & Visual Style |
| :--- | :--- | :--- |
| `texture_technical_slate` | Architectural | Deep charcoal slate (`#141822`) with micrometer vernier ticks and archival drafting grain. |
| `texture_blueprint_grid` | Drafting | Classic cyan technical blueprint grid with 16px Cartesian drafting coordinates. |
| `texture_isometric_drafting` | Engineering | 30-degree isometric engineering grid with focal convergence guide lines. |
| `texture_carbon_weave` | High-Tech | 4x4 diagonal twill carbon fiber weave with tactile anisotropic reflection. |
| `texture_hex_cyber_grid` | Cybernetic | Futuristic beveled hexagonal matrix with glowing circuit traces. |
| `texture_riveted_steel` | Industrial | Heavy boiler plate with reinforced industrial bevels and structural corner rivets. |
| `texture_dwarven_magma` | Volcanic Forge | Chiseled basalt masonry with cellular Voronoi fissure veins and cooled crusts. |
| `texture_imperial_gold` | Sovereign | 24k gold brocade over royal obsidian amber (`#241408`) with 32-ray radiant sunburst backlighting. |
| `texture_royal_damask` | Gothic Palace | Ornate gothic floral damask tapestry with velvet shadow embossing. |
| `texture_verdigris_botanical` | Alchemical | Forest obsidian (`#0e1e18`) with logarithmic spiral vines and oxidized bronze inlays. |
| `texture_void_grimoire` | Arcane Void | Deep obsidian violet (`#180e28`) with zero synthetic circles, gothic runic interlacing, and amethyst backlighting. |
| `texture_nautical_astrolabe` | Marine | Deep cobalt sapphire (`#0d1832`) with 16-point nautical compass rose, meridian arcs, and star charts. |
| `texture_parchment_aged` | Antiquity | Interlocking papyrus fibers with weathered, burnished edges and organic paper grain. |
| `texture_sandstone_hieroglyph` | Desert Relic | Sunbaked weathered sandstone with precision chiseled alchemical glyphs. |
| `texture_transmutation_circle` | Alchemical | Parametric transmutation matrix with alchemical lozenges and planetary symbols. |
| `texture_frost_crystal` | Glacial | Interlocking ice crystal needles with cold cyan specular highlights. |
| `texture_celestial_astral` | Astral | Midnight indigo cosmic void with natural twinkling star constellations. |
| `texture_rainbow` | Masterpiece | 2D Continuous Gradient Mesh emitting a full prismatic rainbow spectrum into an obsidian focal sanctuary. |
| `texture_rainbow_holofoil` | Secret Rare | Trading-card 45° holographic diffraction sheen with stardust glitter flecks. |
| `texture_rainbow_nebula` | Deep Cosmos | Multi-octave interstellar gas clouds and cosmic dust filaments. |
| `texture_rainbow_aurora` | Atmospheric | Fluid undulating curtains of celestial rainbow light flowing inward from all 4 borders. |
| `texture_rainbow_moire` | Fine Art | Banknote-grade Guilloché wave interference ribbons in silky rainbow harmonics. |
| `texture_rainbow_bismuth` | Mineral | Stepped geometric crystal growth facets radiating multi-color bismuth iridescence. |
| `gradient_linear_drafting` | Minimalist | Clean linear drafting luminance ramp calibrated to native Minecraft map palette. |
| `gradient_radial_vignette` | Minimalist | Radial vignette focusing illumination onto the central item socket. |

---

## Canonical Corner Frames & Guilloché Rosettes

The `frame:` property controls the geometric corner architecture of the map:

| Frame ID | Default Palette | Visual Description |
| :--- | :--- | :--- |
| `bracket` | Brushed Steel (`#94a3b8`) | Utilitarian hairline 2px L-bracket with a single 1px corner vertex stud. |
| `chamfer` | Verdigris Emerald (`#34d399`) | Clean 45-degree angled corner notch. Ideal for botanical and alchemical themes. |
| `diamond` | Lapis Sapphire (`#60a5fa`) | Single-line precision border with corner diamond rhombus studs. |
| `runic` | Void Amethyst (`#c084fc`) | Gothic runic notch with alchemical lozenges and apex relief. |
| `rosette` | Imperial 24k Gold (`#facc15`) | Twin banknote-grade **Guilloché rosettes** in upper corners with a continuous gold filigree pedestal rail across the base. |
| `star` | Iridescent Cyan (`#22d3ee`) | 4-point starlight nexus stars in upper corners with an integrated prismatic pedestal rail. |
| `none` | — | Completely borderless canvas. |

---

## The 6 Masterpiece Canvases

CraftingBlueprints provides 6 canonical Masterpiece Canvases combining harmonic lighting and fine-art craftsmanship:

1. **Canvas I: Technical Slate (`technical_slate`)**: Dual-frequency micrometer grid, vernier registration ticks, and subtle paper grain.
2. **Canvas II: Botanical Verdigris (`verdigris_botanical`)**: Organic spiral vines, delicate acanthus corner curls, and oxidized bronze inlays.
3. **Canvas III: Nautical Astrolabe (`nautical_astrolabe`)**: 16-point compass rose, nautical navigation arcs, and latitude star charts.
4. **Canvas IV: Arcane Grimoire (`void_grimoire`)**: Intricate gothic runic filigree with runic cartouches and amethyst backlighting.
5. **Canvas V: Imperial Gold Guilloché (`imperial_gold`)**: Banknote-style Guilloché rosettes with a radiant sunburst backlighting halo.
6. **Canvas VI: Rainbow Gradient Mesh (`rainbow`)**: Continuous gradient mesh emitting a full spectral rainbow with a velvety obsidian focal socket.

---

## Flyweight Map Registry & Anti-Desync Architecture

When `images-on-maps` is enabled, CraftingBlueprints protects your server performance and disk space through its **Flyweight Map Registry**:

1. **Zero World Save Bloat**: In vanilla Minecraft, creating maps allocates a new Map ID for every item, creating thousands of duplicate `map_<id>.dat` files in `world/data/`. CraftingBlueprints assigns **exactly one Map ID per distinct visual render**, regardless of whether 10 or 10,000 players own that blueprint.
2. **Cross-Server Map Virtualization**: In multi-server networks (BungeeCord/Velocity), Map ID `104` on Server A might be an Excalibur sword, while on Server B it is the spawn hub map. The physical item's persistent data stores the visual key. When a player transfers between servers, the plugin automatically re-links the item to the local canonical Map ID in-place, guaranteeing blueprints never turn blank or overwrite local maps.
3. **Container & Item Frame Persistence**: Blueprints stored in chests, shulker boxes, or displayed in Item Frames retain their renderers across server restarts without reverting to vanilla terrain maps.
4. **Optimized Rendering**: Heavy image processing runs asynchronously in the background. Updating map data on the main server thread takes less than 0.02 milliseconds, ensuring no TPS drops or lag spikes.

---

## Using Custom Background PNGs

You can import custom guild emblems, server logos, or hand-drawn schematics:

1. Create a **128x128 pixel** image in **32-bit RGBA PNG** format.
2. Place the file inside:
   ```text
   plugins/CraftingBlueprints/images/backgrounds/guild_crest.png
   ```

3. Reference the filename in your YAML blueprint:
   ```yaml
   map:
     theme: guild_crest
     frame: rosette
     badge: crafting
   ```

4. Run `/cb reload blueprints` to load the image immediately without a restart!
