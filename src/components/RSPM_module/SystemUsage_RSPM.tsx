// src/components/RSPM_module/SystemUsage_RSPM.tsx
import React, { useMemo, useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import styles from "./SystemUsage_RSPM.module.css";

type UsageStatus = "success" | "failed";

type SystemUsageLog = {
    id: string;
    dateTime: string; // วันที่-เวลาใช้งาน
    userName: string;
    role: string;
    moduleName: string;
    action: string;
    ipAddress: string;
    device: string;
    status: UsageStatus;
    note?: string;
};

// 🔹 Mock ข้อมูลการใช้งานระบบ
const MOCK_USAGE_LOGS: SystemUsageLog[] = [
    {
        id: "1",
        dateTime: "2025-02-10 09:12",
        userName: "นายอนันต์ ใจดี",
        role: "เจ้าหน้าที่รับเรื่องร้องเรียน",
        moduleName: "RSPM - รับเรื่องร้องเรียน",
        action: "เข้าสู่ระบบและบันทึกคำร้องใหม่",
        ipAddress: "192.168.1.25",
        device: "Desktop (สำนักงาน)",
        status: "success",
        note: "บันทึกคำร้องเกี่ยวกับถนนชำรุด หมู่ที่ 3",
    },
    {
        id: "2",
        dateTime: "2025-02-10 09:35",
        userName: "นางสาวจันทร์จิรา แสงทอง",
        role: "เจ้าหน้าที่ตรวจสอบภาคสนาม",
        moduleName: "RSPM - ติดตามผล/ลงพื้นที่",
        action: "อัปเดตผลการตรวจสอบภาคสนาม",
        ipAddress: "10.0.0.15",
        device: "Mobile (ภาคสนาม)",
        status: "success",
        note: "แนบรูปภาพก่อน–หลังซ่อมแซม",
    },
    {
        id: "3",
        dateTime: "2025-02-10 10:02",
        userName: "นายกฤษดา อินทร์คำ",
        role: "หัวหน้าสำนักปลัด",
        moduleName: "Dashboard - รายงานภาพรวม",
        action: "เข้าดูรายงานภาพรวมคำร้องตามหมู่บ้าน",
        ipAddress: "192.168.1.30",
        device: "Desktop (สำนักงาน)",
        status: "success",
    },
    {
        id: "4",
        dateTime: "2025-02-10 10:18",
        userName: "นายสมชาย ทองแท้",
        role: "เจ้าหน้าที่ระบบ",
        moduleName: "RSPM - การตั้งค่าระบบ",
        action: "แก้ไขประเภทงานบริการ",
        ipAddress: "192.168.1.10",
        device: "Desktop (ศูนย์คอมพิวเตอร์)",
        status: "success",
        note: "เพิ่มประเภทงาน: แจ้งน้ำท่วมขัง",
    },
    {
        id: "5",
        dateTime: "2025-02-10 10:21",
        userName: "นายสมชาย ทองแท้",
        role: "เจ้าหน้าที่ระบบ",
        moduleName: "RSPM - การตั้งค่าระบบ",
        action: "เปลี่ยนสิทธิ์การเข้าถึงผู้ใช้",
        ipAddress: "192.168.1.10",
        device: "Desktop (ศูนย์คอมพิวเตอร์)",
        status: "success",
    },
    {
        id: "6",
        dateTime: "2025-02-10 10:45",
        userName: "ว่าที่ ร.ต.ธีรวัฒน์ สุขใจ",
        role: "นายกเทศมนตรี",
        moduleName: "Dashboard - รายงานผู้บริหาร",
        action: "เข้าดูรายงานสรุปคำร้องตามประเภทงาน",
        ipAddress: "192.168.1.35",
        device: "Tablet",
        status: "success",
    },
    {
        id: "7",
        dateTime: "2025-02-10 11:02",
        userName: "นางสาวอารีย์ ภักดี",
        role: "เจ้าหน้าที่สาธารณสุข",
        moduleName: "RSPM - งานร้องเรียนด้านสิ่งแวดล้อม",
        action: "บันทึกผลการดำเนินการเรื่องขยะมูลฝอย",
        ipAddress: "10.0.0.20",
        device: "Desktop (กองสาธารณสุข)",
        status: "success",
    },
    {
        id: "8",
        dateTime: "2025-02-10 11:15",
        userName: "ระบบกลาง",
        role: "ระบบอัตโนมัติ",
        moduleName: "Notification Service",
        action: "ส่งแจ้งเตือนสถานะคำร้องทางไลน์ OA",
        ipAddress: "127.0.0.1",
        device: "Server",
        status: "success",
    },
    {
        id: "9",
        dateTime: "2025-02-10 11:25",
        userName: "ไม่ระบุ (ลองรหัสผ่านผิด)",
        role: "ผู้ใช้งานไม่ระบุตัวตน",
        moduleName: "หน้าล็อกอินระบบ RSPM",
        action: "พยายามเข้าสู่ระบบ (รหัสผ่านไม่ถูกต้อง)",
        ipAddress: "203.113.12.45",
        device: "Unknown",
        status: "failed",
        note: "ล็อกอินผิดเกิน 3 ครั้งใน 5 นาที",
    },
    {
        id: "10",
        dateTime: "2025-02-10 11:40",
        userName: "นางสาวจันทร์จิรา แสงทอง",
        role: "เจ้าหน้าที่ตรวจสอบภาคสนาม",
        moduleName: "RSPM - ติดตามผล/ลงพื้นที่",
        action: "เข้าดูประวัติคำร้องย้อนหลัง",
        ipAddress: "10.0.0.15",
        device: "Mobile (ภาคสนาม)",
        status: "success",
    },
];

const SystemUsage_RSPM: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "success" | "failed">(
        ""
    );

    const [selectedLog, setSelectedLog] = useState<SystemUsageLog | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const totalLogs = MOCK_USAGE_LOGS.length;
    const successLogs = MOCK_USAGE_LOGS.filter(
        (l) => l.status === "success"
    ).length;
    const failedLogs = totalLogs - successLogs;

    const uniqueUsers = useMemo(() => {
        const setNames = new Set(MOCK_USAGE_LOGS.map((l) => l.userName));
        return setNames.size;
    }, []);

    const filteredLogs = useMemo(() => {
        const text = searchText.trim().toLowerCase();

        return MOCK_USAGE_LOGS.filter((log) => {
            const matchText =
                !text ||
                log.userName.toLowerCase().includes(text) ||
                log.role.toLowerCase().includes(text) ||
                log.moduleName.toLowerCase().includes(text) ||
                log.action.toLowerCase().includes(text) ||
                log.ipAddress.toLowerCase().includes(text) ||
                log.device.toLowerCase().includes(text);

            const matchStatus =
                !statusFilter || log.status === statusFilter;

            return matchText && matchStatus;
        });
    }, [searchText, statusFilter]);

    const openDetail = (log: SystemUsageLog) => {
        setSelectedLog(log);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedLog(null);
    };

    return (
        <div className={styles.layout}>
            <Header />

            <div style={{ display: "flex", flex: 1, width: "100%" }}>
                <Sidebar />

                <div className={styles.mainContainer}>
                    <div className={styles.container}>
                        <h1 className={styles.formTitle}>
                            ข้อมูลการใช้งานระบบ (System Usage RSPM)
                        </h1>

                        {/* ===== Summary Section ===== */}
                        <section className={styles.summarySection}>
                            <div className={styles.summaryHeader}>
                                <h4>สรุปรายการการใช้งานระบบ RSPM ภายในเทศบาลตำบลอุโมง</h4>
                            </div>

                            <div className={styles.summaryContainer}>
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#0b57d0" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>จำนวนรายการการใช้งานทั้งหมด</h4>
                                    </div>
                                    <div className={styles.value}>{totalLogs}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            บันทึกการใช้งานล่าสุดในระบบ
                                        </span>
                                        <span className={styles.icon}>📑</span>
                                    </div>
                                </div>

                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#16a34a" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>ใช้งานสำเร็จ</h4>
                                    </div>
                                    <div className={styles.value}>{successLogs}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>เข้าสู่ระบบ/บันทึกข้อมูลสำเร็จ</span>
                                        <span className={styles.icon}>✅</span>
                                    </div>
                                </div>

                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#ef4444" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>ใช้งานล้มเหลว / ล็อกอินผิด</h4>
                                    </div>
                                    <div className={styles.value}>{failedLogs}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            เช่น ล็อกอินผิด หรือระบบปฏิเสธการเข้าถึง
                                        </span>
                                        <span className={styles.icon}>⚠️</span>
                                    </div>
                                </div>

                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#9333ea" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>จำนวนผู้ใช้งานที่พบ</h4>
                                    </div>
                                    <div className={styles.value}>{uniqueUsers}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            นับจากชื่อผู้ใช้งานที่ปรากฏในบันทึก
                                        </span>
                                        <span className={styles.icon}>👥</span>
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
                                    placeholder="ค้นหาจากชื่อผู้ใช้, หน่วยงาน, โมดูล, การกระทำ, IP..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <label>สถานะการใช้งาน</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value as "" | "success" | "failed")
                                    }
                                >
                                    <option value="">ทุกสถานะ</option>
                                    <option value="success">สำเร็จ</option>
                                    <option value="failed">ล้มเหลว</option>
                                </select>
                            </div>
                        </div>

                        {/* ===== Table Section ===== */}
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>วัน-เวลา</th>
                                    <th>ชื่อผู้ใช้งาน</th>
                                    <th>หน่วยงาน/บทบาท</th>
                                    <th>โมดูล / การทำงาน</th>
                                    <th>สถานะ</th>
                                    <th>การดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className={styles.emptyState}>
                                            ไม่พบบันทึกการใช้งานตามเงื่อนไขที่ค้นหา
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log, index) => (
                                        <tr key={log.id}>
                                            <td>{index + 1}</td>
                                            <td>{log.dateTime}</td>
                                            <td>{log.userName}</td>
                                            <td>{log.role}</td>
                                            <td>
                                                <div className={styles.moduleCell}>
                                                    <div className={styles.moduleName}>
                                                        {log.moduleName}
                                                    </div>
                                                    <div className={styles.moduleAction}>{log.action}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`${styles.statusBadge} ${log.status === "success"
                                                            ? styles.statusSuccess
                                                            : styles.statusFailed
                                                        }`}
                                                >
                                                    {log.status === "success" ? "สำเร็จ" : "ล้มเหลว"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.viewButton}
                                                    onClick={() => openDetail(log)}
                                                >
                                                    ดูรายละเอียด
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

            {/* ===== Modal แสดงรายละเอียดการใช้งาน ===== */}
            {showDetail && selectedLog && (
                <div className={styles.modalOverlay} onClick={closeDetail}>
                    <div
                        className={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>รายละเอียดการใช้งานระบบ</h3>
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
                                <label>วัน-เวลาใช้งาน</label>
                                <span>{selectedLog.dateTime}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>ชื่อผู้ใช้งาน</label>
                                <span>{selectedLog.userName}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>บทบาท / หน่วยงาน</label>
                                <span>{selectedLog.role}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>โมดูลที่ใช้งาน</label>
                                <span>{selectedLog.moduleName}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>การกระทำ</label>
                                <span>{selectedLog.action}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>ที่อยู่ IP</label>
                                <span>{selectedLog.ipAddress}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>อุปกรณ์ที่ใช้</label>
                                <span>{selectedLog.device}</span>
                            </div>
                            <div className={styles.modalRow}>
                                <label>สถานะ</label>
                                <span>
                                    {selectedLog.status === "success"
                                        ? "สำเร็จ"
                                        : "ล้มเหลว / ถูกปฏิเสธ"}
                                </span>
                            </div>
                            {selectedLog.note && (
                                <div className={styles.modalRow}>
                                    <label>หมายเหตุเพิ่มเติม</label>
                                    <span>{selectedLog.note}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemUsage_RSPM;
