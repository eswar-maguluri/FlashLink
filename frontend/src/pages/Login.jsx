import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  "https://flashlink-api.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = async () => {
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setMessage("Invalid email or password");
      } else {
        setMessage(
          "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">

      {/* LEFT BRAND PANEL */}
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
            SIMPLE. FAST. RELIABLE.
          </p>

          <h1>
            Manage your links
            <br />
            in one place.
          </h1>

          <p>
            Create short URLs, monitor clicks,
            and understand how your links perform.
          </p>

        </div>

        <div className="auth-showcase-footer">
          <span>FlashLink</span>
          <span>URL Management Platform</span>
        </div>

      </section>


      {/* LOGIN */}
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
              Welcome back
            </h2>

            <p>
              Sign in to manage your links.
            </p>

          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginUser();
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
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <div className="password-label-row">
              <label>Password</label>
            </div>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              autoComplete="current-password"
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

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
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

          <div className="auth-divider">
            <span>New to FlashLink?</span>
          </div>

          <Link
            to="/register"
            className="auth-secondary-button"
          >
            Create an account
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Login;