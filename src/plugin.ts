import streamDeck from "@elgato/streamdeck";

import { XeneonEdgePower } from "./actions/power-toggle";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new XeneonEdgePower());

streamDeck.connect();