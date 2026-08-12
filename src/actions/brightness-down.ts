import {
	action,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from "@elgato/streamdeck";

import {
	changeBrightness,
	getBrightness,
} from "../services/xeneon-edge";

import {
	registerBrightnessKey,
	unregisterBrightnessKey,
	syncBrightnessKeys,
} from "../services/brightness-ui";

const BRIGHTNESS_STEP = 10;

@action({
	UUID: "com.marshallb.xeneon-edge-power.brightness-down",
})
export class BrightnessDown extends SingletonAction {

	override async onWillAppear(
		ev: WillAppearEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		registerBrightnessKey(
			key,
			"down"
		);

		try {
			const brightness =
				getBrightness();

			await syncBrightnessKeys(
				brightness
			);
		} catch (error) {
			console.error(
				"Unable to read XENEON EDGE brightness:",
				error
			);

			await key.setTitle(
				"BRIGHT\n?"
			);
		}
	}

	override onWillDisappear(
		ev: WillDisappearEvent
	): void {
		const key = ev.action as KeyAction;

		unregisterBrightnessKey(key);
	}

	override async onKeyDown(
		ev: KeyDownEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		try {
			const newBrightness =
				changeBrightness(
					-BRIGHTNESS_STEP
				);

			await syncBrightnessKeys(
				newBrightness
			);
		} catch (error) {
			console.error(
				"Unable to decrease XENEON EDGE brightness:",
				error
			);

			await key.setTitle(
				"BRIGHT\nERROR"
			);

			await key.showAlert();
		}
	}
}