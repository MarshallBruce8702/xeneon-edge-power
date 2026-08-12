import {
	action,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from "@elgato/streamdeck";

import {
	getPowerState,
	setPowerState,
	POWER_ON,
	POWER_OFF,
} from "../services/xeneon-edge";

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
			const powerState =
				getPowerState();

			await syncPowerKeys(
				powerState === POWER_ON
			);
		} catch (error) {
			console.error(
				"Unable to read XENEON EDGE power state:",
				error
			);

			await key.setTitle(
				"POWER\n?"
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
			const currentState =
				getPowerState();

			if (currentState !== POWER_OFF) {
				setPowerState(
					POWER_OFF
				);
			}

			await syncPowerKeys(
				false
			);
		} catch (error) {
			console.error(
				"Unable to turn off XENEON EDGE:",
				error
			);

			await key.setTitle(
				"POWER\nERROR"
			);

			await key.showAlert();
		}
	}
}