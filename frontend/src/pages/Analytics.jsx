import { useState, useEffect } from "react";
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
  Legend
} from "recharts";

function Analytics() {
  const { shortCode } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];
  useEffect(() => {
    fetchAnalytics();
  }, [shortCode]);
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `https://flashlink-api.onrender.com/analytics/${shortCode}`
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
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>FlashLink</h2>
        <button
          className="logout-btn"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          Dashboard
        </button>
      </nav>
      {/* HERO */}
      <section className="hero">
        <h1>Analytics Dashboard</h1>
        <p>
          Short Code:
          <strong>
            {" "}
            {analytics.short_code}
          </strong>
        </p>
      </section>
      {/* KPI CARDS */}
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
          <p>
            {analytics.recent_clicks.length}
          </p>
        </div>
      </div>
      {/* CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(450px,1fr))",
          gap: "25px",
          marginTop: "30px",
        }}
      >
        {/* LINE CHART */}
        <div className="table-card">
          <h2>Click Trend</h2>
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart
              data={analytics.chart_data}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* PIE CHART */}
        <div className="table-card">
          <h2>
            Browser Distribution
          </h2>
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={
                  analytics.browser_chart
                }
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {analytics.browser_chart.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={index}
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
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* BAR CHART */}
      <div
        className="table-card"
        style={{
          marginTop: "30px",
        }}
      >
        <h2>Traffic Overview</h2>
        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart
            data={analytics.chart_data}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="clicks"
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* RECENT ACTIVITY */}
      <div
        className="table-card"
        style={{
          marginTop: "30px",
        }}
      >
        <h2>
          Recent Click Activity
        </h2>
        <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Browser</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {analytics.recent_clicks.length >
            0 ? (
              analytics.recent_clicks.map(
                (
                  click,
                  index
                ) => (
                  <tr key={index}>
                    <td>
                      {
                        click.ip_address
                      }
                    </td>
                    <td>
                      {
                        click.user_agent
                      }
                    </td>
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
                  No Analytics Data
                  Available
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