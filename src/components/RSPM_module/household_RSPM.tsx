// src/components/RSPM_module/Household_RSPM.tsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import styles from "./Population_RSPM.module.css";
import { FaHome, FaUsers, FaChartBar, FaMapMarkerAlt } from "react-icons/fa";
import {
  MOCK_CITIZENS,
  VILLAGES,
  type Citizen,
} from "./populationMockData";

type Household = {
  id: string;
  houseNo: string;
  villageNo: number;
  villageName: string;
  residents: Citizen[];
};

const Household_RSPM: React.FC = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchText, setSearchText] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(
    null
  );
  const [showDetail, setShowDetail] = useState(false);

  // Modal เพิ่มทะเบียนบ้าน
  const [showAdd, setShowAdd] = useState(false);
  const [newHouseNo, setNewHouseNo] = useState("");
  const [newVillageNo, setNewVillageNo] = useState<number>(
    VILLAGES[0]?.no ?? 1
  );

  // ✅ สร้างข้อมูลทะเบียนบ้านจาก MOCK_CITIZENS ครั้งแรก
  useEffect(() => {
    const map = new Map<string, Household>();

    MOCK_CITIZENS.forEach((c) => {
      const key = `${c.houseNo}__${c.villageNo}`;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          houseNo: c.houseNo,
          villageNo: c.villageNo,
          villageName: c.villageName,
          residents: [],
        });
      }
      map.get(key)!.residents.push(c);
    });

    const initialHouseholds = Array.from(map.values()).sort((a, b) => {
      if (a.villageNo !== b.villageNo) {
        return a.villageNo - b.villageNo;
      }
      return a.houseNo.localeCompare(b.houseNo, "th");
    });

    setHouseholds(initialHouseholds);
  }, []);

  const totalHouseholds = households.length;
  const totalCitizens = MOCK_CITIZENS.length;
  const totalVillages = VILLAGES.length;

  const avgPerHousehold = useMemo(() => {
    return totalHouseholds > 0
      ? (totalCitizens / totalHouseholds).toFixed(1)
      : "0";
  }, [totalCitizens, totalHouseholds]);

  // ✅ ฟิลเตอร์ทะเบียนบ้าน
  const filteredHouseholds = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    return households.filter((h) => {
      const inVillageFilter =
        !villageFilter || h.villageNo.toString() === villageFilter;

      const inText =
        !text ||
        h.houseNo.toLowerCase().includes(text) ||
        h.villageNo.toString().includes(text) ||
        h.villageName.toLowerCase().includes(text) ||
        // ค้นจากชื่อคนในบ้านได้ด้วย
        h.residents.some(
          (r) =>
            r.fullName.toLowerCase().includes(text) ||
            r.nationalId.includes(text)
        );

      return inVillageFilter && inText;
    });
  }, [households, searchText, villageFilter]);

  const openDetail = (h: Household) => {
    setSelectedHousehold(h);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedHousehold(null);
  };

  // ✅ เพิ่มทะเบียนบ้านใหม่ (ไม่มีผู้อาศัยในตอนแรก)
  const addHousehold = () => {
    const houseNo = newHouseNo.trim();
    if (!houseNo) {
      alert("กรุณากรอกบ้านเลขที่");
      return;
    }

    const vNo = Number(newVillageNo);
    const vName = VILLAGES.find((v) => v.no === vNo)?.name || "";

    // กันกรณีทะเบียนบ้านซ้ำ
    const exists = households.some(
      (h) => h.houseNo === houseNo && h.villageNo === vNo
    );
    if (exists) {
      alert("ทะเบียนบ้านนี้มีอยู่แล้วในระบบ");
      return;
    }

    const id = `${houseNo}__${vNo}`;
    const newH: Household = {
      id,
      houseNo,
      villageNo: vNo,
      villageName: vName,
      residents: [], // ตอนนี้ยังไม่มีผู้อาศัย
    };

    setHouseholds((prev) => [...prev, newH]);
    setShowAdd(false);
    setNewHouseNo("");
    setNewVillageNo(VILLAGES[0]?.no ?? 1);
  };

  return (
    <div className={styles.layout}>
      <Header />

      <div style={{ display: "flex", flex: 1, width: "100%" }}>
        <Sidebar />

        <div className={styles.mainContainer}>
          <div className={styles.container}>
            <h1 className={styles.formTitle}>
              ข้อมูลทะเบียนบ้าน เทศบาลตำบลอุโมง (Household RSPM)
            </h1>

            {/* ===== การ์ดสรุป ===== */}
            <section className={styles.summarySection}>
              <div className={styles.summaryHeader}>
                <h4>สรุปภาพรวมทะเบียนบ้านในเขตเทศบาลตำบลอุโมง</h4>
              </div>

              <div className={styles.summaryContainer}>
                {/* การ์ด 1: จำนวนทะเบียนบ้าน */}
                <div
                  className={styles.summaryCard}
                  style={{ backgroundColor: "#007bff" }}
                >
                  <div className={styles.summaryHeader}>
                    <h4>จำนวนทะเบียนบ้านทั้งหมด</h4>
                  </div>
                  <div className={styles.value}>{totalHouseholds}</div>
                  <div className={styles.summaryFooter}>
                    <span className={styles.change}>
                      ในเขตเทศบาลตำบลอุโมง
                    </span>
                    <span className={styles.icon}>
                      <FaHome />
                    </span>
                  </div>
                </div>

                {/* การ์ด 2: จำนวนประชาชนทั้งหมด */}
                <div
                  className={styles.summaryCard}
                  style={{ backgroundColor: "#ff9800" }}
                >
                  <div className={styles.summaryHeader}>
                    <h4>จำนวนประชาชนทั้งหมด</h4>
                  </div>
                  <div className={styles.value}>{totalCitizens}</div>
                  <div className={styles.summaryFooter}>
                    <span className={styles.change}>
                      จากข้อมูลทะเบียนบ้านทั้งหมด
                    </span>
                    <span className={styles.icon}>
                      <FaUsers />
                    </span>
                  </div>
                </div>

                {/* การ์ด 3: จำนวนหมู่บ้าน */}
                <div
                  className={styles.summaryCard}
                  style={{ backgroundColor: "#f44336" }}
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
                      <FaMapMarkerAlt />
                    </span>
                  </div>
                </div>

                {/* การ์ด 4: เฉลี่ยประชาชนต่อทะเบียนบ้าน */}
                <div
                  className={styles.summaryCard}
                  style={{ backgroundColor: "#4caf50" }}
                >
                  <div className={styles.summaryHeader}>
                    <h4>เฉลี่ยประชาชนต่อทะเบียนบ้าน</h4>
                  </div>
                  <div className={styles.value}>{avgPerHousehold}</div>
                  <div className={styles.summaryFooter}>
                    <span className={styles.change}>
                      คำนวณจาก {totalHouseholds} ทะเบียนบ้าน
                    </span>
                    <span className={styles.icon}>
                      <FaChartBar />
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
                  placeholder="บ้านเลขที่, หมู่ที่, หมู่บ้าน, ชื่อคนในบ้าน..."
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

            {/* ===== ปุ่มเพิ่มทะเบียนบ้าน (ล่างฟิลเตอร์) ===== */}
            <div className={styles.addButtonRow}>
              <button
                type="button"
                className={styles.addButton}
                onClick={() => setShowAdd(true)}
              >
                + เพิ่มทะเบียนบ้าน
              </button>
            </div>

            {/* ===== Table Section ===== */}
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>บ้านเลขที่</th>
                  <th>หมู่ที่</th>
                  <th>หมู่บ้าน</th>
                  <th>จำนวนผู้อาศัย</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredHouseholds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      ไม่พบข้อมูลทะเบียนบ้านที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredHouseholds.map((h, index) => (
                    <tr key={h.id}>
                      <td>{index + 1}</td>
                      <td>{h.houseNo}</td>
                      <td>{h.villageNo}</td>
                      <td>{h.villageName}</td>
                      <td>{h.residents.length}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.viewButton}
                          onClick={() => openDetail(h)}
                        >
                          ดูรายชื่อ
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

      {/* ===== Modal แสดงรายชื่อคนในบ้าน ===== */}
      {showDetail && selectedHousehold && (
        <div className={styles.modalOverlay} onClick={closeDetail}>
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                รายชื่อผู้อาศัย บ้านเลขที่ {selectedHousehold.houseNo} หมู่ที่{" "}
                {selectedHousehold.villageNo} {selectedHousehold.villageName}
              </h3>
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
              {selectedHousehold.residents.length === 0 ? (
                <p>ไม่พบข้อมูลผู้อาศัยในทะเบียนบ้านนี้</p>
              ) : (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>ชื่อ - นามสกุล</th>
                      <th>เลขบัตรประชาชน</th>
                      <th>เพศ</th>
                      <th>วัน เดือน ปีเกิด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHousehold.residents.map((r, idx) => (
                      <tr key={r.id}>
                        <td>{idx + 1}</td>
                        <td>{r.fullName}</td>
                        <td>{r.nationalId}</td>
                        <td>{r.gender}</td>
                        <td>{r.birthDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div
                style={{
                  marginTop: 16,
                  fontSize: "0.9rem",
                  color: "#374151",
                  lineHeight: 1.5,
                }}
              >
                <strong>ที่อยู่:</strong>{" "}
                บ้านเลขที่ {selectedHousehold.houseNo} หมู่ที่{" "}
                {selectedHousehold.villageNo} {selectedHousehold.villageName}{" "}
                ตำบลอุโมง อำเภออุโมง จังหวัดลำพูน 51150
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal เพิ่มทะเบียนบ้าน ===== */}
      {showAdd && (
        <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>เพิ่มทะเบียนบ้านใหม่</h3>
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
                <label>บ้านเลขที่</label>
                <input
                  type="text"
                  value={newHouseNo}
                  onChange={(e) => setNewHouseNo(e.target.value)}
                />
              </div>

              <div className={styles.modalRow}>
                <label>หมู่ที่ / หมู่บ้าน</label>
                <select
                  value={newVillageNo}
                  onChange={(e) => setNewVillageNo(Number(e.target.value))}
                >
                  {VILLAGES.map((v) => (
                    <option key={v.no} value={v.no}>
                      หมู่ที่ {v.no} - {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.addModalFooter}>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={addHousehold}
                >
                  บันทึกทะเบียนบ้าน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Household_RSPM;
