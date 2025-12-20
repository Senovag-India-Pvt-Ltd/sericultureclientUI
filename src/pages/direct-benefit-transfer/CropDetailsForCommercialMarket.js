import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable, { createTheme } from "react-data-table-component";

import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";

import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function CropDetailsForCommercialMarket() {
  const [data, setData] = useState({
    raceMasterId: "",
    grainageId: "",
    receiptNo: "",
    transactionDate: "",
    lotNo: "",
    noOfDfls: "",
    dateOfBrushing: "",
    dateOfDistributionOfChawkiWorms: "",
    chawkiPercentage: "",
    spunOnDate: "",
    quantityOfCocoonsProduced: "",
    averageYield: "",
    marketId: "",
    biddingSlipNo: "",
    cocoonRatePerKg: "",
    fruitsId: "",
    spunOnToDate: "",
    crcName: "",
    externalUnitRegistrationId: "",
    eligibleQuantityCocoonsTransacted: "",
    farmerName: "",
  });

  const { t } = useTranslation();

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);

//   let name, value;
//   const handleInputs = (e) => {
//     name = e.target.name;
//     value = e.target.value;
//     setData({ ...data, [name]: value });

//     if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
//       e.target.classList.add("is-invalid");
//       e.target.classList.remove("is-valid");
//     } else if (name === "fruitsId" && value.length === 16) {
//       e.target.classList.remove("is-invalid");
//       e.target.classList.add("is-valid");
//     }
//   };
let name, value;

const handleInputs = (e) => {
  name = e.target.name;
  value = e.target.value;

  // Update field value first
  const updatedData = { ...data, [name]: value };

  // Auto-calculate Average Yield = (quantity / dfl) * 100
  if (
    (name === "quantityOfCocoonsProduced" || name === "noOfDfls") &&
    updatedData.quantityOfCocoonsProduced &&
    updatedData.noOfDfls &&
    !isNaN(updatedData.quantityOfCocoonsProduced) &&
    !isNaN(updatedData.noOfDfls) &&
    Number(updatedData.noOfDfls) !== 0
  ) {
    const qty = Number(updatedData.quantityOfCocoonsProduced);
    const dfl = Number(updatedData.noOfDfls);

    updatedData.averageYield = ((qty / dfl) * 100).toFixed(2);  
  }

  setData(updatedData);

  // Fruits ID Validation (keeping your existing logic)
  if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
    e.target.classList.add("is-invalid");
    e.target.classList.remove("is-valid");
  } else if (name === "fruitsId" && value.length === 16) {
    e.target.classList.remove("is-invalid");
    e.target.classList.add("is-valid");
  }
};


  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const formatDate = (date) => {
    if (!date) return ""; // Handle null or undefined dates
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }

    const formattedSpunDate = formatDate(data.spunOnDate);
    const formattedSpunToDate = formatDate(data.spunOnToDate);
    const formattedTransactionDate = formatDate(data.transactionDate);
    const formattedBrushingDate = formatDate(data.dateOfBrushing);
    const formattedChawkiDistribution = formatDate(data.dateOfDistributionOfChawkiWorms);

    const payload = {
      ...data,
      spunOnDate: formattedSpunDate,
      spunOnToDate:formattedSpunToDate,
      transactionDate: formattedTransactionDate,
      dateOfBrushing: formattedBrushingDate,
      dateOfDistributionOfChawkiWorms: formattedChawkiDistribution,
    };
      api
        .post(baseURL + `cropDetailsCommercialMarket/add`, payload)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
            raceMasterId: "",
            grainageId: "",
            receiptNo: "",
            transactionDate: "",
            lotNo: "",
            noOfDfls: "",
            dateOfBrushing: "",
            dateOfDistributionOfChawkiWorms: "",
            chawkiPercentage: "",
            spunOnDate: "",
            quantityOfCocoonsProduced: "",
            averageYield: "",
            marketId: "",
            biddingSlipNo: "",
            cocoonRatePerKg: "",
            fruitsId: "",
            spunOnToDate: "",
            crcName: "",
            externalUnitRegistrationId: "",
            eligibleQuantityCocoonsTransacted: "",
            farmerName: "",
            });
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
      raceMasterId: "",
    grainageId: "",
    receiptNo: "",
    transactionDate: "",
    lotNo: "",
    noOfDfls: "",
    dateOfBrushing: "",
    dateOfDistributionOfChawkiWorms: "",
    chawkiPercentage: "",
    spunOnDate: "",
    quantityOfCocoonsProduced: "",
    averageYield: "",
    marketId: "",
    biddingSlipNo: "",
    cocoonRatePerKg: "",
    fruitsId: "",
    spunOnToDate: "",
    crcName: "",
    externalUnitRegistrationId: "",
    eligibleQuantityCocoonsTransacted: "",
    farmerName: "",
    });
    // setLot({
    //   lotNumber: "",
    //   raceName: "",
    //   generationDetails: "",
    //   laidOnDate: "",
    // });
  };

  const [searchValidated, setSearchValidated] = useState(false);

  const search = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        setSearchValidated(true);
      } else {
        event.preventDefault();
        if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
          return;
        }
        api
          .post(
            baseURLFarmer +
              `farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number`,
            { fruitsId: data.fruitsId }
          )
          .then((response) => {
            console.log(response);
            if (!response.data.content.error) {
              if (response.data.content.farmerResponse) {
                const firstName = response.data.content.farmerResponse.firstName;
                const fatherName =
                  response.data.content.farmerResponse.fatherName;
                setData((prev) => ({
                  ...prev,
                  farmerName: firstName,
                  fatherName: fatherName,
                }));
              }
            } else {
              saveError(response.data.content.error_description);
            }
          })
          .catch((err) => {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          });
      }
    };

     // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL2 + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);

  // to get Race
      const [externalListData, setExternalListData] = useState([]);
    
      const getExternalList = (_id) => {
        const response = api
          .get(baseURLFarmer + `external-unit-registration/get-all`)
          .then((response) => {
            setExternalListData(response.data.content.externalUnitRegistration);
            // setLoading(false);
            if (response.data.content.error) {
                setExternalListData([]);
            }
          })
          .catch((err) => {
            setExternalListData([]);
            // setLoading(false);
          });
      };
    
      useEffect(() => {
            getExternalList();
      }, []);

      const licenseOptions = externalListData?.map((list) => ({
          value: list.externalUnitRegistrationId,
          label: `${list.licenseNumber} (${list.name})`,
        })); 


  
  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL2 + `grainageMaster/get-all`)
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

  // // to get Lot
  // const [lotListData, setLotListData] = useState([]);

  // const getLotList = () => {
  //   const response = api
  //     .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/get-all-lot-number-list`)
  //     .then((response) => {
  //       setLotListData(response.data);
  //     })
  //     .catch((err) => {
  //       setLotListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getLotList();
  // }, []);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL2 + `raceMaster/get-all`)
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

 

   // to get Source
   const [sourceListData, setSourceListData] = useState([]);

   const getSourceList = () => {
     const response = api
       .get(baseURL2 + `sourceMaster/get-all`)
       .then((response) => {
         setSourceListData(response.data.content.sourceMaster);
       })
       .catch((err) => {
        setSourceListData([]);
       });
   };
 
   useEffect(() => {
     getSourceList();
   }, []);

   // to get Generation Number
   const [generationListData, setGenerationListData] = useState([]);

   const getGenerationList = () => {
     const response = api
       .get(baseURL2 + `generationNumberMaster/get-all`)
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

   // to get Line Year
   const [lineYearListData, setLineYearListData] = useState([]);

   const getLineYearList = () => {
     const response = api
       .get(baseURL2 + `lineNameMaster/get-all`)
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

  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
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
      title: t("Attempt was not successful"),
      html: errorMessage,
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title={t("Crop Details-Commercial Market")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Crop Details-Commercial Market")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/crop-details-commercial-market-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/crop-details-commercial-market-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
              {/* <Form action="#"> */}
              <Form noValidate validated={searchValidated} onSubmit={search}>
                <Card>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="12">
                        <Form.Group as={Row} className="form-group" controlId="fid">
                          <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                            {t("FRUITS ID")}<span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={4}>
                            <Form.Control
                              type="fruitsId"
                              name="fruitsId"
                              value={data.fruitsId}
                              onChange={handleInputs}
                              placeholder={t("Enter FRUITS ID")}
                              required
                              maxLength="16"
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Fruits ID Should Contain 16 digits")}
                            </Form.Control.Feedback>
                          </Col>
                          <Col sm={2}>
                            <Button type="submit" variant="primary">
                              {t("Search")}
                            </Button>
                          </Col>
                          {/* <Col sm={2}>
                              <Button
                                type="button"
                                variant="primary"
                                href="https://fruits.karnataka.gov.in/OnlineUserLogin.aspx"
                                target="_blank"
                                // onClick={search}
                              >
                                Generate FRUITS ID
                              </Button>
                            </Col> */}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Form>
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-0">
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                {t("Crop Details-Commercial Market")}
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Farmer’s name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerName"
                            name="farmerName"
                            type="text"
                            value={data.farmerName}
                            onChange={handleInputs}
                            placeholder={t("Enter Farmer’s name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Farmer Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="4">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="sordfl">
                              {t("Name Of The CRC")}<span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="crcName"
                                name="crcName"
                                type="text"
                                value={data.crcName}
                                onChange={handleInputs}
                                placeholder={t("Enter Name Of The CRC")}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {t("Name Of The CRC is required")}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col> */}

                        <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("RSP/CRC License Number")}
                            {/* <span className="text-danger">*</span> */}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <ReactSelect
                              options={licenseOptions}
                              placeholder={t("Select License Number")}
                              isSearchable
                              menuPlacement="auto"
                              value={licenseOptions?.find(
                                (opt) => opt.value === data.externalUnitRegistrationId
                              )}
                              onChange={(selectedOption) => {
                                setData((prev) => ({
                                  ...prev,
                                  externalUnitRegistrationId: selectedOption?.value || "",
                                }));
                              }}
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              {t("License Number is required")}
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>

                     <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                        <Form.Label>
                            {t("Race")}<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                            <div className="form-control-wrap">
                            <Form.Select
                                name="raceMasterId"
                                value={data.raceMasterId}
                                onChange={handleInputs}
                                required
                            >
                                <option value="">{t("Select Race")}</option>
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
                                {t("Race is required")}
                            </Form.Control.Feedback>
                            </div>
                        </Col>
                        </Form.Group>
                    </Col>


                <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Grainage")}<span className="text-danger">*</span>
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
                              <option value="">{t("Select Grainage")}</option>
                              {grainageListData && grainageListData.length?(grainageListData.map((list) => (
                                <option
                                  key={list.grainageMasterId}
                                  value={list.grainageMasterId}
                                >
                                  {list.grainageMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {t("Grainage is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                     <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Receipt No")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="receiptNo"
                            name="receiptNo"
                            value={data.receiptNo}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Receipt No")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Lot No")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lotNo"
                            name="lotNo"
                            value={data.lotNo}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Lot No")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Lot No is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Chawki Percentage")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="chawkiPercentage"
                            name="chawkiPercentage"
                            value={data.chawkiPercentage}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Chawki Percentage")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Quantity Of Cocoons Produced")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantityOfCocoonsProduced"
                            name="quantityOfCocoonsProduced"
                            value={data.quantityOfCocoonsProduced}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Quantity Of Cocoons Produced")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Eligible Quantity Of Cocoons Produced")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eligibleQuantityCocoonsTransacted"
                            name="eligibleQuantityCocoonsTransacted"
                            value={data.eligibleQuantityCocoonsTransacted}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Eligible Quantity Of Cocoons Produced")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("No Of DFL's")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="noOfDfls"
                            name="noOfDfls"
                            value={data.noOfDfls}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("No Of DFL's")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Average Yield")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="averageYield"
                            name="averageYield"
                            value={data.averageYield}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Average Yield")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                     <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                            <Form.Label>
                            {t("Market")}<span className="text-danger">*</span>
                            </Form.Label>
                            <Col>
                            <div className="form-control-wrap">
                                <Form.Select
                                name="marketId"
                                value={data.marketId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                >
                                <option value="">{t("Select Market")}</option>
                                {marketListData.map((list) => (
                                    <option
                                    key={list.marketMasterId}
                                    value={list.marketMasterId}
                                    >
                                    {list.marketMasterName}
                                    </option>
                                ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                {t("Market is required")}
                                </Form.Control.Feedback>
                            </div>
                            </Col>
                        </Form.Group>
                        </Col>

                        <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Bidding Slip Lot No")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="biddingSlipNo"
                            name="biddingSlipNo"
                            value={data.biddingSlipNo}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Bidding Slip Lot No")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Bidding Slip Lot No is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Cocoon Rate Per Kg")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="cocoonRatePerKg"
                            name="cocoonRatePerKg"
                            value={data.cocoonRatePerKg}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Bidding Slip No")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                          Screening Batch No is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Transaction Date")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.transactionDate}
                            onChange={(date) =>
                            handleDateChange(date, "transactionDate")
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
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Brushing Date")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.dateOfBrushing}
                            onChange={(date) =>
                            handleDateChange(date, "dateOfBrushing")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            // maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                        />
                        </div>
                    </Form.Group>
                    </Col>


                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Date Of Chawki Distribution")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.dateOfDistributionOfChawkiWorms}
                            onChange={(date) =>
                            handleDateChange(date, "dateOfDistributionOfChawkiWorms")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            // maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                        />
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Spun on Date(From)")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.spunOnDate}
                            onChange={(date) =>
                            handleDateChange(date, "spunOnDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            // maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                        />
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Spun on Date(To)")}
                        {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="Date of seed cocoon supply">
                        <DatePicker
                            selected={data.spunOnToDate}
                            onChange={(date) =>
                            handleDateChange(date, "spunOnToDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            // maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                        />
                        </div>
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
                    {t("Save")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    {t("Cancel")}
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

export default CropDetailsForCommercialMarket;
