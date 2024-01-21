import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Select,
} from "../../components";

import React, { useState } from "react";

function RejectBid() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const navigate = useNavigate();

  const rejectSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Rejected successfully",
      text: "Lot-002 has been Rejected!",
    }).then(() => {
      navigate("#");
    });
  };

  const [isActive, setIsActive] = useState(false);
  const display = () => {
    setIsActive((current) => !current);
  };

  return (
    <Layout title="Reject Bid">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reject Bid</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Reject Bid
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
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <Form.Group
                            as={Row}
                            className="form-group mt-3"
                            controlId="source"
                          >
                            <Form.Label column sm={4}>
                              Reason of Rejection
                            </Form.Label>
                            <Col sm={8}>
                              <div className="form-control-wrap">
                                <Select removeItemButton>
                                  <option value="">Select Reason</option>
                                  <option value="1">
                                    Cancellation Reason 1
                                  </option>
                                  <option value="2">
                                    Cancellation Reason 2
                                  </option>
                                  <option value="3">
                                    Cancellation Reason 3
                                  </option>
                                </Select>
                              </div>
                            </Col>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                  <div className="gap-col mt-4">
                    <ul className="d-flex align-items-center justify-content-center gap g-3">
                      <li>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => rejectSuccess()}
                        >
                          Reject Lot
                        </Button>
                      </li>
                      {/* <li>
                            <Link to="#" className="btn btn-secondary border-0">
                              Cancel
                            </Link>
                          </li> */}
                    </ul>
                  </div>
                </Col>

                <Col lg="6">
                  <Card>
                    <Card.Header>Lot Details</Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <table className="table small table-bordered">
                            <tbody>
                              <tr>
                                <td style={styles.ctstyle}> Lot No:</td>
                                <td>Lot-002</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Bid Amount:</td>
                                <td>&#8377;12000</td>
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

export default RejectBid;
