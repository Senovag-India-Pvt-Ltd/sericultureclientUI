import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "../../components/Form/DatePicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Icon,
  Select,
} from "../../components";

function SaleChawkiWorms() {
  const [isActive, setIsActive] = useState(false);
  const display = () => {
    setIsActive((current) => !current);
  };

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Sale of Chawki Worms Submitted Successfully",
      text: "Receipt Number is 1001",
    }).then(() => {
      navigate("/sale-chawki-worms-list");
    });
  };
  return (
    <Layout title="Sale of Chawki worms to Farmers">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sale of Chawki worms to Farmers</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Sale of Chawki worms to Farmers
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/sale-chawki-worms-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/sale-chawki-worms-list"
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
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="8">
                    <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Enter FRUITS ID / AADHAAR NUMBER"
                        />
                      </Col>
                      <Col sm={2}>
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
                <Col lg="12">
                  <Block className="mt-4">
                    <Card>
                      <Card.Header>Farmer Details</Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="12">
                            <table className="table small table-bordered">
                              <tbody>
                                <tr>
                                  <td style={styles.ctstyle}>Farmer Name</td>
                                  <td>Basappa</td>
                                </tr>
                                <tr>
                                  <td style={styles.ctstyle}>Father Name</td>
                                  <td>Shankarappa</td>
                                </tr>
                              </tbody>
                            </table>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                </Col>
                <Col lg="12">
                  <Card>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="sordfl">
                              Source of DFLs
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="sordfl"
                                type="text"
                                placeholder="Enter Source of DFLs"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="racedfl">
                              Race of DFLs
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="racedfl"
                                type="text"
                                placeholder="Enter Race of DFLs"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="nodfl">
                              Number of DFL’s
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="nodfl"
                                type="text"
                                placeholder="Enter Number of DFL’s"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="lotnorsp">
                              Lot Number (of the RSP)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="lotnorsp"
                                type="text"
                                placeholder="Enter Lot Number (of the RSP)"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="lotnocrc">
                              Lot Number (CRC)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="lotnocrc"
                                type="text"
                                placeholder="Enter Lot Number (CRC)"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="tsc">TSC</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="tsc"
                                type="text"
                                placeholder="Enter TSC"
                              />
                            </div>
                          </Form.Group>
                          <Form.Group className="form-group mt-3">
                            <Form.Label>Sold after</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select Sold after</option>
                                <option value="1">1st Moult</option>
                                <option value="2">2nd Moult</option>
                                <option value="3">3rd Moult</option>
                              </Select>
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="rpdfl">
                              Rate per 100 DFLs
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="rpdfl"
                                type="text"
                                placeholder="Enter Rate per 100 DFLs"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="price">
                              Price (in Rupees)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="price"
                                type="text"
                                placeholder="Enter Price (in Rupees)"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label>Dispatch date</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                      <h3 className="mt-5">Address</h3>
                      <Row className="g-gs">
                        <Col lg="4">
                          <Form.Group className="form-group mt-3">
                            <Form.Label>State</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select State</option>
                                <option value="1">Andra Pradesh</option>
                                <option value="2">Karnataka</option>
                                <option value="3">Kerala</option>
                                <option value="4">Tamil Nadu</option>
                                <option value="5">Telangana</option>
                              </Select>
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label>District</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select District</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                              </Select>
                            </div>
                          </Form.Group>
                          <Form.Group className="form-group mt-3">
                            <Form.Label>Taluk</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select Taluk</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                              </Select>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="4">
                          <Form.Group className="form-group mt-3">
                            <Form.Label>Hobli</Form.Label>
                            <div className="form-control-wrap">
                              <Select removeItemButton>
                                <option value="">Select Hobli</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                              </Select>
                            </div>
                          </Form.Group>
                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="village">Village</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="village"
                                type="text"
                                placeholder="Enter Village Name"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="address">Address</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                as="textarea"
                                id="address"
                                type="text"
                                placeholder="Enter Address"
                                rows="2"
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="4">
                          <Form.Group className="form-group mt-3">
                            <Form.Label htmlFor="pin">Pin Code</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="pin"
                                type="text"
                                placeholder="Enter Pin Code"
                              />
                            </div>
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
                          variant="primary"
                          onClick={() => saveSuccess()}
                        >
                          Save
                        </Button>
                      </li>
                      <li>
                        <Link to="#" className="btn btn-secondary border-0">
                          Clear
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default SaleChawkiWorms;
