// import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
import { Row, Col, Card, Button } from 'react-bootstrap';

import Layout from '../../layout/default';

// import {
//     Image, 
//   } from '../../components';


function ProcurementDashboard() {
    return (
        <Layout title="Procurement">
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
                                        <h4 className="title mb-1">Total Sale</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary">&#8377;35,89,46,466</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">View Sales</Button>
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
                                        <h4 className="title mb-1">Today New Call</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary">23</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
                                        <h4 className="title mb-1">Today Follow Up</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary ">10</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
                                        <h4 className="title mb-1">Lapsed Follow Up</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary ">111</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
                                        <h4 className="title mb-1">Today Demo</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary">100</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
                                        <h4 className="title mb-1">Today Meetings</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary ">27</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
                                        <h4 className="title mb-1">Lapsed Meetings</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary ">5</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
                                        <h4 className="title mb-1">Today Quotation Follow Up</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary ">28</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
                                        <h4 className="title mb-1">Lapsed Quotation Follow Up</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary ">35</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
                                        <h4 className="title mb-1">Pending Transfer Lead Acceptance</h4>
                                        {/* <p className="small">Best seller of the month</p> */}
                                    </div>
                                    <div className="my-3">
                                        <div className="amount h2 fw-bold text-primary ">84</div>
                                        {/* <div className="smaller">You have done 69.5% more sales today.</div> */}
                                    </div>
                                    <Button href="#" size="sm" variant="primary">Show</Button>
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
    )
}

export default ProcurementDashboard;
