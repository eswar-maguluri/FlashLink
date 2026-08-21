import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL =
  "https://flashlink-eswar-bch2bagaa6azcnc2.centralindia-01.azurewebsites.net";

function Dashboard() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [message, setMessage] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      const response = await axios.get(
        `${API_URL}/my-urls`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUrls(response.data || []);
    } catch (error) {
      console.error("Failed to load URLs:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }
      setMessage("Unable to load your links");
    }
  };
  useEffect(() => {
    fetchUrls();
  }, []);

  const totalClicks = useMemo(() => {
    return urls.reduce(
      (total, item) =>
        total + Number(item.click_count || 0),
      0
    );
  }, [urls]);
  const shortenUrl = async () => {
    if (!url.trim()) {
      setMessage("Please enter a URL");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      setShortUrl("");
      const token =
        localStorage.getItem("token");
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
      setShortUrl(
        response.data.short_url
      );
      setUrl("");
      setMessage(
        "Short link created successfully"
      );
      await fetchUrls();
    } catch (error) {
      console.error(
        "Shorten URL error:",
        error
      );
      if (error.response?.data?.detail) {
        if (
          typeof error.response.data.detail ===
          "string"
        ) {
          setMessage(
            error.response.data.detail
          );
        } else {
          setMessage("Invalid URL");
        }
      } else {
        setMessage(
          "Unable to create short link"
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const copyUrl = async (value) => {
    try {
      await navigator.clipboard.writeText(
        value
      );
      setMessage(
        "Link copied to clipboard"
      );
    } catch (error) {
      console.error(
        "Copy error:",
        error
      );
      setMessage(
        "Unable to copy link"
      );
    }
  };

  const deleteUrl = async (urlId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this link?"
    );
    if (!confirmed) {
      return;
    }
    try {
      setDeletingId(urlId);
      const token =
        localStorage.getItem("token");
      await axios.delete(
        `${API_URL}/url/${urlId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(
        "Link deleted successfully"
      );
      await fetchUrls();
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );
      setMessage(
        "Unable to delete link"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  const getShortUrl = (shortCode) => {
    return `${API_URL}/r/${shortCode}`;
  };

  const openAnalytics = (shortCode) => {
    window.location.href =
      `/analytics/${shortCode}`;
  };

  return (
    <div className="app-shell">

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside className="sidebar">
        {/* BRAND */}
        <div className="sidebar-brand">
          <div className="brand-mark">
            FL
          </div>
          <div>
            <strong>
              FlashLink
            </strong>
            <span>
              URL management
            </span>
          </div>
        </div>


        {/* NAVIGATION */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">
            Workspace
          </div>
          <a
            href="/dashboard"
            className="nav-item active"
          >
            <span>⌂</span>
            Dashboard
          </a>
          <a
            href="#links"
            className="nav-item"
          >
            <span>↗</span>
            My Links
          </a>
        </nav>

        {/* ACCOUNT */}
        <div className="sidebar-bottom">
          <div className="nav-section-title">
            Account
          </div>
          <button
            type="button"
            className="nav-item logout-link"
            onClick={logout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main-content">

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <header className="topbar">

          {/* MOBILE BRAND */}

          <div className="mobile-brand">
            <div className="brand-mark">
              FL
            </div>
            <strong>
              FlashLink
            </strong>
          </div>

          {/* TOP RIGHT */}

          <div className="topbar-right">
          </div>
        </header>

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <section className="page-header">
          <div>
            <p className="eyebrow">
              Workspace
            </p>
            <h1>
              Dashboard
            </h1>
            <p className="page-description">
              Create and manage your short links.
            </p>
          </div>
        </section>


        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="stats-grid">
          {/* TOTAL LINKS */}
          <div className="stat-box">
            <div className="stat-box-header">
              <span>
                Total links
              </span>
              <span className="stat-symbol">
                ↗
              </span>
            </div>
            <strong>
              {urls.length}
            </strong>
            <small>
              Links created
            </small>
          </div>

          {/* TOTAL CLICKS */}
          <div className="stat-box">
            <div className="stat-box-header">
              <span>
                Total clicks
              </span>
              <span className="stat-symbol">
                ◎
              </span>
            </div>
            <strong>
              {totalClicks}
            </strong>
            <small>
              Total redirects
            </small>
          </div>

          {/* ACTIVE LINKS */}
          <div className="stat-box">
            <div className="stat-box-header">
              <span>
                Active links
              </span>
              <span className="stat-symbol green">
                ●
              </span>
            </div>
            <strong>
              {urls.length}
            </strong>
            <small>
              Currently available
            </small>
          </div>
        </section>

        {/* ===================================================
            CREATE SHORT LINK
        =================================================== */}

        <section className="create-panel">
          <div className="panel-heading">
            <h2>
              Create a short link
            </h2>
            <p>
              Paste a long URL and we'll create
              a shareable link.
            </p>
          </div>
          <div className="url-form">

            {/* INPUT */}
            <div className="url-input-container">
              <span className="url-prefix">
                https://
              </span>
              <input
                type="url"
                value={url}
                placeholder="example.com/your-long-url"
                onChange={(event) =>
                  setUrl(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    shortenUrl();
                  }
                }}
              />
            </div>

            {/* BUTTON */}
            <button
              type="button"
              className="primary-button"
              onClick={shortenUrl}
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Shorten URL"}
              {!loading && (
                <span>
                  →
                </span>
              )}
            </button>
          </div>

          {/* =================================================
              GENERATED LINK
          ================================================= */}
          {shortUrl && (
            <div className="created-link">
              <div className="created-link-info">
                <span className="success-dot">
                  ✓
                </span>
                <div>
                  <small>
                    Short link created
                  </small>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortUrl}
                  </a>
                </div>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  copyUrl(shortUrl)
                }
              >
                Copy
              </button>
            </div>
          )}
        </section>

        {/* ===================================================
            MY LINKS
        =================================================== */}
        <section
          className="links-panel"
          id="links"
        >
          <div className="links-heading">
            <div>
              <p className="eyebrow">
                Library
              </p>
              <h2>
                My links
              </h2>
            </div>
            <span className="count-badge">
              {urls.length}
            </span>
          </div>

          {/* EMPTY */}
          {urls.length === 0 ? (
            <div className="empty-links">
              <div className="empty-icon">
                ↗
              </div>
              <h3>
                No links yet
              </h3>
              <p>
                Create your first short link
                above to see it here.
              </p>
            </div>
          ) : (

            <div className="links-list">
              {urls.map((item) => {
                const shortLink =
                  getShortUrl(
                    item.short_code
                  );
                return (
                  <article
                    className="link-row"
                    key={item.id}
                  >
                    {/* LINK INFORMATION */}
                    <div className="link-main">
                      <div className="link-icon">
                        ↗
                      </div>
                      <div className="link-details">
                        <a
                          href={shortLink}
                          target="_blank"
                          rel="noreferrer"
                          className="short-link"
                        >
                          /{item.short_code}
                        </a>
                        <p
                          title={
                            item.original_url
                          }
                        >
                          {item.original_url}
                        </p>
                      </div>
                    </div>

                    {/* CLICKS */}
                    <div className="link-clicks">
                      <strong>
                        {item.click_count || 0}
                      </strong>
                      <span>
                        clicks
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="link-actions">

                      {/* COPY */}
                      <button
                        type="button"
                        className="row-button"
                        onClick={() =>
                          copyUrl(shortLink)
                        }
                      >
                        Copy
                      </button>

                      {/* ANALYTICS */}
                      <button
                        type="button"
                        className="row-button analytics-button"
                        onClick={() =>
                          openAnalytics(
                            item.short_code
                          )
                        }
                      >
                        Analytics
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        className="row-button delete-button"
                        disabled={
                          deletingId === item.id
                        }
                        onClick={() =>
                          deleteUrl(item.id)
                        }
                      >
                        {deletingId === item.id
                          ? "..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}
      <nav className="mobile-nav">
        {/* HOME */}
        <a
          href="/dashboard"
          className="mobile-nav-item active"
        >
          <span>
            ⌂
          </span>
          <small>
            Home
          </small>
        </a>

        {/* LINKS */}
        <a
          href="#links"
          className="mobile-nav-item"
        >
          <span>
            ↗
          </span>
          <small>
            Links
          </small>
        </a>

        {/* ANALYTICS */}
        <button
          type="button"
          className="mobile-nav-item"
          onClick={() => {
            if (urls.length > 0) {
              openAnalytics(
                urls[0].short_code
              );
            } else {
              setMessage(
                "Create a link to view analytics"
              );
            }
          }}
        >
          <span>
            ◌
          </span>
          <small>
            Analytics
          </small>
        </button>

        {/* LOGOUT */}
        <button
          type="button"
          className="mobile-nav-item mobile-logout"
          onClick={logout}
        >
          <span>
            ↪
          </span>
          <small>
            Logout
          </small>
        </button>
      </nav>

      {/* =====================================================
          TOAST MESSAGE
      ===================================================== */}

      {message && (
        <div className="toast">
          <span>
            ✓
          </span>
          {message}
        </div>
      )}
    </div>
  );
}
export default Dashboard;