import React, { useState, useEffect } from "react";
import { Tab, Tabs, CircularProgress, Box, Typography } from "@mui/material";
import CallIcon from '@mui/icons-material/Call';
import ArchiveIcon from "@mui/icons-material/Archive";
import ActivityFeedTab from "./components/ActivityFeedTab";
import ArchivedCallsTab from "./components/ArchivedCallsTab";
import Header from "./components/Header";
import NavigationBar from "./components/NavigationBar";
import styles from "./styles/app.module.css";


const BASE_URL = "https://aircall-api.onrender.com";

const App = () => {
  const [tab, setTab] = useState(0);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch calls
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch(`${BASE_URL}/activities`);
        if (!response.ok) throw new Error("Failed to fetch calls");
        const data = await response.json();
        setCalls(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  // Toggle archive state of Call
  const handleArchiveToggle = async (id) => {
    try {
      const callToToggle = calls.find((call) => call.id === id);
      if (!callToToggle) return;

      const updatedCall = { is_archived: !callToToggle.is_archived };
      const response = await fetch(`${BASE_URL}/activities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCall),
      });

      if (!response.ok) throw new Error("Failed to update call");

      setCalls((prevCalls) =>
        prevCalls.map((call) =>
          call.id === id ? { ...call, is_archived: !call.is_archived } : call
        )
      );
    } catch (error) {
      console.error("Error updating call:", error);
    }
  };

  // Archive all
  const archiveAll = async () => {
    try {
      const updatedCalls = await Promise.all(
        calls.map((call) =>
          fetch(`${BASE_URL}/activities/${call.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_archived: true }),
          }).then((res) => (res.ok ? { ...call, is_archived: true } : call))
        )
      );
      setCalls(updatedCalls);
    } catch (error) {
      console.error("Error archiving all calls:", error);
    }
  };

  // Unarchive all
  const unarchiveAll = async () => {
    try {
      const updatedCalls = await Promise.all(
        calls.map((call) =>
          fetch(`${BASE_URL}/activities/${call.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_archived: false }),
          }).then((res) => (res.ok ? { ...call, is_archived: false } : call))
        )
      );
      setCalls(updatedCalls);
    } catch (error) {
      console.error("Error unarchiving all calls:", error);
    }
  };

  const renderLoading = () => (
    <Box className={styles.loadingContainer}>
      <CircularProgress />
    </Box>
  );

  const renderError = () => (
    <Box className={styles.errorContainer}>
      <Typography variant="body1" color="error">
        Error: {error}
      </Typography>
    </Box>
  );

  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.callLog}>
        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : (
          <>
          <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              sx={{
                "& .MuiTab-root.Mui-selected": {
                  color: "#34af2b",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#34af2b",
                },
              }}
            >
              <Tab
                label="Activity Feed"
                icon={<CallIcon />}
                iconPosition="start"
              />
              <Tab
                label="Archived Calls"
                icon={<ArchiveIcon />}
                iconPosition="start"
              />
            </Tabs>

            {tab === 0 && (
              <ActivityFeedTab
                calls={calls.filter((call) => !call.is_archived)}
                onArchiveToggle={handleArchiveToggle}
                onArchiveAll={archiveAll}
                className={styles.tab}
              />
            )}

            {tab === 1 && (
              <ArchivedCallsTab
                calls={calls.filter((call) => call.is_archived)}
                onArchiveToggle={handleArchiveToggle}
                onUnarchiveAll={unarchiveAll}
                className={styles.tab}
              />
            )}
          </>
        )}
      </div>
      <NavigationBar />
    </div>
  );
};

export default App;
