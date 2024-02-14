import { Card, Form, Row, Col, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
// import DatePicker from "../../../components/Form/DatePicker";
import DatePicker from "react-datepicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function RenewReelerLicense() {
  const [data, setData] = useState({
    reelerId: "",
    status: 0,
    feeAmount: "",
    licenseRenewalDate: "",
    licenseExpiryDate: "",
  });

  const [validated, setValidated] = useState(false);

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  const [reeler, setReeler] = useState({});
  const [loading, setLoading] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  // const handleDateChange = (newDate, dateType) => {
  //   if (dateType === "renewedDate") {
  //     setData({ ...data, renewedDate: newDate });
  //   } else if (dateType === "expirationDate") {
  //     setData({ ...data, expirationDate: newDate });
  //   }
  // };

  // const YourFormComponent = ({ data, handleDateChange }) => {
    const handleRenewedDateChange = (date) => {
      // Calculate expiration date by adding 3 years to the renewed date
      const expirationDate = new Date(date);
      expirationDate.setFullYear(expirationDate.getFullYear() + 3);
  
      setData({
        ...data,
        licenseRenewalDate: date,
        licenseExpiryDate: expirationDate,
      });
    };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const withReelerid = {
      ...data,
      reelerId: reeler.reelerId,
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
    api
      .post(baseURL2 + `reeler/update-reeler-license`, withReelerid)
      .then((response) => {
        saveSuccess();
        setData({
          reelerId: "",
          status: 0,
          feeAmount: "",
          licenseRenewalDate: "",
          licenseExpiryDate: "",
        });
      })
      .catch((err) => {
        setData({});
        saveError(err.response.data.validationErrors);
      });
      setValidated(true);
    }
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: Object.values(message).join("<br>"),
    });
  };

  const [isActive, setIsActive] = useState(false);
  const display = () => {
    const reelingLicenseNumber = fruitId.reelingLicenseNumber;
    const response = api
      .get(
        baseURL2 +
          `reeler/get-by-reeling-license-number/${reelingLicenseNumber}`
      )
      .then((response) => {
        setReeler(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setReeler({});
        setLoading(false);
      });
    setIsActive((current) => !current);
  };

  const [fruitId, setFruitId] = useState({
    reelingLicenseNumber: "",
  });

  const handleFruitIdInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setFruitId({ ...fruitId, [name]: value });
  };

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };
  return (
    <Layout title="Renew Reeler License">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Renew Reeler License</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="8">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={4}>
                        FRUITS ID / LICENSE NUMBER<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          id="reelingLicenseNumber"
                          name="reelingLicenseNumber"
                          value={fruitId.reelingLicenseNumber}
                          onChange={handleFruitIdInputs}
                          type="text"
                          placeholder="Enter FRUITS ID / AADHAAR NUMBER"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        FRUITS ID is required
                      </Form.Control.Feedback>
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
                <Col lg="6">
                  <Card>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="Fee">Fee Amount<span className="text-danger">*</span></Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="Fee"
                                name="feeAmount"
                                value={data.feeAmount}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Enter Fee Amount"
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                  Fee Amount is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group">
                            <Form.Label>Renewed Date</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.licenseRenewalDate}
                                // onChange={(date) =>
                                //   handleDateChange(date, "licenseRenewalDate")
                                // }
                                onChange={(date) => handleRenewedDateChange(date)}
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="form-group">
                            <Form.Label>New License Expiration Date</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.licenseExpiryDate}
                                onChange={(date) => handleDateChange(date, "licenseExpiryDate")}
                                disabled={data.licenseRenewalDate !== null} // Disable if Renewed Date is selected
                                // onChange={(date) =>
                                //   handleDateChange(date, "licenseExpiryDate")
                                // }
    
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
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={postData}
                        > */}
                        <Button type="submit" variant="primary">
                          Save
                        </Button>
                      </li>
                      <li>
                        <Link to="#" className="btn btn-secondary border-0">
                          Cancel
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col lg="6">
                  <Card>
                    <Card.Header>Reeler License Details</Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <table className="table small table-bordered">
                            <tbody>
                              {/* <tr>
                                <td style={styles.ctstyle}>ID:</td>
                                <td>{ReelerLicense.mulberrySourceId}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Source Of Mulberry:</td>
                                <td>{SourceOfMulberry.mulberrySourceName}</td>
                              </tr> */}
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Reeling License Number:
                                </td>
                                <td>{reeler.reelingLicenseNumber}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> ReelerName:</td>
                                <td>{reeler.reelerName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Reeler Father Name:</td>
                                <td>{reeler.fatherName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Expiration Date:
                                </td>
                                <td>{reeler.licenseExpiryDate}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}> Address:</td>
                                <td>{reeler.address}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Assign To Inspect:
                                </td>
                                <td>{reeler.assignToInspectId}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                {" "}
                                  GPS Details:
                                </td>
                                <td>
                                Latitude:{reeler.chakbandiLat},
                                
                                Longitude:{reeler.chakbandiLng}
                                 </td>
                              </tr>
                              {/* <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Mahajar Details:
                                </td>
                                <td>{reeler.mahajarDetails}</td>
                              </tr> */}
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Representative/Agent name and Address:
                                </td>
                                <td>{reeler.representativeNameAddress}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Machine Type:</td>
                                <td>{reeler.machineTypeName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Date Of Machine Installation:</td>
                                <td>{reeler.dateOfMachineInstallation}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Number Of Basins/Charaka:</td>
                                <td>{reeler.numberOfBasins}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Electricity RR Number:</td>
                                <td>{reeler.electricityRrNumber}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Revenue Document:</td>
                                <td>{reeler.revenueDocument}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>District:</td>
                                <td>{reeler.districtName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Taluk:</td>
                                <td>{reeler.talukName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Village:</td>
                                <td>{reeler.villageName}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>
                                  {" "}
                                  Inspection Date:
                                </td>
                                <td>{reeler.inspectionDate}</td>
                              </tr>
                              <tr>
                                <td style={styles.ctstyle}>Receipt Date:</td>
                                <td>{reeler.receiptDate}</td>
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

export default RenewReelerLicense;
