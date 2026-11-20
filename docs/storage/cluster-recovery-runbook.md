# Cluster Recovery & Failover Runbook

This runbook provides actionable, step-by-step incident response procedures for Minecraft network operators and system administrators managing CraftingBlueprints multi-server clusters.

Every incident scenario follows Site Reliability Engineering (SRE) standard formatting: **Observable Symptoms**, **Root Cause Analysis**, **Remediation Procedure**, and **Post-Incident Validation**.

---

## Incident Scenario 1: Dual-Master Conflict (Split-Brain Hazard)

### Observable Symptoms

* The server console on one or more backend instances continuously logs high-priority warnings:
  ```text
  [CraftingBlueprints] CONFLICT: Multiple Master nodes detected!
  Local Node: [Hub-01] (Master)
  Conflicting Remote Node: [Survival-01] (Master)
  To prevent data corruption, set 'is-master: false' on secondary nodes immediately!
  ```

* Blueprint items or recipes frequently revert or change unexpectedly.
* File records in `cb_cluster_files` alternate between different versions.

### Root Cause Analysis
More than one server instance in the network has `is-master: true` enabled in `plugins/CraftingBlueprints/config.yml`. Both servers attempt to compile local YAML files into database rows, broadcast conflicting `BLUEPRINT_RELOAD` signals, and push competing disk files into `cb_cluster_files`.

### Remediation Procedure

#### Step 1: Identify the Authoritative Master
Choose the single server designated as your administrative hub or staging server (typically `Hub-01` or `Admin-01`).

#### Step 2: Demote Secondary Nodes
On every secondary server reporting the conflict (e.g., `Survival-01`, `Skyblock-01`):

1. Open `plugins/CraftingBlueprints/config.yml`.
2. Locate the `is-master` key and change it to `false`:
   ```yaml
   # Change on ALL secondary servers:
   is-master: false
   ```

3. Save the file.

#### Step 3: Reload Secondary Nodes
On each adjusted server, execute:
```text
/cb reload
```
The node will transition from Master to Worker mode, flush its compilation pipelines, and register as a read-only mirror.

#### Step 4: Re-assert Master Authority
On the designated true Master server, force a clean database sync:
```text
/cb cluster files push --force --prune
/cb reload
```

### Post-Incident Validation
Run `/cb status` on the Master and several Worker nodes:

* The Master node must display: `Role: Master (Primary File Publisher)`.
* All other nodes must display: `Role: Worker (Read-Only Mirror)`.
* Zero conflict alerts appear in server logs.

---

## Incident Scenario 2: Worker Node Missing Textures / Desync

### Observable Symptoms

* Players on a Worker server report pink-and-black checkered missing texture squares on custom map blueprints.
* Console logs report missing image assets:
  ```text
  [CraftingBlueprints] Unable to load custom background image: images/backgrounds/forge.png (File not found on disk)
  ```

* Recipe book previews or menu icons on Worker servers show outdated recipes.

### Root Cause Analysis
A Worker node failed to mirror files from `cb_cluster_files` due to one of the following:

1. `cluster-file-sync.sync-on-startup` was disabled (`false`), and the server booted while offline from the database.
2. A network timeout caused the Worker to miss a `CLUSTER_FILES_SYNC` heartbeat signal ping.
3. Disk write permissions prevented `WorkerMirrorConsumer` from writing to `plugins/CraftingBlueprints/images/`.

### Remediation Procedure

#### Step 1: Inspect Local Mirror Status
Run the cluster status command on the affected Worker node:
```text
/cb cluster status
```
Observe the **Local Mirror State**. If desynchronized, it will report:
```text
Local Mirror State: DIVERGENT (12 missing/modified, 0 unpushed)
```

#### Step 2: Identify Discrepancies
Run a diff check to pinpoint exactly which files are missing or modified:
```text
/cb cluster files diff
```
Sample output:
```text
Cluster File Difference Report:
- MISSING: images/backgrounds/forge.png (48.2 KB)
- MISSING: images/stamps/master_stamp.png (12.4 KB)
- MODIFIED: blueprints/weapons/excalibur.yml (1.2 KB)
```

#### Step 3: Force Mirror Pull
Execute an immediate manual pull on the Worker node:
```text
/cb cluster files pull --force
```
Expected console response:
```text
[CraftingBlueprints] Cluster sync complete: 12 downloaded, 0 pruned. Local files are up to date.
```

#### Step 4: Verify Memory Cache Eviction
The pull routine automatically triggers `LazyImageLoader.clear()` and refreshes map renderers. In-game, open a blueprint map or inspect `/cb menu` to verify that custom textures render properly.

---

## Incident Scenario 3: Checksum Mismatch & Download Abort

### Observable Symptoms

* The server console on a Worker node emits a corrupted download alert:
  ```text
  [CraftingBlueprints] Checksum mismatch for 'images/presets/rpg/frame.png':
  CalculatedHash (e3b0c442...) != RemoteManifest.sha256 (a8f94c11...)
  Corrupted download discarded. Local file retained.
  ```

* The file is not updated on disk, and the mirror remains in a divergent state.

### Root Cause Analysis
During a delta pull, the binary payload streamed from MySQL did not match the expected SHA-256 hash. Common causes:

1. An unstable network connection interrupted the JDBC BLOB stream mid-transfer.
2. An administrator manually edited or truncated raw BLOB data inside the `cb_cluster_files` table using an external SQL GUI (e.g. phpMyAdmin or HeidiSQL).

### Remediation Procedure

#### Step 1: Verify Master Checksum Integrity
On the Master server, recalculate SHA-256 hashes from disk and force an authoritative database update:
```text
/cb cluster files push --force
```
This recomputes the SHA-256 digest directly from the Master's local filesystem and updates the database row.

#### Step 2: Retry Download on Worker Node
On the affected Worker node, pull the refreshed records:
```text
/cb cluster files pull
```

#### Step 3: Validate Download Success
Check that the hash validation passes cleanly:
```text
/cb cluster status
```
The state should transition to:
```text
Local Mirror State: IN SYNC (142/142 matching)
```

---

## Incident Scenario 4: MySQL Packet Overflow (`PacketTooBigException`)

### Observable Symptoms

* When executing `/cb cluster files push` or during server boot on the Master node, the push fails with a JDBC exception:
  ```text
  com.mysql.cj.jdbc.exceptions.PacketTooBigException:
  Packet for query is too large (18,452,109 > 16,777,216).
  You can change this value on the server by setting the 'max_allowed_packet' variable.
  ```

* High-resolution custom PNG textures or large blueprint bundles fail to save to the database.

### Root Cause Analysis
The payload size of a single file (or a batched SQL query containing binary BLOB data) exceeds the MySQL server's `max_allowed_packet` limit (which defaults to `16MB` on many Linux distributions).

### Remediation Procedure

#### Step 1: Hot-Fix MySQL Runtime (No Database Restart Required)
Connect to your MySQL server as `root` (or administrative user) and increase the limit dynamically:

```sql
SET GLOBAL max_allowed_packet = 67108864; -- Set to 64MB
```

#### Step 2: Persist in MySQL Server Configuration
To ensure the setting survives MySQL restarts, update your server configuration file:

* **Ubuntu / Debian**: `/etc/mysql/mysql.conf.d/mysqld.cnf`
* **RHEL / CentOS**: `/etc/my.cnf`
* **Windows**: `my.ini`

Add or update the directive under `[mysqld]`:

```ini
[mysqld]
max_allowed_packet = 64M
```

#### Step 3: Verify Plugin Configuration Limits
In `plugins/CraftingBlueprints/config.yml` on your Minecraft servers, ensure `max-file-size-mb` matches your expectations:

```yaml
cluster-file-sync:
  # Cap file uploads to prevent runaway packet sizes
  max-file-size-mb: 16
  # Ensure GZIP compression is enabled for text files
  gzip-text-files: true
```

#### Step 4: Re-attempt File Push
On the Master node, execute:
```text
/cb cluster files push
```
The files will upload cleanly without packet rejection.

---

## Incident Scenario 5: Master Node Disaster Recovery & Failover

### Observable Symptoms

* The dedicated Master server (e.g. `Hub-01`) experiences catastrophic hardware failure, operating system crash, or data loss.
* Administrators cannot deploy presets, edit blueprint YAML files, or broadcast cluster updates.

### Root Cause Analysis
Master server outage. While Worker servers continue operating normally in read-only mode using cached data, administrative management is offline.

### Emergency Failover Procedure

#### Step 1: Promote a Replacement Server
Select an existing Worker node (e.g., `Survival-01`) to become the new temporary or permanent Master.

1. Open `plugins/CraftingBlueprints/config.yml` on `Survival-01`.
2. Change the node role to Master:
   ```yaml
   is-master: true
   ```

3. Save the file and reload:
   ```text
   /cb reload
   ```

#### Step 2: Recover Files from Database
Because all active blueprints, custom PNG images, and loot tables were previously mirrored to `cb_cluster_files`, the new Master can reconstruct its local disk assets directly from the database:

```text
/cb cluster files pull --force
```

#### Step 3: Verify Full Authority
Run `/cb cluster status` on the newly promoted Master. It will confirm:
```text
Node Role: Master (Primary File Publisher)
Tracked Files in DB: 142 files (4.82 MB)
Local Mirror State: IN SYNC
```
The server now possesses full authority to compile YAML files, execute `/cb preset apply`, and distribute updates across the network.

---

## Emergency Command Cheat Sheet

| Task | Command | Target Server | Flag Description |
| :--- | :--- | :---: | :--- |
| **Check Cluster State** | `/cb cluster status` | Any Node | Displays role, database latency, and sync state. |
| **Inspect Differences** | `/cb cluster files diff` | Any Node | Lists added, modified, and deleted files. |
| **Force Push to Database** | `/cb cluster files push --force` | Master Node | Overwrites all DB file records from local disk. |
| **Force Prune Deleted DB Files**| `/cb cluster files push --prune` | Master Node | Removes DB records for files deleted locally. |
| **Force Pull from Database** | `/cb cluster files pull --force` | Worker Nodes | Overwrites all local files with DB copies. |
| **General Node Reload** | `/cb reload` | Any Node | Recompiles YAMLs (Master) or refreshes RAM (Worker). |
