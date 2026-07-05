import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const loginUser = async () => {
    setMessage("");
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }
    try {
      const response = await axios.post(
        "https://flashlink-api.onrender.com/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem(
        "token",
        response.data.access_token
      );
      setMessage("Login Successful");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setMessage("Invalid email or password");
        const goRegister = window.confirm(
          "Email not found or password is incorrect.\n\nDo you want to create a new account?"
        );
        if (goRegister) {
          navigate("/register");
        }
      } else {
        setMessage(
          "Server error. Please try again later."
        );
      }
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>FlashLink</h1>
        <h2>Welcome Back</h2>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={loginUser}>
          Login
        </button>
        {message && (
          <p
            style={{
              color:
                message === "Login Successful"
                  ? "#22c55e"
                  : "#ef4444",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
        <Link to="/register">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;