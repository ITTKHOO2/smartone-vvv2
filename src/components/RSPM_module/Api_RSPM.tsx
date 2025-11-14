import React, { useState, useEffect, useRef } from "react";
import styles from "./api_RSPM.module.css";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import { FaClipboardList, FaChartBar, FaUsers, FaThumbsUp, FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";
import ExportButtons from "../ExportButtons";
import axios from "axios"; //เชื่อม api ต่อเข้า db

const Api_RSPM: React.FC = () => {
    const [formData, setFormData] = useState({
        date: "",
        user: "",
        password: "",
        dept: "",
        link: "",
        owner: "",
        tel: "",
    });

    const [apiData, setApiData] = useState<any[]>([]);

    const [showModal, setShowModal] = useState(false);
const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(null);
const [selectedData, setSelectedData] = useState<any>(null);

// เปิด modal พร้อมข้อมูล
const handleOpenModal = (mode: "view" | "edit" | "delete", data: any) => {
  console.log("🧭 เปิด modal:", mode, data);
    setModalMode(mode);
  setSelectedData(data);
  setShowModal(true);
};

// ปิด modal
const handleCloseModal = () => {
  setShowModal(false);
  setSelectedData(null);
  setModalMode(null);
};
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


//------ท่อนนี้คือเชื่อมต่อจาก local ที่บันทึกของมูลไว้-------------//
    // const handleAddData = () => {
    //     if (!formData.user || !formData.link) {
    //         alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    //         return;
    //     }

    //     const newEntry = { id: apiData.length + 1, ...formData };
    //     const updatedData = [...apiData, newEntry];
    //     setApiData(updatedData);

    //     const blob = new Blob([JSON.stringify(updatedData, null, 2)], {
    //         type: "application/json",
    //     });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = "api.json";
    //     a.click();

    //     setFormData({
    //         date: "",
    //         user: "",
    //         password: "",
    //         dept: "",
    //         link: "",
    //         owner: "",
    //         tel: "",
    //     });
    // };



// 🌐 ตั้งค่าพื้นฐานของ API Backend
const API_BASE = "http://localhost:3001/api/apis";

// 📦 ดึงข้อมูลทั้งหมด (GET)
const fetchData = async () => {
  try {
    const res = await axios.get(API_BASE);
    setApiData(res.data);
  } catch (error) {
    console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error);
    alert("ไม่สามารถโหลดข้อมูลจากเซิร์ฟเวอร์ได้");
  }
};

// ➕ เพิ่มข้อมูลใหม่ (POST)
const handleAddData = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  // ตรวจว่ากรอกครบหรือยัง
  if (!formData.user || !formData.link) {
    alert("⚠️ กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  try {
    // ส่งข้อมูลไป backend (DATABASE )
    const res = await axios.post(`${API_BASE}/add`, formData, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.success) {
      alert("✅ บันทึกข้อมูลสำเร็จและส่งไปยังฐานข้อมูล");

      // ล้างฟอร์ม
      setFormData({
        date: "",
        user: "",
        password: "",
        dept: "",
        link: "",
        owner: "",
        tel: "",
      });

      // โหลดข้อมูลใหม่จาก DB
      fetchData();
    } else {
      alert("❌ บันทึกไม่สำเร็จ: " + res.data.message);
    }
  } catch (err: any) {
    console.error("Error:", err);
    alert("🚫 เกิดข้อผิดพลาดในการเชื่อมต่อกับ Backend");
  }
};
// ✏️ แก้ไขข้อมูล (PUT)
const handleUpdateData = async () => {
  try {
    const res = await axios.put(`${API_BASE}/update/${selectedData.id}`, selectedData);
    if (res.data.success) {
      alert("✅ อัปเดตข้อมูลสำเร็จ");
      fetchData();
      handleCloseModal();
    } else {
      alert("❌ ไม่สามารถอัปเดตข้อมูลได้");
    }
  } catch (err) {
    console.error("❌ Update Error:", err);
    alert("🚫 เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
  }
};

// 🗑️ ลบข้อมูล (DELETE)
const handleDeleteData = async () => {
  if (!window.confirm("⚠️ คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) return;
  try {
    const res = await axios.delete(`${API_BASE}/delete/${selectedData.id}`);
    if (res.data.success) {
      alert("🗑️ ลบข้อมูลสำเร็จ");
      fetchData();
      handleCloseModal();
    } else {
      alert("❌ ไม่สามารถลบข้อมูลได้");
    }
  } catch (err) {
    console.error("❌ Delete Error:", err);
    alert("🚫 เกิดข้อผิดพลาดในการลบข้อมูล");
  }
};

// ⏳ โหลดข้อมูลเมื่อหน้าเริ่ม
useEffect(() => {
  fetchData();
}, []);

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
const tableRef = useRef<HTMLTableElement | null>(null);

    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.mainContainer}>
                <Sidebar />

                <div className={styles.container}>
                    <div className={styles.titleRow}>
                        <h2 className={styles.formTitle}>
                            รายงานสรุปผลการดำเนินงานระบบ RSPM
                        </h2>
                         <ExportButtons data={apiData} tableRef={tableRef} /> {/* ✅ ส่ง ref ไป */}
                    </div>

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

                    {/* 🔹 สรุปผล */}
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

                    {/* 🔹 ส่วนแสดงโค้ด API */}
                    <div className={styles.apiBox}>
                        <h2 className={styles.formTitle}>รูปแบบการเชื่อมต่อข้อมูลแบบ API</h2>
                        <h3 className={styles.apiTitle}>ตัวอย่าง Code Javascript</h3>
                        <p className={styles.apiDesc}>
                            คำขอแบบ ajax (JSONP) พื้นฐาน เพื่อร้องขอข้อมูลผ่าน API โดยใช้ jQuery
                        </p>

                        <pre className={styles.codeBlock}>
                            {`var data = {
  resource_id: '9a0eb6a1-fb08-41de-b15f-7f5bdb2c6e32', // the resource id
  limit: 5, // get 5 results
  q: 'jones' // query for 'jones'
};
$.ajax({
  url: 'https://umongcity.gdcatalog.go.th/api/3/action/datastore_search',
  data: data,
  dataType: 'jsonp',
  success: function(data) {
    alert('Total results found: ' + data.result.total)
  }
});`}
                        </pre>

                        <h3 className={styles.apiTitle}>ตัวอย่าง Code Python</h3>
                        <pre className={styles.codeBlock}>
                            {`import urllib.request
url = 'https://umongcity.gdcatalog.go.th/api/3/action/datastore_search?resource_id=9a0eb6a1-fb08-41de-b15f-7f5bdb2c6e32'
fileobj = urllib.request.urlopen(url)
print(fileobj.read())`}
                        </pre>
                    </div>

                    {/* 🔹 ตารางและฟอร์มกรอกข้อมูล */}
                    <div className={styles.apiContainer}>
                        <h2 className={styles.formTitles}>ข้อมูลการอนุญาตเชื่อมต่อ API</h2>

                        {/* ตารางข้อมูล */}
      <table className={styles.dataTable} ref={tableRef}>
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>วันที่</th>
                                    <th>USER</th>
                                    <th>PASSWORD</th>
                                    <th>หน่วยงาน</th>
                                    <th>Link</th>
                                    <th>ผู้ดูแล</th>
                                    <th>เบอร์โทร</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
  {apiData.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td>
     <td>
  {row.date
    ? new Date(row.date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-"}
</td>

      <td>{row.user}</td>
      <td>{row.password}</td>
      <td>{row.dept}</td>
      <td>{row.link}</td>
      <td>{row.owner}</td>
      <td>{row.tel}</td>
      <td className={styles.actionCell}>
        <FaSearch
          className={styles.iconSearch}
          title="ดูรายละเอียด"
          onClick={() => handleOpenModal("view", row)}
        />
        <FaEdit
          className={styles.iconEdit}
          title="แก้ไขข้อมูล"
          onClick={() => handleOpenModal("edit", row)}
        />
        <FaTrashAlt
          className={styles.iconDelete}
          title="ลบข้อมูล"
          onClick={() => handleOpenModal("delete", row)}
        />
      </td>
    </tr>
  ))}
</tbody>

                        </table>

                        {/* ฟอร์มกรอกข้อมูล */}
                        <h2 className={styles.formTitless}>ข้อมูลการอนุญาตเชื่อมต่อ API</h2>
                        <div className={styles.formBox}>
                            {["date", "user", "password", "dept", "link", "owner", "tel"].map((field, i) => {
  const labelMap: Record<string, string> = {
    date: "วันที่",
    user: "USER",
    password: "PASSWORD",
    dept: "หน่วยงาน",
    link: "Link",
    owner: "ผู้ดูแล",
    tel: "เบอร์โทร",
  };

  // ✅ กำหนดชนิด input แยกตามฟิลด์
  let inputType = "text";
  if (field === "date") inputType = "date";
  if (field === "password") inputType = "password";
  if (field === "tel") inputType = "tel";

  return (
    <div className={styles.formGroup} key={i}>
      <label>{labelMap[field]}</label>
      <input
        type={inputType}
        name={field}
        // ✅ ให้ date แสดงเป็น YYYY-MM-DD เสมอ (ป้องกันรูปแบบ ISO string)
        value={
          field === "date" && (formData as any)[field]
            ? (formData as any)[field].split("T")[0]
            : (formData as any)[field]
        }
        onChange={handleChange}
      />
    </div>
  );
})}


                            <div className={styles.formButtons}>
                                <button onClick={handleAddData} className={styles.saveBtn}>
                                    บันทึกข้อมูล
                                </button>
                                <button
                                    onClick={() =>
                                        setFormData({
                                            date: "",
                                            user: "",
                                            password: "",
                                            dept: "",
                                            link: "",
                                            owner: "",
                                            tel: "",
                                        })
                                    }
                                    className={styles.cancelBtn}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
{/* 🪟 Popup Modal */}
{showModal && selectedData && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalBox}>
      <h3 className={styles.modalTitle}>
        {modalMode === "view" && "🔍 ดูรายละเอียด API"}
        {modalMode === "edit" && "✏️ แก้ไขข้อมูล API"}
        {modalMode === "delete" && "🗑️ ยืนยันการลบข้อมูล"}
      </h3>

      {/* ฟอร์มแสดงข้อมูล */}
      {["date", "user", "password", "dept", "link", "owner", "tel"].map((field) => {
        const labelMap: Record<string, string> = {
          date: "วันที่",
          user: "USER",
          password: "PASSWORD",
          dept: "หน่วยงาน",
          link: "Link",
          owner: "ผู้ดูแล",
          tel: "เบอร์โทร",
        };
        const readOnly = modalMode === "view" || modalMode === "delete";
        return (
          <div className={styles.formGroup} key={field}>
            <label>{labelMap[field]}</label>
            <input
              type={field === "date" ? "date" : "text"}
              value={
                field === "date" && selectedData[field]
                  ? selectedData[field].split("T")[0]
                  : selectedData[field]
              }
              readOnly={readOnly}
              onChange={(e) => {
                if (modalMode === "edit") {
                  setSelectedData({ ...selectedData, [field]: e.target.value });
                }
              }}
            />
          </div>
        );
      })}

      {/* ปุ่มควบคุมใน Modal */}
      <div className={styles.modalButtons}>
        {modalMode === "view" && (
          <button className={styles.closeBtn} onClick={handleCloseModal}>
            ปิด
          </button>
        )}

{modalMode === "edit" && (
  <>
    <button className={styles.saveBtn} onClick={handleUpdateData}>บันทึก</button>
    <button className={styles.cancelBtn} onClick={handleCloseModal}>ยกเลิก</button>
  </>
)}

{modalMode === "delete" && (
  <>
    <button className={styles.deleteBtn} onClick={handleDeleteData}>ยืนยันการลบ</button>
    <button className={styles.cancelBtn} onClick={handleCloseModal}>ยกเลิก</button>
  </>
)}

      </div>
    </div>
  </div>
)}

<Footer />

           
        </div>
    );
};

export default Api_RSPM;
