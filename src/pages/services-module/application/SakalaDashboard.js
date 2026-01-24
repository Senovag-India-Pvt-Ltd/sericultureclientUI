// import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Link } from "react-router-dom";
// import { ChartDoughnut } from "../../../components/Chart/Charts";
// import { ChartLegend } from "../../../components";
import Block from "../../../components/Block/Block";
import DataTable from "react-data-table-component";
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

function SakalaDashboard() {
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
  const rainbowColors = [
    "#b82424",
    "#ca8b17",
    "#acac22",
    "#287728",
    "#575797",
    "#88699f",
    "#bf45bf",
  ];

  const schemeList = [
    { id: 1, name: "Chawki Subsidy Scheme" },
    { id: 2, name: "Bivoltine Cocoon Scheme" },
    { id: 3, name: "Sericulture Farmer Benefit" },
  ];

    const [showModal6, setShowModal6] = useState(false);
  
    const handleShowModal6 = () => setShowModal6(true);
    const handleCloseModal6 = () => setShowModal6(false);

  const dashboardData = [
  {
    id: 1,
    title: "Total Applications",
    count: 12450,
    color: "#0d6efd",
    icon: "file-text",
  },
  {
    id: 2,
    title: "DFLs Details Entry",
    count: 8450,
    color: "#198754",
    icon: "check-circle",
  },
  {
    id: 3,
    title: "TSC Verification",
    count: 2980,
    color: "#ffc107",
    icon: "clock",
  },
  {
    id: 4,
    title: "Crop Inspection",
    count: 720,
    color: "#dc3545",
    icon: "x-circle",
  },
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

  const [selectedDashboard, setSelectedDashboard] = useState("");
const [showTable, setShowTable] = useState(false);
const dashboardDetailsData = [
  {
    dashboard: "Pending Beyond Due Date",
    farmerName: "Ramesh Kumar",
    slaDays: 30,
    daysCompleted: 42,
    daysPending: 12,
    status: "SLA Breached",
  },
  {
    dashboard: "Disposed Within Prescribed Time",
    farmerName: "Suresh Naik",
    slaDays: 30,
    daysCompleted: 25,
    daysPending: 0,
    status: "Completed On Time",
  },
  {
    dashboard: "Disposed After Due Date",
    farmerName: "Mahesh Gowda",
    slaDays: 30,
    daysCompleted: 35,
    daysPending: 5,
    status: "Delayed",
  },
];


  return (
    <Layout title="Sakala Dashboard">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Sakala Dashboard")}</Block.Title>
          </Block.HeadContent>
          
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
      
  
      <Row className="g-4 mt-3">
            {dashboardData.map((item) => (
                <Col xxl="3" xl="3" lg="4" md="6" sm="12" key={item.id}>
                <Card
                    className="h-100 shadow-sm dashboard-card"
                    style={{
                    borderRadius: "14px",
                    cursor: "pointer",
                    borderLeft: `6px solid ${item.color}`,
                    }}
                    // onClick={() => goto(item.id)}
                    onClick={() => {
                        if (item.id === 1) {
                            handleShowModal6();   // ✅ Open Modal 6
                        } else {
                            goto(item.id);        // ✅ Normal navigation
                        }
                        }}
                    >
                    <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-muted mb-1">{item.title}</h6>
                        <h2 className="fw-bold mb-0">{item.count}</h2>
                    </div>

                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: item.color,
                        color: "#fff",
                        }}
                    >
                        <Icon name={item.icon} size="lg" />
                    </div>
                    </Card.Body>
                </Card>
                </Col>
            ))}
            </Row>
      </Block>


       <Modal show={showModal6} onHide={handleCloseModal6} size="xl" centered>
  <Modal.Header
  closeButton
  className="bg-light"
  style={{ padding: "18px 24px" }}
>
  <Modal.Title className="fw-bold text-primary">
    📊 Dashboard Summary
  </Modal.Title>
</Modal.Header>


  <Modal.Body className="pt-2 pb-4">
  <Row className="g-4">

    {/* Pending Beyond Due Date */}
    <Col md={4}>
      <Card className="kpi-card gradient-danger">
        <Card.Body className="text-center text-white">
          <div className="kpi-icon kpi-icon-danger mb-3">
            <Icon name="clock" />
          </div>

          {/* <h6 className="opacity-75 mb-1"> */}
          <h6 className="opacity-75 mb-1" style={{ fontSize: "13px" }}>
            Pending Beyond Due Date
          </h6>

          {/* <h6 className="fw-semibold mb-0">128</h6> */}
          <h6 className="fw-semibold mb-0" style={{ fontSize: "18px" }}>
                128
                </h6>


          <span className="badge bg-light text-danger px-3 py-1">
            SLA Breached
          </span>
        </Card.Body>
      </Card>
    </Col>

    {/* Disposed Within Prescribed Time */}
    <Col md={4}>
      <Card className="kpi-card gradient-success">
        <Card.Body className="text-center text-white">
          <div className="kpi-icon kpi-icon-success mb-3">
            <Icon name="check-circle" />
          </div>

          <h6 className="opacity-75 mb-1">
            Disposed Within Prescribed Time
          </h6>

          <h6 className="fw-semibold mb-0">128</h6>



          <span className="badge bg-light text-success px-3 py-1">
            On Time
          </span>
        </Card.Body>
      </Card>
    </Col>

    {/* Disposed After Due Date */}
    <Col md={4}>
      <Card className="kpi-card gradient-warning">
        <Card.Body className="text-center text-white">
          <div className="kpi-icon kpi-icon-warning mb-3">
            <Icon name="alert-circle" />
          </div>

          <h6 className="opacity-75 mb-1">
            Disposed After Due Date
          </h6>

          <h6 className="fw-semibold mb-0">128</h6>


          <span className="badge bg-light text-warning px-3 py-1">
            Delayed
          </span>
        </Card.Body>
      </Card>
    </Col>

  </Row>

  <hr className="my-4" />

<Card className="shadow-sm border-0">
  <Card.Body>
    <Row className="g-3 align-items-end">

      <Col md={6}>
        <Form.Group>
          <Form.Label className="fw-bold">
            Select Dashboard
          </Form.Label>
          <Form.Select
            value={selectedDashboard}
            onChange={(e) => setSelectedDashboard(e.target.value)}
          >
            <option value="">-- Select Dashboard --</option>
            <option value="Pending Beyond Due Date">
              Pending Beyond Due Date
            </option>
            <option value="Disposed Within Prescribed Time">
              Disposed Within Prescribed Time
            </option>
            <option value="Disposed After Due Date">
              Disposed After Due Date
            </option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={3}>
        <Button
          variant="primary"
          className="w-100"
          onClick={() => setShowTable(true)}
          disabled={!selectedDashboard}
        >
          Search
        </Button>
      </Col>

    </Row>
  </Card.Body>
</Card>

{showTable && (
  <Card className="mt-4 shadow-sm border-0">
    <Card.Body>
      <h5 className="mb-3 text-primary">
        Dashboard Details
      </h5>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Farmer Name</th>
              <th>SLA Days</th>
              <th>Days Completed</th>
              <th>Days Pending</th>
              <th>Sakala Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardDetailsData
              .filter(
                (item) => item.dashboard === selectedDashboard
              )
              .map((item, index) => (
                <tr key={index}>
                  <td>{item.farmerName}</td>
                  <td>{item.slaDays}</td>
                  <td>{item.daysCompleted}</td>
                  <td>{item.daysPending}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === "Completed On Time"
                          ? "bg-success"
                          : item.status === "Delayed"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card.Body>
  </Card>
)}


</Modal.Body>


        <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={handleCloseModal6}>
            Close
            </Button>
        </Modal.Footer>

        {/* Inline Styles */}
        <style>
        {`
        .kpi-card {
        border-radius: 14px;
        border: none;
        min-height: 120px; /* 👈 smaller */
        transition: all 0.25s ease;
        cursor: pointer;
        padding: 6px;
        }

        .kpi-card:hover {
        transform: translateY(-4px) scale(1.01);
        box-shadow: 0 10px 18px rgba(0,0,0,0.18);
        }

        /* Gradient Backgrounds */
        .gradient-danger {
            background: linear-gradient(135deg, #f8b4b4, #f06565);
            }

            .gradient-success {
            background: linear-gradient(135deg, #b6e3c6, #4fb286);
            }

            .gradient-warning {
            background: linear-gradient(135deg, #ffe5a3, #ffb703);
            }

        /* Icon Styles */
        .kpi-icon {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        margin-bottom: 6px
        margin: 0 auto;
        background: rgba(255,255,255,0.3);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .kpi-icon-danger {
            color: #fff;
        }

        .kpi-icon-success {
            color: #fff;
        }

        .kpi-icon-warning {
            color: #fff;
        }
        `}
        </style>

        </Modal>

    </Layout>
  );
}

export default SakalaDashboard;
