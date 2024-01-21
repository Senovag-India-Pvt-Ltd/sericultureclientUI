import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
// import DatePicker from "../../components/Form/DatePicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { Icon, Select } from "../../components";

function MaintenanceMulberryFarm() {
  // variables for each field
  const [startDate, setStartDate] = useState(new Date());
  const [formValues, setFormValues] = useState({
    plotNumber: "",
    typeOfMulberry: "",
    area: "",
    pruning: "",
    remark: "",
  });
  const navigate = useNavigate();
  const saveSuccess = (e) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("/maintenance-mulberry-farm");
    });
  };

  const clear = () => {
    setFormValues({
      plotNumber: "",
      typeOfMulberry: "",
      area: "",
      pruning: "",
      remark: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormValues({
      plotNumber: "",
      typeOfMulberry: "",
      area: "",
      pruning: "",
      remark: "",
    });
  };
  return (
    <Layout title="Maintenance of mulberry farm" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Maintenance of mulberry farm</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Maintenance of mulberry farm
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
        <Form onSubmit={handleSubmit}>
          <Row className="g-3 ">
            {/* <Card>
              <Card.Body>
                <Row className="g-gs">
                 

                  <Col lg="4">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fid"
                          type="text"
                          placeholder="FRUITS ID / AADHAAR NUMBER"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card> */}
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="plotno">Plot Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          value={formValues.plotNumber}
                          id="plotno"
                          type="text"
                          placeholder="Enter Plot Number"
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              plotNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="tmv">
                        Types of mulberry Variety
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Select
                          removeItemButton
                          value={formValues.typeOfMulberry}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              typeOfMulberry: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="Mulberry Silk">Mulberry Silk</option>
                          <option value="Eri Silk">Eri Silk</option>
                          <option value="Muga Silk">Muga Silk</option>
                          <option value="Tasar Silk">Tasar Silk</option>
                        </Select>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="auev">
                        Area Under each Variety
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="auev"
                          type="text"
                          placeholder="Enter Area Under each Variety"
                          value={formValues.area}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              area: e.target.value,
                            })
                          }
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label>Pruning Date</Form.Label>
                      <div className="form-control-wrap">
                        {/* <DatePicker selected={formValues.remark}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              remark: e.target.value,
                            })
                          } /> */}
                        <DatePicker
                          selected={formValues.pruning}
                          onChange={(date) =>
                            setFormValues({
                              ...formValues,
                              pruning: date,
                            })
                          }
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="remarks">Remarks</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="remarks"
                          type="text"
                          placeholder="Enter Remarks"
                          value={formValues.remark}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              remark: e.target.value,
                            })
                          }
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button
                    type="submit"
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
                    onClick={() => clear()}
                  >
                    Clear
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceMulberryFarm;
