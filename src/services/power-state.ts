export type PowerStatus =
	| "on"
	| "off"
	| "unknown";

export type PowerAction =
	| "toggle"
	| "on"
	| "off";

export const POWER_ON_COMMAND = 1;
export const POWER_OFF_COMMAND = 4;

export type PowerCommand =
	| typeof POWER_ON_COMMAND
	| typeof POWER_OFF_COMMAND;

export function classifyPowerState(
	rawState: number
): PowerStatus {
	switch (rawState) {
		case 1:
			return "on";

		case 2:
		case 3:
		case 4:
		case 5:
			return "off";

		default:
			return "unknown";
	}
}

export function resolvePowerCommand(
	action: PowerAction,
	status: PowerStatus
): PowerCommand | null {
	if (status === "unknown") {
		return null;
	}

	if (action === "toggle") {
		return status === "on"
			? POWER_OFF_COMMAND
			: POWER_ON_COMMAND;
	}

	if (action === "on") {
		return status === "off"
			? POWER_ON_COMMAND
			: null;
	}

	return status === "on"
		? POWER_OFF_COMMAND
		: null;
}
