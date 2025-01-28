import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import ContactsIcon from "@mui/icons-material/Contacts";
import DialpadIcon from "@mui/icons-material/Dialpad";

const NavigationBar = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: "1px solid #ddd",
        bgcolor: "#eef3f7",
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      >
        <BottomNavigationAction label="Recents" icon={<HistoryIcon />} />
        <BottomNavigationAction label="Contacts" icon={<ContactsIcon />} />
        <BottomNavigationAction label="Keypad" icon={<DialpadIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default NavigationBar;
