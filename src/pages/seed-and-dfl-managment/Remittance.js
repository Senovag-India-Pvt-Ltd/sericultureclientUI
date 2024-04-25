import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;


function Remittance() {
  const [data, setData] = useState({
    lotNumber: "",
    raceId: "",
    numberOfDFLs: "",
    totalAmount: "",
    billNumber: "",
    bankChallanNumber: "",
    bankChallanUpload: "",
    ktc25AndDate: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

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
        .post(baseURLSeedDfl + `RemittanceOfEgg/add-info`, data)
        .then((response) => {
          // if (response.data.receiptOfDflsId) {
          //   const receiptId = response.data.receiptOfDflsId;
          //   handleReceiptUpload(receiptId);
          // }
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              lotNumber: "",
              raceId: "",
              numberOfDFLs: "",
              totalAmount: "",
              billNumber: "",
              bankChallanNumber: "",
              bankChallanUpload: "",
              ktc25AndDate: "",
            });
            // setReceiptUpload("")
            // document.getElementById("viewReceipt").value = "";
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      lotNumber: "",
      raceId: "",
      numberOfDFLs: "",
      totalAmount: "",
      billNumber: "",
      bankChallanNumber: "",
      bankChallanUpload: "",
      ktc25AndDate: "",
    });
    // setReceiptUpload("")
    // document.getElementById("viewReceipt").value = "";
  };

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    api
      .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
      .then((response) => {
        setLotListData(response.data);
      })
      .catch((err) => {
        setLotListData([]);
      });
  };

  useEffect(() => {
    getLotList();
  }, []);

 
  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  
 

  // Display Image
  const [receiptUpload, setReceiptUpload] = useState("");
 
  const handleUploadChange = (e) => {
    const file = e.target.files[0];
    setReceiptUpload(file);
    setData((prev) => ({ ...prev, viewReceipt: file.name }));
  };

  // Upload Image to S3 Bucket
  const handleReceiptUpload = async (receiptid) => {
    const parameters = `receiptOfDflsId=${receiptid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", receiptUpload);

      const response = await api.post(
        baseURLSeedDfl + `RemittaneOfEgg/upload-reciept?${parameters}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File upload response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Remittance(Eggs/PC/Others)">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
            Remittance(Eggs/PC/Others)
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/remittance-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/remittance-list"
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

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
            Remittance(Eggs/PC/Others)
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
              {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="lotNumber"
                        name="lotNumber"
                        value={data.lotNumber}
                        onChange={handleInputs}
                        maxLength="12"
                        type="text"
                        placeholder="Enter Lot Number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                    Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option
                              key={list.id}
                              value={list.lotNumber}
                            >
                              {list.lotNumber}
                            </option>
                          ))):""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Lot Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>
                
                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Race<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceId"
                          value={data.raceId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Race</option>
                          {raceListData.map((list) => (
                            <option
                              key={list.raceMasterId}
                              value={list.raceMasterId}
                            >
                              {list.raceMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Race is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Number Of DFLs 
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfDFLs"
                        name="numberOfDFLs"
                        value={data.numberOfDFLs}
                        onChange={handleInputs}
                        maxLength="4"
                        type="number"
                        placeholder="Enter Number Of DFLs"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Number Of DFLs is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      Total Amount<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="totalAmount"
                        name="totalAmount"
                        value={data.totalAmount}
                        onChange={handleInputs}
                        type="number"
                        placeholder="Enter Total Amount"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Total Amounts is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      Bill Number<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="billNumber"
                        name="billNumber"
                        value={data.billNumber}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Bill Number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Bill Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      KTC 25 and Date<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="ktc25AndDate"
                        name="ktc25AndDate"
                        value={data.ktc25AndDate}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter KTC 25 and Date"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      KTC 25 and Date is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      Bank Challan Number<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="bankChallanNumber"
                        name="bankChallanNumber"
                        value={data.bankChallanNumber}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Bank Challan Number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Bank Challan Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

               

                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="fileUploadPath">
                      Upload Bank Challan(png/jpg/pdf)(Max:2mb)
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id="viewReceipt"
                        name="viewReceipt"
                        // value={data.photoPath}
                        onChange={handleUploadChange}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group mt-3 d-flex justify-content-center">
                    {receiptUpload ? (
                      <img
                        style={{ height: "100px", width: "100px" }}
                        src={URL.createObjectURL(receiptUpload)}
                      />
                    ) : (
                      ""
                    )}
                  </Form.Group>
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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}
export default Remittance;
