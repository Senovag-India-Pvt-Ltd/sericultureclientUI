import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { Select } from "../../components";

function ReelerTransactionReport() {
  const display = () => {
    // Define the display function logic here
    console.log("Displaying data");
    // Add your logic here
  };
  return (
    <Layout title="Reeler Transaction Reports" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reeler Transaction Reports</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Reeler Transaction Reports
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="4">
                    <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fromdate"
                    >
                      <Form.Label column sm={4} className="me-n5">
                        From
                      </Form.Label>
                      <Col sm={8} className="ms-n5">
                        <div className="form-control-wrap">
                          <DatePicker />
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="todate"
                    >
                      <Form.Label column sm={4} className="me-n5">
                        To
                      </Form.Label>
                      <Col sm={8} className="ms-n5">
                        <div className="form-control-wrap">
                          <DatePicker />
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <div className="d-flex align-items-center justify-content-center mt-3">
                    <Button type="button" variant="primary" onClick={display}>
                      Generate Report
                    </Button>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ReelerTransactionReport;
