import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [message, setMessage] = useState("");
  const [urls, setUrls] = useState([]);
  const fetchUrls = async () => {
    try {
      const token =
        localStorage.getItem("token");
      const response =
        await axios.get(
          "http://localhost:8000/my-urls",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
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
    try {
      const token =
        localStorage.getItem("token");
      const response =
        await axios.post(
          "http://localhost:8000/shorten",
          {
            url
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
      setShortUrl(
        response.data.short_url
      );
      setMessage(
        "URL shortened successfully"
      );
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
      const token =
        localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8000/url/${urlId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );
      setMessage(
        "URL deleted successfully"
      );
      fetchUrls();
    } catch (error) {
      console.log(error);
      setMessage(
        "Failed to delete URL"
      );
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert("Copied Successfully");
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <nav className="navbar">
      <h2>FlashLink</h2>
      <div>
          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
      </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>
          Enterprise URL Platform
        </h1>
        <p>
          High Performance Distributed
          URL Shortener
        </p>
      </section>

      {/* SHORTENER */}
      <div className="shortener-card">
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
        />
        <button
          onClick={shortenUrl}
        >
          Shorten URL
        </button>
      </div>

      {/* GENERATED URL */}
      {shortUrl && (
        <div className="result-card">
          <h3>Generated URL</h3>
          <div className="url-box">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
            </a>
            <button
              onClick={() =>
                copyUrl(shortUrl)
              }
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="stats">
        <div className="card">
          <h3>URLs Created</h3>
          <p>{urls.length}</p>
        </div>
        <div className="card">
          <h3>Total Redirects</h3>
          <p>
            {
              urls.reduce(
                  (total, item) =>
                      total + item.click_count,
                  0
              )
            }
          </p>
        </div>
      </div>

      {/* MY URLS TABLE */}
      <div className="table-card">
        <h2>My URLs</h2>
        <table>
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Original URL</th>
              <th>Clicks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.short_code}
                </td>
                <td>
                  {item.original_url}
                </td>
                <td>
                  {item.click_count}
                </td>
                <td>
                  <button
                      onClick={() =>
                          copyUrl(
                              `http://localhost:8000/r/${item.short_code}`
                          )
                  }
                  >
                    Copy
                  </button>
                  <button
                      style={{
                        background:"#ef4444",
                        marginLeft:"10px"
                  }}
                      onClick={() =>
                          deleteUrl(item.id)
                  }
                  >
                    Delete
                  </button>
                  <button
                      style={{
                        background:"#22c55e",
                        marginLeft:"10px"
                  }}
                      onClick={() =>
                          window.location.href =
                              `/analytics/${item.short_code}`
                  }
                  >
                    Analytics
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="message">
        {message}
      </p>
    </div>
  );
}
export default Dashboard;