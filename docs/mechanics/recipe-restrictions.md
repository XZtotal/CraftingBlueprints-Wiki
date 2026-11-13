# Recipe Restrictions (Whitelist Mode)

CraftingBlueprints includes a flexible restriction engine that controls whether your server operates in **Universal Gating Mode** or **Selective Whitelist Mode**.

---

## Operating Modes

Configured in `plugins/CraftingBlueprints/config.yml` under `restrictions:`:

```yaml
restrictions:
  # Mode options: 'all' or 'restricted-only'
  mode: "restricted-only"

  # Items that require blueprints when mode is 'restricted-only'
  restricted-items:
    - "diamond_.*"
    - "netherite_.*"
    - "enchanted_golden_apple"
    - "beacon"
    - "potion:strength.*"
    - "enchantment:mending"
```

---

## 1. Selective Mode (`mode: "restricted-only"`) *(Recommended for SMP/Survival)*

In this mode:
* **All standard Minecraft recipes are freely craftable by everyone by default** without needing any blueprints (wood, torches, bread, stone tools, iron armor).
* **Only items matching `restricted-items` are locked behind blueprints.**

### Why use Selective Mode?
It allows you to introduce custom blueprints for endgame gear (such as Netherite weapons, Beacons, or Elytra repairs) without annoying your players by forcing them to unlock basic wooden pickaxes or torches.

---

## 2. Universal Gating Mode (`mode: "all"`)

In this mode:
* **Every craftable item, potion, and enchantment on your server requires a blueprint** before it can be made.
* Ideal for hardcore RPG, tech progression, and progression-locked MMO servers where players must unlock their crafting repertoire step-by-step.

---

## Pattern Matching Syntax

The `restricted-items:` list supports exact names, category prefixes, and regular expressions:

| Pattern | Description | Matches |
| :--- | :--- | :--- |
| `beacon` | Exact material match. | `BEACON` |
| `diamond_.*` | Wildcard match for all Diamond gear. | `DIAMOND_SWORD`, `DIAMOND_CHESTPLATE`, `DIAMOND_PICKAXE`, etc. |
| `netherite_.*` | Wildcard match for all Netherite gear. | `NETHERITE_HELMET`, `NETHERITE_AXE`, etc. |
| `potion:strength.*` | Restricts Strength I and Strength II brewing. | Standard, splash, and lingering Strength potions. |
| `enchantment:mending` | Restricts applying Mending enchantments in anvils. | Mending books and equipment. |

---

## Operator Bypass (`op-bypass`)

In `config.yml`:

```yaml
op-bypass: true
```

* If `true`, server operators (`/op`) bypass all recipe restrictions and can craft freely.
* If you are testing whether restrictions work, make sure to deop your account or set `op-bypass: false` temporarily.
* For permissions-based bypass for moderators or VIPs, assign the permission `craftingblueprints.bypass.ownership`.
