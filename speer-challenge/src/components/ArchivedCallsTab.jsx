import React from "react";
import { IconButton, Collapse } from "@mui/material";
import Call from "./Call";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles/activityfeedtab.module.css";

const ActivityFeedTab = ({ calls, onArchiveToggle, onUnarchiveAll }) => {
  const [expanded, setExpanded] = React.useState(true);

  const handleUnArchiveClick = (event) => {
    setExpanded(false);

    setTimeout(() => {
      onUnarchiveAll();
    }, 250);
  };
  return (
    <div className={styles.activityFeedTab}>
      {/* Header Search & Archive All Button */}
      <div className={styles.header}>
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="archive all" onClick={handleUnArchiveClick}>
          <UnarchiveIcon />
        </IconButton>
      </div>

      {/* Calls */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={styles.callContainer}>
          {calls.map((call) => (
            <Call key={call.id} call={call} onArchiveToggle={onArchiveToggle} />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default ActivityFeedTab;
