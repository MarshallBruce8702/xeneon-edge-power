# XENEON EDGE Power

[![Release](https://img.shields.io/badge/release-v1.1.0.0-blue.svg)](https://github.com/MarshallBruce8702/xeneon-edge-power/releases/tag/v1.1.0.0)
![Platform](https://img.shields.io/badge/platform-Windows-0078D6.svg)
![Stream Deck](https://img.shields.io/badge/Stream%20Deck-7.1%2B-00AEEF.svg)
![DDC/CI](https://img.shields.io/badge/DDC%2FCI-supported-success.svg)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Control your **CORSAIR XENEON EDGE** directly from an **Elgato Stream Deck** using DDC/CI.

XENEON EDGE Power v1.1.0.0 expands the original Power Toggle plugin with dedicated power controls, real-time brightness controls, configurable brightness presets, synchronized key states, and per-key Property Inspector settings.

No PowerShell scripts, BAT files, Twinkle Tray, manual monitor IDs, or Node.js installation are required on the end user's PC.

---

## What's New in v1.1.0.0

Version 1.1.0.0 is a major expansion over the original v1.0.0 release.

The first release only provided:

- Power Toggle

Version 1.1.0.0 now includes:

- Power Toggle
- Power ON
- Power OFF
- Brightness +
- Brightness -
- Set Brightness
- Brightness Toggle A/B
- Dynamic brightness key graphics
- Synchronized power states
- Synchronized brightness displays
- Per-key brightness configuration
- Local/offline Property Inspector support

---

# Actions

## 1. Power Toggle

Power Toggle switches the XENEON EDGE between ON and OFF.

The action reads the real power state of the monitor and updates the Stream Deck key accordingly.

### Behavior

If the monitor is ON:

```text
EDGE ON