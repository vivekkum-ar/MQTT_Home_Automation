/**
 * MQTT Configuration
 * Reads configuration from Vite environment variables.
 */

export const mqttConfig = {
  // HiveMQ Cloud WebSocket URL
  brokerUrl: import.meta.env.VITE_MQTT_BROKER,

  // HiveMQ Cloud credentials
  username: import.meta.env.VITE_MQTT_USERNAME,
  password: import.meta.env.VITE_MQTT_PASSWORD,

  // Unique client ID
  clientId: `home-automation-dashboard-${Math.random()
    .toString(16)
    .substring(2, 10)}`,

  // MQTT Topics
  topics: [
    "home/relay1", // Socket
    "home/relay2", // Fan
    "home/relay3", // Tubelight
    "home/relay4", // Other
  ],
};

// Optional: Validate configuration
if (!mqttConfig.brokerUrl) {
  console.error("❌ VITE_MQTT_BROKER is missing");
}

if (!mqttConfig.username) {
  console.error("❌ VITE_MQTT_USERNAME is missing");
}

if (!mqttConfig.password) {
  console.error("❌ VITE_MQTT_PASSWORD is missing");
}