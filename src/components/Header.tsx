import React, { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import styles from "../styles/Header.module.css";
import { useNavigate } from "react-router-dom"; // ✅ ใช้ react-router-dom แทน next/router
import logo from "../assets/images/logo.png";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img
          src={logo} // ✅ ใช้ตัวแปรแทน path
          alt="SMART ONE Logo"
          className={styles.logo}
        />
      </div>

      {user ? (
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user}</span>
          <div className={styles.userIcon}>
            <FaRegUser />
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div
          className={styles.userIcon}
          onClick={() => navigate("/index")}
          style={{ cursor: "pointer" }}
        >
          <FaRegUser />
        </div>
      )}
    </header>
  );
};

export default Header;
