# Recipe Scaffolder (/cb generate)

Writing YAML files by hand for dozens of recipes can take hours. CraftingBlueprints includes an automatic **Recipe Scaffolder** (`/cb generate`) that inspects all recipes registered on your server and automatically creates valid blueprint YAML files in seconds.

---

## How It Works

1. The plugin scans Bukkit's recipe registry (including vanilla recipes and recipes added by other plugins).
2. For each recipe, it detects the ingredients, target material, and amount.
3. It generates ready-to-use YAML configuration files in `plugins/CraftingBlueprints/blueprints/` complete with matching map graphics and rarity tiers.

---

## Command Usage

```text
/cb generate <source> [flags]
```

**Permission Required**: `craftingblueprints.admin.generate` (Default: `op`).

---

## Practical Examples

### 1. Generate Blueprints for All Vanilla Recipes
Scaffolds the entire vanilla Minecraft recipe catalog into your `blueprints/` folder:

```text
/cb generate vanilla
```

### 2. Generate with Specific Aesthetic Flags
You can force generated blueprints to use a specific background texture or rarity tier:

```text
/cb generate vanilla --tier=RARE --background=texture_blueprint_grid
```

### 3. Generate from an External Plugin
If you have custom recipes registered by an external plugin:

```text
/cb generate plugin <plugin_name>
```

---

## After Generation

1. Review the generated files in `plugins/CraftingBlueprints/blueprints/`.
2. Customize names, lore, or prices if desired.
3. Run `/cb reload blueprints` to activate your newly scaffolded catalog!
