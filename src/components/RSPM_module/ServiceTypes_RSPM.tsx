// src/components/RSPM_module/ServiceTypes_RSPM.tsx
import React, { useMemo, useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar_RSPM";
import Footer from "../Footer";
import styles from "./ServiceTypes_RSPM.module.css";

type ServiceType = {
    id: string;
    code: string;          // รหัสบริการ เช่น SRV-001
    name: string;          // ชื่อประเภทงานบริการ
    category: string;      // หมวดหมู่ เช่น โครงสร้างพื้นฐาน, สุขภาพ, สวัสดิการ
    description: string;   // คำอธิบาย
    slaDays: number;       // ระยะเวลาเป้าหมาย (วันทำการ)
    channel: string;       // ช่องทางหลัก
    isActive: boolean;     // ยังเปิดรับบริการอยู่หรือไม่
};

// 🔹 Mock ข้อมูลเริ่มต้น
const INITIAL_SERVICE_TYPES: ServiceType[] = [
    {
        id: "1",
        code: "SRV-001",
        name: "แจ้งซ่อมถนน / ผิวจราจรชำรุด",
        category: "โครงสร้างพื้นฐาน",
        description:
            "รับคำร้องแจ้งซ่อมถนนเป็นหลุมบ่อ ผิวจราจรชำรุด หรือพื้นผิวทางสาธารณะเสียหาย ภายในเขตเทศบาลตำบลอุโมง",
        slaDays: 7,
        channel: "ยื่นคำร้องที่สำนักปลัด / ผ่านระบบ RSPM / โทรศัพท์",
        isActive: true,
    },
    {
        id: "2",
        code: "SRV-002",
        name: "ปัญหาระบบระบายน้ำ / ท่ออุดตัน",
        category: "โครงสร้างพื้นฐาน",
        description:
            "รับแจ้งท่อระบายน้ำอุดตัน น้ำท่วมขัง ทางระบายน้ำสาธารณะเสียหาย หรือมีสิ่งกีดขวาง",
        slaDays: 5,
        channel: "ยื่นคำร้อง / ผ่านระบบ RSPM",
        isActive: true,
    },
    {
        id: "3",
        code: "SRV-003",
        name: "ไฟฟ้าส่องสว่างสาธารณะชำรุด",
        category: "โครงสร้างพื้นฐาน",
        description:
            "แจ้งหลอดไฟสาธารณะดับ ไฟกระพริบ หรือเสาไฟส่องสว่างชำรุด เพื่อความปลอดภัยของประชาชน",
        slaDays: 3,
        channel: "โทรศัพท์จุดรับแจ้งเหตุ / ผ่านระบบ RSPM",
        isActive: true,
    },
    {
        id: "4",
        code: "SRV-004",
        name: "เก็บขยะมูลฝอย / ขยะตกค้าง",
        category: "สิ่งแวดล้อมและสุขาภิบาล",
        description:
            "แจ้งปัญหาขยะตกค้าง จุดทิ้งขยะไม่ถูกต้อง หรือร้องขอเพิ่มจุดเก็บขยะภายในชุมชน",
        slaDays: 2,
        channel: "ฝ่ายสาธารณสุข / ผ่านระบบ RSPM",
        isActive: true,
    },
    {
        id: "5",
        code: "SRV-005",
        name: "ร้องเรียนกลิ่นเหม็น / มลภาวะทางเสียง",
        category: "สิ่งแวดล้อมและสุขาภิบาล",
        description:
            "ร้องเรียนสถานประกอบการ หรือกิจกรรมที่สร้างกลิ่นเหม็นรุนแรง เสียงดังรบกวน หรือมลภาวะอื่น ๆ",
        slaDays: 10,
        channel: "ยื่นคำร้องที่เทศบาล / ผ่านระบบ RSPM",
        isActive: true,
    },
    {
        id: "6",
        code: "SRV-006",
        name: "ขอรับสวัสดิการผู้สูงอายุ / ผู้พิการ",
        category: "สวัสดิการสังคม",
        description:
            "ลงทะเบียนหรือขอปรับปรุงข้อมูลสิทธิ์เบี้ยยังชีพผู้สูงอายุ ผู้พิการ หรือผู้ป่วยติดเตียง",
        slaDays: 15,
        channel: "กองสวัสดิการสังคม / ศูนย์ข้อมูลชุมชน",
        isActive: true,
    },
    {
        id: "7",
        code: "SRV-007",
        name: "รับรองสถานะอยู่อาศัย / หนังสือรับรองจากเทศบาล",
        category: "ทะเบียนและปกครอง",
        description:
            "ออกหนังสือรับรองสถานที่อยู่อาศัย หนังสือรับรองจากเทศบาล เพื่อใช้ประกอบธุรกรรมต่าง ๆ",
        slaDays: 3,
        channel: "ฝ่ายทะเบียนราษฎร / ยื่นเอกสารที่สำนักงาน",
        isActive: true,
    },
    {
        id: "8",
        code: "SRV-008",
        name: "ขอใช้สถานที่สาธารณะเพื่อจัดกิจกรรม",
        category: "การศึกษา ศาสนา และวัฒนธรรม",
        description:
            "ขออนุญาตใช้สนามสาธารณะ หอประชุม หรือสถานที่ราชการ เพื่อจัดกิจกรรมของชุมชนหรือหน่วยงาน",
        slaDays: 7,
        channel: "กองการศึกษา / ยื่นคำร้องล่วงหน้า",
        isActive: true,
    },
    {
        id: "9",
        code: "SRV-009",
        name: "ขอข้อมูลข่าวสารของราชการ",
        category: "ข้อมูลข่าวสาร / เอกสารราชการ",
        description:
            "ขอสำเนาเอกสาร หรือข้อมูลข่าวสารของราชการ ตามระเบียบว่าด้วยข้อมูลข่าวสารของราชการ",
        slaDays: 15,
        channel: "งานประชาสัมพันธ์ / งานนิติการ",
        isActive: true,
    },
    {
        id: "10",
        code: "SRV-010",
        name: "ลงทะเบียนเข้าร่วมอบรม / กิจกรรมของเทศบาล",
        category: "บริการประชาชนทั่วไป",
        description:
            "ลงทะเบียนเข้าร่วมอบรม เสวนา หรือกิจกรรมต่าง ๆ ที่เทศบาลจัดขึ้นให้ประชาชน",
        slaDays: 1,
        channel: "ออนไลน์ผ่านเว็บไซต์ / ศูนย์อินเทอร์เน็ตชุมชน",
        isActive: true,
    },
];

const ServiceTypes_RSPM: React.FC = () => {
    // ✅ ใช้ state แทนค่าคงที่ เพื่อให้เพิ่ม/แก้ได้
    const [serviceTypes, setServiceTypes] =
        useState<ServiceType[]>(INITIAL_SERVICE_TYPES);

    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">(
        ""
    );
    const [selectedService, setSelectedService] = useState<ServiceType | null>(
        null
    );
    const [showDetail, setShowDetail] = useState(false);

    // Modal เพิ่มบริการ
    const [showAdd, setShowAdd] = useState(false);
    const [newService, setNewService] = useState<{
        name: string;
        category: string;
        description: string;
        slaDays: string;
        channel: string;
        isActive: "active" | "inactive";
    }>({
        name: "",
        category: "",
        description: "",
        slaDays: "3",
        channel: "",
        isActive: "active",
    });

    // ===== ค่ารวมสรุป =====
    const totalTypes = serviceTypes.length;
    const activeCount = serviceTypes.filter((s) => s.isActive).length;
    const avgSla =
        totalTypes > 0
            ? (
                serviceTypes.reduce((sum, s) => sum + s.slaDays, 0) / totalTypes
            ).toFixed(1)
            : "0.0";
    const channelCount = new Set(serviceTypes.map((s) => s.channel)).size;

    const categories = useMemo(
        () =>
            Array.from(new Set(serviceTypes.map((s) => s.category)))
                .filter((c) => !!c)
                .sort((a, b) => a.localeCompare(b, "th")),
        [serviceTypes]
    );

    // ===== ฟิลเตอร์รายการ =====
    const filteredServiceTypes = useMemo(() => {
        const text = searchText.trim().toLowerCase();

        return serviceTypes.filter((s) => {
            const matchText =
                !text ||
                s.code.toLowerCase().includes(text) ||
                s.name.toLowerCase().includes(text) ||
                s.category.toLowerCase().includes(text) ||
                s.description.toLowerCase().includes(text);

            const matchCategory = !categoryFilter || s.category === categoryFilter;

            const matchStatus =
                !statusFilter ||
                (statusFilter === "active" && s.isActive) ||
                (statusFilter === "inactive" && !s.isActive);

            return matchText && matchCategory && matchStatus;
        });
    }, [serviceTypes, searchText, categoryFilter, statusFilter]);

    // ===== จัดการ Modal รายละเอียด =====
    const openDetail = (service: ServiceType) => {
        setSelectedService(service);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedService(null);
    };

    // ===== สลับสถานะบริการ (เปิด/ปิด) =====
    const toggleStatus = (id: string) => {
        setServiceTypes((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {
                        ...s,
                        isActive: !s.isActive,
                    }
                    : s
            )
        );
    };

    // ===== รีเซ็ตฟอร์มเพิ่มบริการ =====
    const resetNewService = () => {
        setNewService({
            name: "",
            category: "",
            description: "",
            slaDays: "3",
            channel: "",
            isActive: "active",
        });
    };

    // ===== สร้างรหัสใหม่แบบรันออโต้ (SRV-011, SRV-012, ...) =====
    const generateNextCode = (): string => {
        if (serviceTypes.length === 0) return "SRV-001";

        const maxNum = serviceTypes.reduce((max, s) => {
            const parts = s.code.split("-");
            const num = parts.length > 1 ? parseInt(parts[1], 10) : 0;
            return num > max ? num : max;
        }, 0);

        const next = maxNum + 1;
        return `SRV-${String(next).padStart(3, "0")}`;
    };

    // ===== เพิ่มประเภทงานบริการใหม่ =====
    const addServiceType = () => {
        if (!newService.name.trim()) {
            alert("กรุณากรอกชื่อประเภทงานบริการ");
            return;
        }

        const sla = parseInt(newService.slaDays, 10);
        if (Number.isNaN(sla) || sla <= 0) {
            alert("กรุณากรอก SLA (วันทำการ) ให้ถูกต้อง");
            return;
        }

        const nextCode = generateNextCode();
        const nextId = (serviceTypes.length + 1).toString();

        const newItem: ServiceType = {
            id: nextId,
            code: nextCode,
            name: newService.name.trim(),
            category: newService.category.trim() || "อื่น ๆ",
            description: newService.description.trim() || "-",
            slaDays: sla,
            channel: newService.channel.trim() || "ยื่นคำร้องที่เทศบาล",
            isActive: newService.isActive === "active",
        };

        setServiceTypes((prev) => [...prev, newItem]);
        setShowAdd(false);
        resetNewService();
    };

    return (
        <div className={styles.layout}>
            <Header />

            <div style={{ display: "flex", flex: 1, width: "100%" }}>
                <Sidebar />

                <div className={styles.mainContainer}>
                    <div className={styles.container}>
                        <h1 className={styles.formTitle}>
                            ข้อมูลประเภทงานบริการ เทศบาลตำบลอุโมง (Service Types RSPM)
                        </h1>

                        {/* ===== สรุป ===== */}
                        <section className={styles.summarySection}>
                            <div className={styles.summaryHeader}>
                                <h4>สรุปประเภทงานบริการที่เปิดให้ประชาชนใช้บริการ</h4>
                            </div>

                            <div className={styles.summaryContainer}>
                                {/* การ์ด 1: จำนวนประเภทบริการทั้งหมด */}
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#007bff" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>จำนวนประเภทงานบริการทั้งหมด</h4>
                                    </div>
                                    <div className={styles.value}>{totalTypes}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            ใช้งานในระบบ RSPM – เทศบาลตำบลอุโมง
                                        </span>
                                        <span className={styles.icon}>📋</span>
                                    </div>
                                </div>

                                {/* การ์ด 2: จำนวนที่เปิดใช้งานอยู่ */}
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#4caf50" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>บริการที่เปิดรับคำร้องอยู่</h4>
                                    </div>
                                    <div className={styles.value}>{activeCount}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>สถานะ: เปิดใช้งาน</span>
                                        <span className={styles.icon}>✅</span>
                                    </div>
                                </div>

                                {/* การ์ด 3: SLA เฉลี่ย */}
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#ff9800" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>ระยะเวลาดำเนินการเฉลี่ย</h4>
                                    </div>
                                    <div className={styles.value}>{avgSla}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>วันทำการ (โดยประมาณ)</span>
                                        <span className={styles.icon}>⏱️</span>
                                    </div>
                                </div>

                                {/* การ์ด 4: ช่องทางให้บริการ */}
                                <div
                                    className={styles.summaryCard}
                                    style={{ backgroundColor: "#9c27b0" }}
                                >
                                    <div className={styles.summaryHeader}>
                                        <h4>รูปแบบช่องทางให้บริการ</h4>
                                    </div>
                                    <div className={styles.value}>{channelCount}</div>
                                    <div className={styles.summaryFooter}>
                                        <span className={styles.change}>
                                            เช่น ออนไลน์, โทรศัพท์, ยื่นคำร้อง
                                        </span>
                                        <span className={styles.icon}>🌐</span>
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
                                    placeholder="ค้นหา: รหัสบริการ, ชื่อบริการ, หมวดหมู่, คำอธิบาย..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>

                            <div className={styles.filterItem}>
                                <label>หมวดหมู่</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">ทุกหมวดหมู่</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterItem}>
                                <label>สถานะบริการ</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value as "" | "active" | "inactive")
                                    }
                                >
                                    <option value="">ทั้งหมด</option>
                                    <option value="active">เปิดใช้งาน</option>
                                    <option value="inactive">ปิดปรับปรุง / งดให้บริการ</option>
                                </select>
                            </div>
                        </div>

                        {/* ===== ปุ่มเพิ่มประเภทงานบริการ ===== */}
                        <div className={styles.addButtonRow}>
                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={() => setShowAdd(true)}
                            >
                                + เพิ่มประเภทงานบริการ
                            </button>
                        </div>

                        {/* ===== ตารางประเภทงานบริการ ===== */}
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th>รหัสบริการ</th>
                                    <th>ชื่อประเภทงานบริการ</th>
                                    <th>หมวดหมู่</th>
                                    <th>SLA (วันทำการ)</th>
                                    <th>สถานะ</th>
                                    <th>การดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServiceTypes.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className={styles.emptyState}>
                                            ไม่พบประเภทงานบริการตามเงื่อนไขที่ค้นหา
                                        </td>
                                    </tr>
                                ) : (
                                    filteredServiceTypes.map((s, index) => (
                                        <tr key={s.id}>
                                            <td>{index + 1}</td>
                                            <td>{s.code}</td>
                                            <td>{s.name}</td>
                                            <td>{s.category}</td>
                                            <td>{s.slaDays}</td>
                                            <td>
                                                <span
                                                    className={`${styles.statusBadge} ${s.isActive
                                                            ? styles.statusActive
                                                            : styles.statusInactive
                                                        }`}
                                                >
                                                    {s.isActive ? "เปิดใช้งาน" : "ปิดชั่วคราว"}
                                                </span>
                                            </td>
                                            <td className={styles.actionCell}>
                                                <button
                                                    type="button"
                                                    className={styles.viewButton}
                                                    onClick={() => openDetail(s)}
                                                >
                                                    ดูรายละเอียด
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.toggleButton}
                                                    onClick={() => toggleStatus(s.id)}
                                                >
                                                    {s.isActive ? "ปิดชั่วคราว" : "เปิดใช้งาน"}
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
            {showDetail && selectedService && (
                <div className={styles.modalOverlay} onClick={closeDetail}>
                    <div
                        className={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>รายละเอียดประเภทงานบริการ</h3>
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
                                <label>รหัสบริการ</label>
                                <span>{selectedService.code}</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>ชื่อประเภทงานบริการ</label>
                                <span>{selectedService.name}</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>หมวดหมู่</label>
                                <span>{selectedService.category}</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>SLA โดยประมาณ</label>
                                <span>{selectedService.slaDays} วันทำการ</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>สถานะบริการ</label>
                                <span
                                    className={`${styles.statusBadge} ${selectedService.isActive
                                            ? styles.statusActive
                                            : styles.statusInactive
                                        }`}
                                >
                                    {selectedService.isActive ? "เปิดใช้งาน" : "ปิดชั่วคราว"}
                                </span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>ช่องทางให้บริการหลัก</label>
                                <span>{selectedService.channel}</span>
                            </div>

                            <div className={styles.modalRow}>
                                <label>รายละเอียด / คำอธิบาย</label>
                                <span>{selectedService.description}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Modal เพิ่มประเภทงานบริการใหม่ ===== */}
            {showAdd && (
                <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
                    <div
                        className={styles.modalBox}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>เพิ่มประเภทงานบริการใหม่</h3>
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
                                <label>ชื่อประเภทงานบริการ</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={newService.name}
                                    onChange={(e) =>
                                        setNewService({ ...newService, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className={styles.modalRow}>
                                <label>หมวดหมู่</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="เช่น โครงสร้างพื้นฐาน, สวัสดิการสังคม, สิ่งแวดล้อม..."
                                    value={newService.category}
                                    onChange={(e) =>
                                        setNewService({ ...newService, category: e.target.value })
                                    }
                                />
                            </div>

                            <div className={styles.modalRow}>
                                <label>คำอธิบาย / รายละเอียด</label>
                                <textarea
                                    className={styles.textarea}
                                    rows={3}
                                    value={newService.description}
                                    onChange={(e) =>
                                        setNewService({ ...newService, description: e.target.value })
                                    }
                                />
                            </div>

                            <div className={styles.modalRowInline}>
                                <div className={styles.modalCol}>
                                    <label>SLA (วันทำการ)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        className={styles.input}
                                        value={newService.slaDays}
                                        onChange={(e) =>
                                            setNewService({ ...newService, slaDays: e.target.value })
                                        }
                                    />
                                </div>

                                <div className={styles.modalCol}>
                                    <label>สถานะบริการ</label>
                                    <select
                                        className={styles.input}
                                        value={newService.isActive}
                                        onChange={(e) =>
                                            setNewService({
                                                ...newService,
                                                isActive: e.target.value as "active" | "inactive",
                                            })
                                        }
                                    >
                                        <option value="active">เปิดใช้งาน</option>
                                        <option value="inactive">ปิดชั่วคราว</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.modalRow}>
                                <label>ช่องทางให้บริการหลัก</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="เช่น ยื่นคำร้องที่เทศบาล / ผ่านระบบ RSPM / ออนไลน์"
                                    value={newService.channel}
                                    onChange={(e) =>
                                        setNewService({ ...newService, channel: e.target.value })
                                    }
                                />
                            </div>

                            <div className={styles.addModalFooter}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        resetNewService();
                                        setShowAdd(false);
                                    }}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="button"
                                    className={styles.addButton}
                                    onClick={addServiceType}
                                >
                                    บันทึกประเภทงานบริการ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceTypes_RSPM;
