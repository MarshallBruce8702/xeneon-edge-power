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
} from "../services/xeneon-edge";

import {
	classifyPowerState,
	POWER_OFF_COMMAND,
	resolvePowerCommand,
} from "../services/power-state";

import {
	registerPowerKey,
	unregisterPowerKey,
	syncPowerKeys,
} from "../services/power-ui";

@action({
	UUID: "com.marshallb.xeneon-edge-power.power-off",
})
export class XeneonEdgePowerOff extends SingletonAction {

	override async onWillAppear(
		ev: WillAppearEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		registerPowerKey(
			key,
			"off"
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

			if (powerStatus === "unknown") {
				console.error(
					"Unable to turn off XENEON EDGE from an unknown power state."
				);

				await syncPowerKeys(
					"unknown"
				);

				await key.showAlert();

				return;
			}

			const command =
				resolvePowerCommand(
					"off",
					powerStatus
				);

			if (command === POWER_OFF_COMMAND) {
				turnPowerOff();
			}

			await syncPowerKeys(
				"off"
			);
		} catch (error) {
			console.error(
				"Unable to turn off XENEON EDGE:",
				error
			);

			await syncPowerKeys(
				"unknown"
			);

			await key.showAlert();
		}
	}
}
