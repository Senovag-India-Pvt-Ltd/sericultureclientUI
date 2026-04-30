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

  /* ========= UI STATES ========= */
  const [showLoginForm, setShowLoginForm] = useState(true); // skip tile selection, go directly to login form
  const [toggle, setToggle] = useState(false); // step 2 → step 3

  /* ========= FORM ========= */
  const [data, setData] = useState({ username: "", password: "" });
  const [validated, setValidated] = useState(false);

  /* ========= OTP ========= */
  const [otp, setOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [display, setDisplay] = useState(false);

  /* ========= TIMER ========= */
  const [timer, setTimer] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  /* ========= HANDLERS ========= */

  const handleInputs = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const startTimer = () => setIsTimerRunning(true);

  /* ========= GENERATE OTP ========= */

  const generateOTP = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

        axios
      .post(
        baseURL + "userMaster/generate-otp-by-user-name-and-password",

 
        data,
        { headers: _header }
           )
      .then((res) => {
      
      const temp = res.data.content;
      if (!temp?.error) {
        setToggle(true);
        startTimer();
        setMobileNumber("*".repeat(6) + temp.phoneNumber?.slice(6));
      } else {
        Swal.fire(
          "Invalid Username or Password",
          "Please enter valid credentials",
          "error"
        );
      }
          });
   

    setValidated(true);
  };

  /* ========= VERIFY OTP ========= */
  const verifyotp = () => {
    axios
      .post(
        baseURL + "userMaster/verify-otp-by-user-name",

        { username: data.username, enteredOtpByUser: otp },
        { headers: _header }
           )
      .then((res) => {
      
      if (res.data.content?.otpVerified) {
        postLogin();
      } else {
        setOtp("");
        setDisplay(true);
      }
         });
  };

  /* ========= FINAL LOGIN ========= */

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

  /* ========= RESEND OTP ========= */

  const handleResendOTP = () => {
    setTimer(60);
    startTimer();
    generateOTP({
      preventDefault: () => {},
      currentTarget: { checkValidity: () => true },
    });
  };

  /* ========= TIMER ========= */

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

  const formattedTime = `${String(Math.floor(timer / 60)).padStart(
    2,
    "0"
  )}:${String(timer % 60).padStart(2, "0")}`;

  /* ========= UI ========= */

  return (
    <Layout title="Login" centered>
      <style>{`
        .auth-page-wrap {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #0a4d8a 0%, #0f6cbe 50%, #1e85d8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          box-sizing: border-box;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
        }
        .auth-card {
          width: min(960px, 96vw);
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
          display: flex;
          min-height: 580px;
        }
        .auth-brand {
          flex: 1.1;
          background: linear-gradient(160deg, #0a4d8a 0%, #0f6cbe 60%, #1e85d8 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 28px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .auth-brand::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .auth-brand::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -40px;
          width: 280px; height: 280px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .auth-brand-logo {
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-brand-logo .logo-wrap {
          height: auto !important;
          position: static !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .auth-brand-logo .logo-link {
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .auth-brand-logo img {
          width: 150px !important;
          height: 150px !important;
          border-radius: 50% !important;
          border: 4px solid rgba(255,255,255,0.4) !important;
          background: rgba(255,255,255,0.1) !important;
          object-fit: contain !important;
          padding: 10px !important;
          box-sizing: border-box !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
        }
        .auth-brand h1 {
          color: #fff;
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 8px;
          line-height: 1.3;
          position: relative; z-index: 1;
        }
        .auth-brand p {
          color: rgba(255,255,255,0.8);
          font-size: 0.92rem;
          margin: 0 0 4px;
          position: relative; z-index: 1;
        }
        .auth-brand-badge {
          margin-top: 28px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 30px;
          padding: 8px 20px;
          color: #c8e0ff;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          position: relative; z-index: 1;
        }
        .auth-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 40px;
          background: #fff;
        }
        .auth-form-header {
          margin-bottom: 32px;
        }
        .auth-form-header h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0a4d8a;
          margin: 0 0 6px;
        }
        .auth-form-header p {
          color: #5a7a9a;
          font-size: 0.88rem;
          margin: 0;
        }
        .auth-divider {
          width: 48px; height: 4px;
          background: linear-gradient(90deg, #0f6cbe, #1e85d8);
          border-radius: 4px;
          margin: 10px 0 0;
        }
        .auth-field-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #0a4d8a;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .auth-input {
          width: 100%;
          padding: 11px 16px;
          border: 1.5px solid #bfd4ec;
          border-radius: 8px;
          font-size: 0.92rem;
          color: #0d1a2e;
          background: #f0f6ff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .auth-input:focus {
          border-color: #0f6cbe;
          box-shadow: 0 0 0 3px rgba(15,108,190,0.12);
          background: #fff;
        }
        .auth-input.is-invalid {
          border-color: #dc3545;
        }
        .auth-btn-primary {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #0a4d8a 0%, #0f6cbe 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: opacity 0.2s, transform 0.1s;
          margin-bottom: 10px;
        }
        .auth-btn-primary:hover { opacity: 0.92; }
        .auth-btn-primary:active { transform: scale(0.99); }
        .auth-btn-secondary {
          width: 100%;
          padding: 11px;
          background: #f0f6ff;
          color: #0f6cbe;
          border: 1.5px solid #a8c8e8;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          display: block;
          transition: background 0.2s;
        }
        .auth-btn-secondary:hover { background: #e3f0fb; color: #0f6cbe; }
        .auth-field-wrap { margin-bottom: 18px; }
        .auth-otp-wrap { display: flex; justify-content: center; gap: 10px; margin: 12px 0; }
        .auth-otp-input {
          width: 44px !important; height: 48px;
          font-size: 1.3rem; font-weight: 700;
          border-radius: 8px; border: 1.5px solid #bfd4ec;
          text-align: center; background: #f0f6ff;
          color: #0a4d8a;
        }
        .auth-otp-input:focus { border-color: #0f6cbe; outline: none; }
        .auth-timer-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.84rem; color: #5a7a9a; margin-top: 6px; }
        .auth-resend-btn { background: none; border: none; color: #0f6cbe; font-weight: 700; cursor: pointer; font-size: 0.84rem; padding: 0; }
        .auth-resend-btn:disabled { color: #aac; cursor: default; }
        .auth-error-msg { color: #c0392b; font-size: 0.82rem; font-weight: 600; text-align: center; margin-top: 8px; }
        .auth-otp-info { color: #3a5878; font-size: 0.85rem; text-align: center; margin-bottom: 4px; }
        @media (max-width: 700px) {
          .auth-card { flex-direction: column; }
          .auth-brand { padding: 32px 20px; }
          .auth-form-panel { padding: 32px 20px; }
        }
      `}</style>

      <div className="auth-page-wrap">
        <div className="auth-card">

          {/* ===== BRAND PANEL (LEFT) ===== */}
          <div className="auth-brand">
            <div className="auth-brand-logo">
              <LoginLogo />
            </div>
            <h1>e-Reshme Portal</h1>
            {/* <p>Department of Sericulture</p>
            <p>Government of Karnataka</p> */}
            <p style={{ color: "white" }}>Department of Sericulture</p>
            <p style={{ color: "white" }}>Government of Karnataka</p>
            {/* <div className="auth-brand-badge">Official Government Portal</div> */}
          </div>

          {/* ===== FORM PANEL (RIGHT) ===== */}
          <div className="auth-form-panel">

            {!toggle ? (
              <>
                {/* <div className="auth-form-header"> */}
                  {/* <h2>Sign In</h2> */}
                  {/* <p>Sign in to your government account</p> */}
                  {/* <div className="auth-divider" /> */}
                {/* </div> */}

                <form noValidate onSubmit={generateOTP}>
                  <div className={`auth-field-wrap ${validated && !data.username ? "was-validated" : ""}`}>
                    <label className="auth-field-label">User Name</label>
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

                  <div className={`auth-field-wrap ${validated && !data.password ? "was-validated" : ""}`}>
                    <label className="auth-field-label">Password</label>
                    <input
                      className={`auth-input ${validated && !data.password ? "is-invalid" : ""}`}
                      type="password"
                      name="password"
                      value={data.password}
                      onChange={handleInputs}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                    />
                  </div>

                  <button type="submit" className="auth-btn-primary">
                    Login to Account
                  </button>

                  {/* <a
                    href="https://e-reshme.karnataka.gov.in/seriui/sericulture.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="auth-btn-secondary"
                  >
                    Download Mobile App
                  </a> */}
                </form>
              </>
            ) : (
              <>
                <div className="auth-form-header">
                  <h2>OTP Verification</h2>
                  <p>Enter the one-time password sent to your registered mobile</p>
                  <div className="auth-divider" />
                </div>

                <p className="auth-otp-info">
                  OTP sent to: <strong>+91 {mobileNumber}</strong>
                </p>

                <div className="auth-otp-wrap">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span style={{ width: 6 }} />}
                    inputType="password"
                    renderInput={(props, i) => (
                      <input {...props} autoFocus={i === 0} className="auth-otp-input" />
                    )}
                    inputStyle={{
                      width: "44px",
                      height: "48px",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      borderRadius: "8px",
                      border: "1.5px solid #bfd4ec",
                      textAlign: "center",
                      background: "#f0f6ff",
                      color: "#0a4d8a",
                    }}
                  />
                </div>

                {display && (
                  <p className="auth-error-msg">OTP is invalid or has expired. Please try again.</p>
                )}

                <div className="auth-timer-row">
                  <span>Resend in {formattedTime}</span>
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
                  style={{ marginTop: 20 }}
                  onClick={verifyotp}
                >
                  Verify OTP
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AuthLoginPage;
