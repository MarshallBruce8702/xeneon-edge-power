# XENEON EDGE Power

[![Release](https://img.shields.io/badge/release-v1.1.1.0-blue.svg)](https://github.com/MarshallBruce8702/xeneon-edge-power/releases/tag/v1.1.1.0)
![Platform](https://img.shields.io/badge/platform-Windows-0078D6.svg)
![Stream Deck](https://img.shields.io/badge/Stream%20Deck-7.1%2B-00AEEF.svg)
![DDC/CI](https://img.shields.io/badge/DDC%2FCI-supported-success.svg)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Control the power and brightness of a **CORSAIR XENEON EDGE** directly from an **Elgato Stream Deck** using DDC/CI.

The plugin includes seven actions, synchronized key displays, configurable brightness presets, and local Property Inspectors. End users do not need to install Node.js or run PowerShell, batch files, or third-party monitor utilities.

## Requirements

- Windows 10 or later
- Elgato Stream Deck 7.1 or later
- CORSAIR XENEON EDGE with DDC/CI available

## Actions

### 1. Power Toggle

A single key alternates the XENEON EDGE between ON and reversible OFF states and displays the current state.

This is the recommended action when both power states should be controlled from one Stream Deck key.

### 2. Power ON

A dedicated action that turns the XENEON EDGE on. If the display is already on, no additional power command is sent.

### 3. Power OFF

A dedicated action that turns the XENEON EDGE off reversibly, keeping software Power ON available afterward. If the display is already in a known non-ON state, no additional power command is sent.

### 4. Brightness +

Increases brightness by 10 points and updates registered brightness keys.

### 5. Brightness -

Decreases brightness by 10 points and updates registered brightness keys.

### 6. Set Brightness

Sets brightness to a specific value from 0 to 100. Select the target value in the action's Property Inspector.

### 7. Brightness Toggle

Alternates between two configurable brightness levels. The default values are 25 and 100, and both can be changed in the action's Property Inspector.

## Installation

1. Download `com.marshallb.xeneon-edge-power.streamDeckPlugin` from the GitHub release.
2. Open the downloaded package and approve installation in Stream Deck.
3. Drag any XENEON EDGE Power action onto a Stream Deck key.

## Building from source

Install the project dependencies and build the plugin:

```powershell
npm ci
npm run build
```

Validate the generated plugin directory with the local Stream Deck CLI:

```powershell
streamdeck validate --no-update-check .\com.marshallb.xeneon-edge-power.sdPlugin
```

## Notes

- Power and brightness changes are sent directly to the monitor over DDC/CI.
- Power keys synchronize their displayed state while they are active in Stream Deck.
- Brightness values are constrained to the range reported by the monitor.
- If the monitor cannot be read or reports an unsupported power value, the affected key shows an unknown state and does not send a power command.

## License

Licensed under the [MIT License](LICENSE).
