# Troubleshooting Common Issues

Step-by-step diagnostic procedures for common edge cases.

---

## 1. "Maps appear completely blank"

If blueprint maps are given to players as blank maps without schematics:

1. Open `plugins/CraftingBlueprints/config.yml`.
2. Ensure that map rendering is enabled:
   ```yaml
   images-on-maps: true
   ```
3. If using custom PNG background textures, verify that:
   * The file is located in `plugins/CraftingBlueprints/images/backgrounds/`.
   * The image is **exactly 128x128 pixels** in 32-bit RGBA PNG format.
4. Run `/cb reload config` and `/cb reload blueprints`.

---

## 2. "Players can still craft items without the blueprint"

If players can craft recipes that are supposed to be locked:

1. **Check for Operator Bypass**:
   Are you testing with a player account that has `/op`?
   By default, `op-bypass: true` in `config.yml` allows operators to craft everything freely. To test properly, run `/deop <player>`.

2. **Check your Restriction Mode**:
   In `config.yml`, look at `restrictions.mode`:
   * If `mode: "restricted-only"`, recipes are only locked if they match the `restricted-items` list. Ensure your target item pattern is listed there.
   * If `mode: "all"`, every recipe is locked by default.

---

## 3. "YAML syntax error when starting the server"

If the console reports a parsing error when loading your blueprint files:

1. Execute the validation command:
   ```text
   /cb validate
   ```
2. The validator will output the exact file name and line number containing the syntax error (e.g. invalid indentation or missing colons).
3. Ensure you are using **spaces** rather than tab characters in your YAML files.
