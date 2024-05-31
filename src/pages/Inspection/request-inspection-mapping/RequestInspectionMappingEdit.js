import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function RequestInspectionMappingEdit() {
  // Fetching id from URL params
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  let name, value;

  // Function to handle input changes
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isData = !!data.date;

  // Function to handle checkbox change
  const handleCheckBox = (e) => {
    setData((prev) => ({
      ...prev,
      isDefault: e.target.checked,
    }));
  };

  // HTTP header configuration
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // Function to submit form data
  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURLMasterData + `tsBudget/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            clear();
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        setFinancialyearListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // Function to clear form data
  const clear = () => {
    setData({
      financialYearMasterId: "",
      date: "",
      centralBudget: "",
      stateBudget: "",
      amount: "",
    });
    setValidated(false);
  };

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLMasterData + `tsBudget/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        let message = "An error occurred while fetching data.";

        // Check if err.response is defined and not null
        if (err.response && err.response.data) {
          // Check if err.response.data.errorMessages is an array and has length > 0
          if (
            Array.isArray(err.response.data.errorMessages) &&
            err.response.data.errorMessages.length > 0
          ) {
            // Access the first error message from the array
            message = err.response.data.errorMessages[0].message[0].message;
          }
        }

        // Display error message
        editError(message);
        setData({});
        setLoading(false);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    getIdList();
  }, [id]);

  // Navigation hook
  const navigate = useNavigate();

  // Function to handle success alert
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
    }).then(() => navigate("/seriui/requestinspectionmapping-list"));
  };

  // Function to handle error alert
  const updateError = (message) => {
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

  // Function to handle edit error
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };

  return (
    <Layout title="Request Inspection Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Request Inspection Mapping</Block.Title>
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
                        Request Type<span className="text-danger">*</span>
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
                          <option value="">Select Request Type</option>
                          <option value="1">Farmer</option>
                          <option value="2">Reeler</option>
                          <option value="3">Reeler License Renewal</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Request Type is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
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
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="requesttypename">
                        Request Type Name<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="requesttypename"
                          name="requesttypename"
                          value={data.requesttypename}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Request Type Name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Request Type Name is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  {/* <Col lg="6">
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
                </Col> */}
                  {/* <Col lg="6">
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
                </Col> */}
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

export default RequestInspectionMappingEdit;
