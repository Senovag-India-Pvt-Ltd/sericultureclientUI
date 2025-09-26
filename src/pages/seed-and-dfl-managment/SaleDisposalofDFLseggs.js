import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "axios";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function SaleDisposalofDFLseggs() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    lotNumber: "",
    eggSheetNumbers: "",
    raceId: "",
    releaseDate: "",
    dateOfDisposal: "",
    expectedDateOfHatching: "",
    numberOfDflsDisposed: "",
    fruitsId: "",
    nameAndAddressOfTheFarm: "",
    ratePer100DflsPrice: "",
    userType: "farm",
    userTypeId: "",
    reason: "",
    remainingDfls: "",
    dflsType: "",
    tsc:  "",
  });

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    // Automatically populate fields when the lot number or releaseDate changes
    // debugger
    if (name === "lotNumber") {
      const selectedLot = lotListEggPreparationData.find((lot) => lot.lotNumber === value);
      if (selectedLot) {
        setData((prev) => ({
          ...prev,
          numberOfDflsDisposed: selectedLot.dflsObtained || "", // Use fallback if `dflsObtained` is null
          laidOnDate: selectedLot.laidOnDate
            ? new Date(selectedLot.laidOnDate) // Convert to Date object
            : null,
          releaseDate: selectedLot.dateOfRelease
            ? new Date(selectedLot.dateOfRelease) // Convert to Date object if available
            : null,
        }));
      }
}

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };


  // to get Lot
  const [lotListEggPreparationData, setLotListEggPreparationData] = useState([]);

  const getLotEggPreparationList = () => {
    api
      .post(baseURLSeedDfl + `sale-disposal-of-egg/get-all-lot-number-list`)
      .then((response) => {
        console.log("Lot List Data:", response.data); // Check the format of laidOnDate and dateOfRelease
        setLotListEggPreparationData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching lot list:", err);
        setLotListEggPreparationData([]);
      });
  };
  
  useEffect(() => {
    getLotEggPreparationList();
  }, []); 


  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  // const postData = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();

  //     // if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
  //     //   return;
  //     // }
  //     api
  //       .post(baseURLSeedDfl + `sale-disposal-of-egg/add-info`, data)
  //       .then((response) => {
  //         if (response.data.error) {
  //           saveError(response.data.message);
  //         } else {
  //           saveSuccess(response.data.invoice_no);
  //           setData({
  //             lotNumber: "",
  //             eggSheetNumbers: "",
  //             raceId: "",
  //             releaseDate: "",
  //             dateOfDisposal: "",
  //             expectedDateOfHatching: "",
  //             numberOfDflsDisposed: "",
  //             fruitsId: "",
  //             nameAndAddressOfTheFarm: "",
  //             ratePer100DflsPrice: "",
  //             userType: "farm",
  //             userTypeId: "",
  //           });
  //           setValidated(false);
  //         }
  //       })
  //       .catch((err) => {
  //         if (
  //           err.response &&
  //           err.response.data &&
  //           err.response.data.validationErrors
  //         ) {
  //           if (Object.keys(err.response.data.validationErrors).length > 0) {
  //             saveError(err.response.data.validationErrors);
  //           }
  //         }
  //       });
  //     setValidated(true);
  //   }
  // };

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

    // Format date fields
    const formattedReleaseDate = formatDate(data.releaseDate);
    const formattedDateOfDisposal = formatDate(data.dateOfDisposal);
    const formattedExpectedDateOfHatching = formatDate(data.expectedDateOfHatching);

    const payload = {
      ...data,
      releaseDate: formattedReleaseDate,
      dateOfDisposal: formattedDateOfDisposal,
      expectedDateOfHatching: formattedExpectedDateOfHatching,
    };

    // Check if userType is 'discard'
    if (data.userType === "discard") {
      api
        .post(baseURLSeedDfl + `sale-disposal-of-egg/discard-dfls`, payload)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            discardSuccess(response.data.invoice_no);
            // Reset form data if needed
            setData({
              lotNumber: "",
              eggSheetNumbers: "",
              raceId: "",
              releaseDate: "",
              dateOfDisposal: "",
              expectedDateOfHatching: "",
              numberOfDflsDisposed: "",
              fruitsId: "",
              nameAndAddressOfTheFarm: "",
              ratePer100DflsPrice: "",
              userType: "farm", // Reset back to default userType if needed
              userTypeId: "",
              reason: "",
              remainingDfls: "",
              dflsType: "",
              tsc:  "",
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
    } else {
      // Existing logic for adding info
      api
        .post(baseURLSeedDfl + `sale-disposal-of-egg/add-info`, payload)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.invoice_no);
            setData({
              lotNumber: "",
              eggSheetNumbers: "",
              raceId: "",
              releaseDate: "",
              dateOfDisposal: "",
              expectedDateOfHatching: "",
              numberOfDflsDisposed: "",
              fruitsId: "",
              nameAndAddressOfTheFarm: "",
              ratePer100DflsPrice: "",
              userType: "farm",
              userTypeId: "",
              reason: "",
              remainingDfls: "",
              dflsType: "",
              tsc:  "",
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
    }
    setValidated(true);
  }
};

  const clear = () => {
    setData({
      lotNumber: "",
      eggSheetNumbers: "",
      raceId: "",
      releaseDate: "",
      dateOfDisposal: "",
      expectedDateOfHatching: "",
      numberOfDflsDisposed: "",
      fruitsId: "",
      nameAndAddressOfTheFarm: "",
      ratePer100DflsPrice: "",
      userType: "farm",
      userTypeId: "",
      reason: "",
      remainingDfls: "",
      dflsType: "",
      tsc:  "",
    });
    setValidated(false);
  };

  console.log(data);

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
              const address =
                response.data.content.farmerAddressList[0].addressText;
              setData((prev) => ({
                ...prev,
                nameAndAddressOfTheFarm: `${firstName}, ${address}`,
              }));
            }
          } else {
            saveError(response.data.content.error_description);
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
    }
  };

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    api
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

  // to get User
    const [chawkiListData, setChawkiListData] = useState([]);
  
    const getChawkiList = () => {
      const response = api
        .get(baseURL2 + `tscMaster/get-all`)
        .then((response) => {
          setChawkiListData(response.data.content.tscMaster);
        })
        .catch((err) => {
          setChawkiListData([]);
        });
    };
  
    useEffect(() => {
      getChawkiList();
    }, []);
  

  // to get farm
  const [farmListData, setFarmListData] = useState([]);

  const getFarmList = () => {
    api
      .get(baseURL2 + `farmMaster/get-all`)
      .then((response) => {
        setFarmListData(response.data.content.farmMaster);
      })
      .catch((err) => {
        setFarmListData([]);
      });
  };

  useEffect(() => {
    getFarmList();
  }, []);

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

  // Display Image
  const [challan, setChallan] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  const handleChallanChange = (e) => {
    const file = e.target.files[0];
    setChallan(file);
    setData((prev) => ({ ...prev, challanUploadKey: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleChallanUpload = async (nurseryFarmerid) => {
    const parameters = `mainAndSaleOfNurseryId=${nurseryFarmerid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", challan);

      const response = await api.post(
        baseURL + `Maintenance-sale/upload-photo?${parameters}`,
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

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
      text: `${t("Invoice Number")} ${message}`,
    });
  };

  const discardSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
      text: `${t("Dfls is")} ${message}`,
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
    <Layout title={t("Sale / Disposal of DFL's(eggs)")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Sale / Disposal of DFL's(eggs)")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Sale-Disposal-of-DFLs-eggs-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Sale-Disposal-of-DFLs-eggs-list"
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
        <Card>
          <Card.Body>
            <Row lg="12" className="g-gs">
              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="farm">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="farm"
                      checked={data.userType === "farm"}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="farm">
                    {t("Farm")}
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="farmer">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="farmer"
                      checked={data.userType === "farmer"}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="farmer">
                    {t("Farmer")}
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="crc">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="crc"
                      checked={data.userType === "crc"}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="crc">
                    {t("CRC")}
                  </Form.Label>
                </Form.Group>
              </Col>

              <Col lg="1">
                <Form.Group as={Row} className="form-group" controlId="discard">
                  <Col sm={1}>
                    <Form.Check
                      type="radio"
                      name="userType"
                      value="discard"
                      checked={data.userType === "discard"}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Form.Label column sm={9} className="mt-n2" id="discard">
                    {t("Discard")}
                  </Form.Label>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {data.userType === "farmer" ? (
          <Form
            noValidate
            validated={searchValidated}
            onSubmit={search}
            className="mt-1"
          >
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
        ) : (
          ""
        )}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Block className="mt-3">
            {data.userType === "discard" ? (
                <Card>
                  <Card.Header style={{ fontWeight: "bold" }}>{t("Discard Details")}</Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>{t("Lot Number")}</Form.Label>
                          <Col>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="lotNumber"
                                value={data.lotNumber}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // required
                              >
                                <option value="">{t("Select Lot Number")}</option>
                                {lotListData && lotListData.length
                                  ? lotListData.map((list) => (
                                      <option key={list.id} value={list.lotNumber}>
                                        {list.lotNumber}
                                      </option>
                                    ))
                                  : ""}
                              </Form.Select>
                              {/* <Form.Control.Feedback type="invalid">
                                Lot Number is required
                              </Form.Control.Feedback> */}
                            </div>
                          </Col>
                        </Form.Group>
                      </Col>


                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("Remarks")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="reason"
                              name="reason"
                              value={data.reason}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Reason for Disposal")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Reason for disposal is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("Remaining DFLs")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="remainingDfls"
                              name="remainingDfls"
                              value={data.remainingDfls}
                              onChange={handleInputs}
                              type="number"
                              min="0"
                              placeholder={t("Enter Remaining DFLs")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Remaining DFLs is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                              {t("DFLs Type")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="dflsType"
                                  value={data.dflsType}
                                  onChange={handleInputs}
                                  // required
                                  // isInvalid={
                                  //   data.dflType === undefined ||
                                  //   data.dflType === "0"
                                  // }
                                >
                                  <option value="">
                                    {t("Select DFLs Type")}
                                  </option>
                                  <option value="Acid Treated">{t("Acid Treated")}</option>
                                  <option value="Hibernated">{t("Hibernated")}</option>
                                </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                                Selected Bed as per the Mean Performance is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>  

                      
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("Date of Burnt/Discarding")}
                            {/* <span className="text-danger">*</span> */}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <DatePicker
                              selected={data.dateOfDisposal}
                              onChange={(date) => handleDateChange(date, "dateOfDisposal")}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
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
              ) : (
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("Sale / Disposal of DFL's(eggs)")}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="sordfl">
                          Lot Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lotNumber"
                            name="lotNumber"
                            type="text"
                            value={data.lotNumber}
                            onChange={handleInputs}
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
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>{t("Lot Number")}</Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="lotNumber"
                              value={data.lotNumber}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // required
                            >
                              <option value="">{t("Select Lot Number")}</option>
                              {lotListData && lotListData.length
                                ? lotListData.map((list) => (
                                    <option
                                      key={list.id}
                                      value={list.lotNumber}
                                    >
                                      {list.lotNumber}
                                    </option>
                                  ))
                                : ""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {t("Lot Number is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="sordfl">
                          {t("Egg Sheet Numbers")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggSheetNumbers"
                            name="eggSheetNumbers"
                            type="text"
                            // min="1"
                            value={data.eggSheetNumbers}
                            onChange={handleInputs}
                            placeholder={t("Enter Egg Sheet Numbers")}
                            // required
                          />
                          {/* <Form.Control.Feedback type="invalid">
                            Egg Sheet Numbers is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          {t("Race")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="raceId"
                            value={data.raceId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // multiple
                            required
                            isInvalid={
                              data.raceId === undefined || data.raceId === "0"
                            }
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
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Number of DFLs disposed")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfDflsDisposed"
                            name="numberOfDflsDisposed"
                            value={data.numberOfDflsDisposed}
                            onChange={handleInputs}
                            type="text"
                            maxLength="6"
                            placeholder={t("Enter Number of DFLs disposed")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Number of DFLs disposed is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                              {t("DFLs Type")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="dflType"
                                  value={data.dflType}
                                  onChange={handleInputs}
                                  // required
                                  // isInvalid={
                                  //   data.dflType === undefined ||
                                  //   data.dflType === "0"
                                  // }
                                >
                                  <option value="">
                                    {t("Select DFLs Type")}
                                  </option>
                                  <option value="Acid Treated">{t("Acid Treated")}</option>
                                  <option value="Hibernated">{t("Hibernated")}</option>
                                </Form.Select>
                                {/* <Form.Control.Feedback type="invalid">
                                Selected Bed as per the Mean Performance is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>  

                    {data.userType === "farm" ? (
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                            {t("Farm")}
                            {/* <span className="text-danger">*</span> */}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="userTypeId"
                              value={data.userTypeId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // multiple
                              // required
                              // isInvalid={
                              //   data.userTypeId === undefined ||
                              //   data.userTypeId === "0"
                              // }
                            >
                              <option value="">{t("Select Farm")}</option>
                              {farmListData.map((list) => (
                                <option
                                  key={list.farmId}
                                  value={list.userMasterId}
                                >
                                  {list.farmName}
                                </option>
                              ))}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                              Farm is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                    ) : data.userType === "farmer" ? (
                      <>
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                            {t("Name and address farmer")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="nameAndAddressOfTheFarm"
                              name="nameAndAddressOfTheFarm"
                              value={data.nameAndAddressOfTheFarm}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Name and address farmer")}
                              required
                              readOnly
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Name and address farmer is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label>
                          {t("tsc")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="tsc"
                              value={data.tsc}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                              isInvalid={
                                data.tsc === undefined || data.tsc === "0"
                              }
                            >
                              <option value="">{t("select_tsc")}</option>
                              {chawkiListData.map((list) => (
                                <option
                                  key={list.tscMasterId}
                                  value={list.tscMasterId}
                                >
                                  {list.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                            {t("tsc_is_required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                      </>
                    ) : (
                      
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                            {t("Name and address CRC")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="nameAndAddressOfTheFarm"
                              name="nameAndAddressOfTheFarm"
                              value={data.nameAndAddressOfTheFarm}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Name and address CRC")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Name and address CRC is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    )}

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Rate per 100 DFLs Price (in Rupees)")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ratePer100DflsPrice"
                            name="ratePer100DflsPrice"
                            value={data.ratePer100DflsPrice}
                            onChange={handleInputs}
                            type="text"
                            // maxLength="3"
                            placeholder={t("Enter Rate per 100 DFLs Price")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Rate per 100 DFLs Price is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                     

                    {data.userType === "farm" ? (
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                            {t("Name and address of Farm")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="nameAndAddressOfTheFarm"
                              name="nameAndAddressOfTheFarm"
                              value={data.nameAndAddressOfTheFarm}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Name and address of Farm")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Name and address of Farm is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}
                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Release Date")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.releaseDate}
                            onChange={(date) =>
                              handleDateChange(date, "releaseDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
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
                          {t("Date of disposal")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.dateOfDisposal}
                            onChange={(date) =>
                              handleDateChange(date, "dateOfDisposal")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
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
                          {t("Expected Date of Hatching")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.expectedDateOfHatching}
                            onChange={(date) =>
                              handleDateChange(date, "expectedDateOfHatching")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
            </Block>

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

export default SaleDisposalofDFLseggs;
