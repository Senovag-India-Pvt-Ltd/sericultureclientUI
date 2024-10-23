import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import DataTable from "react-data-table-component";
import Block from "../../../components/Block/Block";
import { useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import { createTheme } from "react-data-table-component";
// import axios from "axios";
import api from "../../../../src/services/auth/api";
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function UpdateBankDetails() {
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const { id } = useParams();
    const [bank, setBank] = useState({
        accountImagePath: "",
        farmerId: "",
        farmerBankName: "",
        farmerBankAccountNumber: "",
        farmerBankBranchName: "",
        farmerBankIfscCode: "",
        lock : "",
      });

     

  const [bankSearch, setBankSearch] = useState({
    text: "",
    select: "mobileNumber",
  });

  const handleFarmerIdInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setBankSearch({ ...bankSearch, [name]: value });
  };

  const [validated, setValidated] = useState(false);
  const [validatedDisplay, setValidatedDisplay] = useState(false);

  const handleBankInputs = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    if (
      name === "farmerBankIfscCode" &&
      (value.length < 11 || value.length > 11)
    ) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "farmerBankIfscCode" && value.length === 11) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
    if(name === "farmerBankIfscCode"){
      setBank({ ...bank, [name]: value.toUpperCase() });
    }
    else if(name === "farmerBankBranchName"){
      setBank({ ...bank, [name]: value.toUpperCase() });
    }
    else if(name === "farmerBankName"){
      setBank({ ...bank, [name]: value.toUpperCase() });
    }
    else{
      setBank({ ...bank, [name]: value });
    } 
  };

  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
     
      api
        .post(baseURL2 + `farmer-bank-account/edit`, bank)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setBank({
            accountImagePath: "",
            farmerId: "",
            farmerBankName: "",
            farmerBankAccountNumber: "",
            farmerBankBranchName: "",
            farmerBankIfscCode: "",
            lock : "",
            });
            setValidated(false);
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


  const [farmerNumber, setFarmerNumber] = useState("");
  const [farmerDetails, setFarmerDetails] = useState({});

  const display = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();
  
      // Reset fields
      setFarmerNumber("");
      setValidatedDisplay(false);
      setFarmerDetails({});
      setBank({
        farmerBankName: "",
        farmerBankAccountNumber: "",
        farmerBankBranchName: "",
        farmerBankIfscCode: "",
        remarks: "",
        reasonMasterId: "",
      });
  
      const { text, select } = bankSearch;
      let sendData;
  
      if (select === "mobileNumber") {
        sendData = { mobileNumber: text };
      } else if (select === "fruitsId") {
        sendData = { fruitsId: text };
      } else if (select === "farmerNumber") {
        sendData = { farmerNumber: text };
      }
  
      setLoading(true);
  
      api
        .post(
          baseURLFarmer +
            `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
          sendData
        )
        .then((response) => {
          if (!response.data.content.error) {
            const farmerResponse = response.data.content.farmerResponse;
            setFarmerNumber(farmerResponse.farmerNumber);
            setFarmerDetails(farmerResponse);
            setLoading(false);
            setIsActive(true);
  
            // Set farmerId and fetch bank details
            const farmerId = farmerResponse.farmerId;
            if (farmerId) {
              getBankDetails(farmerId);
            } else {
              console.error("Farmer ID not found in response");
            }
            
          } else {
            searchError(response.data.content.error_description);
          }
        })
        .catch((err) => {
          console.error("Error fetching farmer details:", err);
          updateError(err);
        });
    }
  };

  const getBankDetails = (farmerId) => {
    // setLoading(true);
    api
      .get(baseURL2 + `farmer-bank-account/get-by-farmer-id/${farmerId}`)  // Pass farmerId here
      .then((response) => {
        setBank(response.data.content);
        // setLoading(false);
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.data &&
          err.response.data.validationErrors
        ) {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        }
      });
  };
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


  const clear = () => {
    setBank({
      accountImagePath: "",
        farmerId: "",
        farmerBankName: "",
        farmerBankAccountNumber: "",
        farmerBankBranchName: "",
        farmerBankIfscCode: "",
        lock : "",
        remark: "",
        reasonMasterId: "",
    });

  };


  createTheme(
    "solarized",
    {
      text: {
        primary: "#004b8e",
        secondary: "#2aa198",
      },
      background: {
        default: "#fff",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#d3d3d3",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

 
  // to get Market
  const [farmerBankReasonData, setFarmerBankReasonListData] = useState([]);

  const getFarmerBankReasonList = () => {
    const response = api
      .get(baseURL1 + `marketMaster/get-all`)
      .then((response) => {
        setFarmerBankReasonListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setFarmerBankReasonListData([]);
      });
  };

  useEffect(() => {
    getFarmerBankReasonList();
  }, []);

  

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    });
  };
  const saveError = (message = "Maximum users already created!") => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  const searchError = (message = "Something went wrong!") => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Details not Found",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Update Bank Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Update Bank Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
           
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n3">
        {/* <Form action="#"> */}
        <Form noValidate validated={validatedDisplay} onSubmit={display}>
          <Card>
            <Card.Body>
              <Row className="g-gs">
              <Col sm={8} lg={12}>
                  <Form.Group as={Row} className="form-group" id="fid">
                    <Form.Label column sm={1} lg={2}>
                      Search Farmer Details By
                    </Form.Label>
                    <Col sm={1} lg={2}>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="select"
                          value={bankSearch.select}
                          onChange={handleFarmerIdInputs}
                        >
                          {/* <option value="">Select</option> */}
                          <option value="mobileNumber">Mobile Number</option>
                          <option value="fruitsId">Fruits Id</option>
                          <option value="farmerNumber">Farmer Number</option>
                        </Form.Select>
                      </div>
                    </Col>

                    <Col sm={2} lg={2}>
                      <Form.Control
                        id="fruitsId"
                        name="text"
                        value={bankSearch.text}
                        onChange={handleFarmerIdInputs}
                        type="text"
                        placeholder="Search"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Field Value is Required
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2} lg={3}>
                      <Button type="submit" variant="primary">
                        Search
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>

        <Form
          noValidate
          validated={validated}
          onSubmit={postData}
        //   className="mt-2"
        >
          <Row className="g-0">
            <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  Bank Account Details
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="farmerBankName">
                          Bank Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerBankName"
                            name="farmerBankName"
                            value={bank.farmerBankName}
                            onChange={handleBankInputs}
                            type="text"
                            placeholder="Enter Bank Name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Bank Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="farmerBankBranchName">
                         Branch Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerBankBranchName"
                            name="farmerBankBranchName"
                            value={bank.farmerBankBranchName}
                            onChange={handleBankInputs}
                            type="text"
                            placeholder= "Enter Branch Name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Branch Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="farmerBankIfscCode">
                         IFSC Code
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerBankIfscCode"
                            name="farmerBankIfscCode"
                            value={bank.farmerBankIfscCode}
                            onChange={handleBankInputs}
                            type="text"
                            maxLength="11"
                            placeholder="Enter IFSC Code"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            IFSC Code is required and equals to 11 digit
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="farmerBankAccountNumber">
                          Bank Account Number
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerBankAccountNumber"
                            name="farmerBankAccountNumber"
                            value={bank.farmerBankAccountNumber}
                            onChange={handleBankInputs}
                            type="text"
                            placeholder="Enter Bank Account Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Bank Account Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                        </Col>

                        <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="farmerBankAccountNumber">
                          Remarks
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="remark"
                            name="remark"
                            value={bank.remark}
                            onChange={handleBankInputs}
                            // type="textarea"
                            as="textarea"
                            placeholder="Enter Remarks"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Remarks is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                        </Col>

                        <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Reason
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="reasonMasterId"
                          value={bank.reasonMasterId}
                          onChange={handleBankInputs}
                          onBlur={() => handleBankInputs}
                          required
                        >
                          <option value="">Select Reason</option>
                          {farmerBankReasonData.map((list) => (
                            <option
                              key={list.reasonMasterId}
                              value={list.reasonMasterId}
                            >
                              {list.reasonMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        Reason is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                  </Row>
                </Card.Body>
              </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Update Bank Details
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

export default UpdateBankDetails;
