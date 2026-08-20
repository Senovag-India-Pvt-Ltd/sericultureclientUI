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

function EscalationDashboard() {
  // Translation
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
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
      rowData.hdTicketId === row.hdTicketId ? updatedRow : rowData
    );
    setHdTicketDataList(updatedDataList);
  };

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

    // console.log(joinColumn);
    api
      .post(
        baseURL2 + `hdTicket/search`,
        {
          searchText: data.text,
          joinColumn: joinColumn,
          escalateUserMasterId: localStorage.getItem("userMasterId"),
        },
        {
          headers: _header,
        }
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
      .get(baseURL2 + `hdTicket/get-ticket-counts-by-escalated-user-id`, {
        params: { userMasterId: localStorage.getItem("userMasterId") },
      })
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

  // const getTicketDataList = () => {
  //   // setLoading(true);
  //   api
  //     .get(baseURL2 + `hdTicket/list-with-join`, _params)
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

  const getTicketDataList = () => {
    // setLoading(true);
    api
      .post(baseURL2 + `hdTicket/search`, {
        searchText: "",
        joinColumn: "hdModuleMaster.hdModuleName",
        pageNumber: page,
        pageSize: "5",
        escalateUserMasterId: localStorage.getItem("userMasterId"),
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

  useEffect(() => {
    getTicketDataList();
  }, [page]);
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
  const getOtherTicketDataList = (text) => {
    const newParams = {
      userMasterId: localStorage.getItem("userMasterId"),
      ticketType: text,
    };
    api
      .post(baseURL2 + `hdTicket/get-by-user-master-id`, newParams)
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

  // Stat card theme presets — colour, icon, gradient (visual only)
  const statThemes = {
    escalated: {
      gradient: "linear-gradient(135deg, #fff5e1 0%, #ffe3b5 100%)",
      accent: "#c47a00",
      iconBg: "linear-gradient(135deg, #f0a830 0%, #c47a00 100%)",
      icon: "bell-fill",
      shadow: "0 6px 20px rgba(196, 122, 0, 0.18)",
    },
    resolved: {
      gradient: "linear-gradient(135deg, #e6f6ea 0%, #c8ead0 100%)",
      accent: "#1f7a36",
      iconBg: "linear-gradient(135deg, #34a853 0%, #1f7a36 100%)",
      icon: "check-circle-fill",
      shadow: "0 6px 20px rgba(31, 122, 54, 0.18)",
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
      name:t("User Profile"),
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
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
    {
      name: t("Category"),
      selector: (row) => row.hdCategoryName,
      cell: (row) => <span>{row.hdCategoryName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("User Affected"),
      selector: (row) => row.hdUsersAffected,
      cell: (row) => <span>{row.hdUsersAffected}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Module"),
      selector: (row) => row.hdModuleName,
      cell: (row) => <span>{row.hdModuleName}</span>,
      sortable: true,
      hide: "md",
    },
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
      name:t("Action"),
      cell: (row) => (
        <div text-start w-100>
          {/* <Button variant="primary" size="sm" onClick={() => edit(row)}>
              Update
            </Button> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.hdTicketId)}
          >
             {t("View")}
          </Button>
        </div>
      ),
      sortable: true,
      hide: "md",
    },
  ];

  const navigate = useNavigate();
  const handleView = (_id) => {
    // if (row.hdStatusName === "New Tickets") {
    //   api
    //     .post(baseURL2 + `hdTicket/edit`, {
    //       ...row,
    //       hdStatusId: "2",
    //     })
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
    navigate(`/seriui/escalate-view/${_id}`);
  };

  return (
    <Layout title="Escalate Dashboard">
      <style>{`
        .escalate-dashboard .form-control,
        .escalate-dashboard .form-select {
          border: 1px solid #d4e0ee;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 13.5px;
          color: #2a3f5f;
          background: #ffffff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .escalate-dashboard .form-control:focus,
        .escalate-dashboard .form-select:focus {
          border-color: #1e67a8;
          box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.15);
        }
        .escalate-dashboard .form-label {
          font-weight: 600;
          color: #1a3c6e;
          font-size: 13px;
        }
        .escalate-dashboard .rdt_Pagination button {
          color: #1a3c6e !important;
        }
        .sh-page-header {
          padding: 20px 24px;
          background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
          border-radius: 12px;
          border: none;
          box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
          margin-bottom: 22px;
        }
        .sh-page-title {
          margin-bottom: 4px;
          color: #ffffff !important;
          font-weight: 700;
          letter-spacing: 0.2px;
        }
        .sh-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700 !important;
          font-size: 1rem !important;
          letter-spacing: 0.3px;
          background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
          border-left: none !important;
          color: #ffffff !important;
          padding: 14px 20px !important;
          border: none !important;
        }
        .sh-section-header svg,
        .sh-section-header .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          color: #ffffff;
          font-size: 15px;
        }
      `}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Escalate Dashboard")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              {/* <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/help-desk"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="plus" />
                    <span>Create New Ticket</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/help-desk"
                    className="btn btn-primary d-none d-md-inline-flex"
                  >
                    <Icon name="plus" />
                    <span>Create New Ticket</span>
                  </Link>
                </li>
              </ul> */}
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>
      <Row className="g-gs escalate-dashboard">
        {/* <Col xxl="3">
            <Card className="h-100">
              <Card.Body style={{ ...styles }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="card-title">
                      <h4 className="title mb-1">New Tickets</h4>
                    </div>
                    <div className="my-3">
                      <div className="amount h2 fw-bold text-primary">
                        {hdTicketData.newTickets}
                      </div>
                    </div>
                    <Button
                      href="#"
                      size="sm"
                      variant="primary"
                      onClick={() => getOtherTicketDataList("New Tickets")}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col> */}

        <Col xxl="4" lg="6">
          {renderStatCard(
            "escalated",
            t("Escalated Tickets"),
            hdTicketData.escalatedTickets,
            () => getOtherTicketDataList("Escalated Tickets"),
          )}
        </Col>

        <Col xxl="4" lg="6">
          {renderStatCard(
            "resolved",
            t("Resolved Tickets"),
            hdTicketData.resolvedTickets,
            () => getOtherTicketDataList("Resolved Tickets"),
          )}
        </Col>

        {/* <Col xxl="3">
          <Card className="h-100">
            <Card.Body style={{ ...styles }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">Pending Tickets</h4>

                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">
                      {hdTicketData.unassignedTickets}
                    </div>
                  </div>
                  <Button
                    href="#"
                    size="sm"
                    variant="primary"
                    onClick={() => getOtherTicketDataList("Pending Tickets")}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
      <Row className="g-gs mt-2 escalate-dashboard">
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
              <Card.Header className="sh-section-header">
                <Icon name="list-thumb" style={{ fontSize: "18px" }}></Icon>
                <span>{t("Escalated Tickets")}</span>
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

                  <Col sm={3}>
                    <Form.Control
                      id="hdTicketId"
                      name="text"
                      value={data.text}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Search")}
                    />
                  </Col>
                  <Col sm={3} className="d-flex" style={{ gap: "10px" }}>
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
                    <Button
                      type="button"
                      onClick={getTicketDataList}
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
                  </Col>
                </Form.Group>
              </div>
              <DataTable
                tableClassName="data-table-head-light table-responsive"
                columns={HelpdeskDataColumns}
                data={hdTicketDataList}
                highlightOnHover
                striped
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={countPerPage}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                }}
                onChangePage={(page) => setPage(page - 1)}
                progressPending={loading}
                noDataComponent={<div className="py-4">{t("There are no records to display")}</div>}
                theme="solarized"
                customStyles={customStyles}
              />
            </Card>
          </Block>
        </Col>
      </Row>
    </Layout>
  );
}

export default EscalationDashboard;
