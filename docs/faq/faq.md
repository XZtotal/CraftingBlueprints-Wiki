# Frequently Asked Questions (FAQ)

Direct, authoritative answers to the most common questions asked by server administrators and creators.

---

### Does CraftingBlueprints impact server TPS or cause lag spikes?
**No.** CraftingBlueprints is engineered from the ground up for high-concurrency production networks:
* All database persistence, HikariCP connection queries, file watching, and map graphic dithering execute strictly on asynchronous background threads.
* Pre-quantized `byte[16384]` palette buffers are blitted onto maps in **< 0.02 milliseconds** per tick.
* The main server thread is only consulted for instant Bukkit crafting event decisions, maintaining a solid 20.0 TPS.

---

### Can players exploit Shift-Clicking to bypass limited-use blueprints?
**No.** CraftingBlueprints features an atomic Capacity Math Engine (`ShiftCraftMath.kt`). When a player shift-clicks a crafting table, the engine calculates the minimum between available ingredients, empty inventory space, and remaining blueprint uses:
$$\text{CraftCount} = \min(\text{MatrixCapacity}, \text{InventorySpace}, \text{RemainingUses})$$
A player with 2 uses remaining who shift-clicks a full stack of materials will craft **exactly 2 items**, decrement exactly 2 uses, and leave the remaining materials untouched in the crafting grid.

---

### How do I prevent operators from bypassing recipe restrictions during testing?
By default, `op-bypass: true` in `config.yml` allows server operators (`/op`) to craft, brew, and enchant all restricted recipes freely.
* To test restrictions properly as a normal player, either deop yourself: `/deop <your_name>`
* Or temporarily set `op-bypass: false` in `config.yml` and execute `/cb reload config`.

---

### What happens if a player's inventory is full when receiving a blueprint?
CraftingBlueprints enforces **Physical Overflow Preservation**. When running `/cb give`, if the player's inventory has no free slots, the remaining blueprint items automatically drop onto the ground directly at the player's feet (`world.dropItem(...)`). No items ever vanish into the void.

---

### Does CraftingBlueprints work with custom items from ItemsAdder, Oraxen, and Nexo?
**Yes.** The plugin features an extensible `ItemIdentifierProvider` SPI. You can gate custom weapons, armor, and tools using their native prefixes:
* ItemsAdder: `ia:<namespace:id>`
* Oraxen: `oraxen:<id>`
* Nexo: `nexo:<id>`
* MMOItems: `mmoitems:<TYPE>:<ID>`
* Pure CustomModelData: `diamond_sword@custom_model_data:1042`
See our [Custom Items Guide](../blueprints/custom-items.md).

---

### Can I connect multiple servers to a shared MySQL database?
**Yes.** CraftingBlueprints fully supports BungeeCord and Velocity networks. Follow the **Golden Rule of Multi-Server Networks**:
* Designate **ONE Primary Management Node** (e.g. Hub) with `sync-from-files: true`.
* Configure **ALL Worker Nodes** (Survival, Skyblock, Factions) with `sync-from-files: false`.
When the master server reloads, it emits an atomic heartbeat ping (`cb_sync_signals`), and worker nodes automatically refresh their local cache within seconds. See our [Multi-Server Setup Guide](../storage/mysql-multiserver.md).

---

### How do I prevent Minecraft 1.21 redstone Crafters from bypassing blueprints?
In `config.yml`, ensure `crafter.block-restricted: true` is enabled. When active, redstone-powered Crafter blocks attempting to produce restricted recipes are intercepted, emit dispenser fail clicks and smoke particles, and leave all raw materials safely in the grid.

---

### Do I need to restart my server when editing blueprint YAML files?
**No.** You can hot-reload your blueprints at any time with zero downtime using:
```text
/cb reload blueprints
```
If `file-management.auto-reload.enabled: true` is active, the plugin detects file saves on disk and hot-reloads automatically after a short 1.5-second debounce window.
