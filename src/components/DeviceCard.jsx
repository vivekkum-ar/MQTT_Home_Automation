import React from 'react'
import { FaPlug, FaFan, FaLightbulb, FaMicrochip } from 'react-icons/fa'

// Map icon names to react-icons components
const iconMap = {
  FaPlug: FaPlug,
  FaFan: FaFan,
  FaLightbulb: FaLightbulb,
  FaMicrochip: FaMicrochip,
}

/**
 * DeviceCard Component
 * Displays a single smart device with icon, status, toggle switch,
 * and animated glow effects. Follows the last known MQTT state.
 */
const DeviceCard = ({ name, topic, iconName, state, lastUpdated, onToggle, disabled }) => {
  const Icon = iconMap[iconName] || FaMicrochip
  const isOn = state === 'ON'

  // Format the last updated timestamp
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Never'

  const handleToggle = () => {
    if (!disabled) {
      onToggle(topic, state)
    }
  }

  return (
    <div
      className={`device-card ${isOn ? 'device-on' : 'device-off'} ${disabled ? 'device-disabled' : ''}`}
      role="region"
      aria-label={`${name} control card`}
    >
      {/* Animated top border indicator */}
      <div className="card-top-border" />

      <div className="device-header">
        <div className={`device-icon-wrapper ${isOn ? 'glow' : ''}`}>
          <Icon className="device-icon" aria-hidden="true" />
        </div>
        <div className="device-info">
          <h3 className="device-name">{name}</h3>
          <span className="device-topic">{topic}</span>
        </div>
      </div>

      <div className="device-status">
        <span className={`status-text ${isOn ? 'status-on' : 'status-off'}`}>
          {isOn ? 'ON' : 'OFF'}
        </span>
        <span className="last-updated">{formattedTime}</span>
      </div>

      <div className="device-toggle">
        <button
          className={`toggle-btn ${isOn ? 'toggle-on' : 'toggle-off'}`}
          onClick={handleToggle}
          disabled={disabled}
          aria-pressed={isOn}
          aria-label={`Toggle ${name} ${isOn ? 'off' : 'on'}`}
        >
          <span className="toggle-slider" />
        </button>
      </div>
    </div>
  )
}

export default DeviceCard
