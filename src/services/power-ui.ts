import type { KeyAction } from "@elgato/streamdeck";

import type { PowerStatus } from "./power-state";

type PowerKeyType =
	| "toggle"
	| "on"
	| "off";

const powerKeys = new Map<
	KeyAction,
	PowerKeyType
>();

const STATE_ON = 0;
const STATE_OFF = 1;

export function registerPowerKey(
	key: KeyAction,
	type: PowerKeyType
): void {
	powerKeys.set(
		key,
		type
	);
}

export function unregisterPowerKey(
	key: KeyAction
): void {
	powerKeys.delete(key);
}

export async function syncPowerKeys(
	powerStatus: PowerStatus
): Promise<void> {
	const updates: Promise<void>[] = [];

	for (const [key, type] of powerKeys) {
		if (type === "toggle") {
			if (powerStatus !== "unknown") {
				updates.push(
					key.setState(
						powerStatus === "on"
							? STATE_ON
							: STATE_OFF
					)
				);
			}

			updates.push(
				key.setTitle(
					powerStatus === "on"
						? "TOGGLE\nEDGE ON"
						: powerStatus === "off"
							? "TOGGLE\nEDGE OFF"
							: "TOGGLE\nEDGE ?"
				)
			);
		}

		if (type === "on") {
			updates.push(
				key.setTitle(
					powerStatus === "on"
						? "POWER\nON"
						: powerStatus === "off"
							? "TURN\nON"
							: "POWER\n?"
				)
			);
		}

		if (type === "off") {
			updates.push(
				key.setTitle(
					powerStatus === "on"
						? "TURN\nOFF"
						: powerStatus === "off"
							? "POWER\nOFF"
							: "POWER\n?"
				)
			);
		}
	}

	await Promise.all(updates);
}
