# Home Automation Dashboard

A modern, responsive React.js web application for controlling an ESP8266-based home automation system via MQTT over HiveMQ Cloud.

## Features

- **Real-time MQTT Communication** — Direct WebSocket connection to HiveMQ Cloud
- **Auto-Reconnect** — Automatically recovers from network interruptions
- **Responsive Design** — Mobile-first layout: 1 col (mobile) → 2 col (tablet) → 4 col (desktop)
- **Dark Mode UI** — Elegant smart-home dashboard with animated glow effects
- **Toast Notifications** — Instant feedback when devices change state
- **Connection Status** — Live Wi-Fi style indicator with spinner while reconnecting
- **Safe State Management** — UI always reflects the last MQTT message received; no optimistic updates

## Tech Stack

- React 18 + Vite
- `mqtt` (MQTT over WebSockets)
- `react-icons` (Device icons)
- `react-hot-toast` (Notifications)

## Project Structure

```
src/
  components/
    DeviceCard.jsx      # Individual device control card
    Navbar.jsx          # Top bar with connection status
    StatusBadge.jsx     # Connection status badge with spinner
  config/
    mqttConfig.js       # HiveMQ Cloud credentials & topics
  mqtt/
    mqttClient.js       # MQTT connection logic & event handlers
  App.jsx               # Root component & state management
  main.jsx              # React entry point
  index.css             # Global styles & responsive grid
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MQTT Credentials

Open `src/config/mqttConfig.js` and replace the placeholders with your HiveMQ Cloud details:

```javascript
export const mqttConfig = {
  brokerUrl: 'wss://your-cluster-id.hivemq.cloud:8884/mqtt',
  username: 'your-hivemq-username',
  password: 'your-hivemq-password',
  // ...
}
```

> **Note:** Your HiveMQ Cloud WebSocket URL typically ends with `:8884/mqtt`. You can find this in your HiveMQ Cloud cluster dashboard under the **WebSocket** section.

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
npm run build
```

The production build will be output to the `dist/` folder.

## MQTT Topic Convention

| Device   | Topic         | Payload |
|----------|---------------|---------|
| Socket   | `home/relay1` | `ON` / `OFF` |
| Fan      | `home/relay2` | `ON` / `OFF` |
| Tubelight| `home/relay3` | `ON` / `OFF` |
| Other    | `home/relay4` | `ON` / `OFF` |

## Troubleshooting

### MQTT Connection Issues

1. **Check your WebSocket URL** — Ensure it starts with `wss://` and includes the port `:8884/mqtt`.
2. **Verify credentials** — Double-check your HiveMQ Cloud username and password.
3. **CORS / Firewall** — Make sure your network allows outbound WebSocket connections on port 8884.
4. **Client ID uniqueness** — If you see frequent disconnections, ensure your `clientId` is unique (the default random suffix usually handles this).

### Vite / Build Issues

If you encounter bundling errors with the `mqtt` package, try installing the `buffer` polyfill (already included in `package.json`):

```bash
npm install buffer
```

## License

MIT
