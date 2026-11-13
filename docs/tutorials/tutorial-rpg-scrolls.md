# Tutorial: 3-Use Magic Forge Scrolls for RPG Servers

In RPG and fantasy servers, legendary equipment should feel rare and earned. This tutorial demonstrates how to create a **Limited-Use Magic Scroll** that allows a player to forge a legendary sword exactly 3 times before crumbling to dust.

---

## Blueprint Configuration

Create a file named `plugins/CraftingBlueprints/blueprints/rpg_scrolls.yml`:

```yaml
singles:
  astral_blade_scroll:
    # Target item to unlock
    blueprint: NETHERITE_SWORD
    name: "<gradient:#9900EE:#00FFFF><bold>Scroll of the Astral Blade</bold></gradient>"

    # 3 crafts only; consumed when uses hit 0
    permanent: false
    time: 0
    uses: 3

    # Physical item representation
    item:
      material: PAPER
      glowing: true

    # Visual map representation if inspected in catalog
    rendering:
      background: "texture_void_grimoire"
      tier: "MYTHIC"
      guilloche_border: true

    # Lore card with dynamic uses placeholder
    lore:
      - "<gray>Artifact Type:</gray> <light_purple>Arcane Forge Scroll</light_purple>"
      - "<gray>Remaining Forges:</gray> <yellow><bold>{uses} / 3</bold></yellow>"
      - ""
      - "<yellow>Allows an arch-blacksmith to forge the Astral</yellow>"
      - "<yellow>Blade up to 3 times before dissolving.</yellow>"
      - ""
      - "<dark_gray>Right-click in hand to bind this knowledge.</dark_gray>"
```

---

## In-Game Behavior

1. **Granting the Scroll**:
   ```text
   /cb give <player> astral_blade_scroll 1
   ```
2. **Learning**: The player right-clicks the paper scroll. A sound plays and the player unlocks the recipe.
3. **First Craft**: The player crafts one sword. Their remaining uses drop to `2`.
4. **Second Craft**: The player crafts another sword. Remaining uses drop to `1`.
5. **Final Craft**: The player crafts the 3rd sword. Remaining uses drop to `0`, and the recipe automatically revokes itself from the player's account.
