import React, { useState } from "react";
import {
  Typography,
  Avatar,
  IconButton,
  Collapse,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import VoicemailIcon from "@mui/icons-material/Voicemail";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const Call = ({ call, onArchiveToggle }) => {
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [expandedCard, setExpandedCard] = useState(true);

  const iconSx = { fontSize: 20 };
  const timeOnly = new Date(call.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleExpandDetailsClick = () => {
    setExpandedDetails((prev) => !prev);
  };
  const handleArchiveClick = (event) => {
    event.stopPropagation();
    setExpandedCard(false);
  };

  const getCallTypeIcon = () => {
    if (call.direction === "inbound") {
      if (call.call_type === "answered") {
        return <CallReceivedIcon sx={{ ...iconSx, color: "green" }} />;
      }
      if (call.call_type === "missed") {
        return <CallReceivedIcon sx={{ ...iconSx, color: "red" }} />;
      }
      return <VoicemailIcon sx={iconSx} />;
    } else {
      if (call.call_type === "answered") {
        return <CallMadeIcon sx={{ ...iconSx, color: "green" }} />;
      }
      if (call.call_type === "missed") {
        return <CallMadeIcon sx={{ ...iconSx, color: "red" }} />;
      }
      return <VoicemailIcon sx={iconSx} />;
    }
  };

  return (
    <Collapse
      in={expandedCard}
      timeout="auto"
      unmountOnExit
      onExited={() => onArchiveToggle(call.id)}
    >
      <Card
        variant="outlined"
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          mb: 0.5,
          "& .MuiCardHeader-root": { py: 1, px: 2 },
          "& .MuiCardContent-root": { py: 1, px: 2 },
          "& .MuiCardActions-root": { py: 1, px: 2 },
        }}
        onClick={handleExpandDetailsClick}
      >
        <CardHeader
          avatar={<Avatar />}
          title={
            call.name ||
            (call.direction === "outbound" ? call.to : call.from) ||
            "Unknown"
          }
          subheader={timeOnly}
          action={getCallTypeIcon()}
        />

        <Collapse in={expandedDetails} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              <strong>
                {call.call_type === "missed"
                  ? "Missed call"
                  : `${call.call_type[0].toUpperCase()}${call.call_type.slice(
                      1
                    )} ${
                      call.direction === "outbound" ? "outgoing" : "incoming"
                    }`}
              </strong>
              {`, ${Math.floor(call.duration / 60)} min ${
                call.duration % 60
              } sec`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Aircall Number:</strong> {call.via || "N/A"}
            </Typography>
          </CardContent>

          <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
            <IconButton
              onClick={(e) => e.stopPropagation()}
              sx={{
                bgcolor: "success.main",
                color: "white",
                "&:hover": { bgcolor: "success.dark" },
              }}
            >
              <CallIcon sx={iconSx} />
            </IconButton>
            <IconButton
              onClick={(e) => e.stopPropagation()}
              sx={{
                bgcolor: "info.main",
                color: "white",
                "&:hover": { bgcolor: "info.dark" },
              }}
            >
              <ChatBubbleIcon sx={iconSx} />
            </IconButton>
            <IconButton
              onClick={handleArchiveClick}
              sx={{
                bgcolor: "grey.50",
                "&:hover": { bgcolor: "grey.300" },
              }}
            >
              {call.is_archived ? (
                <UnarchiveIcon sx={iconSx} />
              ) : (
                <ArchiveIcon sx={iconSx} />
              )}
            </IconButton>
          </CardActions>
        </Collapse>
      </Card>
    </Collapse>
  );
};

export default Call;
