# Frequently Asked Questions (FAQ)

Quick answers to the most common questions asked by server administrators and creators.

---

### Does CraftingBlueprints cause server lag or drop TPS?
**No.** All database saves, file watching, and map graphic compositing execute asynchronously on non-blocking background workers. The main server thread is only touched for instant Bukkit crafting event decisions, ensuring buttery-smooth 20.0 TPS.

---

### Will players lose their unlocked recipes if I switch from SQLite to MySQL?
Not if you perform a migration. By default, SQLite stores data locally in `crafting_blueprints.db`. If you switch to MySQL, you start with a clean MySQL database unless you export or migrate your data.

---

### Can players craft items with Shift-Click?
**Yes.** CraftingBlueprints features full shift-craft support. It mathematically calculates available inventory space and accurately decrements remaining uses if the blueprint has limited uses.

---

### Does the plugin work with custom items from ItemsAdder or Oraxen?
**Yes.** You can define CustomModelData on physical blueprint items or use custom materials in the target recipe. See our [Custom Items Guide](../blueprints/custom-items.md).

---

### What happens if a player's inventory is full when receiving a blueprint?
CraftingBlueprints prevents item loss. Any items that cannot fit inside the player's inventory will safely drop onto the ground directly at the player's location.

---

### Does the plugin support BungeeCord and Velocity networks?
**Yes.** By pointing all proxy servers to a shared MySQL database, player unlocks synchronize seamlessly across all your game instances. See our [Multi-Server Setup Guide](../storage/mysql-multiserver.md).
