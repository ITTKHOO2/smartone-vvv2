import React, { useState, useMemo } from "react";
import styles from "./Dashboard_RSPM.module.css";
import Header from "../Header";
import Footer from "../Footer";
import Sidebar from "./Sidebar_RSPM";
import {
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaThumbsUp,
} from "react-icons/fa";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix Marker Icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Dashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // ✅ สรุปข้อมูลสถิติ

const summary = [
  { 
    title: "จำนวนคำร้องทั้งหมด", 
    value: 13, 
    color: "linear-gradient(135deg, #2196f3, #1e88e5)", 
    icon: <FaClipboardList />, 
    change: "+8.3%" 
  },
  { 
    title: "จำนวนคำร้องกำลังพิจารณา", 
    value: 4, 
    color: "linear-gradient(135deg, #ff9800, #fb8c00)", 
    icon: <FaChartBar />, 
    change: "+33.3%" 
  },
  { 
    title: "จำนวนคำร้องกำลังดำเนินการ", 
    value: 4, 
    color: "linear-gradient(135deg, #f44336, #e53935)", 
    icon: <FaUsers />, 
    change: "+33.3%" 
  },
  { 
    title: "จำนวนคำร้องดำเนินการสำเร็จ", 
    value: 5, 
    color: "linear-gradient(135deg, #4caf50, #43a047)", 
    icon: <FaThumbsUp />, 
    change: "+25.0%" 
  },
];


// ✅ Chart 1: สถิติประสิทธิภาพการทำงาน (Stacked Bar สไตล์ภาพ)
const efficiencyOptions = useMemo(
  () => ({
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      height: 360, // ✅ ทำให้กราฟสูงและยาวขึ้น
      spacingLeft: 10,
      spacingRight: 10,
    },
    title: {
      text: "สถิติประสิทธิภาพการทำงาน",
      align: "left",
      style: {
        color: "#007bff",
        fontFamily: "Mitr",
        fontWeight: "600",
      },
    },
    xAxis: {
      categories: [
        "ประสิทธิภาพดำเนินการ",
        "อยู่ระหว่างดำเนินการ",
        "ดำเนินการสำเร็จ",
        "ความพึงพอใจ",
      ],
      title: { text: null },
      labels: {
        rotation: 320, // ✅ ทำให้ตัวอักษรเฉียง
        style: {
          fontFamily: "Mitr",
          fontSize: "12px",
          color: "#333",
        },
      },
    },
    yAxis: {
      min: 0,
      title: { text: null },
      labels: { enabled: false },
      gridLineWidth: 0,
    },
    legend: {
      reversed: true,
      align: "center",
      verticalAlign: "bottom",
      symbolRadius: 6,
      itemStyle: {
        fontFamily: "Mitr",
        fontSize: "13px",
      },
    },
    plotOptions: {
      series: {
        stacking: "percent",
        borderWidth: 0,
        pointPadding: 0.05,
        groupPadding: 0.05,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return this.y + "%";
          },
          style: {
            fontSize: "12px",
            fontFamily: "Mitr",
            textOutline: "none",
          },
        },
      },
    },
    series: [
      {
        name: "แย่",
        data: [25, 55, 15, 20],
        color: "#fa5252",
      },
      {
        name: "ปานกลาง",
        data: [35, 25, 25, 30],
        color: "#ffc078",
      },
      {
        name: "ดี",
        data: [40, 20, 60, 50],
        color: "#37b24d",
      },
    ],
    credits: { enabled: false },
  }),
  []
);

  // ✅ Chart 2: Pie (สถานะเรื่อง)
  const pieOptions = useMemo(
    () => ({
      chart: { type: "pie", backgroundColor: "transparent" },
      title: { text: "สถานะภาพรวมเรื่องร้องเรียน" },
      series: [
        {
          name: "จำนวน",
          data: [
            { name: "อยู่ระหว่างดำเนินการ", y: 4, color: "#ffc078" },
            { name: "ล่าช้า", y: 4, color: "#fa5252" },
            { name: "เสร็จสิ้น", y: 5, color: "#51cf66" },
          ],
        },
      ],
      credits: { enabled: false },
    }),
    []
  );
  // ✅ Chart 3: Bar (ข้อมูลการดำเนินการในระยะเวลาที่กำหนด)
const barOptions2 = useMemo(
  () => ({
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      height: 300, // ✅ ความสูงเท่าภาพเดิม
      spacingLeft: 10,
      spacingRight: 10,
    },
    title: {
      text: "ข้อมูลการดำเนินการในระยะเวลาที่กำหนด",
      align: "left",
      style: {
        color: "#007bff",
        fontFamily: "Mitr",
        fontSize: "14px",
        fontWeight: "600",
      },
    },
    xAxis: {
      categories: ["เร็วกว่า", "ตรงกำหนด", "ล่าช้า"],
      title: { text: null },
      labels: {
        rotation: 320, // ✅ เฉียงเหมือน Chart 1
        style: { fontFamily: "Mitr", fontSize: "11px", color: "#444" },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "จำนวนการดำเนินการ",
        align: "high",
        style: { fontFamily: "Mitr", fontSize: "12px", color: "#444" },
      },
      gridLineWidth: 0, // ✅ ลบเส้นกริดแนวนอน
    },
    tooltip: {
      valueSuffix: " รายการ",
      backgroundColor: "rgba(255,255,255,0.9)",
      borderColor: "#ccc",
      borderRadius: 8,
      style: { fontFamily: "Mitr", fontSize: "12px" },
    },
    plotOptions: {
      bar: {
        borderWidth: 1.2, // ✅ เพิ่มเส้นขอบให้แต่ละแท่ง
        borderColor: "#ddd", // ✅ สีเทาอ่อนเหมือนในภาพ
        borderRadius: 5, // ✅ มุมโค้งเล็กน้อย
        pointWidth: 25, // ✅ ปรับความหนาแท่งให้ใหญ่พอดีเหมือนเดิม
        groupPadding: 0.1, // ✅ ช่องว่างระหว่างกลุ่มแท่งพอดี
        dataLabels: {
          enabled: true,
          style: { fontFamily: "Mitr", fontSize: "11px", textOutline: "none" },
        },
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      symbolRadius: 6,
      itemStyle: { fontFamily: "Mitr", fontSize: "12px" },
    },
    credits: { enabled: false },
    series: [
      {
        name: "จำนวนการดำเนินการ",
        data: [30, 40, 30],
        colorByPoint: true,
        colors: ["#37b24d", "#ffc078", "#fa5252"],
      },
    ],
  }),
  []
);


// ✅ Chart 4: แนวโน้มการเพิ่มขึ้นของการร้องขอ
const lineOptions = useMemo(
  () => ({
    chart: {
      type: "line",
      backgroundColor: "transparent",
    },
    title: {
      text: "แนวโน้มการเพิ่มขึ้นของการร้องขอ",
      align: "left",
      style: { color: "#007bff", fontFamily: "Mitr", fontSize: "16px" },
    },
    subtitle: {
      text: "Source: Smart One",
      align: "left",
      style: { color: "#6c757d", fontFamily: "Mitr", fontSize: "12px" },
    },
    xAxis: {
      categories: [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
      ],
      lineColor: "#ccc",
      labels: {
        style: { fontFamily: "Mitr", color: "#333" },
      },
    },
    yAxis: {
      title: {
        text: "การร้องขอ",
        style: { fontFamily: "Mitr", color: "#333" },
      },
      gridLineColor: "#e9ecef",
      labels: { style: { fontFamily: "Mitr", color: "#333" } },
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: { fontFamily: "Mitr" },
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      valueSuffix: " รายการ",
      style: { fontFamily: "Mitr" },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          style: { fontFamily: "Mitr", fontSize: "12px" },
        },
        enableMouseTracking: true,
        marker: {
          enabled: true,
          radius: 4,
          symbol: "circle",
        },
      },
    },
    series: [
      {
        name: "คำร้องขอใหม่",
        data: [16, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2, 22, 17.8],
        color: "#4dabf7",
        lineWidth: 3,
      },
      {
        name: "ดำเนินการเสร็จ",
        data: [-2.9, -3.0, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12, 6.5, 2, -0.9],
        color: "#5f3dc4",
        lineWidth: 3,
      },
    ],
    credits: { enabled: false },
  }),
  []
);
// ✅ Chart 5: ข้อมูลการร้องขอแยกตามหมู่บ้าน
const villageOptions = useMemo(
  () => ({
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "ข้อมูลการร้องขอแยกตามหมู่บ้าน",
      align: "left",
      style: { color: "#007bff", fontFamily: "Mitr", fontSize: "16px" },
    },
    subtitle: {
      text: "ปี 2568",
      align: "right",
      style: { color: "#6c757d", fontFamily: "Mitr", fontSize: "12px" },
    },
    xAxis: {
      categories: [
        "หมู่บ้าน 1",
        "หมู่บ้าน 2",
        "หมู่บ้าน 3",
        "หมู่บ้าน 4",
        "หมู่บ้าน 5",
        "หมู่บ้าน 6",
        "หมู่บ้าน 7",
        "หมู่บ้าน 8",
        "หมู่บ้าน 9",
        "หมู่บ้าน 10",
      ],
      crosshair: true,
      labels: { style: { fontFamily: "Mitr", fontSize: "12px" } },
    },
    yAxis: {
      min: 0,
      title: {
        text: "จำนวนคำร้องขอ",
        style: { fontFamily: "Mitr" },
      },
      labels: { style: { fontFamily: "Mitr" } },
      gridLineColor: "#e9ecef",
    },
    tooltip: {
      shared: true,
      valueSuffix: " รายการ",
      style: { fontFamily: "Mitr" },
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
        borderRadius: 3,
      },
    },
    series: [
      {
        name: "เสร็จสิ้น",
        data: [3, 2, 3, 4, 4, 3, 3, 3, 3, 3],
        color: "#37b24d",
      },
      {
        name: "กำลังดำเนินการ",
        data: [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
        color: "#ffc078",
      },
      {
        name: "ล่าช้า",
        data: [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        color: "#fa5252",
      },
    ],
    legend: {
      align: "center",
      verticalAlign: "bottom",
      itemStyle: { fontFamily: "Mitr" },
    },
    credits: { enabled: false },
  }),
  []
);


  // ✅ พิกัดตัวอย่างในเชียงใหม่
  const markerData = [
    { id: 1, lat: 18.787, lng: 98.985, status: "ดำเนินการ" },
    { id: 2, lat: 18.790, lng: 98.993, status: "เสร็จสิ้น" },
    { id: 3, lat: 18.780, lng: 98.990, status: "ล่าช้า" },
  ];

  const getColor = (status: string) => {
    switch (status) {
      case "เสร็จสิ้น":
        return "green";
      case "ล่าช้า":
        return "red";
      default:
        return "orange";
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className={styles.mainContent}>
          <h2 className={styles.title}>SMART ONE : RSPM Dashboard</h2>
{/* ✅ ส่วนหัวข้อมูลการติดตาม */}
<div className={styles.trackHeader}>
  <div className={styles.trackLeft}>
    <h3 className={styles.trackTitle}>
      Dashboard : ข้อมูลสถิติประสิทธิภาพการแก้ไขปัญหาร้องเรียนร้องขอ
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

          {/* ✅ Charts Section */}
<div className={styles.chartGrid3}>
  <div className={styles.chartBox}>
    <HighchartsReact highcharts={Highcharts} options={efficiencyOptions} />
  </div>
  <div className={styles.chartBox}>
    <HighchartsReact highcharts={Highcharts} options={pieOptions} />
  </div>
  <div className={styles.chartBox}>
    <HighchartsReact highcharts={Highcharts} options={barOptions2} />
  </div>
</div>


{/* ✅ Chart Row: Line + Village */}
<div className={styles.chartGrid2}>
  <div className={styles.chartBox}>
    <HighchartsReact highcharts={Highcharts} options={lineOptions} />
  </div>
  <div className={styles.chartBox}>
    <HighchartsReact highcharts={Highcharts} options={villageOptions} />
  </div>
</div>


<div className={styles.mapRow}>
  {/* 🗺️ แผนที่ด้านซ้าย */}
  <div className={styles.mapContainerBox}>
    <MapContainer
      center={[18.787, 98.985]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markerData.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={
            new L.Icon({
              iconUrl: `https://maps.google.com/mapfiles/ms/icons/${getColor(
                m.status
              )}-dot.png`,
            })
          }
        >
          <Popup>
            <b>สถานะ:</b> {m.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
  {/* 📋 ตารางด้านขวา */}
  <div className={styles.tableContainer}>
    <h3 className={styles.tableTitle}>รายการคำร้องปัญหา</h3>
    <table className={styles.dataTable}>
      <thead>
        <tr>
          <th>ลำดับ</th>
          <th>เลขที่คำร้องขอ</th>
          <th>ชื่อ-นามสกุล</th>
          <th>หมู่ที่</th>
          <th>หมู่บ้าน</th>
          <th>ตำบล</th>
          <th>สถานะ</th>
          <th>กองผู้รับผิดชอบ</th>
          <th>วันที่รับเรื่อง</th>
        </tr>
      </thead>
      <tbody>
        {[
          { id: 1, code: "A-2568-0041", name: "นายชมชาย ลำพูน", moo: "1", village: "หมู่บ้าน 1", sub: "สันเมือง", status: "เสร็จสิ้น", dept: "กองช่าง", date: "21/07/2568", color: "#4caf50" },
          { id: 2, code: "A-2568-0040", name: "นายชมชาย ลำพูน", moo: "2", village: "หมู่บ้าน 2", sub: "บ้านกลาง", status: "กำลังดำเนินการ", dept: "กองช่าง", date: "18/07/2568", color: "#ff9800" },
          { id: 3, code: "A-2568-0039", name: "นายชมชาย ลำพูน", moo: "3", village: "หมู่บ้าน 3", sub: "ศรีวิชัย", status: "ล่าช้า", dept: "กองช่าง", date: "18/07/2568", color: "#f44336" },
        ].map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.code}</td>
            <td>{row.name}</td>
            <td>{row.moo}</td>
            <td>{row.village}</td>
            <td>{row.sub}</td>
            <td>
              <span
                className={styles.statusBadge}
                style={{ backgroundColor: row.color }}
              >
                {row.status}
              </span>
            </td>
            <td>{row.dept}</td>
            <td>{row.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Dashboard;
