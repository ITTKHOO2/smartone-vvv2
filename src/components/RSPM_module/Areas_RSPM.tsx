// src/components/RSPM_module/Areas_RSPM.tsx
import React, { useMemo, useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import styles from "./Areas_RSPM.module.css";

// --------------------- Mock ข้อมูลพื้นที่ -------------------------
type Area = {
    id: string;
    villageNo: number;
    name: string;
    population: number;
    areaSize: number; // ตารางกม.
    households: number;
    density: number; // คน / ตร.กม.
    landmarks: string[];
    note?: string;
};

const AREAS: Area[] = [
    {
        id: "1",
        villageNo: 1,
        name: "บ้านอุโมงค์",
        population: 920,
        areaSize: 2.1,
        households: 310,
        density: 438,
        landmarks: ["วัดอุโมงค์เหนือ", "ตลาดสดอุโมงค์"],
    },
    {
        id: "2",
        villageNo: 2,
        name: "บ้านกอม่วง",
        population: 540,
        areaSize: 1.4,
        households: 180,
        density: 385,
        landmarks: ["ลานกีฬาเอนกประสงค์", "สวนสาธารณะกอม่วง"],
    },
    {
        id: "3",
        villageNo: 3,
        name: "บ้านอุโมงค์ (ใต้)",
        population: 770,
        areaSize: 1.9,
        households: 250,
        density: 405,
        landmarks: ["โรงเรียนอุโมงค์ใต้", "วัดอุโมงค์ใต้"],
    },
    {
        id: "4",
        villageNo: 4,
        name: "บ้านป่าไผ่",
        population: 620,
        areaSize: 2.5,
        households: 210,
        density: 248,
        landmarks: ["วัดป่าไผ่", "ถนนสายหลักเชื่อมตัวเมือง"],
    },
    {
        id: "5",
        villageNo: 5,
        name: "บ้านอุโมงค์ (กลาง)",
        population: 850,
        areaSize: 1.7,
        households: 300,
        density: 500,
        landmarks: ["ศูนย์พัฒนาเด็กเล็ก", "โรงพยาบาลส่งเสริมสุขภาพตำบล"],
    },
    {
        id: "6",
        villageNo: 6,
        name: "บ้านอุโมงค์ (เหนือ)",
        population: 410,
        areaSize: 1.1,
        households: 135,
        density: 372,
        landmarks: ["ลานชุมชนบ้านเหนือ"],
    },
    {
        id: "7",
        villageNo: 7,
        name: "บ้านเชตวัน (หนองหมู)",
        population: 690,
        areaSize: 2.0,
        households: 220,
        density: 345,
        landmarks: ["วัดเชตวัน", "บ่อบำบัดน้ำเสีย"],
    },
    {
        id: "8",
        villageNo: 8,
        name: "บ้านไร่",
        population: 510,
        areaSize: 1.6,
        households: 180,
        density: 318,
        landmarks: ["วัดบ้านไร่", "ชุมชนเกษตรกรรม"],
    },
    {
        id: "9",
        villageNo: 9,
        name: "บ้านอุโมงค์ในเก่า",
        population: 470,
        areaSize: 1.3,
        households: 150,
        density: 361,
        landmarks: ["โบราณสถานอุโมงค์โบราณ"],
    },
    {
        id: "10",
        villageNo: 10,
        name: "บ้านดอนทราย",
        population: 380,
        areaSize: 1.9,
        households: 120,
        density: 200,
        landmarks: ["ทุ่งดอนทราย", "ลานออกกำลังกาย"],
    },
    {
        id: "11",
        villageNo: 11,
        name: "บ้านอุโมงค์ล่าง",
        population: 450,
        areaSize: 1.8,
        households: 160,
        density: 250,
        landmarks: ["วัดอุโมงค์ล่าง"],
    },
];

// ----------------------------------------------------------

const Areas_RSPM: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);

    const totalAreas = AREAS.length;
    const totalPopulation = AREAS.reduce((sum, a) => sum + a.population, 0);

    const filteredAreas = useMemo(() => {
        const s = searchText.toLowerCase();
        return AREAS.filter(
            (a) =>
                a.name.toLowerCase().includes(s) ||
                a.villageNo.toString().includes(s)
        );
    }, [searchText]);

    return (
        <div className={styles.layout}>
            <Header />

            <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />

                <div className={styles.mainContainer}>
                    <div className={styles.container}>
                        <h1 className={styles.formTitle}>ข้อมูลพื้นที่ (Areas RSPM)</h1>

                        {/* Summary */}
                        <section className={styles.summarySection}>
                            <div className={styles.summaryHeader}>
                                <h4>สรุปข้อมูลพื้นที่ในเขตเทศบาลตำบลอุโมง</h4>
                            </div>

                            <div className={styles.summaryContainer}>
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#0b57d0" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>จำนวนหมู่บ้านทั้งหมด</h4>
                                    </div>
                                    <div className={styles.value}>{totalAreas}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>หมู่ที่ 1 - 11</span>
                                        <span className={styles.icon}>📌</span>
                                    </div>
                                </div>

                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#16a34a" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>จำนวนประชากรรวม</h4>
                                    </div>
                                    <div className={styles.value}>{totalPopulation}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            จากทุกหมู่บ้านในตำบลอุโมง
                                        </span>
                                        <span className={styles.icon}>👥</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Filter */}
                        <div className={styles.filterContainer}>
                            <div className={styles.filterItem}>
                                <label>ค้นหาข้อมูลหมู่บ้าน</label>
                                <input
                                    type="text"
                                    placeholder="เช่น หมู่ 1, บ้านอุโมงค์..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>หมู่</th>
                                    <th>ชื่อหมู่บ้าน</th>
                                    <th>ประชากร</th>
                                    <th>ครัวเรือน</th>
                                    <th>พื้นที่ (ตร.กม.)</th>
                                    <th>ความหนาแน่น</th>
                                    <th>การดำเนินการ</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAreas.map((a) => (
                                    <tr key={a.id}>
                                        <td>{a.villageNo}</td>
                                        <td>{a.name}</td>
                                        <td>{a.population}</td>
                                        <td>{a.households}</td>
                                        <td>{a.areaSize}</td>
                                        <td>{a.density} คน/ตร.กม.</td>
                                        <td>
                                            <button
                                                className={styles.viewButton}
                                                onClick={() => setSelectedArea(a)}
                                            >
                                                ดูรายละเอียด
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Modal */}
            {selectedArea && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setSelectedArea(null)}
                >
                    <div
                        className={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>ข้อมูลพื้นที่หมู่ {selectedArea.villageNo}</h3>
                            <button
                                className={styles.modalClose}
                                onClick={() => setSelectedArea(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.modalRow}>
                                <label>ชื่อหมู่บ้าน</label>
                                <span>{selectedArea.name}</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>จำนวนประชากร</label>
                                <span>{selectedArea.population}</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>ครัวเรือนทั้งหมด</label>
                                <span>{selectedArea.households}</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>พื้นที่</label>
                                <span>{selectedArea.areaSize} ตร.กม.</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>ความหนาแน่น</label>
                                <span>{selectedArea.density} คน/ตร.กม.</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>สถานที่สำคัญ</label>
                                <span>{selectedArea.landmarks.join(" , ")}</span>
                            </div>

                            {selectedArea.note && (
                                <div className={styles.modalRow}>
                                    <label>หมายเหตุ</label>
                                    <span>{selectedArea.note}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Areas_RSPM;
