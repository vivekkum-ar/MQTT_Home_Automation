import React, { useState, useEffect, useCallback } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Login from "./components/Login";
import DeviceCard from './components/DeviceCard'
import {
  connect,
  disconnect,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  onReconnect,
  publish,
} from './mqtt/mqttClient'

/**
 * Device registry — defines the four ESP8266 relay channels.
 * Each device maps to a specific MQTT topic and icon.
 */
const DEVICES = [
  { id: 'relay1', name: 'Socket', topic: 'home/relay1', icon: 'FaPlug' },
  { id: 'relay2', name: 'Fan', topic: 'home/relay2', icon: 'FaFan' },
  { id: 'relay3', name: 'Tubelight', topic: 'home/relay3', icon: 'FaLightbulb' },
  { id: 'relay4', name: 'Other', topic: 'home/relay4', icon: 'FaMicrochip' },
]

/**
 * App Component
 * Root component that manages MQTT lifecycle, device state,
 * and renders the responsive dashboard grid.
 */
function App() {
  const [authenticated, setAuthenticated] = useState(
  sessionStorage.getItem("authenticated") === "true"
);
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [deviceStates, setDeviceStates] = useState({})
if (!authenticated) {
  return (
    <>
      <Toaster position="bottom-right" />
      <Login onSuccess={() => setAuthenticated(true)} />
    </>
  );
}
  // Initialize device state map
  useEffect(() => {
    if (!authenticated) return;
    const initialStates = {}
    DEVICES.forEach((device) => {
      initialStates[device.topic] = { state: 'OFF', lastUpdated: null }
    })
    setDeviceStates(initialStates)
  }, [])

  // Setup MQTT event listeners and connection
  useEffect(() => {
    if (!authenticated) return;
    const handleConnect = () => setConnectionStatus('connected')
    const handleDisconnect = () => setConnectionStatus('disconnected')
    const handleError = () => setConnectionStatus('error')
    const handleReconnect = () => setConnectionStatus('connecting')

    /**
     * Handle incoming MQTT messages.
     * Only accepts 'ON' or 'OFF' payloads and updates the UI accordingly.
     * Triggers a toast notification when a device state actually changes.
     */
    const handleMessage = (topic, payload) => {
      const normalizedPayload = payload.trim().toUpperCase()

      if (normalizedPayload !== 'ON' && normalizedPayload !== 'OFF') {
        return // Ignore invalid payloads
      }

      setDeviceStates((prev) => {
        const previousState = prev[topic]?.state
        const newEntry = {
          state: normalizedPayload,
          lastUpdated: Date.now(),
        }

        // Only notify if the state genuinely changed
        if (previousState !== normalizedPayload) {
          const device = DEVICES.find((d) => d.topic === topic)
          if (device) {
            toast.success(
              `${device.name} turned ${normalizedPayload === 'OFF' ? 'ON' : 'OFF'}`,
              {
                icon: normalizedPayload === 'OFF' ? '⚡' : '⭕',
                id: `${topic}-state-change`, // Deduplicate rapid toggles
              }
            )
          }
        }

        return { ...prev, [topic]: newEntry }
      })
    }

    // Register callbacks
    const unsubConnect = onConnect(handleConnect)
    const unsubDisconnect = onDisconnect(handleDisconnect)
    const unsubError = onError(handleError)
    const unsubReconnect = onReconnect(handleReconnect)
    const unsubMessage = onMessage(handleMessage)

    // Initiate connection
    setConnectionStatus('connecting')
    connect()

    // Cleanup on unmount
    return () => {
      unsubConnect()
      unsubDisconnect()
      unsubError()
      unsubReconnect()
      unsubMessage()
      disconnect()
    }
  }, [])

  /**
   * Toggle handler — publishes the opposite state to MQTT.
   * The UI does NOT optimistically update; it waits for the
   * MQTT message to reflect the actual relay state.
   */
  const handleToggle = useCallback((topic, currentState) => {
    const nextState = currentState === 'ON' ? 'OFF' : 'ON'
    publish(topic, nextState)
  }, [])

  const isDisconnected = connectionStatus !== 'connected'

  return (
    <div className="app">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1E293B',
            color: '#F1F5F9',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />

      <Navbar status={connectionStatus} />

      <main className="main-content">
        <div className="device-grid">
          {DEVICES.map((device) => {
            const topicData = deviceStates[device.topic] || {
              state: 'OFF',
              lastUpdated: null,
            }

            return (
              <DeviceCard
                key={device.id}
                name={device.name}
                topic={device.topic}
                iconName={device.icon}
                state={topicData.state}
                lastUpdated={topicData.lastUpdated}
                onToggle={handleToggle}
                disabled={isDisconnected}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default App
