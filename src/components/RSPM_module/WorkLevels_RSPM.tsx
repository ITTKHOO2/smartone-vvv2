// src/components/RSPM_module/WorkLevels_RSPM.tsx
import React, { useMemo, useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
// ถ้าใช้ไฟล์ css ตัวเดียวกับ service-types ให้ชี้ไปไฟล์นั้นได้เลย
import styles from "./ServiceTypes_RSPM.module.css";

type WorkLevel = {
    id: string;
    levelCode: string;        // รหัสระดับชั้น เช่น WL-001
    levelName: string;        // ชื่อระดับ เช่น ระดับปกติ
    description: string;      // คำอธิบาย
    priority: number;         // เลขลำดับความสำคัญ ยิ่งน้อยยิ่งด่วน
    recommendedSLA: string;   // SLA แนะนำ
    active: boolean;          // ใช้งานอยู่หรือไม่
};

// 🔹 ข้อมูลม็อคเริ่มต้น
const INITIAL_WORK_LEVELS: WorkLevel[] = [
    {
        id: "1",
        levelCode: "WL-001",
        levelName: "ระดับปกติ",
        description: "งานทั่วไปของประชาชนที่ไม่มีผลกระทบเร่งด่วน",
        priority: 3,
        recommendedSLA: "ภายใน 7 วันทำการ",
        active: true,
    },
    {
        id: "2",
        levelCode: "WL-002",
        levelName: "ระดับเร่งด่วน",
        description: "งานที่มีผลกระทบต่อการใช้ชีวิตประจำวันของประชาชน",
        priority: 2,
        recommendedSLA: "ภายใน 3 วันทำการ",
        active: true,
    },
    {
        id: "3",
        levelCode: "WL-003",
        levelName: "ระดับด่วนมาก",
        description: "งานที่มีผลกระทบสูง จำเป็นต้องดำเนินการทันที",
        priority: 1,
        recommendedSLA: "ภายใน 24 ชั่วโมง",
        active: true,
    },
    {
        id: "4",
        levelCode: "WL-004",
        levelName: "โครงการ/งานพิเศษ",
        description: "งานโครงการพิเศษที่ใช้เวลานานและมีหลายหน่วยงานร่วมกัน",
        priority: 4,
        recommendedSLA: "ตามแผนโครงการที่กำหนด",
        active: false,
    },
];

const WorkLevels_RSPM: React.FC = () => {
    const [workLevels, setWorkLevels] = useState<WorkLevel[]>(INITIAL_WORK_LEVELS);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const [showDetail, setShowDetail] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<WorkLevel | null>(null);

    // Modal เพิ่มระดับชั้น
    const [showAdd, setShowAdd] = useState(false);
    const [newLevel, setNewLevel] = useState<{
        levelName: string;
        description: string;
        priority: string;
        recommendedSLA: string;
        active: "active" | "inactive";
    }>({
        levelName: "",
        description: "",
        priority: "3",
        recommendedSLA: "",
        active: "active",
    });

    // ===== สรุปด้านบน =====
    const totalLevels = workLevels.length;
    const activeLevels = workLevels.filter((w) => w.active).length;

    const topPriorityName = useMemo(() => {
        const active = workLevels.filter((w) => w.active);
        if (active.length === 0) return "-";
        const sorted = [...active].sort((a, b) => a.priority - b.priority);
        return `${sorted[0].levelName} (Priority ${sorted[0].priority})`;
    }, [workLevels]);

    const avgPriority = useMemo(() => {
        if (workLevels.length === 0) return "-";
        const sum = workLevels.reduce((acc, w) => acc + w.priority, 0);
        return (sum / workLevels.length).toFixed(2);
    }, [workLevels]);

    // ===== ฟิลเตอร์ =====
    const filteredLevels = useMemo(() => {
        const text = searchText.trim().toLowerCase();

        return workLevels.filter((w) => {
            const matchText =
                !text ||
                w.levelName.toLowerCase().includes(text) ||
                w.levelCode.toLowerCase().includes(text) ||
                w.description.toLowerCase().includes(text) ||
                w.recommendedSLA.toLowerCase().includes(text) ||
                String(w.priority).includes(text);

            const matchStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                        ? w.active
                        : !w.active;

            return matchText && matchStatus;
        });
    }, [workLevels, searchText, statusFilter]);

    // ===== จัดการ Modal รายละเอียด =====
    const openDetail = (lvl: WorkLevel) => {
        setSelectedLevel(lvl);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedLevel(null);
    };

    // ===== Toggle สถานะ =====
    const toggleStatus = (id: string) => {
        setWorkLevels((prev) =>
            prev.map((w) =>
                w.id === id
                    ? {
                        ...w,
                        active: !w.active,
                    }
                    : w
            )
        );
    };

    // ===== เพิ่มระดับใหม่ =====
    const resetNewLevel = () => {
        setNewLevel({
            levelName: "",
            description: "",
            priority: "3",
            recommendedSLA: "",
            active: "active",
        });
    };

    const generateNextCode = () => {
        if (workLevels.length === 0) return "WL-001";
        const codes = workLevels
            .map((w) => w.levelCode)
            .filter((c) => c.startsWith("WL-"));
        const numbers = codes
            .map((c) => parseInt(c.replace("WL-", ""), 10))
            .filter((n) => !Number.isNaN(n));
        const max = numbers.length > 0 ? Math.max(...numbers) : 0;
        const next = max + 1;
        return `WL-${next.toString().padStart(3, "0")}`;
    };

    const handleAddLevel = () => {
        if (!newLevel.levelName.trim()) {
            alert("กรุณากรอกชื่อระดับชั้นการทำงาน");
            return;
        }

        const priorityNum = parseInt(newLevel.priority, 10);
        if (Number.isNaN(priorityNum) || priorityNum <= 0) {
            alert("กรุณากรอกค่า Priority เป็นตัวเลขมากกว่า 0");
            return;
        }

        const nextId = (workLevels.length + 1).toString();
        const nextCode = generateNextCode();

        const toAdd: WorkLevel = {
            id: nextId,
            levelCode: nextCode,
            levelName: newLevel.levelName.trim(),
            description: newLevel.description.trim() || "-",
            priority: priorityNum,
            recommendedSLA: newLevel.recommendedSLA.trim() || "-",
            active: newLevel.active === "active",
        };

        setWorkLevels((prev) => [...prev, toAdd]);
        setShowAdd(false);
        resetNewLevel();
    };

    return (
        <div className={styles.layout}>
            <Header />

            <div style={{ display: "flex", flex: 1, width: "100%" }}>
                <Sidebar />

                <div className={styles.mainContainer}>
                    <div className={styles.container}>
                        <h1 className={styles.formTitle}>
                            ข้อมูลระดับชั้นการทำงาน (Work Levels RSPM)
                        </h1>

                        {/* ===== Summary ===== */}
                        <section className={styles.summarySection}>
                            <div className={styles.summaryHeader}>
                                <h4>ภาพรวมระดับชั้นการทำงานในระบบ RSPM</h4>
                            </div>

                            <div className={styles.summaryContainer}>
                                {/* การ์ด 1: จำนวนระดับทั้งหมด */}
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#0b57d0" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>จำนวนระดับชั้นทั้งหมด</h4>
                                    </div>
                                    <div className={styles.value}>{totalLevels}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            ใช้กำหนดความสำคัญงานบริการ
                                        </span>
                                        <span className={styles.icon}>📊</span>
                                    </div>
                                </div>

                                {/* การ์ด 2: Active */}
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#16a34a" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>ระดับที่เปิดใช้งาน</h4>
                                    </div>
                                    <div className={styles.value}>{activeLevels}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>พร้อมใช้งานในแบบฟอร์ม</span>
                                        <span className={styles.icon}>✅</span>
                                    </div>
                                </div>

                                {/* การ์ด 3: Top Priority */}
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#f97316" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>ระดับที่มีความสำคัญสูงสุด (Active)</h4>
                                    </div>
                                    <div className={styles.value} style={{ fontSize: "1rem" }}>
                                        {topPriorityName}
                                    </div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            ใช้สำหรับงานที่ต้องเร่งดำเนินการ
                                        </span>
                                        <span className={styles.icon}>⏱️</span>
                                    </div>
                                </div>

                                {/* การ์ด 4: ค่า Priority เฉลี่ย */}
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#6366f1" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>ค่า Priority เฉลี่ย</h4>
                                    </div>
                                    <div className={styles.value}>{avgPriority}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            ยิ่งใกล้ 1 แสดงว่างานโดยรวมค่อนข้างเร่งด่วน
                                        </span>
                                        <span className={styles.icon}>📈</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ===== Filter Section ===== */}
                        <div className={styles.filterContainer}>
                            <div className={styles.filterItem}>
                                <label>ค้นหาระดับชั้นการทำงาน</label>
                                <input
                                    type="text"
                                    placeholder="รหัส, ชื่อระดับ, คำอธิบาย, Priority, SLA..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <label>สถานะการใช้งาน</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value as "all" | "active" | "inactive")
                                    }
                                >
                                    <option value="all">ทั้งหมด</option>
                                    <option value="active">ใช้งานอยู่</option>
                                    <option value="inactive">ปิดใช้งาน</option>
                                </select>
                            </div>
                        </div>

                        {/* ===== ปุ่มเพิ่มระดับชั้น ===== */}
                        <div className={styles.addButtonRow}>
                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={() => setShowAdd(true)}
                            >
                                + เพิ่มระดับชั้นการทำงาน
                            </button>
                        </div>

                        {/* ===== Table Section ===== */}
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>รหัสระดับ</th>
                                    <th>ชื่อระดับชั้น</th>
                                    <th>Priority</th>
                                    <th>SLA แนะนำ</th>
                                    <th>สถานะ</th>
                                    <th>การดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLevels.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className={styles.emptyState}>
                                            ไม่พบข้อมูลระดับชั้นการทำงานตามเงื่อนไขที่ค้นหา
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLevels.map((w, index) => (
                                        <tr key={w.id}>
                                            <td>{index + 1}</td>
                                            <td>{w.levelCode}</td>
                                            <td>{w.levelName}</td>
                                            <td>{w.priority}</td>
                                            <td>{w.recommendedSLA}</td>
                                            <td>
                                                <span
                                                    className={`${styles.statusBadge} ${w.active ? styles.statusActive : styles.statusInactive
                                                        }`}
                                                >
                                                    {w.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                                </span>
                                            </td>
                                            <td className={styles.actionCell}>
                                                <button
                                                    type="button"
                                                    className={styles.viewButton}
                                                    onClick={() => openDetail(w)}
                                                >
                                                    ดูรายละเอียด
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.toggleButton}
                                                    onClick={() => toggleStatus(w.id)}
                                                >
                                                    {w.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}
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

            {/* ===== Modal รายละเอียด ===== */}
            {showDetail && selectedLevel && (
                <div className={styles.modalOverlay} onClick={closeDetail}>
                    <div
                        className={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>รายละเอียดระดับชั้นการทำงาน</h3>
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
                                <label>รหัสระดับ</label>
                                <span>{selectedLevel.levelCode}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>ชื่อระดับชั้น</label>
                                <span>{selectedLevel.levelName}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>Priority</label>
                                <span>{selectedLevel.priority}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>SLA แนะนำ</label>
                                <span>{selectedLevel.recommendedSLA}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>คำอธิบาย</label>
                                <span>{selectedLevel.description}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>สถานะ</label>
                                <span>
                                    {selectedLevel.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Modal เพิ่มระดับชั้นใหม่ ===== */}
            {showAdd && (
                <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
                    <div
                        className={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>เพิ่มระดับชั้นการทำงาน</h3>
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
                                <label>ชื่อระดับชั้นการทำงาน</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={newLevel.levelName}
                                    onChange={(e) =>
                                        setNewLevel({ ...newLevel, levelName: e.target.value })
                                    }
                                    placeholder="เช่น ระดับปกติ, ระดับเร่งด่วน, ระดับด่วนมาก"
                                />
                            </div>

                            <div className={styles.modalRow}>
                                <label>คำอธิบาย</label>
                                <textarea
                                    className={styles.textarea}
                                    value={newLevel.description}
                                    onChange={(e) =>
                                        setNewLevel({ ...newLevel, description: e.target.value })
                                    }
                                    placeholder="อธิบายลักษณะของระดับชั้นนี้ เช่น ใช้กับงานประเภทใด ความสำคัญประมาณไหน"
                                />
                            </div>

                            <div className={styles.modalRowInline}>
                                <div className={styles.modalCol}>
                                    <label>Priority (ตัวเลข ยิ่งน้อยยิ่งด่วน)</label>
                                    <input
                                        className={styles.input}
                                        type="number"
                                        min={1}
                                        value={newLevel.priority}
                                        onChange={(e) =>
                                            setNewLevel({ ...newLevel, priority: e.target.value })
                                        }
                                    />
                                </div>

                                <div className={styles.modalCol}>
                                    <label>สถานะ</label>
                                    <select
                                        className={styles.input}
                                        value={newLevel.active}
                                        onChange={(e) =>
                                            setNewLevel({
                                                ...newLevel,
                                                active: e.target.value as "active" | "inactive",
                                            })
                                        }
                                    >
                                        <option value="active">เปิดใช้งาน</option>
                                        <option value="inactive">ปิดใช้งาน</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.modalRow}>
                                <label>SLA แนะนำ</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={newLevel.recommendedSLA}
                                    onChange={(e) =>
                                        setNewLevel({
                                            ...newLevel,
                                            recommendedSLA: e.target.value,
                                        })
                                    }
                                    placeholder="เช่น ภายใน 3 วันทำการ, ภายใน 24 ชั่วโมง"
                                />
                            </div>

                            <div className={styles.addModalFooter}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setShowAdd(false);
                                        resetNewLevel();
                                    }}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="button"
                                    className={styles.addButton}
                                    onClick={handleAddLevel}
                                >
                                    บันทึกระดับชั้นใหม่
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkLevels_RSPM;
