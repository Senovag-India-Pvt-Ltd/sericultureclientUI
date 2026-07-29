import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceOfEggsAtColdStorageEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const { t } = useTranslation();

  // let name, value;
  // const handleInputs = (e) => {
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  // };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Automatically populate fields when the lot number changes
    if (name === "lotNumber") {
      const selectedLot = lotListData.find((lot) => lot.lotNumber === value);
      if (selectedLot) {
        setData((prev) => ({
          ...prev,
          numberOfDFLs: selectedLot.dflsObtained || "", // Use fallback if `dflsObtained` is null
          laidOnDate: selectedLot.laidOnDate
            ? new Date(selectedLot.laidOnDate) // Convert to Date object
            : null,
        }));
      }
    }
  };


  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDataReleaseSet = !!data.dateOfRelease;
  const isDataColdSet = !!data.laidOnDate;
  const isDataLaidDate = !!data.storageDate;

  // const formatDate = (date) => {
  //   if (!date) return ""; // Handle null or undefined dates
  //   return (
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     date.getDate().toString().padStart(2, "0")
  //   );
  // };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
    //   const formattedReleaseDate = formatDate(data.dateOfRelease);
    // const formattedDateOfDisposal = formatDate(data.laidOnDate);
    // const formattedExpectedDateOfHatching = formatDate(data.dateOfColdStore);

    // const payload = {
    //   ...data,
    //   dateOfRelease: formattedReleaseDate,
    //   laidOnDate: formattedDateOfDisposal,
    //   dateOfColdStore: formattedExpectedDateOfHatching,
    // };
      api
        .post(baseURLSeedDfl + `EggStorage/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            // setData({
            //   lotNumber: "",
            //   numberOfDFLs: "",
            //   dateOfColdStore: "",
            //   laidOnDate: "",
            //   dateOfRelease: "",
            //   incubationDetails: "",
            // });
             clear();
            setIsSubmitting(true); 
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
      lotNumber: "",
      numberOfDFLs: "",
      dateOfColdStore: "",
      laidOnDate: "",
      dateOfRelease: "",
      incubationDetails: "",
    });
  };



  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `EggStorage/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
        
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

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    const response = api
      .post(baseURLSeedDfl + `EggStorage/get-all-lot-number-list`)
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

   // to get Lot
   const [lotListEggPreparationData, setLotListEggPreparationData] = useState([]);

   const getLotEggPreparationList = () => {
     const response = api
       .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
       .then((response) => {
        setLotListEggPreparationData(response.data);
       })
       .catch((err) => {
        setLotListEggPreparationData([]);
       });
   };
 
   useEffect(() => {
     getLotEggPreparationList();
   }, []);

   
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
    <Layout title={t("Edit Maintenance Of Eggs At Cold Storage")}>
      <style>{maintenanceEggsColdStorageEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Edit Maintenance Of Eggs At Cold Storage")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/maintenance-of-eggs-at-cold-storage-List"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/maintenance-of-eggs-at-cold-storage-List"
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
              <span>{t("Edit Maintenance Of Eggs At Cold Storage")}</span>
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
                    {t("Lot Number")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Lot Number")}</option>
                          {lotListEggPreparationData && lotListEggPreparationData.length?(lotListEggPreparationData.map((list) => (
                            <option
                              key={list.id}
                              value={list.lotNumber}
                            >
                              {list.lotNumber}
                            </option>
                          ))):""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Lot Number is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>
                {/* <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Lot Number<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="lotNumber"
                                  value={data.lotNumber}
                                  onChange={handleInputs}
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
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      {t("Number Of DFLs")} 
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfDFLs"
                        name="numberOfDFLs"
                        value={data.numberOfDFLs}
                        onChange={handleInputs}
                        maxLength="8"
                        type="text"
                        placeholder={t("Enter Number Of DFLs received")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Number Of DFLs is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Incubation Details")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                   id="incubationDetails"
                                  name="incubationDetails"
                                  value={data.incubationDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Enter Incubation Details")}
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Date of Cold storage")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="Date of Cold Storage">
                              {/* { isDataColdSet && ( */}
                                <DatePicker
                                  selected={data.dateOfColdStore
                                  ? new Date(data.dateOfColdStore)
                                  : null}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfColdStore")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
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
                      {t("Laid On Date")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                    {/* {isDataLaidDate && ( */}
                      <DatePicker
                        selected={data.laidOnDate
                        ? new Date(data.laidOnDate)
                        :null}
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
                      {/* )} */}
                    </div>
                  </Form.Group>
                </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Date of release")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                              {/* {isDataReleaseSet && ( */}
                                <DatePicker
                                  selected={data.dateOfRelease
                                  ?new Date(data.dateOfRelease)
                                  :null}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfRelease")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
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

const maintenanceEggsColdStorageEditStyles = `
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
    margin-bottom: 20px;
  }
  .sh-section-card .card-body {
    padding: 20px !important;
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
  .sh-actions-bar {
    margin-top: 6px;
  }
  .sh-save-btn,
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    font-weight: 600;
    padding: 8px 22px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-save-btn:hover {
    box-shadow: 0 6px 16px rgba(30, 103, 168, 0.35);
    transform: translateY(-1px);
  }
`;

export default MaintenanceOfEggsAtColdStorageEdit;
