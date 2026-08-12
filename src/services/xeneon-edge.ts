import { createRequire } from "node:module";

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

export const POWER_ON = 1;
export const POWER_OFF = 5;

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

export function getPowerState(): number {
	const monitor = findXeneonEdge();

	const [currentValue] = ddcci._getVCP(
		monitor,
		POWER_VCP
	);

	return currentValue;
}

export function setPowerState(value: number): void {
	const monitor = findXeneonEdge();

	ddcci._setVCP(
		monitor,
		POWER_VCP,
		value
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