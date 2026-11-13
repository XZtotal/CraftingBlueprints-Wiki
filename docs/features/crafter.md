# Crafter Auto-Crafting Interception (1.21+)

Minecraft 1.21 introduced the redstone-powered **Crafter** block (`Material.CRAFTER`), enabling fully automated crafting without player clicks.

In standard plugins, Crafters bypass crafting events entirely, allowing players to build automated redstone factories that mass-produce locked, epic, or mythic gear without ever discovering the required blueprint.

CraftingBlueprints solves this exploit natively via its internal **Version Abstraction Layer (VAL)**.

---

## How It Works

1. **Version Detection**:
   * On Paper/Purpur **1.21+**, the plugin activates `Adapter_v1_21_R1`, hooking into Paper's `CrafterCraftEvent`.
   * On earlier versions (**1.18.2 – 1.20.4**), a safe `NoOpCrafterAdapter` is loaded with zero performance overhead and no `NoClassDefFoundError` crashes.

2. **Crafter Evaluation Policy**:
   When a Crafter receives a redstone pulse and attempts to craft:
   * The plugin identifies the target recipe.
   * If the recipe requires an unlocked blueprint (or is restricted via Whitelist Mode), the Crafter's operation is intercepted.
   * The Crafter fails to craft, ejects fail particles, and preserves ingredients without duplication or voiding.

---

## Configuration

In `config.yml`:

```yaml
crafter:
  # Intercept Minecraft 1.21+ automated Crafter blocks
  enabled: true

  # Policy when an automated Crafter attempts to craft a locked recipe:
  # - 'block': Cancel crafting and retain ingredients in the Crafter grid.
  # - 'bypass': Allow automated crafters to craft all recipes freely.
  policy: "block"

  # Visual and auditory feedback upon blocked craft
  effects:
    sound: "BLOCK_DISPENSER_FAIL"
    particles: true
```

With this protection enabled, redstone automated factories cannot bypass your server's RPG progression or economy balance.
