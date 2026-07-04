import React from 'react'
import { FaWifi } from 'react-icons/fa'
import StatusBadge from './StatusBadge'

/**
 * Navbar Component
 * Top navigation bar displaying the app title and MQTT connection status.
 * Includes a Wi-Fi style indicator that animates when connected.
 */
const Navbar = ({ status }) => {
  const isConnected = status === 'connected'

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>Home Automation</h1>
        </div>
        <div className="navbar-status">
          <FaWifi
            className={`wifi-icon ${isConnected ? 'wifi-connected' : 'wifi-disconnected'}`}
            aria-label={isConnected ? 'WiFi connected' : 'WiFi disconnected'}
          />
          <StatusBadge status={status} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
