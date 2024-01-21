// import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
import { Row, Col, Card, Button } from "react-bootstrap";

import Layout from "../../layout/default";

// import {
//     Image,
//   } from '../../components';

function TechnicianDashboard() {
  return (
    <Layout title="Technician Dashboard">
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
                    <h4 className="title mb-1">Total Request</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">35</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    Show
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
                    <h4 className="title mb-1">Today New Request</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">23</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    Show
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
                    <h4 className="title mb-1">Today Follow Up Request</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">10</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    Show
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
                    <h4 className="title mb-1">Lapsed Follow Up Request</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">111</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    Show
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
                    <h4 className="title mb-1">Open Request</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">3</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="/technician-request-list" size="sm" variant="primary">
                    Show
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
                    <h4 className="title mb-1">Closed Request</h4>
                    {/* <p className="small">Best seller of the month</p> */}
                  </div>
                  <div className="my-3">
                    <div className="amount h2 fw-bold text-primary ">10</div>
                    {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                  </div>
                  <Button href="#" size="sm" variant="primary">
                    Show
                  </Button>
                </div>
                {/* <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                          <Image src="/images/award/a.png" alt=""/>
                      </div> */}
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Layout>
  );
}

export default TechnicianDashboard;
