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
	registerBrightnessToggleKey,
	unregisterBrightnessToggleKey,
	syncBrightnessKeys,
	syncBrightnessToggleKeys,
} from "../services/brightness-ui";

type BrightnessToggleSettings = {
	brightnessA?: number;
	brightnessB?: number;
};

const DEFAULT_BRIGHTNESS_A = 25;
const DEFAULT_BRIGHTNESS_B = 100;

function normalizeBrightness(
	value: unknown,
	fallback: number
): number {
	const parsed =
		typeof value === "number"
			? value
			: Number(value);

	if (!Number.isFinite(parsed)) {
		return fallback;
	}

	return Math.max(
		0,
		Math.min(
			100,
			Math.round(parsed)
		)
	);
}

function getNextBrightness(
	currentBrightness: number,
	brightnessA: number,
	brightnessB: number
): number {
	const distanceToA =
		Math.abs(
			currentBrightness - brightnessA
		);

	const distanceToB =
		Math.abs(
			currentBrightness - brightnessB
		);

	if (distanceToA <= distanceToB) {
		return brightnessB;
	}

	return brightnessA;
}

@action({
	UUID: "com.marshallb.xeneon-edge-power.brightness-toggle",
})
export class BrightnessToggle extends SingletonAction<
	BrightnessToggleSettings
> {

	override async onWillAppear(
		ev: WillAppearEvent<BrightnessToggleSettings>
	): Promise<void> {
		const key = ev.action as KeyAction;

		try {
			const brightnessA =
				normalizeBrightness(
					ev.payload.settings?.brightnessA,
					DEFAULT_BRIGHTNESS_A
				);

			const brightnessB =
				normalizeBrightness(
					ev.payload.settings?.brightnessB,
					DEFAULT_BRIGHTNESS_B
				);

			registerBrightnessToggleKey(
				key,
				brightnessA,
				brightnessB
			);

			const currentBrightness =
				getBrightness();

			await syncBrightnessToggleKeys(
				currentBrightness
			);
		} catch (error) {
			console.error(
				"Unable to read XENEON EDGE brightness:",
				error
			);

			await key.setTitle(
				"A/B\n?"
			);
		}
	}

	override onWillDisappear(
		ev: WillDisappearEvent<BrightnessToggleSettings>
	): void {
		const key = ev.action as KeyAction;

		unregisterBrightnessToggleKey(
			key
		);
	}

	override async onDidReceiveSettings(
		ev: DidReceiveSettingsEvent<
			BrightnessToggleSettings
		>
	): Promise<void> {
		const key = ev.action as KeyAction;

		const brightnessA =
			normalizeBrightness(
				ev.payload.settings?.brightnessA,
				DEFAULT_BRIGHTNESS_A
			);

		const brightnessB =
			normalizeBrightness(
				ev.payload.settings?.brightnessB,
				DEFAULT_BRIGHTNESS_B
			);

		registerBrightnessToggleKey(
			key,
			brightnessA,
			brightnessB
		);

		try {
			const currentBrightness =
				getBrightness();

			await syncBrightnessToggleKeys(
				currentBrightness
			);
		} catch (error) {
			console.error(
				"Unable to update brightness toggle:",
				error
			);
		}
	}

	override async onKeyDown(
		ev: KeyDownEvent<BrightnessToggleSettings>
	): Promise<void> {
		const key = ev.action as KeyAction;

		try {
			const currentBrightness =
				getBrightness();

			const brightnessA =
				normalizeBrightness(
					ev.payload.settings?.brightnessA,
					DEFAULT_BRIGHTNESS_A
				);

			const brightnessB =
				normalizeBrightness(
					ev.payload.settings?.brightnessB,
					DEFAULT_BRIGHTNESS_B
				);

			const nextBrightness =
				getNextBrightness(
					currentBrightness,
					brightnessA,
					brightnessB
				);

			setBrightness(
				nextBrightness
			);

			registerBrightnessToggleKey(
				key,
				brightnessA,
				brightnessB
			);

			await syncBrightnessKeys(
				nextBrightness
			);

			await syncBrightnessToggleKeys(
				nextBrightness
			);
		} catch (error) {
			console.error(
				"Unable to toggle XENEON EDGE brightness:",
				error
			);

			await key.setTitle(
				"A/B\nERROR"
			);

			await key.showAlert();
		}
	}
}