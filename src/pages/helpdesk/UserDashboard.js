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

import Layout from "../../layout/default";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components";
import api from "../../services/auth/api";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;

// import {
//     Image,
//   } from '../../components';

function UserDashboard() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const styles = {
    backgroundColor: "#cdefff",
    borderRadius: "2%",
  };

  const [data, setData] = useState({
    text: "",
    searchBy: "username",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "hdModuleName") {
      joinColumn = "hdModuleMaster.hdModuleName";
    }
    if (data.searchBy === "username") {
      joinColumn = "userMaster.username";
    }
    if (data.searchBy === "hdFeatureName") {
      joinColumn = "hdModuleMaster.hdFeatureName";
    }
    if (data.searchBy === "hdBoardCategoryName") {
      joinColumn = "hdBoardCategoryMaster.hdBoardCategoryName";
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
        }
      )
      .then((response) => {
        setListData(response.data.content.hdTicket);

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

  const [hdUserData, setHdUserData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
  });

  const [ticketData, setTicketData] = useState({});

  const getUserTicket = (e) => {
    // setLoading(true);
    api
      .get(baseURL2 + `hdTicket/get-ticket-counts-by-user-master-id`, {
        params: { userMasterId: e },
      })
      .then((response) => {
        setTicketData(response.data);
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
    if (hdUserData.userMasterId) {
      getUserTicket(hdUserData.userMasterId);
    }
  }, [hdUserData.userMasterId]);

  // get list of ticket
  const [hdTicketDataList, setHdTicketDataList] = useState([]);

  const getTicketDataList = () => {
    // setLoading(true);
    api
      .post(baseURL2 + `hdTicket/get-by-on-behalf-of`, {
        onBehalfOf: localStorage.getItem("userMasterId"),
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

  const HelpdeskDataColumns = [
    {
      name: "Ticket No.",
      selector: (row) => row.hdTicketId,
      cell: (row) => <span>{row.hdTicketId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "User Profile",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Query",
      selector: (row) => row.query,
      cell: (row) => <span>{row.query}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Query Details",
      selector: (row) => row.queryDetails,
      cell: (row) => <span>{row.queryDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Category",
      selector: (row) => row.hdCategoryName,
      cell: (row) => <span>{row.hdCategoryName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "User Affected",
      selector: (row) => row.hdUsersAffected,
      cell: (row) => <span>{row.hdUsersAffected}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Module",
      selector: (row) => row.hdModuleName,
      cell: (row) => <span>{row.hdModuleName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Feature",
      selector: (row) => row.hdFeatureName,
      cell: (row) => <span>{row.hdFeatureName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Status",
      selector: (row) => row.hdStatusName,
      cell: (row) => <span>{row.hdStatusName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Attachments",
      selector: (row) => row.hdAttachFiles,
      cell: (row) => <span>{row.hdAttachFiles}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Action",
      cell: (row) => (
        <div text-start w-100>
          {/* <Button variant="primary" size="sm" onClick={() => edit(row)}>
            Update
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.hdTicketId, row)}
          >
            View
          </Button>
        </div>
      ),
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Help desk Dashboard">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">User Dashboard</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
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
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Row className="g-gs">
        <Col xxl="3">
          <Card className="h-100">
            <Card.Body style={{ ...styles }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">New Tickets</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">
                      {ticketData.newTickets}
                    </div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  {/* <Button href="#" size="sm" variant="primary">
                    View
                  </Button> */}
                </div>
                {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
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
                    <h4 className="title mb-1">Open Tickets</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">
                      {" "}
                      {ticketData.openTickets}
                    </div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  {/* <Button href="#" size="sm" variant="primary">
                    View
                  </Button> */}
                </div>
                {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
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
                    <h4 className="title mb-1">Closed Tickets</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">
                      {ticketData.closedTickets}
                    </div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  {/* <Button href="#" size="sm" variant="primary">
                    View
                  </Button> */}
                </div>
                {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* <Col xxl="3">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">Unsigned Tickets</h4>
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">111</div>
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    View
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
      <Row className="g-gs mt-2">
        <Col xxl="12">
          <Block className="mt-n3">
            <Card>
              <Row className="m-2">
                <Col>
                  <Form.Group as={Row} className="form-group" id="hdTicketId">
                    <Form.Label column sm={1}>
                      Search By
                    </Form.Label>
                    <Col sm={3}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="searchBy"
                          value={data.searchBy}
                          onChange={handleInputs}
                        >
                          <option value="hdModuleName">Module</option>
                          <option value="username">User name</option>
                          <option value="hdFeatureName">Feature</option>
                          <option value="hdBoardCategoryName">
                            Board Category
                          </option>
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
                        placeholder="Search"
                      />
                    </Col>
                    <Col sm={3}>
                      <Button type="button" variant="primary" onClick={search}>
                        Search
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <DataTable
                tableClassName="data-table-head-light table-responsive"
                columns={HelpdeskDataColumns}
                data={hdTicketDataList}
                highlightOnHover
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={countPerPage}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                }}
                onChangePage={(page) => setPage(page - 1)}
                progressPending={loading}
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

export default UserDashboard;
