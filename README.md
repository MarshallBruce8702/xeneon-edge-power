# XENEON EDGE Power

Control the power state of your **CORSAIR XENEON EDGE** monitor directly from an **Elgato Stream Deck**.

XENEON EDGE Power provides a simple ON/OFF toggle button that communicates directly with the monitor through **DDC/CI**.

No PowerShell scripts, BAT files, Twinkle Tray, or manual monitor IDs are required.

---

## Features

- Turn the XENEON EDGE ON and OFF directly from Stream Deck.
- Automatic XENEON EDGE detection.
- Uses DDC/CI directly.
- Reads the real power state of the monitor.
- Green ON state.
- Red OFF state.
- Automatically keeps the Stream Deck button synchronized with the monitor.
- Does not require Twinkle Tray.
- Does not require PowerShell scripts.
- Does not require BAT files.
- Does not require Node.js on the user's PC.
- Works after Windows restart.
- Lightweight native Stream Deck plugin.

---

## Requirements

- Windows 10 or Windows 11
- Elgato Stream Deck software 7.1 or newer
- CORSAIR XENEON EDGE
- DDC/CI enabled and available for the monitor

The current release is designed for Windows.

---

## Installation

1. Download the latest:

   `com.marshallb.xeneon-edge-power.streamDeckPlugin`

2. Double-click the downloaded file.

3. Stream Deck will ask you to install:

   **XENEON EDGE Power**

4. Open the Stream Deck application.

5. Find:

   **XENEON EDGE Power**

6. Drag the **Power Toggle** action onto a Stream Deck key.

That's it.

No additional software or configuration is required.

---

## Usage

When the XENEON EDGE is powered on, the Stream Deck key displays:

**EDGE ON**

with the green ON icon.

Press the key:

**EDGE ON → EDGE OFF**

The XENEON EDGE powers off and the Stream Deck key changes to the red OFF state.

Press it again:

**EDGE OFF → EDGE ON**

The monitor powers back on and the Stream Deck key returns to the green ON state.

---

## How It Works

XENEON EDGE Power communicates directly with compatible monitors using DDC/CI.

The plugin detects the XENEON EDGE and controls its power state using the monitor's VCP power command.

The plugin currently uses:

- VCP Code: `0xD6`
- ON value: `1`
- OFF value: `5`

The plugin also reads the current VCP value so the Stream Deck button can reflect the actual monitor state.

---

## Monitor Detection

The plugin automatically identifies the XENEON EDGE using its display hardware identifier.

Users do not need to determine or configure:

- Monitor numbers
- Windows display numbers
- UID values
- DDC/CI monitor paths

---

## Included Native DDC/CI Support

The plugin includes the native components required for DDC/CI communication.

The distributed Stream Deck plugin includes:

- `@hensm/ddcci`
- `bindings`
- `file-uri-to-path`
- Native `ddcci.node` module

Users do not need to install these dependencies manually.

---

## Development

### Requirements

For development:

- Node.js 24+
- npm
- Elgato Stream Deck CLI
- Visual Studio Code or another code editor

Install dependencies:

```powershell
npm install