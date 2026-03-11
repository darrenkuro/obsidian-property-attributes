import type { MarkdownPostProcessorContext, Plugin } from "obsidian"
import type { Augment } from "../types"

// Prism is bundled in Obsidian globally
declare const Prism: {
	languages: Record<string, unknown>
	highlight(code: string, grammar: unknown, language: string): string
}

const LANG_PATTERN = /^([a-zA-Z0-9_+-]+)>(.+)$/s

const LANG_ALIASES: Record<string, string> = {
	js: "javascript",
	ts: "typescript",
	py: "python",
	rb: "ruby",
	sh: "bash",
	shell: "bash",
	yml: "yaml",
	md: "markdown",
	rs: "rust",
	cs: "csharp",
	cpp: "cpp",
	hs: "haskell",
	ex: "elixir",
}

const resolveLang = (raw: string): string => LANG_ALIASES[raw] ?? raw

export const inlineCodeLang: Augment = (() => {
	const processEl = (el: HTMLElement): void => {
		const codeEls = Array.from(el.querySelectorAll<HTMLElement>("code"))

		for (const code of codeEls) {
			// Skip code blocks (inside <pre>)
			if (code.parentElement?.tagName === "PRE") continue
			// Skip already-processed elements
			if (code.hasAttribute("data-lang")) continue

			const text = code.textContent ?? ""
			const match = text.match(LANG_PATTERN)
			if (!match) continue

			const [, rawLang, content] = match
			const lang = resolveLang(rawLang)

			code.setAttribute("data-lang", lang)
			code.classList.add(`lang-${lang}`)

			// Apply Prism highlighting if grammar exists
			if (typeof Prism !== "undefined" && Prism.languages[lang]) {
				code.innerHTML = Prism.highlight(
					content,
					Prism.languages[lang],
					lang,
				)
			} else {
				code.textContent = content
			}
		}
	}

	return {
		load(plugin: Plugin): void {
			plugin.registerMarkdownPostProcessor(
				(el: HTMLElement, _ctx: MarkdownPostProcessorContext) =>
					processEl(el),
			)
		},

		unload(): void {
			// Post-processors are cleaned up by Obsidian on plugin unload
		},
	}
})()
