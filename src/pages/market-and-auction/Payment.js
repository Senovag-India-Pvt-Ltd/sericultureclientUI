import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import React, { useState } from "react";

function Payment() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  //   const navigate = useNavigate();

  //   const rejectSuccess = () => {
  //     Swal.fire({
  //       icon: "success",
  //       title: "Rejected successfully",
  //       text: "Lot-002 has been Rejected!",
  //     }).then(() => {
  //       navigate("#");
  //     });
  //   };

  const [isActive, setIsActive] = useState(false);
  const display = () => {
    setIsActive((current) => !current);
  };

  return (
    <Layout title="Payment">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Payment</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Payment
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
                  <Col lg="8">
                    <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={2}>
                        Lot Number
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Enter Lot Number"
                        />
                      </Col>
                      <Col sm={4}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        >
                          Search
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className={isActive ? "" : "d-none"}>
              <Row className="g-gs">
                <Col lg="6">
                  <Card>
                    <div
                      className="table-responsive"
                      // style={{ paddingBottom: "30px" }}
                    >
                      <table className="table small">
                        <thead>
                          <tr style={{ backgroundColor: "#f1f2f7" }}>
                            {/* <th></th> */}
                            <th>Lot No.</th>
                            <th>Bid Amount</th>
                            <th>Kilo Gram(Kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>LOT001</td>
                            <td>&#8377;12000</td>
                            <td>10Kg</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </Col>

                <Col lg="6">
                  <Card>
                    <Card.Header>Farmer Details</Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <table className="table small table-bordered">
                            <tbody>
                              <tr>
                                <td style={styles.ctstyle}> Farmer Id:</td>
                                <td>fid01</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Farmer Name:</td>
                                <td>Ganesh</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Father's/Husband's Name:
                                </td>
                                <td>Shakaraiah</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Gender:</td>
                                <td>Male</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Village:</td>
                                <td>Kinnigolli</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> State:</td>
                                <td>Karnataka</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> TSC:</td>
                                <td>TSC(1)</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Phone Number:</td>
                                <td>8098456317</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Aadhaar Number:</td>
                                <td>7894 4567 3215</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> EPIC Number:</td>
                                <td>RDY788942</td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default Payment;
