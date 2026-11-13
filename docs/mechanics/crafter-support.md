# Crafter Automation Interception (1.21+)

Minecraft 1.21 introduced the redstone-powered **Crafter** block (`Material.CRAFTER`), enabling automated, hopper-driven crafting without a human player clicking an inventory slot.

Without dedicated protection, players can build automated redstone factories to mass-produce locked, rare, or mythic items (such as Netherite gear or beacons) without ever finding or unlocking the required blueprint.

CraftingBlueprints includes native interception to protect your economy from this exploit.

---

## How Protection Works

When a redstone pulse powers a Crafter block:

1. **Recipe Inspection**: The plugin identifies the target item being assembled inside the Crafter.
2. **Restriction Check**: The plugin verifies whether the target recipe is locked behind a blueprint or restricted in Whitelist Mode.
3. **Execution or Interception**:
   * If the recipe is **unrestricted** (e.g., standard iron ingots into blocks): The Crafter operates normally.
   * If the recipe is **locked**: The Crafter's operation is intercepted. The block emits fail particles and sounds, and all ingredients remain safely inside the Crafter's grid without duplication or loss.

---

## Configuration

In `plugins/CraftingBlueprints/config.yml`:

```yaml
crafter:
  # Intercept redstone Crafter blocks (Minecraft 1.21+)
  enabled: true

  # Policy when an automated Crafter attempts to craft a locked recipe:
  # - 'block': Cancel the craft and retain materials safely in the grid.
  # - 'bypass': Allow automated crafters to craft all recipes freely.
  policy: "block"
```

> [!NOTE]
> On servers running Minecraft 1.18.2 or 1.20.4, this module automatically loads in a dormant state with zero performance overhead and no compatibility errors.
