import {
	action,
	DidReceiveSettingsEvent,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from "@elgato/streamdeck";

import {
	getBrightness,
	setBrightness,
} from "../services/xeneon-edge";

import {
	registerSetBrightnessKey,
	unregisterSetBrightnessKey,
	syncBrightnessKeys,
	syncSetBrightnessKeys,
} from "../services/brightness-ui";

type SetBrightnessSettings = {
	targetBrightness?: number;
};

const DEFAULT_BRIGHTNESS = 50;

function normalizeBrightness(
	value: unknown
): number {
	const parsed =
		typeof value === "number"
			? value
			: Number(value);

	if (!Number.isFinite(parsed)) {
		return DEFAULT_BRIGHTNESS;
	}

	return Math.max(
		0,
		Math.min(
			100,
			Math.round(parsed)
		)
	);
}

@action({
	UUID: "com.marshallb.xeneon-edge-power.set-brightness",
})
export class SetBrightness extends SingletonAction<
	SetBrightnessSettings
> {

	override async onWillAppear(
		ev: WillAppearEvent<SetBrightnessSettings>
	): Promise<void> {
		const key = ev.action as KeyAction;

		const targetBrightness =
			normalizeBrightness(
				ev.payload.settings
					?.targetBrightness
			);

		registerSetBrightnessKey(
			key,
			targetBrightness
		);

		try {
			const currentBrightness =
				getBrightness();

			await syncSetBrightnessKeys();

			await syncBrightnessKeys(
				currentBrightness
			);
		} catch (error) {
			console.error(
				"Unable to read XENEON EDGE brightness:",
				error
			);

			await key.setTitle(
				"SET\n?"
			);
		}
	}

	override onWillDisappear(
		ev: WillDisappearEvent<SetBrightnessSettings>
	): void {
		const key = ev.action as KeyAction;

		unregisterSetBrightnessKey(
			key
		);
	}

	override async onDidReceiveSettings(
		ev: DidReceiveSettingsEvent<
			SetBrightnessSettings
		>
	): Promise<void> {
		const key = ev.action as KeyAction;

		const targetBrightness =
			normalizeBrightness(
				ev.payload.settings
					?.targetBrightness
			);

		registerSetBrightnessKey(
			key,
			targetBrightness
		);

		await syncSetBrightnessKeys();
	}

	override async onKeyDown(
		ev: KeyDownEvent<SetBrightnessSettings>
	): Promise<void> {
		const key = ev.action as KeyAction;

		try {
			const targetBrightness =
				normalizeBrightness(
					ev.payload.settings
						?.targetBrightness
				);

			setBrightness(
				targetBrightness
			);

			await syncBrightnessKeys(
				targetBrightness
			);

			registerSetBrightnessKey(
				key,
				targetBrightness
			);

			await syncSetBrightnessKeys();
		} catch (error) {
			console.error(
				"Unable to set XENEON EDGE brightness:",
				error
			);

			await key.setTitle(
				"SET\nERROR"
			);

			await key.showAlert();
		}
	}
}