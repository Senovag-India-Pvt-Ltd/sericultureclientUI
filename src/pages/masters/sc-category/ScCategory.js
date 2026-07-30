import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL    = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ScCategory() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [schemeListData, setSchemeListData] = useState([]);
  const [validated, setValidated] = useState(false);

  const [data, setData] = useState({
    categoryName: "",
    categoryNameInKannada: "",
    codeNumber: "",
    description: "",
    categoryShortName: "",
    categoryCodeForSanctionOrder: "",
  });

  const [mappingRows, setMappingRows] = useState([
    { schemeId: "", subSchemeId: "", dbtCode: "", subSchemeListData: [] },
  ]);

  useEffect(() => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((r) => setSchemeListData(r.data.content.ScSchemeDetails || []))
      .catch(() => setSchemeListData([]));
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleRowChange = (index, field, value) => {
    const updated = mappingRows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    if (field === "schemeId") {
      updated[index].subSchemeId = "";
      updated[index].subSchemeListData = [];
      setMappingRows(updated);
      if (value) {
        api
          .get(baseURLDBT + `master/cost/get-by-scheme-id/${value}`)
          .then((r) => {
            setMappingRows((prev) =>
              prev.map((row, i) =>
                i === index
                  ? { ...row, subSchemeListData: r.data.content.unitCost || [] }
                  : row
              )
            );
          })
          .catch(() => {});
      }
    } else {
      setMappingRows(updated);
    }
  };

  const addRow = () => {
    setMappingRows([
      ...mappingRows,
      { schemeId: "", subSchemeId: "", dbtCode: "", subSchemeListData: [] },
    ]);
  };

  const removeRow = (index) => {
    if (mappingRows.length === 1) return;
    setMappingRows(mappingRows.filter((_, i) => i !== index));
  };

  const postData = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    const rowsInvalid = mappingRows.some(
      (r) => !r.schemeId || !r.subSchemeId || !r.dbtCode
    );
    if (form.checkValidity() === false || rowsInvalid) {
      setValidated(true);
      if (rowsInvalid) {
        Swal.fire({
          icon: "error",
          title: "Please complete all Scheme, Sub Scheme and DBT Code rows",
        });
      }
      return;
    }

    try {
      for (const row of mappingRows) {
        const response = await api.post(baseURL + `scCategory/add`, {
          ...data,
          schemeId: Number(row.schemeId),
          subSchemeId: Number(row.subSchemeId),
          dbtCode: row.dbtCode,
        });
        if (response.data.content.error) {
          saveError(response.data.content.error_description);
          return;
        }
      }
      saveSuccess();
      setData({
        categoryName: "",
        categoryNameInKannada: "",
        codeNumber: "",
        description: "",
        categoryShortName: "",
        categoryCodeForSanctionOrder: "",
      });
      setMappingRows([
        { schemeId: "", subSchemeId: "", dbtCode: "", subSchemeListData: [] },
      ]);
      setValidated(false);
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        saveError(err.response.data.validationErrors);
      }
    }
  };

  const clear = () => {
    setData({
      categoryName: "",
      categoryNameInKannada: "",
      codeNumber: "",
      description: "",
      categoryShortName: "",
      categoryCodeForSanctionOrder: "",
    });
    setMappingRows([
      { schemeId: "", subSchemeId: "", dbtCode: "", subSchemeListData: [] },
    ]);
    setValidated(false);
  };

  const saveSuccess = () => {
    Swal.fire({ icon: "success", title: "Saved successfully" }).then(() =>
      navigate("#")
    );
  };

  const saveError = (message) => {
    const errorMessage =
      typeof message === "object" ? Object.values(message).join("<br>") : message;
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Sub Component">
      <style>{scCategoryStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Sub Component")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/sc-category-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/sc-category-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="setting" />
                <span>{t("Sub Component Details")}</span>
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">

                  {/* ── Category Details ── */}
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("Sub Component")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          name="categoryName"
                          type="text"
                          value={data.categoryName}
                          onChange={handleInputs}
                          placeholder="Enter Sub Component"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Sub Component is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("Sub Component in Kannada")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          name="categoryNameInKannada"
                          type="text"
                          value={data.categoryNameInKannada}
                          onChange={handleInputs}
                          placeholder={t("Enter Sub Component Name in Kannada")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Sub Component in Kannada is required.")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("Category Code For Sanction Order")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          name="categoryCodeForSanctionOrder"
                          type="text"
                          value={data.categoryCodeForSanctionOrder}
                          onChange={handleInputs}
                          placeholder={t("Enter Category Code For Sanction Order")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Category Code For Sanction Order is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("Code  Number")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          name="codeNumber"
                          type="text"
                          value={data.codeNumber}
                          onChange={handleInputs}
                          placeholder={t("Enter Code Number")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Code Number is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("Description")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          name="description"
                          type="text"
                          value={data.description}
                          onChange={handleInputs}
                          placeholder={t("Enter Description")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Description is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("Category Short Name")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          name="categoryShortName"
                          type="text"
                          value={data.categoryShortName}
                          onChange={handleInputs}
                          placeholder={t("Enter Category Short Name")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Category Short Name is required.")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* ── Scheme / Sub Scheme / DBT Code rows ── */}
                  <Col lg="12">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0 fw-bold">{t("Scheme Wise Mapping")}</h6>
                      <Button
                        type="button"
                        variant="outline-primary"
                        size="sm"
                        onClick={addRow}
                      >
                        <Icon name="plus" /> {t("Add Row")}
                      </Button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-bordered align-middle">
                        <thead style={{ backgroundColor: "#1e67a8", color: "#fff" }}>
                          <tr>
                            <th>{t("Scheme")}<span className="text-danger">*</span></th>
                            <th>{t("Sub Scheme")}<span className="text-danger">*</span></th>
                            <th>{t("Dbt Code")}<span className="text-danger">*</span></th>
                            <th style={{ width: "100px" }}>{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mappingRows.map((row, index) => (
                            <tr key={index}>
                              <td>
                                <Form.Select
                                  value={row.schemeId}
                                  onChange={(e) =>
                                    handleRowChange(index, "schemeId", e.target.value)
                                  }
                                >
                                  <option value="">{t("Select Scheme")}</option>
                                  {schemeListData.map((s) => (
                                    <option
                                      key={s.scSchemeDetailsId}
                                      value={s.scSchemeDetailsId}
                                    >
                                      {s.schemeName}
                                    </option>
                                  ))}
                                </Form.Select>
                              </td>
                              <td>
                                <Form.Select
                                  value={row.subSchemeId}
                                  onChange={(e) =>
                                    handleRowChange(index, "subSchemeId", e.target.value)
                                  }
                                  disabled={!row.schemeId}
                                >
                                  <option value="">{t("Select Sub Scheme")}</option>
                                  {row.subSchemeListData.map((s, i) => (
                                    <option key={i} value={s.subSchemeId}>
                                      {s.subSchemeName}
                                    </option>
                                  ))}
                                </Form.Select>
                              </td>
                              <td>
                                <Form.Control
                                  type="text"
                                  value={row.dbtCode}
                                  onChange={(e) =>
                                    handleRowChange(index, "dbtCode", e.target.value)
                                  }
                                  placeholder={t("Enter Dbt Code")}
                                />
                              </td>
                              <td className="text-center">
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeRow(index)}
                                  disabled={mappingRows.length === 1}
                                >
                                  {t("delete")}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Col>

                </Row>
              </Card.Body>
            </Card>

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
    </Layout>
  );
}

const scCategoryStyles = `
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
`;

export default ScCategory;
