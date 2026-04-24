import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ExternalUnitRegister() {
  // Translation
  const { t } = useTranslation();

  const [vbAccountList, setVbAccountList] = useState([]);
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    reEnterAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
    marketMasterName: "",
    lock: false,
  });

  const [validatedVbAccount, setValidatedVbAccount] = useState(false);
  const [validatedVbAccountEdit, setValidatedVbAccountEdit] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    setValidatedVbAccount(true);
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    if (vbAccount.ifscCode.length < 11 || vbAccount.ifscCode.length > 11) {
      return;
    }

    if (vbAccount.virtualAccountNumber !== vbAccount.reEnterAccountNumber) {
      Swal.fire("Error", "Account numbers do not match", "error");
      return;
    }

    const exists = vbAccountList.some(
      (item) =>
        item.marketMasterId === vbAccount.marketMasterId &&
        item.virtualAccountNumber === vbAccount.virtualAccountNumber,
    );

    if (exists) {
      Swal.fire("Error", "Account already exists for this market", "error");
      return;
    }
    setVbAccountList((prev) => [...prev, vbAccount]);
    setVbAccount({
      virtualAccountNumber: "",
      reEnterAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
      marketMasterName: "",
      lock: false,
    });
    setShowModal(false);
    setValidatedVbAccount(false);
  };

  const handleLockCheckbox = (e) => {
    setVbAccount({ ...vbAccount, lock: e.target.checked });
  };
  const handleDelete = (i) => {
    if (vbAccountList[i].lock) return;
    setVbAccountList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [vbId, setVbId] = useState();
  const handleGet = (i) => {
    if (vbAccountList[i].lock) return;
    setVbAccount(vbAccountList[i]);
    setShowModal2(true);
    setVbId(i);
  };

  const handleUpdate = (e, i, changes) => {
    e.preventDefault();
    const form = e.currentTarget;

    // ✅ LOCK CHECK
    if (vbAccountList[i].lock) {
      Swal.fire("Error", "Locked account cannot be edited", "error");
      return;
    }

    // ✅ FORM VALIDATION FIRST
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidatedVbAccountEdit(true);
      return;
    }

    // ✅ IFSC VALIDATION
    if (changes.ifscCode.length !== 11) {
      Swal.fire("Error", "IFSC must be 11 characters", "error");
      return;
    }

    // ✅ MATCH VALIDATION (MAIN ISSUE FIX)
    if (changes.virtualAccountNumber !== changes.reEnterAccountNumber) {
      Swal.fire("Error", "Account numbers do not match", "error");
      setValidatedVbAccountEdit(true);
      return;
    }
    // ✅ UNIQUE CHECK
    const exists = vbAccountList.some(
      (item, index) =>
        index !== i &&
        item.marketMasterId === changes.marketMasterId &&
        item.virtualAccountNumber === changes.virtualAccountNumber,
    );

    if (exists) {
      Swal.fire("Error", "Account already exists for this market", "error");
      return;
    }

    // ✅ UPDATE
    setVbAccountList((prev) =>
      prev.map((item, ix) => (ix === i ? changes : item)),
    );

    setShowModal2(false);
    setValidatedVbAccountEdit(false);

    // ✅ RESET
    setVbAccount({
      virtualAccountNumber: "",
      reEnterAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
      marketMasterName: "",
      lock: false,
    });
  };

  const handleVbInputs = (e) => {
    const { name, value } = e.target;
    // setVbAccount({ ...vbAccount, [name]: value });
    if (name === "reEnterAccountNumber") {
      const prevLength = vbAccount.reEnterAccountNumber?.length || 0;

      if (value.length > prevLength + 1) {
        return; // ignore paste
      }
    }

    if (name === "ifscCode" && (value.length < 11 || value.length > 11)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "ifscCode" && value.length === 11) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
    if (name === "branchName") {
      setVbAccount({ ...vbAccount, [name]: value.toUpperCase() });
    } else if (name === "ifscCode") {
      setVbAccount({ ...vbAccount, [name]: value.toUpperCase() });
    } else {
      setVbAccount({ ...vbAccount, [name]: value });
    }
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [data, setData] = useState({
    externalUnitTypeId: "",
    name: "",
    address: "",
    licenseNumber: "",
    externalUnitNumber: "",
    organisationName: "",
    raceMasterId: "",
    capacity: "",
    lotNumberNomenclature: "",
    externalUnitRegistrationDetailsRequests: [],
    districtId: "",
    talukId: "",
    tscMasterId: "",
    nameKan: "",
  });

  const [validated, setValidated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (isSaving) return;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setIsSaving(true);
      const updatedData = {
        ...data,
        externalUnitRegistrationDetailsRequests:
          vbAccountList && vbAccountList.length > 0 ? vbAccountList : null,
      };
      api
        .post(baseURL2 + `external-unit-registration/add`, updatedData)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            const externalUnitNumber = response.data.content.externalUnitNumber;
            saveSuccess(externalUnitNumber);
            clear();
            setValidated(false);
          }
        })
        .catch((err) => {
          if (
            err?.response?.data?.validationErrors &&
            Object.keys(err.response.data.validationErrors || {}).length > 0
          ) {
            saveError(err.response.data.validationErrors);
          } else {
            saveError("Something went wrong");
          }
        })
        .finally(() => {
          setIsSaving(false); // ✅ re-enable button
        });

      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      externalUnitTypeId: "",
      name: "",
      address: "",
      licenseNumber: "",
      externalUnitNumber: "",
      organisationName: "",
      raceMasterId: "",
      capacity: "",
      lotNumberNomenclature: "",
      districtId: "",
      talukId: "",
      tscMasterId: "",
      nameKan: "",
      externalUnitRegistrationDetailsRequests: "",
    });
    virtualAccountClear();
  };

  const virtualAccountClear = () => {
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
    setVbAccountList([]);
  };

  // Handle Options
  // Market
  const handleMarketOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setVbAccount({
      ...vbAccount,
      marketMasterId: chooseId,
      marketMasterName: chooseName,
    });
  };

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
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
    getMarketList();
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

  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };
  useEffect(() => {
    getDistrictList();
  }, []);

  const [tscListData, setTscListData] = useState([]);

  const getTscList = () => {
    const response = api
      .get(baseURL + `tscMaster/get-all`)
      .then((response) => {
        setTscListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setTscListData([]);
      });
  };

  useEffect(() => {
    getTscList();
  }, []);

  // to get taluk

  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get external Unit
  const [externalUnitTypeListData, setExternalUnitTypeListData] = useState([]);

  const getExternalUnitTypeList = () => {
    const response = api
      .get(baseURL + `externalUnitType/get-all`)
      .then((response) => {
        setExternalUnitTypeListData(response.data.content.externalUnitType);
      })
      .catch((err) => {
        setExternalUnitTypeListData([]);
      });
  };

  useEffect(() => {
    getExternalUnitTypeList();
  }, []);

  const navigate = useNavigate();
  const saveSuccess = (externalUnitNumber) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Generated External Unique Id is ${externalUnitNumber}`,
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="External Units Registration(CRC,RSP,NSSO)">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("External Units Registration(CRC,RSP,NSSO)")}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/external-unit-registration-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/external-unit-registration-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
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
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("External Unit")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="externalUnitTypeId"
                          value={data.externalUnitTypeId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.externalUnitTypeId === undefined ||
                            data.externalUnitTypeId === "0"
                          }
                        >
                          <option value="">{t("Select External Unit")}</option>
                          {externalUnitTypeListData.map((list) => (
                            <option
                              key={list.externalUnitTypeId}
                              value={list.externalUnitTypeId}
                            >
                              {list.externalUnitTypeName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("External Unit Type is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        {t("Name of the Unit")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          name="name"
                          value={data.name}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Name of the Unit")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        {t("Name of the Owner/Organisation")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="organisationName"
                          name="organisationName"
                          value={data.organisationName}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t(
                            "Enter Name of the Owner/Organisation",
                          )}
                        />
                      </div>
                    </Form.Group>

                    {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="externalUnitNumber">
                        {t("External Units ID")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="externalUnitNumber"
                          name="externalUnitNumber"
                          value={data.externalUnitNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter External Units ID")}
                        />
                      </div>
                    </Form.Group> */}
                    <Form.Group className="form-group">
                      <Form.Label>{t("Race")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceMasterId"
                          value={data.raceMasterId}
                          onChange={handleInputs}
                        >
                          <option value="0">{t("Select Race")}</option>
                          {raceListData.map((list) => (
                            <option
                              key={list.raceMasterId}
                              value={list.raceMasterId}
                            >
                              {list.raceMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("district")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={data.districtId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.districtId === undefined ||
                            data.districtId === "0"
                          }
                        >
                          <option value="">{t("select_district")}</option>
                          {districtListData && districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={list.districtId}
                                >
                                  {list.districtName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("district_is_required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("tsc")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="tscMasterId"
                          value={String(data.tscMasterId || "")}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.tscMasterId === undefined ||
                            data.tscMasterId === "0"
                          }
                        >
                          <option value="">{t("select_tsc")}</option>
                          {tscListData.map((list) => (
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

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="address">{t("address")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="address"
                          name="address"
                          value={data.address}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("enter_address")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="licenseNumber">
                        {t("License/Registration Number")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="licenseNumber"
                          name="licenseNumber"
                          value={data.licenseNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter License Number")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="capacity">
                        {t("Capacity Of Production/Annum")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="capacity"
                          name="capacity"
                          value={data.capacity}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Capacity")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="capacity">
                        {t("Lot Number Nomenclature")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotNumberNomenclature"
                          name="lotNumberNomenclature"
                          value={data.lotNumberNomenclature}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Lot Number Nomenclature")}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("taluk")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={data.talukId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.talukId === undefined || data.talukId === "0"
                          }
                        >
                          <option value="">{t("select_taluk")}</option>
                          {talukListData && talukListData.length
                            ? talukListData.map((list) => (
                                <option key={list.talukId} value={list.talukId}>
                                  {list.talukName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("taluk_is_required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>
                        {t(" Name in Kannada")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="nameKan"
                          name="nameKan"
                          value={data.nameKan}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Name in Kannada")}
                          required
                      
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Name in Kannada is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Block className="mt-3">
              <Card>
                <Card.Header>{t("Virtual Bank Account")}</Card.Header>
                <Card.Body>
                  {/* <h3>Virtual Bank account</h3> */}
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
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
                                <span> {t("add")}</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span> {t("add")}</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {vbAccountList.length > 0 ? (
                    <Row className="g-3">
                      <Block>
                        <Card>
                          <div
                            className="table-responsive"
                            // style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  {/* <th></th> */}
                                  <th>{t("Action")}</th>
                                  <th>{t("Virtual Account Number")}</th>
                                  <th>{t("branch_name")}</th>
                                  <th>{t("ifsc_code")}</th>
                                  <th>{t("Market")}</th>
                                  <th>{t("Status")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vbAccountList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          disabled={item.lock}
                                          onClick={() => handleGet(i)}
                                        >
                                          {t("edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          disabled={item.lock}
                                          onClick={() => handleDelete(i)}
                                          className="ms-2"
                                        >
                                          {t("delete")}
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.virtualAccountNumber}</td>
                                    <td>{item.branchName}</td>
                                    <td>{item.ifscCode}</td>
                                    <td>{item.marketMasterName}</td>
                                    <td>
                                      {item.lock ? (
                                        <span className="badge bg-secondary">
                                          Locked
                                        </span>
                                      ) : (
                                        <span className="badge bg-success">
                                          Active
                                        </span>
                                      )}
                                    </td>
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

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? "Saving..." : t("save")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    {t("Clear")}
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className="px-4 py-3 border-bottom">
          <Modal.Title className="fw-semibold">
            Add Virtual Bank Account Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          {/* <Form action="#"> */}
          <Form noValidate validated={validatedVbAccount} onSubmit={handleAdd}>
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label
                    className="mb-1 fw-medium"
                    htmlFor="virtualAccountNumber"
                  >
                    {t("Virtual Account Number")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="virtualAccountNumber"
                      name="virtualAccountNumber"
                      value={vbAccount.virtualAccountNumber}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("Enter Virtual Account Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Virtual Account Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label
                    className="mb-1 fw-medium"
                    htmlFor="reEnterAccountNumber"
                  >
                    {t("Re-enter Virtual Account Number")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="reEnterAccountNumber"
                    type="password" // ✅ masked
                    name="reEnterAccountNumber"
                    value={vbAccount.reEnterAccountNumber}
                    onChange={handleVbInputs}
                    placeholder={t("Re-enter Virtual Account Number")}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()} // ✅ RIGHT CLICK BLOCK
                    onDrop={(e) => e.preventDefault()} // ✅ DRAG DROP BLOCK
                    required
                    isInvalid={
                      vbAccount.reEnterAccountNumber &&
                      vbAccount.reEnterAccountNumber !==
                        vbAccount.virtualAccountNumber
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Account numbers do not match
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label className="mb-1 fw-medium" htmlFor="branchNamevb">
                    {t("branch_name")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="branchNamevb"
                      name="branchName"
                      value={vbAccount.branchName}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("enter_branch_name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Branch Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label className="mb-1 fw-medium" htmlFor="ifscCodevb">
                    {t("ifsc_code")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ifscCodevb"
                      name="ifscCode"
                      value={vbAccount.ifscCode}
                      onChange={handleVbInputs}
                      type="text"
                      maxLength="11"
                      placeholder={t("enter_ifsc_code")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      IFSC Code is required and equals to 11 digit
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label className="mb-1 fw-medium">
                    {t("Market")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                      onChange={handleMarketOption}
                      onBlur={() => handleMarketOption}
                      required
                      isInvalid={
                        vbAccount.marketMasterId === undefined ||
                        vbAccount.marketMasterId === "0"
                      }
                    >
                      <option value="">{t("Select Market")}</option>
                      {marketListData.length
                        ? marketListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={`${list.marketMasterId}_${list.marketMasterName}`}
                            >
                              {list.marketMasterName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Market is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group as={Row} className="form-group mt-2">
                  <Col sm={1}>
                    <Form.Check
                      type="checkbox"
                      id="lock"
                      checked={vbAccount.lock}
                      onChange={handleLockCheckbox}
                      // defaultChecked
                    />
                  </Col>
                  <Form.Label className="mb-1 fw-medium">
                    {t("Lock Bank Details")}
                  </Form.Label>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-end gap-2 mt-3 border-top pt-3">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success" className="px-4">
                      {t("add")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                          <Button variant="danger" onClick={handleCloseModal1}>
                            Reject
                          </Button>
                        </div> */}
                  <div className="gap-col">
                    <Button
                      variant="secondary"
                      className="px-4"
                      onClick={handleCloseModal}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("Edit Virtual Bank Account")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedVbAccountEdit}
            onSubmit={(e) => handleUpdate(e, vbId, vbAccount)}
          >
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label
                    className="mb-1 fw-medium"
                    htmlFor="virtualAccountNumber"
                  >
                    {t("Virtual Account Number")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="virtualAccountNumber"
                      name="virtualAccountNumber"
                      value={vbAccount.virtualAccountNumber}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("Enter Virtual Account Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Virtual Account Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label className="mb-1 fw-medium">
                    Re-enter Virtual Account Number
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    id="reEnterAccountNumber"
                    type="password" // ✅ masked
                    name="reEnterAccountNumber"
                    value={vbAccount.reEnterAccountNumber}
                    placeholder={t("Re-enter Virtual Account Number")}
                    onChange={handleVbInputs}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()} // ✅ DRAG DROP BLOCK
                    required
                    isInvalid={
                      vbAccount.reEnterAccountNumber &&
                      vbAccount.reEnterAccountNumber !==
                        vbAccount.virtualAccountNumber
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Account numbers do not match
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label className="mb-1 fw-medium" htmlFor="branchNamevb">
                    {t("branch_name")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="branchNamevb"
                      name="branchName"
                      value={vbAccount.branchName}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("enter_branch_name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Branch Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label className="mb-1 fw-medium" htmlFor="ifscCodevb">
                    {t("ifsc_code")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ifscCodevb"
                      name="ifscCode"
                      value={vbAccount.ifscCode}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder={t("enter_ifsc_code")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      IFSC Code is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label className="mb-1 fw-medium">
                    {t("Market")}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                      onChange={handleMarketOption}
                      onBlur={() => handleMarketOption}
                      required
                      disabled={vbAccountList[vbId]?.lock}
                      isInvalid={
                        vbAccount.marketMasterId === undefined ||
                        vbAccount.marketMasterId === "0"
                      }
                    >
                      <option value="">{t("Select Market")}</option>
                      {marketListData.length
                        ? marketListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={`${list.marketMasterId}_${list.marketMasterName}`}
                            >
                              {list.marketMasterName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Market is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-end gap-2 mt-3 border-top pt-3">
                  <div className="gap-col">
                    {/* <Button
                            variant="success"
                            onClick={() => handleUpdate(vbId, vbAccount)}
                          > */}
                    <Button type="submit" variant="success">
                      {t("update")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                          <Button variant="danger" onClick={handleCloseModal1}>
                            Reject
                          </Button>
                        </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal2}>
                      {t("cancel")}
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

export default ExternalUnitRegister;
