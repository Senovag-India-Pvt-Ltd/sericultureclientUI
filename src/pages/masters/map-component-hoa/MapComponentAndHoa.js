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

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MapComponent() {
  const [mapList, setMapList] = useState([]);
  const [mapComponent, setMapComponent] = useState({
    categoryId: "",
    shareInPercentage: "",
    unitCostInRupees: "",
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
        unitCostInRupees: "",
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
        unitCostInRupees: "",
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
    headOfAccountId: "",
    schemeId: "",
    subSchemeId: "",
    scComponentId: "",
    unitType:"",
    measurementUnit: "",
    isFullPrice: "",
    minQty: "",
    maxQty: "",
    maxAmount: "",
    minAmount: "",
    schemeQuotaId: "", 
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
      // event.stopPropagation();
      api
        .post(baseURLDBT + `master/cost/saveUnitCost`, data)
        .then((response) => {
          // if (response.data.content.error) {
          //   saveError(response.data.content.error_description);
          // } else {
            saveSuccess();
            setData({
              headOfAccountId: "",
              schemeId: "",
              subSchemeId: "",
              scComponentId: "",
              unitType:"",
              measurementUnit: "",
              isFullPrice: "",
              minQty: "",
              maxQty: "",
              maxAmount: "",
              minAmount: "",
              schemeQuotaId: "",
            });
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
      headOfAccountId: "",
      schemeId: "",
      subSchemeId: "",
      scComponentId: "",
      unitType:"",
      measurementUnit: "",
      isFullPrice: "",
      minQty: "",
      maxQty: "",
      maxAmount: "",
      minAmount: "",
      schemeQuotaId: "",

    });
  };

  const mapComponentClear = () => {
    setMapComponent({
      categoryId: "",
        shareInPercentage: "",
        unitCostInRupees: "",
    });
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
      categoryName: chooseName,
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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Map Component And Head Of Account</Block.Title>
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
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/map-component-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
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
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Select Scheme
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
                        <option value="">Select Scheme</option>
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
                        Scheme is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Scheme Quota
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
                        <option value="">Select Scheme Quota</option>
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
                        Scheme Quota is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Component Type
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
                        <option value="">Select Component Type</option>
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
                      Component Type is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Component 
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
                        <option value="">Select Component </option>
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
                      Component  is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>



                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Head Of Account
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="headOfAccountId"
                        value={data.headOfAccountId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        // multiple
                        required
                        isInvalid={
                          data.headOfAccountId === undefined ||
                          data.headOfAccountId === "0"
                        }
                      >
                        <option value="">Select Head Of Account</option>
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
                      Head Of Account is required
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
                            Unit Cost
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="unitType"
                              name="unitType"
                              value={data.unitType}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter  Unit Cost"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Unit Cost is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>


                      <Col lg="6">

                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Measurement Unit
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
                        <option value="">Select Measurement Unit</option>
                        <option value="1">SQFT</option>
                        <option value="2">QTY</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                      Measurement Unit is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

               

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidend">
                            Min QTY
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="minQty"
                              name="minQty"
                              value={data.minQty}
                              onChange={handleInputs}
                              type="number"
                              placeholder="Enter Min QTY"
                              // required
                            />
                            <Form.Control.Feedback type="invalid">
                            Min QTY is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="secbidstart">
                           Max QTY
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="maxQty"
                              name="maxQty"
                              value={data.maxQty}
                              onChange={handleInputs}
                              type="number"
                              placeholder="Enter Max QTY"
                              // required
                            />
                            <Form.Control.Feedback type="invalid">
                            Max QTY is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="secbidstart">
                           Maximum Amount
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="maxAmount"
                              name="maxAmount"
                              value={data.maxAmount}
                              onChange={handleInputs}
                              type="number"
                              placeholder="Enter Maximum Amount"
                              // required
                            />
                            <Form.Control.Feedback type="invalid">
                            Maximum Amount is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="secbidstart">
                          Minimum Amount
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="minAmount"
                              name="minAmount"
                              value={data.minAmount}
                              onChange={handleInputs}
                              type="number"
                              placeholder="Enter Minimum Amount"
                              // required
                            />
                            <Form.Control.Feedback type="invalid">
                            Minimum Amount is required
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
                        Full Price 
                      </Form.Label>
                    </Form.Group>
                      </Col>
                  </Row>    
              </Card.Body>
            </Card>

            <Block className="mt-3">
            <Card>
              <Card.Header>Add Trainer</Card.Header>
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
                              <span>Add</span>
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="d-none d-md-inline-flex"
                              variant="primary"
                              onClick={handleShowModal}
                            >
                              <Icon name="plus" />
                              <span>Add</span>
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
                                <th>Action</th>
                                <th>Category</th>
                                <th>Unit Of Cost In Rupees</th>
                                <th>Share in %</th>
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
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(i)}
                                        className="ms-2"
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </td>
                                  <td>{item.categoryId}</td>
                                  <td>{item.unitCostInRupees}</td>
                                  <td>{item.shareInPercentage}</td>
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
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedMapComponent}
            onSubmit={handleAdd}
          >
            <Row className="g-5 px-5">
            <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Category
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="categoryId"
                        value={mapComponent.categoryId}
                        onChange={handleMapComponentOption}
                        onBlur={() => handleMapComponentOption}
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
                </Col>

                <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidend">
                            Unit Cost
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="unitCostInRupees"
                              name="unitCostInRupees"
                              value={mapComponent.unitCostInRupees}
                              onChange={handleMapInputs}
                              type="text"
                              placeholder="Enter  Unit Cost"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Unit Cost is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidstart">
                            Share in %
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
                            Share in % is required
                            </Form.Control.Feedback>
                           
                          </div>
                        </Form.Group>
                      </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success">
                      Add
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    {/* <Button variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button> */}
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={mapComponentClear}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedMapComponentEdit}
            onSubmit={(e) => handleUpdate(e, mapComponentId, mapComponent)}
          >
            <Row className="g-5 px-5">
            <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Category
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="categoryId"
                        value={mapComponent.categoryId}
                        onChange={handleMapComponentOption}
                        onBlur={() => handleMapComponentOption}
                        required
                        isInvalid={
                          mapComponent.categoryId === undefined ||
                          mapComponent.categoryId === "0"
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
                </Col>

                <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidend">
                            Unit Cost
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="unitCostInRupees"
                              name="unitCostInRupees"
                              value={mapComponent.unitCostInRupees}
                              onChange={handleMapInputs}
                              type="text"
                              placeholder="Enter  Unit Cost"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                            Unit Cost is required
                            </Form.Control.Feedback>
                            
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="bidstart">
                            Share in %
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
                            Share in % is required
                            </Form.Control.Feedback>
                           
                          </div>
                        </Form.Group>
                      </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>
                  
                  <div className="gap-col">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={mapComponentClear}
                    >
                      Clear
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

export default MapComponent;
