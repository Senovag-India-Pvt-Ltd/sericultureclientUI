// import { Row, Col, Card, Button, Dropdown, Table, Badge } from 'react-bootstrap';
import { Row, Col, Card } from "react-bootstrap";
import { Colors } from "../../utilities/index";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";

// import {
//     Image,
//   } from '../../components';

function AlertsDashboard() {
  const navigate = useNavigate();
  const clickCard = () => {
    navigate("/seriui/maintenance-mulberry-farm-list");
  };
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
    <Layout title="Alert Dashboard">
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
          <Card
            className="h-100"
            style={{ cursor: "pointer" }}
            onClick={clickCard}
          >
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div>
                  <div className="card-title">
                    <h4 className="title mb-1">Maintenance of Mulberry Farm</h4>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {" "}
                      99+
                      <span className="visually-hidden">unread messages</span>
                    </span>
                  </div>
                  {/* <div className="my-3">
                    <div className="amount h2 fw-bold text-primary">35</div>
                    <div className="smaller">You have done 69.5% more sales today.</div>
                  </div> */}
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

export default AlertsDashboard;
