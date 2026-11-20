# LuckPerms Guide & OP Isolation

CraftingBlueprints integrates seamlessly with modern Bukkit/Paper permission managers, with **LuckPerms** serving as the industry standard. This guide provides copy-paste permission tiers for production networks, a master table of all permission nodes, and a deep dive into the **Operator Isolation Invariant** (`op-bypass: false`).

---

## Production-Ready Permission Tiers (Copy-Paste)

You can configure your server ranks either by executing LuckPerms CLI commands in the server console or by copying the YAML blocks directly into your LuckPerms storage files.

=== "CLI Commands (Console)"

    ```bash
    # --------------------------------------------------------------------------
    # 1. Default / Player Rank
    # --------------------------------------------------------------------------
    /lp group default permission set craftingblueprints.menu true
    /lp group default permission set craftingblueprints.cani true
    /lp group default permission set craftingblueprints.info true
    /lp group default permission set craftingblueprints.buy true
    /lp group default permission set craftingblueprints.sell true
    /lp group default permission set craftingblueprints.owner true
    /lp group default permission set craftingblueprints.group.default true

    # --------------------------------------------------------------------------
    # 2. VIP / Donor Rank
    # --------------------------------------------------------------------------
    /lp group vip permission set craftingblueprints.return true
    /lp group vip permission set craftingblueprints.group.vip true

    # --------------------------------------------------------------------------
    # 3. Moderator Rank
    # --------------------------------------------------------------------------
    /lp group moderator permission set craftingblueprints.menu.others true
    /lp group moderator permission set craftingblueprints.item.list true

    # --------------------------------------------------------------------------
    # 4. Administrator Rank (Full Authority)
    # --------------------------------------------------------------------------
    /lp group admin permission set craftingblueprints.admin true
    /lp group admin permission set craftingblueprints.give true
    /lp group admin permission set craftingblueprints.reload true
    /lp group admin permission set craftingblueprints.status true
    /lp group admin permission set craftingblueprints.admin.preset true
    /lp group admin permission set craftingblueprints.admin.generate true
    /lp group admin permission set craftingblueprints.admin.cluster true
    /lp group admin permission set craftingblueprints.admin.loot true
    /lp group admin permission set craftingblueprints.admin.export true
    ```

=== "LuckPerms YAML Blocks"

    ```yaml
    # LuckPerms group configurations (plugins/LuckPerms/yaml-storage/groups/*.yml)

    # 1. default.yml
    name: default
    permissions:
      - craftingblueprints.menu: true
      - craftingblueprints.cani: true
      - craftingblueprints.info: true
      - craftingblueprints.buy: true
      - craftingblueprints.sell: true
      - craftingblueprints.owner: true
      - craftingblueprints.group.default: true

    # 2. vip.yml
    name: vip
    parents:
      - default
    permissions:
      - craftingblueprints.return: true
      - craftingblueprints.group.vip: true

    # 3. moderator.yml
    name: moderator
    parents:
      - vip
    permissions:
      - craftingblueprints.menu.others: true
      - craftingblueprints.item.list: true

    # 4. admin.yml
    name: admin
    parents:
      - moderator
    permissions:
      - craftingblueprints.admin: true
      - craftingblueprints.give: true
      - craftingblueprints.reload: true
      - craftingblueprints.status: true
      - craftingblueprints.admin.preset: true
      - craftingblueprints.admin.generate: true
      - craftingblueprints.admin.cluster: true
      - craftingblueprints.admin.loot: true
      - craftingblueprints.admin.export: true
    ```

---

## Complete Permission Nodes Master Table

The following table documents every permission node registered by CraftingBlueprints, its default state in `plugin.yml`, and its operational scope.

| Permission Node | Default State | Description & Scope | Child Permissions |
| :--- | :---: | :--- | :--- |
| **`craftingblueprints.menu`** | `true` | Allows opening personal blueprint inventory GUI (`/cb menu`). | None |
| **`craftingblueprints.menu.others`** | `false` | Allows opening another player's menu (`/cb menu <player>`). | None |
| **`craftingblueprints.return`** | `false` | Allows using `/cb return` to re-open the previous menu or restore an ESC session. | None |
| **`craftingblueprints.cani`** | `true` | Allows checking recipe craftability via `/cb cani`. | None |
| **`craftingblueprints.info`** | `true` | Allows inspecting detailed blueprint info via `/cb info [id]`. | None |
| **`craftingblueprints.buy`** | `true` | Allows purchasing blueprint access or physical items via `/cb buy`. | None |
| **`craftingblueprints.sell`** | `true` | Allows selling physical blueprint items held in hand via `/cb sell`. | None |
| **`craftingblueprints.owner`** | `true` | Allows inspecting who created/owns a blueprint via `/cb owner`. | None |
| **`craftingblueprints.give`** | `op` | Allows spawning physical blueprint items via `/cb give`. | None |
| **`craftingblueprints.reload`** | `false` | Allows executing `/cb reload [target]` subsystem reloads. | None |
| **`craftingblueprints.status`** | `op` | Allows viewing server health & cluster metrics via `/cb status`. | None |
| **`craftingblueprints.admin`** | `op` | Master administrative wildcard granting access to administrative subcommands. | All `craftingblueprints.admin.*` nodes |
| **`craftingblueprints.admin.preset`** | `op` | Allows deploying, removing, exporting, and downloading presets (`/cb preset`). | None |
| **`craftingblueprints.admin.generate`**| `op` | Allows running the automated recipe scaffolder (`/cb generate`). | None |
| **`craftingblueprints.admin.cluster`** | `op` | Allows managing multi-server cluster file sync (`/cb cluster`). | None |
| **`craftingblueprints.admin.loot`** | `op` | Allows executing `/cb loot <reload\|test\|roll>` commands. | None |
| **`craftingblueprints.admin.export`** | `op` | Allows running manual diagnostic text dumps via `/cb export`. | None |
| **`craftingblueprints.item.list`** | `false` | Allows opening the administrative catalog (`/cb item list`). | None |
| **`craftingblueprints.item.duplicate`**| `false` | Allows cloning blueprints into manual copies (`/cb item duplicate`). | None |
| **`craftingblueprints.group.default`** | `true` | Automatically grants recipes assigned to the `default` progression group. | None |
| **`craftingblueprints.group.<id>`** | `false` | Grants recipes belonging to the custom group `<id>` (e.g. `vip`, `pro`, `alchemist`). | None |

---

## Crafting Bypass Permissions

In certain administrative or creative workflows, staff members may need to craft or experiment without being restricted by blueprints. CraftingBlueprints provides fine-grained bypass permissions:

| Bypass Node | Operational Effect |
| :--- | :--- |
| **`craftingblueprints.bypass`** | **Universal Bypass**: Disables all restrictions across all 7 workstation types. |
| **`craftingblueprints.craft.bypass`** | Bypasses Crafting Table and 2x2 player inventory restrictions. |
| **`craftingblueprints.smelt.bypass`** | Bypasses Furnaces, Blast Furnaces, Smokers, and Campfires. |
| **`craftingblueprints.stonecut.bypass`**| Bypasses Stonecutter block slicing restrictions. |
| **`craftingblueprints.enchant.bypass`** | Bypasses Enchanting Tables and Anvil repair/application restrictions. |
| **`craftingblueprints.brew.bypass`** | Bypasses Brewing Stands and potion alchemy restrictions. |
| **`craftingblueprints.raw-item.auto-converting.bypass`** | Prevents raw blueprint items from auto-converting to normal blueprints in inventory. |
| **`craftingblueprints.item.auto-assign-owner.bypass`** | Prevents ownerless blueprints from auto-binding to the administrator when picked up. |

!!! caution
    Never grant `craftingblueprints.bypass` or wildcard permissions (`*`) to regular players, as it completely deactivates the blueprint progression system for their account.

---

## The Operator Isolation Rule (`op-bypass: false`)

One of the most frequent administrative pitfalls on Minecraft servers is testing player progression using an operator account (`/op`). On many plugins, server operators automatically inherit all permissions, making it impossible to verify whether recipe restrictions are working properly.

CraftingBlueprints introduces the **Operator Isolation Invariant**:

```yaml
# plugins/CraftingBlueprints/config.yml
op-bypass: false
```

### Why Operators Do Not Inherit Groups

1. **Explicit Permission Registration (`PermissionDefault.FALSE`)**:  
   All non-default blueprint groups (`craftingblueprints.group.vip`, `craftingblueprints.group.pro`, `craftingblueprints.group.tier2`, etc.) are registered dynamically with `PermissionDefault.FALSE`.

2. **Strict Operator Isolation**:  
   When `op-bypass: false`, the engine evaluates:
   ```kotlin
   // Engine verification logic
   player.isPermissionSet("craftingblueprints.group.<id>") && player.hasPermission("craftingblueprints.group.<id>")
   ```
   Operators (`isOp == true`) do **NOT** automatically inherit group permissions merely by virtue of their OP status or wildcard `*` permissions (`ops-have-all-permissions: true` in LuckPerms).

3. **Preventing Misleading Test Results**:  
   If an operator joins a server with `op-bypass: false`, they cannot craft restricted recipes like Netherite Armor or Mending unless they have specifically learned the blueprint in-game or have been assigned the explicit permission node. Commands like `/cb cani` will accurately report that the recipe is locked!

```
                  Player attempts to craft restricted item
                                    │
                         Is player a Server Operator?
                                    │
                   ┌────────────────┴────────────────┐
                   │ YES                             │ NO
                   ▼                                 ▼
         Is op-bypass: true?             Does player have blueprint
                   │                     or permission group?
          ┌────────┴────────┐                        │
          │ YES             │ NO            ┌────────┴────────┐
          ▼                 ▼               │ YES             │ NO
        ALLOW         Check explicit        ▼                 ▼
       (Bypass)         permission        ALLOW             BLOCK
                      (No OP auto-win)   (Crafts)          (Denied)
```

---

## How to Test Player Progression Safely

To test your progression gating, recipe restrictions, and menu layouts without deceptive operator privileges, follow one of these recommended methods:

### Method 1: Using LuckPerms Verbose Mode (`/lp verbose`)
LuckPerms includes a real-time permission inspector that logs every check performed by plugins:

```bash
# Start logging checks for CraftingBlueprints:
/lp verbose on craftingblueprints

# Attempt to craft the item or run /cb cani, then check the console or chat:
# Output: craftingblueprints.group.vip => FALSE (by default)
/lp verbose off
```

### Method 2: Testing with an Alt Account (Non-OP)

1. Join your server using a standard, non-operator test account.
2. Ensure the account only has the `default` LuckPerms group.
3. Test crafting basic recipes (should succeed) versus restricted items (should be blocked with particles and error sounds).
4. Run `/cb give <test_player> <blueprint_id>` and right-click to redeem.
5. Verify that crafting the newly learned item now succeeds!

---

## Related References

- [Player Command Guide](player-commands.md) — Player command suite and `/cb cani` checks.
- [Admin Operations & Scaffolding](admin-commands.md) — Administrative command suite and `/cb give`.
- [Hierarchical Permission Groups](../progression/permission-groups.md) — Defining group inheritance in `config.yml`.
- [Recipe Restriction Engine](../progression/recipe-restrictions.md) — Selective vs universal recipe restrictions.
