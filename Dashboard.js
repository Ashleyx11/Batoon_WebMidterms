import React, { useState, useEffect, useRef } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaCog, FaEnvelope, FaSignOutAlt, FaSearch } from "react-icons/fa";
import "./Dashboard.css";

// Register chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, ArcElement, Tooltip, Legend, PointElement, LineElement);

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const sidebarRef = useRef(null);

  /* activity */
  const [recentActivity, setRecentActivity] = useState([
    "Logged in at 10:30 AM",
    "Viewed trending albums",
    "Checked latest Opium merch",
  ]);

  /* events */
  const upcomingEvents = [
    "🔥 Playboi Carti World Tour - Dates TBA",
    "💿 Ken Carson's New Album Drops Soon!",
    "🎤 Destroy Lonely Performing Live in LA",
  ];

  /* albums */
  const trendingAlbums = [
    { name: "Whole Lotta Red", artist: "Playboi Carti", streams: "2.5M" },
    { name: "A Great Chaos", artist: "Ken Carson", streams: "1.8M" },
    { name: "If Looks Could Kill", artist: "Destroy Lonely", streams: "1.2M" },
  ];

  /* filter album  search */
  const filteredAlbums = trendingAlbums.filter((album) =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* barchart */
  const barChartData = {
    labels: ["Whole Lotta Red", "Narcissist", "A Great Chaos", "If Looks Could Kill"],
    datasets: [
      {
        label: "Album Sales (in millions)",
        data: [2.5, 1.8, 3.2, 2.9],
        backgroundColor: ["#ff0000", "#ff1a1a", "#ff3333", "#ff4d4d"],
        borderRadius: 8,
      },
    ],
  };

  /* piechart */
  const pieChartData = {
    labels: ["Spotify", "Apple Music", "YouTube Music", "Tidal"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#ff0000", "#ff1a1a", "#ff3333", "#ff4d4d"],
      },
    ],
  };

  /* line chart */
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Streams (in millions)",
        data: [1.2, 1.5, 1.8, 2.0, 2.3, 2.5, 2.7, 2.8, 2.9, 3.0, 3.2, 3.5],
        borderColor: "#ff0000",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#ff0000",
        fill: true,
      },
    ],
  };

  /* handle logout */
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  /* menu */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* dark/light mode */
  const toggleTheme = () => {
    document.body.classList.add("fade-out");
    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
      document.body.classList.toggle("light-mode");
      document.body.classList.remove("fade-out");
      document.body.classList.add("fade-in");
      setTimeout(() => {
        document.body.classList.remove("fade-in");
      }, 300);
    }, 300);
  };

  /* real-time updates */
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentActivity((prev) => [
        `Listened to ${trendingAlbums[Math.floor(Math.random() * trendingAlbums.length)].name}`,
        ...prev.slice(0, 2),
      ]);
      barChartData.datasets[0].data = barChartData.datasets[0].data.map(() =>
        Math.floor(Math.random() * 5)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* sidebar */}
      <div className={`sidebar ${isMenuOpen ? "open" : ""}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <h2>OPIUM</h2>
          <div className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? "🌙" : "☀️"}
          </div>
        </div>
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => alert("Profile clicked!")}>
            <FaUser className="menu-icon" />
            <span>Profile</span>
          </div>
          <div className="menu-item" onClick={() => alert("Settings clicked!")}>
            <FaCog className="menu-icon" />
            <span>Settings</span>
          </div>
          <div className="menu-item" onClick={() => alert("Messages clicked!")}>
            <FaEnvelope className="menu-icon" />
            <span>Messages</span>
          </div>
          <div className="menu-item" onClick={handleLogout}>
            <FaSignOutAlt className="menu-icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="main-content">
        {/* header */}
        <div className="dashboard-header">
          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
          <h1 className="dashboard-title">WELCOME TO OPIUM</h1>
        </div>

        {/* greetings */}
        <div className="dashboard-box profile-box">
          <h2>👤 Welcome, {username}</h2>
        </div>

        <p className="greeting">Stay updated with the latest music & trends.</p>

        {/* charts */}
        <div className="dashboard-grid">
          <div className="dashboard-box chart-section">
            <h2>📈 Album Sales</h2>
            <div className="chart-wrapper">
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="dashboard-box chart-section">
            <h2>🎧 Listener Distribution</h2>
            <div className="chart-wrapper">
              <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="dashboard-box chart-section">
            <h2>📊 Monthly Streams</h2>
            <div className="chart-wrapper">
              <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* recent activity, upcoming events, trending albums */}
        <div className="dashboard-grid">
          <div className="dashboard-box activity-section">
            <h2>📜 Recent Activity</h2>
            <ul className="news-list">
              {recentActivity.map((activity, index) => (
                <li key={index}>✅ {activity}</li>
              ))}
            </ul>
          </div>
          <div className="dashboard-box events-section">
            <h2>📅 Upcoming Events</h2>
            <ul className="news-list">
              {upcomingEvents.map((event, index) => (
                <li key={index}>🎤 {event}</li>
              ))}
            </ul>
          </div>
          <div className="dashboard-box trending-section">
            <h2>🔥 Trending Albums</h2>
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <ul className="trending-list">
              {filteredAlbums.map((album, index) => (
                <li key={index}>
                  <span className="album-name">{album.name}</span>
                  <span className="album-artist">{album.artist}</span>
                  <span className="album-streams">{album.streams} streams</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
