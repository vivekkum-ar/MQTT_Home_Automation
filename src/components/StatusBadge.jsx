import React from 'react'

/**
 * StatusBadge Component
 * Displays the current MQTT connection status with color-coded styling
 * and a loading spinner when connecting/reconnecting.
 */
const StatusBadge = ({ status }) => {
  const config = {
    connected: {
      text: 'Connected to HiveMQ',
      className: 'badge-connected',
    },
    connecting: {
      text: 'Connecting...',
      className: 'badge-connecting',
    },
    disconnected: {
      text: 'Disconnected',
      className: 'badge-disconnected',
    },
    error: {
      text: 'Connection Error',
      className: 'badge-error',
    },
  }

  const { text, className } = config[status] || config.disconnected
  const showSpinner = status === 'connecting'

  return (
    <span className={`status-badge ${className}`}>
      {showSpinner && <span className="spinner" aria-hidden="true" />}
      {text}
    </span>
  )
}

export default StatusBadge
