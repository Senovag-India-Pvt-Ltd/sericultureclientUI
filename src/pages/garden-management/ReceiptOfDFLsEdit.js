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
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function ReceiptOfDFLsEdit() {
  const { t } = useTranslation();
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
        .post(baseURL2 + `Receipt/update-info`, {
          ...data,
          raceId: data.raceOfDfls,
        })
        .then((response) => {
          // const receiptOfDflsId = response.data.receiptOfDflsId;
          // if (receiptOfDflsId) {
          //   handleReceiptUpload(receiptOfDflsId);
          // }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              id: "",
              raceOfDfls: "",
              laidOnDate: "",
              generationNumberId: "",
              lineNameId: "",
              hatchingDate: "",
            });
            //         setReceiptUpload("")
            // document.getElementById("viewReceipt").value = "";
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
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
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      raceOfDfls: "",
      laidOnDate: "",
      generationNumberId: "",
      lineNameId: "",
      hatchingDate: "",
    });
  };

  // to get Line Year
  const [lineYearListData, setLineYearListData] = useState([]);

  const getLineYearList = () => {
    const response = api
      .get(baseURL + `lineNameMaster/get-all`)
      .then((response) => {
        setLineYearListData(response.data.content.lineNameMaster);
      })
      .catch((err) => {
        setLineYearListData([]);
      });
  };

  useEffect(() => {
    getLineYearList();
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
        // if (response.data.viewReceipt) {
        //   getUploadReceipt(response.data.viewReceipt);
        // }
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
  //    const [receiptUpload, setReceiptUpload] = useState("");

  //    const handleUploadChange = (e) => {
  //      const file = e.target.files[0];
  //      setReceiptUpload(file);
  //      setData((prev) => ({ ...prev, viewReceipt: file.name }));
  //    };

  //    // Upload Image to S3 Bucket
  //    const handleReceiptUpload = async (receiptid) => {
  //      const parameters = `receiptOfDflsId=${receiptid}`;
  //      try {
  //        const formData = new FormData();
  //        formData.append("multipartFile", receiptUpload);

  //        const response = await api.post(
  //          baseURL2 + `Receipt/upload-reciept?${parameters}`,
  //          formData,
  //          {
  //            headers: {
  //              "Content-Type": "multipart/form-data",
  //            },
  //          }
  //        );
  //        console.log("File upload response:", response.data);
  //      } catch (error) {
  //        console.error("Error uploading file:", error);
  //      }
  //    };

  // // To get Photo from S3 Bucket
  // const [selectedUploadReceipt, setSelectedUploadReceipt] = useState(null);

  // const getUploadReceipt = async (file) => {
  //   const parameters = `fileName=${file}`;
  //   try {
  //     const response = await api.get(
  //       baseURL2 + `v1/api/s3/download?${parameters}`,
  //       {
  //         responseType: "arraybuffer",
  //       }
  //     );
  //     const blob = new Blob([response.data]);
  //     const url = URL.createObjectURL(blob);
  //     setSelectedUploadReceipt(url);
  //   } catch (error) {
  //     console.error("Error fetching file:", error);
  //   }
  // };

  const navigate = useNavigate();

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: t("Updated successfully"),
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
      title: t("Attempt was not successful"),
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: t("Something went wrong!"),
    }).then(() => navigate("#"));
  };
  return (
    <Layout title={t("Edit Receipt Of DFLs")}>
      <style>{editReceiptOfDFLsStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Edit Receipt Of DFLs")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/receipt-of-dfls-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/receipt-of-dfls-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card className="sh-section-card">
            <Card.Header className="sh-section-header">
              <Icon name="package" />
              <span>{t("Edit Receipt Of DFLs From The Grainage")}</span>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <h1 className="d-flex justify-content-center align-items-center">
                  {t("Loading...")}
                </h1>
              ) : (
                <Row className="g-gs">
                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Line Name")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="lineNameId"
                            value={data.lineNameId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // required
                          >
                            <option value="">{t("Select Line Details")}</option>
                            {lineYearListData && lineYearListData.length
                              ? lineYearListData.map((list) => (
                                  <option
                                    key={list.lineNameId}
                                    value={list.lineNameId}
                                  >
                                    {list.lineName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          {/* <Form.Control.Feedback type="invalid">
                              Line Details is required
                            </Form.Control.Feedback> */}
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Race")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="raceOfDfls"
                            value={data.raceOfDfls}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                          >
                            <option value="">{t("Select Race")}</option>
                            {raceListData && raceListData.length
                              ? raceListData.map((list) => (
                                  <option
                                    key={list.raceMasterId}
                                    value={list.raceMasterId}
                                  >
                                    {list.raceMasterName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Race is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Generation Number")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="generationNumberId"
                            value={data.generationNumberId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // required
                          >
                            <option value="">
                              {t("Select Generation Number")}
                            </option>
                            {generationListData && generationListData.length
                              ? generationListData.map((list) => (
                                  <option
                                    key={list.generationNumberId}
                                    value={list.generationNumberId}
                                  >
                                    {list.generationNumber}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          {/* <Form.Control.Feedback type="invalid">
                              Generation Number is required
                            </Form.Control.Feedback> */}
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Laid on Date")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        {/* {isDataLaidDate && ( */}
                        <DatePicker
                          selected={
                            data.laidOnDate ? new Date(data.laidOnDate) : null
                          }
                          onChange={(date) =>
                            handleDateChange(date, "laidOnDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          //   maxDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          required
                        />
                        {/* )} */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                        {t("Hatching Date")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        {/* {isDataLaidDate && ( */}
                        <DatePicker
                          selected={
                            data.hatchingDate
                              ? new Date(data.hatchingDate)
                              : null
                          }
                          onChange={(date) =>
                            handleDateChange(date, "hatchingDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          //   maxDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          required
                        />
                        {/* )} */}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          <div className="gap-col sh-actions-bar">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                {/* <Button type="button" variant="primary" onClick={postData}> */}
                <Button type="submit" variant="primary" className="sh-save-btn">
                  <Icon name="save" />
                  <span>{t("Update")}</span>
                </Button>
              </li>
              <li>
                <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                  <Icon name="cross" />
                  <span>{t("Cancel")}</span>
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

const editReceiptOfDFLsStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-section-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #d9e2ec;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 3px rgba(59, 141, 214, 0.15);
  }
  .sh-actions-bar {
    margin-top: 8px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
  }
`;

export default ReceiptOfDFLsEdit;
