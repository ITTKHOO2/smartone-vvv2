import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/main-menu.module.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  FaTachometerAlt,
  FaEnvelopeOpenText,
  FaTools,
  FaClipboardCheck,
  FaUserShield,
} from "react-icons/fa";
import bannerLogo from "../assets/images/banner-logo.webp";

// ✅ MainMenu Component
const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Header />

        <div className={styles.banner}>
          <img
            src={bannerLogo}
            alt="Smart City Banner Logo"
            className={styles.bannerLogo}
          />
          <div className={styles.bannerText}>
            <h1>ระบบบริหารจัดการเมืองอัจฉริยะ</h1>
            <h2 className={styles.bannerSubtitle}>
              Smart City Management System
            </h2>
          </div>
        </div>


        <div className={styles.content}>
          <div className={styles["card-container"]}>
            {/* Dashboard */}
            <div className={styles["card-row"]}>
              <div
                className={`${styles.card} ${styles.dashbord}`}
                onClick={() => navigate("/admin")}
              >
                <FaTachometerAlt className={styles["card-icon"]} />
                <h2>ศูนย์รวมวิเคราะห์ข้อมูลเพื่อการตรวจสอบและตัดสินใจ</h2>
                <h3>DASHBOARD</h3>
              </div>
              <div className={styles["card-caption"]}>
                Data Analytics Hub for Monitoring and Decision
              </div>
            </div>

            {/* RSPM */}
            <div className={styles["card-row"]}>
              <div
                className={`${styles.card} ${styles.rspm}`}
                onClick={() => navigate("/rspm")}
              >
                <FaEnvelopeOpenText className={styles["card-icon"]} />
                <h2>ระบบบริหารจัดการร้องเรียนร้องขอ</h2>
                <h3>RSPM</h3>
              </div>
              <div className={styles["card-caption"]}>
                Request Serving Problem Management
              </div>
            </div>

            {/* IPMS */}
            <div className={styles["card-row"]}>
              <div
                className={`${styles.card} ${styles.ipms}`}
                onClick={() => navigate("/ipms")}
              >
                <FaTools className={styles["card-icon"]} />
                <h2>ระบบบริหารจัดการงานโครงสร้างพื้นฐาน</h2>
                <h3>IPMS</h3>
              </div>
              <div className={styles["card-caption"]}>
                Infrastructure Project Management System
              </div>
            </div>

            {/* SWTS */}
            <div className={styles["card-row"]}>
              <div
                className={`${styles.card} ${styles.swts}`}
                onClick={() => navigate("/swts")}
              >
                <FaClipboardCheck className={styles["card-icon"]} />
                <h2>ระบบติดตามการทำงานอัจฉริยะ</h2>
                <h3>SWTS</h3>
              </div>
              <div className={styles["card-caption"]}>
                Smart Work Tracking System
              </div>
            </div>

            {/* ADMIN */}
            <div className={styles["card-row"]}>
              <div
                className={`${styles.card} ${styles.admin}`}
                onClick={() => navigate("/admin")}
              >
                <FaUserShield className={styles["card-icon"]} />
                <h2>ระบบบริหารจัดการและเครือข่ายผู้ดูแล</h2>
                <h3>ADMIN</h3>
              </div>
              <div className={styles["card-caption"]}>
                Administrative Management & Network
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MainMenu;
