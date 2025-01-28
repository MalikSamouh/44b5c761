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
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import Call from "./Call";

const groupAndSortCallsByDate = (calls) => {
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

  Object.values(grouped).forEach((callsForDate) => {
    callsForDate.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  });

  const sortedDateKeys = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return sortedDateKeys.map((dateStr) => [dateStr, grouped[dateStr]]);
};

const ArchivedCallsTab = ({ calls, onArchiveToggle, onUnarchiveAll }) => {
  const [expanded, setExpanded] = React.useState(true);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleUnarchiveClick = async () => {
    setExpanded(false);
    await onUnarchiveAll();
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const sortedEntries = groupAndSortCallsByDate(calls);
  const isEmpty = calls.length === 0;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 8 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UnarchiveIcon />}
          onClick={handleUnarchiveClick}
          disabled={isEmpty}
          sx={{ borderRadius: 3, textTransform: "none", fontSize: "0.875rem" }}
        >
          Unarchive All
        </Button>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {isEmpty ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="body1" color="text.secondary">
              No archived calls.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {sortedEntries.map(([date, callsForDate]) => (
              <Box key={date}>
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
          All calls have been unarchived.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ArchivedCallsTab;
