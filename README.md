<h1 align="center">Property Attributes</h1>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

> Obsidian plugin that injects `data-property-key` attributes on the All Properties panel for CSS targeting.

---

## Overview

Obsidian's note properties view provides `data-property-key` attributes on each property row, making CSS customization straightforward. The **All Properties** sidebar panel, however, uses plain `.tree-item` elements with no data attributes — the property name is only available as text content, which CSS cannot select.

This plugin bridges that gap by reading each property name and injecting a matching `data-property-key` attribute, so CSS snippets can target properties by name in both views.

## How It Works

On layout ready and every layout change, the plugin:

1. Finds all `.workspace-leaf-content[data-type="all-properties"]` containers
2. For each `.tree-item`, reads `.tree-item-inner-text` and sets `data-property-key="<name>"`
3. Watches for DOM changes via `MutationObserver` (debounced) to re-inject on updates

On unload, all injected attributes are removed and observers disconnected.

## Usage

Install via [BRAT](https://github.com/TfTHacker/obsidian42-brat): add `darrenkuro/obsidian-property-attributes`.

Then use CSS snippets to style properties in both views:

```css
/* Note properties view (built-in) */
.metadata-property[data-property-key="tags"] .metadata-property-icon svg { display: none; }

/* All Properties sidebar (via this plugin) */
.tree-item[data-property-key="tags"] .tree-item-icon svg { display: none; }
```

## Project Structure

```
obsidian-property-attributes/
  src/
    main.ts           -- Plugin source (~90 lines)
  manifest.json       -- Obsidian plugin manifest
  esbuild.config.mjs  -- Build config
  .github/
    workflows/
      release.yml     -- CD: build + release on push to main
```

---

## License

[MIT](LICENSE) - Darren Kuro
