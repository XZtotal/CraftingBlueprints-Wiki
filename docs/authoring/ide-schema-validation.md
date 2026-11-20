# IDE IntelliSense & Schema Validation

To eliminate cognitive overhead, typos, and configuration syntax errors before your server even boots, CraftingBlueprints provides an authoritative **JSON Schema (Draft 7)**: `blueprint.schema.json`.

With JSON Schema integrated into your development environment, modern code editors like **Visual Studio Code** and **IntelliJ IDEA** provide real-time property autocompletion, contextual hover documentation, enum dropdowns, and instant squiggly lint warnings.

---

## Automatic Schema Provisioning

You don't need to manually hunt down or download schema files:

On every server startup, CraftingBlueprints automatically extracts the latest `blueprint.schema.json` into:

1. `plugins/CraftingBlueprints/blueprint.schema.json`
2. `plugins/CraftingBlueprints/blueprints/blueprint.schema.json`

---

## 1. Top-Line Directive (Universal)

The fastest way to enable schema validation in any editor is to place the following directive at **Line 1** of your YAML file:

```yaml
# yaml-language-server: $schema=./blueprint.schema.json
# ==============================================================================
# CraftingBlueprints - My Custom Configuration
# ==============================================================================

singles:
  diamond_sword_blueprint:
    blueprint: DIAMOND_SWORD
    permanent: true
    uses: 0
    price: 5000.0
```

Because `blueprint.schema.json` is located in the same folder, the YAML Language Server immediately attaches and validates your document.

---

## 2. Visual Studio Code Setup

For an optimal workflow across all blueprint files without needing to paste the top-line directive into every file:

### Step 1: Install the YAML Extension
Install the official **YAML Language Support by Red Hat** extension (`redhat.vscode-yaml`) from the Visual Studio Marketplace.

### Step 2: Configure Workspace Schema Mappings
Open your project's `.vscode/settings.json` (or global user settings) and add the following mapping:

```json
{
  "yaml.schemas": {
    "./plugins/CraftingBlueprints/blueprint.schema.json": [
      "plugins/CraftingBlueprints/blueprints/**/*.yml",
      "plugins/CraftingBlueprints/blueprints/**/*.yaml"
    ]
  },
  "yaml.validate": true,
  "yaml.hover": true,
  "yaml.completion": true
}
```

```yaml
singles:
  infernal_blade:
    blueprint: NETHERITE_SWORD
    permaneent: true   # ❌ Schema Warning: Property 'permaneent' is not allowed. Did you mean 'permanent'?
```

---

## 3. IntelliJ IDEA / JetBrains Setup

IntelliJ IDEA Ultimate and Community editions feature native JSON Schema support:

1. Open **Settings / Preferences** (`Ctrl + Alt + S` on Windows/Linux, `Cmd + ,` on macOS).
2. Navigate to:  
   **Languages & Frameworks → Schemas and DTDs → JSON Schema Mappings**.

3. Click the **`+` (Add)** icon to create a new mapping:
    - **Name**: `CraftingBlueprints Schema`
    - **Schema file or URL**: Browse and select `plugins/CraftingBlueprints/blueprint.schema.json` (or relative path `./blueprint.schema.json`).
    - **Schema version**: `JSON Schema version 7`.
4. Under **File path pattern**, add:
   ```text
   plugins/CraftingBlueprints/blueprints/**/*.yml
   ```

5. Click **Apply** and **OK**.

---

## Features Provided by the Schema

With schema validation active in your IDE, you gain:

### 1. Instant Autocompletion (`Ctrl + Space`)
Pressing `Ctrl + Space` anywhere in your blueprint file displays valid keys, sub-blocks, and allowable values:

- Root keys: `singles`, `packages`, `mysteries`, `templates`, `default`, `file_default`.
- Single properties: `blueprint`, `name`, `lore`, `permanent`, `uses`, `time`, `price`, `sell_price`, `station`, `item`, `extra`.
- Station enums: `CRAFTING_TABLE`, `BLAST_FURNACE`, `SMOKER`, `FURNACE`, `STONECUTTER`, `BREWING_STAND`, `ANVIL`, `ENCHANTING_TABLE`, `ANY`.

### 2. Typo Protection & Strict Key Linting
If you accidentally misspell a key (such as `proce: 500` instead of `price: 500` or `tiem: 1h` instead of `time: 1h`), your editor flags it with an immediate red squiggly line. This prevents silent errors that might otherwise result in free or permanent items on your server.

### 3. In-Editor Documentation Tooltips
Hovering your mouse over any YAML key displays its official description, unit formats (such as `1h`, `7d`, `30m`), default values, and example snippets directly inside your editor.

!!! tip "Combine Schema with `/cb validate`"
    While JSON Schema provides real-time linting in your IDE, running `/cb validate` in-game or from console performs the final server-side check—verifying that materials exist on your specific Minecraft version and that ID collisions do not exist across your server's database.
