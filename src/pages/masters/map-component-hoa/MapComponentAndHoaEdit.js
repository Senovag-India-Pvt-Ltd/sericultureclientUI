import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { act } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function MapComponentAndHoaEdit() {
  // Translation
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
        id: id,
        schemeId: data.schemeId,
        subSchemeId: data.subSchemeId,
        scComponentId: data.scComponentId,
        // landDetailId: landDetailsIds[0],
        unitCostInRupees: data.unitCostInRupees,
        measurementUnit: data.measurementUnit,
        isFullPrice: data.isFullPrice,
        minQty: data.minQty,
        maxQty: data.maxQty,
        maxAmount: data.maxAmount,
        minAmount: data.minAmount,
        schemeQuotaId: data.schemeQuotaId,
        stepName: data.stepName,

        categoryId: data.categoryId,
        shareInPercentage: data.shareInPercentage,
        headOfAccountId: data.headOfAccountId,
        designationId: data.designationId,
        // landDetailId: landDetailsIds[0],
        amount: data.amount,
        min: data.min,
        max: data.max,
        releaseNo: data.releaseNo,
        releaseDate: data.releaseDate,
      };
      api
        .post(baseURLDBT + `master/cost/editMapComponentDetails`, sendPost)
        .then((response) => {
          updateSuccess();
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
              updateError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
        schemeId: "",
        subSchemeId: "",
        scComponentId: "",
        // landDetailId: landDetailsIds[0],
        unitCostInRupees: "",
        measurementUnit: "",
        isFullPrice: "",
        minQty: "",
        maxQty: "",
        maxAmount: "",
        minAmount: "",
        schemeQuotaId: "",
        stepName: "",

        categoryId: "",
        shareInPercentage: "",
        headOfAccountId: "",
        designationId: "",
        // landDetailId: landDetailsIds[0],
        amount: "",
        min: "",
        max: "",
        releaseNo: "",
        releaseDate: "",
    });
  };


  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `master/cost/getMapComponentRequest/get/${id}`)
      .then((response) => {
        const res = response.data.content;
        setData((prev) => ({
          ...prev,
        
        schemeId: res.schemeId,
        subSchemeId: res.subSchemeId,
        scComponentId: res.scComponentId,
        // landDetailId: landDetailsIds[0],
        unitCostInRupees: res.unitCostInRupees,
        measurementUnit: res.measurementUnit,
        isFullPrice: res.isFullPrice,
        minQty: res.minQty,
        maxQty: res.maxQty,
        maxAmount: res.maxAmount,
        minAmount: res.minAmount,
        schemeQuotaId: res.schemeQuotaId,
        stepName: res.stepName,

        categoryId: res.categoryId,
        shareInPercentage: res.shareInPercentage,
        headOfAccountId: res.headOfAccountId,
        designationId: res.designationId,
        // landDetailId: landDetailsIds[0],
        amount: res.amount,
        min: res.min,
        max: res.max,
        releaseNo: res.releaseNo,
        releaseDate: res.releaseDate,
        }));
        setLoading(false);
      })
      .catch((err) => {
        setData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);
  
  

  // to get get Scheme
  const [schemeListData, setSchemeListData] = useState([]);

  const getSchemeList = () => {
    const response = api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((response) => {
        setSchemeListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setSchemeListData([]);
      });
  };

  useEffect(() => {
    getSchemeList();
  }, []);

  // to get Sub Scheme
  const [subSchemeListData, setSubSchemeListData] = useState([]);

  const getSubSchemeList = () => {
    const response = api
      .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
      .then((response) => {
        setSubSchemeListData(response.data.content.scSubSchemeDetails);
      })
      .catch((err) => {
        setSubSchemeListData([]);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);

  // to get designation
  const [designationListData, setDesignationListData] = useState([]);

  const getDesignationList = () => {
    const response = api
      .get(baseURLMasterData + `designation/get-all`)
      .then((response) => {
        setDesignationListData(response.data.content.designation);
      })
      .catch((err) => {
        setDesignationListData([]);
      });
  };

  useEffect(() => {
    getDesignationList();
  }, []);


   // to get Scheme Quota
   const [schemeQuotaListData, setSchemeQuotaListData] = useState([]);

   const getSchemeQuotaList = () => {
     const response = api
       .get(baseURLMasterData + `schemeQuota/get-all`)
       .then((response) => {
        setSchemeQuotaListData(response.data.content.schemeQuota);
       })
       .catch((err) => {
        setSchemeQuotaListData([]);
       });
   };
 
   useEffect(() => {
    getSchemeQuotaList();
   }, []);

   // to get Component
   const [scComponentListData, setScComponentListData] = useState([]);

   const getScComponentList = () => {
      api
       .get(baseURLMasterData + `scComponent/get-all`)
       .then((response) => {
        setScComponentListData(response.data.content.scComponent);
       })
       .catch((err) => {
        setScComponentListData([]);
       });
   };
 
   useEffect(() => {
    getScComponentList();
   }, []);

   // get head of Account Id
   const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
   const getHeadAccountList = () => {
     api
     .get(baseURLMasterData + `scHeadAccount/get-all`)
     .then((response) => {
       if (response.data.content.scHeadAccount) {
        setScHeadAccountListData(response.data.content.scHeadAccount);
       }
     })
     .catch((err) => {
        setScHeadAccountListData([]);
       // alert(err.response.data.errorMessages[0].message[0].message);
     });
 };

 useEffect(() => {
    getHeadAccountList();
 }, []);

   // get category list
  const [scCategoryListData, setScCategoryListData] = useState([]);
  const getCategoryList = () => {
    api
      .get(baseURLMasterData + `scCategory/get-all`)
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

  const handleCheckBox = (e) => {
    // setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
    setData((prev) => ({
      ...prev,
      isFullPrice: e.target.checked,
    }));
  };

  

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };
  

  return (
    <Layout title="Edit Map Component And Head Of Account Details">
      <style>{mapComponentEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Edit Map Component And Head Of Account Details")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/map-component-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/map-component-list"
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
                <Icon name="edit" />
                <span>{t("Component Details")}</span>
              </Card.Header>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                 <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Select Scheme")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="schemeId"
                        value={data.schemeId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.schemeId === undefined ||
                          data.schemeId === "0"
                        }
                      >
                        <option value="">{t("Select Scheme")}</option>
                        {schemeListData &&
                          schemeListData.map((list) => (
                            <option
                              key={list.scSchemeDetailsId}
                              value={list.scSchemeDetailsId}
                            >
                              {list.schemeName}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Scheme is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Scheme Quota")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="schemeQuotaId"
                        value={data.schemeQuotaId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.schemeQuotaId === undefined ||
                          data.schemeQuotaId === "0"
                        }
                      >
                        <option value="">{t("Select Scheme Quota")}</option>
                        {schemeQuotaListData &&
                            schemeQuotaListData.map((list) => (
                            <option
                              key={list.schemeQuotaId}
                              value={list.schemeQuotaId}
                            >
                              {list.schemeQuotaName}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Scheme Quota is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

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
                        {subSchemeListData &&
                          subSchemeListData.map((list) => (
                            <option
                              key={list.scSubSchemeDetailsId}
                              value={list.scSubSchemeDetailsId}
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
                    <Form.Label>
                      {t("Component")} 
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="scComponentId"
                        value={data.scComponentId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // required
                        isInvalid={
                          data.scComponentId === undefined ||
                          data.scComponentId === "0"
                        }
                      >
                        <option value="">{t("Select Component")} </option>
                        {scComponentListData &&
                          scComponentListData.map((list) => (
                            <option
                              key={list.scComponentId}
                              value={list.scComponentId}
                            >
                              {list.scComponentName}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                      {t("Component  is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

       

                <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidend">
                            {t("Unit Cost")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="unitCostInRupees"
                              name="unitCostInRupees"
                              value={data.unitCostInRupees}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter  Unit Cost")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            {t("Unit Cost is required")}
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>


                      <Col lg="6">

                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Measurement Unit")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="measurementUnit"
                        value={data.measurementUnit}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.measurementUnit === undefined ||
                          data.measurementUnit === "0"
                        }
                      >
                        <option value="">{t("Select Measurement Unit")}</option>
                        <option value="1">SQFT</option>
                        <option value="2">QTY</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                      {t("Measurement Unit is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

               

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidend">
                            {t("Min QTY")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="minQty"
                              name="minQty"
                              value={data.minQty}
                              onChange={handleInputs}
                              type="number"
                              placeholder={t("Enter Min QTY")}
                              // required
                            />
                            <Form.Control.Feedback type="invalid">
                            {t("Min QTY is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="secbidstart">
                           {t("Max QTY")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="maxQty"
                              name="maxQty"
                              value={data.maxQty}
                              onChange={handleInputs}
                              type="number"
                              placeholder={t("Enter Max QTY")}
                              // required
                            />
                            <Form.Control.Feedback type="invalid">
                           {t("Max QTY is required")}
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="secbidstart">
                          {t("Minimum Amount")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="minAmount"
                              name="minAmount"
                              value={data.minAmount}
                              onChange={handleInputs}
                              type="number"
                              placeholder={t("Enter Minimum Amount")}
                              // required
                            />
                            <Form.Control.Feedback type="invalid">
                            {t("Minimum Amount is required")}
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="secbidstart">
                           {t("Maximum Amount")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="maxAmount"
                              name="maxAmount"
                              value={data.maxAmount}
                              onChange={handleInputs}
                              type="number"
                              placeholder={t("Enter Maximum Amount")}
                              // required
                            />
                            <Form.Control.Feedback type="invalid">
                            {t("Maximum Amount is required")}
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>
                    
                      <Col lg="6">
                        <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          id="isFullPrice"
                          checked={data.isFullPrice}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={11} className="mt-n2">
                        {t("Select For Unit Cost Schemes")}
                      </Form.Label>
                    </Form.Group>
                      </Col>
                </Row>
              </Card.Body>
            </Card>
            </Block>

          <Block className="mt-3">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="setting" />
                <span>{t("Edit Category And Head Of Account Details")}</span>
              </Card.Header>
              <Card.Body>
              <Row className="g-gs">
              <Col lg="4">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">{t("Category")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="categoryId"
                      value={data.categoryId}
                      onChange={handleInputs}
                      onBlur={() => handleInputs}
                      required
                      isInvalid={
                        data.categoryId === undefined ||
                        data.categoryId === "0"
                      }
                    >
                      <option value="">{t("Select Category")}</option>
                      {scCategoryListData.map((list) => (
                        <option
                          key={list.scCategoryId}
                          value={list.scCategoryId}
                        >
                          {list.codeNumber}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Category is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

               <Col lg="4">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">{t("Head Of Account")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="headOfAccountId"
                      value={data.headOfAccountId}
                      onChange={handleInputs}
                      onBlur={() => handleInputs}
                      required
                      isInvalid={
                        data.headOfAccountId === undefined ||
                        data.headOfAccountId === "0"
                      }
                    >
                      <option value="">{t("Select Head Of Account")}</option>
                      {scHeadAccountListData.map((list) => (
                        <option
                          key={list.scHeadAccountId}
                          value={list.scHeadAccountId}
                        >
                          {list.scHeadAccountName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Head Of Account is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
              <Form.Group className="form-group mt-n4">
                <Form.Label>
                  {t("Share in %")} <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="shareInPercentage"
                    name="shareInPercentage"
                    value={data.shareInPercentage}
                    onChange={handleInputs}
                    type="number"
                    placeholder={t("Enter Share in %")}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {t("Share in % is required")}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>


            <Col lg="4">
              <Form.Group className="form-group mt-n4">
                <Form.Label>
                  {t("Release No")} 
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="releaseNo"
                    name="releaseNo"
                    value={data.releaseNo}
                    onChange={handleInputs}
                    type="text"
                    placeholder={t("Release No")}
                    required
                  />
                </div>
              </Form.Group>
            </Col>

            
                       
            <Col lg="6">
  <Form.Group className="form-group mt-n4">
    <Form.Label htmlFor="releaseDate">
      {t("Release Date")}
      {/* <span className="text-danger">*</span> */}
    </Form.Label>

    <div className="form-control-wrap">
      <DatePicker
        // ✅ FIXED: replaced mapComponent with data
        selected={data.releaseDate ? new Date(data.releaseDate) : null}
        // ✅ FIXED: replaced setMapComponent with setData and updated state accordingly
        onChange={(date) =>
          setData({
            ...data,
            releaseDate: date,
          })
        }
        dateFormat="dd/MM/yyyy"
        className="form-control"
        placeholderText={t("Select Release Date")}
        required
      />
      {/* <Form.Control.Feedback type="invalid">
        {t("Release Date is required")}
      </Form.Control.Feedback> */}
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
                <span>{t("Edit Drawing Officers Details")}</span>
              </Card.Header>
              <Card.Body>
              <Row className="g-gs">
              <Col lg="4">
                    <Form.Group>
                        <Form.Label>{t("Designation")} <span className="text-danger">*</span></Form.Label>
                        <div className="form-control-wrap">
                        <Form.Select
                            name="designationId"
                            value={data.designationId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                                data.designationId === undefined ||
                                data.designationId === "0"
                            }
                            >
                            <option value="">{t("Select Designation")}</option>
                            {designationListData.map((list) => (
                                <option
                                key={list.designationId}
                                value={list.designationId}
                                >
                                {list.name}
                                </option>
                            ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                            {t("Designation is required")}
                            </Form.Control.Feedback>
                        </div>
                        </Form.Group>
                    </Col>

                <Col lg="4">
                    <Form.Group>
                    <Form.Label>{t("Amount")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="text"
                        name="amount"
                        value={data.amount || ""}
                        onChange={handleInputs}
                        placeholder={t("Enter Amount")}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {t("Amount is required")}
                    </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col lg="4">
                    <Form.Group>
                    <Form.Label>{t("Min")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="text"
                        name="min"
                        value={data.min || ""}
                        onChange={handleInputs}
                        placeholder={t("Enter Min Value")}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {t("Min is required")}
                    </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col lg="4">
                    <Form.Group>
                    <Form.Label>{t("Max")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="text"
                        name="max"
                        value={data.max || ""}
                        onChange={handleInputs}
                        placeholder={t("Enter Max Value")}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {t("Max is required")}
                    </Form.Control.Feedback>
                    </Form.Group>
                </Col>
              </Row>
              </Card.Body>
            </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary" className="sh-save-btn">
                  <Icon name="save" />
                  {t("update")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                  <Icon name="cross" />
                  {t("cancel")}
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

const mapComponentEditStyles = `
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
  .sh-form-wrap .card-header {
    border-bottom: none !important;
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
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #2b3a55;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #dbe4f0;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff !important;
    color: #c43257 !important;
    border: 1px solid #e3496a !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }
  .sh-cancel-btn:hover {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%) !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }
`;

export default MapComponentAndHoaEdit;
