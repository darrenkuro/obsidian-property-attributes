<h1 align="center">Vault Augments</h1>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

> Obsidian plugin that enriches the DOM for CSS targeting: property key attributes, inline code language highlighting.

> **Note:** This plugin is built for personal use. I'm unlikely to accept pull requests or feature requests.

---

## Augments

### Property Keys

Injects `data-property-key` attributes on Obsidian's All Properties sidebar panel so CSS snippets can target properties by name.

Obsidian's note properties view provides `data-property-key` attributes on each property row, but the All Properties sidebar uses plain `.tree-item` elements with no data attributes. This augment bridges that gap by reading each property name and injecting a matching `data-property-key` attribute.

**How it works:** On layout ready and every layout change, finds all properties containers, reads `.tree-item-inner-text`, and sets `data-property-key="<name>"`. Uses a debounced `MutationObserver` to re-inject on updates. All attributes are removed on unload.

### Inline Code Language

Adds language-aware syntax highlighting to inline code in reading mode via a `lang>content` prefix syntax.

Write `` `ts>const x: string` `` in your notes, and in reading mode the plugin will:

1. Strip the `ts>` prefix from display text
2. Set `data-lang="typescript"` attribute and `lang-typescript` CSS class
3. Apply Prism.js syntax highlighting (bundled in Obsidian)

**Supported aliases:** `js`, `ts`, `py`, `rb`, `sh`, `yml`, `md`, `rs`, `cs`, `cpp`, `hs`, `ex` (plus any full Prism language name).

**CSS targeting example:**
```css
code[data-lang="typescript"] { border-left: 2px solid #3178c6; }
code[data-lang="python"]     { border-left: 2px solid #3776ab; }
```

## Installation

Install via [BRAT](https://github.com/TfTHacker/obsidian42-brat):

1. Install the BRAT plugin if you haven't already
2. In BRAT settings, add `darrenkuro/vault-augments`
3. Enable the plugin in Obsidian's community plugins settings

## Project Structure

```
vault-augments/
  src/
    main.ts                  -- Plugin orchestrator
    types.ts                 -- Augment interface
    augments/
      property-keys.ts       -- data-property-key injection
      inline-code-lang.ts    -- lang prefix → Prism highlighting
  manifest.json
  esbuild.config.mjs
  .github/workflows/
    release.yml              -- CD: build + release on push to main
```

---

## License

[MIT](LICENSE) - Darren Kuro
