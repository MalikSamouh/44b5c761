import React from "react";
import { IconButton, Collapse } from "@mui/material";
import Call from "./Call";
import ArchiveIcon from "@mui/icons-material/Archive";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles/activityfeedtab.module.css";

const ActivityFeedTab = ({ calls, onArchiveToggle, onArchiveAll }) => {
  const [expanded, setExpanded] = React.useState(true);

  const handleArchiveClick = (event) => {
    setExpanded(false);

    setTimeout(() => {
      onArchiveAll();
    }, 250);
  };

  return (
    <div className={styles.activityFeedTab}>
      {/* Header*/}
      <div className={styles.header}>
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="archive all" onClick={handleArchiveClick}>
          <ArchiveIcon />
        </IconButton>
      </div>

      {/* Calls */}
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        <div  className={styles.callContainer}>
        {calls.map((call) => (
          <Call key={call.id} call={call} onArchiveToggle={onArchiveToggle} />
        ))}

        </div>
        
      </Collapse>
    </div>
  );
};

export default ActivityFeedTab;
