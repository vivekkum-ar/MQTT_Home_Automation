import { useState } from "react";
import { toast } from "react-hot-toast";

function Login({ onSuccess }) {
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === import.meta.env.VITE_MQTT_PASSWORD) {
      sessionStorage.setItem("authenticated", "true");
      onSuccess();
      return;
    }

    toast.error("Incorrect password");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🏠 Home Automation</h1>

        <p>Enter Password</p>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;