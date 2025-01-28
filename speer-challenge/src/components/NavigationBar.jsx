import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./styles/navigationbar.module.css";


const NavigationBar = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className={styles.navbar}
      sx={{
        "& .MuiBottomNavigationAction-root.Mui-selected": {
          color: "#2AC420",
        },
      }}
    >
      <BottomNavigationAction
        icon={<CallIcon className={styles.icon} />}
        value={0}
      />
      <BottomNavigationAction
        icon={<ChatBubbleIcon className={styles.icon} />}
        value={1}
      />
      <BottomNavigationAction
        icon={<PersonIcon className={styles.icon} />}
        value={2}
      />
    </BottomNavigation>
  );
};

export default NavigationBar;
