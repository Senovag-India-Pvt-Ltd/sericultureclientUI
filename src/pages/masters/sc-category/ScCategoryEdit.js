import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL    = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ScCategoryEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [schemeListData, setSchemeListData] = useState([]);

  const [baseData, setBaseData] = useState({
    categoryName: "",
    categoryNameInKannada: "",
    codeNumber: "",
    description: "",
    categoryShortName: "",
    categoryCodeForSanctionOrder: "",
  });

  const [mappingRows, setMappingRows] = useState([]);

  useEffect(() => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((r) => setSchemeListData(r.data.content.ScSchemeDetails || []))
      .catch(() => setSchemeListData([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(baseURL + `scCategory/get/${id}`)
      .then(async (res) => {
        const content = res.data.content;
        setBaseData({
          categoryName: content.categoryName || "",
          categoryNameInKannada: content.categoryNameInKannada || "",
          codeNumber: content.codeNumber || "",
          description: content.description || "",
          categoryShortName: content.categoryShortName || "",
          categoryCodeForSanctionOrder: content.categoryCodeForSanctionOrder || "",
        });

        // Use the `mappings` array returned by the API (each category now has all scheme mappings)
        const schemeMappings = content.mappings || [];

        // Load sub-scheme lists for each mapping in parallel
        const rows = await Promise.all(
          schemeMappings.map(async (m) => {
            let subSchemeListData = [];
            if (m.schemeId) {
              try {
                const ssRes = await api.get(
                  baseURLDBT + `master/cost/get-by-scheme-id/${m.schemeId}`
                );
                subSchemeListData = ssRes.data.content.unitCost || [];
              } catch (_) {}
            }
            return {
              scCategoryMappingId: m.scCategoryMappingId,   // mapping table ID
              scCategoryId: content.scCategoryId,            // category ID (for edit call)
              schemeId: m.schemeId ? String(m.schemeId) : "",
              subSchemeId: m.subSchemeId ? String(m.subSchemeId) : "",
              dbtCode: m.dbtCode || "",
              subSchemeListData,
            };
          })
        );

        // Show at least one empty row if no mappings exist yet
        setMappingRows(
          rows.length > 0
            ? rows
            : [{ scCategoryMappingId: null, scCategoryId: content.scCategoryId,
                 schemeId: "", subSchemeId: "", dbtCode: "", subSchemeListData: [] }]
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({ icon: "error", title: "Failed to load record" }).then(() =>
          navigate("#")
        );
      });
  }, [id]);

  const handleBaseInputs = (e) => {
    const { name, value } = e.target;
    setBaseData({ ...baseData, [name]: value });
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
      { scCategoryId: null, schemeId: "", subSchemeId: "", dbtCode: "", subSchemeListData: [] },
    ]);
  };

  const removeRow = async (index) => {
    if (mappingRows.length === 1) return;
    const row = mappingRows[index];
    if (row.scCategoryMappingId) {
      try {
        await api.delete(baseURL + `scCategory/mapping/delete/${row.scCategoryMappingId}`);
      } catch (_) {}
    }
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
      // First update base category info
      await api.post(baseURL + `scCategory/edit`, {
        ...baseData,
        scCategoryId: mappingRows[0]?.scCategoryId || null,
      });

      // Then upsert each scheme mapping via /add (backend does upsert now)
      for (const row of mappingRows) {
        const response = await api.post(baseURL + `scCategory/add`, {
          ...baseData,
          schemeId: Number(row.schemeId),
          subSchemeId: Number(row.subSchemeId),
          dbtCode: row.dbtCode,
        });
        if (response.data.content.error) {
          updateError(response.data.content.error_description);
          return;
        }
      }
      updateSuccess();
      setValidated(false);
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        updateError(err.response.data.validationErrors);
      }
    }
  };

  const updateSuccess = () => {
    Swal.fire({ icon: "success", title: "Updated successfully" });
  };

  const updateError = (message) => {
    const errorMessage =
      typeof message === "object" ? Object.values(message).join("<br>") : message;
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Edit Sub Component">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Sub Component")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-category-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-category-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
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
                {loading ? (
                  <h5 className="d-flex justify-content-center align-items-center py-4">
                    Loading...
                  </h5>
                ) : (
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
                            value={baseData.categoryName}
                            onChange={handleBaseInputs}
                            placeholder={t("Enter Sub Component")}
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
                            value={baseData.categoryNameInKannada}
                            onChange={handleBaseInputs}
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
                            value={baseData.categoryCodeForSanctionOrder}
                            onChange={handleBaseInputs}
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
                            value={baseData.codeNumber}
                            onChange={handleBaseInputs}
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
                            value={baseData.description}
                            onChange={handleBaseInputs}
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
                            value={baseData.categoryShortName}
                            onChange={handleBaseInputs}
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
                )}
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    {t("update")}
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

export default ScCategoryEdit;
