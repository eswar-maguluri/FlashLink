import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://flashlink-api.onrender.com";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const registerUser = async () => {
    setMessage("");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setMessage("Please enter an email and password");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          email: cleanEmail,
          password,
        },
        {
          timeout: 15000,
        }
      );
      const token = response.data.access_token;
      if (!token) {
        throw new Error("No access token received");
      }
      localStorage.setItem("token", token);
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      if (error.response?.data?.detail) {
        setMessage(
          typeof error.response.data.detail === "string"
            ? error.response.data.detail
            : "Registration failed"
        );
      } else if (error.code === "ECONNABORTED") {
        setMessage(
          "The server is taking too long to respond. Please try again."
        );
      } else {
        setMessage(
          "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-layout">
      <section className="auth-showcase">
        <div className="auth-showcase-brand">
          <div className="brand-mark">FL</div>
          <div>
            <strong>FlashLink</strong>
            <span>URL management</span>
          </div>
        </div>
        <div className="auth-showcase-content">
          <p className="auth-overline">
            GET STARTED
          </p>
          <h1>
            Your links.
            <br />
            Under control.
          </h1>
          <p>
            Create your account and start
            shortening, sharing, and tracking
            your links.
          </p>
        </div>
        <div className="auth-showcase-footer">
          <span>FlashLink</span>
          <span>URL Management Platform</span>
        </div>
      </section>
      <main className="auth-form-area">
        <div className="auth-form-card">
          <div className="auth-mobile-brand">
            <div className="brand-mark">FL</div>
            <strong>FlashLink</strong>
          </div>
          <div className="auth-heading">
            <p className="auth-label">
              ACCOUNT
            </p>
            <h2>
              Create your account
            </h2>
            <p>
              Start managing your short links.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) {
                registerUser();
              }
            }}
          >
            <label>
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              disabled={loading}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
            <label>
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              autoComplete="new-password"
              disabled={loading}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
            <p className="password-hint">
              Use at least 6 characters.
            </p>
            {message && (
              <div className="auth-message error">
                <span>!</span>
                {message}
              </div>
            )}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>
          <Link
            to="/"
            className="auth-secondary-button"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
export default Register;