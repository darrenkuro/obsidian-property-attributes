import type { Plugin } from "obsidian"
import type { Augment } from "../types"

const SELECTOR = '.workspace-leaf-content[data-type="all-properties"]'
const ATTR = "data-property-key"

export const propertyKeys: Augment = (() => {
	const observers = new Map<HTMLElement, MutationObserver>()
	const timers = new Map<HTMLElement, number>()

	const injectAttributes = (container: HTMLElement): void => {
		const items = Array.from(container.querySelectorAll<HTMLElement>(".tree-item"))
		for (const item of items) {
			const text = item.querySelector(".tree-item-inner-text")
			if (text?.textContent) {
				item.setAttribute(ATTR, text.textContent.trim())
			}
		}
	}

	const removeAttributes = (container: HTMLElement): void => {
		const items = Array.from(container.querySelectorAll<HTMLElement>(`[${ATTR}]`))
		for (const item of items) {
			item.removeAttribute(ATTR)
		}
	}

	const refresh = (): void => {
		const containers = Array.from(
			document.querySelectorAll<HTMLElement>(SELECTOR),
		)
		const active = new Set<HTMLElement>()

		for (const container of containers) {
			active.add(container)
			injectAttributes(container)

			if (!observers.has(container)) {
				const observer = new MutationObserver(() => {
					const prev = timers.get(container)
					if (prev) window.clearTimeout(prev)
					timers.set(
						container,
						window.setTimeout(() => {
							timers.delete(container)
							injectAttributes(container)
						}, 100),
					)
				})
				observer.observe(container, { childList: true, subtree: true })
				observers.set(container, observer)
			}
		}

		for (const [container, observer] of observers) {
			if (!active.has(container)) {
				observer.disconnect()
				observers.delete(container)
				const timer = timers.get(container)
				if (timer) {
					window.clearTimeout(timer)
					timers.delete(container)
				}
			}
		}
	}

	return {
		load(plugin: Plugin): void {
			plugin.app.workspace.onLayoutReady(() => refresh())
			plugin.registerEvent(
				plugin.app.workspace.on("layout-change", () => refresh()),
			)
		},

		unload(): void {
			for (const [container, observer] of observers) {
				observer.disconnect()
				removeAttributes(container)
			}
			observers.clear()
			for (const timer of timers.values()) {
				window.clearTimeout(timer)
			}
			timers.clear()
		},
	}
})()
