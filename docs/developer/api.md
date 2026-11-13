# Developer API & Public Events

External plugins can hook into CraftingBlueprints using the official `crafting-blueprints-api` module.

---

## Adding the Dependency

=== "Gradle (Kotlin DSL)"

    ```kotlin
    repositories {
        mavenCentral()
        // Add your repository or flatDir
        flatDir { dirs("libs") }
    }

    dependencies {
        compileOnly("me.xztotal.plugins:crafting-blueprints-api:2.0.0")
    }
    ```

=== "Maven (pom.xml)"

    ```xml
    <dependency>
        <groupId>me.xztotal.plugins</groupId>
        <artifactId>crafting-blueprints-api</artifactId>
        <version>2.0.0</version>
        <scope>provided</scope>
    </dependency>
    ```

---

## Public Lifecycle Events

All events reside in `me.xztotal.plugins.craftingblueprints.api.event` and implement Bukkit's standard `Event` model.

### 1. `BlueprintUnlockEvent`
Fired whenever a player unlocks a blueprint.

```java
import me.xztotal.plugins.craftingblueprints.api.event.BlueprintUnlockEvent;
import me.xztotal.plugins.craftingblueprints.api.event.UnlockSource;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

public class BlueprintListener implements Listener {

    @EventHandler
    public void onBlueprintUnlock(BlueprintUnlockEvent event) {
        Player player = event.getPlayer();
        String blueprintId = event.getBlueprintId();
        UnlockSource source = event.getSource(); // COMMAND, INVENTORY, PURCHASE, DISCOVERY

        player.sendMessage("Unlocked blueprint: " + blueprintId + " via " + source);
    }
}
```

### 2. `BlueprintUseEvent`
Fired when a player completes a crafting recipe using an unlocked blueprint.

```java
import me.xztotal.plugins.craftingblueprints.api.event.BlueprintUseEvent;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

public class CraftListener implements Listener {

    @EventHandler
    public void onBlueprintUse(BlueprintUseEvent event) {
        Player player = event.getPlayer();
        int remainingUses = event.getRemainingUses(); // -1 if unlimited

        if (remainingUses > 0) {
            player.sendMessage("Remaining crafts: " + remainingUses);
        }
    }
}
```

### 3. `BlueprintExpireEvent`
Fired when a time-limited or use-depleted blueprint expires from a player's account.

### 4. `BlueprintBuyEvent` & `BlueprintSellEvent`
Cancellable economy events fired when players purchase or sell blueprints through plugin GUIs or shops.
