import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
//import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function EditScApprovalStage() {

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

  // const handleCheckBox = (e) => {
  //   const { name, value, checked } = e.target;
  //   setData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  const handleCheckBox = (e) => {
    const { name, checked } = e.target; // Get the name and checked state from the event
    setData((prev) => ({
      ...prev,
      [name]: checked, // Dynamically update the correct field based on the checkbox name
    }));
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const datas = {
      scApprovalStageId: id,
      stageName: data.stageName,
      stageNameInKannada: data.stageNameInKannada,
      workFlowType: data.workFlowType,
      action: data.action,
      workOrder: data.workOrder,
      sanctionOrder: data.sanctionOrder,
      inspection: data.inspection,
      pushToDbt: data.pushToDbt,
      financialDelegation: data.financialDelegation,
      directlyToFruits:data.directlyToFruits,
      directApplication:data.directApplication,
      sanctionForReeling: data.sanctionForReeling,
      allowMultipleSanction:data.allowMultipleSanction,
      armStageConfig: data.armStageConfig || "",
      armFlow: data.armFlow || false,
      advancePaymentLetter: data.advancePaymentLetter || false,
      firstReleaseLetter: data.firstReleaseLetter || false,
      finalReleaseLetter: data.finalReleaseLetter || false,
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `scApprovalStage/edit`, datas)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              stageName: "",
              stageNameInKannada: "",
              workFlowType: "",
              action: "",
              workOrder:"",
              sanctionOrder:"",
              inspection:"",
              pushToDbt:"",
              financialDelegation:"",
              directlyToFruits:"",
              directApplication:"",
              allowMultipleSanction:"",
              sanctionForReeling:""
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      stageName: "",
      stageNameInKannada: "",
      workFlowType: "",
      action: "",
      workOrder:"",
      sanctionOrder:"",
      inspection:"",
      pushToDbt:"",
      financialDelegation:"",
      directlyToFruits:"",
      directApplication:"",
      allowMultipleSanction:"",
      sanctionForReeling:"",
      armStageConfig:""
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scApprovalStage/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setData({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

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
    <Layout title="Edit Approval Stage">
      <style>{editScApprovalStageStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Edit Approval Stage")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/sc-approval-stage-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/sc-approval-stage-list"
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
                <Icon name="edit" />
                <span>{t("Approval Stage Details")}</span>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <>
                    <Row className="g-gs">
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="title">
                            {t("Approval Stage")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="title"
                              name="stageName"
                              type="text"
                              value={data.stageName}
                              onChange={handleInputs}
                              placeholder={t("Enter Approval Stage")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Approval Stage is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="title">
                            {t("Approval Stage Name in Kannada")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="title"
                              name="stageNameInKannada"
                              type="text"
                              value={data.stageNameInKannada}
                              onChange={handleInputs}
                              placeholder={t("Enter Approval Stage Name In Kannada")}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {t("Approval Stage Name In Kannada is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="program">{t("Action")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="action"
                          name="action"
                          as="textarea"
                          rows={4}
                          value={data.action}
                          onChange={handleInputs}
                          placeholder={t("Enter Action")}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                    </Row>
                    <Row>
                    <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="inspection"
                          checked={data.inspection}
                          id="weighmentTripletGeneration"
                          // checked={data.weighmentTripletGeneration}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        {t("Inspection")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="workOrder"
                          checked={data.workOrder}
                          id="weighmentTripletGeneration"
                          // checked={data.weighmentTripletGeneration}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        {t("Work Order")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="sanctionOrder"
                          checked={data.sanctionOrder}
                          id="weighmentTripletGeneration"
                          // checked={data.weighmentTripletGeneration}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        {t("Sanction Order")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="pushToDbt"
                          checked={data.pushToDbt}
                          id="weighmentTripletGeneration"
                          // checked={data.weighmentTripletGeneration}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        {t("Push to DBT")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="directlyToFruits"
                          checked={data.directlyToFruits}
                          id="directlyToFruits"
                          // checked={data.weighmentTripletGeneration}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                      {t("Directly To Fruits")}
                      </Form.Label>
                    </Form.Group>
                    </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="directApplication"
                          checked={data.directApplication}
                          id="directApplication"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                      {t("Direct Application")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="financialDelegation"
                          checked={data.financialDelegation}
                          id="weighmentTripletGeneration"
                          // checked={data.weighmentTripletGeneration}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        {t("Financial Delegation")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="sanctionForReeling"
                          checked={data.sanctionForReeling}
                          id="weighmentTripletGeneration"
                          // checked={data.weighmentTripletGeneration}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                      {t("Sanction For Reeler")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="allowMultipleSanction"
                          checked={data.allowMultipleSanction}
                          id="weighmentTripletGeneration"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                      {t("Multiple Sanction")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="armFlow"
                          checked={data.armFlow || false}
                          id="armFlow"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                      {t("ARM Flow")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="advancePaymentLetter"
                          checked={data.advancePaymentLetter || false}
                          id="advancePaymentLetter"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                      {t("Advance Payment Letter")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="firstReleaseLetter"
                          checked={data.firstReleaseLetter || false}
                          id="firstReleaseLetter"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                      {t("First Release Letter")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="finalReleaseLetter"
                          checked={data.finalReleaseLetter || false}
                          id="finalReleaseLetter"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                      {t("Final Release Letter")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                    </Row>
                    <Row className="g-gs mt-2">
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label>{t("ARM Stage Config")}</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="armStageConfig"
                              value={data.armStageConfig || ""}
                              onChange={handleInputs}
                            >
                              <option value="">{t("-- None (Not an ARM Stage) --")}</option>
                              <option value="ESCROW_BANK">{t("Escrow Bank Account Card")}</option>
                              <option value="PROFORMA_INVOICE">{t("Proforma Invoice Table")}</option>
                              <option value="CSTRI_1">{t("CSTRI Letter No. & Date (First Release)")}</option>
                              <option value="CSTRI_2">{t("CSTRI Letter No. & Date (Final Release)")}</option>
                              <option value="ADVANCE_PAYMENT">{t("Advance Payment Letter")}</option>
                              <option value="FIRST_RELEASE">{t("First Release Letter")}</option>
                              <option value="SECOND_RELEASE">{t("Second Release Letter")}</option>
                              <option value="SELECTION_LETTER">{t("ARM Beneficiary Selection Letter")}</option>
                              <option value="ARM User Master">{t("ARM User Master")}</option>
                            </Form.Select>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
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

const editScApprovalStageStyles = `
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

export default EditScApprovalStage;
