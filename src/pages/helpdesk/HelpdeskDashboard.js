// import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
import {
  Row,
  Col,
  Card,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { ChartDoughnut } from "../../components/Chart/Charts";
import { ChartLegend } from "../../components";
import { Colors } from "../../utilities/index";
import { useState, useEffect } from "react";
import Layout from "../../layout/default";
import api from "../../services/auth/api";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;


// import {
//     Image,
//   } from '../../components';

function HelpdeskDashboard() {

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };


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
    if (data.searchBy === "username") {
      joinColumn = "userMaster.username";
    }
    if (data.searchBy === "hdModuleName") {
      joinColumn = "hdModuleMaster.hdModuleName";
    }
    // console.log(joinColumn);
    api
      .post(baseURL2 + `hdTicket/search`, {
        searchText: data.text,
        joinColumn: joinColumn,
      }, {
        headers: _header,
      })
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

  const [hdTicketList, setHdTicketListData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
  });

  const getList = (e) => {
    // setLoading(true);
    api
      .post(baseURL2 + `hdTicket/get-by-user-master-id`,{userMasterId:e})
      .then((response) => {
        setListData(response.data.content.hdTicket);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
        if (response.data.content.error) {
          setListData([]);
        }
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    if (hdTicketList.userMasterId) {
      getList(hdTicketList.userMasterId);
    }
  }, [hdTicketList.userMasterId]);


  let sessionsDevice = {
    labels: ["Total Tickets", "Pending", "Closed Ticket", "Others"],
    datasets: [
      {
        backgroundColor: [
          Colors.info,
          Colors.yellow,
          Colors.green,
          Colors.purple,
        ],
        data: [35, 23, 10, 27],
        hoverOffset: 4,
      },
    ],
  };



  return (
    <Layout title="Help desk Dashboard">
      <Row className="g-gs mt-5">

        <Col xxl="3">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">Total Tickets</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">{totalRows}</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    View
                  </Button>
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
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">Pending Tickets</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">23</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    View
                  </Button>
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
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">Closed Tickets</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">10</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    View
                  </Button>
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
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">
                      Flagged Tickets (Escalated Support Team)
                    </h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">111</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    View
                  </Button>
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
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">Resolved within TAT</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">100</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    View
                  </Button>
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
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">User Information</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">27</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    View
                  </Button>
                </div>
                {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl="6">
          <Card className="h-100">
            <Card.Body>
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">Chart</h5>
                </div>
                <div className="card-tools">
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id="tooltip-another">
                        Data
                      </Tooltip>
                    }
                  >
                    <em className="icon-hint icon ni ni-help-fill"></em>
                  </OverlayTrigger>
                </div>
              </div>
              <div className="nk-chart-analytics-session-device mt-4">
                <ChartDoughnut data={sessionsDevice} />
              </div>
              <ChartLegend.Group className="justify-content-around pt-4 flex-wrap gap g-2">
                <ChartLegend symbol="info">Total Tickets</ChartLegend>
                <ChartLegend symbol="warning">Pending</ChartLegend>
                <ChartLegend symbol="success">Closed Ticket</ChartLegend>
                <ChartLegend symbol="purple">Others</ChartLegend>
              </ChartLegend.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default HelpdeskDashboard;
