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

import Layout from "../../layout/default";

// import {
//     Image,
//   } from '../../components';

function HelpdeskDashboard() {
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
    <Layout title="Helpdesk Dashboard">
      <Row className="g-gs mt-5">
        {/* <Col xxl="3">
          <Card className="h-100">
              <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                          <div className="card-title">
                              <h4 className="title mb-1">Congratulations John Doe!</h4>
                              <p className="small">Employee of the month</p>
                          </div>
                          <div className="my-3">
                              <div className="amount h2 fw-bold text-primary">&#8377;42.5k</div>
                              <div className="smaller">You have done 69.5% more sales today.</div>
                          </div>
                          <Button href="#" size="sm" variant="primary">View Sales</Button>
                      </div>
                      <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div>
                  </div>
              </Card.Body>
          </Card>
        </Col> */}

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
                    <div className="amount h2 fw-bold text-primary">35</div>
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
