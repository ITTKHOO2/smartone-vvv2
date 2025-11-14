import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/footer.module.css";

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles["footer-columns"]}>
      <div className={styles.column}>
        <h4>เกี่ยวกับเรา</h4>
        <p>ข้อมูลเกี่ยวกับเทศบาลหรือองค์กร</p>
      </div>

      <div className={styles.column}>
        <h4>ติดต่อ</h4>
        <p>โทร: 012-345-6789</p>
        <p>อีเมล: info@example.com</p>
      </div>

      <div className={styles.column}>
        <h4>ลิงก์ที่เกี่ยวข้อง</h4>
        <ul>
          <li>
            <Link to="/" className={styles["footer-link"]}>
              หน้าแรก
            </Link>
          </li>
          <li>
            <Link to="/rspm" className={styles["footer-link"]}>
              RSPM
            </Link>
          </li>
          <li>
            <Link to="/ipms" className={styles["footer-link"]}>
              IPMS
            </Link>
          </li>
          <li>
            <Link to="/swts" className={styles["footer-link"]}>
              SWTS
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.column}>
        <h4>ติดตามเรา</h4>
        <p>Facebook | Twitter | Instagram</p>
      </div>
    </div>

    <p className={styles["footer-copy"]}>© 2025 เทศบาลตำบลอัจฉริยะ</p>
  </footer>
);

export default Footer;
