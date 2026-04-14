# Gearman Monitor

A terminal user interface (TUI) for monitoring Gearman job servers.

![Gearman Monitor](https://img.shields.io/badge/TUI-OpenTUI-blue)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- Real-time monitoring of Gearman job servers
- View registered functions and workers
- Auto-refresh every 2 seconds
- Configurable server connection (host/port)
- Keyboard navigation
- Scrollable lists for functions and workers

## Installation

### Homebrew (Recommended)

```bash
# Add the tap
brew tap itsdanielfelix/homebrew-tap

# Install
brew install gearman-monitor

# Run
gearman-monitor
```

### Manual Installation

Download the latest release for your platform from the [GitHub Releases](https://github.com/itsdanielfelix/gearman-monitor/releases):

| Platform | Architecture | Binary |
|----------|--------------|--------|
| macOS | ARM64 (Apple Silicon) | `gearman-monitor-macos-arm64` |
| Linux | x64 | `gearman-monitor-linux-x64` |

Make the binary executable and run:

```bash
chmod +x gearman-monitor-*
./gearman-monitor-*
```

## Usage

```
gearman-monitor
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `q` / `ESC` | Exit application |
| `s` | Open settings |
| `Tab` | Navigate between fields |
| `Enter` | Save/Confirm |
| `←` `→` | Select buttons |

### Settings

Press `s` to configure:
- **Host**: Gearman server address (default: `localhost`)
- **Port**: Gearman server port (default: `4730`)

## Development

### Prerequisites

- [Bun](https://bun.sh) - JavaScript runtime and package manager

### Setup

```bash
# Install dependencies
bun install

# Run in development mode
bun dev
```

### Building

```bash
# Build for macOS ARM64
bun build --compile --target=bun-darwin-arm64 src/index.tsx --outfile gearman-monitor-macos-arm64

# Build for Linux x64
bun build --compile --target=bun-linux-x64 src/index.tsx --outfile gearman-monitor-linux-x64
```

## License

MIT
