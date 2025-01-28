import React from "react";
import {
  Button,
  Collapse,
  Paper,
  Box,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import Call from "./Call";

/**
 * Group calls by date, then sort by newest date first.
 * Also sort calls within each date from newest to oldest.
 */
const groupAndSortCallsByDate = (calls) => {
  // 1) Group calls by date string
  const grouped = calls.reduce((acc, call) => {
    const dateObj = new Date(call.created_at);
    const dateStr = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(call);
    return acc;
  }, {});

  // 2) Sort calls in each group from newest to oldest
  Object.values(grouped).forEach((callsForDate) => {
    callsForDate.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  });

  // 3) Sort the date groups themselves from newest to oldest
  const sortedDateKeys = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  // 4) Return an array of [dateStr, callsArray], newest date first
  return sortedDateKeys.map((dateStr) => [dateStr, grouped[dateStr]]);
};

const ActivityFeedTab = ({ calls, onArchiveToggle, onArchiveAll }) => {
  const [expanded, setExpanded] = React.useState(true);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleArchiveClick = async () => {
    setExpanded(false);
    await onArchiveAll();
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const sortedEntries = groupAndSortCallsByDate(calls);
  const isEmpty = calls.length === 0;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 8 }}>
      {/* "Archive All" button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArchiveIcon />}
          onClick={handleArchiveClick}
          disabled={isEmpty}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontSize: "0.875rem",
          }}
        >
          Archive All
        </Button>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {isEmpty ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="body1" color="text.secondary">
              No calls to display.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {sortedEntries.map(([date, callsForDate]) => (
              <Box key={date}>
                {/* Centered date heading with dividers */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Divider sx={{ flex: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      mx: 2,
                      fontWeight: 500,
                      color: "text.secondary",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {date}
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {callsForDate.map((call) => (
                    <Call
                      key={call.id}
                      call={call}
                      onArchiveToggle={onArchiveToggle}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Collapse>

      {/* Snackbar to confirm success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          All calls have been archived.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ActivityFeedTab;
