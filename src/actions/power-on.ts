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
} from "../services/xeneon-edge";

import {
	registerPowerKey,
	unregisterPowerKey,
	syncPowerKeys,
} from "../services/power-ui";

@action({
	UUID: "com.marshallb.xeneon-edge-power.power-on",
})
export class XeneonEdgePowerOn extends SingletonAction {

	override async onWillAppear(
		ev: WillAppearEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		registerPowerKey(
			key,
			"on"
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

			if (currentState !== POWER_ON) {
				setPowerState(
					POWER_ON
				);
			}

			await syncPowerKeys(
				true
			);
		} catch (error) {
			console.error(
				"Unable to turn on XENEON EDGE:",
				error
			);

			await key.setTitle(
				"POWER\nERROR"
			);

			await key.showAlert();
		}
	}
}