import type { KeyAction } from "@elgato/streamdeck";

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
	powerIsOn: boolean
): Promise<void> {
	const updates: Promise<void>[] = [];

	for (const [key, type] of powerKeys) {
		if (type === "toggle") {
			updates.push(
				key.setState(
					powerIsOn
						? STATE_ON
						: STATE_OFF
				)
			);

			updates.push(
				key.setTitle(
					powerIsOn
						? "EDGE\nON"
						: "EDGE\nOFF"
				)
			);
		}

		if (type === "on") {
			updates.push(
				key.setTitle(
					powerIsOn
						? "POWER\nON"
						: "TURN\nON"
				)
			);
		}

		if (type === "off") {
			updates.push(
				key.setTitle(
					powerIsOn
						? "TURN\nOFF"
						: "POWER\nOFF"
				)
			);
		}
	}

	await Promise.all(updates);
}