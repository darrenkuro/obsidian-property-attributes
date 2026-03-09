<h1 align="center">Property Attributes</h1>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

> Obsidian plugin that injects `data-property-key` attributes on the All Properties panel for CSS targeting.

---

## Overview

This is a personal tool built to do one thing well: expose property names as data attributes in Obsidian's All Properties sidebar panel.

Obsidian's note properties view already provides `data-property-key` attributes on each property row, making CSS customization straightforward. The All Properties sidebar panel, however, uses plain `.tree-item` elements with no data attributes — the property name exists only as text content, which CSS cannot select. This plugin bridges that gap by reading each property name and injecting a matching `data-property-key` attribute, so a single CSS snippet can target properties by name in both views.

## Motivation

Plugins like [Iconic](https://github.com/gfxholo/iconic) offer comprehensive icon customization for properties, files, tabs, and more. This plugin covers a small subset of that functionality — specifically, enabling CSS-based property icon styling in the sidebar.

The trade-off is intentional. By keeping the scope minimal and the implementation in pure CSS (with a thin attribute-injection layer), there are no settings to manage, no icon packs to bundle, and no runtime overhead beyond a lightweight DOM observer. The styling itself lives in a standard CSS snippet, fully under the user's control and trivially auditable.

## How It Works

On layout ready and every layout change, the plugin:

1. Finds all `.workspace-leaf-content[data-type="all-properties"]` containers
2. For each `.tree-item`, reads `.tree-item-inner-text` and sets `data-property-key="<name>"`
3. Watches for DOM changes via `MutationObserver` (debounced) to re-inject on updates

On unload, all injected attributes are removed and observers disconnected. No persistent state, no data files.

## Installation

This plugin is not published to the Obsidian community directory. It can be installed via [BRAT](https://github.com/TfTHacker/obsidian42-brat) at your own discretion:

1. Install the BRAT plugin if you haven't already
2. In BRAT settings, add `darrenkuro/obsidian-property-attributes`
3. Enable the plugin in Obsidian's community plugins settings

As a personal tool, there are no guarantees of support or compatibility with future Obsidian versions.

## Usage

Once enabled, all `.tree-item` elements in the All Properties panel will have `data-property-key` attributes matching their property names. Use CSS snippets to style properties in both views with combined selectors:

```css
/* Hide default icon and replace with a custom one */
.metadata-property[data-property-key="tags"] .metadata-property-icon svg,
.tree-item[data-property-key="tags"] .tree-item-icon svg {
  display: none;
}

.metadata-property[data-property-key="tags"] .metadata-property-icon::after,
.tree-item[data-property-key="tags"] .tree-item-icon::after {
  content: "";
  display: inline-block;
  width: var(--icon-size);
  height: var(--icon-size);
  -webkit-mask-image: url("data:image/svg+xml,...");
  -webkit-mask-size: contain;
  background-color: var(--color-orange);
}
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
