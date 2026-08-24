import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const API_URL =
  "https://flashlink-api.onrender.com";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

function Analytics() {
  const { shortCode } = useParams();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/analytics/${shortCode}`
        );

        setAnalytics(response.data);
      } catch (error) {
        console.error(error);

        if (error.response?.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError("Unable to load analytics");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="analytics-page-state">
        <div className="loading-spinner"></div>
        <h2>Loading analytics</h2>
        <p>Fetching your link performance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page-state">
        <div className="error-icon">!</div>
        <h2>Analytics unavailable</h2>
        <p>{error}</p>

        <button
          className="primary-button state-button"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const recentClicks = analytics.recent_clicks || [];
  const chartData = analytics.chart_data || [];
  const browserData = analytics.browser_chart || [];

  return (
    <div className="analytics-app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-mark">FL</div>

          <div>
            <strong>FlashLink</strong>
            <span>URL management</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-section-title">
            Workspace
          </div>

          <a
            href="/dashboard"
            className="nav-item"
          >
            <span>⌂</span>
            Dashboard
          </a>

          <a
            href="/dashboard#links"
            className="nav-item"
          >
            <span>↗</span>
            My Links
          </a>

          <div className="nav-item active">
            <span>◌</span>
            Analytics
          </div>

        </nav>

        <div className="sidebar-bottom">

          <div className="nav-section-title">
            Account
          </div>

          <button
            className="nav-item logout-link"
            onClick={() =>
              (window.location.href = "/dashboard")
            }
          >
            <span>←</span>
            Back to Dashboard
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="analytics-main">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="mobile-brand">
            <div className="brand-mark">
              FL
            </div>

            <strong>FlashLink</strong>
          </div>

          <div className="topbar-right">
            <div className="user-avatar">
              U
            </div>
          </div>

        </header>

        {/* HEADER */}
        <section className="analytics-header">

          <div>

            <p className="eyebrow">
              Link analytics
            </p>

            <h1>Performance</h1>

            <p className="analytics-description">
              Detailed performance data for{" "}
              <strong>
                /{analytics.short_code}
              </strong>
            </p>

          </div>

          <button
            className="secondary-button dashboard-back"
            onClick={() =>
              (window.location.href = "/dashboard")
            }
          >
            ← Dashboard
          </button>

        </section>

        {/* LINK INFO */}
        <div className="analytics-link-info">

          <div className="analytics-link-icon">
            ↗
          </div>

          <div className="analytics-link-details">

            <span>SHORT LINK</span>

            <strong>
              /{analytics.short_code}
            </strong>

          </div>

        </div>

        {/* KPIs */}
        <section className="analytics-stats">

          <div className="analytics-stat">

            <div className="analytics-stat-label">
              <span>Total clicks</span>
              <span className="analytics-stat-icon">
                ↗
              </span>
            </div>

            <strong>
              {analytics.total_clicks}
            </strong>

            <small>
              All recorded redirects
            </small>

          </div>

          <div className="analytics-stat">

            <div className="analytics-stat-label">
              <span>Unique visitors</span>
              <span className="analytics-stat-icon">
                ◉
              </span>
            </div>

            <strong>
              {analytics.unique_visitors}
            </strong>

            <small>
              Distinct visitors
            </small>

          </div>

          <div className="analytics-stat">

            <div className="analytics-stat-label">
              <span>Recent activity</span>
              <span className="analytics-stat-icon green">
                ●
              </span>
            </div>

            <strong>
              {recentClicks.length}
            </strong>

            <small>
              Recent click events
            </small>

          </div>

        </section>

        {/* CHART GRID */}
        <section className="analytics-chart-grid">

          {/* CLICK TREND */}
          <div className="analytics-panel large-panel">

            <div className="analytics-panel-header">

              <div>
                <h2>Click trend</h2>
                <p>
                  Click activity over time
                </p>
              </div>

              <span className="chart-badge">
                Daily
              </span>

            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    stroke="#202a36"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#566274"
                    tick={{
                      fill: "#718096",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    stroke="#566274"
                    tick={{
                      fill: "#718096",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#151d27",
                      border:
                        "1px solid #293646",
                      borderRadius: "8px",
                      color: "#e8edf3",
                      fontSize: "12px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                    }}
                  />

                </LineChart>
              </ResponsiveContainer>

            </div>

          </div>

          {/* BROWSER */}
          <div className="analytics-panel">

            <div className="analytics-panel-header">

              <div>
                <h2>Browsers</h2>
                <p>
                  Visitor browser distribution
                </p>
              </div>

            </div>

            <div className="chart-container">

              {browserData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <PieChart>

                    <Pie
                      data={browserData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {browserData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background:
                          "#151d27",
                        border:
                          "1px solid #293646",
                        borderRadius:
                          "8px",
                        color:
                          "#e8edf3",
                        fontSize:
                          "12px",
                      }}
                    />

                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "11px",
                        color: "#8793a3",
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">
                  No browser data
                </div>
              )}

            </div>

          </div>

        </section>

        {/* TRAFFIC */}
        <section className="analytics-panel traffic-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>Traffic overview</h2>
              <p>
                Redirect volume across the selected
                period
              </p>
            </div>

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  stroke="#202a36"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  stroke="#566274"
                  tick={{
                    fill: "#718096",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#566274"
                  tick={{
                    fill: "#718096",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#151d27",
                    border:
                      "1px solid #293646",
                    borderRadius: "8px",
                    color: "#e8edf3",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="clicks"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={35}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </section>

        {/* RECENT ACTIVITY */}
        <section className="analytics-panel activity-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>Recent activity</h2>
              <p>
                Latest recorded click events
              </p>
            </div>

            <span className="chart-badge">
              {recentClicks.length} events
            </span>

          </div>

          {recentClicks.length === 0 ? (
            <div className="activity-empty">
              No click activity recorded yet.
            </div>
          ) : (
            <div className="activity-table-wrapper">

              <table className="analytics-table">

                <thead>
                  <tr>
                    <th>IP ADDRESS</th>
                    <th>BROWSER</th>
                    <th>TIME</th>
                  </tr>
                </thead>

                <tbody>

                  {recentClicks.map(
                    (click, index) => (
                      <tr key={index}>

                        <td>
                          <span className="ip-value">
                            {click.ip_address}
                          </span>
                        </td>

                        <td>
                          <span className="browser-value">
                            {click.user_agent}
                          </span>
                        </td>

                        <td>
                          {new Date(
                            click.timestamp
                          ).toLocaleString()}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>

      {/* MOBILE NAV */}
      <nav className="mobile-nav">

        <a
          href="/dashboard"
          className="mobile-nav-item"
        >
          <span>⌂</span>
          Home
        </a>

        <a
          href="/dashboard#links"
          className="mobile-nav-item"
        >
          <span>↗</span>
          Links
        </a>

        <a
          href={`/analytics/${shortCode}`}
          className="mobile-nav-item active"
        >
          <span>◌</span>
          Analytics
        </a>

      </nav>

    </div>
  );
}

export default Analytics;