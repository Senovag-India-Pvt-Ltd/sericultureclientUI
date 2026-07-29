import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import { useParams } from "react-router-dom";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";

import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;


function MgnregaSchemeEdit() {
  const { t } = useTranslation();
    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "8%", // Reduced from 20% to 10%
    },
  };
  

  const [validated, setValidated] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
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
        .post(baseURL + `cropInspection/update-mgnrega-scheme-info`, data)
        .then((response) => {
          // debugger;
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data);
            clear();
            // setData({
            //   farmerId: "",
            //     disinfectantMasterId: "",
            //     invoiceNoDate: "",
            //     quantity: "",
            //     disinfectantName: "",
            //     quantitySupplied: "",
            //     suppliedDate: "",
            //     : "",
            //     numbersOfDfls: "",
            // });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
        acresPlanted: "",
      spacingFollwedFeet: "",
    spacingProcuredNos: "",
    spacingFollowed: "",
    spacingProcured: "",
    noOfCuttingPlanted: "",
    noOfSuccessfullSamplings: "",
    });
    
  };

   //   to get data from api
   const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURL + `cropInspection/get-by-mgnrega-scheme-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, []);


  
  
  // const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
    //   text: `Receipt Number ${message}`,
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Edit MGNREGA Scheme Details">
      <style>{mgnregaSchemeEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Edit MGNREGA Scheme Details")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/mgnrega-scheme-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/mgnrega-scheme-list"
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
          <Row className="g-1 ">
          <Block className="mt-3">
              <Card>
                <Card.Header className="sh-section-header">
                  <Icon name="growth" />
                  <span>{t("Area Expansion")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                         {t("Acres Planted")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="acresPlanted"
                            name="acresPlanted"
                            value={data.acresPlanted}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Acres Planted")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Acres Planted is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Sapling Followed(In Feet)")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="spacingFollwedFeet"
                            name="spacingFollwedFeet"
                            value={data.spacingFollwedFeet}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Sapling Followed(In Feet)")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Sapling Followed(In Feet) is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Sapling Procured(Nos)")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="spacingProcuredNos"
                            name="spacingProcuredNos"
                            value={data.spacingProcuredNos}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Sapling Procured(Nos)")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Sapling Procured(Nos) is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                   
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mt-3">
                <Card.Header className="sh-section-header">
                  <Icon name="growth" />
                  <span>{t("Tree Mulberry Plantation")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Sapling Followed")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="spacingFollowed"
                            name="spacingFollowed"
                            value={data.spacingFollowed}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Sapling Followed")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Sapling Followed is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Sapling Procured")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="spacingProcured"
                            name="spacingProcured"
                            value={data.spacingProcured}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Sapling Procured")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Sapling Procured is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mt-3">
              <Card.Header className="sh-section-header">
                <Icon name="package" />
                <span>{t("Nursery")}</span>
              </Card.Header>

                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Number of cutting Planted")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="noOfCuttingPlanted"
                            name="noOfCuttingPlanted"
                            value={data.noOfCuttingPlanted}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Number of cutting Planted")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Number of cutting Planted is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        {t("Number of successful samplings distributed")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="noOfSuccessfullSamplings"
                            name="noOfSuccessfullSamplings"
                            value={data.noOfSuccessfullSamplings}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Number of successful samplings distributed")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Number of successful samplings distributed is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>{t("Save")}</span>
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
                    <span>{t("Cancel")}</span>
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

const mgnregaSchemeEditStyles = `
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
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
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
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.25);
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
`;

export default MgnregaSchemeEdit;
