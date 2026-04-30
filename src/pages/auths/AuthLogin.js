import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import Swal from "sweetalert2";

import Layout from "../../layout/fullpage";
import { login } from "../../services/authService";
import LoginLogo from "../../components/Logo/LoginLogo";
import { APP_ROUTES } from "../../config/appRoutes";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const joinUrl = (base, path) => `${(base || "").replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

const AuthLoginPage = () => {
  const navigate = useNavigate();

  const [showLoginForm, setShowLoginForm] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState({ username: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [display, setDisplay] = useState(false);
  const [timer, setTimer] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const handleInputs = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const startTimer = () => setIsTimerRunning(true);

  const generateOTP = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    axios
      .post(baseURL + "userMaster/generate-otp-by-user-name-and-password", data, { headers: _header })
      .then((res) => {
        const temp = res.data.content;
        if (!temp?.error) {
          setToggle(true);
          startTimer();
          setMobileNumber("*".repeat(6) + temp.phoneNumber?.slice(6));
        } else {
          Swal.fire("Invalid Username or Password", "Please enter valid credentials", "error");
        }
      });
    setValidated(true);
  };

  const verifyotp = () => {
    axios
      .post(baseURL + "userMaster/verify-otp-by-user-name", { username: data.username, enteredOtpByUser: otp }, { headers: _header })
      .then((res) => {
        if (res.data.content?.otpVerified) {
          postLogin();
        } else {
          setOtp("");
          setDisplay(true);
        }
      });
  };

  const postLogin = async () => {
    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate(APP_ROUTES.homepage);
      } else {
        Swal.fire("Login failed", "Invalid credentials", "error");
      }
    } catch {
      Swal.fire("Error", "Login failed", "error");
    }
  };

  const handleResendOTP = () => {
    setTimer(60);
    startTimer();
    generateOTP({ preventDefault: () => {}, currentTarget: { checkValidity: () => true } });
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t > 0) return t - 1;
          setIsTimerRunning(false);
          clearInterval(interval);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formattedTime = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

  return (
    <Layout title="Login" centered>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

        /* ===== PAGE WRAP ===== */
        .auth-page-wrap {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(145deg, #041e3a 0%, #083d6e 35%, #0f6cbe 70%, #1e85d8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 70px;
          box-sizing: border-box;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Floating background orbs */
        .auth-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .auth-orb-1 {
          top: -120px; left: -120px;
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
          animation: orbFloat 9s ease-in-out infinite;
        }
        .auth-orb-2 {
          bottom: -100px; right: -80px;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: orbFloat 11s ease-in-out infinite reverse;
        }
        .auth-orb-3 {
          top: 50%; left: 50%;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(249,168,37,0.06) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          animation: orbFloat 7s ease-in-out infinite 2s;
        }

        /* ===== CARD ===== */
        .auth-card {
          width: min(1020px, 96vw);
          background: #ffffff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow:
            0 40px 90px rgba(0,0,0,0.4),
            0 12px 32px rgba(0,0,0,0.2),
            0 0 0 1px rgba(255,255,255,0.08);
          display: flex;
          min-height: 480px;
          position: relative;
          z-index: 1;
          animation: cardEntrance 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ===== BRAND PANEL (LEFT) ===== */
        .auth-brand {
          flex: 0 0 400px;
          background: linear-gradient(160deg, #041e3a 0%, #083d6e 30%, #0f6cbe 65%, #1e85d8 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 52px 36px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* Gold top accent bar */
        .auth-brand-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, #f9a825 0%, #ffca28 50%, #f9a825 100%);
          box-shadow: 0 2px 12px rgba(249,168,37,0.5);
        }

        /* Decorative circles */
        .auth-brand-circle-1 {
          position: absolute;
          top: -70px; right: -70px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .auth-brand-circle-2 {
          position: absolute;
          bottom: -90px; left: -55px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .auth-brand-circle-3 {
          position: absolute;
          top: 48%; left: -55px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          transform: translateY(-50%);
        }

        /* Logo */
        .auth-logo-ring {
          position: relative;
          z-index: 1;
          margin-bottom: 26px;
          width: 150px; height: 150px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 3px solid rgba(255,255,255,0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 0 10px rgba(255,255,255,0.05),
            0 12px 36px rgba(0,0,0,0.3);
          animation: logoPulse 3.5s ease-in-out infinite;
          overflow: hidden;
        }
        .auth-logo-ring > *,
        .auth-logo-ring .logo-wrap,
        .auth-logo-ring .logo-link {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
          position: static !important;
        }
        .auth-logo-ring img {
          width: 120px !important;
          height: 120px !important;
          border-radius: 50% !important;
          border: none !important;
          background: transparent !important;
          object-fit: contain !important;
          padding: 10px !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
          margin: 0 !important;
        }

        /* Brand text — unified color, size, font-weight */
        .auth-brand-name {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 900;
          font-family: "Poppins", "Segoe UI", Tahoma, sans-serif;
          margin: 0 0 6px;
          line-height: 1.2;
          position: relative; z-index: 1;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 12px rgba(0,0,0,0.25);
        }
        .auth-brand-dept {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 900;
          font-family: "Poppins", "Segoe UI", Tahoma, sans-serif;
          margin: 0 0 4px;
          line-height: 1.2;
          position: relative; z-index: 1;
          letter-spacing: 0.01em;
        }
        .auth-brand-gov {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 900;
          font-family: "Poppins", "Segoe UI", Tahoma, sans-serif;
          margin: 0;
          line-height: 1.2;
          position: relative; z-index: 1;
          letter-spacing: 0.01em;
        }

        .auth-brand-sep {
          width: 54px; height: 3px;
          background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.55), rgba(255,255,255,0.15));
          border-radius: 3px;
          margin: 22px auto 20px;
          position: relative; z-index: 1;
        }

        .auth-brand-badge {
          background: rgba(255,255,255,0.11);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px;
          padding: 8px 24px;
          color: #c8e0ff;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          position: relative; z-index: 1;
        }

        /* ===== FORM PANEL (RIGHT) ===== */
        .auth-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 52px;
          background: #ffffff;
          overflow-y: auto;
        }

        .auth-form-header { margin-bottom: 30px; }
        .auth-form-header h2 {
          font-size: 1.8rem;
          font-weight: 900;
          color: #083d6e;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }
        .auth-form-header p {
          color: #5a7a9a;
          font-size: 0.87rem;
          font-weight: 500;
          margin: 0;
        }
        .auth-divider {
          width: 54px; height: 4px;
          background: linear-gradient(90deg, #0f6cbe, #1e85d8);
          border-radius: 4px;
          margin: 12px 0 0;
        }

        /* Fields */
        .auth-field-wrap { margin-bottom: 20px; }
        .auth-field-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #083d6e;
          margin-bottom: 8px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .auth-input-wrap { position: relative; }
        .auth-input-icon {
          position: absolute;
          left: 15px; top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          pointer-events: none;
          opacity: 0.55;
        }
        .auth-input {
          width: 100%;
          padding: 13px 44px 13px 44px;
          border: 1.5px solid #d4e6f5;
          border-radius: 10px;
          font-size: 0.93rem;
          color: #0d1a2e;
          background: #f4f9ff;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
        }
        .auth-input:focus {
          border-color: #0f6cbe;
          box-shadow: 0 0 0 4px rgba(15,108,190,0.1);
          background: #ffffff;
        }
        .auth-input.is-invalid {
          border-color: #e53e3e;
          box-shadow: 0 0 0 4px rgba(229,62,62,0.1);
        }
        .auth-input::placeholder { color: #b0c8e0; font-size: 0.88rem; }

        .auth-eye-btn {
          position: absolute;
          right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; padding: 4px 6px;
          color: #8aaccc; font-size: 1rem;
          line-height: 1;
          transition: color 0.2s;
          border-radius: 4px;
        }
        .auth-eye-btn:hover { color: #0f6cbe; background: rgba(15,108,190,0.07); }

        /* Primary button */
        .auth-btn-primary {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, #083d6e 0%, #0f6cbe 55%, #1e85d8 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.97rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 10px;
          box-shadow: 0 6px 20px rgba(15,108,190,0.38);
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .auth-btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(15,108,190,0.45);
        }
        .auth-btn-primary:active { transform: scale(0.99) translateY(0); box-shadow: 0 4px 14px rgba(15,108,190,0.3); }

        /* OTP */
        .auth-otp-info {
          color: #3a5878;
          font-size: 0.87rem;
          text-align: center;
          margin-bottom: 6px;
          background: linear-gradient(90deg, #f0f6ff, #e8f3fd);
          border-radius: 10px;
          padding: 11px 16px;
          border-left: 4px solid #0f6cbe;
        }
        .auth-otp-wrap { display: flex; justify-content: center; gap: 10px; margin: 18px 0; }
        .auth-otp-input {
          width: 50px !important; height: 58px !important;
          font-size: 1.5rem !important; font-weight: 700 !important;
          border-radius: 10px !important; border: 2px solid #d4e6f5 !important;
          text-align: center !important; background: #f4f9ff !important;
          color: #083d6e !important; font-family: inherit !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
          outline: none !important;
        }
        .auth-otp-input:focus {
          border-color: #0f6cbe !important;
          box-shadow: 0 0 0 4px rgba(15,108,190,0.12) !important;
          background: #fff !important;
        }

        .auth-timer-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.84rem; color: #5a7a9a; margin-top: 10px;
          background: #f4f9ff; border-radius: 10px; padding: 10px 16px;
          border: 1px solid #e0eef8;
        }
        .auth-resend-btn {
          background: none; border: none; color: #0f6cbe;
          font-weight: 700; cursor: pointer; font-size: 0.84rem;
          padding: 0; font-family: inherit; transition: color 0.2s;
        }
        .auth-resend-btn:disabled { color: #aac; cursor: default; }
        .auth-resend-btn:not(:disabled):hover { color: #083d6e; }

        .auth-error-msg {
          color: #c0392b; font-size: 0.82rem; font-weight: 600;
          text-align: center; margin-top: 10px;
          background: #fff5f5; border-radius: 8px; padding: 10px 14px;
          border: 1.5px solid #ffc9c9;
        }

        /* Responsive */
        @media (max-width: 820px) {
          .auth-card { flex-direction: column; min-height: auto; }
          .auth-brand { flex: none; padding: 36px 24px; }
          .auth-form-panel { padding: 36px 28px; }
        }
        @media (max-width: 480px) {
          .auth-form-panel { padding: 28px 18px; }
          .auth-brand { padding: 28px 18px; }
        }

        /* Footer */
        .auth-site-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(90deg, #083d6e 0%, #0f6cbe 50%, #1e85d8 100%);
          color: #d8eaff;
          padding: 12px 24px;
          font-size: 0.82rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-align: center;
          border-top: 2px solid rgba(255,255,255,0.08);
          letter-spacing: 0.01em;
          z-index: 2;
        }
        .auth-footer-sep { opacity: 0.45; }

        @media (max-width: 640px) {
          .auth-site-footer {
            flex-wrap: wrap;
            gap: 6px;
            padding: 10px 12px;
            font-size: 0.72rem;
          }
          .auth-footer-sep { display: none; }
        }

        /* Animations */
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -22px) scale(1.03); }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(32px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 0 10px rgba(255,255,255,0.05), 0 12px 36px rgba(0,0,0,0.3); }
          50%       { box-shadow: 0 0 0 16px rgba(255,255,255,0.08), 0 12px 36px rgba(0,0,0,0.3); }
        }
      `}</style>

      <div className="auth-page-wrap">
        {/* Background orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />

        <div className="auth-card">

          {/* ===== BRAND PANEL ===== */}
          <div className="auth-brand">
            <div className="auth-brand-top-bar" />
            <div className="auth-brand-circle-1" />
            <div className="auth-brand-circle-2" />
            <div className="auth-brand-circle-3" />

            <div className="auth-logo-ring">
              <LoginLogo />
            </div>

            <h1 className="auth-brand-name">e-Reshme Portal</h1>
            <p className="auth-brand-dept">Department of Sericulture</p>
            <p className="auth-brand-gov">Government of Karnataka</p>

            <div className="auth-brand-sep" />
          </div>

          {/* ===== FORM PANEL ===== */}
          <div className="auth-form-panel">

            {!toggle ? (
              <>
                <form noValidate onSubmit={generateOTP}>
                  <div className="auth-field-wrap">
                    <label className="auth-field-label">User Name</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">👤</span>
                      <input
                        className={`auth-input ${validated && !data.username ? "is-invalid" : ""}`}
                        name="username"
                        value={data.username}
                        onChange={handleInputs}
                        required
                        autoComplete="username"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>

                  <div className="auth-field-wrap">
                    <label className="auth-field-label">Password</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input
                        className={`auth-input ${validated && !data.password ? "is-invalid" : ""}`}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={data.password}
                        onChange={handleInputs}
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowPassword((p) => !p)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="auth-btn-primary">
                    Login to Account <span>→</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="auth-form-header">
                  <h2>OTP Verification 🔐</h2>
                  <p>Enter the one-time password sent to your registered mobile</p>
                  <div className="auth-divider" />
                </div>

                <p className="auth-otp-info">
                  📱 OTP sent to: <strong>+91 {mobileNumber}</strong>
                </p>

                <div className="auth-otp-wrap">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span style={{ width: 8 }} />}
                    inputType="password"
                    renderInput={(props, i) => (
                      <input {...props} autoFocus={i === 0} className="auth-otp-input" />
                    )}
                    inputStyle={{
                      width: "50px",
                      height: "58px",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      borderRadius: "10px",
                      border: "2px solid #d4e6f5",
                      textAlign: "center",
                      background: "#f4f9ff",
                      color: "#083d6e",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {display && (
                  <p className="auth-error-msg">⚠️ OTP is invalid or has expired. Please try again.</p>
                )}

                <div className="auth-timer-row">
                  <span>⏱ Resend in <strong>{formattedTime}</strong></span>
                  <button
                    type="button"
                    className="auth-resend-btn"
                    onClick={handleResendOTP}
                    disabled={isTimerRunning}
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="button"
                  className="auth-btn-primary"
                  style={{ marginTop: 22 }}
                  onClick={verifyotp}
                >
                  Verify OTP <span>→</span>
                </button>
              </>
            )}
          </div>

        </div>

        {/* ===== FOOTER ===== */}
        <footer className="auth-site-footer">
          <span>© Department of Sericulture, Government of Karnataka</span>
          <span className="auth-footer-sep">|</span>
          <span>Designed and Developed by Senovag India Pvt. Ltd.</span>
        </footer>
      </div>
    </Layout>
  );
};

export default AuthLoginPage;
