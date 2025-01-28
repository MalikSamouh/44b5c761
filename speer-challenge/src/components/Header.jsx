import React from "react";
import Logo from "./Logo";
import styles from "./styles/header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Logo width="180px" height="50px" aria-label="Company Logo" />
    </header>
  );
};

export default Header;
