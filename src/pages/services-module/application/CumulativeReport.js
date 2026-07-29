import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "react-data-table-component";
import React from "react";
import { useEffect, useState } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "./CumulativeReport.css";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function CumulativeReport() {
  const { t } = useTranslation();

  const [data, setData] = useState({ financialYearId: "" });
  const [viewType, setViewType] = useState("SCHEME"); // SCHEME | CONSOLIDATED
  const [hovered, setHovered] = useState(null);
  const [downloading, setDownloading] = useState(null); // 'excel' | 'pdf' | null

  // ---------- Scheme-wise root (server paginated) ----------
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  // ---------- Sub-scheme ----------
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedSubScheme, setSelectedSubScheme] = useState(null);
  const [subSchemeData, setSubSchemeData] = useState([]);
  const [showSubScheme, setShowSubScheme] = useState(false);
  const [subSchemeLoading, setSubSchemeLoading] = useState(false);

  // financial year carried through the scheme-wise drill (from the clicked row's year)
  const [drillYearId, setDrillYearId] = useState(0);

  // ---------- Geo drill (Division -> District -> Taluk) ----------
  const [geoOpen, setGeoOpen] = useState(false);
  const [geoLevel, setGeoLevel] = useState("DIVISION"); // DIVISION | DISTRICT | TALUK
  const [geoDivision, setGeoDivision] = useState(null);
  const [geoDistrict, setGeoDistrict] = useState(null);
  const [geoRows, setGeoRows] = useState([]);
  const [geoLoading, setGeoLoading] = useState(false);

  // ---------- Application details modal ----------
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRows, setDetailRows] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailParams, setDetailParams] = useState(null);

  const [financialyearListData, setFinancialyearListData] = useState([]);

  // ============================ DATA LOADERS ============================
  // effective financial year for the current drill:
  //  - scheme-wise: the year of the row the user drilled from (falls back to the top filter)
  //  - consolidated: the top filter
  const effYear = () =>
    viewType === "SCHEME"
      ? drillYearId || data.financialYearId || 0
      : data.financialYearId || 0;

  const getSchemeWiseList = () => {
    setLoading(true);
    api
      .post(
        baseURLDBT + `service/getSchemeWiseApplicationCount`,
        {},
        { params: { financialYearId: data.financialYearId || 0 } }
      )
      .then((response) => {
        setListData(response.data.content || []);
        setTotalRows((response.data.content || []).length);
      })
      .catch(() => setListData([]))
      .finally(() => setLoading(false));
  };

  const getSubSchemeWiseList = (schemeId, yearId) => {
    setSubSchemeLoading(true);
    api
      .post(
        baseURLDBT + "service/getSubSchemeWiseApplicationCount",
        {},
        {
          params: {
            schemeId: schemeId,
            financialYearId: yearId || 0,
          },
        }
      )
      .then((response) => {
        setSubSchemeData(response.data.content || []);
        setShowSubScheme(true);
      })
      .catch(() => setSubSchemeData([]))
      .finally(() => setSubSchemeLoading(false));
  };

  // current scheme/sub-scheme context for the geo queries
  const currentCtx = () => ({
    schemeId: viewType === "SCHEME" ? selectedScheme?.schemeId || 0 : 0,
    subSchemeId: viewType === "SCHEME" ? selectedSubScheme?.subSchemeId || 0 : 0,
  });

  // ---------- Styled report download (matches the currently-shown table) ----------
  const currentExportContext = () => {
    const ctx = currentCtx(); // { schemeId, subSchemeId }
    if (geoOpen) {
      const base = {
        level: geoLevel, // DIVISION | DISTRICT | TALUK
        financialYearId: effYear(),
        schemeId: ctx.schemeId || 0,
        subSchemeId: ctx.subSchemeId || 0,
      };
      if (geoLevel === "DISTRICT") base.divisionId = geoDivision?.divisionId || 0;
      if (geoLevel === "TALUK") base.districtId = geoDistrict?.districtId || 0;
      return base;
    }
    if (viewType === "SCHEME" && showSubScheme) {
      return {
        level: "SUBSCHEME",
        schemeId: selectedScheme?.schemeId || 0,
        financialYearId: drillYearId || data.financialYearId || 0,
      };
    }
    return { level: "SCHEME", financialYearId: data.financialYearId || 0 };
  };

  // A blocked request (WAF / auth / server error) comes back as an HTML or JSON
  // page instead of the binary file. Detect that so we never save a broken file.
  const isErrorBlob = async (blob) => {
    if (!blob) return true;
    const type = (blob.type || "").toLowerCase();
    if (type.includes("pdf") || type.includes("spreadsheet") || type.includes("octet-stream")) return false;
    if (type.includes("html") || type.includes("text") || type.includes("json") || type.includes("xml")) return true;
    // Unknown/empty content-type: sniff the magic bytes (%PDF… or PK.. for xlsx/zip).
    try {
      const head = await blob.slice(0, 5).text();
      return !(head.startsWith("%PDF") || head.startsWith("PK"));
    } catch {
      return false;
    }
  };

  // Single, robust path for every styled download. Query params are kept strictly
  // numeric/ASCII (no free-text titles) so upstream security filters never block them.
  const downloadReportFile = async (endpoint, params, format, fileBase) => {
    setDownloading(format);
    try {
      const res = await api.post(baseURLDBT + endpoint, {}, { params, responseType: "blob" });
      if (await isErrorBlob(res.data)) throw new Error("invalid-file");

      const type =
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const url = URL.createObjectURL(new Blob([res.data], { type }));
      if (format === "pdf") {
        window.open(url);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileBase}.xlsx`;
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: t("Download failed"),
        text: t("The report could not be generated. Please try again."),
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setDownloading(null);
    }
  };

  const downloadReport = (format) => {
    const params = currentExportContext();
    downloadReportFile(
      `service/cumulative-report/${format}`,
      params,
      format,
      `cumulative_report_${String(params.level).toLowerCase()}`
    );
  };

  const loadDivisions = (ctx, yearId) => {
    setGeoLoading(true);
    api
      .post(
        baseURLDBT + "service/getDivisionWiseDashboardCount",
        {},
        {
          params: {
            financialYearId: yearId != null ? yearId : effYear(),
            schemeId: ctx.schemeId || 0,
            subSchemeId: ctx.subSchemeId || 0,
          },
        }
      )
      .then((r) => setGeoRows(r.data.content || []))
      .catch(() => setGeoRows([]))
      .finally(() => setGeoLoading(false));
  };

  const loadDistricts = (divisionId, ctx, yearId) => {
    setGeoLoading(true);
    api
      .post(
        baseURLDBT + "service/getDistrictWiseDashboardCount",
        {},
        {
          params: {
            divisionId: divisionId,
            financialYearId: yearId != null ? yearId : effYear(),
            schemeId: ctx.schemeId || 0,
            subSchemeId: ctx.subSchemeId || 0,
          },
        }
      )
      .then((r) => setGeoRows(r.data.content || []))
      .catch(() => setGeoRows([]))
      .finally(() => setGeoLoading(false));
  };

  const loadTaluks = (districtId, ctx, yearId) => {
    setGeoLoading(true);
    api
      .post(
        baseURLDBT + "service/getTalukWiseDashboardCount",
        {},
        {
          params: {
            districtId: districtId,
            financialYearId: yearId != null ? yearId : effYear(),
            schemeId: ctx.schemeId || 0,
            subSchemeId: ctx.subSchemeId || 0,
          },
        }
      )
      .then((r) => setGeoRows(r.data.content || []))
      .catch(() => setGeoRows([]))
      .finally(() => setGeoLoading(false));
  };

  const getFinancialYearList = () => {
    api
      .get(baseURL + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch(() => setFinancialyearListData([]));
  };

  // default financial year (pre-selected on load; user can change it)
  const getDefaultFinancialYear = () => {
    api
      .get(baseURL + `financialYearMaster/get-is-default`)
      .then((response) => {
        const id = response.data.content?.financialYearMasterId;
        if (id) setData((prev) => ({ ...prev, financialYearId: id }));
      })
      .catch(() => {});
  };

  // ============================ EFFECTS ============================
  useEffect(() => {
    getFinancialYearList();
    getDefaultFinancialYear();
  }, []);

  useEffect(() => {
    if (viewType === "SCHEME" && !showSubScheme && !geoOpen) {
      getSchemeWiseList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewType, page, data.financialYearId, showSubScheme, geoOpen]);

  // when the top financial-year filter changes, reset the drill to a clean top level
  const didMountYear = React.useRef(false);
  useEffect(() => {
    if (!didMountYear.current) {
      didMountYear.current = true;
      return;
    }
    setDrillYearId(0);
    setSelectedScheme(null);
    setSelectedSubScheme(null);
    setShowSubScheme(false);
    setGeoDivision(null);
    setGeoDistrict(null);
    if (viewType === "CONSOLIDATED") {
      setGeoLevel("DIVISION");
      setGeoOpen(true);
      loadDivisions({ schemeId: 0, subSchemeId: 0 }, data.financialYearId || 0);
    } else {
      setGeoOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.financialYearId]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (name === "financialYearId") setPage(0);
  };

  // ============================ NAVIGATION ============================
  const openSchemeRoot = () => {
    setViewType("SCHEME");
    setPage(0);
    setDrillYearId(0);
    setShowSubScheme(false);
    setGeoOpen(false);
    setSelectedScheme(null);
    setSelectedSubScheme(null);
    setGeoDivision(null);
    setGeoDistrict(null);
  };

  const openConsolidated = () => {
    setViewType("CONSOLIDATED");
    setDrillYearId(0);
    setShowSubScheme(false);
    setSelectedScheme(null);
    setSelectedSubScheme(null);
    setGeoDivision(null);
    setGeoDistrict(null);
    setGeoLevel("DIVISION");
    setGeoOpen(true);
    loadDivisions({ schemeId: 0, subSchemeId: 0 }, data.financialYearId || 0);
  };

  const openSchemeRow = (row) => {
    const yearId = row.financialYearMasterId || data.financialYearId || 0;
    setDrillYearId(yearId);
    setSelectedScheme(row);
    setSelectedSubScheme(null);
    getSubSchemeWiseList(row.schemeId, yearId);
  };

  const openSubSchemeRow = (row) => {
    const yearId = row.financialYearMasterId || drillYearId || data.financialYearId || 0;
    setDrillYearId(yearId);
    setSelectedSubScheme(row);
    setGeoDivision(null);
    setGeoDistrict(null);
    setGeoLevel("DIVISION");
    setGeoOpen(true);
    loadDivisions(
      {
        schemeId: selectedScheme?.schemeId || 0,
        subSchemeId: row.subSchemeId || 0,
      },
      yearId
    );
  };

  const goSubSchemeTable = () => {
    setGeoOpen(false);
    setShowSubScheme(true);
    setGeoDivision(null);
    setGeoDistrict(null);
  };

  const drillToDistrict = (divisionRow) => {
    setGeoDivision(divisionRow);
    setGeoDistrict(null);
    setGeoLevel("DISTRICT");
    loadDistricts(divisionRow.divisionId, currentCtx());
  };

  const drillToTaluk = (districtRow) => {
    setGeoDistrict(districtRow);
    setGeoLevel("TALUK");
    loadTaluks(districtRow.districtId, currentCtx());
  };

  const geoBack = (level) => {
    const ctx = currentCtx();
    if (level === "DIVISION") {
      setGeoDivision(null);
      setGeoDistrict(null);
      setGeoLevel("DIVISION");
      loadDivisions(ctx);
    } else if (level === "DISTRICT") {
      setGeoDistrict(null);
      setGeoLevel("DISTRICT");
      loadDistricts(geoDivision?.divisionId, ctx);
    }
  };

  // ============================ DETAILS ============================
  const STATUS_LABEL = {
    RECEIVED: t("Applications Received"),
    PROCESSED: t("Applications Processed"),
    REJECTED: t("Applications Rejected"),
    ACK_FAILED: t("Acknowledgement Failed"),
    PAYMENT_FAILED: t("Payment Failed in DBT"),
    PENDING: t("Pending Applications"),
  };

  const fetchDetails = (params, title) => {
    setDetailTitle(title);
    setDetailParams(params);
    setDetailRows([]);
    setDetailLoading(true);
    setDetailOpen(true);
    api
      .post(baseURLDBT + "service/getApplicationDetailsByGeo", {}, { params })
      .then((r) => setDetailRows(r.data.content || []))
      .catch(() => setDetailRows([]))
      .finally(() => setDetailLoading(false));
  };

  // Styled download of the application-details list shown in the modal.
  // Only the numeric/ASCII query params are sent — the backend builds the report
  // title itself from statusType, so no free-text (Kannada) ever hits the URL.
  const downloadDetails = (format) => {
    if (!detailParams) return;
    downloadReportFile(
      `service/application-details/${format}`,
      detailParams,
      format,
      "application_details"
    );
  };

  const baseDetailParams = (statusType, yearId) => ({
    statusType,
    financialYearId: yearId != null ? yearId : effYear(),
    schemeId: 0,
    subSchemeId: 0,
    divisionId: 0,
    districtId: 0,
    talukId: 0,
  });

  // number clicked on the SCHEME root table (scope to that row's year)
  const onSchemeNum = (statusType, row) => {
    const yearId = row.financialYearMasterId || data.financialYearId || 0;
    fetchDetails(
      { ...baseDetailParams(statusType, yearId), schemeId: row.schemeId || 0 },
      `${STATUS_LABEL[statusType]} — ${row.schemeName || ""}`
    );
  };

  // number clicked on the SUB-SCHEME table (scope to that row's year)
  const onSubSchemeNum = (statusType, row) => {
    const yearId = row.financialYearMasterId || drillYearId || data.financialYearId || 0;
    fetchDetails(
      {
        ...baseDetailParams(statusType, yearId),
        schemeId: selectedScheme?.schemeId || 0,
        subSchemeId: row.subSchemeId || 0,
      },
      `${STATUS_LABEL[statusType]} — ${row.subSchemeName || ""}`
    );
  };

  // number clicked inside the GEO drill (division / district / taluk)
  const onGeoNum = (statusType, row) => {
    const ctx = currentCtx();
    const p = {
      ...baseDetailParams(statusType),
      schemeId: ctx.schemeId || 0,
      subSchemeId: ctx.subSchemeId || 0,
    };
    let name = "";
    if (geoLevel === "DIVISION") {
      p.divisionId = row.divisionId || 0;
      name = row.divisionName;
    } else if (geoLevel === "DISTRICT") {
      p.divisionId = geoDivision?.divisionId || 0;
      p.districtId = row.districtId || 0;
      name = row.districtName;
    } else {
      p.divisionId = geoDivision?.divisionId || 0;
      p.districtId = geoDistrict?.districtId || 0;
      p.talukId = row.talukId || 0;
      name = row.talukName;
    }
    fetchDetails(p, `${STATUS_LABEL[statusType]} — ${name || ""}`);
  };

  // ============================ TABLE THEME / STYLES ============================
  createTheme(
    "solarized",
    {
      text: { primary: "#004b8e", secondary: "#2aa198" },
      background: { default: "#fff" },
      context: { background: "#cb4b16", text: "#FFFFFF" },
      divider: { default: "#d3d3d3" },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    table: { style: { backgroundColor: "transparent" } },
    responsiveWrapper: { style: { borderRadius: "16px" } },
    headRow: {
      style: {
        background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
        borderRadius: "14px",
        minHeight: "56px",
        marginBottom: "10px",
        boxShadow: "0 8px 20px rgba(37,99,235,0.22)",
        borderBottom: "none",
      },
    },
    headCells: {
      style: {
        color: "#EFF6FF",
        fontSize: "11px",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "0.075em",
        justifyContent: "center",
      },
    },
    rows: {
      style: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        minHeight: "60px",
        marginBottom: "10px",
        boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
        border: "1px solid #EFF2F7",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
      },
      highlightOnHoverStyle: {
        transform: "translateY(-3px) scale(1.004)",
        boxShadow: "0 14px 30px rgba(37,99,235,0.16)",
        backgroundColor: "#F5F9FF",
        borderColor: "#DBE7FF",
        cursor: "pointer",
        outline: "none",
      },
    },
    cells: {
      style: {
        padding: "15px 16px",
        fontSize: "13.5px",
        fontWeight: "500",
        color: "#334155",
        justifyContent: "center",
      },
    },
    pagination: {
      style: {
        borderTop: "none",
        marginTop: "8px",
        padding: "12px",
        backgroundColor: "transparent",
        color: "#475569",
        fontWeight: 600,
      },
    },
  };

  const radioToggleStyles = {
    pillBase: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 18px",
      fontWeight: 600,
      fontSize: "13.5px",
      color: "#475569",
      cursor: "pointer",
      borderRadius: "12px",
      transition: "all 0.22s ease",
      userSelect: "none",
    },
    pillHover: { color: "#2563EB" },
    pillActive: {
      background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
      color: "#ffffff",
      boxShadow: "0 8px 18px rgba(37,99,235,0.35)",
    },
    icon: { fontSize: "16px" },
  };

  const getRadioPillStyle = (type) => ({
    ...radioToggleStyles.pillBase,
    ...(hovered === type ? radioToggleStyles.pillHover : {}),
    ...(viewType === type ? radioToggleStyles.pillActive : {}),
  });

  // ============================ COLUMNS ============================
  const nfmt = (v) => (v == null ? 0 : v).toLocaleString("en-IN");

  const slNoColumn = {
    name: "Sl.No",
    selector: (row) => row.serialNo,
    width: "90px",
    center: true,
  };

  // metric cells are clickable -> open application details
  const metricColumns = (onNum) => [
    {
      name: "Total Applications Received",
      selector: (row) => row.count,
      cell: (row) => (
        <span
          className="stat-pill stat-primary num-clickable"
          title="View applications"
          onClick={() => onNum("RECEIVED", row)}
        >
          {nfmt(row.count)}
        </span>
      ),
      center: true,
    },
    {
      name: "Total Applications Processed",
      selector: (row) => row.dbtPushedCount,
      cell: (row) => (
        <span
          className="stat-pill stat-success num-clickable"
          title="View applications"
          onClick={() => onNum("PROCESSED", row)}
        >
          {nfmt(row.dbtPushedCount)}
        </span>
      ),
      center: true,
    },
    {
      name: "Total Applications Rejected",
      selector: (row) => row.dbtRejectedCount,
      cell: (row) => (
        <span
          className="stat-pill stat-danger num-clickable"
          title="View applications"
          onClick={() => onNum("REJECTED", row)}
        >
          {nfmt(row.dbtRejectedCount)}
        </span>
      ),
      center: true,
    },
    {
      name: "Acknowledgement Failed",
      selector: (row) => row.ackFailedCount,
      cell: (row) => (
        <span
          className="stat-pill stat-ack num-clickable"
          title="View applications"
          onClick={() => onNum("ACK_FAILED", row)}
        >
          {nfmt(row.ackFailedCount)}
        </span>
      ),
      center: true,
    },
    {
      name: "Payment Failed in DBT",
      selector: (row) => row.paymentFailedCount,
      cell: (row) => (
        <span
          className="stat-pill stat-payfail num-clickable"
          title="View applications"
          onClick={() => onNum("PAYMENT_FAILED", row)}
        >
          {nfmt(row.paymentFailedCount)}
        </span>
      ),
      center: true,
    },
    {
      name: "Pending",
      selector: (row) => row.pendencyAfterDueDate,
      cell: (row) => (
        <span
          className="stat-pill stat-warning num-clickable"
          title="View applications"
          onClick={() => onNum("PENDING", row)}
        >
          {nfmt(row.pendencyAfterDueDate)}
        </span>
      ),
      center: true,
    },
  ];

  const SchemeColumns = [
    { ...slNoColumn, sortable: true, hide: "md" },
    {
      name: "Fin-Year",
      selector: (row) => row.financialYear,
      hide: "md",
      width: "140px",
    },
    {
      name: "Scheme Name",
      selector: (row) => row.schemeName,
      cell: (row) => (
        <span className="scheme-link" onClick={() => openSchemeRow(row)}>
          {row.schemeName}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    ...metricColumns(onSchemeNum).map((c) => ({ ...c, hide: "md" })),
  ];

  const SubSchemeColumns = [
    { ...slNoColumn, sortable: true, hide: "md" },
    {
      name: "Fin-Year",
      selector: (row) => row.financialYear,
      hide: "md",
      width: "140px",
    },
    {
      name: "Sub Scheme Name",
      selector: (row) => row.subSchemeName,
      cell: (row) => (
        <span className="scheme-link" onClick={() => openSubSchemeRow(row)}>
          {row.subSchemeName}
        </span>
      ),
      sortable: true,
      hide: "md",
    },
    ...metricColumns(onSubSchemeNum).map((c) => ({ ...c, hide: "md" })),
  ];

  const geoColumns = () => {
    if (geoLevel === "DIVISION") {
      return [
        slNoColumn,
        {
          name: "Division Name",
          selector: (row) => row.divisionName,
          cell: (row) => (
            <span className="scheme-link" onClick={() => drillToDistrict(row)}>
              {row.divisionName}
            </span>
          ),
        },
        ...metricColumns(onGeoNum),
      ];
    }
    if (geoLevel === "DISTRICT") {
      return [
        slNoColumn,
        {
          name: "District Name",
          selector: (row) => row.districtName,
          cell: (row) => (
            <span className="scheme-link" onClick={() => drillToTaluk(row)}>
              {row.districtName}
            </span>
          ),
        },
        ...metricColumns(onGeoNum),
      ];
    }
    return [
      slNoColumn,
      { name: "Taluk Name", selector: (row) => row.talukName },
      ...metricColumns(onGeoNum),
    ];
  };

  const statusBadge = (s) => {
    const v = (s || "").toUpperCase();
    let cls = "stat-warning";
    if (v === "PAYMENT SUCCESS IN DBT" || v === "DBT PUSHED") cls = "stat-success";
    else if (v === "APPLICATION REJECTED") cls = "stat-danger";
    else if (v === "ACKNOWLEDGEMENT FAILED") cls = "stat-ack";
    else if (v === "PAYMENT FAILED IN DBT") cls = "stat-payfail";
    else if (v.indexOf("SUCCESS") >= 0) cls = "stat-primary";
    return <span className={`stat-pill ${cls}`}>{s || t("Pending")}</span>;
  };

  const money = (v) => (v == null ? "—" : Number(v).toLocaleString("en-IN"));

  const DetailColumns = [
    { name: "#", selector: (r) => r.serialNo, width: "60px", center: true },
    { name: "ARN", selector: (r) => r.arn, sortable: true, wrap: true, width: "140px" },
    { name: "Beneficiary ID", selector: (r) => r.beneficiaryId, wrap: true, width: "160px" },
    { name: "Farmer Name", selector: (r) => r.farmerName, sortable: true, wrap: true },
    { name: "Mobile", selector: (r) => r.mobileNumber, width: "120px" },
    { name: "Scheme", selector: (r) => r.schemeName, wrap: true },
    { name: "Sub-Scheme", selector: (r) => r.subSchemeName, wrap: true },
    { name: "District", selector: (r) => r.districtName, width: "120px" },
    { name: "Taluk", selector: (r) => r.talukName, width: "120px" },
    {
      name: "Date",
      selector: (r) => r.createdDate,
      cell: (r) => (r.createdDate ? String(r.createdDate).substring(0, 10) : "—"),
      width: "110px",
    },
    {
      name: "Scheme Amount",
      selector: (r) => r.schemeAmount,
      cell: (r) => money(r.schemeAmount),
      width: "130px",
      right: true,
    },
    {
      name: "Eligible Amount",
      selector: (r) => r.amount,
      cell: (r) => money(r.amount),
      width: "130px",
      right: true,
    },
    {
      name: "Status",
      selector: (r) => r.applicationStatus,
      cell: (r) => statusBadge(r.applicationStatus),
      width: "180px",
      center: true,
    },
    { name: "Remarks", selector: (r) => r.remarks, wrap: true },
  ];

  // ============================ BREADCRUMB ============================
  const buildCrumbs = () => {
    const crumbs = [];
    if (viewType === "SCHEME") {
      crumbs.push({
        label: `📑 ${t("Schemes")}`,
        onClick: openSchemeRoot,
        active: !showSubScheme && !geoOpen,
      });
      if (selectedScheme) {
        crumbs.push({
          label: selectedScheme.schemeName,
          onClick: () => {
            setShowSubScheme(true);
            setGeoOpen(false);
            setSelectedSubScheme(null);
            setGeoDivision(null);
            setGeoDistrict(null);
          },
          active: showSubScheme && !geoOpen,
        });
      }
      if (selectedSubScheme && geoOpen) {
        crumbs.push({
          label: selectedSubScheme.subSchemeName,
          onClick: () => geoBack("DIVISION"),
          active: geoLevel === "DIVISION",
        });
      }
    } else {
      crumbs.push({
        label: `🗂️ ${t("Divisions")}`,
        onClick: () => geoBack("DIVISION"),
        active: geoLevel === "DIVISION",
      });
    }

    if (geoOpen && geoDivision) {
      crumbs.push({
        label: geoDivision.divisionName,
        onClick: () => geoBack("DISTRICT"),
        active: geoLevel === "DISTRICT",
      });
    }
    if (geoOpen && geoDistrict) {
      crumbs.push({
        label: geoDistrict.districtName,
        onClick: null,
        active: geoLevel === "TALUK",
      });
    }
    return crumbs;
  };

  const Crumbs = () => {
    const crumbs = buildCrumbs();
    return (
      <div className="cr-crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="cr-sep">›</span>}
            <span
              className={`cr-crumb ${c.active ? "active" : ""}`}
              onClick={() => !c.active && c.onClick && c.onClick()}
            >
              {c.label}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const KpiStrip = ({ rows }) => {
    const list = Array.isArray(rows) ? rows : [];
    const totals = list.reduce(
      (a, r) => ({
        c: a.c + (Number(r.count) || 0),
        p: a.p + (Number(r.dbtPushedCount) || 0),
        rj: a.rj + (Number(r.dbtRejectedCount) || 0),
        af: a.af + (Number(r.ackFailedCount) || 0),
        pf: a.pf + (Number(r.paymentFailedCount) || 0),
        pn: a.pn + (Number(r.pendencyAfterDueDate) || 0),
      }),
      { c: 0, p: 0, rj: 0, af: 0, pf: 0, pn: 0 }
    );
    const kpis = [
      { k: "c", label: t("Received"), value: totals.c, icon: "📥", cls: "kpi-primary" },
      { k: "p", label: t("Processed"), value: totals.p, icon: "✅", cls: "kpi-success" },
      { k: "rj", label: t("Rejected"), value: totals.rj, icon: "⛔", cls: "kpi-danger" },
      { k: "af", label: t("Ack. Failed"), value: totals.af, icon: "📄", cls: "kpi-ack" },
      { k: "pf", label: t("Payment Failed"), value: totals.pf, icon: "💳", cls: "kpi-payfail" },
      { k: "pn", label: t("Pending"), value: totals.pn, icon: "⏳", cls: "kpi-warning" },
    ];
    return (
      <div className="cr-kpis">
        {kpis.map((k) => (
          <div key={k.k} className={`cr-kpi ${k.cls}`}>
            <div className="cr-kpi-icon">{k.icon}</div>
            <div className="cr-kpi-body">
              <span className="cr-kpi-num">{k.value.toLocaleString("en-IN")}</span>
              <span className="cr-kpi-label">{k.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const geoMeta = {
    DIVISION: { icon: "🗂️", title: t("Division-wise") },
    DISTRICT: { icon: "🏙️", title: t("District-wise") },
    TALUK: { icon: "🏘️", title: t("Taluk-wise") },
  };

  // ============================ RENDER ============================
  return (
    <Layout title={t("Cumulative Report")}>
      <style>{`
        @keyframes crFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        body {
          background-image: none !important;
          background:
            radial-gradient(900px 380px at 12% -8%, #E0ECFF 0%, rgba(224,236,255,0) 60%),
            radial-gradient(720px 360px at 100% 0%, #EDE9FE 0%, rgba(237,233,254,0) 55%),
            #EEF2F9 !important;
        }

        .cr-header {
          position: relative; overflow: hidden;
          background: linear-gradient(120deg, #172554 0%, #1E40AF 45%, #2563EB 78%, #3B82F6 100%);
          border-radius: 20px; padding: 24px 28px; color: #fff;
          box-shadow: 0 18px 40px rgba(30,64,175,0.32);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 14px;
          animation: crFadeUp .45s ease both;
        }
        .cr-header::before {
          content: ""; position: absolute; top: -60%; right: -6%;
          width: 340px; height: 340px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,.20) 0%, rgba(255,255,255,0) 70%);
          pointer-events: none;
        }
        .cr-header::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 3px;
          background: linear-gradient(90deg, #38BDF8, #818CF8, #C084FC);
        }
        .cr-header h2 { color: #fff; font-weight: 800; margin: 0; font-size: 24px; letter-spacing: .2px; }
        .cr-header .cr-sub { color: #C7D9FF; font-size: 13px; margin-top: 5px; }
        .cr-header-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.28);
          display: flex; align-items: center; justify-content: center;
          font-size: 27px; backdrop-filter: blur(6px);
          box-shadow: 0 8px 20px rgba(0,0,0,.15);
        }

        .cr-panel {
          background: #ffffff; border: 1px solid #EAEFF6; border-radius: 18px;
          box-shadow: 0 10px 30px rgba(15,23,42,0.07);
          animation: crFadeUp .45s ease both;
        }

        .cr-toolbar {
          display: flex; align-items: flex-end; gap: 18px; flex-wrap: wrap;
          padding: 4px 4px 14px; margin-bottom: 6px;
          border-bottom: 1px solid #EEF2F7;
        }
        .cr-year-wrap { display: flex; flex-direction: column; gap: 6px; }
        .cr-year-label {
          font-size: 11.5px; font-weight: 800; color: #64748B;
          text-transform: uppercase; letter-spacing: .07em;
        }
        .cr-year-select {
          border: 1px solid #E2E8F0; outline: none; background: #fff;
          padding: 10px 16px; border-radius: 12px; font-size: 14px;
          font-weight: 600; color: #1E293B; cursor: pointer; min-width: 180px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.05);
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .cr-year-select:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,.16); }
        .cr-toggle {
          display: flex; gap: 6px; background: #EEF2F7;
          border-radius: 14px; padding: 5px;
          box-shadow: inset 0 2px 6px rgba(15,23,42,0.07);
        }

        .cr-dl-group { display: flex; align-items: center; gap: 10px; margin-left: auto; }
        .cr-dl {
          display: inline-flex; align-items: center; gap: 7px;
          border: none; color: #fff; cursor: pointer;
          padding: 10px 18px; border-radius: 12px;
          font-size: 13.5px; font-weight: 700; letter-spacing: .2px;
          transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
        }
        .cr-dl:disabled { opacity: .6; cursor: not-allowed; }
        .cr-dl:not(:disabled):hover { transform: translateY(-2px); filter: brightness(1.03); }
        .cr-dl-pdf { background: linear-gradient(135deg,#b91c1c,#dc2626); box-shadow: 0 6px 16px rgba(185,28,28,.30); }
        .cr-dl-xls { background: linear-gradient(135deg,#15803d,#16a34a); box-shadow: 0 6px 16px rgba(21,128,61,.30); }

        .cr-modal-dl { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .cr-mdl-btn {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid rgba(255,255,255,.28); color: #fff; cursor: pointer;
          padding: 7px 13px; border-radius: 10px;
          font-size: 12.5px; font-weight: 700; letter-spacing: .2px;
          backdrop-filter: blur(4px);
          transition: transform .16s ease, filter .16s ease, box-shadow .16s ease;
        }
        .cr-mdl-btn:disabled { opacity: .5; cursor: not-allowed; }
        .cr-mdl-btn:not(:disabled):hover { transform: translateY(-1px); filter: brightness(1.06); box-shadow: 0 6px 16px rgba(0,0,0,.18); }
        .cr-mdl-pdf { background: linear-gradient(135deg,#dc2626,#ef4444); }
        .cr-mdl-xls { background: linear-gradient(135deg,#16a34a,#22c55e); }

        .cr-crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-bottom: 16px; }
        .cr-crumb {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 999px;
          font-size: 13px; font-weight: 600; color: #475569;
          background: #F1F5F9; border: 1px solid #E2E8F0;
          cursor: pointer; transition: all .18s ease;
        }
        .cr-crumb:hover { background: #E0ECFF; color: #1D4ED8; }
        .cr-crumb.active {
          background: linear-gradient(135deg,#2563EB,#1D4ED8);
          color: #fff; border-color: transparent;
          box-shadow: 0 6px 16px rgba(37,99,235,0.28); cursor: default;
        }
        .cr-crumb.active:hover { background: linear-gradient(135deg,#2563EB,#1D4ED8); color:#fff; }
        .cr-sep { color: #94A3B8; font-weight: 700; padding: 0 2px; }

        .cr-level-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 16px; font-weight: 700; color: #0F172A; margin: 0;
        }
        .cr-level-title small { color: #64748B; font-weight: 500; font-size: 13px; }

        .scheme-link {
          color: #2563EB; font-weight: 600; cursor: pointer;
          border-bottom: 1px dashed rgba(37,99,235,.45); transition: all .15s ease;
        }
        .scheme-link:hover { color: #1D4ED8; border-bottom-color: #1D4ED8; }

        .stat-pill {
          display: inline-block; min-width: 52px; text-align: center;
          padding: 5px 14px; border-radius: 999px;
          font-size: 12.5px; font-weight: 800; line-height: 1.4;
          box-shadow: inset 0 0 0 1px rgba(15,23,42,0.05);
        }
        .stat-primary { background: #E0ECFF; color: #1D4ED8; }
        .stat-success { background: #DCFCE7; color: #15803D; }
        .stat-danger  { background: #FEE2E2; color: #B91C1C; }
        .stat-warning { background: #FEF3C7; color: #B45309; }
        .stat-ack     { background: #FFEDD5; color: #C2410C; }
        .stat-payfail { background: #F3E8FF; color: #7E22CE; }
        .num-clickable { cursor: pointer; transition: transform .15s ease, box-shadow .15s ease, filter .15s ease; }
        .num-clickable:hover { filter: brightness(0.97); transform: translateY(-1px); box-shadow: inset 0 0 0 1px rgba(15,23,42,0.05), 0 5px 12px rgba(15,23,42,0.14); }

        .cr-back-btn {
          border: 1px solid #E2E8F0; background: #fff; color: #475569;
          border-radius: 10px; font-weight: 600; font-size: 13px; padding: 6px 14px;
        }
        .cr-back-btn:hover { background: #F1F5F9; color: #1D4ED8; border-color:#CBD5E1; }

        .cr-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin-bottom: 18px; }
        @media (max-width: 768px) { .cr-kpis { grid-template-columns: repeat(2, 1fr); } }
        .cr-kpi {
          position: relative; overflow: hidden;
          display: flex; align-items: center; gap: 14px;
          padding: 17px 18px; border-radius: 16px;
          border: 1px solid #EEF2F7; background: #fff;
          box-shadow: 0 6px 18px rgba(15,23,42,0.06);
          transition: transform .2s ease, box-shadow .2s ease;
          animation: crFadeUp .5s ease both;
        }
        .cr-kpi::after {
          content: ""; position: absolute; right: -22px; top: -22px;
          width: 74px; height: 74px; border-radius: 50%; opacity: .10;
        }
        .cr-kpi:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(15,23,42,0.13); }
        .cr-kpi-icon {
          width: 48px; height: 48px; border-radius: 13px; flex: 0 0 48px;
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          box-shadow: inset 0 0 0 1px rgba(15,23,42,0.04);
        }
        .cr-kpi-body { display: flex; flex-direction: column; line-height: 1.1; }
        .cr-kpi-num { font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -.5px; }
        .cr-kpi-label {
          font-size: 11.5px; font-weight: 700; color: #64748B;
          text-transform: uppercase; letter-spacing: .06em; margin-top: 3px;
        }
        .cr-kpi.kpi-primary .cr-kpi-icon { background: #E0ECFF; }
        .cr-kpi.kpi-primary { border-top: 3px solid #2563EB; }
        .cr-kpi.kpi-success .cr-kpi-icon { background: #DCFCE7; }
        .cr-kpi.kpi-success { border-top: 3px solid #16A34A; }
        .cr-kpi.kpi-danger .cr-kpi-icon { background: #FEE2E2; }
        .cr-kpi.kpi-danger { border-top: 3px solid #DC2626; }
        .cr-kpi.kpi-warning .cr-kpi-icon { background: #FEF3C7; }
        .cr-kpi.kpi-warning { border-top: 3px solid #D97706; }
        .cr-kpi.kpi-ack .cr-kpi-icon { background: #FFEDD5; }
        .cr-kpi.kpi-ack { border-top: 3px solid #EA580C; }
        .cr-kpi.kpi-payfail .cr-kpi-icon { background: #F3E8FF; }
        .cr-kpi.kpi-payfail { border-top: 3px solid #9333EA; }

        .cr-kpi.kpi-primary::after { background: #2563EB; }
        .cr-kpi.kpi-success::after { background: #16A34A; }
        .cr-kpi.kpi-danger::after  { background: #DC2626; }
        .cr-kpi.kpi-warning::after { background: #D97706; }
        .cr-kpi.kpi-ack::after     { background: #EA580C; }
        .cr-kpi.kpi-payfail::after { background: #9333EA; }

        @keyframes crModalIn {
          from { opacity: 0; transform: translateY(10px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cr-modal .modal-content {
          border: none; border-radius: 22px; overflow: hidden;
          background: #FFFFFF;
          box-shadow: 0 36px 84px rgba(17,24,39,0.40);
          animation: crModalIn .26s cubic-bezier(.16,1,.3,1) both;
        }
        .cr-modal .modal-header {
          position: relative; overflow: hidden;
          background: linear-gradient(120deg, #172554 0%, #1E40AF 45%, #2563EB 78%, #3B82F6 100%);
          color: #fff; border: none; padding: 14px 22px; align-items: center;
        }
        .cr-modal .modal-header::before {
          content: ""; position: absolute; top: -90%; right: -4%;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 70%);
          pointer-events: none;
        }
        .cr-modal .modal-header::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
          background: linear-gradient(90deg, #38BDF8, #818CF8, #C084FC);
        }
        .cr-modal-head { display: flex; align-items: center; gap: 12px; width: 100%; position: relative; z-index: 1; }
        .cr-modal-badge {
          width: 40px; height: 40px; border-radius: 11px; flex: 0 0 40px;
          background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.30);
          color: #fff; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px); box-shadow: 0 6px 14px rgba(0,0,0,.16);
        }
        .cr-modal-badge svg { width: 20px; height: 20px; }
        .cr-modal .modal-title { font-weight: 800; font-size: 17px; line-height: 1.2; color: #fff; letter-spacing: .2px; }
        .cr-modal-sub {
          font-size: 12px; font-weight: 600; color: #C7D9FF; margin-top: 2px;
          letter-spacing: normal; text-transform: none;
        }
        .cr-modal-close {
          margin-left: auto; width: 34px; height: 34px; border-radius: 10px; flex: 0 0 34px;
          border: 1px solid rgba(255,255,255,.35); background: rgba(255,255,255,.12); color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s ease; backdrop-filter: blur(4px);
        }
        .cr-modal-close:hover { background: rgba(255,255,255,.26); transform: rotate(90deg); }
        .cr-modal-close:focus-visible { outline: 3px solid rgba(255,255,255,.6); outline-offset: 2px; }
        .cr-modal .modal-body { background: #F8FAFC; padding: 24px 28px 28px; }
        .cr-modal-table {
          border-radius: 16px; overflow: hidden;
          border: 1px solid #E5E7EB; background: #FFFFFF;
          box-shadow: 0 8px 24px rgba(17,24,39,0.06);
        }
        .cr-empty {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          text-align: center; color: #6B7280; padding: 56px 0; font-weight: 600;
        }
        .cr-empty-icon {
          font-size: 44px; opacity: .5;
        }
        .swal2-popup { border-radius: 16px !important; }
      `}</style>

      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <div className="cr-header">
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div className="cr-header-icon">📊</div>
                <div>
                  <h2>{t("Cumulative Report")}</h2>
                </div>
              </div>
            </div>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-3">
        <Card className="cr-panel p-3">
          <Row className="mb-2">
            <Col md={12}>
              <div className="cr-toolbar">
                <div className="cr-year-wrap">
                  <span className="cr-year-label">{t("Financial Year")}</span>
                  <Form.Select
                    name="financialYearId"
                    value={data.financialYearId || ""}
                    onChange={handleInputs}
                    className="cr-year-select"
                  >
                    <option value="">{t("Select Year")}</option>
                    {financialyearListData.map((list) => (
                      <option
                        key={list.financialYearMasterId}
                        value={list.financialYearMasterId}
                      >
                        {list.financialYear}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div className="cr-toggle">
                  <div
                    style={getRadioPillStyle("SCHEME")}
                    onMouseEnter={() => setHovered("SCHEME")}
                    onMouseLeave={() => setHovered(null)}
                    onClick={openSchemeRoot}
                  >
                    <span style={radioToggleStyles.icon}>📑</span>
                    {t("Scheme Wise")}
                  </div>
                  <div
                    style={getRadioPillStyle("CONSOLIDATED")}
                    onMouseEnter={() => setHovered("CONSOLIDATED")}
                    onMouseLeave={() => setHovered(null)}
                    onClick={openConsolidated}
                  >
                    <span style={radioToggleStyles.icon}>📍</span>
                    {t("All Schemes Consolidated")}
                  </div>
                </div>

                <div className="cr-dl-group">
                  <button
                    type="button"
                    className="cr-dl cr-dl-pdf"
                    disabled={!!downloading}
                    onClick={() => downloadReport("pdf")}
                    title={t("Download the current view as a styled PDF")}
                  >
                    {downloading === "pdf" ? `⏳ ${t("Preparing…")}` : `📄 ${t("PDF")}`}
                  </button>
                  <button
                    type="button"
                    className="cr-dl cr-dl-xls"
                    disabled={!!downloading}
                    onClick={() => downloadReport("excel")}
                    title={t("Download the current view as a styled Excel")}
                  >
                    {downloading === "excel" ? `⏳ ${t("Preparing…")}` : `📊 ${t("Excel")}`}
                  </button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Scheme-wise root table */}
          {viewType === "SCHEME" && !showSubScheme && !geoOpen && (
            <>
              <KpiStrip rows={listData} />
              <DataTable
                tableClassName="data-table-head-light table-responsive"
                columns={SchemeColumns}
                data={listData}
                highlightOnHover
                pagination
                paginationPerPage={countPerPage}
                progressPending={loading}
                theme="solarized"
                customStyles={customStyles}
              />
            </>
          )}
        </Card>

        {/* Sub-scheme table */}
        {viewType === "SCHEME" && showSubScheme && !geoOpen && (
          <Card className="cr-panel mt-4 p-3">
            <Crumbs />
            <KpiStrip rows={subSchemeData} />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="cr-level-title">
                📌 <span>{t("Sub-Scheme Details")}</span>
                <small>({selectedScheme?.schemeName})</small>
              </h5>
              <Button className="cr-back-btn" size="sm" onClick={openSchemeRoot}>
                ✖ {t("Close")}
              </Button>
            </div>
            <DataTable
              columns={SubSchemeColumns}
              data={subSchemeData}
              highlightOnHover
              pagination
              progressPending={subSchemeLoading}
              theme="solarized"
              customStyles={customStyles}
            />
          </Card>
        )}

        {/* Geo drill (Division -> District -> Taluk) */}
        {geoOpen && (
          <Card className="cr-panel mt-4 p-3">
            <Crumbs />
            <KpiStrip rows={geoRows} />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="cr-level-title">
                {geoMeta[geoLevel].icon} <span>{geoMeta[geoLevel].title} {t("Details")}</span>
                {geoLevel === "DISTRICT" && geoDivision && (
                  <small>({geoDivision.divisionName})</small>
                )}
                {geoLevel === "TALUK" && geoDistrict && (
                  <small>({geoDistrict.districtName})</small>
                )}
              </h5>
              {geoLevel !== "DIVISION" ? (
                <Button
                  className="cr-back-btn"
                  size="sm"
                  onClick={() => geoBack(geoLevel === "TALUK" ? "DISTRICT" : "DIVISION")}
                >
                  ⬅ {t("Back")}
                </Button>
              ) : (
                viewType === "SCHEME" && (
                  <Button className="cr-back-btn" size="sm" onClick={goSubSchemeTable}>
                    ⬅ {t("Back")}
                  </Button>
                )
              )}
            </div>
            <DataTable
              columns={geoColumns()}
              data={geoRows}
              highlightOnHover
              pagination
              progressPending={geoLoading}
              theme="solarized"
              customStyles={customStyles}
            />
          </Card>
        )}
      </Block>

      {/* Application details modal */}
      <Modal
        show={detailOpen}
        onHide={() => setDetailOpen(false)}
        size="xl"
        centered
        dialogClassName="cr-modal"
        scrollable
      >
        <Modal.Header>
          <div className="cr-modal-head">
            <div className="cr-modal-badge">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </div>
            <div>
              <Modal.Title>{detailTitle}</Modal.Title>
              <div className="cr-modal-sub">
                {detailLoading
                  ? t("Loading applications…")
                  : `${detailRows.length.toLocaleString("en-IN")} ${t(
                      "application(s)"
                    )}`}
              </div>
            </div>
            <div className="cr-modal-dl">
              <button
                type="button"
                className="cr-mdl-btn cr-mdl-pdf"
                disabled={!!downloading || detailLoading || detailRows.length === 0}
                onClick={() => downloadDetails("pdf")}
                title={t("Download as PDF")}
              >
                {downloading === "pdf" ? `⏳ ${t("Preparing…")}` : `📄 ${t("PDF")}`}
              </button>
              <button
                type="button"
                className="cr-mdl-btn cr-mdl-xls"
                disabled={!!downloading || detailLoading || detailRows.length === 0}
                onClick={() => downloadDetails("excel")}
                title={t("Download as Excel")}
              >
                {downloading === "excel" ? `⏳ ${t("Preparing…")}` : `📊 ${t("Excel")}`}
              </button>
            </div>
            <button
              type="button"
              className="cr-modal-close"
              style={{ marginLeft: "10px" }}
              aria-label={t("Close")}
              onClick={() => setDetailOpen(false)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {!detailLoading && detailRows.length === 0 ? (
            <div className="cr-empty">
              <div className="cr-empty-icon">
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
              </div>
              {t("No applications found")}
            </div>
          ) : (
            <div className="cr-modal-table">
              <DataTable
                columns={DetailColumns}
                data={detailRows}
                progressPending={detailLoading}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                highlightOnHover
                dense
                theme="solarized"
                customStyles={customStyles}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default CumulativeReport;
