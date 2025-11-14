import React, { useEffect } from "react";

/**
 * GlobalDocument Component
 * ใช้สำหรับกำหนด global <style>, ฟอนต์, และ meta tag ภายใน React
 * (เทียบเท่ากับ Next.js _document.tsx)
 */
const GlobalDocument: React.FC = () => {
  useEffect(() => {
    // ✅ เพิ่ม Google Fonts ผ่าน <link>
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // ✅ เพิ่ม global style ผ่าน <style> (แทนที่ _document.tsx)
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;
        background-color: #ffffff;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Playfair Display', serif;
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);

    // ✅ เพิ่ม meta สำหรับภาษาไทย
    const htmlTag = document.documentElement;
    htmlTag.lang = "th";
  }, []);

  // ไม่ต้อง render UI — แค่ใส่ global setting
  return null;
};

export default GlobalDocument;
