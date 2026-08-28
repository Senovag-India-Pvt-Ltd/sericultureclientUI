// import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Link } from "react-router-dom";
// import { ChartDoughnut } from "../../../components/Chart/Charts";
// import { ChartLegend } from "../../../components";
import Block from "../../../components/Block/Block";
import DataTable from "../../../components/AppDataTable";
import { Colors } from "../../../utilities/index";
import { useState, useEffect } from "react";

import Layout from "../../../layout/default";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

// const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

// import {
//     Image,
//   } from '../../../components';

function ApplicationDashboard() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const styles = {
    // backgroundColor: "#cdefff",
    borderRadius: "3%",
    cursor: "pointer",
  };
// Translation
const { t } = useTranslation();
  const cardGradients = [
    { bg: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", shadow: "0 8px 24px rgba(30,60,114,0.35)" },
    { bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", shadow: "0 8px 24px rgba(17,153,142,0.35)" },
    { bg: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)", shadow: "0 8px 24px rgba(192,57,43,0.35)" },
    { bg: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)", shadow: "0 8px 24px rgba(247,151,30,0.35)" },
    { bg: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)", shadow: "0 8px 24px rgba(142,45,226,0.35)" },
    { bg: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)", shadow: "0 8px 24px rgba(238,9,121,0.35)" },
    { bg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)", shadow: "0 8px 24px rgba(19,78,94,0.35)" },
  ];

  const [data, setData] = useState({
    text: "",
    searchBy: "ticketArn",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };


  const handleSearchInputs = (e) => {
    const { value } = e.target; // Destructure the selected value
    setSchemeId(value); // Update schemeId with the selected value
  };

  // to get sc-scheme-details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const getList = () => {
    api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((response) => {
        setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setScSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const [hdUserData, setHdUserData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
  });

  
  // Get Dashboards
  const [dashboardList, setDashboardList] = useState([]);
  const getDashboard = (e) => {
    // setLoading(true);
    api
      .post(
        baseURLDBT + `service/getUserDashboardCount`,
        {},
        { params: { id: localStorage.getItem("userMasterId") } }
        // { params: { id: 30 } }
      )
      .then((response) => {
        setDashboardList(response.data.content);
        // setListData(response.data.content.hdTicket);
        // setTotalRows(response.data.content.totalItems);
        // setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        // setLoading(false);
      });
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const [schemeId, setSchemeId] = useState("");

  const getUserDashboardCountBySchemeId = () => {
    api
      .post(
        `${baseURLDBT}service/getUserDashboardCountBySchemeId`,
        {},
        { params: { schemeId } } // Pass schemeId as a query parameter
      )
      .then((response) => {
        setDashboardList(response.data.content);
      })
      .catch((err) => {
        console.error("Error fetching dashboard by schemeId", err);
      });
  };

  // useEffect(() => {
  //   getDashboard();
  // }, []);


  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/user-ticket-view/${_id}`);
  };

 

  const goto = (id) => {
  
    navigate(`/seriui/dashboard-report-list/${id}`)
  };

  return (
    <Layout title={t("User Dashboard")}>
      <style>{`
        .sh-page-header {
          padding: 20px 24px;
          background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
          border-radius: 12px;
          border: none;
          box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
          margin-bottom: 22px;
        }
        .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
      `}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("User Dashboard")}</Block.Title>
          </Block.HeadContent>

        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4">
      
  <Card style={{ maxWidth: "1800px", margin: "auto", border: "none", borderRadius: "14px", boxShadow: "0 4px 20px rgba(30,103,168,0.13)", overflow: "hidden" }}>
    <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", border: "none", padding: "14px 22px" }}>
      <h6 style={{ color: "white", margin: 0, fontWeight: 700, letterSpacing: "0.4px" }}>&#128269; {t("Filter Applications by Scheme")}</h6>
    </Card.Header>
    <Card.Body className="p-4" style={{ background: "linear-gradient(135deg, #f8f9ff 0%, #eef3fc 100%)" }}>
      <div className="mx-auto" style={{ maxWidth: "1500px" }}>
        <Row className="g-3 align-items-end">
          <Col lg="8" md="7" sm="12">
            <Form.Group className="form-group">
              <Form.Label htmlFor="scheme" style={{ fontWeight: 600, color: "#2c3e50", marginBottom: "6px", fontSize: "0.9rem" }}>
                {t("Scheme")}
              </Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="schemeId"
                  value={schemeId}
                  onChange={(e) => setSchemeId(e.target.value)}
                  style={{ borderRadius: "8px", border: "1.5px solid #b0c4de", padding: "9px 14px", fontSize: "14px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", backgroundColor: "white" }}
                >
                  <option value="">{t("Select Scheme Names")}</option>
                  {scSchemeDetailsListData &&
                    scSchemeDetailsListData.map((list) => (
                      <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                        {list.schemeName}
                      </option>
                    ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>
          <Col lg="4" md="5" sm="12">
            <Button
              type="button"
              onClick={getUserDashboardCountBySchemeId}
              style={{ width: "100%", borderRadius: "8px", padding: "10px 20px", fontWeight: 700, background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", border: "none", boxShadow: "0 4px 14px rgba(30,103,168,0.35)", color: "white", fontSize: "0.95rem" }}
            >
              &#128269; {t("Search")}
            </Button>
          </Col>
        </Row>
      </div>
    </Card.Body>
  </Card>



      <style>{`
        .dash-card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .dash-card-hover:hover {
          transform: translateY(-7px) scale(1.03);
        }
        .count-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          font-size: 1.9rem;
          font-weight: 700;
          color: white;
          margin: 8px auto 12px;
          border: 2.5px solid rgba(255,255,255,0.4);
          backdrop-filter: blur(4px);
        }
      `}</style>
      <Row className="g-4 mt-2 d-flex justify-content-center">
        {dashboardList.map((dashboard, i) => {
          const grad = cardGradients[i % cardGradients.length];
          return (
            <Col xxl="3" lg="4" md="6" key={i}>
              <Card
                className="h-100 dash-card-hover"
                style={{
                  borderRadius: "18px",
                  cursor: "pointer",
                  background: grad.bg,
                  boxShadow: grad.shadow,
                  border: "none",
                  overflow: "hidden",
                }}
                onClick={() => goto(dashboard.approvalStageId)}
              >
                <Card.Body className="p-4">
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="count-circle">{dashboard.count}</div>
                    <h5 className="mb-1 fw-bold" style={{ color: "white", fontSize: "1rem", lineHeight: 1.4 }}>
                      {dashboard.stepName}
                    </h5>
                    <small style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.76rem", marginTop: "4px" }}>
                      {t("Tap to view list →")}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      </Block>
    </Layout>
  );
}

export default ApplicationDashboard;
