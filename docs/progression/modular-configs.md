# Modular Configurations (`configs/`)

CraftingBlueprints features a modular configuration architecture that allows server operators, development teams, and community pack creators to organize progression groups and recipe restrictions across separate files without cluttering or modifying the global `config.yml`.

---

## Architectural Motivation

On large Minecraft servers, maintaining a single monolithic `config.yml` containing hundreds of permission groups and recipe restrictions leads to operational friction:

* **Merge Conflicts**: Multiple administrators editing `config.yml` simultaneously can overwrite settings or break YAML formatting.
* **Modality Stacking**: Installing an SMP progression pack alongside an RPG magic scroll pack risks overwriting existing server groups.
* **Cluttered Version Control**: Reviewing Git diffs on a 2,000-line configuration file is error-prone.

CraftingBlueprints solves this by introducing the **`configs/`** directory.

```	ext
plugins/CraftingBlueprints/
├── config.yml                  # Base server settings (Database, Performance, Base Groups)
└── configs/                    # Modular configuration overrides
    ├── smp_ranks.yml           # Custom survival ranks (VIP, Elite)
    ├── alchemy_rules.yml       # Potion & alchemy restriction rules
    └── presets/
        └── hardcore_smp/       # Modular files deployed by 1-Click Presets
            ├── groups.yml
            └── restrictions.yml
```

---

## Directory Scanning & Arbitrary File Naming

When the server starts or when an administrator executes `/cb reload`:

1. **Recursive Discovery**: The engine recursively scans the `plugins/CraftingBlueprints/configs/` directory, including all nested subdirectories (such as `configs/presets/<id>/`).
2. **Arbitrary File Naming**: Files **do not require specific names** (such as `groups.yml` or `restrictions.yml`). Any file ending in `.yml` or `.yaml` is inspected.
3. **Smart Section Detection**: The loader checks each discovered file for the presence of:
    * A `groups:` mapping.
    * A `restrictions:` mapping (or root `restricted-items:` list).

Files without these sections are safely ignored without logging warnings.

---

## Mathematical Set-Union Merging

When CraftingBlueprints loads modular configuration files, it aggregates them with the base `config.yml` using deterministic **Mathematical Set Union**:

### 1. Recipe Restrictions (`restrictions.restricted-items`)
If `config.yml` defines 10 restricted items and a modular file `configs/alchemy_rules.yml` defines 5 potion restrictions:

$$\text{ActiveRestrictions} = \text{BaseRestrictions} \cup \text{ModularRestrictions}$$

* Identical patterns are automatically deduplicated.
* All patterns participate equally in the `RestrictionEngine` pipeline.

### 2. Permission Groups (`groups:`)
If a group identifier (such as `default` or `vip`) is declared in `config.yml` and supplemented by one or more files in `configs/`:

* **Blueprint Patterns**: The list of regex patterns and literal item IDs is combined via set union ($A \cup B$), eliminating duplicates.
* **Inheritance (`inherits:`)**: The list of inherited parent groups is merged via set union ($Parents_A \cup Parents_B$).
* **Display Name (`name:`)**: If a modular file provides an explicit `name:`, it updates the group display label, prioritizing custom configurations over default IDs.

All aggregated groups participate in the Directed Acyclic Graph (DAG) topological sorting and 3-color cycle detection described in [Hierarchical Permission Groups](permission-groups.md).

---

## Production Configuration Examples

### Example 1: Custom Server Ranks (`configs/smp_ranks.yml`)

You can define server-specific progression ranks in their own file:

```yaml
# ==============================================================================
# CraftingBlueprints - SMP Rank Additions
# File: configs/smp_ranks.yml
# ==============================================================================

groups:
  # Extends the existing 'vip' group with additional diamond tools
  vip:
    blueprints:
      - diamond_axe
      - diamond_shovel
      - diamond_hoe

  # Introduces a new endgame rank inheriting from vip
  champion:
    name: "Server Champion"
    inherits:
      - vip
    blueprints:
      - netherite_axe
      - netherite_pickaxe
      - beacon
```

### Example 2: Potion Restrictions (`configs/alchemy_rules.yml`)

Isolate alchemical restrictions from equipment restrictions:

```yaml
# ==============================================================================
# CraftingBlueprints - Alchemy Restrictions
# File: configs/alchemy_rules.yml
# ==============================================================================

restrictions:
  restricted-items:
    - "potion:strength.*"
    - "potion:speed_2"
    - "potion:invisibility.*"
    - "potion:turtle_master.*"
```

---

## Hot-Reload & Zero Residue

Managing modular configurations is fully dynamic:

### Adding or Modifying Files
Create a new file in `configs/` or edit an existing one, then run:

```text
/cb reload
```

The loader immediately reparses all files, re-merges groups and restrictions, updates the in-memory lookup sets, and logs a clean startup summary:

```text
[CraftingBlueprints] Loaded 4 blueprint groups: default (142 recipes), vip (175 recipes), pro (210 recipes), champion (225 recipes).
[CraftingBlueprints] Loaded 28 recipe restriction rules from 3 configuration files.
```

### Deleting Files (Zero Residue)
If you delete a modular file from `configs/` (or remove an applied preset with `/cb preset remove <id>`) and run `/cb reload`:

1. The deleted file's groups and restriction rules are **completely purged from memory**.
2. No residual or "orphan" patterns linger in server memory.
3. Groups defined exclusively in the deleted file are removed from Bukkit's permission registry.
4. Server progression instantly reverts to the state defined by remaining files.

---

## Next Steps

* **Explore Recipe Restrictions**: Learn about category prefixes and pattern matching in [Recipe Restrictions](recipe-restrictions.md).
* **Configure Group Hierarchies**: Understand DAG cycle detection and OP isolation in [Hierarchical Permission Groups](permission-groups.md).
* **Deploy Presets**: Use [1-Click Presets](../getting-started/presets-quickstart.md) to automatically populate `configs/presets/` with tested progression suites.
