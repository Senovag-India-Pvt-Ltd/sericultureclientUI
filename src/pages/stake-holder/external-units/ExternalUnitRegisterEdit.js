import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ExternalUnitRegisterEdit() {
  // Translation
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({
    externalUnitTypeId: "",
    name: "",
    address: "",
    licenseNumber: "",
    organisationName: "",
    raceMasterId: "",
    capacity: "",
    lotNumberNomenclature: "",
    districtId: "",
    talukId: "",
    tscMasterId: "",
    nameKan: "",
    bankName: "",
    bankAccountNumber: "",
    bankBranchName: "",
    bankIfscCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [vbAccountList, setVbAccountList] = useState([]);

  const [validated, setValidated] = useState(false);
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    reEnterAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
    marketMasterName: "",
    lock: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [validatedVbAccount, setValidatedVbAccount] = useState(false);
  const [validatedVbAccountEdit, setValidatedVbAccountEdit] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseModal2 = () => setShowModal2(false);

  // let name, value;
  // const handleInputs = (e) => {
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  // };

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
    setVbAccountList((prev) => [
      ...prev,
      {
        ...vbAccount,
        id: null, // 🔥 IMPORTANT
        deleted: false, // 🔥 IMPORTANT
      },
    ]);
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
    setVbAccountList((prev) =>
      prev.map((item, index) =>
        index === i ? { ...item, deleted: true } : item,
      ),
    );
  };
  const [vbId, setVbId] = useState();
  const handleGet = (i) => {
    if (vbAccountList[i].lock) return;

    setVbAccount({
      ...vbAccountList[i],
      id: vbAccountList[i].id, // 🔥 ADD THIS
    });

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
      prev.map((item, ix) =>
        ix === i
          ? {
              ...changes,
              id: item.id, // 🔥 KEEP ID
              deleted: item.deleted, // 🔥 KEEP DELETE FLAG
            }
          : item,
      ),
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

  const handleInputs = (e) => {
    const { name, value } = e.target;
    if (name === "reEnterAccountNumber") {
      const prevLength = data.reEnterAccountNumber?.length || 0;

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

    if (name === "branchName" || name === "bankBranchName") {
      setData({ ...data, [name]: value.toUpperCase() });
    } else if (name === "ifscCode" || name === "bankIfscCode") {
      setData({ ...data, [name]: value.toUpperCase() });
    } else {
      setData({ ...data, [name]: value });
    }
  };
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
      const updatedData = {
        ...data,
        externalUnitRegistrationDetailsRequests: vbAccountList.map((item) => ({
          id: item.id, // 🔥 MUST
          virtualAccountNumber: item.virtualAccountNumber,
          branchName: item.branchName,
          ifscCode: item.ifscCode,
          marketMasterId: item.marketMasterId,
          lock: item.lock,
          deleted: item.deleted || false, // 🔥 MUST
        })),
      };
      api
        .post(baseURL2 + `external-unit-registration/edit`, updatedData)

     .then((response) => {
  if (response.data.content.error) {
    updateError(response.data.content.error_description);
    return;
  }

  updateSuccess();
      
            setData({
              externalUnitTypeId: "",
              name: "",
              address: "",
              licenseNumber: "",
              externalUnitNumber: "",
              organisationName: "",
              raceMasterId: "",
              capacity: "",
              marketMasterId: "",
              lotNumberNomenclature: "",
              bankName: "",
              bankAccountNumber: "",
              bankBranchName: "",
              bankIfscCode: "",
            });
            setValidated(false);
          }
        )
        .catch((err) => {
          const validationErrors = err?.response?.data?.validationErrors;

          if (validationErrors && Object.keys(validationErrors).length > 0) {
            updateError(validationErrors);
          } else {
            updateError("Something went wrong");
          }
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
      organisationName: "",
      raceMasterId: "",
      capacity: "",
      lotNumberNomenclature: "",
      districtId: "",
      talukId: "",
      tscMasterId: "",
      nameKan: "",
      bankName: "",
      bankAccountNumber: "",
      bankBranchName: "",
      bankIfscCode: "",
    });

    setVbAccountList([]);
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL2 + `external-unit-registration/get/${id}`)
      .then((response) => {
        const res = response.data.content;

        // 🔥 DEBUG (check in console once)
        console.log("API DATA:", res);

        setData({
          ...res,

          // ✅ IMPORTANT: extract IDs properly
          districtId: String(
            res.districtId ||
              res.district?.districtId ||
              res.districtMaster?.districtId ||
              "",
          ),

          talukId: String(
            res.talukId || res.taluk?.talukId || res.talukMaster?.talukId || "",
          ),

          tscMasterId: String(
            res.tscMasterId || res.tscMaster?.tscMasterId || "",
          ),

          // ✅ Kannada name
          nameKan: res.nameKan || "",

          // ✅ Bank details
          bankName: res.bankName || "",
          bankAccountNumber: res.bankAccountNumber || "",
          bankBranchName: res.bankBranchName || "",
          bankIfscCode: res.bankIfscCode || "",
        });

        // ✅ Load taluk
        const distId =
          res.districtId ||
          res.district?.districtId ||
          res.districtMaster?.districtId;

        if (distId) {
          getTalukList(distId);
        }

        // ✅ Virtual Bank
        setVbAccountList(
          (res.externalUnitRegistrationDetailsRequests || []).map((item) => ({
            id: item.id, // 🔥 ADD THIS
            virtualAccountNumber: item.virtualAccountNumber,
            branchName: item.branchName,
            ifscCode: item.ifscCode,
            marketMasterId: item.marketMasterId,
            marketMasterName: item.marketMasterName,
            lock: item.lock,
            deleted: false,
          })),
        );
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

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

  // to get tsc
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

  // const [userListData, setUserListData] = useState([]);

  // const getUserList = (_id) => {
  //   const response = api
  //     .get(baseURL2 + `userMaster/get-by-tsc-master-id/${_id}`)
  //     .then((response) => {
  //       if (response.data.content.userMaster) {
  //         setUserListData(response.data.content.userMaster);
  //       }
  //     })
  //     .catch((err) => {
  //       setUserListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (data.tscMasterId) {
  //     getUserList(data.tscMasterId);
  //   }
  // }, [data.tscMasterId]);

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

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/external-unit-registration-list"));
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
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/external-unit-registration-list"));
  };

  return (
    <Layout title="External Unit Register Edit">
      <style>{externalUnitEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("External Unit Register Edit")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/external-unit-registration-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/external-unit-registration-list"
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
        {/* <Form action="#"> */}
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="building" />
                <span>{t("External Unit Registration Details")}</span>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {" "}
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
                            <option value="">
                              {t("Select External Unit")}
                            </option>
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

                      {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="lotNumber">
                        Lot Number Nomenclature
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotNumber"
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Lot Number Nomenclature"
                        />
                      </div>
                    </Form.Group> */}
                      <Form.Group className="form-group">
                        <Form.Label>{t("Select Race")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="raceMasterId"
                            value={data.raceMasterId}
                            onChange={handleInputs}
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
                            value={data.districtId || ""}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.districtId === undefined ||
                              data.districtId === "0"
                            }
                          >
                            <option value="">{t("select_district")}</option>
                            {districtListData.map((list) => (
                              <option
                                key={list.districtId}
                                value={list.districtId}
                              >
                                {list.districtName}
                              </option>
                            ))}
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
                            value={data.tscMasterId || ""}
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
                        <Form.Label htmlFor="address">
                          {t("address")}
                        </Form.Label>
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
                            value={data.talukId || ""}
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
                                  <option
                                    key={list.talukId}
                                    value={list.talukId}
                                  >
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
                            value={data.nameKan || ""}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Name in Kannada")}
                            required
                            isInvalid={validated && !data.nameKan}
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Name in Kannada is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>

            {/* <Block className="mt-3">
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  {t("Virtual Bank Account Details")}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="virtualAccountNumber">
                          {t("Virtual Account Number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="virtualAccountNumber"
                            name="virtualAccountNumber"
                            value={data.virtualAccountNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Virtual Account Number")}
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                            onDrop={(e) => e.preventDefault()}
                            required
                            disabled={data.lock === true}
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Virtual Account Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          Re-enter Virtual Account Number
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="password" // ✅ masked
                          name="reEnterAccountNumber"
                          value={data.reEnterAccountNumber}
                          onChange={handleInputs}
                          placeholder={t("Re-enter Virtual Account Number")}
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()} // ✅ RIGHT CLICK BLOCK
                          onDrop={(e) => e.preventDefault()} // ❌ disable paste
                          required
                          disabled={data.lock === true}
                          isInvalid={
                            data.reEnterAccountNumber &&
                            data.reEnterAccountNumber !==
                              data.virtualAccountNumber
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Account numbers do not match
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="branchNamevb">
                          {t("branch_name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="branchNamevb"
                            name="branchName"
                            value={data.branchName}
                            onChange={handleInputs}
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
                        <Form.Label htmlFor="ifscCodevb">
                          {t("ifsc_code")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ifscCodevb"
                            name="ifscCode"
                            value={data.ifscCode}
                            onChange={handleInputs}
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
                        <Form.Label>
                          {t("Market")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="marketMasterId"
                            // value={data.marketMasterId}
                            value={data.marketMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.marketMasterId === undefined ||
                              data.marketMasterId === "0"
                            }
                          >
                            <option value="">{t("Select Market")}</option>
                            {marketListData.length
                              ? marketListData.map((list) => (
                                  <option
                                    key={list.marketMasterId}
                                    value={list.marketMasterId}
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
                    <Form.Group className="form-group mt-3">
                      <Form.Check
                        type="checkbox"
                        label="Lock Virtual Account"
                        name="lock"
                        checked={data.lock || false}
                        onChange={(e) =>
                          setData({ ...data, lock: e.target.checked })
                        }
                      />
                    </Form.Group>
                  </Row>
                </Card.Body>
              </Card>
            </Block> */}

            <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header">
                  <Icon name="cc" />
                  <span>{t("Bank Details")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>{t("Bank Name")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            name="bankName"
                            value={data.bankName || ""}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Bank Name")}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>{t("Bank Account Number")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            name="bankAccountNumber"
                            value={data.bankAccountNumber || ""}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Bank Account Number")}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>{t("Branch Name")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            name="bankBranchName"
                            value={data.bankBranchName || ""}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Branch Name")}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>{t("IFSC Code")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            name="bankIfscCode"
                            value={data.bankIfscCode || ""}
                            onChange={handleInputs}
                            type="text"
                            maxLength={11}
                            placeholder={t("Enter IFSC Code")}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header">
                  <Icon name="wallet" />
                  <span>{t("Virtual Bank Account")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      {" "}
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>{" "}
                    </Col>

                    <Col lg="6" className="text-end">
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
                                {vbAccountList
                                  .filter((item) => !item.deleted)
                                  .map((item, i) => {
                                    return (
                                      <tr>
                                        <td>
                                          <div>
                                            <Button
                                              variant="primary"
                                              size="sm"
                                              disabled={item.lock}
                                              onClick={() =>
                                                handleGet(i)
                                              }
                                            >
                                              {t("edit")}
                                            </Button>
                                            <Button
                                              variant="danger"
                                              size="sm"
                                              disabled={item.lock}
                                              onClick={() =>
                                                handleDelete(i)
                                              }
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
                                    );
                                  })}
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
                  <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                    <Icon name="check" className="me-1" />
                    {t("update")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" className="sh-cancel-btn shadow-sm px-4 py-2" onClick={clear}>
                    <Icon name="cross" className="me-1" />
                    {t("Clear")}
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton className="px-4 py-3 border-bottom">
          <Modal.Title className="fw-semibold">
            <Icon name="wallet" className="me-1" />
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

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="wallet" className="me-1" />
            {t("Edit Virtual Bank Account")}
          </Modal.Title>
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

const externalUnitEditStyles = `
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
    margin-bottom: 18px;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]),
  .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-form-wrap .form-control[readonly],
  .sh-form-wrap .form-control:read-only,
  .sh-form-wrap .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .form-check-input {
    border-radius: 5px;
    border: 1.5px solid #c9d4e3;
    cursor: pointer;
  }
  .sh-form-wrap .form-check-input:checked {
    background-color: #1e67a8;
    border-color: #1e67a8;
  }
  .sh-form-wrap .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14);
    border-color: #2b7ac0;
  }
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-form-wrap .btn-primary {
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    transition: background-color 0.15s ease, color 0.15s ease,
      transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
  .sh-form-wrap table {
    border-radius: 8px;
    overflow: hidden;
  }
  .sh-form-wrap table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-form-wrap table tbody tr:hover {
    background-color: #f7faff !important;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon,
  .sh-modal-content .modal-header svg,
  .sh-modal-content .modal-header .icon {
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
  .modal-backdrop.show {
    background-color: #0c2844;
    opacity: 0.75;
  }
  .sh-modal-content {
    border-radius: 12px !important;
    border: 1px solid #e3ebf6 !important;
    overflow: hidden;
  }
  .sh-modal-content .modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-bottom: none;
    padding: 16px 22px;
  }
  .sh-modal-content .modal-header .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }
  .sh-modal-content .modal-header .btn-close:hover {
    opacity: 1;
  }
  .sh-modal-content .modal-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.3px;
    color: #ffffff;
  }
  .sh-modal-content .modal-body {
    padding: 22px 24px;
  }
  .sh-modal-content .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-modal-content .form-control,
  .sh-modal-content .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-modal-content .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-modal-content .form-control:hover:not(:disabled):not([readonly]),
  .sh-modal-content .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-modal-content .form-control:focus,
  .sh-modal-content .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-modal-content .form-control[readonly],
  .sh-modal-content .form-control:read-only,
  .sh-modal-content .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-modal-content .form-check-input {
    border-radius: 5px;
    border: 1.5px solid #c9d4e3;
    cursor: pointer;
  }
  .sh-modal-content .form-check-input:checked {
    background-color: #1e67a8;
    border-color: #1e67a8;
  }
  .sh-modal-content .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14);
    border-color: #2b7ac0;
  }
  .sh-modal-content .form-control.is-invalid,
  .sh-modal-content .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-modal-content .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-modal-content .btn-primary {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.3);
  }
  .sh-modal-content .btn-success {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-success:not(:disabled):hover {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.3);
  }
  .sh-modal-content .btn-secondary {
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-secondary:hover:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.28);
  }
  .sh-modal-content table {
    border-radius: 8px;
    overflow: hidden;
  }
  .sh-modal-content table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-modal-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 10px;
    padding-top: 18px;
    border-top: 1px solid #eef1f6;
  }
`;

export default ExternalUnitRegisterEdit;
