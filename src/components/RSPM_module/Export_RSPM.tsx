import React from "react";
import styles from "./export_RSPM.module.css";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import { FaClipboardList, FaChartBar, FaUsers, FaThumbsUp } from "react-icons/fa";

const Export_RSPM: React.FC = () => {
  const summary = [
    {
      title: "จำนวนคำร้องขอทั้งหมด",
      value: 13,
      color: "linear-gradient(135deg, #2196f3, #1e88e5)",
      icon: <FaClipboardList />,
      change: "+8.3%",
    },
    {
      title: "จำนวนคำร้องขอกำลังพิจารณา",
      value: 4,
      color: "linear-gradient(135deg, #ff9800, #fb8c00)",
      icon: <FaChartBar />,
      change: "+33.3%",
    },
    {
      title: "จำนวนคำร้องขอกำลังดำเนินการ",
      value: 4,
      color: "linear-gradient(135deg, #f44336, #e53935)",
      icon: <FaUsers />,
      change: "+33.3%",
    },
    {
      title: "จำนวนคำร้องขอดำเนินการสำเร็จ",
      value: 5,
      color: "linear-gradient(135deg, #4caf50, #43a047)",
      icon: <FaThumbsUp />,
      change: "+25.0%",
    },
  ];

  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.mainContainer}>
        <Sidebar />

        <div className={styles.container}>
          <h2 className={styles.formTitle}>รายงานสรุปผลการดำเนินงานระบบ RSPM</h2>

          {/* 🔹 ส่วนหัวข้อมูลการติดตาม */}
          <div className={styles.trackHeader}>
            <div className={styles.trackLeft}>
              <h3 className={styles.trackTitle}>
                ข้อมูลการติดตามการแก้ไขปัญหาร้องเรียนร้องขอ
              </h3>
            </div>

            <div className={styles.trackRight}>
              <span className={styles.timeNow}>
                {new Date().toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                น. —{" "}
                {new Date().toLocaleDateString("th-TH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>

              <select className={styles.trackDropdown}>
                <option>ทั้งหมด</option>
                <option>อยู่ระหว่างพิจารณา</option>
                <option>กำลังดำเนินการ</option>
                <option>ดำเนินการสำเร็จ</option>
              </select>

              <select className={styles.trackDropdownYear}>
                <option>2568</option>
                <option>2567</option>
                <option>2566</option>
              </select>
            </div>
          </div>

          {/* ✅ ส่วนสรุปจำนวนเคส */}
          <div className={styles.summarySection}>
            <div className={styles.summaryContainer}>
              {summary.map((item, i) => (
                <div
                  key={i}
                  className={styles.summaryCard}
                  style={{ background: item.color }}
                >
                  <div className={styles.summaryHeader}>
                    <h4>{item.title}</h4>
                  </div>
                  <p className={styles.value}>{item.value}</p>
                  <div className={styles.summaryFooter}>
                    <span className={styles.change}>{item.change}</span>
                    <span className={styles.icon}>{item.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



      </div>
{/* 🔹 ส่วนเลือกรูปแบบการทำรายงาน */} 
 <h3 className={styles.reportTitle}>เลือกรูปแบบการทำรายงาน</h3>
<div className={styles.reportContainer}>


  {/* 🔹 แถวที่ 1 */}
  <div className={styles.reportRow}>
    <label className={styles.labelInline}>รูปแบบรายงานผล</label>
    <input
      type="text"
      className={styles.reportInput}
      value="รายสรุปข้อมูลการดำเนินการช่วยเหลือ"
      readOnly
    />

    <label className={styles.labelInline}>เลือกหน่วยงานที่รับผิดชอบ</label>
    <input
      type="text"
      className={styles.reportInput}
      value="รายงานทุกหน่วยงาน"
      readOnly
    />
  </div>
  
    <div className={styles.reportrows}>
      <label>ช่วงเวลาเริ่มต้น</label>
      <label>ช่วงเวลาสิ้นสุด</label>
    </div>

<div className={styles.reportRow}>
  <div className={styles.reportGroupInline}>
    <label>เลือกช่วงเวลา</label>
    <input
      type="date"
      defaultValue="2025-10-01"
      className={styles.dateInput}
    />
    <input
      type="date"
      defaultValue="2025-10-30"
      className={styles.dateInputs}
    />
    <button className={styles.reportBtn}>แสดงรายงาน</button>
  </div>
  </div>

  <div className={styles.reportRow}>
  <div className={styles.reportGroupInlines}>
    <label>เลือกเดือน</label>
    <select className={styles.monthSelect}>
      <option>เลือกทุกเดือน</option>
      <option>มกราคม</option>
      <option>กุมภาพันธ์</option>
      <option>มีนาคม</option>
      <option>เมษายน</option>
      <option>พฤษภาคม</option>
      <option>มิถุนายน</option>
      <option>กรกฎาคม</option>
      <option>สิงหาคม</option>
      <option>กันยายน</option>
      <option>ตุลาคม</option>
      <option>พฤศจิกายน</option>
      <option>ธันวาคม</option>
    </select>
    <input
      type="number"
      value="2025"
      className={styles.yearInput}
      readOnly
    />
    <button className={styles.reportsBtn}>แสดงรายงาน</button>
  </div>
</div>
</div>

      <Footer />
    </div>
  );
};

export default Export_RSPM;