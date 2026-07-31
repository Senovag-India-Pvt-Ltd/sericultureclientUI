import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../components";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 


const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MapComponent() {
    // Translation
    const { t } = useTranslation();
  const [mapList, setMapList] = useState([]);
  const [mapComponent, setMapComponent] = useState({
    categoryId: "",
    shareInPercentage: "",
    headOfAccountId: "",
    designationId: "",
    amount: "",
    min: "",
    max: "",
    releaseNo: "",
    releaseDate: "",
    // unitCostInRupees: "",

  });

  const [validated, setValidated] = useState(false);
  const [validatedMapComponent, setValidatedMapComponent] = useState(false);
  const [validatedMapComponentEdit, setValidatedMapComponentEdit] =
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
      setValidatedMapComponent(true);
    } else {
      e.preventDefault();
      setMapList((prev) => [...prev, mapComponent]);
      setMapComponent({
        categoryId: "",
        shareInPercentage: "",
        headOfAccountId: "",
        designationId: "",
        amount: "",
        min: "",
        max: "",
        releaseNo: "",
    releaseDate: "",
      });
      setShowModal(false);
      setValidatedMapComponent(false);
    }
  };

  const handleDelete = (i) => {
    setMapList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [mapComponentId, setMapComponentId] = useState();
  const handleGet = (i) => {
    setMapComponent(mapList[i]);
    setShowModal2(true);
    setMapComponentId(i);
  };

  console.log(mapList);

  const handleUpdate = (e, i, changes) => {
    setMapList((prev) =>
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
      setValidatedMapComponentEdit(true);
    } else {
      e.preventDefault();
      setShowModal2(false);
      setValidatedMapComponentEdit(false);
      setMapComponent({
        categoryId: "",
        shareInPercentage: "",
        headOfAccountId: "",
        designationId: "",
        amount: "",
        min: "",
        max: "",
        releaseNo: "",
    releaseDate: "",
      });
    }
  };

  const handleMapInputs = (e) => {
    const { name, value } = e.target;
    setMapComponent({ ...mapComponent, [name]: value });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);


  const [data, setData] = useState({
    // headOfAccountId: "",
    schemeId: "",
    subSchemeId: "",
    scComponentId: "",
    unitCostInRupees:"",
    measurementUnit: "",
    isFullPrice: "",
    minQty: "",
    maxQty: "",
    maxAmount: "",
    minAmount: "",
    schemeQuotaId: "", 
    unitCostDetailsRequests: []
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
        headOfAccountId: data.headOfAccountId,
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
        unitCostDetailsRequests: mapList,

        
      };
      api
        .post(baseURLDBT + `master/cost/saveUnitCost`, sendPost)
        .then((response) => {
          // if (response.data.content.error) {
          //   saveError(response.data.content.error_description);
          // } else {
            saveSuccess();
            // setData({
            //   headOfAccountId: "",
            //   schemeId: "",
            //   subSchemeId: "",
            //   scComponentId: "",
            //   unitType:"",
            //   measurementUnit: "",
            //   isFullPrice: "",
            //   minQty: "",
            //   maxQty: "",
            //   maxAmount: "",
            //   minAmount: "",
            //   schemeQuotaId: "",
            // });
            clear();
            setValidated(false);
          // }
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
      // headOfAccountId: "",
      schemeId: "",
      subSchemeId: "",
      scComponentId: "",
      unitCostInRupees:"",
      measurementUnit: "",
      isFullPrice: "",
      minQty: "",
      maxQty: "",
      maxAmount: "",
      minAmount: "",
      schemeQuotaId: "",

    });
    mapComponentClear();
  };

  const mapComponentClear = () => {
    setMapComponent({
        categoryId: "",
        shareInPercentage: "",
        headOfAccountId: "",
        designationId: "",
        amount: "",
        min: "",
        max: "",
        releaseNo: "",
    releaseDate: "",
    });
    setMapList([])
  };

  const handleCheckBox = (e) => {
    // setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
    setData((prev) => ({
      ...prev,
      isFullPrice: e.target.checked,
    }));
  };

  // Handle Options
  // TrainerUser
  const handleMapComponentOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setMapComponent({
      ...mapComponent,
      categoryId: chooseId,
      codeNumber: chooseName,
    });
  };

  const handleHeadOfAccountOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setMapComponent({
      ...mapComponent,
      headOfAccountId: chooseId,
      scHeadAccountName: chooseName,
    });
  };

  const handleDesignationOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setMapComponent({
      ...mapComponent,
      designationId: chooseId,
      name: chooseName,
    });
  };


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



  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
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
    <Layout title="Map Component And Head Of Account">
      <style>{mapComponentStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Map Component And Head Of Account")}</Block.Title>
              {/* <nav>
                <ol className="breadcrumb breadcrumb-arrow mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/seriui/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Renew License to Reeler List</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Market
                  </li>
                </ol>
              </nav> */}
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
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="setting" />
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

                
                {/* <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Category
                    </Form.Label>
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
                        <option value="">Select Category</option>
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
                        Category is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

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
                      

                      {/* <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="secbidstart">
                           Unit Cost In Rupees
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="unitCostInRupees"
                              name="unitCostInRupees"
                              value={data.unitCostInRupees}
                              onChange={handleInputs}
                              type="number"
                              placeholder="Enter Unit Cost In Rupees"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Unit Cost In Rupees is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col> */}

                

                {/* <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Component
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="scComponentId"
                        value={data.scComponentId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.scComponentId === undefined ||
                          data.scComponentId === "0"
                        }
                      >
                        <option value="">Select Component</option>
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
                        Component is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}


                      {/* <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidstart">
                            Share in %
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="shareInPercentage"
                              name="shareInPercentage"
                              value={data.shareInPercentage}
                              onChange={handleInputs}
                              type="number"
                              placeholder="Enter Share in %"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Share in % is required
                            </Form.Control.Feedback>
                           
                          </div>
                        </Form.Group>
                      </Col> */}
                      <Col lg="6">
                        {/* <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidstart">
                            Full Price
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="ifFullPrice"
                              name="ifFullPrice"
                              value={data.ifFullPrice}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Full Price"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Full Price is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group> */}

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

            <Block className="mt-3">
            <Card>
              <Card.Header className="sh-section-header"><Icon name="package" /><span>{t("Add the Category Details and Assign the Drawing Officers")}</span></Card.Header>
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
                              <span>{t("Add")}</span>
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="d-none d-md-inline-flex"
                              variant="primary"
                              onClick={handleShowModal}
                            >
                              <Icon name="plus" />
                              <span>{t("Add")}</span>
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                {mapList.length > 0 ? (
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
                                <th>{t("Category")}</th>
                                <th>{t("Head Of Account")}</th>
                                <th>{t("Share in %")}</th>
                                <th>{t("Designation")}</th>
                                <th>{t("Amount")}</th>
                                <th>{t("Min")}</th>
                                <th>{t("Max")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mapList.map((item, i) => (
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
                                  <td>{item.codeNumber}</td>
                                  <td>{item.scHeadAccountName}</td>
                                  <td>{item.shareInPercentage}</td>
                                  <td>{item.name}</td>
                                  <td>{item.amount}</td>
                                  <td>{item.min}</td>
                                  <td>{item.max}</td>
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
                  <Button type="submit" variant="primary" className="sh-save-btn">
                  <Icon name="save" />
                  {t("save")}
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

      {/* <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{t("Add Category Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedMapComponent}
            onSubmit={handleAdd}
          >
            <Row className="g-5">
            <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                    {t("Category")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="categoryId"
                        value={`${mapComponent.categoryId}_${mapComponent.codeNumber}`}
                        onChange={handleMapComponentOption}
                        onBlur={() => handleMapComponentOption}
                        required
                        isInvalid={
                          mapComponent.categoryId === undefined ||
                          mapComponent.categoryId === "0"
                        }
                      >
                        <option value="">{t("Select Category")}</option>
                        {scCategoryListData.map((list) => (
                          <option
                            key={list.scCategoryId}
                            value={`${list.scCategoryId}_${list.codeNumber}`}
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

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Head Of Account")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="headOfAccountId"
                        value={`${mapComponent.headOfAccountId}_${mapComponent.scHeadAccountName}`}
                        onChange={handleHeadOfAccountOption}
                        onBlur={() => handleHeadOfAccountOption}
                        // multiple
                        required
                        isInvalid={
                          mapComponent.headOfAccountId === undefined ||
                          mapComponent.headOfAccountId === "0"
                        }
                      >
                        <option value="">{t("Select Head Of Account")}</option>
                        {scHeadAccountListData.map((list) => (
                          <option
                            key={list.scHeadAccountId}
                            value={`${list.scHeadAccountId}_${list.scHeadAccountName}`}
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

                
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidstart">
                          {t("Share in %")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="shareInPercentage"
                              name="shareInPercentage"
                              value={mapComponent.shareInPercentage}
                              onChange={handleMapInputs}
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

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    <Button type="submit" variant="success">
                      {t("Add")}
                    </Button>
                  </div>
                  
                  <div className="gap-col">
                    
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={mapComponentClear}
                    >
                      {t("Clear")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal> */}

      <Modal show={showModal} onHide={handleCloseModal} size="xl" contentClassName="sh-modal-content">
      <Modal.Header closeButton>
        <Modal.Title><Icon name="plus" />{t("Add Category Details and Drawing Officers")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validatedMapComponent} onSubmit={handleAdd}>
          <Row className="g-5">
            {/* ---------------- Existing Category Fields ---------------- */}
            <Col lg="6">
              <Form.Group className="form-group mt-n3">
                <Form.Label>{t("Category")}</Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="categoryId"
                    value={`${mapComponent.categoryId}_${mapComponent.codeNumber}`}
                    onChange={handleMapComponentOption}
                    required
                    isInvalid={
                      mapComponent.categoryId === undefined ||
                      mapComponent.categoryId === "0"
                    }
                  >
                    <option value="">{t("Select Category")}</option>
                    {scCategoryListData.map((list) => (
                      <option
                        key={list.scCategoryId}
                        value={`${list.scCategoryId}_${list.codeNumber}`}
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

            <Col lg="6">
              <Form.Group className="form-group mt-n3">
                <Form.Label>
                  {t("Head Of Account")} <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Select
                    name="headOfAccountId"
                    value={`${mapComponent.headOfAccountId}_${mapComponent.scHeadAccountName}`}
                    onChange={handleHeadOfAccountOption}
                    required
                    isInvalid={
                      mapComponent.headOfAccountId === undefined ||
                      mapComponent.headOfAccountId === "0"
                    }
                  >
                    <option value="">{t("Select Head Of Account")}</option>
                    {scHeadAccountListData.map((list) => (
                      <option
                        key={list.scHeadAccountId}
                        value={`${list.scHeadAccountId}_${list.scHeadAccountName}`}
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

            <Col lg="6">
              <Form.Group className="form-group mt-n4">
                <Form.Label>
                  {t("Share in %")} <span className="text-danger">*</span>
                </Form.Label>
                <div className="form-control-wrap">
                  <Form.Control
                    id="shareInPercentage"
                    name="shareInPercentage"
                    value={mapComponent.shareInPercentage}
                    onChange={handleMapInputs}
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

           <Col lg="6">
  <Form.Group className="form-group mt-n4">
    <Form.Label htmlFor="bidstart">
      {t("Release No")}
    </Form.Label>
    <div className="form-control-wrap">
      <Form.Control
        id="releaseNo"
        name="releaseNo"
        value={data.releaseNo}
        onChange={handleMapInputs}
        type="text"
        placeholder="Enter Release No"
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
        selected={
          mapComponent.releaseDate
            ? new Date(mapComponent.releaseDate)
            : null
        }
        onChange={(date) =>
          setMapComponent({
            ...mapComponent,
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

            {/* ---------------- New Card for Drawing Officers ---------------- */}
            <Col lg="12" className="mt-4">
              <Card>
                <Card.Header className="sh-section-header"><Icon name="plus" /><span>{t("Add Drawing Officers details")}</span></Card.Header>
                <Card.Body>
                  <Row className="g-3">
                     <Col lg="6">
                        <Form.Group>
                          <Form.Label>{t("Designation")} <span className="text-danger">*</span></Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="designationId"
                              value={`${mapComponent.designationId}_${mapComponent.name}`}
                              onChange={handleDesignationOption}
                              required
                              isInvalid={
                                mapComponent.designationId === undefined ||
                                mapComponent.designationId === "0"
                              }
                            >
                              <option value="">{t("Select Designation")}</option>
                              {designationListData.map((list) => (
                                <option
                                  key={list.designationId}
                                  value={`${list.designationId}_${list.name}`}
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

                    <Col lg="6">
                      <Form.Group>
                        <Form.Label>{t("Amount")} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="amount"
                          value={mapComponent.amount || ""}
                          onChange={handleMapInputs}
                          placeholder={t("Enter Amount")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Amount is required")}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group>
                        <Form.Label>{t("Min")} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="min"
                          value={mapComponent.min || ""}
                          onChange={handleMapInputs}
                          placeholder={t("Enter Min Value")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Min is required")}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group>
                        <Form.Label>{t("Max")} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="max"
                          value={mapComponent.max || ""}
                          onChange={handleMapInputs}
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
            </Col>

            {/* ---------------- Buttons ---------------- */}
            <Col lg="12" className="mt-3">
              <div className="d-flex justify-content-center gap g-2">
                <div className="gap-col">
                  <Button type="submit" variant="success" className="sh-save-btn">
                    <Icon name="plus" />
                    {t("Add")}
                  </Button>
                </div>
                <div className="gap-col">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={mapComponentClear}
                    className="sh-cancel-btn"
                  >
                    <Icon name="cross" />
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
          <Modal.Title><Icon name="edit" />{t("Edit Category Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedMapComponentEdit}
            onSubmit={(e) => handleUpdate(e, mapComponentId, mapComponent)}
          >
            <Row className="g-5">
            <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Category")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="categoryId"
                        value={`${mapComponent.categoryId}_${mapComponent.codeNumber}`}
                        onChange={handleMapComponentOption}
                        onBlur={() => handleMapComponentOption}
                        required
                        isInvalid={
                          mapComponent.categoryId === undefined ||
                          mapComponent.categoryId === "0"
                        }
                      >
                        <option value="">{t("Select Category")}</option>
                        {scCategoryListData.map((list) => (
                          <option
                            key={list.scCategoryId}
                            value={`${list.scCategoryId}_${list.codeNumber}`}
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

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      {t("Head Of Account")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="headOfAccountId"
                        value={`${mapComponent.headOfAccountId}_${mapComponent.scHeadAccountName}`}
                        onChange={handleHeadOfAccountOption}
                        onBlur={() => handleHeadOfAccountOption}
                        // multiple
                        required
                        isInvalid={
                          mapComponent.headOfAccountId === undefined ||
                          mapComponent.headOfAccountId === "0"
                        }
                      >
                        <option value="">{t("Select Head Of Account")}</option>
                        {scHeadAccountListData.map((list) => (
                          <option
                            key={list.scHeadAccountId}
                            value={`${list.scHeadAccountId}_${list.scHeadAccountName}`}
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

              

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidstart">
                            {t("Share in %")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="shareInPercentage"
                              name="shareInPercentage"
                              value={mapComponent.shareInPercentage}
                              onChange={handleMapInputs}
                              type="number"
                              placeholder="Enter Share in %"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            {t("Share in % is required")}
                            </Form.Control.Feedback>
                           
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="12" className="mt-4">
                      <Card>
                        <Card.Header className="sh-section-header"><Icon name="edit" /><span>{t("Edit Drawing Officers details")}</span></Card.Header>
                        <Card.Body>
                          <Row className="g-3">
                            <Col lg="6">
                                <Form.Group>
                                  <Form.Label>{t("Designation")} <span className="text-danger">*</span></Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="designationId"
                                      value={`${mapComponent.designationId}_${mapComponent.name}`}
                                      onChange={handleDesignationOption}
                                      required
                                      isInvalid={
                                        mapComponent.designationId === undefined ||
                                        mapComponent.designationId === "0"
                                      }
                                    >
                                      <option value="">{t("Select Designation")}</option>
                                      {designationListData.map((list) => (
                                        <option
                                          key={list.designationId}
                                          value={`${list.designationId}_${list.name}`}
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

                            <Col lg="6">
                              <Form.Group>
                                <Form.Label>{t("Amount")} <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="text"
                                  name="amount"
                                  value={mapComponent.amount || ""}
                                  onChange={handleMapInputs}
                                  placeholder={t("Enter Amount")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Amount is required")}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            <Col lg="6">
                              <Form.Group>
                                <Form.Label>{t("Min")} <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="text"
                                  name="min"
                                  value={mapComponent.min || ""}
                                  onChange={handleMapInputs}
                                  placeholder={t("Enter Min Value")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Min is required")}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            <Col lg="6">
                              <Form.Group>
                                <Form.Label>{t("Max")} <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="text"
                                  name="max"
                                  value={mapComponent.max || ""}
                                  onChange={handleMapInputs}
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
                    </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">

                    <Button type="submit" variant="success" className="sh-save-btn">
                    <Icon name="save" />
                    {t("update")}
                    </Button>
                  </div>

                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={mapComponentClear}
                      className="sh-cancel-btn"
                    >
                      <Icon name="cross" />
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

const mapComponentStyles = `
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
  .sh-modal-content {
    border: none;
    border-radius: 14px;
    overflow: hidden;
  }
  .sh-modal-content .modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-bottom: none;
    padding: 18px 24px;
  }
  .sh-modal-content .modal-title {
    color: #ffffff;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sh-modal-content .btn-close {
    filter: invert(1) brightness(200%);
  }
`;

export default MapComponent;
