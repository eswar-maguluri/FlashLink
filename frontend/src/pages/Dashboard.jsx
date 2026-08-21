import { useState, useEffect } from "react";
import axios from "axios";

const API_URL =
  "https://flashlink-eswar-bch2bagaa6azcnc2.centralindia-01.azurewebsites.net";

function Dashboard() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [message, setMessage] = useState("");
  const [urls, setUrls] = useState([]);

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/my-urls`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUrls(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const shortenUrl = async () => {
    if (!url.trim()) {
      setMessage("Please enter a URL");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/shorten`,
        {
          url: url.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShortUrl(response.data.short_url);
      setMessage("URL shortened successfully");
      setUrl("");

      fetchUrls();
    } catch (error) {
      if (error.response) {
        setMessage(
          typeof error.response.data.detail === "string"
            ? error.response.data.detail
            : "Validation Error"
        );
      } else {
        setMessage("Server Error");
      }
    }
  };

  const deleteUrl = async (urlId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/url/${urlId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("URL deleted successfully");
      fetchUrls();
    } catch (error) {
      console.log(error);
      setMessage("Failed to delete URL");
    }
  };

  const copyUrl = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied to clipboard");
    } catch (error) {
      console.log(error);
      setMessage("Unable to copy URL");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const totalRedirects = urls.reduce(
    (total, item) => total + item.click_count,
    0
  );

  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">FL</div>

          <div>
            <h2>FlashLink</h2>
            <span>URL Platform</span>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span className="status-dot"></span>
          Enterprise URL Platform
        </div>

        <h1>
          Shorten links.
          <br />
          <span>Track everything.</span>
        </h1>

        <p>
          Create powerful short URLs and monitor
          <br className="desktop-break" />
          your link performance from one place.
        </p>
      </section>

      {/* SHORTENER */}
      <section className="shortener-section">
        <div className="section-label">
          <span>01</span>
          CREATE SHORT URL
        </div>

        <div className="shortener-card">
          <div className="input-wrapper">
            <span className="input-icon">↗</span>

            <input
              type="url"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  shortenUrl();
                }
              }}
            />
          </div>

          <button
            className="shorten-btn"
            onClick={shortenUrl}
          >
            Shorten URL
            <span>→</span>
          </button>
        </div>
      </section>

      {/* GENERATED URL */}
      {shortUrl && (
        <section className="result-card">
          <div className="result-header">
            <div>
              <span className="success-icon">✓</span>
              <div>
                <h3>Your short URL is ready</h3>
                <p>Share this link anywhere.</p>
              </div>
            </div>
          </div>

          <div className="url-box">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
            </a>

            <button
              className="copy-btn"
              onClick={() => copyUrl(shortUrl)}
            >
              Copy
            </button>
          </div>
        </section>
      )}

      {/* STATS */}
      <section className="stats-section">
        <div className="section-label">
          <span>02</span>
          OVERVIEW
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">↗</span>
              <span className="stat-label">TOTAL LINKS</span>
            </div>

            <p>{urls.length}</p>
            <span className="stat-description">
              Short URLs created
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">◉</span>
              <span className="stat-label">TOTAL CLICKS</span>
            </div>

            <p>{totalRedirects}</p>
            <span className="stat-description">
              Total redirects
            </span>
          </div>
        </div>
      </section>

      {/* MY URLS */}
      <section className="table-card">
        <div className="table-header">
          <div>
            <div className="section-label">
              <span>03</span>
              YOUR LINKS
            </div>

            <h2>My URLs</h2>
          </div>

          <span className="url-count">
            {urls.length} {urls.length === 1 ? "link" : "links"}
          </span>
        </div>

        {urls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">↗</div>
            <h3>No URLs yet</h3>
            <p>
              Create your first short URL above.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>SHORT CODE</th>
                  <th>ORIGINAL URL</th>
                  <th>CLICKS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {urls.map((item) => {
                  const generatedUrl =
                    `${API_URL}/r/${item.short_code}`;

                  return (
                    <tr key={item.id}>
                      <td data-label="Short Code">
                        <span className="short-code">
                          /{item.short_code}
                        </span>
                      </td>

                      <td data-label="Original URL">
                        <span className="original-url">
                          {item.original_url}
                        </span>
                      </td>

                      <td data-label="Clicks">
                        <span className="click-count">
                          {item.click_count}
                        </span>
                      </td>

                      <td data-label="Actions">
                        <div className="actions">
                          <button
                            className="action-btn copy-action"
                            onClick={() =>
                              copyUrl(generatedUrl)
                            }
                          >
                            Copy
                          </button>

                          <button
                            className="action-btn analytics-action"
                            onClick={() =>
                              (window.location.href =
                                `/analytics/${item.short_code}`)
                            }
                          >
                            Analytics
                          </button>

                          <button
                            className="action-btn delete-action"
                            onClick={() =>
                              deleteUrl(item.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* MESSAGE */}
      {message && (
        <div className="message">
          <span>✓</span>
          {message}
        </div>
      )}

    </div>
  );
}

export default Dashboard;