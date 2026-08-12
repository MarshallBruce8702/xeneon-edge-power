import {
	action,
	KeyAction,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
} from "@elgato/streamdeck";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

type DdcciModule = {
	_refresh: () => void;
	getMonitorList: () => string[];
	_getVCP: (monitor: string, code: number) => [number, number];
	_setVCP: (monitor: string, code: number, value: number) => void;
};

const ddcci = require("@hensm/ddcci") as DdcciModule;

const POWER_VCP = 0xD6;
const POWER_ON = 1;
const POWER_OFF = 5;

const STATE_ON = 0;
const STATE_OFF = 1;

function findXeneonEdge(): string {
	ddcci._refresh();

	const monitor = ddcci
		.getMonitorList()
		.find((id) => id.includes("CRXED00"));

	if (!monitor) {
		throw new Error("XENEON EDGE was not found.");
	}

	return monitor;
}

function getXeneonPowerState(): number {
	const monitor = findXeneonEdge();

	const [currentValue] = ddcci._getVCP(
		monitor,
		POWER_VCP
	);

	return currentValue;
}

function setXeneonPower(value: number): void {
	const monitor = findXeneonEdge();

	ddcci._setVCP(
		monitor,
		POWER_VCP,
		value
	);
}

@action({
	UUID: "com.marshallb.xeneon-edge-power.power-toggle",
})
export class XeneonEdgePower extends SingletonAction {

	override async onWillAppear(
		ev: WillAppearEvent
	): Promise<void> {
		const key = ev.action as KeyAction;

		try {
			const powerState = getXeneonPowerState();

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
			const currentState = getXeneonPowerState();

			if (currentState === POWER_ON) {
				await key.setState(STATE_OFF);
				await key.setTitle("EDGE\nOFF");

				setXeneonPower(POWER_OFF);
			} else {
				await key.setState(STATE_ON);
				await key.setTitle("EDGE\nON");

				setXeneonPower(POWER_ON);
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