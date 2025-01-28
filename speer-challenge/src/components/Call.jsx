import React from "react";
import { Typography, Avatar, IconButton, Collapse } from "@mui/material";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import VoicemailIcon from "@mui/icons-material/Voicemail";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

import styles from "./styles/call.module.css";

const Call = ({ call, onArchiveToggle }) => {
  const [expandedDetails, setExpandedDetails] = React.useState(false);
  const [expandedCard, setExpandedCard] = React.useState(true);

  const handleExpandDetailsClick = () => {
    setExpandedDetails(!expandedDetails);
  };

  const handleArchiveClick = (event) => {
    event.stopPropagation();
    setExpandedCard(false);

    setTimeout(() => {
      onArchiveToggle(call.id);
    }, 250);
  };

  const getCallTypeIcon = () => {
    if (call.direction === "inbound") {
      if (call.call_type === "answered")
        return <CallReceivedIcon style={{ color: "green", width: "20px" }} />;
      if (call.call_type === "missed")
        return <CallReceivedIcon style={{ color: "red", width: "20px" }} />;
      return <VoicemailIcon style={{ width: "20px", height: "auto" }} />;
    } else {
      if (call.call_type === "answered")
        return <CallMadeIcon style={{ color: "green", width: "20px" }} />;
      if (call.call_type === "missed")
        return <CallMadeIcon style={{ color: "red", width: "20px" }} />;
      return <VoicemailIcon style={{ width: "20px", height: "auto" }} />;
    }
  };

  return (
    <Collapse
      className={styles.callCard}
      in={expandedCard}
      timeout="auto"
      unmountOnExit
      onClick={handleExpandDetailsClick}
    >
      <div className={styles.quickView}>
        <Avatar />

        <div className={styles.quickInfo}>
          <Typography variant="h6">
            {call.name ||
              (call.direction === "outbound" ? call.to : call.from) ||
              "Unknown"}
          </Typography>
          <div className={styles.quickInfoSub}>
            {getCallTypeIcon()}
            <Typography variant="body2" color="textSecondary">
              {new Date(call.created_at).toLocaleString("en-US", {
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </Typography>
          </div>
        </div>
      </div>

      {/* Details */}
      <Collapse in={expandedDetails} timeout="auto" unmountOnExit>
        <Typography variant="body2" color="textSecondary">
          <strong>
            {call.call_type === "missed"
              ? "Missed call"
              : `${call.call_type
                  .charAt(0)
                  .toUpperCase()}${call.call_type.slice(1)} ${
                  call.direction === "outbound" ? "outgoing" : "incoming"
                }`}
          </strong>
          {`, ${Math.floor(call.duration / 60)} min ${call.duration % 60} sec`}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Aircall Number:</strong> {call.via || "N/A"}
        </Typography>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "10px",
          }}
        >
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
            }}
            style={{
              color: "white",
              backgroundColor: "green",
              boxShadow: "0px 0px 7px rgba(0, 0, 0, 0.15)",
            }}
          >
            <CallIcon />
          </IconButton>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
            }}
            style={{
              color: "white",
              backgroundColor: "rgb(24, 96, 230)",
              boxShadow: "0px 0px 7px rgba(0, 0, 0, 0.15)",
            }}
          >
            <ChatBubbleIcon />
          </IconButton>
          <IconButton
            onClick={handleArchiveClick}
            style={{
              backgroundColor: "white",
              boxShadow: "0px 0px 7px rgba(0, 0, 0, 0.15)",
            }}
          >
            {call.is_archived ? <UnarchiveIcon /> : <ArchiveIcon />}
          </IconButton>
        </div>
      </Collapse>
    </Collapse>
  );
};

export default Call;
