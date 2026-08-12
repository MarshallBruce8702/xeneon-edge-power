import streamDeck from "@elgato/streamdeck";

import { XeneonEdgePower } from "./actions/power-toggle";
import { BrightnessUp } from "./actions/brightness-up";
import { BrightnessDown } from "./actions/brightness-down";
import { SetBrightness } from "./actions/set-brightness";
import { BrightnessToggle } from "./actions/brightness-toggle";
import { XeneonEdgePowerOn } from "./actions/power-on";
import { XeneonEdgePowerOff } from "./actions/power-off";


streamDeck.logger.setLevel("trace");


streamDeck.actions.registerAction(
	new XeneonEdgePower()
);


streamDeck.actions.registerAction(
	new BrightnessUp()
);


streamDeck.actions.registerAction(
	new BrightnessDown()
);


streamDeck.actions.registerAction(
	new SetBrightness()
);


streamDeck.actions.registerAction(
	new BrightnessToggle()
);


streamDeck.actions.registerAction(
	new XeneonEdgePowerOn()
);


streamDeck.actions.registerAction(
	new XeneonEdgePowerOff()
);


streamDeck.connect();