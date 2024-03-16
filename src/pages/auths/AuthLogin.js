import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import Swal from "sweetalert2";

import Layout from "../../layout/fullpage";
import { login } from "../../services/authService";

// import {Media, MediaGroup, Image, OverlineTitle, Logo} from '../../components';
import LoginLogo from "../../components/Logo/LoginLogo";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const AuthLoginPage = () => {
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);

  const [otp, setOtp] = useState("");
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [mobileNumber, setMobileNumber] = useState("");

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  // const handleOtp = (e) =>{
  //   setOtp(e.target.value);
  // }

  const [display, setDisplay] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCheckBox = (e) => {
    setChecked(e.target.checked);
  };

  const clickSubmit = async (ev) => {
    setToggle((prev) => !prev);
    ev.preventDefault();
    const input = inputRef1.current.value.toLowerCase();
    const pass = inputRef2.current.value;
    // console.log(inputRef1.current.value);

    // Test JWT code goes here...
    try {
      // debugger
      const isLoginSuccess = await login(input, pass);
      // Store the token in local storage or a secure storage mechanism
      if (isLoginSuccess) {
        navigate("/seriui/homepage");
      } else {
        // alert("Login Failed");
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Please Check Again!",
        });
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }

    // if (
    //   (input === "ro" && pass === "*India*12") ||
    //   (input === "seo" && pass === "*India*12") ||
    //   (input === "admin" && pass === "*India*12")
    // ) {
    //   localStorage.setItem("role", input);
    //   localStorage.setItem("sidemenu", "my-dashboard");
    //   navigate("/seriui/stake-holder-registration");
    // } else if (input === "ads" && pass === "*India*12") {
    //   localStorage.setItem("role", input);
    //   localStorage.setItem("sidemenu", "my-dashboard");
    //   navigate("/seriui/my-dashboard");
    // } else if (input === "crm") {
    //   localStorage.setItem("role", input);
    //   navigate("/seriui/home");
    // } else if (input === "account") {
    //   localStorage.setItem("role", input);
    //   navigate("/seriui/home");
    // } else if (input === "customer") {
    //   navigate("/seriui/add-request");
    // } else if (input === "technician") {
    //   navigate("/seriui/technician-dashboard");
    // } else if (!pass) {
    //   alert("Please enter your Password");
    // } else {
    //   alert("Invalid username and Password");
    // }
  };

  const [timer, setTimer] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const handleResendOTP = () => {
    setTimer(60);
    startTimer();
    resendOTP();
  };

  const resendOTP = () => {
    axios
      .post(
        baseURL + `userMaster/generate-otp-by-user-name-and-password`,
        data,
        {
          headers: _header,
        }
      )
      .then((response) => {
      
        const temp = response.data.content;
        // console.log(response);
        if (!temp.error) {
          setToggle(true);
          startTimer();
          if (temp.phoneNumber) {
            // const visibleNumber = temp.phoneNumber.slice(0, 6);
            const star = "*".repeat(6);
            const maskedNumber = star + temp.phoneNumber.slice(6);
            setMobileNumber(maskedNumber);
          }
        } else {
          // alert("Username is invalid");
          // setToggle(false);
          Swal.fire({
            icon: "error",
            title: "Invalid Username",
            text: "Please enter a valid username",
          });
        }
      })
      .catch((err) => {
      
        // saveError();
      });
  };

  const generateOTP = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      
      try {
      
        const isLoginSuccess = await login(data.username, data.password);
        setToggle(true);
        startTimer();
        // Store the token in local storage or a secure storage mechanism
        if (isLoginSuccess) {
        } else {
          setToggle(false);
          Swal.fire({
            icon: "error",
            title: "Invalid Username or Password",
            text: "Please enter a valid Username and Password",
          });

        }
      } catch (error) {
        console.error("Login failed:", error.message);
      }
      setValidated(true);
    }
  };

  const verifyotp = async (e) => {
    navigate("/seriui/homepage");
  };

  const loginCall = async (e) => {};

  const postData = async (e) => {
    try {
      // debugger
      const isLoginSuccess = await login(data.username, data.password);
      // const isLoginSuccess = await login(data.username, data.password);
      // Store the token in local storage or a secure storage mechanism
      if (!isLoginSuccess) {
        navigate("/seriui/homepage");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Login failed!!!",
          // text: "You clicked the button!",
        });
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }

    //   axios
    //     .post(baseURL + `userMaster/generate-otp-by-user-name`, data, {
    //       headers: _header,
    //     })
    //     .then((response) => {
    //       const temp = response.data.content;
    //       // console.log(response);
    //       if (!temp.error) {
    //         setToggle(true);
    //         startTimer();
    //       }
    //     })
    //     .catch((err) => {
    //       // saveError();
    //     });
    // };

    // const back = () => {
    //   setToggle(false);
    //   setOtp("");
  };

  // console.log(otp);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            setIsTimerRunning(false);
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/roles-list"));
  };

  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  return (
    <>
      <Layout title="Login" centered>
        <div className="container p-2 p-sm-4">
          <Card className="overflow-hidden card-gutter-lg rounded-4 card-auth card-auth-mh">
            <Row className="g-0 flex-lg-row-reverse">
              {!toggle ? (
                <Col lg="5">
                  <Card.Body className="h-100 d-flex flex-column justify-content-center">
                    <div className="nk-block-head text-center">
                      <div className="nk-block-head-content">
                        <h3 className="nk-block-title mb-1">Login</h3>
                        <p className="small">Please sign-in to your account.</p>
                      </div>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={generateOTP}
                    >
                      <Row className="gy-3">
                        <Col className="col-12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="email">User Name</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="email"
                                name="username"
                                value={data.username}
                                onChange={handleInputs}
                                placeholder="Enter username"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Username is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col className="col-12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                name="password"
                                value={data.password}
                                onChange={handleInputs}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Password is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col className="col-12">
                          <div className="d-flex flex-wrap justify-content-between">
                            {/* <Form.Check
                                className="form-check-sm"
                                type="checkbox"
                                id="rememberMe"
                                label="Remember Me"
                              /> */}
                            {/* <Form.Check
                              type="checkbox"
                              className="form-check-sm"
                              id="defaultAddress"
                              label="Remember Me"
                              checked={checked}
                              onChange={handleCheckBox}
                              Optional: disable the checkbox in view mode
                              defaultChecked
                            />
                            <Link
                              to="/seriui/auths/auth-reset"
                              className="small"
                            >
                              Forgot Password?
                            </Link> */}
                          </div>
                        </Col>
                        <Col className="col-12">
                          <div className="d-grid">
                            <Button type="submit" variant="primary">
                              Login to account
                            </Button>
                          </div>
                        </Col>
                        {/* <Col className="col-12">
                              <div className="d-grid">
                                <Button type="button" onClick={generateOTP}>
                                  GENERATE OTP
                                </Button>
                              </div>
                            </Col> */}
                        {/* {toggle ? (
                          <Col className="col-12">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="otp">OTP</Form.Label>
                              <div className="form-control-wrap">
                                <OtpInput
                                  value={otp}
                                  onChange={setOtp}
                                  numInputs={6}
                                  renderSeparator={<span> </span>}
                                  renderInput={(props) => <input {...props} />}
                                  inputType="password"
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
                            </Form.Group>
                          </Col>
                        ) : (
                          ""
                        )} */}
                      </Row>
                    </Form>
                  </Card.Body>
                </Col>
              ) : (
                <Col lg="5">
                  <Card.Body className="h-100 d-flex flex-column justify-content-center">
                    <div className="nk-block-head text-center">
                      <div className="nk-block-head-content">
                        <h3 className="nk-block-title mb-1">Verification</h3>
                        <p className="small">
                          Enter the one time password received to:{" "}
                          {`+91 ${mobileNumber}`}
                        </p>
                      </div>
                    </div>
                    <Form action="#">
                      <Row className="gy-3">
                        <Col className="col-12">
                          <Form.Group className="form-group">
                            <div className="d-flex justify-content-center">
                              {/* <Form.Label htmlFor="otp">OTP</Form.Label> */}
                              <div className="form-control-wrap">
                                <OtpInput
                                  value={otp}
                                  onChange={setOtp}
                                  numInputs={6}
                                  renderSeparator={<span> </span>}
                                  autoFocus
                                  renderInput={(props, i) => (
                                    <input {...props} autoFocus={i === 0} />
                                  )}
                                  inputType="password"
                                  // isInputNum={true}
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
                            </div>
                          </Form.Group>
                        </Col>
                        <Col className="col-12">
                          <p
                            className={`small d-flex justify-content-center ${
                              display ? "" : "d-none"
                            }`}
                            style={{ color: "red", fontWeight: "bold" }}
                          >
                            Either OTP is not Valid or has Expired
                          </p>
                          <div className="d-flex flex-wrap justify-content-between">
                            {/* <Form.Check
                              className="form-check-sm"
                              type="checkbox"
                              id="rememberMe"
                              label="Remember Me"
                            /> */}
                            <p className="small">
                              Wait for {formattedTime} mins
                            </p>
                            <Link
                              onClick={handleResendOTP}
                              className={`small ${
                                isTimerRunning ? "disabled-link" : ""
                              }`}
                              disabled={isTimerRunning}
                              style={{
                                pointerEvents: isTimerRunning ? "none" : "auto",
                                color: isTimerRunning ? "gray" : "blue",
                              }}
                            >
                              Resend OTP
                            </Link>
                          </div>
                        </Col>
                        <Col className="col-12">
                          <div className="d-grid">
                            <Button type="button" onClick={verifyotp}>
                              Verify OTP
                            </Button>
                          </div>
                        </Col>
                        <Col className="col-12">
                          <div className="d-grid">
                            {/* <Link onClick={back} className="small">
                                  Back
                                </Link> */}
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Col>
              )}

              <Col lg="7">
                <Card.Body className="bg-primary bg-darker1 is-theme has-mask has-mask-1 h-100 d-flex align-items-start justify-content-center">
                  <div className="mask mask-1"></div>
                  <div className="d-flex flex-column justify-content-center align-items-center mt-n5">
                    <div className="brand-logo">
                      <LoginLogo />
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="mt-2 ms-3 d-flex flex-column align-items-center justify-content-center">
                          <h2>Department of Sericulture</h2>
                          <h2>Government of Karnataka</h2>
                          {/* <div className="h1 title mb-3">
                             Department of Sericulture
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    {/* <MediaGroup className="media-group-overlap">
                                        <Media size="sm" shape="circle" border className="border-white">
                                            <Image src="/images/avatar/a.jpg" alt="" />
                                        </Media>
                                        <Media size="sm" shape="circle" border className="border-white">
                                            <Image src="/images/avatar/b.jpg" alt="" />
                                        </Media>
                                        <Media size="sm" shape="circle" border className="border-white">
                                            <Image src="/images/avatar/c.jpg" alt="" />
                                        </Media>
                                        <Media size="sm" shape="circle" border className="border-white">
                                            <Image src="/images/avatar/d.jpg" alt="" />
                                        </Media>
                                    </MediaGroup> */}
                    {/* <p className="small mt-2">More than 2k people joined us, it's your turn</p> */}
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default AuthLoginPage;
