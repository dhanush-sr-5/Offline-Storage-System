import { useState, useEffect } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [outputLoading, setOutputLoading] = useState(false);
  const [outputError, setOutputError] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [databaseStatus, setDatabaseStatus] = useState("Checking...");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/records");
      setRecords(response.data.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Unable to load records. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await API.get("/records");
        setRecords(response.data.data);
      } catch (err) {
        console.error("Automatic refresh failed:", err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        const response = await fetch("/api/health");
        if (!response.ok) {
          throw new Error("Health check failed");
        }
        const healthData = await response.json();
        setBackendStatus("Connected");
        setDatabaseStatus(
          healthData.database === "Connected" ? "Connected" : "Disconnected"
        );
      } catch (err) {
        console.error("System health check failed:", err);
        setBackendStatus("Disconnected");
        setDatabaseStatus("Disconnected");
      }
    };

    checkSystemHealth();
    const healthIntervalId = setInterval(checkSystemHealth, 10000);
    return () => clearInterval(healthIntervalId);
  }, []);

  const openRecord = async (record) => {
    setSelectedRecord(record);
    setSelectedOutput(null);
    setOutputError("");
    setOutputLoading(true);

    try {
      const response = await API.get(`/records/${record._id}/output`);
      setSelectedOutput(response.data);
    } catch (err) {
      console.error("Error fetching output:", err);
      setOutputError("Unable to load processed output.");
    } finally {
      setOutputLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record and its original file?"
    );
    if (!confirmed) return;

    try {
      await API.delete(`/records/${id}`);
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== id)
      );

      if (selectedRecord?._id === id) {
        setSelectedRecord(null);
        setSelectedOutput(null);
      }
      alert("Record deleted successfully!");
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Unable to delete record. Please try again.");
    }
  };

  const totalDocuments = records.filter(
    (record) => record.type === "document"
  ).length;
  const totalAudio = records.filter(
    (record) => record.type === "audio"
  ).length;
  const completedRecords = records.filter(
    (record) => record.status === "completed"
  ).length;

  const filteredRecords = records.filter((record) => {
    const matchesSearch = (record.originalFilename || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || record.type === typeFilter;
    const recordDate = new Date(record.processedAt).toLocaleDateString("en-CA");
    const matchesFromDate = !fromDate || recordDate >= fromDate;
    const matchesToDate = !toDate || recordDate <= toDate;

    return matchesSearch && matchesType && matchesFromDate && matchesToDate;
  });

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app-container" id="dashboard">
      <aside className="sidebar">
        <h2>Offline Storage</h2>
        <nav>
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#history">Processing History</a>
          <a href="#documents">Documents</a>
          <a href="#audio">Audio Records</a>
        </nav>
        <div className="sidebar-footer">
          Offline Storage System
          <span>Local Network</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your Offline Storage System</p>
          </div>
          <div className="connection-status">
            <div>
              <span className={`status-dot ${backendStatus === "Connected" ? "online" : "offline"}`} />
              Backend: {backendStatus}
            </div>
            <div>
              <span className={`status-dot ${databaseStatus === "Connected" ? "online" : "offline"}`} />
              MongoDB: {databaseStatus}
            </div>
          </div>
        </header>

        <section className="summary-cards">
          <div className="summary-card">
            <div className="card-icon document-icon">DOC</div>
            <div><p>Total Documents</p><h2>{totalDocuments}</h2></div>
          </div>
          <div className="summary-card">
            <div className="card-icon audio-icon">AUD</div>
            <div><p>Audio Records</p><h2>{totalAudio}</h2></div>
          </div>
          <div className="summary-card">
            <div className="card-icon completed-icon">OK</div>
            <div><p>Completed</p><h2>{completedRecords}</h2></div>
          </div>
          <div className="summary-card">
            <div className="card-icon total-icon">ALL</div>
            <div><p>Total Records</p><h2>{records.length}</h2></div>
          </div>
        </section>

        <section className="history-section" id="history">
          <div className="history-header">
            <div>
              <h2>Processing History</h2>
              <p>View your stored documents and audio records</p>
            </div>
            <input
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="refresh-button"
              onClick={fetchRecords}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="filter-controls">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by record type"
            >
              <option value="all">All types</option>
              <option value="document">Documents</option>
              <option value="audio">Audio</option>
            </select>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              title="From date"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              title="To date"
            />
          </div>

          {loading && <p>Loading records...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Type</th>
                    <th>Processed Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record._id}>
                      <td>{record.originalFilename}</td>
                      <td>{record.type === "document" ? "Document" : "Audio"}</td>
                      <td>{formatDate(record.processedAt)}</td>
                      <td><span className="completed-badge">{record.status}</span></td>
                      <td>
                        <button className="view-button" onClick={() => openRecord(record)}>
                          View
                        </button>
                        <button className="delete-button" onClick={() => deleteRecord(record._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-message">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedRecord && (
          <div className="modal-overlay">
            <div className="record-modal">
              <div className="modal-header">
                <div>
                  <h2>Record Details</h2>
                  <p>{selectedRecord.originalFilename}</p>
                </div>
                <button
                  className="close-button"
                  onClick={() => {
                    setSelectedRecord(null);
                    setSelectedOutput(null);
                  }}
                >
                  ×
                </button>
              </div>

              <div className="record-info">
                <p><strong>Type:</strong> {selectedRecord.type}</p>
                <p><strong>Processing ID:</strong> {selectedRecord.processingId}</p>
                <p><strong>Status:</strong> {selectedRecord.status}</p>
                <p><strong>Format:</strong> {selectedRecord.outputFormat}</p>
              </div>

              <div className="download-section">
                <a
                  href={`/api/v1/records/${selectedRecord._id}/input`}
                  className="download-button"
                >
                  Download Original File
                </a>
              </div>

              <div className="output-section">
                <h3>Processed Output</h3>
                {outputLoading ? (
                  <p>Loading processed output...</p>
                ) : outputError ? (
                  <p className="error-message">{outputError}</p>
                ) : (
                  <pre>
                    {JSON.stringify(
                      selectedOutput?.outputData ?? selectedRecord.outputData ?? selectedOutput,
                      null,
                      2
                    )}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
