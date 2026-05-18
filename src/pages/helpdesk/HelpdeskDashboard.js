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
// import { ChartDoughnut } from "../../components/Chart/Charts";
// import { ChartLegend } from "../../components";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { Colors } from "../../utilities/index";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import api from "../../services/auth/api";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

// import {
//     Image,
//   } from '../../components';

function HelpdeskDashboard() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  // const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [data, setData] = useState({
    text: "",
    searchBy: "ticketArn",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleListInput = (e, row) => {
    // debugger;
    let { name, value } = e.target;
    const updatedRow = { ...row, [name]: value };
    const updatedDataList = hdTicketDataList.map((rowData) =>
      rowData.hdTicketId === row.hdTicketId ? updatedRow : rowData,
    );
    setHdTicketDataList(updatedDataList);
  };
  // Translation
  const { t } = useTranslation();
  // console.log(hdTicketDataList);

  const styles = {
    backgroundColor: "#cdefff",
    borderRadius: "2%",
  };

  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "ticketArn") {
      joinColumn = "hdTicket.ticketArn";
    }
    if (data.searchBy === "hdSeverityName") {
      joinColumn = "hdSeverityMaster.hdSeverityName";
    }
    if (data.searchBy === "username") {
  joinColumn = "userMaster.username";
}

    // console.log(joinColumn);
    api
      .post(
        baseURL2 + `hdTicket/search`,
        {
          searchText: data.text,
          joinColumn: joinColumn,
        },
        {
          headers: _header,
        },
      )
      .then((response) => {
        setHdTicketDataList(response.data.content.hdTicket);
        setTotalRows(response.data.content.totalItems);

        // if (response.data.content.error) {
        //   // saveError();
        // } else {
        //   console.log(response);
        //   // saveSuccess();
        // }
      })
      .catch((err) => {
        // saveError();
      });
  };

  const [hdTicketData, setHdTicketData] = useState({});

  const getTicketData = () => {
    // setLoading(true);
    api
      .get(baseURL2 + `hdTicket/ticket-counts`)
      .then((response) => {
        setHdTicketData(response.data);
      })
      .catch((err) => {
        // setListData({});
        // setLoading(false);
      });
  };

  useEffect(() => {
    getTicketData();
  }, []);

  // get list of ticket
  const [hdTicketDataList, setHdTicketDataList] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const getTicketDataList = () => {
    // setLoading(true);
    api
      .get(baseURL2 + `hdTicket/list-with-join`,  {
    params: {
      pageNumber: page,
      size: countPerPage,
    },
  })
      .then((response) => {
        setHdTicketDataList(response.data.content.hdTicket);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        // setLoading(false);
      });
  };

  // const getTicketDataList = () => {
  //   // setLoading(true);
  //   api
  //     .post(baseURL2 + `hdTicket/search`, {
  //       searchText: "",
  //       joinColumn: "hdTicket.ticketArn",
  //       pageNumber: "0",
  //       pageSize: "10",
  //       // userId: localStorage.getItem("userMasterId"),
  //     })
  //     .then((response) => {
  //       setHdTicketDataList(response.data.content.hdTicket);
  //       setTotalRows(response.data.content.totalItems);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       // setListData({});
  //       // setLoading(false);
  //     });
  // };

  useEffect(() => {
     if (!selectedType) {
    getTicketDataList(page); // ✅ first load
  } else {
    getOtherTicketDataList(selectedType, page); // ✅ after clicking view
  }
}, [page, selectedType]);
  // console.log(hdTicketData);

  // to get Status
  const [hdStatusListData, setHdStatusListData] = useState([]);

  const getStatusList = () => {
    api
      .get(baseURLMaster + `hdStatusMaster/get-all`)
      .then((response) => {
        setHdStatusListData(response.data.content.hdStatusMaster);
      })
      .catch((err) => {
        setHdStatusListData([]);
      });
  };

  useEffect(() => {
    getStatusList();
  }, []);

  // to get Severity
  const [severityListData, setSeverityListData] = useState([]);

  const getSeverityList = () => {
    api
      .get(baseURLMaster + `hdSeverityMaster/get-all`)
      .then((response) => {
        setSeverityListData(response.data.content.hdSeverityMaster);
      })
      .catch((err) => {
        setSeverityListData([]);
      });
  };

  useEffect(() => {
    getSeverityList();
  }, []);

  // get list of other ticket
  const getOtherTicketDataList = (text, page = 0) => {
    if (selectedType !== text) {
      setSelectedType(text);
    }
    // setLoading(true);
    const newParams = {
      params: {
        pageNumber: page,
        size: text === "Closed Tickets" ? countPerPage : 1000,
        ticketType: text,
      },
    };
    api
      .get(baseURL2 + `hdTicket/list-with-join`, newParams)
      .then((response) => {
        setHdTicketDataList(response.data.content.hdTicket);
        if (text === "Closed Tickets") {
          api.get(baseURL2 + `hdTicket/ticket-counts`).then((res) => {
            setTotalRows(res.data.closedTickets);
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        // setLoading(false);
      });
  };

  // Update details
  const edit = (rowData) => {
    console.log(rowData);
    api
      .post(baseURL2 + `hdTicket/edit`, {
        ...rowData,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // let sessionsDevice = {
  //   labels: ["Total Tickets", "Pending", "Closed Ticket", "Others"],
  //   datasets: [
  //     {
  //       backgroundColor: [
  //         Colors.info,
  //         Colors.yellow,
  //         Colors.green,
  //         Colors.purple,
  //       ],
  //       data: [35, 23, 10, 27],
  //       hoverOffset: 4,
  //     },
  //   ],
  // };

  const customStyles = {
    rows: {
      style: {
        minHeight: "48px",
        fontSize: "13px",
        color: "#2a3f5f",
      },
      stripedStyle: {
        backgroundColor: "#f8fbff",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#eaf3fd",
        transitionDuration: "0.15s",
        transitionProperty: "background-color",
      },
    },
    headCells: {
      style: {
        background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.4px",
        textTransform: "uppercase",
        paddingLeft: "10px",
        paddingRight: "10px",
        minHeight: "46px",
      },
    },
    cells: {
      style: {
        paddingLeft: "10px",
        paddingRight: "10px",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #e3ecf7",
        color: "#1a3c6e",
        fontSize: "13px",
      },
    },
  };

  // Stat card theme presets — colour, icon, gradient
  const statThemes = {
    new: {
      gradient: "linear-gradient(135deg, #e8f3ff 0%, #d1e6fd 100%)",
      accent: "#1e67a8",
      iconBg: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
      icon: "file-plus",
      shadow: "0 6px 20px rgba(30, 103, 168, 0.18)",
    },
    open: {
      gradient: "linear-gradient(135deg, #fff5e1 0%, #ffe3b5 100%)",
      accent: "#c47a00",
      iconBg: "linear-gradient(135deg, #f0a830 0%, #c47a00 100%)",
      icon: "play-fill",
      shadow: "0 6px 20px rgba(196, 122, 0, 0.18)",
    },
    closed: {
      gradient: "linear-gradient(135deg, #e6f6ea 0%, #c8ead0 100%)",
      accent: "#1f7a36",
      iconBg: "linear-gradient(135deg, #34a853 0%, #1f7a36 100%)",
      icon: "check-circle-fill",
      shadow: "0 6px 20px rgba(31, 122, 54, 0.18)",
    },
    pending: {
      gradient: "linear-gradient(135deg, #f0e8ff 0%, #ddc7ff 100%)",
      accent: "#6a3fb5",
      iconBg: "linear-gradient(135deg, #8b5cf6 0%, #6a3fb5 100%)",
      icon: "clock",
      shadow: "0 6px 20px rgba(106, 63, 181, 0.18)",
    },
  };

  const renderStatCard = (themeKey, label, count, onView) => {
    const theme = statThemes[themeKey];
    return (
      <Card
        className="h-100"
        style={{
          border: "none",
          borderRadius: "16px",
          boxShadow: theme.shadow,
          overflow: "hidden",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          cursor: "default",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = theme.shadow.replace("0.18", "0.30");
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = theme.shadow;
        }}
      >
        <Card.Body
          style={{
            background: theme.gradient,
            padding: "20px 22px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-30px",
              top: "-30px",
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
            }}
          />
          <div className="d-flex justify-content-between align-items-start" style={{ position: "relative" }}>
            <div>
              <div
                style={{
                  color: theme.accent,
                  fontSize: "12.5px",
                  fontWeight: 700,
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: "34px",
                  fontWeight: 800,
                  color: theme.accent,
                  lineHeight: "1",
                  marginBottom: "14px",
                  letterSpacing: "-0.5px",
                }}
              >
                {count ?? 0}
              </div>
              <Button
                size="sm"
                onClick={onView}
                className="d-inline-flex align-items-center"
                style={{
                  background: theme.iconBg,
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "12px",
                  padding: "5px 14px",
                  borderRadius: "999px",
                  gap: "6px",
                  letterSpacing: "0.3px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                }}
              >
                {t("View")}
                <Icon name="arrow-long-right" style={{ fontSize: "14px" }}></Icon>
              </Button>
            </div>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: theme.iconBg,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                flexShrink: 0,
              }}
            >
              <Icon name={theme.icon} style={{ fontSize: "22px" }}></Icon>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const HelpdeskDataColumns = [
    {
      name: t("Ticket No."),
      selector: (row) => row.ticketArn,
      cell: (row) => <span>{row.ticketArn}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("User Profile"),
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name:t("Contact Name"),
    //   selector: (row) => row.contactPerson ,
    //   cell: (row) => <span>{row.contactPerson}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Contact Number"),
      selector: (row) => row.contactNumber,
      cell: (row) => <span>{row.contactNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Query"),
      selector: (row) => row.query,
      cell: (row) => <span>{row.query}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Status"),
      selector: (row) => row.hdStatusName,
      cell: (row) => <span>{row.hdStatusName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Query Details"),
      selector: (row) => row.queryDetails,
      cell: (row) => <span>{row.queryDetails}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: t("Category"),
    //   selector: (row) => row.hdCategoryName,
    //   cell: (row) => <span>{row.hdCategoryName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("User Affected"),
      selector: (row) => row.hdUsersAffected,
      cell: (row) => <span>{row.hdUsersAffected}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: t("Module"),
    //   selector: (row) => row.hdModuleName,
    //   cell: (row) => <span>{row.hdModuleName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Feature"),
      selector: (row) => row.hdFeatureName,
      cell: (row) => <span>{row.hdFeatureName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Severity",
    //   selector: (row) => row.hdSeverityName,
    //   cell: (row) => <span>{row.hdSeverityName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Status",
    //   cell: (row) => (
    //     <div className="text-start w-100">
    //       <Form.Group className="form-group">
    //         <div className="form-control-wrap">
    //           <Form.Select
    //             name="hdStatusId"
    //             value={row.hdStatusId}
    //             onChange={(e) => handleListInput(e, row)}
    //             // onBlur={() => handleInputs}
    //           >
    //             <option value="">Select Status</option>
    //             {hdStatusListData.map((list) => (
    //               <option key={list.hdStatusId} value={list.hdStatusId}>
    //                 {list.hdStatusName}
    //               </option>
    //             ))}
    //           </Form.Select>
    //         </div>
    //       </Form.Group>
    //     </div>
    //   ),
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Severity",
    //   selector: (row) => row.hdSeverityId,
    //   cell: (row) => (
    //     <div className="text-start w-100">
    //       <Form.Group className="form-group">
    //         <div className="form-control-wrap">
    //           <Form.Select
    //             name="hdSeverityId"
    //             value={row.hdSeverityId}
    //             onChange={(e) => handleListInput(e, row)}
    //             // onBlur={() => handleInputs}
    //           >
    //             <option value="">Select Severity</option>
    //             {severityListData.map((list) => (
    //               <option key={list.hdSeverityId} value={list.hdSeverityId}>
    //                 {list.hdSeverityName}
    //               </option>
    //             ))}
    //           </Form.Select>
    //         </div>
    //       </Form.Group>
    //     </div>
    //   ),
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Assigned To",
    //   selector: (row) => row.assignedTo,
    //   cell: (row) => <span>{row.assignedTo}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Attachments",
    //   selector: (row) => row.hdAttachFiles,
    //   cell: (row) => <span>{row.hdAttachFiles}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("Action"),
      cell: (row) => (
        <Button
          size="sm"
          onClick={() => handleView(row.hdTicketId, row)}
          className="d-inline-flex align-items-center"
          style={{
            background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
            border: "none",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "12px",
            padding: "5px 12px",
            borderRadius: "8px",
            gap: "5px",
            letterSpacing: "0.2px",
            boxShadow: "0 2px 6px rgba(15, 76, 138, 0.20)",
          }}
        >
          <Icon name="eye" style={{ fontSize: "13px" }}></Icon>
          {t("View")}
        </Button>
      ),
      sortable: true,
      hide: "md",
    },
  ];

  const navigate = useNavigate();
  const handleView = (_id, row) => {
    if (row.hdStatusName === "New Tickets") {
      api
        .post(baseURL2 + `hdTicket/edit`, {
          ...row,
          hdStatusId: "2",
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    navigate(`/seriui/raise-ticket-view/${_id}`);
  };

  return (
    <Layout title="Help desk Dashboard">
      <style>{`
        .helpdesk-dashboard .form-control,
        .helpdesk-dashboard .form-select {
          border: 1px solid #d4e0ee;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 13.5px;
          color: #2a3f5f;
          background: #ffffff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .helpdesk-dashboard .form-control:focus,
        .helpdesk-dashboard .form-select:focus {
          border-color: #1e67a8;
          box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.15);
        }
        .helpdesk-dashboard .form-label {
          font-weight: 600;
          color: #1a3c6e;
          font-size: 13px;
        }
        .helpdesk-dashboard .rdt_Pagination button {
          color: #1a3c6e !important;
        }
      `}</style>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <div
              className="d-flex align-items-center"
              style={{
                gap: "14px",
                background: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(6px)",
                border: "1px solid #e3ecf7",
                padding: "12px 18px",
                borderRadius: "14px",
                boxShadow: "0 4px 14px rgba(15, 76, 138, 0.12)",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(15, 76, 138, 0.28)",
                  flexShrink: 0,
                }}
              >
                <Icon name="help-fill" style={{ fontSize: "20px" }}></Icon>
              </div>
              <div style={{ lineHeight: 1.25 }}>
                <h2
                  style={{
                    color: "#0f3060",
                    fontSize: "22px",
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: "0.2px",
                  }}
                >
                  {t("Helpdesk Dashboard")}
                </h2>
                <span style={{ color: "#3b5278", fontSize: "13px", fontWeight: 500 }}>
                  {t("Manage and track all support tickets at a glance")}
                </span>
              </div>
            </div>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/help-desk"
                  className="d-inline-flex align-items-center d-md-none"
                  style={{
                    background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                    color: "#ffffff",
                    fontWeight: 600,
                    padding: "9px 16px",
                    borderRadius: "10px",
                    gap: "8px",
                    letterSpacing: "0.3px",
                    boxShadow: "0 6px 16px rgba(15, 76, 138, 0.28)",
                    textDecoration: "none",
                  }}
                >
                  <Icon name="plus" />
                  <span>{t("Create New Ticket")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/help-desk"
                  className="d-none d-md-inline-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                    color: "#ffffff",
                    fontWeight: 600,
                    padding: "10px 18px",
                    borderRadius: "10px",
                    gap: "8px",
                    letterSpacing: "0.3px",
                    boxShadow: "0 6px 16px rgba(15, 76, 138, 0.28)",
                    textDecoration: "none",
                  }}
                >
                  <Icon name="plus" />
                  <span>{t("Create New Ticket")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Row className="g-gs helpdesk-dashboard">
        <Col xxl="3" lg="6">
          {renderStatCard(
            "new",
            t("New Tickets"),
            hdTicketData.newTickets,
            () => getOtherTicketDataList("New Tickets"),
          )}
        </Col>

        <Col xxl="3" lg="6">
          {renderStatCard(
            "open",
            t("Open Tickets"),
            hdTicketData.openTickets,
            () => getOtherTicketDataList("Open Tickets"),
          )}
        </Col>

        <Col xxl="3" lg="6">
          {renderStatCard(
            "closed",
            t("Closed Tickets"),
            hdTicketData.closedTickets,
            () => getOtherTicketDataList("Closed Tickets"),
          )}
        </Col>

        <Col xxl="3" lg="6">
          {renderStatCard(
            "pending",
            t("Pending Tickets"),
            hdTicketData.unassignedTickets,
            () => getOtherTicketDataList("Pending Tickets"),
          )}
        </Col>

        {/* <Col xxl="3">
          <Card className="h-100">
            <Card.Body style={{ ...styles }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">{t("Escalated Tickets")}</h4>
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">
                      {hdTicketData.escalatedTickets}
                    </div>
                  </div>
                  <Button
                    href="#"
                    size="sm"
                    variant="primary"
                    onClick={() => getOtherTicketDataList("Escalated Tickets")}
                  >
                    {t("View")}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl="3">
          <Card className="h-100">
            <Card.Body style={{ ...styles }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">{t("Resolved Tickets")}</h4>
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">
                      {hdTicketData.resolvedTickets}
                    </div>
                  </div>
                  <Button
                    href="#"
                    size="sm"
                    variant="primary"
                    onClick={() => getOtherTicketDataList("Resolved Tickets")}
                  >
                    {t("View")}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
      <Row className="g-gs mt-2 helpdesk-dashboard">
        <Col xxl="12">
          <Block className="mt-n3">
            <Card
              style={{
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 6px 24px rgba(15, 76, 138, 0.10)",
                overflow: "hidden",
              }}
            >
              <Card.Header
                style={{
                  background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "14px 22px",
                  letterSpacing: "0.3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "none",
                }}
              >
                <Icon name="list-thumb" style={{ fontSize: "18px" }}></Icon>
                {t("All Tickets")}
                {selectedType && (
                  <span
                    style={{
                      marginLeft: "8px",
                      padding: "3px 12px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.18)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {selectedType}
                  </span>
                )}
              </Card.Header>
              <div
                style={{
                  background: "linear-gradient(135deg, #f8f9ff 0%, #eef3fc 100%)",
                  padding: "18px 22px",
                  borderBottom: "1px solid #e3ecf7",
                }}
              >
                <Form.Group as={Row} className="form-group align-items-center mb-0" id="hdTicketId">
                  <Form.Label column sm={1} className="mb-0" style={{ fontWeight: 700, color: "#1a3c6e" }}>
                    {t("Search By")}
                  </Form.Label>
                  <Col sm={3}>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="searchBy"
                        value={data.searchBy}
                        onChange={handleInputs}
                      >
                        <option value="ticketArn">{t("Ticket Number")}</option>
                        <option value="hdSeverityName">{t("Severity")}</option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <Form.Control
                      id="hdTicketId"
                      name="text"
                      value={data.text}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Type to search…")}
                    />
                  </Col>
                  <Col sm={4} className="d-flex" style={{ gap: "10px" }}>
                    <Button
                      type="button"
                      onClick={search}
                      className="d-inline-flex align-items-center"
                      style={{
                        background: "linear-gradient(135deg, #1e67a8 0%, #0f3060 100%)",
                        border: "none",
                        color: "#ffffff",
                        fontWeight: 600,
                        padding: "9px 18px",
                        borderRadius: "10px",
                        gap: "8px",
                        boxShadow: "0 4px 12px rgba(15, 76, 138, 0.22)",
                      }}
                    >
                      <Icon name="search" style={{ fontSize: "15px" }}></Icon>
                      {t("search")}
                    </Button>
                    <OverlayTrigger placement="top" overlay={<Tooltip>{t("Reset list")}</Tooltip>}>
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedType("");
                          getTicketDataList();
                        }}
                        className="d-inline-flex align-items-center"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #b9d2ec",
                          color: "#1a3c6e",
                          fontWeight: 600,
                          padding: "9px 14px",
                          borderRadius: "10px",
                        }}
                      >
                        <Icon name="reload-alt"></Icon>
                      </Button>
                    </OverlayTrigger>
                  </Col>
                </Form.Group>
              </div>
              <DataTable
                tableClassName="data-table-head-light table-responsive"
                columns={HelpdeskDataColumns}
                data={hdTicketDataList}
                highlightOnHover
                striped
                pagination={!selectedType || selectedType === "Closed Tickets"}
                paginationServer={!selectedType || selectedType === "Closed Tickets"}
                paginationTotalRows={totalRows}
                paginationPerPage={countPerPage}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                }}
                onChangePage={(page) => {
                  getOtherTicketDataList(selectedType || "Closed Tickets", page - 1);
                }}
                progressPending={loading}
                theme="solarized"
                customStyles={customStyles}
                noDataComponent={
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#5a7299" }}>
                    <Icon name="inbox" style={{ fontSize: "32px", opacity: 0.5 }}></Icon>
                    <div style={{ marginTop: "8px", fontWeight: 600 }}>{t("No tickets to display")}</div>
                  </div>
                }
              />
            </Card>
          </Block>
        </Col>
      </Row>
    </Layout>
  );
}

export default HelpdeskDashboard;
