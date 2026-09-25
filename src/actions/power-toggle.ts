import {
	action,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from "@elgato/streamdeck";

import {
	getRawPowerState,
	turnPowerOff,
	turnPowerOn,
} from "../services/xeneon-edge";

import {
	classifyPowerState,
	POWER_OFF_COMMAND,
	POWER_ON_COMMAND,
	resolvePowerCommand,
} from "../services/power-state";

import {
	registerPowerKey,
	unregisterPowerKey,
	syncPowerKeys,
} from "../services/power-ui";

@action({
	UUID: "com.marshallb.xeneon-edge-power.power-toggle",
})
export class XeneonEdgePower extends SingletonAction {

	override async onWillAppear(
		ev: WillAppearEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		registerPowerKey(
			key,
			"toggle"
		);

		try {
			const powerStatus =
				classifyPowerState(
					getRawPowerState()
				);

			await syncPowerKeys(
				powerStatus
			);
		} catch (error) {
			console.error(
				"Unable to read XENEON EDGE power state:",
				error
			);

			await syncPowerKeys(
				"unknown"
			);
		}
	}

	override onWillDisappear(
		ev: WillDisappearEvent
	): void {
		const key = ev.action as KeyAction;

		unregisterPowerKey(
			key
		);
	}

	override async onKeyDown(
		ev: KeyDownEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		try {
			const powerStatus =
				classifyPowerState(
					getRawPowerState()
				);

			const command =
				resolvePowerCommand(
					"toggle",
					powerStatus
				);

			if (command === null) {
				console.error(
					"Unable to toggle XENEON EDGE from an unknown power state."
				);

				await syncPowerKeys(
					"unknown"
				);

				await key.showAlert();

				return;
			}

			if (command === POWER_ON_COMMAND) {
				turnPowerOn();
			}

			if (command === POWER_OFF_COMMAND) {
				turnPowerOff();
			}

			await syncPowerKeys(
				command === POWER_ON_COMMAND
					? "on"
					: "off"
			);
		} catch (error) {
			console.error(
				"Unable to change XENEON EDGE power state:",
				error
			);

			await syncPowerKeys(
				"unknown"
			);

			await key.showAlert();
		}
	}
}
