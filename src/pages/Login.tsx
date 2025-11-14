import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ใช้ react-router แทน next/router
import { FaGlobe, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../styles/login.module.css";
import Footer from "../components/Footer";
import smartImage from '../assets/images/smart.png';
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<"en" | "th">("en");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "th" : "en"));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      localStorage.setItem("user", username);
      navigate("/main-menu"); // ✅ ใช้ navigate แทน router.push
      setError("");
    } else {
      setError("Username หรือ Password ไม่ถูกต้อง");
    }
  };

  const translations = {
    en: {
      title: "SMART ONE",
      subtitle: "The Total Solution Smart City",
      welcome: "Welcome back",
      emailLabel: "Username",
      emailPlaceholder: "Enter username or email address",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter password",
      forgot: "Forgot Password?",
      button: "Login",
      orDivider: "OR",
      remember: "Remember me",
    },
    th: {
      title: "สมาร์ท วัน",
      subtitle: "โซลูชันอัจฉริยะครบวงจรสำหรับเมือง",
      welcome: "ยินดีต้อนรับกลับ!",
      emailLabel: "ชื่อผู้ใช้",
      emailPlaceholder: "กรอกชื่อผู้ใช้หรืออีเมล",
      passwordLabel: "รหัสผ่าน",
      passwordPlaceholder: "กรอกรหัสผ่าน",
      forgot: "ลืมรหัสผ่าน?",
      button: "เข้าสู่ระบบ",
      orDivider: "หรือ",
      remember: "จดจำฉัน",
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={smartImage} alt="Smart Background" className={styles.backgroundImage} />
      </div>

      <div className={styles.right}>
        <div className={`${styles.formContainer} ${styles.glassForm}`}>
          <div className={styles.languageToggle}>
            <button
              type="button"
              className={styles.languageButton}
              onClick={toggleLanguage}
            >
              <FaGlobe className={`${styles.icon} ${styles.enhancedIcon}`} />{" "}
              {language === "en" ? "EN" : "TH"}
            </button>
          </div>

          <h1 className={styles.title}>{translations[language].title}</h1>
          <p className={styles.subtitle}>{translations[language].subtitle}</p>
          <p className={styles.welcome}>{translations[language].welcome}</p>
          <div className={styles.orDivider}>
            {translations[language].orDivider}
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="email" className={styles.label}>
              {translations[language].emailLabel}
            </label>
            <input
              type="text"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder={translations[language].emailPlaceholder}
              required
            />

            <label htmlFor="password" className={styles.label}>
              {translations[language].passwordLabel}
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder={translations[language].passwordPlaceholder}
                required
              />
              <span
                className={styles.eyeIcon}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEye className={styles.enhancedIcon} />
                ) : (
                  <FaEyeSlash className={styles.enhancedIcon} />
                )}
              </span>
            </div>

            <div className={styles.options}>
              <div className={styles.remember}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">
                  {translations[language].remember}
                </label>
              </div>
              <a href="#" className={styles.forgot}>
                {translations[language].forgot}
              </a>
            </div>

            <button
              type="submit"
              className={`${styles.button} ${styles.macButton}`}
            >
              {translations[language].button}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>

        {/* ✅ เพิ่ม Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Login;
