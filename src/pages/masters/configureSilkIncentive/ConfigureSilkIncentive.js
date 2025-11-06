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

function ConfigureSilkIncentive() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState({
    machineTypeId: "",
    categoryId: "",
    componentId: "",
    componentTypeId: "",
    amountPerKg: "",
    min: "",
    max: "",
    rendittaGrade: "",
    silkTableBasinEnds: "",
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

      // to get Machine Type
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
    }).then(() => navigate("/seriui/configure-silk-incentive-list"));
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
        .post(`${baseURL}configureSilkIncentive/add`, data)
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
      categoryId: "",
      componentId: "",
      componentTypeId: "",
      amountPerKg: "",
      min: "",
      max: "",
    });
  };

  return (
  <Layout title={t("Configure Silk Incentive")}>
    <Block.Head>
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2">{t("Configure Silk Incentive")}</Block.Title>
        </Block.HeadContent>
        <Block.HeadContent>
          <ul className="d-flex">
            <li>
              <Link
                to="/seriui/configure-silk-incentive-list"
                className="btn btn-primary btn-md d-md-none"
              >
                <Icon name="arrow-long-left" />
                <span>{t("Go to List")}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/seriui/configure-silk-incentive-list"
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
        <Row className="g-4">
          {/* --- Configuration Details Card --- */}
          <Card className="shadow-sm border-0 rounded-3">
            {/* 💙 Blue Header */}
            <Card.Header
              className="bg-primary text-white py-3 rounded-top"
              style={{ fontWeight: "600", fontSize: "1.05rem" }}
            >
              {t("Configure Silk Incentive Details")}
            </Card.Header>

            <Card.Body>
              <Row className="g-4">
                {/* Machine Type */}
                <Col lg="6">
                  <Form.Group>
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

                {/* Category */}
                <Col lg="6">
                  <Form.Group>
                    <Form.Label>
                      {t("Category")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="categoryId"
                      value={data.categoryId}
                      onChange={handleInputs}
                      required
                    >
                      <option value="">{t("Select Category")}</option>
                      {scCategoryListData.map((list) => (
                        <option
                          key={list.scCategoryId}
                          value={list.scCategoryId}
                        >
                          {list.categoryName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Category is required")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Component */}
                <Col lg="6">
                  <Form.Group>
                    <Form.Label>
                      {t("Component")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="componentId"
                      value={data.componentId}
                      onChange={handleInputs}
                      required
                    >
                      <option value="">{t("Select Component")}</option>
                      {scComponentListData.map((list) => (
                        <option
                          key={list.scComponentId}
                          value={list.scComponentId}
                        >
                          {list.scComponentName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Component is required")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Component Type */}
                <Col lg="6">
                  <Form.Group>
                    <Form.Label>
                      {t("Component Type")}{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
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
                            value={list.scSubSchemeDetailsId}
                          >
                            {list.subSchemeName}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Component Type is required")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="imcbTable">
                        {t("Table/Basin/Ends")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          id="silkTableBasinEnds"
                          name="silkTableBasinEnds"
                          value={data.silkTableBasinEnds}
                          onChange={handleInputs}
                          required
                        >
                          <option value="">{t("Select Table/Basin/Ends")}</option>
                          <option value="1-Table(2 Basin)">1-Table(2 Basin)</option>
                          <option value="2-Table(4 Basin)">2-Table(4 Basin)</option>
                          <option value="3-Table(6 Basin)">3-Table(6 Basin)</option>
                          <option value="6 Basin">6 Basin</option>
                          <option value="10 Basin">10 Basin</option>
                          <option value="36 ends">36 ends</option>
                          <option value="48 ends">48 ends</option>
                          <option value="400 ends">400 ends</option>
                          <option value="200 ends">200 ends</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Table/Basin/Ends is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="imcbTable">
                        {t("Renditta/Grade")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          id="rendittaGrade"
                          name="rendittaGrade"
                          value={data.rendittaGrade}
                          onChange={handleInputs}
                          required
                        >
                          <option value="">{t("Select Renditta/Grade")}</option>
                          <option value="8.00">8.00</option>
                          <option value="7.50">7.50</option>
                          <option value="B-Grade">B-Grade</option>
                          <option value="2 A-Grade">2 A-Grade</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Renditta/Grade is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                {/* Amount Per Kg */}
                <Col lg="6">
                  <Form.Group>
                    <Form.Label>
                      {t("Amount Per Kg")}{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      id="amountPerKg"
                      name="amountPerKg"
                      value={data.amountPerKg}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Enter Amount Per Kg")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Amount Per Kg is required")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Min */}
                <Col lg="6">
                  <Form.Group>
                    <Form.Label>
                      {t("Min")} <span className="text-danger">*</span>
                    </Form.Label>
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
                  </Form.Group>
                </Col>

                {/* Max */}
                <Col lg="6">
                  <Form.Group>
                    <Form.Label>
                      {t("Max")} <span className="text-danger">*</span>
                    </Form.Label>
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
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* --- Action Buttons --- */}
          <Card className="shadow-sm border-0 rounded-3 mt-4">
            <Card.Body className="text-center py-3">
              <div className="d-flex justify-content-center gap-3">
                <Button type="submit" variant="primary" className="px-4">
                  {t("Save")}
                </Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={clear}
                  className="px-4"
                >
                  {t("Cancel")}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Row>
      </Form>
    </Block>
  </Layout>
);
}

export default ConfigureSilkIncentive;
