import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function ReceiptOfDFLsEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDataLaidSet = !!data.laidOnDate;
  const isDataDFLsSet = !!data.laidOnDate;

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
        .post(baseURL2 + `Receipt/update-info`, data)
        .then((response) => {
            const receiptOfDflsId = response.data.receiptOfDflsId;
            if (receiptOfDflsId) {
              handleReceiptUpload(receiptOfDflsId);
            }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              raceOfDfls: "",
              raceId: "",
              grainageId: "",
              generationDetailsId: "",
              laidOnDate: "",
              grainage: "",
              lotNumber: "",
              numberOfDFLsReceived: "",
              dflsRecDate: "",
              invoiceDetails: "",
              generationDetails: "",
              viewReceipt: "",
            });
            setReceiptUpload("")
    document.getElementById("viewReceipt").value = "";
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      raceOfDfls: "",
      raceId: "",
      grainageId: "",
      generationDetailsId: "",
      laidOnDate: "",
      grainage: "",
      lotNumber: "",
      numberOfDFLsReceived: "",
      dflsRecDate: "",
      invoiceDetails: "",
      generationDetails: "",
      viewReceipt: "",
    });
    setReceiptUpload("")
    document.getElementById("viewReceipt").value = "";
  };

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

  // to get Race
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL + `grainageMaster/get-all`)
      .then((response) => {
        setGrainageListData(response.data.content.grainageMaster);
      })
      .catch((err) => {
        setGrainageListData([]);
      });
  };

  useEffect(() => {
    getGrainageList();
  }, []);

  // to get Grainage
  const [generationListData, setGenerationListData] = useState([]);

  const getGenerationList = () => {
    const response = api
      .get(baseURL + `generationNumberMaster/get-all`)
      .then((response) => {
        setGenerationListData(response.data.content.generationNumberMaster);
      })
      .catch((err) => {
        setGenerationListData([]);
      });
  };

  useEffect(() => {
    getGenerationList();
  }, []);

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Receipt/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
        if (response.data.viewReceipt) {
          getUploadReceipt(response.data.viewReceipt);
        }
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

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
         baseURL2 + `Receipt/upload-reciept?${parameters}`,
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
 
// To get Photo from S3 Bucket
const [selectedUploadReceipt, setSelectedUploadReceipt] = useState(null);

const getUploadReceipt = async (file) => {
  const parameters = `fileName=${file}`;
  try {
    const response = await api.get(
      baseURL2 + `v1/api/s3/download?${parameters}`,
      {
        responseType: "arraybuffer",
      }
    );
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    setSelectedUploadReceipt(url);
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

  const navigate = useNavigate();

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      text: message,
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };
  return (
    <Layout title="Edit Receipt Of DFLs">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Receipt Of DFLs</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/receipt-of-dfls-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/receipt-of-dfls-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Edit Receipt Of DFLs From The Grainage
            </Card.Header>
            <Card.Body>
              {loading ? (
                <h1 className="d-flex justify-content-center align-items-center">
                  Loading...
                </h1>
              ) : (
                <Row className="g-gs">
                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>Race</Form.Label>
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
                      <Form.Label>
                        Grainage<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="grainageId"
                            value={data.grainageId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                          >
                            <option value="">Select Grainage</option>
                            {grainageListData.map((list) => (
                              <option
                                key={list.grainageMasterId}
                                value={list.grainageMasterId}
                              >
                                {list.grainageMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Grainage is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
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
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="numberOfDFLsReceived">
                        Number Of DFLs received
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="numberOfDFLsReceived"
                          name="numberOfDFLsReceived"
                          value={data.numberOfDFLsReceived}
                          onChange={handleInputs}
                          maxLength="4"
                          type="text"
                          placeholder="Enter Number Of DFLs received"
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
                        Invoice No<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="invoiceDetails"
                          name="invoiceDetails"
                          value={data.invoiceDetails}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Invoice No"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Invoice Details is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Generation Details<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="generationDetailsId"
                            value={data.generationDetailsId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                          >
                            <option value="">Select Generation Details</option>
                            {generationListData.map((list) => (
                              <option
                                key={list.generationNumberId}
                                value={list.generationNumberId}
                              >
                                {list.generationNumber}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Generation Details is required
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        Laid On Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        {isDataLaidSet && (
                          <DatePicker
                            selected={new Date(data.laidOnDate)}
                            onChange={(date) =>
                              handleDateChange(date, "laidOnDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        DFLs received Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        {isDataDFLsSet && (
                          <DatePicker
                            selected={new Date(data.dflsRecDate)}
                            onChange={(date) =>
                              handleDateChange(date, "dflsRecDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="fileUploadPath">
                        Upload Receipt(pdf/png/pdf)(Max:2mb)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="viewReceipt"
                            name="viewReceipt"
                            // value={data.fileUploadPath}
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
                          selectedUploadReceipt && (
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedUploadReceipt}
                              alt="Selected File"
                            />
                          )
                        )}
                      </Form.Group>
                    </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          <div className="gap-col">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="button" variant="primary" onClick={postData}> */}
                <Button type="submit" variant="primary">
                  Update
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

export default ReceiptOfDFLsEdit;
