# Stonecutter Recipe Gating

The **Stonecutter** (`InventoryType.STONECUTTER`) provides a direct, single-step crafting interface for stone variants, copper blocks, slabs, stairs, walls, and decorative masonry. In vanilla Minecraft, the stonecutter allows players to bypass multi-step 3×3 crafting recipes (such as crafting 6 stone blocks into 4 stairs) to produce variants at a more efficient 1:1 ratio.

Without dedicated stonecutter interception, players can bypass crafting restrictions on architectural blocks (such as polished stones, prismarine, copper grates, or custom decorative blocks) by slicing them in a stonecutter rather than assembling them on a crafting table.

CraftingBlueprints intercepts the stonecutter through the `StonecutterRulePipeline`, applying identical blueprint unlocks, durability limits, and shift-click capacity mathematics to masonry.

---

## Interception Architecture

When a player opens a Stonecutter and places an input block into slot 0:

```
    [ Input Slot (0) ] ──► [ Select Recipe Button ] ──► [ Result Slot (1) ]
         Stone Block               Slab / Stairs               Stone Bricks
                                         │
                                         ▼
                            StonecutterRulePipeline
                                         │
                    ┌────────────────────┴────────────────────┐
                    │ Requires Blueprint?                     │
                    ▼ YES                                     ▼ NO
     ┌───────────────────────────────┐         ┌───────────────────────────────┐
     │ Player Has Blueprint & Uses?  │         │ Allow Slicing Instantly       │
     ├───────────────────────────────┤         │ (Unrestricted for all players)│
     │ YES: Produce Item & Use -1    │         └───────────────────────────────┘
     │ NO:  Cancel Click & Show Lore │
     └───────────────────────────────┘
```

1. **Station Type**: Classified internally as `STONECUT_TYPE` (Type ID `4`).
2. **Result Slot Interception**: Listens to clicks on slot 1 (the stonecutter output slot).
3. **Live Result Preview**: If `stations.stonecutter.prepare-preview` is enabled, selecting a locked recipe displays a locked preview overlay or barrier item directly in the output slot before the player clicks.

---

## Restriction Syntax (`config.yml`)

Stonecutting recipes are restricted using the `stonecut:` (or `stonecutter:`) category prefix in `config.yml`:

```yaml
restrictions:
  restricted-items:
    # 1. Exact Material Slicing
    - "stonecut:stone_bricks"
    - "stonecut:chiseled_stone_bricks"
    - "stonecut:deepslate_bricks"

    # 2. Wildcards & Regular Expressions
    - "stonecut:.*_slab"
    - "stonecut:.*_stairs"
    - "stonecut:cut_copper.*"
    - "stonecut:purpur_.*"
```

!!! note "Station Specificity"
    If you configure `craft:stone_bricks`, players cannot craft stone bricks in a 3×3 crafting table, but they could still cut them in a stonecutter unless `stonecut:stone_bricks` (or the unqualified pattern `stone_bricks`) is also specified.

---

## Blueprint Declaration (`blueprints/`)

Blueprints that grant stonecutting access can be authored as dedicated masonry scrolls:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  master_masonry:
    blueprint: "stonecut:deepslate_bricks"
    station: STONECUTTER      # Restricts use exclusively to stonecutters
    name: "<gradient:#8A95A5:#434343><bold>Master Masonry Blueprint</bold></gradient>"
    permanent: true
    item:
      material: PAPER
      glowing: true
    lore:
      - "<gray>Station:</gray> <yellow>Stonecutter</yellow>"
      - "<gray>Grants architectural knowledge for carving deepslate bricks.</gray>"
```

---

## Shift-Click Multi-Slicing Mathematics

Like the 3×3 crafting table, stonecutters allow players to shift-click the output slot to slice an entire stack of blocks at once.

To prevent blueprint durability exploits, the `StonecutterRulePipeline` evaluates the three capacity bounds:

1. **Input Ingredient Bound ($N_{\text{input}}$)**: The number of blocks present in input slot 0.
2. **Bottom Inventory Space Bound ($N_{\text{fits}}$)**: How many sliced blocks can fit in the player's empty or matching inventory slots.
3. **Blueprint Uses Bound ($N_{\text{uses}}$)**: The player's remaining craft uses $U$.

$$\text{Blocks Sliced} = \min(N_{\text{input}}, N_{\text{fits}}, N_{\text{uses}})$$

### Bounded Slicing Example

* A player places **64 Stone Blocks** into the Stonecutter and selects **Stone Slabs** (which yields 2 slabs per stone block).
* The player has a finite blueprint with **3 uses remaining**.
* When shift-clicking the result slot:
  * The engine calculates $N_{\text{uses}} = 3$.
  * Exactly **3 stone blocks** are consumed from slot 0.
  * Exactly **6 stone slabs** are delivered into the player's inventory.
  * Exactly **3 uses** are deducted from the blueprint.
  * The remaining **61 stone blocks** remain safely in slot 0.

---

## Configuration Reference (`config.yml`)

Stonecutter interception options are configured under `stations.stonecutter:` in `config.yml`:

```yaml
# ==============================================================================
# CraftingBlueprints - Stonecutter Configuration
# ==============================================================================

stations:
  stonecutter:
    # Enable stonecutter recipe interception and blueprint verification
    enabled: true

    # Display real-time locked preview icons in the stonecutter result slot
    prepare-preview: true
```

---

## Diagnostics & Edge Cases

### 1. In-Game Permission Inspection (`/cb cani`)

To test whether a player or rank can slice a specific block:

```text
/cb cani stonecut:deepslate_bricks
```

* **Unlocked Player**:
  ```text
  Item: Deepslate Bricks (Stonecutter)
  Status: Restricted
  Required Blueprint: master_masonry
  Unlocked: YES (Remaining Uses: Unlimited)
  ```
* **Locked Player**:
  ```text
  Item: Deepslate Bricks (Stonecutter)
  Status: Restricted
  Required Blueprint: master_masonry
  Unlocked: NO
  ```

### 2. Common Edge Cases & Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **Player cuts blocked block** | The restriction pattern omitted the `stonecut:` prefix or used an exact craft pattern (`craft:stone_bricks`). | Add `stonecut:<item>` or an unqualified wildcard `.*bricks` to `restrictions.restricted-items`. |
| **Shift-click cuts fewer items than expected** | The player's blueprint has finite uses, or inventory space was limited. | Check remaining uses via `/cb info` or empty inventory slots to accommodate outputs. |
| **Locked preview stuck in cursor** | A player attempted to grab a locked preview icon from the result slot. | Anti-extraction guard cancels the click and immediately purges stray preview items. |

---

## Next Steps

* [Enchanting Tables & Anvil Rules](enchanting-and-anvils.md) — Restricting enchantments, differential level checking, and anvil repairs.
* [Workstations Interception Matrix](workstations-matrix.md) — Complete overview of all 7 production stations.
* [Recipe Restriction Engine](../progression/recipe-restrictions.md) — Comprehensive guide to pattern matching and prefixes.
