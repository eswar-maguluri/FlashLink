import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
function Analytics() {
  const { shortCode } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/analytics/${shortCode}`
      );
      setAnalytics(response.data);
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to load analytics");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
  }, [shortCode]);
  if (loading) {
    return (
      <div className="dashboard">
        <h1>Loading Analytics...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div className="dashboard">
        <h1>{error}</h1>
      </div>
    );
  }
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>FlashLink</h2>
        <button
          className="logout-btn"
          onClick={() =>
            window.location.href = "/dashboard"
          }
        >
          Dashboard
        </button>
      </nav>
      <section className="hero">
        <h1>Analytics Dashboard</h1>
        <p>
          Short Code: {analytics.short_code}
        </p>
      </section>
      <div className="stats">
        <div className="card">
          <h3>Total Clicks</h3>
          <p>{analytics.total_clicks}</p>
        </div>
        <div className="card">
          <h3>Unique Visitors</h3>
          <p>{analytics.unique_visitors}</p>
        </div>
        <div className="card">
          <h3>Recent Events</h3>
          <p>{analytics.recent_clicks.length}</p>
        </div>
      </div>
      <div className="table-card">
        <h2>Recent Click Activity</h2>
        <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Browser</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {analytics.recent_clicks.length > 0 ? (
              analytics.recent_clicks.map(
                (click, index) => (
                  <tr key={index}>
                    <td>{click.ip_address}</td>
                    <td>{click.user_agent}</td>
                    <td>
                      {new Date(
                        click.timestamp
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="3">
                  No Analytics Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Analytics;