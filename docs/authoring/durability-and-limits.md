# Durability, Limits & Expiration

CraftingBlueprints provides granular control over blueprint lifecycles. Rather than forcing server owners into an all-or-nothing progression system, blueprints support four distinct durability modalities.

Whether you run an SMP economy that requires consumable crafting licenses, an RPG server with weekend trial passes, or a prison realm with finite forge charges, CraftingBlueprints enforces durability rules across all workstations with zero exploit vectors.

---

## The Four Durability Modalities

```
                    ┌──────────────────────────────────────────────┐
                    │               Blueprint Lifecycle            │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌──────────────────┬──────────────┴─────┬──────────────────┐
         ▼                  ▼                    ▼                  ▼
┌─────────────────┐┌─────────────────┐┌──────────────────┐┌─────────────────┐
│ 1. Permanent    ││ 2. Usage-Limited││ 3. Timed Duration││ 4. Hybrid Limit │
│ permanent: true ││ permanent: false││ permanent: false ││ permanent: false│
│ uses: 0         ││ uses: 5         ││ time: 7d         ││ uses: 3         │
│ time: 0         ││ time: 0         ││ uses: 0          ││ time: 24h       │
└─────────────────┘└─────────────────┘└──────────────────┘└─────────────────┘
 (Lifetime access)  (Charges per craft) (Real-world timer) (Whichever first)
```

---

### 1. Permanent Blueprints (Lifetime Access)

Permanent blueprints grant an irrevocable, lifetime crafting license once unlocked. This is the traditional progression model for vanilla SMP, SkyBlock island milestones, and permanent skill trees.

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  permanent_netherite_axe:
    blueprint: NETHERITE_AXE
    name: "<gradient:#555555:#222222><bold>Master Netherite Battleaxe</bold></gradient>"
    lore:
      - "<gray>Grants permanent knowledge to forge Netherite Axes."
      - "<green>Access: Permanent Unlock</green>"
    permanent: true
    uses: 0
    time: 0
    item:
      material: NETHER_STAR
      glowing: true
```

- **Permanence**: Once unlocked via right-click or `/cb give`, the player retains craft knowledge forever.
- **Recipe Book Sync**: The recipe is permanently unlocked in the player's vanilla recipe book.

---

### 2. Usage-Limited Blueprints (Craft Charges)

Usage-limited blueprints provide a finite number of crafting operations. Each time the player successfully crafts, smelts, brews, or enchants the target item, one charge is deducted from their profile. When all charges are exhausted, the recipe automatically locks.

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  diamond_hoe_permit:
    blueprint: DIAMOND_HOE
    name: "<aqua><bold>Agricultural Diamond Hoe Permit</bold></aqua>"
    lore:
      - "<gray>A commercial farming permit issued by the township."
      - "<yellow>Charges: <aqua>{uses} crafts remaining</aqua></yellow>"
    permanent: false
    uses: 5
    time: 0
    item:
      material: PAPER
      custom_model_data: 201
```

#### Shift-Crafting & Multi-Craft Mathematics

When a player shift-clicks the output slot of a Crafting Table with sufficient raw materials to forge multiple items, CraftingBlueprints calculates the maximum allowable craft count:

$$\text{Allowable Crafts} = \min(\text{Available Charges}, \text{Grid Resource Capacity})$$

```
Example Scenario:
  Player has 3 charges remaining for DIAMOND_SWORD.
  Crafting grid contains materials for 10 swords.
  Player shift-clicks output slot:
    -> Exactly 3 swords are crafted.
    -> Player's charges decrease from 3 to 0.
    -> Unused diamonds and sticks remain safely inside the crafting grid.
    -> Recipe locks immediately. No resources are lost or duplicated.
```

!!! important "Anti-Exploit Station Tracking"
    Usage charges are deducted across all production workstations:
    - **Crafting Table & 2x2 Player Inventory**: Deducted per crafted output item.
    - **1.21 Crafter Block**: Deducted when the redstone pulse successfully dispatches the finished item.
    - **Furnaces, Blast Furnaces & Smokers**: Deducted upon extraction of the smelted item.
    - **Stonecutters**: Deducted upon selecting and extracting the cut block.
    - **Brewing Stands**: Deducted when the brewing cycle finishes and bottles are extracted.
    - **Anvils**: Deducted when the anvil combination completes and the repaired/named item is taken.

---

### 3. Timed Duration Blueprints (Real-World Timer)

Timed blueprints grant unlimited crafting access for a specified duration starting from the exact moment the blueprint is unlocked.

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  speed_alchemy_pass:
    blueprint: SPEED
    name: "<light_purple><bold>Weekly Alchemist License (Speed)</bold></light_purple>"
    lore:
      - "<gray>Allows unrestricted brewing of Speed Potions"
      - "<gray>for 7 days from the moment of activation."
      - ""
      - "<yellow>Duration:</yellow> <white>{time}</white>"
    permanent: false
    time: 7d
    uses: 0
    station: BREWING_STAND
    item:
      material: PAPER
      glowing: true
```

#### Supported Duration Units

The `time:` parameter accepts human-readable string formats or raw milliseconds:

| Format | String Example | Milliseconds Equivalent |
| :--- | :--- | :--- |
| **Seconds** | `45s` | $45,000\text{ ms}$ |
| **Minutes** | `30m` | $1,800,000\text{ ms}$ |
| **Hours** | `12h` | $43,200,000\text{ ms}$ |
| **Days** | `7d` | $604,800,000\text{ ms}$ |
| **Weeks** | `2w` | $1,209,600,000\text{ ms}$ |

- **Real-Time Clocks**: Expiration calculates against absolute Unix timestamps. If a player logs off, the timer continues to elapse in real time.
- **Offline Expiration Cleanup**: If a player's timer expires while offline, the blueprint is safely purged upon their next join, and recipe book synchronizations are issued immediately.

---

### 4. Hybrid Modality (Uses + Time)

Hybrid blueprints combine both usage limits and a time duration. The blueprint remains active only as long as **both** conditions are satisfied. Whichever condition is exhausted first immediately revokes crafting access.

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
singles:
  titan_sword_weekend_trial:
    blueprint: NETHERITE_SWORD
    name: "<gold><bold>Titan Sword 24-Hour Trial</bold></gold>"
    lore:
      - "<gray>A weekend battle pass granting up to 3 crafts"
      - "<gray>within a strict 24-hour window."
      - ""
      - "<yellow>Charges:</yellow> <aqua>{uses} crafts</aqua>"
      - "<yellow>Time Window:</yellow> <white>{time}</white>"
    permanent: false
    time: 24h
    uses: 3
    item:
      material: BOOK
      custom_model_data: 501
      glowing: true
```

```
Lifecycle Rule:
  Case A: Player crafts 3 swords in 2 hours -> Blueprint expires (uses exhausted).
  Case B: Player crafts 1 sword; 24 hours elapse -> Blueprint expires (time elapsed).
```

---

## Player Inspection Tools

Players can check their active blueprints, remaining craft charges, and expiration timers using built-in commands:

### 1. Blueprint Status Inspection (`/cb info [id]`)
Displays detailed progression information for a specific blueprint:

```text
/cb info netherite_sword_trial
```

```text
------------- [ Blueprint Info ] -------------
Blueprint: Titan Sword 24-Hour Trial (netherite_sword_trial)
Status: Active
Charges Remaining: 2 crafts
Time Remaining: 18h 42m
Target: NETHERITE_SWORD
Station: CRAFTING_TABLE
-----------------------------------------------
```

### 2. Can-I-Craft Check (`/cb cani <item>`)
Allows players to quickly test whether they have permission and active charges to forge a specific item before placing valuable resources into a workstation:

```text
/cb cani diamond_pickaxe
```

```text
[CraftingBlueprints] Yes! You have active blueprint knowledge to craft DIAMOND_PICKAXE (3 crafts remaining).
```

---

## Expiration Behavior & Lifecycle Sync

When a blueprint expires (whether through charge depletion or timer expiration), CraftingBlueprints executes an atomic three-step lifecycle revocation:

```
┌────────────────────────────────────────────────────────┐
│               Blueprint Expiration Event               │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Step 1: DB  │    │ Step 2: NMS  │    │ Step 3: Chat │
│ Cache Revoke │    │ Recipe Book  │    │ Notification │
│ & State Save │    │ Packet Diff  │    │ to Player    │
└──────────────┘    └──────────────┘    └──────────────┘
```

1. **In-Memory Cache & Storage Update**:
   - The blueprint is marked expired in `PlayerDB.cache` in $\mathcal{O}(1)$.
   - Storage synchronization persists the updated state asynchronously.
2. **Vanilla Recipe Book Packet Diff**:
   - The server dispatches a `ClientboundUpdateRecipesPacket` / recipe removal packet to the client.
   - The recipe is visibly locked or removed from the player's vanilla recipe book without requiring a relog.
3. **Player Notification Message**:
   - A configurable MiniMessage notification is dispatched to the player (configured in `messages.yml`):
     ```
     <prefix><red>Your blueprint license for <white>Diamond Pickaxe</white> has expired!</red>
     ```

!!! tip "Stacking Blueprints & Renewals"
    If a player already possesses an active usage-limited blueprint and unlocks an additional identical blueprint item, CraftingBlueprints automatically increments their existing charge balance (`uses = current_uses + new_uses`) rather than overwriting or discarding charges.