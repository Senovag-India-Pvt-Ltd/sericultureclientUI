import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function RegisteredPrivateChawki() {
  // Translation
  const { t } = useTranslation();
  
  const [privateChawkiList, setPrivateChawkiList] = useState([]);
  const [privateChawkiDetails, setPrivateChawkiDetails] = useState({
    rearingEquipmentDetailsId: "",
    eligibleEquipmentInNos: "",
    eligibleTotalValueInRs: "",
    ratePerEligibleEquipment: "",
    eligibleAmount: "",
    maxAmountOfSubsidyEligible: "",
  });

  const [validated, setValidated] = useState(false);
  const [validatedPrivateChawkiDetails, setValidatedPrivateChawkiDetails] =
    useState(false);
  const [validatedPrivateChawkiDetailsEdit, setValidatedPrivateChawkiDetailsEdit] =
    useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setPrivateChawkiDetails(true);
    } else {
      e.preventDefault();
      setPrivateChawkiList((prev) => [...prev, privateChawkiDetails]);
      setPrivateChawkiDetails({
        rearingEquipmentDetailsId: "",
        eligibleEquipmentInNos: "",
        eligibleTotalValueInRs: "",
        ratePerEligibleEquipment: "",
        eligibleAmount: "",
        maxAmountOfSubsidyEligible: "",
      });
      setShowModal(false);
      setValidatedPrivateChawkiDetails(false);
    }
  };

  const handleDelete = (i) => {
    setPrivateChawkiList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [privateChawkiDetailsId, setMapComponentId] = useState();
  const handleGet = (i) => {
    setPrivateChawkiDetails(privateChawkiList[i]);
    setShowModal2(true);
    setMapComponentId(i);
  };

  // console.log(designationList);
// 
  const handleUpdate = (e, i, changes) => {
    setPrivateChawkiList((prev) =>
      prev.map((item, ix) => {
        if (ix === i) {
          return { ...item, ...changes };
        }
        return item;
      })
    );
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedPrivateChawkiDetailsEdit(true);
    } else {
      e.preventDefault();
      setShowModal2(false);
      setValidatedPrivateChawkiDetailsEdit(false);
      setPrivateChawkiDetails({
        rearingEquipmentDetailsId: "",
        eligibleEquipmentInNos: "",
        eligibleTotalValueInRs: "",
        ratePerEligibleEquipment: "",
        eligibleAmount: "",
        maxAmountOfSubsidyEligible: "",
      });
    }
  };

  const handleMapInputs = (e) => {
    const { name, value } = e.target;
    setPrivateChawkiDetails({ ...privateChawkiDetails, [name]: value });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);
  const [data, setData] = useState({
    subSchemeId: "",
    componentId:"",
    categoryId: "",
    establishmentOfMulberryGardenEligibleAmount: "",
    installationOfDripIrrigationEligibleAmount: "",
    chawkiRearingBuildingEligibleAmount: "",
    // designationId: "",
    registeredPrivateChawkiDetailsRequests: [],
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
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
      const sendPost = {
        subSchemeId: data.subSchemeId,
        // status: "Active",
        componentId: data.componentId,
        categoryId: data.categoryId,
        establishmentOfMulberryGardenEligibleAmount: data.establishmentOfMulberryGardenEligibleAmount,
        installationOfDripIrrigationEligibleAmount: data.installationOfDripIrrigationEligibleAmount,
        // landDetailId: landDetailsIds[0],
        // designationId: data.designationId,
        chawkiRearingBuildingEligibleAmount: data.chawkiRearingBuildingEligibleAmount,
        registeredPrivateChawkiDetailsRequests: privateChawkiList,
      };
      api
        .post(baseURLDBT + `registeredPrivateChawki/saveRegisteredPrivateChawki`, sendPost)
        .then((response) => {
          saveSuccess();
          clear();
          setValidated(false);
        })
        .catch((err) => {
          if (
            err.response &&
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

  const clear = () => {
    setData({
      subSchemeId: "",
    componentId:"",
    categoryId: "",
    establishmentOfMulberryGardenEligibleAmount: "",
    installationOfDripIrrigationEligibleAmount: "",
    chawkiRearingBuildingEligibleAmount: "",
    });
    designationClear();
  };

  const designationClear = () => {
    setPrivateChawkiDetails({
      rearingEquipmentDetailsId: "",
    eligibleEquipmentInNos: "",
    eligibleTotalValueInRs: "",
    ratePerEligibleEquipment: "",
    eligibleAmount: "",
    maxAmountOfSubsidyEligible: "",
    });
    setPrivateChawkiList([]);
  };

  // Handle Options
  // Designation
  const handleRearingEquipmentDetails = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setPrivateChawkiDetails({
      ...privateChawkiDetails,
      rearingEquipmentDetailsId: chooseId,
      subsidyName: chooseName,
    });
  };

  const [loading, setLoading] = useState(false);

  const [scCategoryListData, setScCategoryListData] = useState([]);
  
    const getCategoryList = () => {
      api
        .get(baseURL + `scCategory/get-all`)
        .then((response) => {
          if (response.data.content.scCategory) {
            setScCategoryListData(response.data.content.scCategory);
          }
        })
        .catch((err) => {
          setScCategoryListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
      getCategoryList();
    }, []);
  
    // to get component
    const [scComponentListData, setScComponentListData] = useState([]);
  
    const getComponentList = () => {
      api
        .get(baseURL + `scComponent/get-all`)
        .then((response) => {
          setScComponentListData(response.data.content.scComponent);
        })
        .catch((err) => {
          setScComponentListData([]);
        });
    };
  
    useEffect(() => {
      getComponentList();
    }, []);

  // to get sc-sub-scheme-details by sc-scheme-details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );
  const getSubSchemeList = () => {
    api
      .get(baseURL + `scSubSchemeDetails/get-all`)
      .then((response) => {
        if (response.data.content.scSubSchemeDetails) {
          setScSubSchemeDetailsListData(
            response.data.content.scSubSchemeDetails
          );
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);

  const [approvalListData, setApprovalListData] = useState([]);

  const getApprovalList = () => {
    const response = api
      .get(baseURL + `scApprovalStage/get-all`)
      .then((response) => {
        setApprovalListData(response.data.content.scApprovalStage);
      })
      .catch((err) => {
        setApprovalListData([]);
      });
  };

  useEffect(() => {
    getApprovalList();
  }, []);

  // to get Program
  const [rearingEquipmentDetailsData, setRearingEquipmentDetailsDataListData] = useState([]);

  const getRearingEquipmentDetailsDataList = () => {
    const response = api
      .get(baseURL + `subsidy/get-all`)
      .then((response) => {
        setRearingEquipmentDetailsDataListData(response.data.content.subsidy);
      })
      .catch((err) => {
        setRearingEquipmentDetailsDataListData([]);
      });
  };

  useEffect(() => {
    getRearingEquipmentDetailsDataList();
  }, []);


 


  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
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
    <Layout title="Calculation For Registered Private Bivoltine Chawki Rearing Center Subsidy">
      <style>{registeredPrivateChawkiStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Calculation For Registered Private Bivoltine Chawki Rearing Center Subsidy")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/registered-private-chawki-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/registered-private-chawki-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
          <Block className="mt-3">
            <Card>
            <Card.Header className="sh-section-header">
              <Icon name="setting" />
              <span>{t("Scheme Details")}</span>
            </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  
                
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Component Type")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="subSchemeId"
                            value={data.subSchemeId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.subSchemeId === undefined ||
                              data.subSchemeId === "0"
                            }
                          >
                            <option value="">{t("Select Component Type")}</option>
                            {scSubSchemeDetailsListData &&
                              scSubSchemeDetailsListData.map((list) => (
                                <option
                            key={list.scSubSchemeDetailsId}
                            value={list.scSubSchemeDetailsId} // ✅ sending numeric ID
                          >
                            {list.subSchemeName}
                          </option>
    
                              ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {t("Component Type is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>{t("Component")}</Form.Label>
                        <Form.Select
                          name="componentId"
                          value={data.componentId}
                          onChange={handleInputs}
                          required
                        >
                          <option value="">{t("Select Component")}</option>
                          {scComponentListData.map((list) => (
                            <option key={list.scComponentId} value={list.scComponentId}>
                              {list.scComponentName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Component is required")}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                
                {/* Category */}
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Category")}</Form.Label>
                      <Form.Select
                        name="categoryId"
                        value={data.categoryId}
                        onChange={handleInputs}
                        required
                      >
                        <option value="">{t("Select Category")}</option>
                        {scCategoryListData && scCategoryListData.length?(scCategoryListData.map((list) => (
                          <option key={list.scCategoryId} value={list.scCategoryId}>
                            {list.categoryName}
                          </option>
                        ))):""}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Category is required")}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            </Block>

            <Block className="mt-3">
            <Card>
            <Card.Header className="sh-section-header">
              <Icon name="package" />
              <span>{t("Establishment Of Mulberry Garden")}</span>
            </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  
                
                     <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="unitCost">
                          {t("Eligible Amount For Subsidy")} <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="establishmentOfMulberryGardenEligibleAmount"
                            name="establishmentOfMulberryGardenEligibleAmount"
                            value={data.establishmentOfMulberryGardenEligibleAmount}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Eligible Amount For Subsidy")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Eligible Amount For Subsidy is required")}
                          </Form.Control.Feedback>
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
              <Icon name="package" />
              <span>{t("Installation of Drip Irrigation")}</span>
            </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  
                
                     <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="unitCost">
                          {t("Eligible Amount For Subsidy")} <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="installationOfDripIrrigationEligibleAmount"
                            name="installationOfDripIrrigationEligibleAmount"
                            value={data.installationOfDripIrrigationEligibleAmount}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Eligible Amount For Subsidy")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Eligible Amount For Subsidy is required")}
                          </Form.Control.Feedback>
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
              <Icon name="package" />
              <span>{t("Chawki Rearing Building")}</span>
            </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  
                
                     <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="unitCost">
                          {t("Eligible Amount For Subsidy")} <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="chawkiRearingBuildingEligibleAmount"
                            name="chawkiRearingBuildingEligibleAmount"
                            value={data.chawkiRearingBuildingEligibleAmount}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Eligible Amount For Subsidy")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Eligible Amount For Subsidy is required")}
                          </Form.Control.Feedback>
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
                  <Icon name="package" />
                  <span>{t("Add Rearing Equipment Details")}</span>
                </Card.Header>
                <Card.Body>
                  {/* <h3>Virtual Bank account</h3> */}
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
                  {privateChawkiList.length > 0 ? (
                    <Row className="g-gs">
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
                                  <th>{t("Rearing Equipment Details")}</th>
                                  <th>{t("Eligible Equipment In Nos")}</th>
                                  <th>{t("Eligible Total Value in Rs")}</th>
                                  <th>{t("Rate")}</th>
                                  <th>{t("Max Amount Of Subsidy")}</th>
                                  {/* <th>Share in %</th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {privateChawkiList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGet(i)}
                                          className="d-inline-flex align-items-center gap-1 shadow-sm"
                                        >
                                          <Icon name="edit" />
                                          {t("Edit")}
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() => handleDelete(i)}
                                          className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
                                        >
                                          <Icon name="trash" />
                                          {t("delete")}
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.subsidyName}</td>
                                    <td>{item.eligibleEquipmentInNos}</td>
                                    <td>{item.eligibleTotalValueInRs}</td>
                                    <td>{item.ratePerEligibleEquipment}</td>
                                    <td>{item.maxAmountOfSubsidyEligible}</td>
                                    {/* <td>{item.scHeadAccountName}</td>
                                  <td>{item.shareInPercentage}</td> */}
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
                  <Button type="submit" variant="primary" className="sh-save-btn">
                  <Icon name="save" />
                  <span>{t("save")}</span>
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                  <Icon name="cross" />
                  <span>{t("cancel")}</span>
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="package" />
            {t("Add Rearing Equipment Details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedPrivateChawkiDetails}
            onSubmit={handleAdd}
          >
            <Row className="g-5">
              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">{("Rearing Equipment Details")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="rearingEquipmentDetailsId"
                      value={`${privateChawkiDetails.rearingEquipmentDetailsId}_${privateChawkiDetails.subsidyName}`}
                      onChange={handleRearingEquipmentDetails}
                      onBlur={() => handleRearingEquipmentDetails}
                      required
                      isInvalid={
                        privateChawkiDetails.rearingEquipmentDetailsId === undefined ||
                        privateChawkiDetails.rearingEquipmentDetailsId === "0"
                      }
                    >
                      <option value="">{t("Select Rearing Equipment Details")}</option>
                      {rearingEquipmentDetailsData && rearingEquipmentDetailsData.length ?(rearingEquipmentDetailsData.map((list) => (
                        <option
                          key={list.subsidyId}
                          value={`${list.subsidyId}_${list.subsidyName}`}
                        >
                          {list.subsidyName}
                        </option>
                     ))):""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Rearing Equipment Details is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Eligible Equipment In Nos")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="eligibleEquipmentInNos"
                      name="eligibleEquipmentInNos"
                      type="number"
                      value={privateChawkiDetails.eligibleEquipmentInNos}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Eligible Equipment In Nos")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Eligible Equipment In Nos is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Eligible Equipment Total Value in Rs")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="eligibleTotalValueInRs"
                      name="eligibleTotalValueInRs"
                      type="number"
                      value={privateChawkiDetails.eligibleTotalValueInRs}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Eligible Equipment Total Value in Rs")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Eligible Equipment Total Value in Rs is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Rate")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ratePerEligibleEquipment"
                      name="ratePerEligibleEquipment"
                      type="number"
                      value={privateChawkiDetails.ratePerEligibleEquipment}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Rate")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Rate is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Max Amount Of Subsidy Eligible(In Rs)")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="maxAmountOfSubsidyEligible"
                      name="maxAmountOfSubsidyEligible"
                      type="number"
                      value={privateChawkiDetails.maxAmountOfSubsidyEligible}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Max Amount Of Subsidy Eligible(In Rs)")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Max Amount Of Subsidy Eligible(In Rs) is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success">
                    {t("add")}
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={designationClear}
                    >
                       {t("Clear")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon name="edit" />
            {t("Edit Rearing Equipment Details")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedPrivateChawkiDetailsEdit}
            onSubmit={(e) =>
              handleUpdate(e, privateChawkiDetailsId, privateChawkiDetails)
            }
          >
            <Row className="g-5">
             <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">{("Rearing Equipment Details")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="rearingEquipmentDetailsId"
                      value={`${privateChawkiDetails.rearingEquipmentDetailsId}_${privateChawkiDetails.subsidyName}`}
                      onChange={handleRearingEquipmentDetails}
                      onBlur={() => handleRearingEquipmentDetails}
                      required
                      isInvalid={
                        privateChawkiDetails.rearingEquipmentDetailsId === undefined ||
                        privateChawkiDetails.rearingEquipmentDetailsId === "0"
                      }
                    >
                      <option value="">{t("Select Rearing Equipment Details")}</option>
                      {rearingEquipmentDetailsData && rearingEquipmentDetailsData.length ?(rearingEquipmentDetailsData.map((list) => (
                        <option
                          key={list.subsidyId}
                          value={`${list.subsidyId}_${list.subsidyName}`}
                        >
                          {list.subsidyName}
                        </option>
                     ))):""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Rearing Equipment Details is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Eligible Equipment In Nos")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="eligibleEquipmentInNos"
                      name="eligibleEquipmentInNos"
                      type="number"
                      value={privateChawkiDetails.eligibleEquipmentInNos}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Eligible Equipment In Nos")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Eligible Equipment In Nos is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Eligible Equipment Total Value in Rs")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="eligibleTotalValueInRs"
                      name="eligibleTotalValueInRs"
                      type="number"
                      value={privateChawkiDetails.eligibleTotalValueInRs}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Eligible Equipment Total Value in Rs")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Eligible Equipment Total Value in Rs is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Rate")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ratePerEligibleEquipment"
                      name="ratePerEligibleEquipment"
                      type="number"
                      value={privateChawkiDetails.ratePerEligibleEquipment}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Rate")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Rate is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="program">{t("Max Amount Of Subsidy Eligible(In Rs)")}<span className="text-danger">*</span></Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="maxAmountOfSubsidyEligible"
                      name="maxAmountOfSubsidyEligible"
                      type="number"
                      value={privateChawkiDetails.maxAmountOfSubsidyEligible}
                      onChange={handleMapInputs}
                      placeholder={t("Enter Max Amount Of Subsidy Eligible(In Rs)")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Max Amount Of Subsidy Eligible(In Rs) is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                  <div className="gap-col">
                    <Button type="submit" variant="success">
                    {t("update")}
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={designationClear}
                    >
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

const registeredPrivateChawkiStyles = `
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
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1.5px solid #dbe4ee;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:hover,
  .sh-form-wrap .form-select:hover {
    border-color: #9fc0e0;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #1e67a8;
    box-shadow: 0 0 0 0.2rem rgba(30, 103, 168, 0.15);
  }
  .sh-form-wrap .form-control[readonly] {
    background-color: #f4f6f9;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a;
  }
  .sh-form-wrap .text-danger {
    color: #e3496a !important;
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
    border-left: none !important;
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
  .sh-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-save-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(30, 103, 168, 0.32);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
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
  .sh-modal-content .form-control.is-invalid,
  .sh-modal-content .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-modal-content .text-danger {
    font-weight: 700;
    margin-left: 3px;
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

export default RegisteredPrivateChawki;
