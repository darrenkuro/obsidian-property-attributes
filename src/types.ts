import type { Plugin } from "obsidian"

export interface Augment {
	load(plugin: Plugin): void
	unload(): void
}
