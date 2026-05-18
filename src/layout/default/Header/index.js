import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { Dropdown, Offcanvas } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import api from "../../../services/auth/api";


import { Card, Form, Row, Col, Button,Modal,Accordion,Table} from "react-bootstrap";

import {
  Logo,
  Image,
  Icon,
  MediaGroup,
  MediaText,
  Media,
  LinkList,
  LinkListItem,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../../components";

import Menu from "./Menu";

import ToggleSidebar from "../Toggle/Sidebar";
import ToggleNavbar from "../Toggle/Navbar";
import TimeTicker from "../../../components/Utils/TimeTicker";

import { useLayout, useLayoutUpdate } from "./../LayoutProvider";
import { auto } from "@popperjs/core";
import { useTranslation } from "react-i18next";

import { logout } from "../../../services/authService";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function QuickNav({ className, ...props }) {
  const { t } = useTranslation();
  const compClass = classNames({
    "nk-quick-nav": true,
    [className]: className,
  });
  return <ul className={compClass}>{props.children}</ul>;
}

function QuickNavItem({ className, ...props }) {
  const compClass = classNames({
    "d-inline-flex": true,
    [className]: className,
  });
  return <li className={compClass}>{props.children}</li>;
}

function Header({ show, ...props }) {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showMark, setShowMark] = useState("");
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId")
      ? localStorage.getItem("godownId")
      : "",
  });
  // console.log("show", typeof show);

  useEffect(() => {
    if (show) {
      setShowMark(show === "true");
      console.log("hello",show === "true");
    } else {
      setShowMark(false);
    }
  }, [show]);

  function handleLogout() {
    localStorage.clear();
    navigate("/seriui/");
  }

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (name === "godownId" && value) {
      // localStorage.setItem("godownId", value);
      api
        .post(baseURL + `userPreference/edit`, {
          userMasterId: localStorage.getItem("userMasterId"),
          godownId: value,
        })
        .then((res) => {
          const isTrue = res.data.content.error;
          if (!isTrue) {
            localStorage.setItem("godownId", value);
          }
        });
    }
  };

  // to get Market
  const [marketName, setMarketName] = useState("");

  const getMarketList = () => {
    const response = api
      .get(baseURL + `marketMaster/get/${data.marketId}`)
      .then((response) => {
        setMarketName(response.data.content.marketMasterName);
      })
      .catch((err) => {
        //  setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);

  // to get Godown
  const [godownListData, setGodownListData] = useState([]);
  const getGodownList = (_id) => {
    api
      .get(baseURL + `godown/get-by-market-master-id/${_id}`)
      .then((response) => {
        setGodownListData(response.data.content.godown);
        // setTotalRows(response.data.content.totalItems);
        if (response.data.content.error) {
          setGodownListData([]);
        }
      })
      .catch((err) => {
        setGodownListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.marketId) {
      getGodownList(data.marketId);
    }
  }, [data.marketId]);

  const [showModal, setShowModal] = useState(false);
  const [pendingReelers, setPendingReelers] = useState([]);
  const [reelerLots, setReelerLots] = useState([]);

  // Fetch Pending License Details
  const fetchPendingReelers = async () => {
    try {
      const res = await api.post(
        `${baseURLFarmer}reeler/getPendingLicenseDetailsOfReeler`,
        {},
        { params: {} }
      );
      setPendingReelers(res.data.content || []);
    } catch (err) {
      setPendingReelers([]);
    }
  };

  // Fetch Reeling Lot Number Details
  const fetchReelerLots = async () => {
    try {
      const res = await api.post(
        `${baseURLMarket}lotGroupage/getReelingLotNumberDetails`,
        {},
        { params: {} }
      );
      setReelerLots(res.data.content || []);
    } catch (err) {
      setReelerLots([]);
    }
  };

  const handleBellClick = () => {
    fetchPendingReelers();
    fetchReelerLots();
    setShowModal(true);
  };

 const accordionHeaderStyles = {
  base: {
    background: "linear-gradient(90deg, #0f4a85, #0f3060)", // gradient blue
    color: "white", // text color
    fontWeight: "bold",
    fontSize: "20px",
    borderRadius: "8px",
    padding: "8px 16px",
    marginBottom: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
  },
  hover: {
    background: "linear-gradient(90deg, #0f3060, #0f4a85)",
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  icon: {
    filter: "invert(1)", // for accordion-button::after
  },
};


  //  console.log("market name",marketName);

  const layout = useLayout();
  const layoutUpdate = useLayoutUpdate();

  const compClass = classNames({
    "nk-header nk-header-fixed": true,
    [`is-${layout.headerVariant}`]: layout.headerVariant,
  });

  const navClass = classNames({
    "nk-header-menu nk-navbar": true,
    "navbar-active": layout.headerActive,
    // eslint-disable-next-line
    "navbar-mobile":
      layout.headerTransition ||
      layout.breaks[layout.headerCollapse] > window.innerWidth,
  });

  // offcanvas
  const handleOffcanvasClose = () => setShowOffcanvas(false);
  const handleOffcanvasShow = () => setShowOffcanvas(true);

  // Date and Time

  // const [date, setDate] = useState(new Date());
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setDate(new Date());
  //     // console.log(date.toLocaleTimeString());
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const { t, i18n } = useTranslation();

  return (
    <>
      <div className={compClass}>
        <div
          style={{
            padding: "16px 16px 16px 24px",
            background: "linear-gradient(135deg, #ffffff 0%, #f4f8fd 100%)",
            borderBottom: "1px solid #e3ecf7",
            boxShadow: "0 2px 8px rgba(15, 76, 138, 0.05)",
          }}
        >
          <div className="d-flex align-items-center">
            <div
              style={{
                background: "#ffffff",
                padding: "4px",
                borderRadius: "50%",
                boxShadow: "0 2px 6px rgba(15, 76, 138, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={process.env.PUBLIC_URL + "/images/logo/KG.png"}
                alt="Government of Karnataka"
                style={{ height: 38, width: 38 }}
              />
            </div>
            <div
              className="ms-3"
              style={{
                paddingLeft: "12px",
                fontWeight: 700,
                fontSize: "18px",
                color: "#0f3060",
                lineHeight: "1.2",
                letterSpacing: "0.2px",
              }}
            >
              <div style={{ fontSize: "19px", color: "#0f3060" }}>{t("logoTitle1")}</div>
              <div
                style={{
                  marginTop: "2px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: "#5a7299",
                  letterSpacing: "0.3px",
                }}
              >
                {t("logoTitle2")}
              </div>
            </div>

            <div style={{ marginLeft: auto }}>
              <div className="nk-header-tools">
                <QuickNav>
                  {/* <Dropdown as={QuickNavItem}>
                                <Dropdown.Toggle variant="zoom" size="sm" bsPrefix className="btn-icon d-sm-none">
                                    <Icon name="search"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Toggle variant="zoom" size="md" bsPrefix className="btn-icon d-none d-sm-inline-flex">
                                    <Icon name="search"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-lg"> 
                                    <div className="dropdown-content dropdown-content-x-lg py-1">
                                        <div className="search-inline">
                                            <div className="form-control-wrap flex-grow-1">
                                                <input placeholder="Type Query" type="text" className="form-control-plaintext" />
                                            </div>
                                            <Icon name="search" size="sm"></Icon>
                                        </div>
                                    </div>
                                    <Dropdown.Divider className="m-0"></Dropdown.Divider>
                                    <div className="dropdown-content dropdown-content-x-lg py-3">
                                        <div className="dropdown-title pb-2">
                                            <h5 className="title">Recent searches</h5>
                                        </div>
                                        <ul className="dropdown-list gap gy-2">
                                            <li>
                                                <MediaGroup>
                                                    <Media size="md" shape="circle" variant="light"><Icon name="clock"></Icon></Media>
                                                    <MediaText>
                                                        <div className="lead-text">Styled Doughnut Chart</div>
                                                        <span className="sub-text">1 days ago</span>
                                                    </MediaText>
                                                    <MediaAction end>
                                                        <Button size="md" variant="zoom" className="btn-icon me-n1"><Icon name="trash"></Icon></Button>
                                                    </MediaAction>
                                                </MediaGroup>
                                            </li>
                                            <li>
                                                <MediaGroup>
                                                    <Media size="md" shape="circle" variant="light"><Icon name="clock"></Icon></Media>
                                                    <MediaText>
                                                        <div className="lead-text">Custom Select Input</div>
                                                        <span className="sub-text">07 Aug</span>
                                                    </MediaText>
                                                    <MediaAction end>
                                                        <Button size="md" variant="zoom" className="btn-icon me-n1"><Icon name="trash"></Icon></Button>
                                                    </MediaAction>
                                                </MediaGroup>
                                            </li>
                                            <li>
                                                <MediaGroup>
                                                    <Media size="md" shape="circle" variant="light">
                                                        <Image src='/images/avatar/a.jpg' staticImage/>
                                                    </Media>
                                                    <MediaText>
                                                        <div className="lead-text">Sharon Walker</div>
                                                        <span className="sub-text">Admin</span>
                                                    </MediaText>
                                                    <MediaAction end>
                                                        <Button size="md" variant="zoom" className="btn-icon me-n1"><Icon name="trash"></Icon></Button>
                                                    </MediaAction>
                                                </MediaGroup>
                                            </li>
                                        </ul>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown> */}
                  {showMark ? (
                    <>
                      <span className="me-5 d-flex align-items-center">
                        <span style={{ fontWeight: "bold" }}>
                          {t("Market Name")}:{" "}
                        </span>
                        <span style={{ fontWeight: "bold", color: "green" }}>
                          {marketName}
                        </span>
                      </span>
                      <div className="me-5 d-flex justify-content-between align-items-center">
                        <Form.Label column sm={2}>
                          {t("Godown")}:
                        </Form.Label>
                        <Col sm={8}>
                          <Form.Select
                            name="godownId"
                            value={data.godownId}
                            onChange={handleInputs}
                          >
                            <option value="">Select Godown</option>
                            {godownListData.map((list) => (
                              <option key={list.godownId} value={list.godownId}>
                                {list.godownName}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  {/* <QuickNavItem>
                  <div
                    className="d-flex align-items-center me-4"
                    style={{ cursor: "pointer" }}
                    onClick={() => alert("Show pending activities list here")}
                  >
                    <Icon name="bell-fill" style={{ color: "#ffcc00", fontSize: "25px" }}></Icon>
                    <span className="ms-2 fw-bold" style={{ color: "#333" }}>
                      Pending Activities
                    </span>
                  </div>
                </QuickNavItem> */}
                <QuickNavItem>
                    {(() => {
                      const pendingCount =
                        (pendingReelers?.length || 0) + (reelerLots?.length || 0);
                      const hasPending = pendingCount > 0;
                      return (
                        <div
                          className="d-flex align-items-center me-3"
                          style={{
                            cursor: "pointer",
                            background: hasPending
                              ? "linear-gradient(135deg, #fff4cc 0%, #ffe089 60%, #ffd166 100%)"
                              : "linear-gradient(135deg, #fffaf0 0%, #fff3d6 100%)",
                            border: "1px solid",
                            borderColor: hasPending ? "#f4b400" : "#ffe082",
                            borderRadius: "999px",
                            padding: "5px 16px 5px 5px",
                            boxShadow: hasPending
                              ? "0 4px 14px rgba(244, 180, 0, 0.32), inset 0 1px 0 rgba(255,255,255,0.55)"
                              : "0 2px 8px rgba(255, 193, 7, 0.18), inset 0 1px 0 rgba(255,255,255,0.55)",
                            transition: "transform 0.18s ease, box-shadow 0.18s ease",
                            position: "relative",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                            e.currentTarget.style.boxShadow = hasPending
                              ? "0 8px 20px rgba(244, 180, 0, 0.42), inset 0 1px 0 rgba(255,255,255,0.65)"
                              : "0 6px 16px rgba(255, 193, 7, 0.28), inset 0 1px 0 rgba(255,255,255,0.65)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow = hasPending
                              ? "0 4px 14px rgba(244, 180, 0, 0.32), inset 0 1px 0 rgba(255,255,255,0.55)"
                              : "0 2px 8px rgba(255, 193, 7, 0.18), inset 0 1px 0 rgba(255,255,255,0.55)";
                          }}
                          onClick={handleBellClick}
                        >
                          <span
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #ffffff 0%, #fff4cc 100%)",
                              boxShadow:
                                "0 2px 6px rgba(184, 122, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "10px",
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <Icon
                              name="bell-fill"
                              className={`bi bi-bell-fill ${
                                hasPending ? "bell-alert" : ""
                              }`}
                              style={{
                                color: "#d18a00",
                                fontSize: "16px",
                                transformOrigin: "top center",
                              }}
                            ></Icon>
                            {hasPending && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: "-4px",
                                  right: "-4px",
                                  minWidth: "18px",
                                  height: "18px",
                                  padding: "0 5px",
                                  borderRadius: "999px",
                                  background:
                                    "linear-gradient(135deg, #ff5252 0%, #c62828 100%)",
                                  color: "#ffffff",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "2px solid #ffffff",
                                  boxShadow: "0 2px 4px rgba(198, 40, 40, 0.35)",
                                  lineHeight: 1,
                                }}
                              >
                                {pendingCount > 99 ? "99+" : pendingCount}
                              </span>
                            )}
                          </span>
                          <span
                            style={{
                              color: "#7a4f00",
                              fontSize: "13.5px",
                              fontWeight: 700,
                              letterSpacing: "0.3px",
                              textShadow: "0 1px 0 rgba(255,255,255,0.35)",
                            }}
                          >
                            Pending Activities
                          </span>
                        </div>
                      );
                    })()}
                  </QuickNavItem>


                  <QuickNavItem>
                    <span
                      className="me-4 d-flex align-items-center"
                      style={{
                        background: "#f0f5fb",
                        border: "1px solid #dce8f5",
                        borderRadius: "999px",
                        padding: "4px",
                        gap: "2px",
                      }}
                    >
                      <a
                        href="#"
                        onClick={() => i18n.changeLanguage("kn")}
                        style={{
                          textDecoration: "none",
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: "13.5px",
                          fontWeight: i18n.resolvedLanguage === "kn" ? 700 : 500,
                          background:
                            i18n.resolvedLanguage === "kn"
                              ? "linear-gradient(135deg, #1e67a8 0%, #0f4a85 100%)"
                              : "transparent",
                          color: i18n.resolvedLanguage === "kn" ? "#ffffff" : "#1a3c6e",
                          boxShadow:
                            i18n.resolvedLanguage === "kn"
                              ? "0 2px 6px rgba(15, 76, 138, 0.25)"
                              : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        ಕನ್ನಡ
                      </a>
                      <a
                        href="#"
                        onClick={() => i18n.changeLanguage("en")}
                        style={{
                          textDecoration: "none",
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: "13.5px",
                          fontWeight: i18n.resolvedLanguage === "en" ? 700 : 500,
                          background:
                            i18n.resolvedLanguage === "en"
                              ? "linear-gradient(135deg, #1e67a8 0%, #0f4a85 100%)"
                              : "transparent",
                          color: i18n.resolvedLanguage === "en" ? "#ffffff" : "#1a3c6e",
                          boxShadow:
                            i18n.resolvedLanguage === "en"
                              ? "0 2px 6px rgba(15, 76, 138, 0.25)"
                              : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        English
                      </a>
                    </span>
                    {/* <button
                      className="btn-icon btn btn-zoom btn-sm d-sm-none"
                      onClick={handleOffcanvasShow}
                    >
                      <Icon name="bell"></Icon>
                    </button>
                    <button
                      className="btn-icon btn btn-zoom btn-md d-none d-sm-inline-flex"
                      onClick={handleOffcanvasShow}
                    >
                      <Icon name="bell"></Icon>
                    </button> */}
                  </QuickNavItem>
                  <Dropdown as={QuickNavItem}>
                    <Dropdown.Toggle bsPrefix as={CustomDropdownToggle}>
                      {(() => {
                        const username = localStorage.getItem("username") || "U";
                        const initials = username
                          .split(/[\s_-]+/)
                          .filter(Boolean)
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();
                        return (
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                              color: "#ffffff",
                              fontWeight: 700,
                              fontSize: "15px",
                              letterSpacing: "0.5px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow:
                                "0 2px 8px rgba(15, 76, 138, 0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
                              border: "2px solid #ffffff",
                              cursor: "pointer",
                              transition: "transform 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            {initials}
                          </div>
                        );
                      })()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu-md"
                      as={CustomDropdownMenu}
                      style={{
                        borderRadius: "14px",
                        border: "1px solid #e3ecf7",
                        boxShadow: "0 10px 30px rgba(15, 76, 138, 0.18)",
                        overflow: "hidden",
                        padding: 0,
                      }}
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                          padding: "18px 18px 16px 18px",
                          color: "#ffffff",
                          position: "relative",
                        }}
                      >
                        <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                          {(() => {
                            const username = localStorage.getItem("username") || "U";
                            const initials = username
                              .split(/[\s_-]+/)
                              .filter(Boolean)
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase();
                            return (
                              <div
                                style={{
                                  width: "52px",
                                  height: "52px",
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #ffffff 0%, #e3ecf7 100%)",
                                  color: "#0f3060",
                                  fontWeight: 800,
                                  fontSize: "20px",
                                  letterSpacing: "0.5px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow:
                                    "0 4px 12px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.4)",
                                  border: "2px solid rgba(255,255,255,0.85)",
                                  flexShrink: 0,
                                }}
                              >
                                {initials}
                              </div>
                            );
                          })()}
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: 700,
                                letterSpacing: "0.3px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {localStorage.getItem("username")}
                            </div>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                marginTop: "4px",
                                padding: "2px 10px",
                                borderRadius: "999px",
                                background: "rgba(255,255,255,0.18)",
                                border: "1px solid rgba(255,255,255,0.25)",
                                color: "#ffffff",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                              }}
                            >
                              <Icon name="shield-star" style={{ fontSize: "12px" }}></Icon>
                              Admin
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: "10px 8px" }}>
                        <LinkListItem
                          to="/seriui/change-password"
                          className="d-flex align-items-center"
                          style={{
                            padding: "10px 12px",
                            borderRadius: "10px",
                            textDecoration: "none",
                            color: "#1a3c6e",
                            fontWeight: 500,
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f0f6ff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <span
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, #e8f1ff 0%, #d4e6ff 100%)",
                              color: "#1e67a8",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "12px",
                            }}
                          >
                            <Icon name="lock-alt" style={{ fontSize: "16px" }}></Icon>
                          </span>
                          <span>Change Password</span>
                        </LinkListItem>
                        <LinkListItem
                          to="/seriui/help-desk"
                          className="d-flex align-items-center"
                          style={{
                            padding: "10px 12px",
                            borderRadius: "10px",
                            textDecoration: "none",
                            color: "#1a3c6e",
                            fontWeight: 500,
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fff7eb";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <span
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, #fff3d6 0%, #ffe6a8 100%)",
                              color: "#b87a00",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "12px",
                            }}
                          >
                            <Icon name="question-alt" style={{ fontSize: "16px" }}></Icon>
                          </span>
                          <span>Raise a ticket</span>
                        </LinkListItem>
                      </div>

                      <div
                        style={{
                          padding: "10px 12px 14px 12px",
                          borderTop: "1px solid #eef3fa",
                          background: "#fafcff",
                        }}
                      >
                        <Button
                          onClick={handleLogout}
                          className="w-100 d-flex align-items-center justify-content-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                            border: "none",
                            color: "#ffffff",
                            fontWeight: 600,
                            padding: "9px 14px",
                            borderRadius: "10px",
                            gap: "8px",
                            boxShadow: "0 4px 10px rgba(239, 68, 68, 0.25)",
                            letterSpacing: "0.3px",
                          }}
                        >
                          <Icon name="signout" style={{ fontSize: "16px" }}></Icon>
                          <span>Log Out</span>
                        </Button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </QuickNav>
              </div>
            </div>
          </div>
        </div>
        <div
          className="d-flex justify-content-between align-items-center"
          style={{
            background: "linear-gradient(90deg, #0f4a85 0%, #1e67a8 50%, #0f4a85 100%)",
            color: "#fff",
            fontSize: "13.5px",
            padding: "6px 20px 6px 24px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 4px rgba(0,0,0,0.08)",
            letterSpacing: "0.2px",
          }}
        >
          <div className="d-flex align-items-center" style={{ gap: "8px" }}>
            <Icon
              name="clock"
              style={{ fontSize: "16px", opacity: 0.85 }}
            ></Icon>
            <TimeTicker />
          </div>
          <div
            className="d-flex align-items-center"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "999px",
              padding: "3px 14px",
              gap: "6px",
              backdropFilter: "blur(6px)",
            }}
          >
            <Icon name="user-circle" style={{ fontSize: "16px", opacity: 0.9 }}></Icon>
            <span style={{ fontWeight: 500 }}>Welcome</span>
            <span style={{ opacity: 0.6 }}>:</span>
            <span style={{ color: "#7ff0ff", fontWeight: 700, letterSpacing: "0.3px" }}>
              {localStorage.getItem("username")}
            </span>
          </div>
        </div>

        <div
          className="container-fluid"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f7faff 100%)",
            borderBottom: "1px solid #e3ecf7",
            boxShadow: "0 2px 6px rgba(15, 76, 138, 0.04)",
          }}
        >
          <div className="nk-header-wrap">
            <div className="nk-header-logo">
              <ToggleSidebar variant="zoom" icon="menu" />
              <ToggleNavbar className="me-2" />
              <Logo />
            </div>
            {layout.headerActive && (
              <div
                className="navbar-overlay"
                onClick={layoutUpdate.headerMobile}
              ></div>
            )}

            <nav className={navClass} style={{ padding: "12px 0px 12px 0px" }}>
              <Menu />
            </nav>
            {/* <div className="nk-header-tools">
                        <QuickNav>
                            <Dropdown as={QuickNavItem}>
                                <Dropdown.Toggle variant="zoom" size="sm" bsPrefix className="btn-icon d-sm-none">
                                    <Icon name="search"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Toggle variant="zoom" size="md" bsPrefix className="btn-icon d-none d-sm-inline-flex">
                                    <Icon name="search"></Icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-lg"> 
                                    <div className="dropdown-content dropdown-content-x-lg py-1">
                                        <div className="search-inline">
                                            <div className="form-control-wrap flex-grow-1">
                                                <input placeholder="Type Query" type="text" className="form-control-plaintext" />
                                            </div>
                                            <Icon name="search" size="sm"></Icon>
                                        </div>
                                    </div>
                                    <Dropdown.Divider className="m-0"></Dropdown.Divider>
                                    <div className="dropdown-content dropdown-content-x-lg py-3">
                                        <div className="dropdown-title pb-2">
                                            <h5 className="title">Recent searches</h5>
                                        </div>
                                        <ul className="dropdown-list gap gy-2">
                                            <li>
                                                <MediaGroup>
                                                    <Media size="md" shape="circle" variant="light"><Icon name="clock"></Icon></Media>
                                                    <MediaText>
                                                        <div className="lead-text">Styled Doughnut Chart</div>
                                                        <span className="sub-text">1 days ago</span>
                                                    </MediaText>
                                                    <MediaAction end>
                                                        <Button size="md" variant="zoom" className="btn-icon me-n1"><Icon name="trash"></Icon></Button>
                                                    </MediaAction>
                                                </MediaGroup>
                                            </li>
                                            <li>
                                                <MediaGroup>
                                                    <Media size="md" shape="circle" variant="light"><Icon name="clock"></Icon></Media>
                                                    <MediaText>
                                                        <div className="lead-text">Custom Select Input</div>
                                                        <span className="sub-text">07 Aug</span>
                                                    </MediaText>
                                                    <MediaAction end>
                                                        <Button size="md" variant="zoom" className="btn-icon me-n1"><Icon name="trash"></Icon></Button>
                                                    </MediaAction>
                                                </MediaGroup>
                                            </li>
                                            <li>
                                                <MediaGroup>
                                                    <Media size="md" shape="circle" variant="light">
                                                        <Image src='/images/avatar/a.jpg' staticImage/>
                                                    </Media>
                                                    <MediaText>
                                                        <div className="lead-text">Sharon Walker</div>
                                                        <span className="sub-text">Admin</span>
                                                    </MediaText>
                                                    <MediaAction end>
                                                        <Button size="md" variant="zoom" className="btn-icon me-n1"><Icon name="trash"></Icon></Button>
                                                    </MediaAction>
                                                </MediaGroup>
                                            </li>
                                        </ul>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                            <QuickNavItem>
                                <button className="btn-icon btn btn-zoom btn-sm d-sm-none" onClick={handleOffcanvasShow}>
                                    <Icon name="bell"></Icon>
                                </button>
                                <button className="btn-icon btn btn-zoom btn-md d-none d-sm-inline-flex" onClick={handleOffcanvasShow}>
                                    <Icon name="bell"></Icon>
                                </button>
                            </QuickNavItem>
                            <Dropdown as={QuickNavItem}>
                                <Dropdown.Toggle bsPrefix as={CustomDropdownToggle}>
                                    
                                    <div className="d-inline-flex d-sm-none">
                                        <Media shape="circle" size="md">
                                            <Image src='/images/avatar/profile-img.png' staticImage thumbnail/>
                                        </Media>
                                    </div>
                                    <div className="d-none d-sm-flex">
                                        <Media shape="circle">
                                            <Image src='/images/avatar/profile-img.png' staticImage thumbnail/>
                                        </Media>
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-md" as={CustomDropdownMenu}> 
                                    <div className="dropdown-content dropdown-content-x-lg py-3 border-bottom border-light">
                                        <MediaGroup>
                                            <Media size="xl" shape="circle">
                                                <Image src='/images/avatar/profile-img.png' staticImage thumbnail/>
                                            </Media>
                                            <MediaText>
                                                <div className="lead-text">Prabhu Patil</div>
                                                <span className="sub-text">Admin</span>
                                            </MediaText>
                                        </MediaGroup>
                                    </div>
                                    <div className="dropdown-content dropdown-content-x-lg py-3 border-bottom border-light">
                                        <LinkList>
                                            <LinkListItem to="/seriui/admin/profile"><Icon name="user"></Icon><span>My Profile</span></LinkListItem>
                                            <LinkListItem to="/seriui/admin/profile"><Icon name="contact"></Icon><span>My Contacts</span></LinkListItem>
                                            <LinkListItem to="/seriui/admin/profile-settings"><Icon name="setting-alt"></Icon><span>Account Settings</span></LinkListItem>
                                        </LinkList>
                                    </div>
                                    <div className="dropdown-content dropdown-content-x-lg py-3">
                                        <LinkList>
                                            <LinkListItem to="/seriui/"><Icon name="signout"></Icon><span>Log Out</span></LinkListItem>
                                        </LinkList>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </QuickNav>
                    </div> */}
          </div>
        </div>
      </div>


      <Offcanvas
        className="offcanvas-size-lg"
        placement="end"
        show={showOffcanvas}
        onHide={handleOffcanvasClose}
      >
        <Offcanvas.Header closeButton className="border-bottom border-light">
          <Offcanvas.Title>Recent Notification</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SimpleBar>
            {/* <Schedule>
                        <Schedule.Item symbol="active">
                            <span className="smaller">2:12 PM</span>
                            <div className="h6">Added 3 New Images</div>
                            <ul className="d-flex flex-wrap gap g-2 pt-2">
                                <li>
                                    <Media size="xxl">
                                        <Image src="/images/product/a.jpg" alt="gallery" thumbnail />
                                    </Media>
                                </li>
                                <li>
                                    <Media size="xxl">
                                        <Image src="/images/product/b.jpg" alt="gallery" thumbnail />
                                    </Media>
                                </li>
                                <li>
                                    <Media size="xxl">
                                        <Image src="/images/product/c.jpg" alt="gallery" thumbnail />
                                    </Media>
                                </li>
                            </ul>
                        </Schedule.Item>
                        <Schedule.Item symbol="active">
                            <span className="smaller">4:23 PM</span>
                            <div className="h6">Invitation for creative designs pattern</div>
                        </Schedule.Item>
                        <Schedule.Item symbol="active" contentClass="nk-schedule-content-no-border">
                            <span className="smaller">10:30 PM</span>
                            <div className="h6">Task report - uploaded weekly reports</div>
                            <div className="list-group-dotted mt-3">
                                <div className="list-group-wrap">
                                    <div className="p-3">
                                        <MediaGroup>
                                            <Media className="rounded-0">
                                                <Image src="/images/icon/file-type-pdf.svg" alt="icon" />
                                            </Media>
                                            <MediaText className="ms-1">
                                                <a href="#download" className="title">Modern Designs Pattern</a>
                                                <span className="text smaller">1.6.mb</span>
                                            </MediaText>
                                        </MediaGroup>
                                    </div>
                                    <div className="p-3">
                                        <MediaGroup>
                                            <Media className="rounded-0">
                                                <Image src="/images/icon/file-type-doc.svg" alt="icon" />
                                            </Media>
                                            <MediaText className="ms-1">
                                                <a href="#download" className="title">Cpanel Upload Guidelines</a>
                                                <span className="text smaller">18kb</span>
                                            </MediaText>
                                        </MediaGroup>
                                    </div>
                                    <div className="p-3">
                                        <MediaGroup>
                                            <Media className="rounded-0">
                                                <Image src="/images/icon/file-type-code.svg" alt="icon" />
                                            </Media>
                                            <MediaText className="ms-1">
                                                <a href="#download" className="title">Weekly Finance Reports</a>
                                                <span className="text smaller">10mb</span>
                                            </MediaText>
                                        </MediaGroup>
                                    </div>
                                </div>
                            </div>
                        </Schedule.Item>
                        <Schedule.Item symbol="active">
                            <span className="smaller">3:23 PM</span>
                            <div className="h6">Assigned you to new database design project</div>
                        </Schedule.Item>
                        <Schedule.Item symbol="active" contentClass="nk-schedule-content-no-border flex-grow-1">
                            <span className="smaller">5:05 PM</span>
                            <div className="h6">You have received a new order</div>
                            <Alert variant="info" className="mt-2">
                                <div className="d-flex">
                                    <Icon size="lg" name="file-code" className="opacity-75"></Icon>
                                    <div className="ms-2 d-flex flex-wrap flex-grow-1 justify-content-between">
                                        <div>
                                            <h6 className="alert-heading mb-0">Business Template - UI/UX design</h6>
                                            <span className="smaller">Shared information with your team to understand and contribute to your project.</span>
                                        </div>
                                        <div className="d-block mt-1">
                                            <Button size="md" variant="info">
                                                <Icon name="download"></Icon>
                                                <span>Download</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Alert>
                        </Schedule.Item>
                        <Schedule.Item symbol="active">
                            <span className="smaller">2:45 PM</span>
                            <div className="h6">Project status updated successfully</div>
                        </Schedule.Item>
                    </Schedule> */}
          </SimpleBar>
        </Offcanvas.Body>
      </Offcanvas>


     <Modal
  show={showModal}
  onHide={() => setShowModal(false)}
  size="xl"
  centered
  dialogClassName="custom-modal"
>
  <Modal.Header closeButton style={{ borderBottom: "2px solid #0f6cbe" }}>
    <Modal.Title style={{ fontWeight: "bold", color: "white", fontSize: "22px" }}>
      Pending Activities
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Accordion defaultActiveKey="0">
      {/* Pending Reeler Licenses */}
      <Accordion.Item eventKey="0">
        {/* <Accordion.Header>License Renewal Pending</Accordion.Header> */}
        <Accordion.Header
        style={accordionHeaderStyles.base}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, accordionHeaderStyles.hover)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, accordionHeaderStyles.base)}
      >
  License Renewal Pending
</Accordion.Header>
        <Accordion.Body>
          {pendingReelers.length === 0 ? (
            <p>No pending reeler licenses.</p>
          ) : (
            <Table striped hover responsive className="table-custom">
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Name</th>
                  <th>Fruits ID</th>
                  <th>License Number</th>
                  <th>Father Name</th>
                  <th>Reeler Number</th>
                  <th>Expiry Date</th>
                  <th>District</th>
                  <th>Taluk</th>
                </tr>
              </thead>
              <tbody>
                {pendingReelers.map((r) => (
                  <tr key={r.reelerId}>
                    <td>{r.serialNumber}</td>
                    <td>{r.firstName}</td>
                    <td>{r.fruitsId}</td>
                    <td>{r.reelerLicenseNumber}</td>
                    <td>{r.fatherName}</td>
                    <td>{r.reelerNumber}</td>
                    <td>{r.expiryDate}</td>
                    <td>{r.districtName}</td>
                    <td>{r.talukName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Accordion.Body>
      </Accordion.Item>

      {/* Reeling Lot Number Details */}
      <Accordion.Item eventKey="1">
        <Accordion.Header
        style={accordionHeaderStyles.base}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, accordionHeaderStyles.hover)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, accordionHeaderStyles.base)}
      >Reeling Lot Details</Accordion.Header>
        <Accordion.Body>
          {reelerLots.length === 0 ? (
            <p>No reeling lot details.</p>
          ) : (
            <Table striped hover responsive className="table-custom">
              <thead>
                <tr>
                <th>Sr. No</th>
                 <th>Lot Number</th>
                  <th>Buyer Name</th>
                  <th>Farmer Name</th>
                  <th>Farmer Fruits Id</th>
                  <th>Market</th>
                  <th>Lot Weight</th>
                  <th>Sold Amount</th>
                  <th>Invoice No</th>
                 
                </tr>
              </thead>
              <tbody>
                {reelerLots.map((lot,index) => (
                  <tr key={lot.lotGroupageId}>
                  <td>{index + 1}</td>
                    <td>{lot.lotParentLevel}</td>
                    <td>{lot.buyerName}</td>
                    <td>{lot.farmerFirstName}</td>
                    <td>{lot.farmerFruitsId}</td>
                    <td>{lot.marketName}</td>
                    <td>{lot.lotWeight}</td>
                    <td>{lot.soldAmount}</td>
                    <td>{lot.invoiceNumber}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
}

export default Header;
