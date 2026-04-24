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
  const [showLoginForm, setShowLoginForm] = useState(false); // step 1 → step 2
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

.service-tile {
  display: flex;
  align-items: center;
  padding: 24px 32px;
  border-radius: 8px;
  cursor: pointer;
  min-height: 180px;

  background: #ffffff;              /* WHITE CARD */
  border-top: 6px solid transparent;/* TOP BORDER ONLY */
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}


.tile-blue {
  border-top-color: #1976d2; /* BLUE BORDER */
  color: #1f2933;
}

.tile-blue .tile-icon {
  background: #1976d2;       /* BLUE ICON */
  color: #ffffff;
}


.tile-yellow {
  border-top-color: #f9a825; /* YELLOW BORDER */
  color: #1f2933;
}

.tile-yellow .tile-icon {
  background: #f9a825;       /* YELLOW ICON */
  color: #ffffff;
}


.tile-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;        /* ROUND ICON */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 20px;
  flex-shrink: 0;
}

.tile-text {
  flex-grow: 1;
  font-size: 20px;
  font-weight: 600;
}

.tile-arrow {
  font-size: 20px;
}

.tile-spacing {
  margin-bottom: 40px;
}
`}</style>

      {/* <div className="container-fluid p-2 p-sm-4">
        <Card className="overflow-hidden card-gutter-lg rounded-4 card-auth card-auth-mh">
          <Row className="g-0 flex-column-reverse flex-lg-row-reverse"> */}

           <div className="container-lg p-2 p-sm-4">
          {/* <Card className="overflow-hidden card-gutter-lg rounded-4 card-auth card-auth-mh"> */}
<Card
  className="overflow-hidden card-gutter-lg rounded-4 card-auth card-auth-mh"
  style={{ transform: "scale(1.13)" }}
>

            <Row className="g-0 flex-column-reverse flex-lg-row-reverse">

            {/* ===== LEFT PANEL ===== */}
            <Col lg="5">
                  <Card.Body className="h-100 d-flex flex-column justify-content-center">

                {/* STEP 1: TWO BUTTONS */}
                {/* {!showLoginForm ? (
                  <div className="d-grid gap-3">
                    <Button size="lg" onClick={() => setShowLoginForm(true)}>
                      Department Login
                    </Button>

                    <Button
                      size="lg"
                      onClick={() => window.location.assign(APP_ROUTES.applicationStatus)}
                    >
                      View Application Status
                    </Button>
                  </div>
)  */}
{!showLoginForm ? (
  <Row className="g-5">
    {/* 🔶 Department Login – ORANGE TOP BORDER */}
<Col sm={14} className="tile-spacing">
  <div
    className="service-tile tile-blue"
    onClick={() => setShowLoginForm(true)}
  >
    {/* ICON IN FRONT */}
    <div className="tile-icon">🏛️</div>

    {/* TEXT */}
    <div className="tile-text">
      Government User
    </div>

    {/* ARROW */}
    <div className="tile-arrow">➜</div>
  </div>
</Col>


{/* ================= Citizen Access – YELLOW TILE ================= */}
<Col sm={14}>
  <div
    className="service-tile tile-yellow"
    onClick={() =>
      (window.location.href =
        window.location.hostname === "localhost"
          ? "http://localhost:3000/seriui/application-status"
          : "https://e-reshme.karnataka.gov.in/seriui/application-status")
    }
    // onClick={() => window.location.assign(APP_ROUTES.applicationStatus)}
  >
    {/* ICON IN FRONT */}
    <div className="tile-icon">👤</div>

    {/* TEXT */}
    <div className="tile-text">
      Citizen Access
    </div>

    {/* ARROW */}
    <div className="tile-arrow">➜</div>
  </div>
</Col>
  </Row>
) 

: !toggle ? (
                  /* STEP 2: LOGIN FORM */
                  <>
                    <div className="nk-block-head text-center">
                      <h3 style={{ color: "#000" }}>Login</h3>
                      <p className="small">Please sign-in to your account.</p>
                    </div>

                    <Form noValidate validated={validated} onSubmit={generateOTP}>
                      <Form.Group className="mb-3">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control
                          name="username"
                          value={data.username}
                          onChange={handleInputs}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={data.password}
                          onChange={handleInputs}
                          required
                        />
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button type="submit">Login to account</Button>
{/* <Link
  to={APP_ROUTES.mobileAppDownload}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-primary"
>
  Download Mobile App
</Link> */}

                      {/* </div> */}

                      </div>
                    </Form>
                  </>

                ) : (
                  /* STEP 3: OTP SCREEN */
                  <>
                    <div className="nk-block-head text-center">
                      {/* <h3>Verification</h3> */}
                      <p className="small">
                        Enter the one time password received to: +91 {mobileNumber}
                      </p>
                    </div>

                    <div className="d-flex justify-content-center mt-2">
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span> </span>}
                        inputType="password"
                        renderInput={(props, i) => (
                          <input {...props} autoFocus={i === 0} />
                        )}
                        inputStyle={{
                          width: "2rem",
                          height: "2rem",
                          fontSize: "1.5rem",
                          margin: "0 0.5rem",
                          padding: "0.5rem",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>

                    <p
                      className={`small text-center mt-2 ${
                        display ? "" : "d-none"
                      }`}
                      style={{ color: "red", fontWeight: "bold" }}
                    >
                      Either OTP is not Valid or has Expired
                    </p>

                    <div className="d-flex justify-content-between mt-2">
                      <p className="small">Wait for {formattedTime} mins</p>
                      <Link
                        onClick={handleResendOTP}
                        style={{
                          pointerEvents: isTimerRunning ? "none" : "auto",
                          color: isTimerRunning ? "gray" : "blue",
                        }}
                      >
                        Resend OTP
                      </Link>
                    </div>

                    <div className="d-grid mt-3">
                      <Button onClick={verifyotp}>Verify OTP</Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Col>

            {/* ===== RIGHT PANEL ===== */}
           {/* ===== RIGHT PANEL ===== */}
<Col lg="7">
  <Card.Body className="bg-primary bg-darker1 is-theme has-mask has-mask-1 h-100 d-flex align-items-start justify-content-center">
    <div className="mask mask-1"></div>

    {/* 🔹 SAME WRAPPER AS OLD CODE */}
    <div className="d-flex flex-column justify-content-center align-items-center mt-n5">
      <div className="brand-logo">
        <LoginLogo />
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="mt-2 ms-3 d-flex flex-column align-items-center justify-content-center">
            <h2 style={{ color: "#fff" }}>Department of Sericulture</h2>
            <h2 style={{ color: "#fff" }}>Government of Karnataka</h2>
          </div>
        </div>
      </div>
    </div>
  </Card.Body>
</Col>

          </Row>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthLoginPage;
