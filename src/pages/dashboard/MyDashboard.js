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
import { useNavigate } from "react-router-dom";

import Layout from "../../layout/default";

// import {
//     Image,
//   } from '../../components';

function MyDashboard() {
  let sessionsDevice = {
    labels: [
      "Pending Application",
      "Closed Application",
      "Awaiting for Verification",
      "Awaiting for Sanctioning",
      "Awaiting for Drawing",
      "Awaiting for Counter Signing",
    ],
    datasets: [
      {
        backgroundColor: [
          Colors.info,
          Colors.yellow,
          Colors.green,
          Colors.purple,
          Colors.gray,
          Colors.black,
        ],
        data: [35, 23, 10, 3, 3, 3, 3],
        hoverOffset: 4,
      },
    ],
  };

  const navigate = useNavigate();
  const handleClick = (e) => {
    // console.log(e.target.name);
    e.preventDefault();
    if (e.target.name === "verification") {
      navigate("/subsidy-approval-verification");
    } else if (e.target.name === "sanction") {
      navigate("/subsidy-sanction");
    } else if (e.target.name === "drawing") {
      navigate("/subsidy-drawing");
    } else if (e.target.name === "counter") {
      navigate("/subsidy-counter-sign");
    }
  };

  return (
    <Layout title="My Dashboard">
      <Row className="g-gs">
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
                    <h4 className="title mb-1">Total Application</h4>
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
                    <h4 className="title mb-1">Pending Application</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">23</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button
                    onClick={handleClick}
                    name="pending"
                    href=""
                    size="sm"
                    variant="primary"
                  >
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
                    <h4 className="title mb-1">Closed Application</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">10</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button
                    onClick={handleClick}
                    name="closed"
                    href="#"
                    size="sm"
                    variant="primary"
                  >
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
                    <h4 className="title mb-1">Awaiting for Verification</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">3</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button
                    name="verification"
                    size="sm"
                    variant="primary"
                    onClick={handleClick}
                  >
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
                    <h4 className="title mb-1">Awaiting for Sanctioning</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">3</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button
                    onClick={handleClick}
                    name="sanction"
                    href="#"
                    size="sm"
                    variant="primary"
                  >
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
                    <h4 className="title mb-1">Awaiting for Drawing</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">3</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button
                    onClick={handleClick}
                    name="drawing"
                    href="#"
                    size="sm"
                    variant="primary"
                  >
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
                    <h4 className="title mb-1">Awaiting for Counter Signing</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">3</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button
                    onClick={handleClick}
                    name="counter"
                    href="#"
                    size="sm"
                    variant="primary"
                  >
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

        <Col xxl="12">
          <Card className="h-100">
            <Card.Body>
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">Chart</h5>
                </div>
                <div className="card-tools">
                  <OverlayTrigger
                    placement="left"
                    overlay={<Tooltip id="tooltip-another">Data</Tooltip>}
                  >
                    <em className="icon-hint icon ni ni-help-fill"></em>
                  </OverlayTrigger>
                </div>
              </div>
              <div className="nk-chart-analytics-session-device mt-4">
                <ChartDoughnut data={sessionsDevice} />
              </div>
              <ChartLegend.Group className="justify-content-around pt-4 flex-wrap gap g-2">
                <ChartLegend symbol="info">Pending Application</ChartLegend>
                <ChartLegend symbol="warning">Closed Application</ChartLegend>
                <ChartLegend symbol="success">
                  Awaiting for Verification
                </ChartLegend>
                <ChartLegend symbol="purple">
                  Awaiting for Sanctioning
                </ChartLegend>
                <ChartLegend symbol="secondary">
                  Awaiting for Drawing
                </ChartLegend>
                <ChartLegend symbol="black">
                  Awaiting for Counter Signing
                </ChartLegend>
              </ChartLegend.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default MyDashboard;
