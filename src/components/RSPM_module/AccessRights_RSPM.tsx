// src/components/RSPM_module/AccessRights_RSPM.tsx
import React, { useMemo, useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import styles from "./AccessRights_RSPM.module.css";

type AccessRight = {
    id: string;
    code: string; // รหัสสิทธิ์ (เช่น AR-001)
    name: string; // ชื่อสิทธิ์
    level: string; // ระดับชั้น เช่น ผู้ดูแล/เจ้าหน้าที่/ผู้ใช้ทั่วไป
    scope: string; // ขอบเขตระบบที่เข้าถึงได้
    description: string; // รายละเอียดเพิ่มเติม
    active: boolean; // สถานะใช้งาน
};

// 🔹 ข้อมูล mock เริ่มต้น
const INITIAL_ACCESS_RIGHTS: AccessRight[] = [
    {
        id: "1",
        code: "AR-001",
        name: "ผู้ดูแลระบบ RSPM (Admin)",
        level: "ระดับผู้ดูแลระบบ",
        scope: "จัดการโมดูล RSPM ทั้งหมด, ตั้งค่าระบบ, จัดการสิทธิ์ผู้ใช้งาน",
        description:
            "สามารถเข้าถึงทุกหน้าจอในโมดูล RSPM, แก้ไขตั้งค่า, จัดการประเภทงาน, ระดับงาน, สิทธิ์การเข้าถึง และดูรายงานภาพรวม",
        active: true,
    },
    {
        id: "2",
        code: "AR-002",
        name: "เจ้าหน้าที่รับเรื่องร้องเรียน",
        level: "ระดับเจ้าหน้าที่",
        scope: "รับเรื่องร้องเรียน, บันทึกข้อมูลเบื้องต้น, แนบรูปภาพ/พิกัด",
        description:
            "ใช้สำหรับเจ้าหน้าที่ที่รับแจ้งเรื่องร้องเรียนจากประชาชน สามารถบันทึก แก้ไขข้อมูลคำร้องก่อนส่งต่อหน่วยงานที่เกี่ยวข้อง",
        active: true,
    },
    {
        id: "3",
        code: "AR-003",
        name: "เจ้าหน้าที่ตรวจสอบภาคสนาม",
        level: "ระดับเจ้าหน้าที่",
        scope: "ดูรายการคำร้องที่มอบหมาย, บันทึกผลตรวจสอบ, อัปโหลดรูปก่อน-หลัง",
        description:
            "เหมาะกับเจ้าหน้าที่ภาคสนามที่ต้องอัปเดตสถานะการดำเนินการ ตรวจสอบหน้างาน และถ่ายรูปประกอบ",
        active: true,
    },
    {
        id: "4",
        code: "AR-004",
        name: "หัวหน้าหน่วยงาน/ผู้บริหาร",
        level: "ระดับหัวหน้าหน่วยงาน",
        scope: "ดูรายงานสรุป, กรองข้อมูลตามประเภทงาน/หมู่บ้าน, อนุมัติปิดงาน",
        description:
            "ใช้สำหรับหัวหน้าสำนัก/หัวหน้ากอง ที่ต้องการติดตามภาพรวมงานร้องเรียนในพื้นที่ และอนุมัติการปิดงาน",
        active: true,
    },
    {
        id: "5",
        code: "AR-005",
        name: "ผู้ใช้งานทั่วไป (อ่านอย่างเดียว)",
        level: "ระดับผู้ใช้งานทั่วไป",
        scope: "ดูสถานะคำร้องของตนเอง, ดูข้อมูลแจ้งเตือน, ดูประกาศ",
        description:
            "จำกัดสิทธิ์ให้ดูข้อมูลเฉพาะคำร้อง/ข้อมูลที่เกี่ยวข้องกับบัญชีผู้ใช้ของตนเอง ไม่สามารถแก้ไขข้อมูลในระบบได้",
        active: true,
    },
    {
        id: "6",
        code: "AR-006",
        name: "บัญชีปิดการใช้งาน",
        level: "ปิดการใช้งาน",
        scope: "ไม่มีสิทธิ์เข้าถึงระบบ RSPM",
        description:
            "ใช้สำหรับบัญชีที่ถูกยกเลิกการใช้งาน หรืออยู่ระหว่างรอดำเนินการตรวจสอบสิทธิ์",
        active: false,
    },
];

const AccessRights_RSPM: React.FC = () => {
    const [accessRights, setAccessRights] =
        useState<AccessRight[]>(INITIAL_ACCESS_RIGHTS);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">(
        ""
    );

    const [selectedRight, setSelectedRight] = useState<AccessRight | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    // Modal เพิ่มสิทธิ์
    const [showAdd, setShowAdd] = useState(false);
    const [newRight, setNewRight] = useState<Omit<AccessRight, "id" | "code">>({
        name: "",
        level: "ระดับผู้ใช้งานทั่วไป",
        scope: "",
        description: "",
        active: true,
    });

    const totalRights = accessRights.length;
    const activeCount = accessRights.filter((r) => r.active).length;
    const inactiveCount = totalRights - activeCount;

    const filteredRights = useMemo(() => {
        const text = searchText.trim().toLowerCase();

        return accessRights.filter((r) => {
            const matchText =
                !text ||
                r.code.toLowerCase().includes(text) ||
                r.name.toLowerCase().includes(text) ||
                r.level.toLowerCase().includes(text) ||
                r.scope.toLowerCase().includes(text) ||
                r.description.toLowerCase().includes(text);

            const matchStatus =
                !statusFilter ||
                (statusFilter === "active" && r.active) ||
                (statusFilter === "inactive" && !r.active);

            return matchText && matchStatus;
        });
    }, [accessRights, searchText, statusFilter]);

    const openDetail = (right: AccessRight) => {
        setSelectedRight(right);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedRight(null);
    };

    const openAddModal = () => {
        setNewRight({
            name: "",
            level: "ระดับผู้ใช้งานทั่วไป",
            scope: "",
            description: "",
            active: true,
        });
        setShowAdd(true);
    };

    const generateNextCode = (count: number) => {
        const nextNumber = count + 1;
        return `AR-${nextNumber.toString().padStart(3, "0")}`;
    };

    const handleAddRight = () => {
        if (!newRight.name.trim()) {
            alert("กรุณากรอกชื่อสิทธิ์การเข้าถึง");
            return;
        }

        const nextCode = generateNextCode(accessRights.length);
        const newRecord: AccessRight = {
            id: (accessRights.length + 1).toString(),
            code: nextCode,
            ...newRight,
        };

        setAccessRights((prev) => [...prev, newRecord]);
        setShowAdd(false);
    };

    const toggleStatus = (id: string) => {
        setAccessRights((prev) =>
            prev.map((r) =>
                r.id === id
                    ? {
                        ...r,
                        active: !r.active,
                    }
                    : r
            )
        );
    };

    return (
        <div className={styles.layout}>
            <Header />

            <div style={{ display: "flex", flex: 1, width: "100%" }}>
                <Sidebar />

                <div className={styles.mainContainer}>
                    <div className={styles.container}>
                        <h1 className={styles.formTitle}>
                            ข้อมูลสิทธิ์การเข้าถึงระบบ (Access Rights RSPM)
                        </h1>

                        {/* ===== Summary Section ===== */}
                        <section className={styles.summarySection}>
                            <div className={styles.summaryHeader}>
                                <h4>สรุปภาพรวมสิทธิ์การเข้าถึงระบบในโมดูล RSPM</h4>
                            </div>

                            <div className={styles.summaryContainer}>
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#0b57d0" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>จำนวนสิทธิ์ทั้งหมด</h4>
                                    </div>
                                    <div className={styles.value}>{totalRights}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            สิทธิ์ทั้งหมดที่ตั้งค่าในระบบ
                                        </span>
                                        <span className={styles.icon}>🔐</span>
                                    </div>
                                </div>

                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#16a34a" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>สิทธิ์ที่เปิดใช้งาน</h4>
                                    </div>
                                    <div className={styles.value}>{activeCount}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            ใช้งานในบัญชีผู้ใช้ปัจจุบัน
                                        </span>
                                        <span className={styles.icon}>✅</span>
                                    </div>
                                </div>

                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#f59e0b" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>สิทธิ์ที่ถูกปิดใช้งาน</h4>
                                    </div>
                                    <div className={styles.value}>{inactiveCount}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            รอพิจารณาหรือเลิกใช้งาน
                                        </span>
                                        <span className={styles.icon}>⏸️</span>
                                    </div>
                                </div>

                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#9333ea" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>รูปแบบสิทธิ์ตัวอย่าง</h4>
                                    </div>
                                    <div className={styles.value}>4+</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            ผู้ดูแล / เจ้าหน้าที่ / หัวหน้า / ผู้ใช้ทั่วไป
                                        </span>
                                        <span className={styles.icon}>📊</span>
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
                                    placeholder="ค้นหาจากรหัสสิทธิ์, ชื่อสิทธิ์, ระดับ, ขอบเขต, คำอธิบาย..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <label>สถานะ</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value as "" | "active" | "inactive")
                                    }
                                >
                                    <option value="">ทุกสถานะ</option>
                                    <option value="active">เปิดใช้งาน</option>
                                    <option value="inactive">ปิดใช้งาน</option>
                                </select>
                            </div>
                        </div>

                        {/* ปุ่มเพิ่มสิทธิ์ */}
                        <div className={styles.addButtonRow}>
                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={openAddModal}
                            >
                                + เพิ่มสิทธิ์การเข้าถึง
                            </button>
                        </div>

                        {/* ===== Table Section ===== */}
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>รหัสสิทธิ์</th>
                                    <th>ชื่อสิทธิ์</th>
                                    <th>ระดับชั้น</th>
                                    <th>สถานะ</th>
                                    <th>การดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRights.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className={styles.emptyState}>
                                            ไม่พบข้อมูลสิทธิ์การเข้าถึงตามเงื่อนไขที่ค้นหา
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRights.map((r, index) => (
                                        <tr key={r.id}>
                                            <td>{index + 1}</td>
                                            <td>{r.code}</td>
                                            <td>{r.name}</td>
                                            <td>{r.level}</td>
                                            <td>
                                                <span
                                                    className={`${styles.statusBadge} ${r.active ? styles.statusActive : styles.statusInactive
                                                        }`}
                                                >
                                                    {r.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.viewButton}
                                                    onClick={() => openDetail(r)}
                                                >
                                                    ดูรายละเอียด
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.toggleButton}
                                                    onClick={() => toggleStatus(r.id)}
                                                >
                                                    {r.active ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
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

            {/* ===== Modal แสดงรายละเอียดสิทธิ์ ===== */}
            {showDetail && selectedRight && (
                <div className={styles.modalOverlay} onClick={closeDetail}>
                    <div
                        className={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>รายละเอียดสิทธิ์การเข้าถึงระบบ</h3>
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
                                <label>รหัสสิทธิ์</label>
                                <span>{selectedRight.code}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>ชื่อสิทธิ์</label>
                                <span>{selectedRight.name}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>ระดับชั้นการเข้าถึง</label>
                                <span>{selectedRight.level}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>ขอบเขตการเข้าถึงระบบ</label>
                                <span>{selectedRight.scope}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>คำอธิบายเพิ่มเติม</label>
                                <span>{selectedRight.description}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>สถานะ</label>
                                <span>
                                    {selectedRight.active ? "เปิดใช้งาน" : "ปิดใช้งาน / ระงับ"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Modal เพิ่มสิทธิ์ใหม่ ===== */}
            {showAdd && (
                <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
                    <div
                        className={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>เพิ่มสิทธิ์การเข้าถึงระบบ</h3>
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
                                <label>ชื่อสิทธิ์ *</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={newRight.name}
                                    onChange={(e) =>
                                        setNewRight({ ...newRight, name: e.target.value })
                                    }
                                    placeholder="เช่น เจ้าหน้าที่ดูแลคำร้อง, ผู้ดูแลระบบ RSPM"
                                />
                            </div>

                            <div className={styles.modalRow}>
                                <label>ระดับชั้นการเข้าถึง</label>
                                <select
                                    className={styles.input}
                                    value={newRight.level}
                                    onChange={(e) =>
                                        setNewRight({ ...newRight, level: e.target.value })
                                    }
                                >
                                    <option value="ระดับผู้ดูแลระบบ">
                                        ระดับผู้ดูแลระบบ (Admin)
                                    </option>
                                    <option value="ระดับหัวหน้าหน่วยงาน">
                                        ระดับหัวหน้าหน่วยงาน
                                    </option>
                                    <option value="ระดับเจ้าหน้าที่">ระดับเจ้าหน้าที่</option>
                                    <option value="ระดับผู้ใช้งานทั่วไป">
                                        ระดับผู้ใช้งานทั่วไป
                                    </option>
                                    <option value="อื่น ๆ / กำหนดเอง">อื่น ๆ / กำหนดเอง</option>
                                </select>
                            </div>

                            <div className={styles.modalRow}>
                                <label>ขอบเขตการเข้าถึงระบบ</label>
                                <textarea
                                    className={styles.textarea}
                                    value={newRight.scope}
                                    onChange={(e) =>
                                        setNewRight({ ...newRight, scope: e.target.value })
                                    }
                                    placeholder="เช่น เข้าถึงหน้า Dashboard, ดูคำร้องทุกหมู่บ้าน, แก้ไขสถานะคำร้องในเขตความรับผิดชอบ"
                                />
                            </div>

                            <div className={styles.modalRow}>
                                <label>คำอธิบายเพิ่มเติม</label>
                                <textarea
                                    className={styles.textarea}
                                    value={newRight.description}
                                    onChange={(e) =>
                                        setNewRight({
                                            ...newRight,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับสิทธิ์นี้"
                                />
                            </div>

                            <div className={styles.modalRow}>
                                <label>สถานะเริ่มต้น</label>
                                <select
                                    className={styles.input}
                                    value={newRight.active ? "active" : "inactive"}
                                    onChange={(e) =>
                                        setNewRight({
                                            ...newRight,
                                            active: e.target.value === "active",
                                        })
                                    }
                                >
                                    <option value="active">เปิดใช้งาน</option>
                                    <option value="inactive">ปิดใช้งาน</option>
                                </select>
                            </div>

                            <div className={styles.addModalFooter}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setShowAdd(false)}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="button"
                                    className={styles.addButton}
                                    onClick={handleAddRight}
                                >
                                    บันทึกสิทธิ์ใหม่
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessRights_RSPM;
