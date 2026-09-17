import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

// Reused across the sc-category, sc-scheme-details, sc-component, sc-sub-scheme-details and
// scheme-quota edit pages so a scheme can carry a different DBT code per financial year
// (e.g. 80 for 2025-26, 90 for 2026-27) instead of a single fixed code.
// masterType must match one of the backend's DbtCodeMasterType enum values.
function DbtCodeFinancialYearPanel({ masterType, parentId }) {
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [loading, setLoading] = useState(false);

  const emptyForm = { scDbtCodeFinancialYearId: null, financialYearMasterId: "", dbtCode: "" };
  const [form, setForm] = useState(emptyForm);
  const [defaultFinancialYearId, setDefaultFinancialYearId] = useState("");

  const fetchRows = () => {
    if (!parentId) return;
    setLoading(true);
    api
      .get(baseURL + `dbtCodeFinancialYear/list?masterType=${masterType}&parentId=${parentId}`)
      .then((response) => {
        setRows(response.data.content.dbtCodeFinancialYearList || []);
        setLoading(false);
      })
      .catch(() => {
        setRows([]);
        setLoading(false);
      });
  };

  const fetchFinancialYears = () => {
    api
      .get(baseURL + `financialYearMaster/get-all?isActive=true`)
      .then((response) => {
        setFinancialYears(response.data.content.financialYearMaster || []);
      })
      .catch(() => {
        setFinancialYears([]);
      });
  };

  // Pre-select the default financial year on the "add" form so admins usually just enter a code
  // and click Add; they can still change the dropdown before submitting.
  const fetchDefaultFinancialYear = () => {
    api
      .get(baseURL + `financialYearMaster/get-is-default`)
      .then((response) => {
        const defaultFy = response.data.content;
        if (defaultFy && !defaultFy.error && defaultFy.financialYearMasterId) {
          setDefaultFinancialYearId(defaultFy.financialYearMasterId);
          setForm((prev) =>
            prev.scDbtCodeFinancialYearId ? prev : { ...prev, financialYearMasterId: defaultFy.financialYearMasterId }
          );
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterType, parentId]);

  useEffect(() => {
    fetchFinancialYears();
    fetchDefaultFinancialYear();
  }, []);

  const showError = (message) => {
    Swal.fire({ icon: "error", title: t("Save attempt was not successful"), html: message });
  };

  const resetForm = () => setForm({ ...emptyForm, financialYearMasterId: defaultFinancialYearId });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.financialYearMasterId || !form.dbtCode) {
      showError(t("Financial Year and DBT Code are both required."));
      return;
    }

    const isEditing = !!form.scDbtCodeFinancialYearId;
    const duplicate = rows.find(
      (r) =>
        String(r.financialYearMasterId) === String(form.financialYearMasterId) &&
        r.scDbtCodeFinancialYearId !== form.scDbtCodeFinancialYearId
    );
    if (duplicate) {
      showError(t("A DBT code is already configured for this Financial Year. Edit the existing entry instead."));
      return;
    }

    const payload = {
      scDbtCodeFinancialYearId: form.scDbtCodeFinancialYearId,
      masterType,
      parentId,
      financialYearMasterId: form.financialYearMasterId,
      dbtCode: form.dbtCode,
    };

    api
      .post(baseURL + (isEditing ? "dbtCodeFinancialYear/edit" : "dbtCodeFinancialYear/add"), payload)
      .then((response) => {
        if (response.data.content.error) {
          showError(response.data.content.error_description);
        } else {
          resetForm();
          fetchRows();
        }
      })
      .catch(() => {
        showError(t("Something went wrong while saving the financial year DBT code."));
      });
  };

  const handleEditClick = (row) => {
    setForm({
      scDbtCodeFinancialYearId: row.scDbtCodeFinancialYearId,
      financialYearMasterId: row.financialYearMasterId,
      dbtCode: row.dbtCode,
    });
  };

  const handleDelete = (row) => {
    Swal.fire({
      icon: "warning",
      title: t("Delete this Financial Year DBT Code?"),
      text: `${row.financialYear || row.financialYearMasterId} - ${row.dbtCode}`,
      showCancelButton: true,
      confirmButtonText: t("Delete"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(baseURL + `dbtCodeFinancialYear/delete/${row.scDbtCodeFinancialYearId}`)
          .then(() => fetchRows())
          .catch(() => showError(t("Unable to delete this entry.")));
      }
    });
  };

  if (!parentId) {
    return null;
  }

  return (
    <Card className="mt-3">
      <Card.Header className="sh-section-header">
        <Icon name="calender-date" />
        <span>{t("Financial Year DBT Codes")}</span>
      </Card.Header>
      <Card.Body>
        <Row className="g-gs align-items-end mb-3">
          <Col lg="4">
            <Form.Group className="form-group">
              <Form.Label>{t("Financial Year")}</Form.Label>
              <Form.Select
                value={form.financialYearMasterId || ""}
                onChange={(e) => setForm({ ...form, financialYearMasterId: e.target.value })}
              >
                <option value="">{t("Select Financial Year")}</option>
                {financialYears.map((fy) => (
                  <option key={fy.financialYearMasterId} value={fy.financialYearMasterId}>
                    {fy.financialYear}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="4">
            <Form.Group className="form-group">
              <Form.Label>{t("Dbt Code")}</Form.Label>
              <Form.Control
                type="text"
                value={form.dbtCode}
                onChange={(e) => setForm({ ...form, dbtCode: e.target.value })}
                placeholder={t("Enter Dbt Code")}
              />
            </Form.Group>
          </Col>
          <Col lg="4">
            <Button type="button" variant="primary" onClick={handleSubmit} className="me-2">
              <Icon name="plus" />
              <span>{form.scDbtCodeFinancialYearId ? t("update") : t("Add")}</span>
            </Button>
            {form.scDbtCodeFinancialYearId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                <span>{t("cancel")}</span>
              </Button>
            ) : null}
          </Col>
        </Row>

        {loading ? (
          <div>{t("Loading")}...</div>
        ) : rows.length === 0 ? (
          <div className="text-muted">{t("No financial-year specific DBT codes configured. The existing default DBT code is used for every financial year.")}</div>
        ) : (
          <Table className="table small table-bordered">
            <thead>
              <tr>
                <th>{t("Financial Year")}</th>
                <th>{t("Dbt Code")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.scDbtCodeFinancialYearId}>
                  <td>{row.financialYear}</td>
                  <td>{row.dbtCode}</td>
                  <td className="text-end">
                    <Button variant="link" size="sm" onClick={() => handleEditClick(row)}>
                      <Icon name="edit" />
                    </Button>
                    <Button variant="link" size="sm" className="text-danger" onClick={() => handleDelete(row)}>
                      <Icon name="trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default DbtCodeFinancialYearPanel;
