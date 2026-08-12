import {
	action,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
} from "@elgato/streamdeck";

import {
	getPowerState,
	setPowerState,
	POWER_ON,
	POWER_OFF,
} from "../services/xeneon-edge";

const STATE_ON = 0;
const STATE_OFF = 1;

@action({
	UUID: "com.marshallb.xeneon-edge-power.power-toggle",
})
export class XeneonEdgePower extends SingletonAction {

	override async onWillAppear(
		ev: WillAppearEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		try {
			const powerState = getPowerState();

			if (powerState === POWER_ON) {
				await key.setState(STATE_ON);
				await key.setTitle("EDGE\nON");
			} else {
				await key.setState(STATE_OFF);
				await key.setTitle("EDGE\nOFF");
			}
		} catch (error) {
			console.error(
				"Unable to read XENEON EDGE power state:",
				error
			);

			await key.setTitle("EDGE\n?");
		}
	}

	override async onKeyDown(
		ev: KeyDownEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		try {
			const currentState = getPowerState();

			if (currentState === POWER_ON) {
				await key.setState(STATE_OFF);
				await key.setTitle("EDGE\nOFF");

				setPowerState(POWER_OFF);
			} else {
				await key.setState(STATE_ON);
				await key.setTitle("EDGE\nON");

				setPowerState(POWER_ON);
			}
		} catch (error) {
			console.error(
				"Unable to change XENEON EDGE power state:",
				error
			);

			await key.setTitle("EDGE\nERROR");
		}
	}
}