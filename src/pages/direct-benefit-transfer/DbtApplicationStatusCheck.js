import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { useState } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function DbtApplicationStatusCheck() {
  // Translation
  const { t } = useTranslation();
  const [data, setData] = useState({
    title: "",
    code: "",
    nameInKannada: "",
  });

  const [validated, setValidated] = useState(false);

//   let name, value;
//   const handleInputs = (e) => {
//     name = e.target.name;
//     value = e.target.value;
//     setData({ ...data, [name]: value });
//   };

  const [searchData, setSearchData] = useState({
    text: "",
    select: "arn",
  });
  const handleSearchInputs = (e) => {
    let { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const [applicationList, setApplicationList] = useState([]);

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      const { text, select } = searchData;
      let sendData;
      if (select === "mobileNo") {
        sendData = {
          mobileNo: text,
        };
      }
      if (select === "fid") {
        sendData = {
          fid: text,
        };
      }
      if (select === "arn") {
        sendData = {
          arn: text,
        };
      }

      api
        .post(baseURLDBT + `service/getApplicationStatus`,{},{params: sendData})
        .then((response) => {
          setApplicationList(response.data.content);
          setValidated(false);
        })
        .catch((err) => {
          if (
            err.response &&
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setSearchData({
      text: "",
      select: "arn",
    });
    setValidated(false);
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    });
  };
  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };
  return (
    // <Layout title="Caste">
    <div className="p-5">
      <Block.Head className="d-flex justify-content-center">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> {t("Check Application Status")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 d-flex justify-content-center">
            <Col lg="3">
              <Card>
                <Card.Body>
                  {/* <h3>Farmers Details</h3> */}
                  <Row className="g-gs">
                    <Col lg="6">
                      <div className="form-control-wrap">
                        <Form.Label htmlFor="title">
                          {t("Search By")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="select"
                          value={searchData.select}
                          onChange={handleSearchInputs}
                        >
                          {/* <option value="">Select</option> */}
                          <option value="mobileNo">{t("Mobile Number")}</option>
                          <option value="fid">{t("Fruits Id")}</option>
                          <option value="arn">{t("ARN")}</option>
                        </Form.Select>
                      </div>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="title">
                          {t("Mobile Number/ ARN / FID")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="title"
                            name="text"
                            value={searchData.text}
                            onChange={handleSearchInputs}
                            type="text"
                            placeholder={t("Enter Mbl No/Arn/Fid")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Title Name is required.")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="gap-col mt-2">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    <Button type="submit" variant="primary">
                      {t("check status")}
                    </Button>
                  </li>
                  <li>
                    <Button type="button" variant="secondary" onClick={clear}>
                      {t("cancel")}
                    </Button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Form>

        <Row className="g-gs">
          {applicationList && applicationList.length ? (
            <div
            //  className={isActive ? "" : "d-none"}
            >
              <Row className="d-flex justify-content-end mt-2">
                <Col sm={2}>
                  {/* <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      onClick={generateDtrReport}
                    >
                      Print
                    </Button> */}
                </Col>
              </Row>

              <Row className="g-gs pt-2 d-flex justify-content-center">
                <Col lg="8">
                  <Card>
                    {/* <Card.Header className="d-flex flex-column justify-content-center align-items-center">
                      <div style={{fontSize:"150%",fontWeight:"bold"}}>{t("Government Cocoon Market")}:<span style={{color:"#a1ffe5"}}> {marketData.marketMasterName} </span> </div>
                    </Card.Header> */}
                    <Card.Body className="overflow-auto">
                      <table
                        className="table table-striped table-bordered"
                        style={{ backgroundColor: "white", borderRadius: "10px" }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಕ್ರಮ ಸಂಖ್ಯೆ */}
                              {t("SL No")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಲಾಟ್ ಸಂಖ್ಯೆ */}
                              {t("ARN No.")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ರೈತರ ವಿವರಗಳು */}
                              {t("Status")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ತೂಕ */}
                              {t("Scheme Amount")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಗೂಡಿನ  ವಯಸ್ಸು  */}
                              {t("Component Type")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಬಿಡ್ ಮೊತ್ತ */}
                              {t("Scheme Name")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಬಿಡ್ ಮೊತ್ತ */}
                              {t("Sub Scheme Name")}
                            </th>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                              // colSpan="2"
                            >
                              {/* ಬಿಡ್ ಮೊತ್ತ */}
                              {t("Component Name")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicationList.map((list, i) => (
                            <tr key={i}>
                              <td>{i+1}</td>
                              <td>{list.arn}</td>
                              <td className="green-font">{list.applicationStatus}</td>
                              <td>{list.schemeAmount}</td>
                              <td>{list.componentType}</td>
                              <td>{list.schemeName}</td>
                              <td>{list.subSchemeName}</td>
                              <td>{list.componentName}</td>
                              {/* <td>{parseFloat(list.farmerAmount.toFixed(2))}</td>
                            <td>
                              {parseFloat(
                                (
                                  list.farmerMarketFee + list.reelerMarketFee
                                ).toFixed(2)
                              )}
                            </td>
                            <td>{parseFloat(list.reelerAmount.toFixed(2))}</td> */}
                              {/* <td>{list.reelerName}</td>
                            <td>{list.bankName}</td>
                            <td>{list.ifscCode}</td> */}
                              {/* <td>{list.accountNumber}</td>
                            <td>{list.auctionDate}</td>
                            <td>{list.raceName}</td>
                            <td>{list.raceName}</td>
                            <td>{list.raceName}</td> */}
                            </tr>
                          ))}
                          <tr>
                          {/* <td></td>
                          <td></td>
                          <td></td>
                          <td style={{fontWeight:"bold"}}>{t("Total")}:</td>
                          <td>{total?total:0}</td>
                          <td></td>
                          <td></td> */}
                          </tr>
                        </tbody>
                      </table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
        </Row>
      </Block>
    </div>
    // </Layout>
  );
}

export default DbtApplicationStatusCheck;
