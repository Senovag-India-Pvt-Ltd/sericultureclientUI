import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { Icon } from "../../../components";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ConfigureReelingShed() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState({
    machineTypeId: "",
    reelingUnit: "",
    reelingSqft: "",
    categoryId: "",
    componentId: "",
    componentTypeId: "",
    unitCost: "",
    min: "",
    max: "",
  });

  const [validated, setValidated] = useState(false);

//   const handleInputs = (e) => {
//     const { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

const handleInputs = (e) => {
  const { name, value } = e.target;
  setData({
    ...data,
    [name]: ["categoryId","componentId","componentTypeId"].includes(name) ? parseInt(value) : value
  });
};


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

//   // to get sc-sub-scheme-details by sc-scheme-details
//     const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
//       []
//     );
//     const getSubSchemeList = () => {
//       api
//         .get(baseURL + `scSubSchemeDetails/get-all`)
//         .then((response) => {
//           if (response.data.content.scSubSchemeDetails) {
//             setScSubSchemeDetailsListData(
//               response.data.content.scSubSchemeDetails
//             );
//           }
//         })
//         .catch((err) => {
//           setScSubSchemeDetailsListData([]);
//           // alert(err.response.data.errorMessages[0].message[0].message);
//         });
//     };
  
//     useEffect(() => {
//       getSubSchemeList();
//     }, []);

    // to get Sub Scheme
      const [subSchemeListData, setSubSchemeListData] = useState([]);
    
      const getSubSchemeList = () => {
        const response = api
          .get(baseURL + `scSubSchemeDetails/get-all`)
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

       const [machineTypeListData, setMachineTypeListData] = useState([]);
            
              const getMachineTypeList = () => {
                api
                  .get(baseURL + `machine-type-master/get-all`)
                  .then((response) => {
                    setMachineTypeListData(response.data.content.machineTypeMaster);
                  })
                  .catch((err) => {
                    setMachineTypeListData([]);
                  });
              };
            
              useEffect(() => {
                getMachineTypeList();
              }, []);


  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
    }).then(() => navigate("/seriui/configure-reeling-shed-list"));
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

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(`${baseURL}configureReelingShed/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
            setValidated(false);
          }
        })
        .catch((err) => {
          if (err.response?.data?.validationErrors) {
            saveError(err.response.data.validationErrors);
          }
        });
    }
  };

  const clear = () => {
    setData({
      machineTypeId: "",
      reelingUnit: "",
      reelingSqft: "",
      categoryId: "",
      componentId: "",
      componentTypeId: "",
      unitCost: "",
      min: "",
      max: "",
    });
  };

  return (
    <Layout title={t("Configure Reeling Shed/Adopting Silent Generator/Adopting Solar power Generator/Adopting Solar Water Heater")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Configure Reeling Shed/Adopting Silent Generator/Adopting Solar power Generator/Adopting Solar Water Heater")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/configure-reeling-shed-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/configure-reeling-shed-list"
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

      <Block className="mt-n5">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3">
            <Card>
              <Card.Body>
                <Row className="g-gs">

                     {/* Unit Cost */}
                  <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Machine Type")} <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="machineTypeId"
                          value={data.machineTypeId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.machineTypeId === undefined ||
                            data.machineTypeId === "0"
                          }
                        >
                          <option value="">{t("Select Machine Type")}</option>
                          {machineTypeListData.map((list) => (
                            <option
                              key={list.machineTypeId}
                              value={list.machineTypeId}
                            >
                              {list.machineTypeName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Machine Type is required")}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                   {/* Unit Cost */}
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="reelingSqft">
                        {t("Sqft/KW/Generator Capacity/Water Heater Capacity")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reelingSqft"
                          name="reelingSqft"
                          value={data.reelingSqft}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Sqft")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Sqft is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>


                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="reelingUnit">
                        {t("Model(Only For Solar Water Heater)")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reelingUnit"
                          name="reelingUnit"
                          value={data.reelingUnit}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Reeling Unit")}
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          {t("Reeling Unit is required")}
                        </Form.Control.Feedback> */}
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
                                        name="componentTypeId"
                                        value={data.componentTypeId}
                                        onChange={handleInputs}
                                        onBlur={() => handleInputs}
                                        required
                                        isInvalid={
                                          data.componentTypeId === undefined ||
                                          data.componentTypeId === "0"
                                        }
                                      >
                                        <option value="">{t("Select Component Type")}</option>
                                        {subSchemeListData &&
                                          subSchemeListData.map((list) => (
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
                

                  

                 {/* Component */}
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
                                        {scCategoryListData.map((list) => (
                                          <option key={list.scCategoryId} value={list.scCategoryId}>
                                            {list.categoryName}
                                          </option>
                                        ))}
                                      </Form.Select>
                                      <Form.Control.Feedback type="invalid">
                                        {t("Category is required")}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>


                  {/* Unit Cost */}
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="unitCost">
                        {t("Unit Cost")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="unitCost"
                          name="unitCost"
                          value={data.unitCost}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Unit Cost")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Unit Cost is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Min */}
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="min">
                        {t("Min")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="min"
                          name="min"
                          value={data.min}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Min")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Min is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Max */}
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="max">
                        {t("Max")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="max"
                          name="max"
                          value={data.max}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Max")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Max is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="gap-col">
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
              </Card.Body>
            </Card>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ConfigureReelingShed;
