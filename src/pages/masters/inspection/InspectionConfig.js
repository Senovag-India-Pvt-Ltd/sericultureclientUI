import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function InspectionConfig() {
  const [data, setData] = useState({
    documentMasterId: [],
    inspectionType: "",
    isRequired: true,
    gpsRequired: false,
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleCheckBox = (e) => {
    // setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
    setData((prev) => ({
      ...prev,
      gpsRequired: e.target.checked,
    }));
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURLTargetSetting + `inspectionTypeDocument/add`, {
          isRequired: data.isRequired,
          documentMasterId: data.documentMasterId,
          inspectionType: data.inspectionType,
        })
        .then((response) => {
          if (response.data.content.error) {
            // saveError();
            saveRaceError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });

      api
        .post(baseURLTargetSetting + `inspectionTypeGps/add`, {
          isRequired: data.isRequired,
          inspectionType: data.inspectionType,
        })
        .then((response) => {
          if (response.data.content.error) {
            // saveError();
            saveRaceError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
          }
        })
        .catch((err) => {
          if (
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
    setData({
      documentMasterId: [],
      inspectionType: "",
      isRequired: true,
      gpsRequired: false,
    });
    setValidated(false);
  };

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get Document List
  const [documentListData, setDocumentListData] = useState([]);

  const getDocumentList = () => {
    const response = api
      .get(baseURL + `documentMaster/get-all`)
      .then((response) => {
        setDocumentListData(response.data.content.documentMaster);
      })
      .catch((err) => {
        setDocumentListData([]);
      });
  };

  useEffect(() => {
    getDocumentList();
  }, []);

  // to get Inspection
  // const [getByInspectionListData, setGetByInspectionListData] = useState([]);

  const getInspectionList = (_id) => {
    api
      .get(
        baseURLTargetSetting +
          `inspectionTypeDocument/get-by-inspection-type/${_id}`
      )
      .then((response) => {
        // setGetByInspectionListData(response.data.content.marketMaster);
        if (response.data.content.error) {
          if (response.data.content.docMasters === null)
            setData((prev) => ({ ...prev, documentMasterId: [] }));
        } else {
          setData((prev) => ({
            ...prev,
            documentMasterId: response.data.content.docMasters,
          }));
        }
      })
      .catch((err) => {
        // setGetByInspectionListData([]);
      });
  };

  useEffect(() => {
    if (data.inspectionType) {
      getInspectionList(data.inspectionType);
    }
  }, [data.inspectionType]);

  console.log(data);

  const handleCheckboxChange = (id) => {
    // console.log(id);
    // setData((prev) => ({ ...prev, documentList: [...prev.documentList, id] }));
    setData((prev) => {
      if (prev.documentMasterId.includes(id)) {
        return {
          ...prev,
          documentMasterId: prev.documentMasterId.filter((item) => item !== id),
        };
      } else {
        return {
          ...prev,
          documentMasterId: [...prev.documentMasterId, id],
        };
      }
    });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const saveRaceError = (message) => {
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
    <Layout title="Inspection Config">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Inspection Config</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/race-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/race-list"
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

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-n2">
                      <Form.Label>
                        Inspection Type<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="inspectionType"
                          value={data.inspectionType}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.inspectionType === undefined ||
                            data.inspectionType === "0"
                          }
                        >
                          <option value="">Select Inspection Type</option>
                          <option value="1">Farmer</option>
                          <option value="2">Reeler</option>
                          <option value="3">Reeler License Renewal</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Inspection Type is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          id="gpsRequired"
                          checked={data.gpsRequired}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={11} className="mt-n2 ms-n4">
                        Is GPS Inspection Required?
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Label>Select Documents</Form.Label>
                    {documentListData.map((doc) => (
                      <div key={doc.documentMasterId}>
                        <Form.Group as={Row} className="form-group mt-1">
                          <Col sm={1}>
                            <Form.Check
                              type="checkbox"
                              id="required"
                              checked={data.documentMasterId.includes(
                                doc.documentMasterId
                              )}
                              onChange={() =>
                                handleCheckboxChange(doc.documentMasterId)
                              }
                            />
                          </Col>
                          <Form.Label column sm={11} className="mt-n2 ms-n4">
                            {doc.documentMasterName}
                          </Form.Label>
                        </Form.Group>
                      </div>
                    ))}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default InspectionConfig;
