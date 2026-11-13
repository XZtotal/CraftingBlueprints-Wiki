# Permissions & LuckPerms Guide

This guide provides the complete permission nodes reference for CraftingBlueprints, explains recipe group permission mechanics, and provides copy-paste LuckPerms configurations for production server ranks.

---

## Master Permissions Table

| Permission Node | Default Assignment | Description & Access Scope |
| :--- | :--- | :--- |
| `craftingblueprints.*` | Server Operators (`op`) | Grants unrestricted access to all commands, editors, and administrative tools. |
| `craftingblueprints.menu` | `true` (All Players) | Allows opening the personal progression dashboard (`/cb menu`). |
| `craftingblueprints.buy` | `true` (All Players) | Allows purchasing blueprints using Vault economy (`/cb buy <id> [--item]`). |
| `craftingblueprints.sell` | `true` (All Players) | Allows selling the blueprint held in hand using Vault economy (`/cb sell`). |
| `craftingblueprints.cani` | `true` (All Players) | Allows checking recipe craftability via `/cb cani <item>`. |
| `craftingblueprints.info` | `true` (All Players) | Allows viewing detailed recipe specifications and lore via `/cb info`. |
| `craftingblueprints.owner` | `true` (All Players) | Allows checking who unlocked or owns the held blueprint via `/cb owner`. |
| `craftingblueprints.return` | `false` | Allows navigating back through previous menus using `/cb return`. |
| `craftingblueprints.item.list` | `false` | Allows opening the administrative blueprint catalog GUI (`/cb item list`). |
| `craftingblueprints.item.edit` | Server Operators (`op`) | Allows opening the visual in-game GUI blueprint editor (`/cb item edit`). |
| `craftingblueprints.give` | Server Operators (`op`) | Allows distributing physical blueprints to players via `/cb give`. |
| `craftingblueprints.reload` | Server Operators (`op`) | Allows hot-reloading configurations, translations, and blueprints (`/cb reload`). |
| `craftingblueprints.admin` | Server Operators (`op`) | Allows executing dry-run syntax validation passes (`/cb validate`). |
| `craftingblueprints.status` | Server Operators (`op`) | Allows viewing system metrics, database health, and latency (`/cb status`). |
| `craftingblueprints.admin.preset` | Server Operators (`op`) | Allows installing, previewing, and removing modality presets (`/cb preset`). |
| `craftingblueprints.admin.generate`| Server Operators (`op`) | Allows auto-scaffolding blueprint YAML files from recipes (`/cb generate`). |
| `craftingblueprints.bypass` | Server Operators (`op`) | Bypasses all recipe restrictions, allowing free crafting, brewing, and smithing. |
| `craftingblueprints.group.<id>` | None | Unlocks all recipes configured within the specified permission group in `config.yml`. |

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
