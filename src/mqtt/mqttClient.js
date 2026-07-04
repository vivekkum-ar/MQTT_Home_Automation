import mqtt from 'mqtt'
import { mqttConfig } from '../config/mqttConfig'

let client = null

// Callback registries
let messageCallbacks = []
let connectCallbacks = []
let disconnectCallbacks = []
let errorCallbacks = []
let reconnectCallbacks = []

/**
 * Get current MQTT connection status
 */
export const getConnectionStatus = () => {
  if (!client) return 'disconnected'
  return client.connected ? 'connected' : 'disconnected'
}

/**
 * Check if client is currently connected
 */
export const isConnected = () => {
  return client ? client.connected : false
}

/**
 * Establish MQTT connection to HiveMQ Cloud
 * Uses automatic reconnection with a 5-second interval
 */
export const connect = () => {
  // Prevent duplicate client instances
  if (client) {
    if (client.connected) {
      console.log('[MQTT] Already connected')
      return
    }
    // Client exists but is reconnecting internally; don't recreate
    console.log('[MQTT] Client exists, allowing internal reconnection')
    return
  }

  console.log('[MQTT] Connecting to broker...')

  try {
    client = mqtt.connect(mqttConfig.brokerUrl, {
      clientId: mqttConfig.clientId,
      username: mqttConfig.username,
      password: mqttConfig.password,
      protocol: 'wss',
      reconnectPeriod: 5000,      // Auto-reconnect every 5 seconds
      connectTimeout: 30 * 1000,  // 30 second connection timeout
      clean: true,                // Clean session (no persistent subscriptions)
      rejectUnauthorized: false, // Allow self-signed certificates if needed
    })

    // Fired on successful connection (and reconnection)
    client.on('connect', () => {
      console.log('[MQTT] Connected successfully')
      connectCallbacks.forEach((cb) => cb())

      // Subscribe to all configured topics with QoS 1
      mqttConfig.topics.forEach((topic) => {
        client.subscribe(topic, { qos: 1 }, (err) => {
          if (err) {
            console.error(`[MQTT] Failed to subscribe to ${topic}:`, err)
          } else {
            console.log(`[MQTT] Subscribed to ${topic}`)
          }
        })
      })
    })

    // Incoming message handler
    client.on('message', (topic, message) => {
      const payload = message.toString()
      console.log(`[MQTT] Message received on ${topic}: ${payload}`)
      messageCallbacks.forEach((cb) => cb(topic, payload))
    })

    // Disconnection handler
    client.on('disconnect', () => {
      console.log('[MQTT] Disconnected by broker')
      disconnectCallbacks.forEach((cb) => cb())
    })

    // Connection closed handler
    client.on('close', () => {
      console.log('[MQTT] Connection closed')
      disconnectCallbacks.forEach((cb) => cb())
    })

    // Error handler
    client.on('error', (err) => {
      console.error('[MQTT] Error:', err.message)
      errorCallbacks.forEach((cb) => cb(err))
    })

    // Reconnection attempt handler
    client.on('reconnect', () => {
      console.log('[MQTT] Reconnecting...')
      reconnectCallbacks.forEach((cb) => cb())
    })

    // Offline handler
    client.on('offline', () => {
      console.log('[MQTT] Client went offline')
      disconnectCallbacks.forEach((cb) => cb())
    })

  } catch (err) {
    console.error('[MQTT] Failed to initialize client:', err)
    errorCallbacks.forEach((cb) => cb(err))
  }
}

/**
 * Gracefully close the MQTT connection
 */
export const disconnect = () => {
  if (client) {
    client.end(true, () => {
      console.log('[MQTT] Connection manually closed')
    })
    client = null
  }
}

/**
 * Publish a message to an MQTT topic
 * @param {string} topic - Target MQTT topic
 * @param {string} message - Payload to send (e.g., 'ON' or 'OFF')
 */
export const publish = (topic, message) => {
  if (client && client.connected) {
    client.publish(topic, message, { qos: 1, retain: false }, (err) => {
      if (err) {
        console.error(`[MQTT] Publish error to ${topic}:`, err)
      } else {
        console.log(`[MQTT] Published to ${topic}: ${message}`)
      }
    })
  } else {
    console.error('[MQTT] Cannot publish: client not connected')
  }
}

// Event subscription helpers (return unsubscribe functions)
export const onMessage = (callback) => {
  messageCallbacks.push(callback)
  return () => {
    messageCallbacks = messageCallbacks.filter((cb) => cb !== callback)
  }
}

export const onConnect = (callback) => {
  connectCallbacks.push(callback)
  return () => {
    connectCallbacks = connectCallbacks.filter((cb) => cb !== callback)
  }
}

export const onDisconnect = (callback) => {
  disconnectCallbacks.push(callback)
  return () => {
    disconnectCallbacks = disconnectCallbacks.filter((cb) => cb !== callback)
  }
}

export const onError = (callback) => {
  errorCallbacks.push(callback)
  return () => {
    errorCallbacks = errorCallbacks.filter((cb) => cb !== callback)
  }
}

export const onReconnect = (callback) => {
  reconnectCallbacks.push(callback)
  return () => {
    reconnectCallbacks = reconnectCallbacks.filter((cb) => cb !== callback)
  }
}
