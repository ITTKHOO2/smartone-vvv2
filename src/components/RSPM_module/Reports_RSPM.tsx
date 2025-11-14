import React, { useState, useEffect, useMemo } from "react";
import styles from "./report_RSPM.module.css";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import avatar from "../../assets/images/avatar.png";
import {
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaThumbsUp,
  FaSearch,
  FaCheck
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup  } from "react-leaflet";
import L from "leaflet";


const Report_RSPM: React.FC = () => {
const [records, setRecords] = useState<any[]>([]);
const [filtered, setFiltered] = useState<any[]>([]);
const [filteredData, setFilteredData] = useState<any | null>(null);
const [selectedImage, setSelectedImage] = useState<string | null>(null); // ✅ เพิ่มบรรทัดนี้

  
  const [filter, setFilter] = useState({
    citizenId: "",
    firstName: "",
    lastName: "",
    status: "ทั้งหมด",
  });

    const [activeStep, setActiveStep] = useState(2); // ✅ ต้องอยู่ตรงนี้! (ภายใน component)

    // ✅ เก็บสถานะปัจจุบันของขั้นตอน
const [currentStatus, setCurrentStatus] = useState("รอดำเนินการ");

// ✅ ฟังก์ชันแปลง step → ชื่อสถานะ
const getStatusLabel = (step: number) => {
  switch (step) {
    case 1:
      return "รับเรื่อง";
    case 2:
      return "กำลังพิจารณา";
    case 3:
      return "กำลังดำเนินงาน";
    case 4:
      return "ดำเนินการสำเร็จ";
    default:
      return "รอดำเนินการ";
  }
};

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tracking_RSPM_data") || "[]");
    setRecords(saved);
    setFiltered(saved);
  }, []);

  // ✅ เก็บผลลัพธ์หลังค้นหา
  
  const handleFilter = () => {
    const allData = JSON.parse(localStorage.getItem("tracking_RSPM_data") || "[]");

    const result = allData.find((item: any) => {
      const matchCitizen =
        filter.citizenId.trim() !== "" &&
        item.citizenId?.toLowerCase() === filter.citizenId.trim().toLowerCase();

      const matchName =
        filter.firstName.trim() !== "" &&
        filter.lastName.trim() !== "" &&
        item.firstName?.toLowerCase() ===
          filter.firstName.trim().toLowerCase() &&
        item.lastName?.toLowerCase() ===
          filter.lastName.trim().toLowerCase();

      return matchCitizen || matchName;
    });

    if (result) {
      setFilteredData(result);
    } else {
      setFilteredData(null);
      alert("❌ ไม่พบข้อมูลผู้ถูกร้องเรียน");
    }
  };

  // ✅ Summary data (เหมือน Dashboard)
  const summary = [
    {
      title: "จำนวนคำร้องทั้งหมด",
      value: 13,
      color: "linear-gradient(135deg, #2196f3, #1e88e5)",
      icon: <FaClipboardList />,
      change: "+8.3%",
    },
    {
      title: "จำนวนคำร้องกำลังพิจารณา",
      value: 4,
      color: "linear-gradient(135deg, #ff9800, #fb8c00)",
      icon: <FaChartBar />,
      change: "+33.3%",
    },
    {
      title: "จำนวนคำร้องกำลังดำเนินการ",
      value: 4,
      color: "linear-gradient(135deg, #f44336, #e53935)",
      icon: <FaUsers />,
      change: "+33.3%",
    },
    {
      title: "จำนวนคำร้องดำเนินการสำเร็จ",
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

          {/* ✅ Section Summary (เหมือน Dashboard) */}
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

          {/* ✅ Filter Section */}
          <div className={styles.filterContainer}>
            <label>หมายเลขบัตรประชาชน</label>
            <input
              value={filter.citizenId}
              onChange={(e) =>
                setFilter({ ...filter, citizenId: e.target.value })
              }
            />
            <label>ชื่อ</label>
            <input
              value={filter.firstName}
              onChange={(e) =>
                setFilter({ ...filter, firstName: e.target.value })
              }
            />
            <label>นามสกุล</label>
            <input
              value={filter.lastName}
              onChange={(e) =>
                setFilter({ ...filter, lastName: e.target.value })
              }
            />
            <button onClick={handleFilter}>แสดงข้อมูล</button>
          </div>

        {/* ✅ ผลลัพธ์ค้นหา (เวอร์ชันแสดงตลอดเวลาแบบ container เปล่า) */}
<div className={styles.resultBox}>
  <div className={styles.grid2}>
    <div className={styles.infoColumn}>
      <div className={styles.rowLine}>
        <label>หมายเลขบัตรประชาชน</label>
        <input
          type="text"
          value={filteredData?.citizenId ?? ""}
          className={styles.inputMedium}
          readOnly
        />
      </div>

      <div className={styles.rowLine}>
        <label>ชื่อ นามสกุล</label>
        <input
          type="text"
          value={filteredData?.firstName ?? ""}
          className={styles.inputSmall}
          readOnly
        />
        <input
          type="text"
          value={filteredData?.lastName ?? ""}
          className={styles.inputSmall}
          readOnly
        />
      </div>

      <div className={styles.rowLine}>
        <label>ที่อยู่</label>
        <textarea
          value={filteredData?.address ?? ""}
          className={styles.textAreaLarge}
          readOnly
        ></textarea>
      </div>

      <div className={styles.rowLine}>
        <label>เบอร์โทรศัพท์</label>
        <input
          type="text"
          value={filteredData?.phone ?? ""}
          className={styles.inputMedium}
          readOnly
        />
      </div>
    </div>

    <div className={styles.avatarBox}>
      <img src={avatar} alt="person" />
    </div>
  </div>
</div>

{/* progress icon */}


{/* ✅ Progress Tracker Section */}
<div className={styles.progressSection}>
  <h3 className={styles.sectionTitle}>ข้อมูลการแจ้งปัญหา</h3>
  <div className={styles.progressContainer}>
    {["รับเรื่อง", "กำลังพิจารณา", "กำลังดำเนินงาน", "ดำเนินการสำเร็จ"].map(
      (label, index) => (
        <div
          key={index}
          className={`${styles.step} ${
            index + 1 <= activeStep ? styles.active : ""
          }`}
          onClick={() => {
  const newStep = index + 1;
  setActiveStep(newStep);
  setCurrentStatus(getStatusLabel(newStep)); // ✅ อัปเดตสถานะทันที
}}

        >
          <div className={styles.circle}>
            {index + 1 <= activeStep ? <FaCheck /> : index + 1}
          </div>

          {/* เส้นต่อเนื่องแบบ gradient */}
          {index < 3 && (
            <div
              className={`${styles.line} ${
                index + 1 < activeStep ? styles.lineActive : ""
              }`}
            ></div>
          )}

          <span className={styles.label}>{label}</span>
        </div>
      )
    )}
  </div>
</div>
{/* 🔹 ข้อมูลการแจ้งปัญหา (แสดงตลอดเวลา แม้ไม่มีข้อมูล) */}
<div className={styles.problemSection}>
  <h3 className={styles.problemTitle}>ข้อมูลการแจ้งปัญหา</h3>

  {/* 🔸 ประเภทปัญหา */}
  <div className={styles.problemRow}>
    <label className={styles.problemLabel}>ประเภทปัญหา</label>
    <input
      className={styles.problemInput}
      name="problemType"
      value={filteredData?.problemType || "-"}
      readOnly
    />
  </div>

  {/* 🔸 รายละเอียดปัญหา */}
  <div className={styles.problemRow}>
    <label className={styles.problemLabel}>รายละเอียดปัญหา</label>
    <textarea
      className={styles.problemTextarea}
      name="problemDetail"
      value={filteredData?.problemDetail || "-"}
      readOnly
    ></textarea>
  </div>

  {/* ✅ กล่องพิกัด */}
  <div className={styles.coordBox}>
    <h4 className={styles.coordTitle}>
      📍 พิกัดปัญหา
    </h4>

    {filteredData?.location ? (
      <>
        <div className={styles.coordGrid}>
          <div>
            <label>Latitude</label>
            <input
              type="text"
              className={styles.coordInput}
              value={filteredData.location.split(",")[0] || ""}
              readOnly
            />
          </div>
          <div>
            <label>Longitude</label>
            <input
              type="text"
              className={styles.coordInput}
              value={filteredData.location.split(",")[1] || ""}
              readOnly
            />
          </div>
        </div>

        {/* 🗺️ แผนที่แสดงพิกัด */}
        <MapContainer
          center={
            filteredData.location
              ? (filteredData.location.split(",").map(Number) as [number, number])
              : [18.7877, 98.9931]
          }
          zoom={14}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          className={styles.leafletMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={
              filteredData.location
                ? (filteredData.location.split(",").map(Number) as [number, number])
                : [18.653549, 99.038908]
            }
            icon={
              new L.Icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [36, 36],
              })
            }
          >
            <Popup>
              <div style={{ fontFamily: "Mitr", fontSize: "13px" }}>
                <strong>ชื่อ:</strong> {filteredData?.firstName || "-"}{" "}
                {filteredData?.lastName || "-"}
                <br />
                <strong>ปัญหา:</strong> {filteredData?.problemType || "ไม่ระบุ"}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </>
    ) : (
      <p style={{ color: "#666", marginTop: "10px" }}>
        ⚠️ ยังไม่มีข้อมูลพิกัดในระบบสำหรับผู้ถูกร้องเรียนรายนี้
      </p>
    )}
  </div>
</div>



  {/* ✅ รูปก่อนดำเนินการ */}
  <div className={styles.imageSection}>
    <label className={styles.imageLabel}>รูปภาพก่อนดำเนินการ</label>
    <div className={styles.rowImage}>
      {(filteredData?.beforeImages && filteredData.beforeImages.length > 0
        ? filteredData.beforeImages
        : [null, null, null]
      ).map((img: string | null, i: number) => (
        <div key={i} className={styles.imageBox}>
          {img ? (
<img
  src={img}
  alt={`ก่อน ${i + 1}`}
  className={styles.previewImage}
  onClick={() => setSelectedImage(img)} // ✅ เมื่อคลิกภาพจะเปิด popup เต็มจอ
/>

          ) : (
            <span className={styles.placeholderText}>ไม่มีภาพ</span>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* ✅ รูปหลังดำเนินการ */}
  <div className={styles.imageSection}>
    <label className={styles.imageLabel}>รูปภาพหลังดำเนินการเสร็จ</label>
    <div className={styles.rowImage}>
      {(filteredData?.afterImages && filteredData.afterImages.length > 0
        ? filteredData.afterImages
        : [null, null, null]
      ).map((img: string | null, i: number) => (
        <div key={i} className={styles.imageBox}>
          {img ? (
<img
  src={img}
  alt={`หลัง ${i + 1}`}
  className={styles.previewImage}
  onClick={() => setSelectedImage(img)} // ✅ เมื่อคลิกภาพจะเปิด popup เต็มจอ
/>

          ) : (
            <span className={styles.placeholderText}>ไม่มีภาพ</span>
          )}
        </div>
      ))}
    </div>
  </div>
{selectedImage && (
  <div
    className={styles.popupOverlay}
    onClick={() => setSelectedImage(null)}
  >
    <div className={styles.popupInner} onClick={(e) => e.stopPropagation()}>
      <img src={selectedImage} alt="Preview" className={styles.popupImage} />
      <button
        className={styles.popupClose}
        onClick={() => setSelectedImage(null)}
      >
        ✕
      </button>
    </div>
  </div>
)}


{/* 🔹 ข้อมูลการดำเนินการแก้ไขปัญหา (เฉพาะดูเท่านั้น) */}
<div className={styles.section}>
  <h3 className={styles.sectionTitle}>ข้อมูลการดำเนินการแก้ไขปัญหา</h3>

  <div className={styles.row}>
    <label>วันที่ดำเนินการ</label>
    <input
      className={styles.inputSmall}
      type="date"
      value={filteredData?.fixDate || ""}
      readOnly
    />
  </div>

  <div className={styles.row}>
    <label>บันทึกการดำเนินการ</label>
    <textarea
      className={styles.textAreaLarge2}
      value={filteredData?.fixDetail || "-"}
      readOnly
    ></textarea>
  </div>

  <div className={styles.row}>
    <label>ผู้ดำเนินการ</label>
    <input
      className={styles.inputMedium}
      type="text"
      value={filteredData?.operator || "-"}
      readOnly
    />
  </div>
</div>
          {/* ✅ Output Table */}
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>เลขที่คำร้องขอ</th>
                <th>ชื่อ-นามสกุล</th>
                <th>เบอร์โทรศัพท์</th>
                <th>ประเภทปัญหา</th>
                <th>สถานะ</th>
                <th>วันที่บันทึก</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.requestId}</td>
                  <td>
                    {r.firstName} {r.lastName}
                  </td>
                  <td>{r.phone}</td>
                  <td>{r.problemType}</td>
                  <td>
<span
  className={`${styles.statusBadge} ${
    currentStatus === "รับเรื่อง"
      ? styles.statusWhite
      : currentStatus === "กำลังพิจารณา"
      ? styles.statusYellow
      : currentStatus === "กำลังดำเนินงาน"
      ? styles.statusBlue
      : currentStatus === "ดำเนินการสำเร็จ"
      ? styles.statusGreen
      : ""
  }`}
>
  {i === 0 ? currentStatus : r.status || "รอดำเนินการ"}
</span>

                  </td>
                  <td>{r.dateSaved}</td>
                  <td>
                    <FaSearch />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Report_RSPM;
