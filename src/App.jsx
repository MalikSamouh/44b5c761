import React, { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  CircularProgress,
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import ArchiveIcon from "@mui/icons-material/Archive";
import ActivityFeedTab from "./components/ActivityFeedTab";
import ArchivedCallsTab from "./components/ArchivedCallsTab";
import NavigationBar from "./components/NavigationBar";
import Logo from "./components/Logo";

const BASE_URL = "https://aircall-api.onrender.com";

const App = () => {
  const [tab, setTab] = useState(0);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch calls on mount
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch(`${BASE_URL}/activities`);
        if (!response.ok) throw new Error("Failed to fetch calls");
        const data = await response.json();
        setCalls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, []);

  // Toggle archive state of a single call
  const handleArchiveToggle = async (id) => {
    try {
      const callToToggle = calls.find((c) => c.id === id);
      if (!callToToggle) return;

      const updatedCall = { is_archived: !callToToggle.is_archived };
      const response = await fetch(`${BASE_URL}/activities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCall),
      });
      if (!response.ok) throw new Error("Failed to update call");

      setCalls((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, is_archived: !c.is_archived } : c
        )
      );
    } catch (err) {
      console.error("Error updating call:", err);
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
    } catch (err) {
      console.error("Error archiving all calls:", err);
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
    } catch (err) {
      console.error("Error unarchiving all calls:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    // Page-level background
    <Box sx={{ bgcolor: "#f5f8fa", minHeight: "100vh" }}>
      {/* Header with a soft background color */}
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: "#eef3f7", color: "inherit" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ width: 180 }}>
            <Logo />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container maxWidth="md" sx={{ mt: 2, pb: 12 }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Activity Feed" icon={<CallIcon />} iconPosition="start" />
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
          />
        )}
        {tab === 1 && (
          <ArchivedCallsTab
            calls={calls.filter((call) => call.is_archived)}
            onArchiveToggle={handleArchiveToggle}
            onUnarchiveAll={unarchiveAll}
          />
        )}
      </Container>

      {/* Bottom Navigation */}
      <NavigationBar />
    </Box>
  );
};

export default App;
