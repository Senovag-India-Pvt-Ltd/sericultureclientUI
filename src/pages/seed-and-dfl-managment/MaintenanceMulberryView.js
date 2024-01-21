import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Form, Button } from "react-bootstrap";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import MaintenanceMulberryFarmDatas from "../../store/maintenance-mulberry-farm/MaintenanceMulberryFarmData";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function MaintenanceMulberryFarmView() {
  const navigate = useNavigate();

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Status updated Successfully",
      // text: "Receipt Number is 1001",
    }).then(() => {
      navigate("#");
    });
  };
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    ml: {
      marginLeft: "-200px",
    },
  };

  const { id } = useParams();
  const [data] = useState(MaintenanceMulberryFarmDatas);
  const [MaintenanceMulberryFarm, setMaintenanceMulberryFarm] = useState(
    data[0]
  );

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setMaintenanceMulberryFarm(findUser);
  }, [id, data]);

  return (
    <Layout title="Maintenance of Mulberry Farm View" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance of Mulberry Farm View
            </Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/maintenance-mulberry-farm-list">
                    Maintenance of Mulberry Farm List
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Maintenance of Mulberry Farm View
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/maintenance-mulberry-farm-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/maintenance-mulberry-farm-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Card>
          <Card.Header>Farm Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="6">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Plot Number:</td>
                      <td>{MaintenanceMulberryFarm.plotnumber}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        Types Of Mulberry Variety:
                      </td>
                      <td>{MaintenanceMulberryFarm.typesofmulberryvariety}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col lg="6">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Area Under Each Variety:</td>
                      <td>{MaintenanceMulberryFarm.arundereachvariety}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Pruning Date:</td>
                      <td>{MaintenanceMulberryFarm.pruningdate}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>

      <Block className="mt-4">
        <Card>
          <Card.Header>Maintenance of Mulberry Farm</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <thead>
                    <tr style={{ backgroundColor: "#f1f2f7" }}>
                      {/* <th></th> */}
                      <th>Action</th>
                      <th>Scheduled Date</th>
                      <th>Is Action Completed?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        Fertilizer Application Date:
                      </td>
                      <td>12/11/23</td>
                      <td>
                        <div className="form-control-wrap">
                          <Row>
                            <Col>
                              <Form.Check
                                type="radio"
                                id="yes"
                                name="appdate"
                                label="Yes"
                                value="yes"
                                // onChange={handleChange}
                                // checked={selected === "yes"}
                              />
                            </Col>
                            <Col style={styles.ml}>
                              <Form.Check
                                type="radio"
                                id="no"
                                value="no"
                                name="appdate"
                                defaultChecked
                                // onChange={handleChange}
                                // checked={selected === "no"}
                                label="No"
                              />
                            </Col>
                          </Row>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> FYM Application Date:</td>
                      <td>12/11/23</td>
                      <td>
                        <div className="form-control-wrap">
                          <Row>
                            <Col>
                              <Form.Check
                                type="radio"
                                id="yes"
                                name="fym"
                                label="Yes"
                                value="yes"
                                // onChange={handleChange}
                                // checked={selected === "yes"}
                              />
                            </Col>
                            <Col style={styles.ml}>
                              <Form.Check
                                type="radio"
                                id="no"
                                value="no"
                                name="fym"
                                defaultChecked
                                // onChange={handleChange}
                                // checked={selected === "no"}
                                label="No"
                              />
                            </Col>
                          </Row>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Irrigation Date:</td>
                      <td>12/11/23</td>
                      <td>
                        <div className="form-control-wrap">
                          <Row>
                            <Col>
                              <Form.Check
                                type="radio"
                                id="yes"
                                name="irrigation"
                                label="Yes"
                                value="yes"
                                // onChange={handleChange}
                                // checked={selected === "yes"}
                              />
                            </Col>
                            <Col style={styles.ml}>
                              <Form.Check
                                type="radio"
                                id="no"
                                value="no"
                                name="irrigation"
                                defaultChecked
                                // onChange={handleChange}
                                // checked={selected === "no"}
                                label="No"
                              />
                            </Col>
                          </Row>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Date of Brushing:</td>
                      <td>12/11/23</td>
                      <td>
                        <div className="form-control-wrap">
                          <Row>
                            <Col>
                              <Form.Check
                                type="radio"
                                id="yes"
                                name="brushingdate"
                                label="Yes"
                                value="yes"
                                // onChange={handleChange}
                                // checked={selected === "yes"}
                              />
                            </Col>
                            <Col style={styles.ml}>
                              <Form.Check
                                type="radio"
                                id="no"
                                value="no"
                                name="brushingdate"
                                defaultChecked
                                // onChange={handleChange}
                                // checked={selected === "no"}
                                label="No"
                              />
                            </Col>
                          </Row>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> First Spray Date:</td>
                      <td>12/11/23</td>
                      <td>
                        <div className="form-control-wrap">
                          <Row>
                            <Col>
                              <Form.Check
                                type="radio"
                                id="yes"
                                name="firstspray"
                                label="Yes"
                                value="yes"
                                // onChange={handleChange}
                                // checked={selected === "yes"}
                              />
                            </Col>
                            <Col style={styles.ml}>
                              <Form.Check
                                type="radio"
                                id="no"
                                value="no"
                                name="firstspray"
                                defaultChecked
                                // onChange={handleChange}
                                // checked={selected === "no"}
                                label="No"
                              />
                            </Col>
                          </Row>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Second Spray Date:</td>
                      <td>12/11/23</td>
                      <td>
                        <div className="form-control-wrap">
                          <Row>
                            <Col>
                              <Form.Check
                                type="radio"
                                id="yes"
                                name="secondspray"
                                label="Yes"
                                value="yes"
                                // onChange={handleChange}
                                // checked={selected === "yes"}
                              />
                            </Col>
                            <Col style={styles.ml}>
                              <Form.Check
                                type="radio"
                                id="no"
                                value="no"
                                name="secondspray"
                                defaultChecked
                                // onChange={handleChange}
                                // checked={selected === "no"}
                                label="No"
                              />
                            </Col>
                          </Row>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
      <div className="gap-col mt-3">
        <ul className="d-flex align-items-center justify-content-center gap g-3">
          <li>
            <Button
              type="button"
              variant="primary"
              onClick={() => saveSuccess()}
            >
              Save
            </Button>
          </li>
          <li>
            <Link
              to="#"
              className="btn btn-secondary border-0"
            >
              Clear
            </Link>
          </li>
        </ul>
      </div>
    </Layout>
  );
}

export default MaintenanceMulberryFarmView;
