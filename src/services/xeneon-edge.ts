import { createRequire } from "node:module";

import {
	POWER_OFF_COMMAND,
	POWER_ON_COMMAND,
	type PowerCommand,
} from "./power-state";

const require = createRequire(import.meta.url);

type DdcciModule = {
	_refresh: () => void;
	getMonitorList: () => string[];
	_getVCP: (monitor: string, code: number) => [number, number];
	_setVCP: (monitor: string, code: number, value: number) => void;
};

const ddcci = require("@hensm/ddcci") as DdcciModule;

const XENEON_HARDWARE_ID = "CRXED00";

const POWER_VCP = 0xD6;
const BRIGHTNESS_VCP = 0x10;

export function findXeneonEdge(): string {
	ddcci._refresh();

	const monitor = ddcci
		.getMonitorList()
		.find((id) => id.includes(XENEON_HARDWARE_ID));

	if (!monitor) {
		throw new Error("XENEON EDGE was not found.");
	}

	return monitor;
}

export function getRawPowerState(): number {
	const monitor = findXeneonEdge();

	const [currentValue] = ddcci._getVCP(
		monitor,
		POWER_VCP
	);

	return currentValue;
}

function setPowerCommand(
	command: PowerCommand
): void {
	const monitor = findXeneonEdge();

	ddcci._setVCP(
		monitor,
		POWER_VCP,
		command
	);
}

export function turnPowerOn(): void {
	setPowerCommand(
		POWER_ON_COMMAND
	);
}

export function turnPowerOff(): void {
	setPowerCommand(
		POWER_OFF_COMMAND
	);
}

export function getBrightness(): number {
	const monitor = findXeneonEdge();

	const [currentValue] = ddcci._getVCP(
		monitor,
		BRIGHTNESS_VCP
	);

	return currentValue;
}

export function getMaxBrightness(): number {
	const monitor = findXeneonEdge();

	const [, maxValue] = ddcci._getVCP(
		monitor,
		BRIGHTNESS_VCP
	);

	return maxValue;
}

export function setBrightness(value: number): void {
	const monitor = findXeneonEdge();

	const [, maxValue] = ddcci._getVCP(
		monitor,
		BRIGHTNESS_VCP
	);

	const safeValue = Math.max(
		0,
		Math.min(value, maxValue)
	);

	ddcci._setVCP(
		monitor,
		BRIGHTNESS_VCP,
		safeValue
	);
}

export function changeBrightness(delta: number): number {
	const currentBrightness = getBrightness();
	const maxBrightness = getMaxBrightness();

	const newBrightness = Math.max(
		0,
		Math.min(
			currentBrightness + delta,
			maxBrightness
		)
	);

	setBrightness(newBrightness);

	return newBrightness;
}
