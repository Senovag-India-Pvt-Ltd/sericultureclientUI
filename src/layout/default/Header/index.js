import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { Dropdown, Offcanvas } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import api from "../../../services/auth/api";
import { Card, Form, Row, Col, Button } from "react-bootstrap";

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

function QuickNav({ className, ...props }) {
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
    if (name === "godownId") {
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
        <div style={{ padding: "14px 10px 14px 20px" }}>
          <div className="d-flex align-items-center">
            <img
              // src="../images/logo/KG.png"
              src={process.env.PUBLIC_URL + "/images/logo/KG.png"}
              alt="Government of Karnataka"
              style={{ height: 35, width: 35 }}
            />
            <div
              className="ms-3"
              style={{
                paddingLeft: "10px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              <div>{t("logoTitle1")}</div>

              {/* <div>Department of Sericulture</div> */}

              <div style={{ marginTop: "-7px" }}>{t("logoTitle2")}</div>
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
                          Market Name:{" "}
                        </span>
                        <span style={{ fontWeight: "bold", color: "green" }}>
                          {marketName}
                        </span>
                      </span>
                      <div className="me-5 d-flex justify-content-between align-items-center">
                        <Form.Label column sm={2}>
                          Godown:
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
                  <QuickNavItem>
                    <span className="me-5 d-flex align-items-center">
                      <a
                        href="#"
                        onClick={() => i18n.changeLanguage("kn")}
                        style={
                          i18n.resolvedLanguage === "kn"
                            ? { fontWeight: "bold" }
                            : {}
                        }
                        className="me-1"
                      >
                        ಕನ್ನಡ
                      </a>{" "}
                      |{" "}
                      <a
                        href="#"
                        onClick={() => i18n.changeLanguage("en")}
                        style={
                          i18n.resolvedLanguage === "en"
                            ? { fontWeight: "bold" }
                            : {}
                        }
                        className="ms-1"
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
                      <div className="d-inline-flex d-sm-none">
                        <Media shape="circle" size="md">
                          <Image
                            src="/images/avatar/profile-img.png"
                            staticImage
                            thumbnail
                          />
                        </Media>
                      </div>
                      <div className="d-none d-sm-flex">
                        <Media shape="circle">
                          <Image
                            src="/images/avatar/profile-img.png"
                            staticImage
                            thumbnail
                          />
                        </Media>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu-md"
                      as={CustomDropdownMenu}
                    >
                      <div className="dropdown-content dropdown-content-x-lg py-3 border-bottom border-light">
                        <MediaGroup>
                          <Media size="xl" shape="circle">
                            <Image
                              src="/images/avatar/profile-img.png"
                              staticImage
                              thumbnail
                            />
                          </Media>
                          <MediaText>
                            <div className="lead-text">
                              {localStorage.getItem("username")}
                            </div>
                            <span className="sub-text">Admin</span>
                          </MediaText>
                        </MediaGroup>
                      </div>
                      <div className="dropdown-content dropdown-content-x-lg py-3 border-bottom border-light">
                        <LinkList>
                          <LinkListItem to="/seriui/admin/profile">
                            <Icon name="user"></Icon>
                            <span>My Profile</span>
                          </LinkListItem>
                          {/* <LinkListItem to="/seriui/admin/profile"><Icon name="contact"></Icon><span>My Contacts</span></LinkListItem> */}
                          {/* <LinkListItem to="/seriui/admin/profile-settings">
                            <Icon name="setting-alt"></Icon>
                            <span>Account Settings</span>
                          </LinkListItem> */}
                          <LinkListItem to="/seriui/change-password">
                            <Icon name="lock-alt"></Icon>
                            <span>Change Password</span>
                          </LinkListItem>
                          <LinkListItem to="/seriui/help-desk">
                            <Icon name="question-alt"></Icon>
                            <span>Raise a ticket</span>
                          </LinkListItem>
                        </LinkList>
                      </div>
                      <div className="dropdown-content dropdown-content-x-lg py-3">
                        <Button variant="link" onClick={handleLogout}>
                          <Icon name="signout"></Icon>
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
          className="d-flex"
          style={{
            backgroundColor: "#0f6cbe",
            color: "#fff",
            fontSize: "14px",
            padding: "3px 10px 4px 20px",
          }}
        >
          {/* <div style={{ paddingLeft: "10px" }}>
            Saturday, September 23, 2023 12:02:33 PM GMT+05:30 33
          </div> */}

          <div>
            {/* <p className="clock">{date.toLocaleTimeString()}</p> */}
            {/* <p className="clock">{date.getDate()}, {date.toLocaleTimeString([],{weekday:'long',month:'long'})}</p> */}
            {/* <p className="clock">{date.getDate()} {date.toLocaleTimeString([],{weekday:'long',month:'long'})} {date.getFullYear()}</p> */}
            {/* <p className="clock"> {date.toUTCString()}</p> */}
            {/* <p className="clock"> {date.toString()}</p> */}
            {/* <p className="clock">
              {" "}
              {date.toLocaleDateString([], { weekday: "long" })},{" "}
              {date.toLocaleDateString([], { month: "long" })} {date.getDate()},{" "}
              {date.getFullYear()} {date.toLocaleTimeString()}
            </p> */}
            <TimeTicker />
            {/* <p className="clock">{date.getDate()}</p> */}
          </div>

          <div style={{ marginLeft: auto }}>
            Helpdesk<em className="icon ni ni-caret-right-fill"></em>{" "}
            <em className="icon ni ni-call"></em>{" "}
            <span className="me-1">+91-8022253856</span>{" "}
            <em className="icon ni ni-mail"></em> support@senovag.com
          </div>
        </div>

        <div
          className="container-fluid"
          // style={{
          //   // display: "flex",
          //   // overflowX: "auto",
          //   // overflowY: "hidden",
          //   // msOverflowStyle: "none",
          //   // scrollbarWidth: "none",
          // }}
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

            <nav className={navClass} style={{ padding: "15px 0px 15px 0px" }}>
              {/* {console.log("test")} */}
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
    </>
  );
}

export default Header;
