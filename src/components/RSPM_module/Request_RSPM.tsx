import React, { useState } from "react";
import axios from "axios";
import styles from "./tracking_RSPM.module.css";
import { FaSearch } from "react-icons/fa";
import Header from "../Header";
import Footer from "../Footer";
import Sidebar from "./Sidebar_RSPM";
import avatar from "../../assets/images/avatar.png";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const Tracking_RSPM: React.FC = () => {
  // ✅ เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    requestId: "",
    requestDate: "",
    citizenId: "",
    firstName: "",
    lastName: "",
    phone: "",
    targetCitizenId: "",
    targetFirstName: "",
    targetLastName: "",
    targetAddress: "",
    targetPhone: "",
    problemType: "",
    problemDetail: "",
    location: "",
    fixDate: "",
    fixDetail: "",
    operator: "",
  });

  // ✅ เก็บรูปภาพก่อน-หลัง
  const [beforeImages, setBeforeImages] = useState<(string | null)[]>([null, null, null]);
  const [afterImages, setAfterImages] = useState<(string | null)[]>([null, null, null]);

  // ✅ สถานะสำหรับอ่านบัตรประชาชน
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // ✅ อ่านข้อมูลจากบัตรประชาชนผ่าน API
  const handleReadCard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/read-latest");
      const data = res.data;
      if (!data) throw new Error("ไม่มีข้อมูลจากเครื่องอ่านบัตร");

      setFormData({
        ...formData,
        citizenId: data.citizenId || "",
        firstName: data.firstNameTH || "",
        lastName: data.lastNameTH || "",
        targetAddress: data.address || "",
      });

      if (data.photo) {
        setPhoto("http://localhost:3000/api/read-latest/photo");
      }
    } catch (err) {
      console.error(err);
      setError("❌ ไม่สามารถอ่านข้อมูลจากบัตรได้ หรือเครื่องอ่านไม่ตอบสนอง");
    } finally {
      setLoading(false);
    }
  };

  // ✅ handle change สำหรับ input / textarea
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ handle upload รูปภาพ
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, type: "before" | "after") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "before") {
          const updated = [...beforeImages];
          updated[index] = reader.result as string;
          setBeforeImages(updated);
        } else {
          const updated = [...afterImages];
          updated[index] = reader.result as string;
          setAfterImages(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ ฟังก์ชันบันทึกลง LocalStorage
  const handleSave = () => {
    const existingData = JSON.parse(localStorage.getItem("tracking_RSPM_data") || "[]");

    const newRecord = {
      ...formData,
      beforeImages: beforeImages.filter(Boolean),
      afterImages: afterImages.filter(Boolean),
      dateSaved: new Date().toLocaleString("th-TH"),
      id: Date.now(),
    };

    localStorage.setItem("tracking_RSPM_data", JSON.stringify([...existingData, newRecord]));

    alert("✅ บันทึกข้อมูลสำเร็จแล้ว!");

    setFormData({
      requestId: "",
      requestDate: "",
      citizenId: "",
      firstName: "",
      lastName: "",
      phone: "",
      targetCitizenId: "",
      targetFirstName: "",
      targetLastName: "",
      targetAddress: "",
      targetPhone: "",
      problemType: "",
      problemDetail: "",
      location: "",
      fixDate: "",
      fixDetail: "",
      operator: "",
    });
    setBeforeImages([null, null, null]);
    setAfterImages([null, null, null]);
  };

  // ✅ icon หมุด
  const markerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [36, 36],
  });

  // ✅ Component Marker ที่ลากได้
const DraggableMarker: React.FC<{
  formData: any;
  updateLocation: (lat: number, lng: number) => void;
}> = ({ formData, updateLocation }) => {
  // ถ้ามีพิกัดใน formData ก็ใช้เลย ไม่งั้น default เป็นเชียงใหม่
  const [position, setPosition] = useState<[number, number]>(
    formData.location
      ? (formData.location.split(",").map(Number) as [number, number])
      : [18.653549, 99.038908]
  );

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      updateLocation(lat, lng);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
          updateLocation(pos.lat, pos.lng); // ✅ อัปเดตพิกัดใน formData
        },
      }}
    />
  );
};

const updateLocation = (lat: number, lng: number) => {
  setFormData((prev) => ({
    ...prev,
    location: `${lat.toFixed(6)},${lng.toFixed(6)}`,
  }));
};
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.mainContainer}>
        <Sidebar />
        <div className={styles.container}>
          <h2 className={styles.formTitle}>ข้อมูลการร้องขอของประชาชนผู้ประสบปัญหา</h2>

          {/* 🔹 ส่วนหัวข้อมูล */}
          <div className={styles.setsec}>
            <div className={styles.row}>
              <label>หมายเลขการร้องขอ</label>
              <input
                className={styles.inputMedium}
                name="requestId"
                value={formData.requestId}
                onChange={handleChange}
              />
              <label>วันที่ เวลา แจ้ง</label>
              <input
                type="datetime-local"
                className={styles.inputMedium}
                name="requestDate"
                value={formData.requestDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 🔹 ผู้ร้องเรียน */}
          <div className={`${styles.section} ${styles.complainant}`}>
            <div className={styles.row}>
              <label>หมายเลขบัตรประชาชน</label>
              <input
                className={styles.inputSmall}
                name="citizenId"
                value={formData.citizenId}
                onChange={handleChange}
              />
            </div>

            <div className={`${styles.row} ${styles.nameRow}`}>
              <label>ชื่อ นามสกุล</label>
              <input
                className={styles.inputSmall}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                className={styles.inputSmall}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className={`${styles.row} ${styles.phoneRow}`}>
              <label>เบอร์โทรศัพท์</label>
              <input
                className={styles.inputSmall}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <div className={styles.cardReaderBox}>
                <button onClick={handleReadCard} disabled={loading} className={styles.readCardBtn}>
                  {loading ? "กำลังอ่าน..." : "ค้นหา"}
                </button>
                {error && <p className={styles.errorText}>{error}</p>}
              </div>
            </div>

            {photo && (
              <div className={styles.photoBox}>
                <label>รูปจากบัตร</label>
                <img src={photo} alt="รูปจากบัตร" className={styles.idPhoto} />
              </div>
            )}
          </div>

          {/* 🔹 ผู้ถูกร้องเรียน */}
          <div className={`${styles.section} ${styles.highlight}`}>
            <div className={styles.grid2}>
              <div className={styles.infoColumn}>
                <div className={styles.rowLine}>
                  <label>หมายเลขบัตรประชาชน</label>
                  <input
                    className={styles.inputSmall}
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.rowLine}>
                  <label>ชื่อ นามสกุล</label>
                  <input
                    className={styles.inputSmall}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <input
                    className={styles.inputSmall}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.row}>
                  <label>ที่อยู่</label>
                  <textarea
                    className={styles.textAreaLarge}
                    name="targetAddress"
                    value={formData.targetAddress}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className={styles.rowLine}>
                  <label>เบอร์โทรศัพท์</label>
                  <input
                    className={styles.inputMedium}
                    name="targetPhone"
                    value={formData.targetPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.avatarBox}>
                <img src={avatar} alt="person" />
              </div>
            </div>
          </div>

          {/* 🔹 ข้อมูลการแจ้งปัญหา */}
          <div className={styles.section}>
            <h3>ข้อมูลการแจ้งปัญหา</h3>
            <div className={styles.row}>
              <label>ประเภทปัญหา</label>
              <input
                className={styles.inputMedium}
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
              />
              <button className={styles.searchBtn}>
                <FaSearch /> ค้นหา
              </button>
            </div>
            <div className={styles.row}>
              <label>รายละเอียดปัญหา</label>
              <textarea
                className={styles.textAreaLarge1}
                name="problemDetail"
                value={formData.problemDetail}
                onChange={handleChange}
              ></textarea>
            </div>

{/* 🔹 พิกัดปัญหา */}
<div className={styles.mapSection}>
  <label className={styles.coordTitle}>พิกัดปัญหา</label>
  <div className={styles.coordRow}>
  <div className={styles.latField}>
    <label className={styles.latLabel}>Latitude</label>
    <input
      type="text"
      className={styles.inputLat}
      value={formData.location.split(",")[0] || ""}
      readOnly
    />
  </div>

  <div className={styles.lngField}>
    <label className={styles.lngLabel}>Longitude</label>
    <input
      type="text"
      className={styles.inputLng}
      value={formData.location.split(",")[1] || ""}
      readOnly
    />
  </div>
</div>

  <MapContainer
    center={
      formData.location
        ? (formData.location.split(",").map(Number) as [number, number])
        : [18.653549, 99.038908]
    }
    zoom={13}
    className={styles.leafletMap}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <DraggableMarker formData={formData} updateLocation={updateLocation} />
  </MapContainer>
</div>



        

            {/* รูปก่อน */}
            <div className={styles.imageSection}>
              <label className={styles.imageLabel}>รูปภาพก่อนดำเนินการ</label>
              <div className={styles.rowImage}>
                {beforeImages.map((img, i) => (
                  <div
                    key={i}
                    className={styles.imageBox}
                    onClick={() => document.getElementById(`before-${i}`)?.click()}
                  >
                    {img ? (
                      <img src={img} alt={`ก่อน ${i + 1}`} className={styles.previewImage} />
                    ) : (
                      <span className={styles.placeholderText}>+</span>
                    )}
                    <input
                      type="file"
                      id={`before-${i}`}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, i, "before")}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🔹 การดำเนินการ */}
          <div className={styles.section}>
            <h3>ข้อมูลการดำเนินการแก้ไขปัญหา</h3>
            <div className={styles.row}>
              <label>วันที่ดำเนินการ</label>
              <input
                className={`${styles.inputSmall}`}
                type="date"
                name="fixDate"
                value={formData.fixDate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.row}>
              <label>บันทึกการดำเนินการ</label>
              <textarea
                className={styles.textAreaLarge2}
                name="fixDetail"
                value={formData.fixDetail}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className={styles.row}>
              <label>ผู้ดำเนินการ</label>
              <input
                className={`${styles.inputMedium}`}
                type="text"
                name="operator"
                value={formData.operator}
                onChange={handleChange}
              />
            </div>

            {/* รูปหลัง */}
            <div className={styles.imageSection}>
              <label className={styles.imageLabel}>รูปภาพหลังดำเนินการเสร็จ</label>
              <div className={styles.rowImage}>
                {afterImages.map((img, i) => (
                  <div
                    key={i}
                    className={styles.imageBox}
                    onClick={() => document.getElementById(`after-${i}`)?.click()}
                  >
                    {img ? (
                      <img src={img} alt={`หลัง ${i + 1}`} className={styles.previewImage} />
                    ) : (
                      <span className={styles.placeholderText}>+</span>
                    )}
                    <input
                      type="file"
                      id={`after-${i}`}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, i, "after")}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🔹 ปุ่มบันทึก */}
          <div className={styles.buttonRow}>
            <button className={styles.saveBtn} onClick={handleSave}>
              บันทึกข้อมูล
            </button>
            <button className={styles.cancelBtn}>ยกเลิก</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tracking_RSPM;
