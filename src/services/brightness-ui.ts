import type { KeyAction } from "@elgato/streamdeck";

type BrightnessDirection = "up" | "down";

type BrightnessToggleConfig = {
	brightnessA: number;
	brightnessB: number;
};

const brightnessKeys = new Map<
	KeyAction,
	BrightnessDirection
>();

const setBrightnessKeys = new Map<
	KeyAction,
	number
>();

const brightnessToggleKeys = new Map<
	KeyAction,
	BrightnessToggleConfig
>();

export function registerBrightnessKey(
	key: KeyAction,
	direction: BrightnessDirection
): void {
	brightnessKeys.set(
		key,
		direction
	);
}

export function unregisterBrightnessKey(
	key: KeyAction
): void {
	brightnessKeys.delete(key);
}

export function registerSetBrightnessKey(
	key: KeyAction,
	targetBrightness: number
): void {
	setBrightnessKeys.set(
		key,
		targetBrightness
	);
}

export function unregisterSetBrightnessKey(
	key: KeyAction
): void {
	setBrightnessKeys.delete(key);
}

export function registerBrightnessToggleKey(
	key: KeyAction,
	brightnessA: number,
	brightnessB: number
): void {
	brightnessToggleKeys.set(
		key,
		{
			brightnessA,
			brightnessB,
		}
	);
}

export function unregisterBrightnessToggleKey(
	key: KeyAction
): void {
	brightnessToggleKeys.delete(key);
}

function getNextToggleBrightness(
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

function createBrightnessSvg(
	brightness: number,
	direction: BrightnessDirection
): string {
	const accent =
		direction === "up"
			? "#7CFF00"
			: "#27C7FF";

	const symbol =
		direction === "up"
			? "+"
			: "−";

	const svg = `
<svg
	xmlns="http://www.w3.org/2000/svg"
	width="144"
	height="144"
	viewBox="0 0 144 144"
>
	<defs>
		<linearGradient
			id="background"
			x1="0"
			y1="0"
			x2="1"
			y2="1"
		>
			<stop
				offset="0%"
				stop-color="#101414"
			/>

			<stop
				offset="100%"
				stop-color="#020404"
			/>
		</linearGradient>

		<filter id="glow">
			<feGaussianBlur
				stdDeviation="2.5"
				result="blur"
			/>

			<feMerge>
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/>
			</feMerge>
		</filter>
	</defs>

	<rect
		x="3"
		y="3"
		width="138"
		height="138"
		rx="18"
		fill="url(#background)"
		stroke="${accent}"
		stroke-width="3"
	/>

	<g
		stroke="#FFF9DA"
		stroke-width="5"
		stroke-linecap="round"
		fill="none"
		filter="url(#glow)"
	>
		<circle
			cx="72"
			cy="41"
			r="15"
		/>

		<line x1="72" y1="15" x2="72" y2="21"/>
		<line x1="72" y1="61" x2="72" y2="67"/>

		<line x1="46" y1="41" x2="52" y2="41"/>
		<line x1="92" y1="41" x2="98" y2="41"/>

		<line x1="53" y1="22" x2="57" y2="26"/>
		<line x1="87" y1="56" x2="91" y2="60"/>

		<line x1="91" y1="22" x2="87" y2="26"/>
		<line x1="57" y1="56" x2="53" y2="60"/>
	</g>

	<text
		x="72"
		y="91"
		text-anchor="middle"
		fill="#FFFFFF"
		font-family="Arial, sans-serif"
		font-size="29"
		font-weight="700"
	>
		${brightness}%
	</text>

	<line
		x1="27"
		y1="101"
		x2="117"
		y2="101"
		stroke="${accent}"
		stroke-width="2"
		opacity="0.85"
		filter="url(#glow)"
	/>

	<text
		x="72"
		y="132"
		text-anchor="middle"
		fill="${accent}"
		font-family="Arial, sans-serif"
		font-size="38"
		font-weight="700"
		filter="url(#glow)"
	>
		${symbol}
	</text>
</svg>`;

	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function createSetBrightnessSvg(
	targetBrightness: number
): string {
	const accent = "#FFC928";

	const svg = `
<svg
	xmlns="http://www.w3.org/2000/svg"
	width="144"
	height="144"
	viewBox="0 0 144 144"
>
	<defs>
		<linearGradient
			id="background"
			x1="0"
			y1="0"
			x2="1"
			y2="1"
		>
			<stop
				offset="0%"
				stop-color="#15130B"
			/>

			<stop
				offset="100%"
				stop-color="#030302"
			/>
		</linearGradient>

		<filter id="glow">
			<feGaussianBlur
				stdDeviation="2.5"
				result="blur"
			/>

			<feMerge>
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/>
			</feMerge>
		</filter>
	</defs>

	<rect
		x="3"
		y="3"
		width="138"
		height="138"
		rx="18"
		fill="url(#background)"
		stroke="${accent}"
		stroke-width="3"
	/>

	<g
		stroke="#FFF9DA"
		stroke-width="5"
		stroke-linecap="round"
		fill="none"
		filter="url(#glow)"
	>
		<circle
			cx="72"
			cy="41"
			r="15"
		/>

		<line x1="72" y1="15" x2="72" y2="21"/>
		<line x1="72" y1="61" x2="72" y2="67"/>

		<line x1="46" y1="41" x2="52" y2="41"/>
		<line x1="92" y1="41" x2="98" y2="41"/>

		<line x1="53" y1="22" x2="57" y2="26"/>
		<line x1="87" y1="56" x2="91" y2="60"/>

		<line x1="91" y1="22" x2="87" y2="26"/>
		<line x1="57" y1="56" x2="53" y2="60"/>
	</g>

	<text
		x="72"
		y="91"
		text-anchor="middle"
		fill="#FFFFFF"
		font-family="Arial, sans-serif"
		font-size="29"
		font-weight="700"
	>
		${targetBrightness}%
	</text>

	<line
		x1="27"
		y1="101"
		x2="117"
		y2="101"
		stroke="${accent}"
		stroke-width="2"
		opacity="0.85"
		filter="url(#glow)"
	/>

	<text
		x="72"
		y="128"
		text-anchor="middle"
		fill="${accent}"
		font-family="Arial, sans-serif"
		font-size="24"
		font-weight="700"
		filter="url(#glow)"
	>
		SET
	</text>
</svg>`;

	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function createBrightnessToggleSvg(
	brightnessA: number,
	brightnessB: number,
	nextBrightness: number
): string {
	const accent = "#C45CFF";

	const svg = `
<svg
	xmlns="http://www.w3.org/2000/svg"
	width="144"
	height="144"
	viewBox="0 0 144 144"
>
	<defs>
		<linearGradient
			id="background"
			x1="0"
			y1="0"
			x2="1"
			y2="1"
		>
			<stop
				offset="0%"
				stop-color="#151019"
			/>

			<stop
				offset="100%"
				stop-color="#030204"
			/>
		</linearGradient>

		<filter id="glow">
			<feGaussianBlur
				stdDeviation="2.5"
				result="blur"
			/>

			<feMerge>
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/>
			</feMerge>
		</filter>
	</defs>

	<rect
		x="3"
		y="3"
		width="138"
		height="138"
		rx="18"
		fill="url(#background)"
		stroke="${accent}"
		stroke-width="3"
	/>

	<!-- Sun -->
	<g
		stroke="#FFF9DA"
		stroke-width="4"
		stroke-linecap="round"
		fill="none"
		filter="url(#glow)"
	>
		<circle
			cx="72"
			cy="34"
			r="12"
		/>

		<line x1="72" y1="13" x2="72" y2="18"/>
		<line x1="72" y1="50" x2="72" y2="55"/>

		<line x1="51" y1="34" x2="56" y2="34"/>
		<line x1="88" y1="34" x2="93" y2="34"/>

		<line x1="57" y1="19" x2="61" y2="23"/>
		<line x1="83" y1="45" x2="87" y2="49"/>

		<line x1="87" y1="19" x2="83" y2="23"/>
		<line x1="61" y1="45" x2="57" y2="49"/>
	</g>

	<!-- A/B values -->
	<text
		x="72"
		y="77"
		text-anchor="middle"
		fill="#FFFFFF"
		font-family="Arial, sans-serif"
		font-size="21"
		font-weight="700"
	>
		${brightnessA}% ↔ ${brightnessB}%
	</text>

	<!-- Separator -->
	<line
		x1="20"
		y1="88"
		x2="124"
		y2="88"
		stroke="${accent}"
		stroke-width="2"
		opacity="0.9"
		filter="url(#glow)"
	/>

	<!-- NEXT -->
	<text
		x="72"
		y="108"
		text-anchor="middle"
		fill="${accent}"
		font-family="Arial, sans-serif"
		font-size="15"
		font-weight="700"
	>
		NEXT
	</text>

	<text
		x="72"
		y="134"
		text-anchor="middle"
		fill="#FFFFFF"
		font-family="Arial, sans-serif"
		font-size="25"
		font-weight="700"
	>
		${nextBrightness}%
	</text>
</svg>`;

	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export async function syncBrightnessKeys(
	brightness: number
): Promise<void> {
	const updates: Promise<void>[] = [];

	for (const [key, direction] of brightnessKeys) {
		updates.push(
			key.setImage(
				createBrightnessSvg(
					brightness,
					direction
				)
			)
		);

		updates.push(
			key.setTitle("")
		);
	}

	await Promise.all(updates);
}

export async function syncSetBrightnessKeys(): Promise<void> {
	const updates: Promise<void>[] = [];

	for (
		const [key, targetBrightness]
		of setBrightnessKeys
	) {
		updates.push(
			key.setImage(
				createSetBrightnessSvg(
					targetBrightness
				)
			)
		);

		updates.push(
			key.setTitle("")
		);
	}

	await Promise.all(updates);
}

export async function syncBrightnessToggleKeys(
	currentBrightness: number
): Promise<void> {
	const updates: Promise<void>[] = [];

	for (
		const [
			key,
			{
				brightnessA,
				brightnessB,
			},
		]
		of brightnessToggleKeys
	) {
		const nextBrightness =
			getNextToggleBrightness(
				currentBrightness,
				brightnessA,
				brightnessB
			);

		updates.push(
			key.setImage(
				createBrightnessToggleSvg(
					brightnessA,
					brightnessB,
					nextBrightness
				)
			)
		);

		updates.push(
			key.setTitle("")
		);
	}

	await Promise.all(updates);
}