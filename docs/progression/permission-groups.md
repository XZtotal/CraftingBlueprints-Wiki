# Hierarchical Permission Groups

CraftingBlueprints provides a hierarchical permission group engine that allows server administrators to grant crafting access to entire categories of recipes via permission nodes (`craftingblueprints.group.<id>`).

This system simplifies progression management: instead of granting dozens of individual blueprints to players as they rank up, you can assign them to permission groups linked to your LuckPerms ranks.

---

## Configuration Schema (`groups:` in `config.yml`)

Permission groups are defined under the `groups:` root key in `config.yml` (and can be extended modularly via `configs/`):

```yaml
# ==============================================================================
# CraftingBlueprints - Hierarchical Permission Groups
# ==============================================================================

groups:
  # Base group granted to all players by default
  default:
    name: "Novice"
    blueprints:
      - stick
      - ".*planks"
      - ".*door"
      - ".*fence"
      - iron_ingot
      - "iron_.*"

  # Intermediate rank inheriting default recipes
  vip:
    name: "Adventurer"
    inherits:
      - default
    blueprints:
      - diamond_sword
      - diamond_pickaxe
      - "potion:speed.*"

  # Master rank inheriting VIP (and transitively default)
  pro:
    name: "Master Artisan"
    inherits:
      - vip
    blueprints:
      - "diamond_.*"
      - "netherite_.*"
      - "potion:strength.*"
      - "enchantment:mending"
```

### Field Specifications

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `name` | String | No | A friendly display label shown in menus, GUIs, and diagnostic reports. Defaults to the group key ID. |
| `blueprints` | List&lt;String&gt; | No | List of literal identifiers, glob patterns (`*`), or regular expressions (`.*`) matching vanilla materials, potion types, or enchantments. |
| `inherits` | String or List | No | One or more parent group IDs from which this group inherits all unlocked recipes. Supports multi-parent inheritance. |

---

## Directed Acyclic Graph (DAG) Inheritance

CraftingBlueprints models group hierarchies as a **Directed Acyclic Graph (DAG)**. When a group inherits from another, an edge is formed from child to parent:

```
        ┌──────────────┐
        │   default    │  (Novice: Wood, Stone, Iron)
        └──────▲───────┘
               │
        ┌──────┴───────┐
        │     vip      │  (Adventurer: Diamond Weapons, Speed Potions)
        └──────▲───────┘
               │
        ┌──────┴───────┐
        │     pro      │  (Master: Netherite, Strength, Mending)
        └──────────────┘
```

### Mathematical Set Union
When the plugin resolves recipes for group $G$, it computes the complete mathematical set union across all direct patterns and inherited ancestors:

$$\text{Recipes}(G) = \text{DirectRecipes}(G) \cup \bigcup_{P \in \text{Parents}(G)} \text{Recipes}(P)$$

This guarantees:
1. **Zero Redundancy**: You never need to duplicate basic recipes in higher-tier groups.
2. **Instant $O(1)$ Lookup**: Resolved recipes are compiled into a high-speed in-memory hash set, ensuring zero TPS impact during crafting attempts.

### 3-Color Cycle Detection & Safe Pruning
If a server administrator accidentally configures a circular inheritance loop (for example, `default` inherits from `vip`, which inherits from `pro`, which inherits back from `default`):

```
       ┌─────────┐
       │ default │ ──── inherits ────► ┌─────┐
       └────▲────┘                     │ vip │
            │                          └──┬──┘
            │                             │
            └─────── inherits ──────── pro ◄
```

The engine employs a **Depth-First Search (DFS) with 3-Color State Tracking** (Unvisited, Visiting, Visited):
1. When traversing ancestors, any node encountered in the `Visiting` state indicates a cycle.
2. The engine logs a clear diagnostic warning:
   ```text
   [CraftingBlueprints] Cyclic group inheritance detected: default -> vip -> pro -> default. Pruning cycle.
   ```
3. The circular branch is safely terminated and pruned in memory. **The server will never freeze, hang, or suffer a `StackOverflowError`.**

---

## Permission Nodes & LuckPerms Integration

Each configured group maps directly to a Bukkit permission node:

```text
craftingblueprints.group.<id>
```

### Default vs. Progression Groups

* **The `default` Group**:
  * Permission: `craftingblueprints.group.default`
  * Default State: `PermissionDefault.TRUE`
  * Every player (including guests and newly joined players) automatically possesses this permission.
* **Progression Groups (`vip`, `pro`, `alchemist`, `smith`, etc.)**:
  * Permission: `craftingblueprints.group.<id>`
  * Default State: `PermissionDefault.FALSE`
  * Granted explicitly through your permissions plugin (such as LuckPerms) as players rank up or purchase licenses.

---

## The Operator Isolation Rule (`op-bypass: false`)

A frequent issue in Minecraft server administration is that server operators (`isOp: true`) or users with wildcard permissions (`*`) bypass game progression rules, making it impossible for administrators to test player tiers accurately.

CraftingBlueprints solves this through the **Operator Isolation Rule**:

!!! important "Operator Group Isolation"
    Server operators (`player.isOp`) and administrators with wildcard permissions (`*` or LuckPerms `ops-have-all-permissions: true`) **do NOT automatically inherit progression groups** merely by being OP.

### How It Works:
1. **Explicit Permission Registration**: Non-default progression groups are registered with `PermissionDefault.FALSE`.
2. **Strict Permission Check**: When `op-bypass: false` is configured in `config.yml`, the engine verifies whether the permission node `craftingblueprints.group.<id>` has been **explicitly assigned** to the player profile (`isPermissionSet && hasPermission`). Wildcard fallback is explicitly ignored for progression groups.
3. **Realistic Testing**: When an administrator executes `/cb cani netherite_sword` or crafts in a workbench, the test reflects their actual assigned progression tier rather than granting every recipe on the server.

### Configuring LuckPerms for Staff Testing

To allow server administrators to test different player ranks without relinquishing operator status:

```text
# Step 1: In config.yml, ensure OP bypass is disabled for testing:
op-bypass: false

# Step 2: In LuckPerms, assign exact groups to test tiers:
/lp user Admin permission set craftingblueprints.group.vip true
```

When the administrator finishes testing, they can toggle OP bypass back to `true` or clear the node:

```text
/lp user Admin permission unset craftingblueprints.group.vip
```

---

## Diagnostic Exports (`groups_recipes.txt`)

To audit exactly which recipes each permission group unlocks:
1. Run the export command:
   ```text
   /cb export groups
   ```
2. Open `plugins/CraftingBlueprints/exports/groups_recipes.txt`.
3. The report outputs a structured breakdown:
   * Direct patterns matched.
   * Inherited recipes inherited from each ancestor.
   * Total resolved recipes available to members of that group.

---

## Next Steps

* **Manage Modular Configurations**: Learn how to organize groups across separate files in [Modular Configurations](modular-configs.md).
* **Recipe Restriction Patterns**: Review how pattern matching and category prefixes work in [Recipe Restrictions](recipe-restrictions.md).
* **Test with First Blueprint**: Verify your permission configuration with our [First Blueprint Tutorial](../getting-started/first-blueprint.md).
