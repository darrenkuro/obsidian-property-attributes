import { Plugin } from "obsidian";

const SELECTOR = '.workspace-leaf-content[data-type="all-properties"]';
const ATTR = "data-property-key";

export default class PropertyAttributesPlugin extends Plugin {
	private observers = new Map<HTMLElement, MutationObserver>();
	private timers = new Map<HTMLElement, number>();

	onload(): void {
		this.app.workspace.onLayoutReady(() => this.refresh());
		this.registerEvent(
			this.app.workspace.on("layout-change", () => this.refresh()),
		);
	}

	onunload(): void {
		for (const [container, observer] of this.observers) {
			observer.disconnect();
			this.removeAttributes(container);
		}
		this.observers.clear();
		for (const timer of this.timers.values()) {
			window.clearTimeout(timer);
		}
		this.timers.clear();
	}

	private refresh(): void {
		const containers = Array.from(
			document.querySelectorAll<HTMLElement>(SELECTOR),
		);
		const active = new Set<HTMLElement>();

		for (const container of containers) {
			active.add(container);
			this.injectAttributes(container);

			if (!this.observers.has(container)) {
				const observer = new MutationObserver(() => {
					// Debounce: wait for DOM to settle before re-injecting
					const prev = this.timers.get(container);
					if (prev) window.clearTimeout(prev);
					this.timers.set(
						container,
						window.setTimeout(() => {
							this.timers.delete(container);
							this.injectAttributes(container);
						}, 100),
					);
				});
				observer.observe(container, { childList: true, subtree: true });
				this.observers.set(container, observer);
			}
		}

		// Clean up observers for removed containers
		for (const [container, observer] of this.observers) {
			if (!active.has(container)) {
				observer.disconnect();
				this.observers.delete(container);
				const timer = this.timers.get(container);
				if (timer) {
					window.clearTimeout(timer);
					this.timers.delete(container);
				}
			}
		}
	}

	private injectAttributes(container: HTMLElement): void {
		const items = Array.from(
			container.querySelectorAll<HTMLElement>(".tree-item"),
		);
		for (const item of items) {
			const text = item.querySelector(".tree-item-inner-text");
			if (text?.textContent) {
				item.setAttribute(ATTR, text.textContent.trim());
			}
		}
	}

	private removeAttributes(container: HTMLElement): void {
		const items = Array.from(
			container.querySelectorAll<HTMLElement>(`[${ATTR}]`),
		);
		for (const item of items) {
			item.removeAttribute(ATTR);
		}
	}
}
