import streamDeck from "@elgato/streamdeck";

import { XeneonEdgePower } from "./actions/power-toggle";
import { BrightnessUp } from "./actions/brightness-up";
import { BrightnessDown } from "./actions/brightness-down";
import { SetBrightness } from "./actions/set-brightness";

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

streamDeck.connect();