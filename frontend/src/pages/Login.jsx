import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");
  const navigate = useNavigate();
  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        {
          email,
          password
        }
      );
      localStorage.setItem(
        "token",
        response.data.access_token
      );
      navigate("/dashboard");
    } catch(error) {
      setMessage("Login Failed");
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
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button onClick={loginUser}>
          Login
        </button>
        <p>{message}</p>
        <Link to="/register">
          Create Account
        </Link>
      </div>
    </div>
  );
}
export default Login;