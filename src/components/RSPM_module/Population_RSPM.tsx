// src/components/RSPM_module/Population_RSPM.tsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import styles from "./Population_RSPM.module.css";
import { FaUsers, FaHome, FaChartBar, FaMapMarkerAlt } from "react-icons/fa";
import {
  MOCK_CITIZENS,
  VILLAGES,
  type Citizen,
} from "./populationMockData";

const Population_RSPM: React.FC = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [searchText, setSearchText] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // 🟢 ค่าตั้งต้นของ citizen ใหม่ (ให้ตรงกับ type Citizen)
  const emptyCitizen: Citizen = {
    id: "",
    fullName: "",
    nationalId: "",
    villageNo: 1,
    villageName: VILLAGES.find((v) => v.no === 1)?.name || "",
    houseNo: "",
    birthDate: "",
    gender: "ชาย",
    subdistrict: "อุโมง",
    district: "อุโมง",
    province: "ลำพูน",
    postcode: "51150",
  };

  // Modal เพิ่มประชาชน
  const [showAdd, setShowAdd] = useState(false);
  const [newCitizen, setNewCitizen] = useState<Citizen>(emptyCitizen);

  // โหลด mock data จากไฟล์
  useEffect(() => {
    setCitizens(MOCK_CITIZENS);
  }, []);

  const totalCitizens = citizens.length;
  const totalVillages = VILLAGES.length;

  const avgPerVillage = useMemo(() => {
    return totalVillages > 0
      ? (totalCitizens / totalVillages).toFixed(1)
      : "0";
  }, [totalCitizens, totalVillages]);

  const filteredCitizens = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    return citizens.filter((c) => {
      const matchText =
        !text ||
        c.fullName.toLowerCase().includes(text) ||
        c.nationalId.includes(text) ||
        c.villageName.toLowerCase().includes(text) ||
        c.villageNo.toString().includes(text) ||
        c.houseNo.toLowerCase().includes(text) ||
        c.gender.toLowerCase().includes(text);

      const matchVillage =
        !villageFilter || c.villageNo.toString() === villageFilter;

      return matchText && matchVillage;
    });
  }, [citizens, searchText, villageFilter]);

  const openDetail = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedCitizen(null);
  };

  const resetNewCitizen = () => {
    setNewCitizen(emptyCitizen);
  };

  const addCitizen = () => {
    if (!newCitizen.fullName.trim() || !newCitizen.nationalId.trim()) {
      alert("กรุณากรอกชื่อ - นามสกุล และเลขประจำตัวประชาชน");
      return;
    }

    const nextId = (citizens.length + 1).toString();
    const villageName =
      VILLAGES.find((v) => v.no === Number(newCitizen.villageNo))?.name || "";

    const citizenToAdd: Citizen = {
      ...newCitizen,
      id: nextId,
      villageName,
    };

    setCitizens((prev) => [...prev, citizenToAdd]);
    setShowAdd(false);
    resetNewCitizen();
  };

  return (
    <div className={styles.layout}>
      <Header />

      <div style={{ display: "flex", flex: 1, width: "100%" }}>
        <Sidebar />

        <div className={styles.mainContainer}>
          <div className={styles.container}>
            <h1 className={styles.formTitle}>
              รายงานข้อมูลประชาชน เทศบาลตำบลอุโมง (Population RSPM)
            </h1>

            {/* ===== การ์ดสรุป ===== */}
            <section className={styles.summarySection}>
              <div className={styles.summaryHeader}>
                <h4>สรุปภาพรวมข้อมูลประชาชนในเขตเทศบาลตำบลอุโมง</h4>
              </div>

              <div className={styles.summaryContainer}>
                {/* การ์ด 1 */}
                <div
                  className={styles.summaryCard}
                  style={{ backgroundColor: "#007bff" }}
                >
                  <div className={styles.summaryHeader}>
                    <h4>จำนวนประชาชนทั้งหมด</h4>
                  </div>
                  <div className={styles.value}>{totalCitizens}</div>
                  <div className={styles.summaryFooter}>
                    <span className={styles.change}>
                      ในเขตเทศบาลตำบลอุโมง
                    </span>
                    <span className={styles.icon}>
                      <FaUsers />
                    </span>
                  </div>
                </div>

                {/* การ์ด 2 */}
                <div
                  className={styles.summaryCard}
                  style={{ backgroundColor: "#ff9800" }}
                >
                  <div className={styles.summaryHeader}>
                    <h4>จำนวนหมู่บ้านทั้งหมด</h4>
                  </div>
                  <div className={styles.value}>{totalVillages}</div>
                  <div className={styles.summaryFooter}>
                    <span className={styles.change}>
                      หมู่ที่ 1 - หมู่ที่ 11
                    </span>
                    <span className={styles.icon}>
                      <FaHome />
                    </span>
                  </div>
                </div>

                {/* การ์ด 3 */}
                <div
                  className={styles.summaryCard}
                  style={{ backgroundColor: "#f44336" }}
                >
                  <div className={styles.summaryHeader}>
                    <h4>เฉลี่ยประชาชนต่อหมู่บ้าน</h4>
                  </div>
                  <div className={styles.value}>{avgPerVillage}</div>
                  <div className={styles.summaryFooter}>
                    <span className={styles.change}>
                      แบ่งจาก {totalVillages} หมู่บ้าน
                    </span>
                    <span className={styles.icon}>
                      <FaChartBar />
                    </span>
                  </div>
                </div>

                {/* การ์ด 4 */}
                <div
                  className={styles.summaryCard}
                  style={{ backgroundColor: "#4caf50" }}
                >
                  <div className={styles.summaryHeader}>
                    <h4>เขตการปกครอง</h4>
                  </div>
                  <div className={styles.value}>1</div>
                  <div className={styles.summaryFooter}>
                    <span className={styles.change}>
                      เทศบาลตำบลอุโมง อำเภออุโมง
                    </span>
                    <span className={styles.icon}>
                      <FaMapMarkerAlt />
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== Filter Section ===== */}
            <div className={styles.filterContainer}>
              <div className={styles.filterItem}>
                <label>คำค้นหา</label>
                <input
                  type="text"
                  placeholder="ชื่อ, เลขบัตร, บ้านเลขที่, หมู่ที่, หมู่บ้าน..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <div className={styles.filterItem}>
                <label>หมู่บ้าน</label>
                <select
                  value={villageFilter}
                  onChange={(e) => setVillageFilter(e.target.value)}
                >
                  <option value="">ทุกหมู่บ้าน</option>
                  {VILLAGES.map((v) => (
                    <option key={v.no} value={v.no}>
                      {`หมู่ที่ ${v.no} - ${v.name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ===== ปุ่มเพิ่มประชาชน (ล่างฟิลเตอร์) ===== */}
            <div className={styles.addButtonRow}>
              <button
                type="button"
                className={styles.addButton}
                onClick={() => setShowAdd(true)}
              >
                + เพิ่มประชาชน
              </button>
            </div>

            {/* ===== Table Section ===== */}
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>ชื่อ - นามสกุล</th>
                  <th>เลขบัตรประชาชน</th>
                  <th>บ้านเลขที่</th>
                  <th>หมู่ที่</th>
                  <th>หมู่บ้าน</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCitizens.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredCitizens.map((c, index) => (
                    <tr key={c.id}>
                      <td>{index + 1}</td>
                      <td>{c.fullName}</td>
                      <td>{c.nationalId}</td>
                      <td>{c.houseNo}</td>
                      <td>{c.villageNo}</td>
                      <td>{c.villageName}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.viewButton}
                          onClick={() => openDetail(c)}
                        >
                          ดูข้อมูล
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />

      {/* ===== Modal แสดงข้อมูลเต็ม ===== */}
      {showDetail && selectedCitizen && (
        <div className={styles.modalOverlay} onClick={closeDetail}>
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>ข้อมูลประชาชน</h3>
              <button
                className={styles.modalClose}
                onClick={closeDetail}
                aria-label="ปิด"
                type="button"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <label>ชื่อ - นามสกุล</label>
                <span>{selectedCitizen.fullName}</span>
              </div>
              <div className={styles.modalRow}>
                <label>เลขประจำตัวประชาชน</label>
                <span>{selectedCitizen.nationalId}</span>
              </div>
              <div className={styles.modalRow}>
                <label>วัน เดือน ปีเกิด</label>
                <span>{selectedCitizen.birthDate}</span>
              </div>
              <div className={styles.modalRow}>
                <label>เพศ</label>
                <span>{selectedCitizen.gender}</span>
              </div>
              <div className={styles.modalRow}>
                <label>ที่อยู่ตามทะเบียนบ้าน</label>
                <span>
                  {`บ้านเลขที่ ${selectedCitizen.houseNo} หมู่ที่ ${selectedCitizen.villageNo} ${selectedCitizen.villageName} ตำบล${selectedCitizen.subdistrict} อำเภอ${selectedCitizen.district} จังหวัด${selectedCitizen.province} ${selectedCitizen.postcode}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal เพิ่มประชาชน ===== */}
      {showAdd && (
        <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>เพิ่มข้อมูลประชาชน</h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowAdd(false)}
                aria-label="ปิด"
                type="button"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <label>ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  value={newCitizen.fullName}
                  onChange={(e) =>
                    setNewCitizen({ ...newCitizen, fullName: e.target.value })
                  }
                />
              </div>

              <div className={styles.modalRow}>
                <label>เลขประจำตัวประชาชน</label>
                <input
                  type="text"
                  value={newCitizen.nationalId}
                  onChange={(e) =>
                    setNewCitizen({
                      ...newCitizen,
                      nationalId: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.modalRow}>
                <label>บ้านเลขที่</label>
                <input
                  type="text"
                  value={newCitizen.houseNo}
                  onChange={(e) =>
                    setNewCitizen({ ...newCitizen, houseNo: e.target.value })
                  }
                />
              </div>

              <div className={styles.modalRow}>
                <label>หมู่ที่ / หมู่บ้าน</label>
                <select
                  value={newCitizen.villageNo}
                  onChange={(e) => {
                    const vNo = Number(e.target.value);
                    const vName =
                      VILLAGES.find((v) => v.no === vNo)?.name || "";
                    setNewCitizen({
                      ...newCitizen,
                      villageNo: vNo,
                      villageName: vName,
                    });
                  }}
                >
                  {VILLAGES.map((v) => (
                    <option key={v.no} value={v.no}>
                      หมู่ที่ {v.no} - {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.modalRow}>
                <label>วัน เดือน ปีเกิด</label>
                <input
                  type="text"
                  placeholder="09/02/2541"
                  value={newCitizen.birthDate}
                  onChange={(e) =>
                    setNewCitizen({
                      ...newCitizen,
                      birthDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.modalRow}>
                <label>เพศ</label>
                <select
                  value={newCitizen.gender}
                  onChange={(e) =>
                    setNewCitizen({ ...newCitizen, gender: e.target.value as "ชาย" | "หญิง" })
                  }
                >
                  <option value="">เลือกเพศ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
              </div>

              <div className={styles.modalRow}>
                <label>ตำบล / อำเภอ / จังหวัด</label>
                <span>
                  ตำบล{newCitizen.subdistrict} อำเภอ{newCitizen.district}{" "}
                  จังหวัด{newCitizen.province} {newCitizen.postcode}
                </span>
              </div>

              <div className={styles.addModalFooter}>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={addCitizen}
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Population_RSPM;
