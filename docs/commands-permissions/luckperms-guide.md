# Permissions & LuckPerms Guide

This guide provides the complete permission nodes reference for CraftingBlueprints, explains recipe group permission mechanics, and provides copy-paste LuckPerms configurations for production server ranks.

---

## Master Permissions Table

### Core Player & Economy Permissions
| Permission Node | Default Assignment | Description & Access Scope |
| :--- | :--- | :--- |
| `craftingblueprints.menu` | `true` (All Players) | Allows opening the personal progression dashboard (`/cb menu`). |
| `craftingblueprints.buy` | `true` (All Players) | Allows purchasing blueprints using Vault economy (`/cb buy <id> [--item]`). |
| `craftingblueprints.sell` | `true` (All Players) | Allows selling the blueprint held in hand using Vault economy (`/cb sell`). |
| `craftingblueprints.cani` | `true` (All Players) | Allows checking recipe craftability via `/cb cani [item]`. |
| `craftingblueprints.info` | `true` (All Players) | Allows viewing detailed recipe specifications and lore via `/cb info`. |
| `craftingblueprints.owner` | `true` (All Players) | Allows checking who unlocked or owns the held blueprint via `/cb owner`. |
| `craftingblueprints.help` | `true` (All Players) | Allows viewing the command help list (`/cb help`). |
| `craftingblueprints.return` | `false` | Allows navigating back through previous menus using `/cb return`. |
| `craftingblueprints.group.default`| `true` (All Players) | Grants access to all recipes configured in the `default` permission group. |
| `craftingblueprints.group.<id>` | None | Unlocks all recipes configured within the specified permission group in `config.yml`. |

### Administrative & Staff Permissions
| Permission Node | Default Assignment | Description & Access Scope |
| :--- | :--- | :--- |
| `craftingblueprints.*` | Server Operators (`op`) | Grants unrestricted access to all commands, editors, and administrative tools. |
| `craftingblueprints.admin` | Server Operators (`op`) | Master administrative parent permission (includes export, preset, generate, testing). |
| `craftingblueprints.admin.preset` | Server Operators (`op`) | Allows installing, previewing, and removing modality presets (`/cb preset`). |
| `craftingblueprints.admin.generate`| Server Operators (`op`) | Allows auto-scaffolding blueprint YAML files from recipes (`/cb generate`). |
| `craftingblueprints.admin.export` | Server Operators (`op`) | Allows exporting blueprints and diagnostic recipe dumps (`/cb export`). |
| `craftingblueprints.admin.testing`| Server Operators (`op`) | Grants access to the internal in-game testing framework (`/cb testing`). |
| `craftingblueprints.admin.debug` | Server Operators (`op`) | Grants access to verbose debug outputs and inspection tools. |
| `craftingblueprints.reload` | Server Operators (`op`) | Allows hot-reloading configurations, translations, and blueprints (`/cb reload`). |
| `craftingblueprints.status` | Server Operators (`op`) | Allows viewing system metrics, database health, and latency (`/cb status`). |
| `craftingblueprints.give` | Server Operators (`op`) | Allows distributing physical blueprints to players via `/cb give`. |
| `craftingblueprints.add` | Server Operators (`op`) | Allows unlocking recipes directly to a player's profile (`/cb add`). |
| `craftingblueprints.remove` | Server Operators (`op`) | Allows revoking unlocked recipes from a player's profile (`/cb remove`). |
| `craftingblueprints.set` | Server Operators (`op`) | Allows modifying player recipe uses or expiration timers (`/cb set`). |
| `craftingblueprints.menu.others` | Server Operators (`op`) | Allows opening and inspecting other players' blueprint menus (`/cb menu <player>`). |
| `craftingblueprints.item.list` | `false` | Allows opening the administrative blueprint catalog GUI (`/cb item list`). |
| `craftingblueprints.item.edit` | `false` | Allows opening the visual in-game GUI blueprint editor (`/cb item edit`). |
| `craftingblueprints.item.create` | `false` | Allows creating a blueprint item from the held item (`/cb item create`). |
| `craftingblueprints.item.delete` | `false` | Allows deleting a blueprint from the catalog (`/cb item delete`). |
| `craftingblueprints.item.duplicate`| `false` | Allows duplicating an existing blueprint (`/cb item duplicate`). |
| `craftingblueprints.item.get` | `false` | Allows directly spawning physical copies of blueprints (`/cb item get`). |
| `craftingblueprints.item.edit-name`| `false` | Allows editing blueprint display names via command (`/cb item edit-name`). |
| `craftingblueprints.item.edit-lore`| `false` | Allows editing blueprint lore lines via command (`/cb item edit-lore`). |
| `craftingblueprints.item.remove-owner`| `false` | Allows stripping player UUID ownership from held items (`/cb item remove-owner`). |

### Granular Bypass Permissions
| Permission Node | Default Assignment | Description & Access Scope |
| :--- | :--- | :--- |
| `craftingblueprints.bypass` | Server Operators (`op`) | Universal bypass: allows crafting, smelting, brewing, stonecutting, and enchanting without blueprints. |
| `craftingblueprints.craft.bypass` | `false` | Bypasses restrictions strictly on crafting tables and crafting grids (alias: `craftingblueprints.crafting.bypass`). |
| `craftingblueprints.smelt.bypass` | `false` | Bypasses restrictions on smelting stations (Furnace, Blast Furnace, Smoker, Campfire). |
| `craftingblueprints.stonecut.bypass`| `false` | Bypasses restrictions on Stonecutters. |
| `craftingblueprints.enchant.bypass`| `false` | Bypasses restrictions on Anvils and Enchantment Tables. |
| `craftingblueprints.brew.bypass` | `false` | Bypasses restrictions on Brewing Stands. |
| `craftingblueprints.raw-item.auto-converting.bypass` | `false` | Prevents raw items from auto-converting to blueprints in inventory. Useful for staff testing items. |
| `craftingblueprints.item.auto-assign-owner.bypass` | `false` | Prevents ownerless blueprint items from automatically stamping the staff member's UUID upon inventory pickup. |

---

## Recipe Group Permissions (`craftingblueprints.group.<id>`)

In `plugins/CraftingBlueprints/config.yml`, you define permission groups (e.g., `default`, `vip`, `pro`, `alchemist`):

```yaml
groups:
  vip:
    name: "VIP"
    inherits:
      - default
    blueprints:
      - "iron_.*"
      - "shield"
      - "crossbow"
```

To grant all recipes in the `vip` group to your VIP rank, assign the node:

```text
craftingblueprints.group.vip
```

Because `vip` inherits `default`, players with this permission automatically unlock all recipes in `default` as well.

---

## Production LuckPerms Configurations

Below are ready-to-use configurations for standard server ranks:

=== "LuckPerms CLI Commands"

    Run these commands in your server console or in-game as an administrator:

    ```bash
    # --------------------------------------------------
    # 1. Default Players (default rank)
    # --------------------------------------------------
    lp group default permission set craftingblueprints.menu true
    lp group default permission set craftingblueprints.buy true
    lp group default permission set craftingblueprints.sell true
    lp group default permission set craftingblueprints.cani true
    lp group default permission set craftingblueprints.info true
    lp group default permission set craftingblueprints.owner true
    lp group default permission set craftingblueprints.group.default true

    # Optional: Allow players to browse the server catalog
    # lp group default permission set craftingblueprints.item.list true

    # --------------------------------------------------
    # 2. VIP Players (vip rank)
    # --------------------------------------------------
    lp group vip permission set craftingblueprints.group.vip true

    # --------------------------------------------------
    # 3. Moderators & Staff (moderator rank)
    # --------------------------------------------------
    lp group moderator permission set craftingblueprints.item.list true
    lp group moderator permission set craftingblueprints.return true
    lp group moderator permission set craftingblueprints.status true

    # --------------------------------------------------
    # 4. Server Administrators (admin rank)
    # --------------------------------------------------
    lp group admin permission set craftingblueprints.* true
    ```

=== "YAML Format (groups.yml)"

    If you manage LuckPerms via file storage (`plugins/LuckPerms/yaml-storage/groups.yml`):

    ```yaml
    default:
      permissions:
        - craftingblueprints.menu:
            value: true
        - craftingblueprints.buy:
            value: true
        - craftingblueprints.sell:
            value: true
        - craftingblueprints.cani:
            value: true
        - craftingblueprints.info:
            value: true
        - craftingblueprints.owner:
            value: true
        - craftingblueprints.group.default:
            value: true

    vip:
      parents:
        - default
      permissions:
        - craftingblueprints.group.vip:
            value: true

    moderator:
      parents:
        - default
      permissions:
        - craftingblueprints.item.list:
            value: true
        - craftingblueprints.return:
            value: true
        - craftingblueprints.status:
            value: true

    admin:
      permissions:
        - craftingblueprints.*:
            value: true
    ```

---

## Network & World-Specific Permissions

On multi-server networks or multi-world servers where crafting progression differs between worlds (e.g. Survival vs Creative):

```bash
# Allow catalog access only in the survival world
lp group default permission set craftingblueprints.item.list true world=survival

# Restrict admin status check to the management hub server
lp group moderator permission set craftingblueprints.status true server=lobby
```
