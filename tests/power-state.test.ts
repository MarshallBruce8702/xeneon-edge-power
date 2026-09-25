import assert from "node:assert/strict";
import test from "node:test";

import {
	classifyPowerState,
	POWER_OFF_COMMAND,
	POWER_ON_COMMAND,
	resolvePowerCommand,
	type PowerAction,
	type PowerCommand,
	type PowerStatus,
} from "../src/services/power-state.ts";

test("classifies raw D6 power states", () => {
	assert.equal(
		classifyPowerState(1),
		"on"
	);

	for (const rawState of [2, 3, 4, 5]) {
		assert.equal(
			classifyPowerState(rawState),
			"off"
		);
	}

	for (const rawState of [
		-1,
		0,
		6,
		Number.NaN,
		Number.POSITIVE_INFINITY,
	]) {
		assert.equal(
			classifyPowerState(rawState),
			"unknown"
		);
	}
});

test("uses only the validated D6 command values", () => {
	assert.equal(
		POWER_ON_COMMAND,
		1
	);

	assert.equal(
		POWER_OFF_COMMAND,
		4
	);
});

test("resolves the complete power action matrix", () => {
	const cases: Array<[
		PowerAction,
		PowerStatus,
		PowerCommand | null,
	]> = [
		["toggle", "on", POWER_OFF_COMMAND],
		["toggle", "off", POWER_ON_COMMAND],
		["toggle", "unknown", null],
		["on", "on", null],
		["on", "off", POWER_ON_COMMAND],
		["on", "unknown", null],
		["off", "on", POWER_OFF_COMMAND],
		["off", "off", null],
		["off", "unknown", null],
	];

	for (const [action, status, expected] of cases) {
		assert.equal(
			resolvePowerCommand(
				action,
				status
			),
			expected,
			`${action} from ${status}`
		);
	}
});
