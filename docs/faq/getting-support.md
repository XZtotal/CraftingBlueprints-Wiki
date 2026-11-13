# Reporting Bugs & Getting Help

If you encounter unexpected behavior, suspect a bug, or have a feature proposal for CraftingBlueprints, follow this guide to report issues and receive prompt technical assistance.

---

## 1. Pre-Flight Checklist

Before opening an issue or asking for support, run through this quick checklist:

* [ ] **Verify Server Engine**: Ensure you are running an official build of **Paper** or **Purpur** (1.18.2 – 1.21.x). CraftBukkit and standalone Spigot are not supported.
* [ ] **Verify Java Version**: Minecraft 1.18.2–1.20.4 requires Java 17 or 21. Minecraft 1.20.5+ and 1.21+ strictly require **Java 21**.
* [ ] **Run Dry-Run Validation**: Execute `/cb validate` to rule out syntax typos or malformed YAML indentation.
* [ ] **Capture `/cb status`**: Run `/cb status` in console to inspect your active database backend, NMS adapter, and registered blueprint counts.
* [ ] **Check Server Logs**: Search `logs/latest.log` for any relevant stack traces or warning banners.

---

## 2. Opening an Issue on GitHub

We track all official bug reports and feature requests through our GitHub repository:

<div class="grid cards" markdown>

-   :material-bug:{ .lg .middle } __[Submit a Bug Report](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues/new?template=bug_report.yml)__

    ---

    Report unexpected behavior, crafting desyncs, or plugin errors using our structured template.

-   :material-lightbulb:{ .lg .middle } __[Submit a Feature Request](https://github.com/XZtotal/CraftingBlueprints-Wiki/issues/new?template=feature_request.yml)__

    ---

    Propose new workstation integrations, map visual themes, or administrative quality-of-life tools.

</div>

---

## 3. What Information to Include

When submitting a ticket, always provide the following technical details:

1. **Exact Server Software & Build Number**: (e.g. `Purpur 1.20.4 build 2174`).
2. **CraftingBlueprints Diagnostic Report**: Paste the full output of `/cb status`.
3. **Database Backend**: Whether your server is running on embedded `sqlite` or multi-server `mysql`.
4. **Console Logs**: Upload your full `logs/latest.log` to a clean paste service such as **[mclo.gs](https://mclo.gs/)** or **[hastebin](https://hastebin.com/)**. Never post cropped screenshots of console text.
5. **Clear Step-by-Step Reproduction**: Detailed numbered steps explaining how to trigger the issue on a clean test server.
6. **Relevant Configuration Snippets**: The exact YAML block from `config.yml` or your blueprint file in `blueprints/`.
