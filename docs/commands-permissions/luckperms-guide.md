# Permissions & LuckPerms Guide

This guide details all permission nodes for CraftingBlueprints and provides copy-paste permission sets for your LuckPerms groups.

---

## Master Permissions Table

| Permission Node | Description | Default |
| :--- | :--- | :--- |
| `craftingblueprints.*` | Grants full administrative access to all commands and features. | `op` |
| `craftingblueprints.menu` | Allows opening the personal progression dashboard (`/cb menu`). | `true` (all players) |
| `craftingblueprints.item.list` | Allows opening the public blueprint catalog (`/cb item list`). | `true` (all players) |
| `craftingblueprints.info` | Allows viewing detailed recipe specs (`/cb info`). | `true` (all players) |
| `craftingblueprints.return` | Allows using the back navigation stack (`/cb return`). | `true` (all players) |
| `craftingblueprints.give` | Allows giving blueprints to players (`/cb give`). | `op` |
| `craftingblueprints.reload` | Allows hot-reloading configurations (`/cb reload`). | `op` |
| `craftingblueprints.admin` | Access to core administration tools (`/cb validate`, etc.). | `op` |
| `craftingblueprints.status` | Allows running diagnostic health checks (`/cb status`). | `op` |
| `craftingblueprints.admin.preset` | Allows installing or removing preset packs (`/cb preset`). | `op` |
| `craftingblueprints.admin.generate`| Allows auto-scaffolding blueprints from recipes (`/cb generate`). | `op` |
| `craftingblueprints.bypass.ownership` | Bypasses item ownership restrictions. | `op` |

---

## Recommended LuckPerms Configurations

Run these commands in your console to configure your server ranks cleanly:

### 1. Default Players (`default` group)
Standard players only need access to view their own progress and open the catalog:

```bash
lp group default permission set craftingblueprints.menu true
lp group default permission set craftingblueprints.item.list true
lp group default permission set craftingblueprints.info true
lp group default permission set craftingblueprints.return true
```

### 2. Moderators / Builders (`moderator` group)
Moderators who need to inspect plugin status:

```bash
lp group moderator permission set craftingblueprints.status true
lp group moderator permission set craftingblueprints.info true
```

### 3. Server Administrators (`admin` group)
Full access to reload, validate, and grant items:

```bash
lp group admin permission set craftingblueprints.* true
```
