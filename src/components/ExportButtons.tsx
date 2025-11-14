import React, { useState } from "react";
import { FaPrint, FaFileExcel, FaFileCsv } from "react-icons/fa6";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from "./ExportButtons.module.css";
import html2canvas from "html2canvas";

interface ExportButtonsProps {
  data: any[];
   tableRef: React.RefObject<HTMLTableElement | null>; // ✅ อนุญาตให้ null
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, tableRef }) => {

  const [showPreview, setShowPreview] = useState<null | "excel" | "csv">(null);

  // 🧹 ลบคอลัมน์จัดการออกก่อน export
 const filteredData = data.map(({ id: _id, date, user, password, dept, link, owner, tel }) => ({

    วันที่: new Date(date).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      calendar: "buddhist",
    }),
    USER: user,
    PASSWORD: password,
    หน่วยงาน: dept,
    Link: link,
    ผู้ดูแล: owner,
    เบอร์โทร: tel,
  }));

  // 🖨️ พิมพ์ PDF
 const handlePrintPDF = async () => {
 const element = tableRef.current;

  if (!element) {
    alert("❌ ไม่พบตารางข้อมูลสำหรับพิมพ์");
    return;
  }

  // ✅ ใช้ html2canvas แปลงตารางเป็นภาพ
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true, // รองรับโหลดฟอนต์และภาพจากเว็บภายนอก
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("l", "mm", "a4");

  const imgWidth = 280;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // ✅ รองรับหลายหน้า (auto split)
  while (heightLeft > 0) {
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    if (heightLeft > 0) {
      pdf.addPage();
      position = 0;
    }
  }

  // ✅ เปิดแท็บใหม่แทนการบันทึกทันที
  window.open(pdf.output("bloburl"), "_blank");
};
  // 📊 Export Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, "API Data");
    XLSX.writeFile(wb, "api_data.xlsx");
  };

  // 📄 Export CSV
  const handleExportCSV = () => {
    const csvContent =
      Object.keys(filteredData[0]).join(",") +
      "\n" +
      filteredData.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "api_data.csv";
    link.click();
  };

  return (
    <div className={styles.exportContainer}>
      {/* ปุ่ม Export ทั้ง 3 */}
      <button className={styles.exportBtn} title="พิมพ์" onClick={handlePrintPDF}>
        <FaPrint />
      </button>

      <button
        className={styles.exportBtn}
        title="ส่งออก Excel"
        onClick={() => setShowPreview("excel")}
      >
        <FaFileExcel />
      </button>

      <button
        className={styles.exportBtn}
        title="ส่งออก CSV"
        onClick={() => setShowPreview("csv")}
      >
        <FaFileCsv />
      </button>

      {/* 🔍 Popup Preview */}
      {showPreview && (
        <div className={styles.previewOverlay}>
          <div className={styles.previewBox}>
            <h3>{showPreview === "excel" ? "📊 Preview Excel" : "📄 Preview CSV"}</h3>

            <table className={styles.previewTable}>
              <thead>
                <tr>
                  {Object.keys(filteredData[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.previewButtons}>
              <button
                className={styles.confirmBtn}
                onClick={() => {
                  if (showPreview === "excel") handleExportExcel();
                  else handleExportCSV();
                  setShowPreview(null);
                }}
              >
                ✅ ยืนยันส่งออก
              </button>
              <button className={styles.cancelBtn} onClick={() => setShowPreview(null)}>
                ❌ ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButtons;
