import { Plugin } from "obsidian"
import type { Augment } from "./types"
import { propertyKeys } from "./augments/property-keys"
import { inlineCodeLang } from "./augments/inline-code-lang"

const augments: Augment[] = [propertyKeys, inlineCodeLang]

export default class VaultAugments extends Plugin {
	onload(): void {
		augments.forEach((a) => a.load(this))
	}

	onunload(): void {
		augments.forEach((a) => a.unload())
	}
}
