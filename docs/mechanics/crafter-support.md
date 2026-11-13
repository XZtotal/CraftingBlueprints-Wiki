# Automated Crafter Interception (Minecraft 1.21+)

Minecraft 1.21 introduced the redstone-powered **Crafter** block (`Material.CRAFTER`), enabling automated, hopper-driven crafting without a human player clicking an inventory slot.

Because Crafters operate autonomously when pulsed with redstone, they do **not** trigger standard player crafting events (`CraftItemEvent`). Without dedicated protection, players can build automated redstone factories to mass-produce locked, rare, epic, or mythic items (such as Netherite equipment or beacons) without ever finding or unlocking the required blueprints, completely circumventing your server's progression economy.

CraftingBlueprints features native, low-level interception to protect your economy from this exploit.

---

## How Protection Works

When a redstone pulse activates a Crafter block:

1. **Recipe Inspection**: The plugin intercepts the craft before items are produced, identifying the output item and recipe.
2. **Restriction Check**: The plugin checks if the target recipe requires a blueprint:
    * **Unrestricted Recipes**: If the recipe does not require a blueprint (e.g. iron blocks, bread, torches in Whitelist Mode), the craft executes normally.
    * **Restricted Recipes**: If the item requires a blueprint, the Crafter evaluates the server policy (`block-restricted`).
3. **Execution Policy Enforcement**:
    * **Blocked**: The craft is cancelled. The Crafter block emits fail particles and sounds, leaving ingredients safely inside the Crafter's grid without duplication or item loss.
    * **Bypassed**: If configured by the administrator, the Crafter produces the recipe autonomously.

---

## Configuration in `config.yml`

Configure the interception behavior in `plugins/CraftingBlueprints/config.yml`:

```yaml
# ------------------------------------------------------------ #
# Automated Crafter Interception (Minecraft 1.21+)
# ------------------------------------------------------------ #

crafter:
  # If true, redstone-powered Crafter blocks are blocked from crafting
  # recipes that require an unlocked blueprint.
  # If false, Crafters bypass player checks and craft all recipes automatically.
  block-restricted: true

  # If true, plays a dispenser fail click sound and spawns smoke particles
  # at the Crafter block when a craft is blocked.
  fail-effect: true
```

---

## Operating Policies: Block vs Bypass

=== "Block Policy (block-restricted: true) - RECOMMENDED"

    * **Economic Integrity Guarantee**: Autonomous machines cannot craft recipes that players haven't earned.
    * **No Resource Deletion**: When a Crafter block receives a redstone pulse while loaded with ingredients for a locked recipe, the craft is cancelled cleanly. The raw materials remain inside the Crafter's 9 slots.
    * **Visual & Audio Feedback**: If `fail-effect: true` is enabled, the Crafter emits the classic dispenser fail click (`Sound.BLOCK_DISPENSER_FAIL`) and puffs of smoke particles (`Particle.SMOKE_NORMAL`), alerting nearby players that the automated recipe is locked.
    * **Recommended For**: Survival SMP, RPG networks, Skyblock, and balanced economies.

=== "Bypass Policy (block-restricted: false)"

    * **Full Redstone Automation**: Allows automated Crafter machines to produce all recipes freely, even if players would normally need a blueprint to craft them manually.
    * **Use Case**: Anarchy servers or specialized technical modded networks where redstone automation is intentionally unrestricted.

---

## Multi-Version Compatibility

Because the Crafter block only exists in Minecraft 1.21+:
* On servers running **Paper 1.18.2 or 1.20.4**, this module is inactive. It introduces zero overhead, registers no listeners, and runs cleanly without errors.
* On servers running **Paper 1.21+**, Crafter interception activates automatically with no extra setup required.
