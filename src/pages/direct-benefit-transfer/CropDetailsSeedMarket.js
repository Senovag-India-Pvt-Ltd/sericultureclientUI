import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "../../components/AppDataTable";
import { createTheme } from "react-data-table-component";

import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";

import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function CropDetailsForSeedMarket() {
  const [data, setData] = useState({
    raceMasterId: "",
    grainageId: "",
    bonusReceiptNo: "",
    lotNo: "",
    noOfDfls: "",
    dateOfBrushing: "",
    dateOfDistributionOfChawkiWorms: "",
    chawkiPercentage: "",
    spunOnDate: "",
    spunOnToDate: "",
    noOfCocoonsPerKg: "",
    quantityOfSeedCocoons: "",
    averageYield: "",
    fruitsId: "",
    crcBillNo: "",
    chawkiReceiptNo: "",
    cocoonTransactedForReelingInNos: "",
    cocoonTransactedForReelingInKg: "",
    cocoonTransactedForSeedInNos: "",
    cocoonTransactedForSeedInKg: "",
    externalUnitRegistrationId: "",
    farmerName: "",
  });

  const [transactionList, setTransactionList] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState({
    marketId: "",
    marketMasterName: "",
    biddingSlipNo: "",
    biddingSlipNumber: "",
    cocoonRatePerKg: "",
    reelingRate: "",
    transactionDate: "",
    quantityOfSeedCocoons: "",
  });

  const { t } = useTranslation();

  const [validated, setValidated] = useState(false);
  const [validatedDesignationDetails, setValidatedDesignationDetails] = useState(false);
  const [validatedDesignationDetailsEdit, setValidatedDesignationDetailsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [transactionDetailsId, setMapComponentId] = useState();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    const updatedData = { ...data, [name]: value };
    setData(updatedData);

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  useEffect(() => {
    if (!transactionList || transactionList.length === 0) {
      setData((prev) => ({ ...prev, quantityOfSeedCocoons: "", averageYield: "" }));
      return;
    }

    const totalQuantity = transactionList.reduce(
      (sum, item) => sum + Number(item.quantityOfSeedCocoons || 0),
      0
    );

    let avgYield = "";
    if (data.noOfDfls && Number(data.noOfDfls) !== 0) {
      avgYield = ((totalQuantity / Number(data.noOfDfls)) * 100).toFixed(2);
    }

    setData((prev) => ({
      ...prev,
      quantityOfSeedCocoons: totalQuantity,
      averageYield: avgYield,
    }));
  }, [transactionList, data.noOfDfls]);

  const handleMapInputs = (e) => {
    const { name, value } = e.target;
    setTransactionDetails({ ...transactionDetails, [name]: value });
  };

  const handleMarketOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTransactionDetails({
      ...transactionDetails,
      marketId: chooseId,
      marketMasterName: chooseName,
    });
  };

  const handleAdd = (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidatedDesignationDetails(true);
      return;
    }

    setTransactionList((prev) => [...prev, transactionDetails]);
    setTransactionDetails({
      marketId: "",
      marketMasterName: "",
      biddingSlipNo: "",
      biddingSlipNumber: "",
      cocoonRatePerKg: "",
      transactionDate: "",
      quantityOfSeedCocoons: "",
    });
    setShowModal(false);
    setValidatedDesignationDetails(false);
  };

  const handleDelete = (i) => {
    setTransactionList((prev) => prev.filter((_, place) => place !== i));
  };

  const handleGet = (i) => {
    setTransactionDetails(transactionList[i]);
    setShowModal2(true);
    setMapComponentId(i);
  };

  const handleUpdate = (e, i, changes) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidatedDesignationDetailsEdit(true);
      return;
    }

    setTransactionList((prev) =>
      prev.map((item, ix) => (ix === i ? { ...item, ...changes } : item))
    );
    setShowModal2(false);
    setValidatedDesignationDetailsEdit(false);
    setTransactionDetails({
      marketId: "",
      marketMasterName: "",
      biddingSlipNo: "",
      biddingSlipNumber: "",
      cocoonRatePerKg: "",
      transactionDate: "",
      quantityOfSeedCocoons: "",
    });
  };

  const designationClear = () => {
    setTransactionDetails({
      marketId: "",
      marketMasterName: "",
      biddingSlipNo: "",
      biddingSlipNumber: "",
      cocoonRatePerKg: "",
      transactionDate: "",
      quantityOfSeedCocoons: "",
    });
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const formatDate = (date) => {
    if (!date) return "";
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
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (transactionList.length === 0) {
      Swal.fire({
        icon: "warning",
        title: t("Transaction Details Required"),
        text: t("Please add at least one transaction detail before saving."),
        confirmButtonText: t("OK"),
      });
      return;
    }

    if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
      return;
    }

    const formattedSpunDate = formatDate(data.spunOnDate);
    const formattedSpunToDate = formatDate(data.spunOnToDate);
    const formattedBrushingDate = formatDate(data.dateOfBrushing);
    const formattedChawkiDistribution = formatDate(data.dateOfDistributionOfChawkiWorms);

    const payload = {
      ...data,
      spunOnDate: formattedSpunDate,
      spunOnToDate: formattedSpunToDate,
      dateOfBrushing: formattedBrushingDate,
      dateOfDistributionOfChawkiWorms: formattedChawkiDistribution,
      cropDetailsSeedMarketDetailsRequests: transactionList.map((t) => ({
        marketId: t.marketId,
        biddingSlipNo: t.biddingSlipNo,
        biddingSlipNumber: t.biddingSlipNumber,
        cocoonRatePerKg: t.cocoonRatePerKg,
        reelingRate: t.reelingRate,
        transactionDate: formatDate(t.transactionDate),
        quantityOfSeedCocoons: t.quantityOfSeedCocoons,
      })),
    };

    api
      .post(baseURL + `cropDetailsSeedMarket/add`, payload)
      .then((response) => {
        if (response.data.error) {
          saveError(response.data.message);
        } else {
          saveSuccess();
          setData({
            raceMasterId: "",
            grainageId: "",
            bonusReceiptNo: "",
            lotNo: "",
            noOfDfls: "",
            dateOfBrushing: "",
            dateOfDistributionOfChawkiWorms: "",
            chawkiPercentage: "",
            spunOnDate: "",
            spunOnToDate: "",
            noOfCocoonsPerKg: "",
            quantityOfSeedCocoons: "",
            averageYield: "",
            fruitsId: "",
            crcBillNo: "",
            chawkiReceiptNo: "",
            cocoonTransactedForReelingInNos: "",
            cocoonTransactedForReelingInKg: "",
            cocoonTransactedForSeedInNos: "",
            cocoonTransactedForSeedInKg: "",
            externalUnitRegistrationId: "",
            farmerName: "",
          });
          setTransactionList([]);
          setValidated(false);
        }
      })
      .catch((err) => {
        if (Object.keys(err.response.data.validationErrors).length > 0) {
          saveError(err.response.data.validationErrors);
        }
      });
    setValidated(true);
  };

  const clear = () => {
    setData({
      raceMasterId: "",
      grainageId: "",
      bonusReceiptNo: "",
      lotNo: "",
      noOfDfls: "",
      dateOfBrushing: "",
      dateOfDistributionOfChawkiWorms: "",
      chawkiPercentage: "",
      spunOnDate: "",
      spunOnToDate: "",
      noOfCocoonsPerKg: "",
      quantityOfSeedCocoons: "",
      averageYield: "",
      fruitsId: "",
      crcBillNo: "",
      chawkiReceiptNo: "",
      cocoonTransactedForReelingInNos: "",
      cocoonTransactedForReelingInKg: "",
      cocoonTransactedForSeedInNos: "",
      cocoonTransactedForSeedInKg: "",
      externalUnitRegistrationId: "",
      farmerName: "",
    });
    setTransactionList([]);
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
          if (!response.data.content.error) {
            if (response.data.content.farmerResponse) {
              const firstName = response.data.content.farmerResponse.firstName;
              const fatherName = response.data.content.farmerResponse.fatherName;
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
    api
      .get(baseURL2 + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch(() => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);

  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    api
      .get(baseURL2 + `grainageMaster/get-all`)
      .then((response) => {
        setGrainageListData(response.data.content.grainageMaster);
      })
      .catch(() => {
        setGrainageListData([]);
      });
  };

  useEffect(() => {
    getGrainageList();
  }, []);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    api
      .get(baseURL2 + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch(() => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  // to get External Unit
  const [externalListData, setExternalListData] = useState([]);

  const getExternalList = () => {
    api
      .get(baseURLFarmer + `external-unit-registration/get-all`)
      .then((response) => {
        setExternalListData(response.data.content.externalUnitRegistration);
        if (response.data.content.error) {
          setExternalListData([]);
        }
      })
      .catch(() => {
        setExternalListData([]);
      });
  };

  useEffect(() => {
    getExternalList();
  }, []);

  const licenseOptions = externalListData?.map((list) => ({
    value: list.externalUnitRegistrationId,
    label: `${list.licenseNumber} (${list.name})`,
  }));

  const navigate = useNavigate();

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
      text: message,
    }).then(() => {
      window.location.reload();
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

  const handleTransactionDateChange = (date, type) => {
    setTransactionDetails({ ...transactionDetails, [type]: date });
  };

  return (
    <Layout title={t("Crop Details-Seed Market")}>
      <style>{cropDetailsSeedMarketStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Crop Details-Seed Market")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/crop-details-seed-market-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/crop-details-seed-market-list"
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
                {t("Crop Details-Seed Market")}
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="farmerName">
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
                          {t("Beneficiary Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("RSP/CRC License Number")}</Form.Label>
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
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Race")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceMasterId"
                          value={data.raceMasterId}
                          onChange={handleInputs}
                          required
                        >
                          <option value="">{t("Select Race")}</option>
                          {raceListData.map((list) => (
                            <option key={list.raceMasterId} value={list.raceMasterId}>
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
                      <Form.Label>
                        {t("Name Of The Grainage")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="grainageId"
                          value={data.grainageId}
                          onChange={handleInputs}
                          required
                        >
                          <option value="">{t("Select Grainage")}</option>
                          {grainageListData && grainageListData.length
                            ? grainageListData.map((list) => (
                                <option key={list.grainageMasterId} value={list.grainageMasterId}>
                                  {list.grainageMasterName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Grainage is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Bonus Receipt No")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="bonusReceiptNo"
                          name="bonusReceiptNo"
                          value={data.bonusReceiptNo}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Bonus Receipt No")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Chawki Receipt No")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="chawkiReceiptNo"
                          name="chawkiReceiptNo"
                          value={data.chawkiReceiptNo}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Chawki Receipt No")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("CRC Bill Date")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="crcBillNo"
                          name="crcBillNo"
                          value={data.crcBillNo}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("CRC Bill Date")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Lot No")} <span className="text-danger">*</span>
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
                          {t("Lot No is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Chawki Percentage")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="chawkiPercentage"
                          name="chawkiPercentage"
                          value={data.chawkiPercentage}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Chawki Percentage")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Chawki Percentage is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Cocoons Transacted For Seed In Kg")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cocoonTransactedForSeedInKg"
                          name="cocoonTransactedForSeedInKg"
                          value={data.cocoonTransactedForSeedInKg}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Cocoons Transacted For Seed In Kg")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Cocoons Transacted For Seed In Nos")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cocoonTransactedForSeedInNos"
                          name="cocoonTransactedForSeedInNos"
                          value={data.cocoonTransactedForSeedInNos}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Cocoons Transacted For Seed In Nos")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Cocoons Transacted For Reeling In Kg")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cocoonTransactedForReelingInKg"
                          name="cocoonTransactedForReelingInKg"
                          value={data.cocoonTransactedForReelingInKg}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Cocoons Transacted For Reeling In Kg")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Cocoons Transacted For Reeling In Nos")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cocoonTransactedForReelingInNos"
                          name="cocoonTransactedForReelingInNos"
                          value={data.cocoonTransactedForReelingInNos}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Cocoons Transacted For Reeling In Nos")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Total No Of Cocoons Per Kg")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="noOfCocoonsPerKg"
                          name="noOfCocoonsPerKg"
                          value={data.noOfCocoonsPerKg}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("No Of Cocoons Per Kg")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("No Of DFL's")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="noOfDfls"
                          name="noOfDfls"
                          value={data.noOfDfls}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("No Of DFL's")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="3">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Brushing Date")}</Form.Label>
                      <DatePicker
                        selected={data.dateOfBrushing}
                        onChange={(date) => handleDateChange(date, "dateOfBrushing")}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </Form.Group>
                  </Col>

                  <Col lg="3">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Date Of Chawki Distribution")}</Form.Label>
                      <DatePicker
                        selected={data.dateOfDistributionOfChawkiWorms}
                        onChange={(date) =>
                          handleDateChange(date, "dateOfDistributionOfChawkiWorms")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </Form.Group>
                  </Col>

                  <Col lg="3">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Spun on Date(From)")}</Form.Label>
                      <DatePicker
                        selected={data.spunOnDate}
                        onChange={(date) => handleDateChange(date, "spunOnDate")}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </Form.Group>
                  </Col>

                  <Col lg="3">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Spun on Date(To)")}</Form.Label>
                      <DatePicker
                        selected={data.spunOnToDate}
                        onChange={(date) => handleDateChange(date, "spunOnToDate")}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Add Transaction Details Section */}
            <Block className="mt-3">
              <Card>
                <Card.Header>{t("Add Transaction Details")}</Card.Header>
                <Card.Body>
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-5">
                        <div className="form-control-wrap">
                          <ul className="">
                            <li>
                              <Button
                                className="d-md-none"
                                size="md"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>{t("add")}</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {transactionList.length > 0 ? (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div className="table-responsive">
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  <th>{t("Action")}</th>
                                  <th>{t("Market")}</th>
                                  <th>{t("Bidding Slip Number")}</th>
                                  <th>{t("Bidding Slip Lot No")}</th>
                                  <th>{t("Cocoon Rate Per Kg")}</th>
                                  <th>{t("Reeling Rate")}</th>
                                  <th>{t("Total Quantity Of Seed Cocoons")}</th>
                                  <th>{t("Transaction Date")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {transactionList.map((item, i) => (
                                  <tr key={i}>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGet(i)}
                                        >
                                          {t("Edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() => handleDelete(i)}
                                          className="ms-2"
                                        >
                                          {t("delete")}
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.marketMasterName}</td>
                                    <td>{item.biddingSlipNumber}</td>
                                    <td>{item.biddingSlipNo}</td>
                                    <td>{item.cocoonRatePerKg}</td>
                                    <td>{item.reelingRate}</td>
                                    <td>{item.quantityOfSeedCocoons}</td>
                                    <td>{formatDate(item.transactionDate)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Block>

            {/* Average Yield Summary */}
            {data.averageYield && (
              <Block className="mt-4">
                <Card
                  className="shadow-sm"
                  style={{ backgroundColor: "#f9fafb", borderLeft: "5px solid #0d6efd" }}
                >
                  <Card.Body>
                    <Row className="g-gs align-items-center">
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label className="fw-bold text-primary">
                            {t("Total Quantity Of Seed Cocoons")}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={data.quantityOfSeedCocoons}
                            readOnly
                            className="fw-bold text-primary bg-light"
                          />
                          <small className="text-muted">
                            {t("Entered in main form")}
                          </small>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label className="fw-bold text-success">
                            {t("Average Yield")}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={data.averageYield}
                            readOnly
                            className="fw-bold text-success bg-light"
                          />
                          <small className="text-muted">
                            {t("Calculated as (Total Quantity / No of DFLs) × 100")}
                          </small>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Block>
            )}

            <div className="gap-col mt-3">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
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

      {/* Add Transaction Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Add Transaction Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedDesignationDetails}
            onSubmit={handleAdd}
          >
            <Row className="g-5">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("Market")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketId"
                      value={`${transactionDetails.marketId}_${transactionDetails.marketMasterName}`}
                      onChange={handleMarketOption}
                      required
                    >
                      <option value="">{t("Select Market")}</option>
                      {marketListData.map((list) => (
                        <option
                          key={list.marketMasterId}
                          value={`${list.marketMasterId}_${list.marketMasterName}`}
                        >
                          {list.marketMasterName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Market is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("Bidding Slip Number")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="biddingSlipNumber"
                      name="biddingSlipNumber"
                      value={transactionDetails.biddingSlipNumber}
                      onChange={handleMapInputs}
                      type="text"
                      placeholder={t("Enter Bidding Slip Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Bidding Slip Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Bidding Slip Lot No")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="biddingSlipNo"
                      name="biddingSlipNo"
                      type="number"
                      value={transactionDetails.biddingSlipNo}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Bidding Slip Lot No")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Bidding Slip Lot No is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Cocoon Rate Per Kg")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="cocoonRatePerKg"
                      name="cocoonRatePerKg"
                      type="number"
                      value={transactionDetails.cocoonRatePerKg}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Cocoon Rate Per Kg")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Cocoon Rate Per Kg is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Reeling Rate")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="reelingRate"
                      name="reelingRate"
                      type="number"
                      value={transactionDetails.reelingRate}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Reeling Rate")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Reeling Rate is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Total Quantity Of Seed Cocoons")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="quantityOfSeedCocoons"
                      name="quantityOfSeedCocoons"
                      type="number"
                      value={transactionDetails.quantityOfSeedCocoons}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Total Quantity Of Seed Cocoons")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Total Quantity Of Seed Cocoons is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Transaction Date")}<span className="text-danger">*</span>
                  </Form.Label>
                  <DatePicker
                    selected={transactionDetails.transactionDate}
                    onChange={(date) =>
                      handleTransactionDateChange(date, "transactionDate")
                    }
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    <Button type="submit" variant="success">
                      {t("add")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button type="button" variant="secondary" onClick={designationClear}>
                      {t("Clear")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Edit Transaction Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedDesignationDetailsEdit}
            onSubmit={(e) => handleUpdate(e, transactionDetailsId, transactionDetails)}
          >
            <Row className="g-5">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("Market")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketId"
                      value={`${transactionDetails.marketId}_${transactionDetails.marketMasterName}`}
                      onChange={handleMarketOption}
                      required
                    >
                      <option value="">{t("Select Market")}</option>
                      {marketListData.map((list) => (
                        <option
                          key={list.marketMasterId}
                          value={`${list.marketMasterId}_${list.marketMasterName}`}
                        >
                          {list.marketMasterName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Market is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("Bidding Slip Number")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="biddingSlipNumber"
                      name="biddingSlipNumber"
                      value={transactionDetails.biddingSlipNumber}
                      onChange={handleMapInputs}
                      type="text"
                      placeholder={t("Enter Bidding Slip Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Bidding Slip Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Bidding Slip Lot No")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="biddingSlipNo"
                      name="biddingSlipNo"
                      type="number"
                      value={transactionDetails.biddingSlipNo}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Bidding Slip Lot No")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Bidding Slip Lot No is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Cocoon Rate Per Kg")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="cocoonRatePerKg"
                      name="cocoonRatePerKg"
                      type="number"
                      value={transactionDetails.cocoonRatePerKg}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Cocoon Rate Per Kg")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Cocoon Rate Per Kg is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Reeling Rate")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="reelingRate"
                      name="reelingRate"
                      type="number"
                      value={transactionDetails.reelingRate}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Reeling Rate")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Reeling Rate is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Total Quantity Of Seed Cocoons")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="quantityOfSeedCocoons"
                      name="quantityOfSeedCocoons"
                      type="number"
                      value={transactionDetails.quantityOfSeedCocoons}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Total Quantity Of Seed Cocoons")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Total Quantity Of Seed Cocoons is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Transaction Date")}<span className="text-danger">*</span>
                  </Form.Label>
                  <DatePicker
                    selected={transactionDetails.transactionDate}
                    onChange={(date) =>
                      handleTransactionDateChange(date, "transactionDate")
                    }
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    <Button type="submit" variant="success">
                      {t("update")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button type="button" variant="secondary" onClick={designationClear}>
                      {t("Clear")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

const cropDetailsSeedMarketStyles = `
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
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
`;

export default CropDetailsForSeedMarket;
