import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");

  const navigate = useNavigate();

  const registerUser = async () => {

    try {

      await axios.post(
        "http://localhost:8000/auth/register",
        {
          email,
          password
        }
      );

      const loginResponse =
        await axios.post(
          "http://localhost:8000/auth/login",
          {
            email,
            password
          }
        );

      localStorage.setItem(
        "token",
        loginResponse.data.access_token
      );

      navigate("/dashboard");

    } catch(error) {

      setMessage("Registration Failed");

    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>FlashLink</h1>
        <h2>Create Account</h2>

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

        <button onClick={registerUser}>
          Register
        </button>

        <p>{message}</p>

        <Link to="/">
          Already have an account?
        </Link>

      </div>
    </div>
  );
}

export default Register;