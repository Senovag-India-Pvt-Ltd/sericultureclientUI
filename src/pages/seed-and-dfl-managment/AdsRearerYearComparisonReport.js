import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import ReactSelect from "react-select";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import api from "../../services/auth/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const baseURL        = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDFL = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" },
];

const COLS = [
  { key: "gp_count", kn: "ಹಳ್ಳಿಗಳ ಸಂಖ್ಯೆ", en: "Villages" },
  { key: "seri_village_count", kn: "ರೇಷ್ಮೆ ಗ್ರಾಮ", en: "Seri Vill" },
  { key: "farmer_count", kn: "ಒಟ್ಟು ಬೆಳೆಗಾರ", en: "Farmers" },
  { key: "sc_count", kn: "ಪ.ಜಾ", en: "SC" },
  { key: "st_count", kn: "ಪ.ಪಂ", en: "ST" },
  { key: "minority_count", kn: "ಅ.ಸಂ", en: "Min" },
  { key: "others_count", kn: "ಇತರರು", en: "Others" },
  { key: "women_count", kn: "ಮಹಿಳಾ", en: "Women" },
  { key: "large_count", kn: "ದೊಡ್ಡ", en: "Large" },
  { key: "medium_count", kn: "ಮಧ್ಯಮ", en: "Medium" },
  { key: "small_count", kn: "ಸಣ್ಣ", en: "Small" },
  { key: "marginal_count", kn: "ಅತಿ ಸಣ್ಣ", en: "Marginal" },
  { key: "no_garden_count", kn: "ತೋಟ ಇಲ್ಲದ", en: "No Garden" },
];

const fmt = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "—";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  return Number.isInteger(n) ? n.toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

function AdsRearerYearComparisonReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ tscIds: [], financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);
  const [tscList, setTscList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [busyPdf, setBusyPdf] = useState(false);
  const [busyExcel, setBusyExcel] = useState(false);

  const extractYear = (str) => {
    if (!str) return null;
    const yr = parseInt(String(str).trim().split("-")[0], 10);
    return isNaN(yr) ? null : yr;
  };

  useEffect(() => {
    api.get(baseURL + "tscMaster/get-all").then((r) => setTscList(r.data.content.tscMaster || [])).catch(() => setTscList([]));
    api.get(baseURL + "financialYearMaster/get-all").then((r) => setFinancialYearList(r.data.content.financialYearMaster || [])).catch(() => setFinancialYearList([]));
    api.get(baseURL + "financialYearMaster/get-is-default").then((r) => {
      const fy = r.data.content;
      if (fy) {
        setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
        setFyStartYear(extractYear(fy.financialYear));
      }
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    setHasReport(false); setDataRows([]);
    if (name === "financialYearMasterId") {
      const f = financialYearList.find((x) => String(x.financialYearMasterId) === String(value));
      setFyStartYear(f ? extractYear(f.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.financialYearMasterId) return t("Please select a Financial Year.", { ns: "reports" });
    if (!filter.month) return t("Please select a Month.", { ns: "reports" });
    if (!fyStartYear) return t("Could not determine the financial year start year.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) => Swal.fire({ icon: "warning", title: t("Required Fields", { ns: "reports" }), text: msg, confirmButtonColor: "#d97706" });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title, text: msg, confirmButtonColor: "#e53e3e" });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    const ids = (filter.tscIds || []).map((o) => o.value).filter(Boolean).join(",");
    const p = { year, month: m };
    if (ids) p.tscIds = ids;
    return p;
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-rearer-year-comparison", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch (err) {
      const data = err?.response?.data;
      const backendMsg = typeof data === "string" ? data : (data?.message || data?.error);
      showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the Year Comparison report.", { ns: "reports" }));
    } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setBusyPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-rearer-year-comparison/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); }
    finally { setBusyPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setBusyExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-rearer-year-comparison/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month); const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `ads_rearer_year_comparison_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); }
    finally { setBusyExcel(false); }
  };

  const tscOptions = (tscList || []).map((x) => ({ value: x.tscMasterId, label: x.nameInKannada || x.name }));

  return (
    <Layout title={t("ADS · Farmer Demographic Year Comparison", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">{t("ADS · ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ವರ್ಷ ಹೋಲಿಕೆ (CY vs PY)")}</Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block>
        <Card className="card-gutter-md">
          <Card.Body>
            <Form onSubmit={handleView}>
              <Row className="g-3">
                <Col md="3">
                  <Form.Label>{t("Financial Year")} <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange}>
                    <option value="">{t("Select")}</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md="3">
                  <Form.Label>{t("Month")} <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange}>
                    <option value="">{t("Select")}</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>))}
                  </Form.Select>
                </Col>
                <Col md="4">
                  <Form.Label>{t("TSC (optional)")}</Form.Label>
                  <ReactSelect isMulti options={tscOptions} value={filter.tscIds}
                    onChange={(v) => { setFilter((p) => ({ ...p, tscIds: v || [] })); setHasReport(false); setDataRows([]); }}
                    placeholder={t("All TSCs")} />
                </Col>
                <Col md="2" className="d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                    {isLoading ? t("Loading...") : t("View")}
                  </button>
                </Col>
              </Row>
            </Form>

            {hasReport && (
              <div className="mt-4">
                <div className="d-flex justify-content-end gap-2 mb-2">
                  <button className="btn btn-outline-danger btn-sm" onClick={handlePdf} disabled={busyPdf}>{busyPdf ? "..." : t("PDF", { ns: "reports" })}</button>
                  <button className="btn btn-outline-success btn-sm" onClick={handleExcel} disabled={busyExcel}>{busyExcel ? "..." : t("Excel", { ns: "reports" })}</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered" style={{ minWidth: "900px", fontSize: "13px" }}>
                    <thead style={{ background: "#1e293b", color: "#fff" }}>
                      <tr>
                        <th style={{ textAlign: "center" }}>ವರ್ಷ<br /><small>Year</small></th>
                        {COLS.map((c) => (
                          <th key={c.key} style={{ textAlign: "center" }}>{c.kn}<br /><small>{c.en}</small></th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.length === 0 && (
                        <tr><td colSpan={COLS.length + 1} style={{ textAlign: "center", padding: "24px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found.</td></tr>
                      )}
                      {dataRows.map((row, ri) => (
                        <tr key={ri} style={{ background: ri === 0 ? "#eef2ff" : "#fff" }}>
                          <td style={{ textAlign: "center", fontWeight: 800 }}>{row.yr || "—"}</td>
                          {COLS.map((c) => (
                            <td key={c.key} style={{ textAlign: "right" }}>{fmt(row[c.key])}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default AdsRearerYearComparisonReport;
