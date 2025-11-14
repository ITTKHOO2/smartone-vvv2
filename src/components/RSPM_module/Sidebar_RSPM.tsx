import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./sidebar_RSPM.module.css";
import { Link } from "react-router-dom";
import Hamburger from "hamburger-react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faClipboardList,
  faDatabase,
  faCogs,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faClipboardList, faDatabase, faCogs, faSignOutAlt);

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(propIsOpen || false);

  // ✅ ตรวจขนาดหน้าจอ
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ จัดการ Mouse Move สำหรับ Desktop
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (window.innerWidth > 768) {
        const mouseX = e.clientX;
        if (!isOpen && mouseX <= 30 && !sidebarRef.current?.contains(e.target as Node)) {
          const timeout = setTimeout(() => {
            if (typeof propSetIsOpen === "function") propSetIsOpen(true);
            else setIsOpen(true);
          }, 100);
          return () => clearTimeout(timeout);
        } else if (isOpen && mouseX > 300) {
          const timeout = setTimeout(() => {
            if (typeof propSetIsOpen === "function") propSetIsOpen(false);
            else setIsOpen(false);
          }, 100);
          return () => clearTimeout(timeout);
        }
      }
    },
    [isOpen, propSetIsOpen]
  );

  useEffect(() => {
    if (window.innerWidth > 768) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [handleMouseMove]);

  // ✅ ปุ่ม Hamburger
  const handleHamburgerClick = () => {
    if (isMobile) {
      if (typeof propSetIsOpen === "function") propSetIsOpen((prev) => !prev);
      else setIsOpen((prev) => !prev);
    }
  };

  // ✅ ปิด Sidebar เมื่อคลิกนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        !target.closest("[data-hamburger='true']")
      ) {
        if (typeof propSetIsOpen === "function") propSetIsOpen(false);
        else setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [propSetIsOpen]);

  // ✅ sync state จาก props
  useEffect(() => {
    if (propIsOpen !== undefined && propIsOpen !== isOpen) setIsOpen(propIsOpen);
    if (typeof propSetIsOpen === "function") propSetIsOpen(isOpen);
  }, [isOpen, propIsOpen, propSetIsOpen]);

  return (
    <>
      {isMobile && (
        <div data-hamburger="true" className={styles.hamburger}>
          <Hamburger toggled={isOpen} toggle={handleHamburgerClick} size={24} color="#fff" />
        </div>
      )}

      <div
        ref={sidebarRef}
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.hide}`}
      >
        <div className={styles.sidebarSection}>
          <div className={styles.sidebarTitle}>
            <FontAwesomeIcon icon="clipboard-list" style={{ marginRight: "8px" }} /> ข้อมูลบริหารจัดการร้องเรียน
          </div>
          <Link to="/main-menu">เมนูหลัก</Link>
          <Link to="/rspm">Dashboard</Link>
          <Link to="/requests">ข้อมูลการร้องขอความช่วยเหลือ</Link>
          <Link to="/tracking">ติดตามการช่วยเหลือ</Link>
          <Link to="/reports">รายงานการช่วยเหลือ</Link>
          <Link to="/export">การส่งออกข้อมูล</Link>
          <Link to="/city-data">City Data</Link>
          <Link to="/api">การเชื่อมต่อแบบ API</Link>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sidebarTitle}>
            <FontAwesomeIcon icon="database" style={{ marginRight: "8px" }} /> ข้อมูลพื้นฐาน
          </div>
          <Link to="/population">ข้อมูลประชาชน</Link>
          <Link to="/household">ข้อมูลทะเบียนบ้าน</Link>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sidebarTitle}>
            <FontAwesomeIcon icon="cogs" style={{ marginRight: "8px" }} /> ข้อมูลระบบ
          </div>
          <Link to="/agencies">ข้อมูลหน่วยงาน</Link>
          <Link to="/internal-agencies">ข้อมูลหน่วยงานภายใน</Link>
          <Link to="/areas">ข้อมูลพื้นที่</Link>
          <Link to="/service-types">ข้อมูลประเภทงานบริการ</Link>
          <Link to="/work-levels">ข้อมูลระดับชั้นการทำงาน</Link>
          <Link to="/access-rights">ข้อมูลสิทธิ์การเข้าถึงระบบ</Link>
          <Link to="/system-usage">ข้อมูลการใช้งานระบบ</Link>
        </div>

        <div className={styles.sidebarSection}>
          <Link to="/logout">
            <FontAwesomeIcon icon="sign-out-alt" style={{ marginRight: "8px" }} /> ออกจากระบบ
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
