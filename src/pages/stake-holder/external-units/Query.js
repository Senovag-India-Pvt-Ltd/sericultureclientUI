import { Card, Form, Row, Col, Table, Badge } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useMemo, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

// Inject page-scoped styles once
if (typeof document !== "undefined" && !document.getElementById("sql-runner-styles")) {
  const s = document.createElement("style");
  s.id = "sql-runner-styles";
  s.innerHTML = `
    .sqlr-wrap { animation: sqlr-fade .35s ease; }
    @keyframes sqlr-fade { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:none; } }
    .sqlr-hero {
      background: linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#312e81 100%);
      color:#fff; border-radius:18px; padding:22px 26px;
      box-shadow:0 18px 50px rgba(15,23,42,.25);
      position:relative; overflow:hidden;
    }
    .sqlr-hero::after {
      content:""; position:absolute; right:-60px; top:-60px; width:220px; height:220px;
      background: radial-gradient(circle,#22d3ee33,transparent 70%);
    }
    .sqlr-hero h2 { font-size:22px; font-weight:800; margin:0; letter-spacing:.02em; }
    .sqlr-hero p  { margin:4px 0 0; opacity:.85; font-size:13px; }
    .sqlr-db-pill {
      display:inline-flex; align-items:center; gap:8px;
      background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.18);
      border-radius:999px; padding:6px 14px; font-size:12px; font-weight:600;
      backdrop-filter: blur(6px);
    }
    .sqlr-db-pill .dot { width:8px; height:8px; border-radius:50%; background:#22c55e; box-shadow:0 0 0 4px rgba(34,197,94,.25); }

    .sqlr-card { border:0; border-radius:16px; box-shadow:0 10px 30px rgba(15,23,42,.06); overflow:hidden; }
    .sqlr-card .card-body { padding:22px; }

    .sqlr-editor-wrap { position:relative; border-radius:14px; overflow:hidden; border:1px solid #1f2937; box-shadow:inset 0 0 0 1px #0b1220; }
    .sqlr-editor-bar {
      background:#0b1220; color:#94a3b8; font-size:12px; font-weight:600;
      padding:8px 14px; display:flex; align-items:center; justify-content:space-between;
      border-bottom:1px solid #1f2937;
    }
    .sqlr-editor-bar .lights { display:flex; gap:6px; }
    .sqlr-editor-bar .lights span { width:11px; height:11px; border-radius:50%; }
    .sqlr-editor-bar .lights .r { background:#ef4444; }
    .sqlr-editor-bar .lights .y { background:#f59e0b; }
    .sqlr-editor-bar .lights .g { background:#22c55e; }

    .sqlr-textarea {
      width:100%; min-height:220px; resize:vertical;
      background:#0f172a !important; color:#e2e8f0 !important;
      font-family: "Fira Code","JetBrains Mono",Consolas,Menlo,monospace !important;
      font-size:14px; line-height:1.55;
      border:0 !important; border-radius:0 !important; padding:16px 18px;
      caret-color:#22d3ee;
    }
    .sqlr-textarea:focus { outline:none; box-shadow:none !important; background:#0f172a !important; color:#e2e8f0 !important; }
    .sqlr-textarea::placeholder { color:#64748b; }

    .sqlr-actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; align-items:center; }
    .sqlr-btn {
      border:0; border-radius:11px; padding:10px 22px; font-weight:700; font-size:13px;
      color:#fff; cursor:pointer; display:inline-flex; align-items:center; gap:8px;
      transition: transform .12s ease, box-shadow .12s ease, opacity .12s;
    }
    .sqlr-btn:hover { transform:translateY(-1px); }
    .sqlr-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; }
    .sqlr-btn-run { background:linear-gradient(135deg,#0ea5e9,#22d3ee); box-shadow:0 10px 22px rgba(14,165,233,.35); }
    .sqlr-btn-clear { background:linear-gradient(135deg,#64748b,#475569); box-shadow:0 8px 18px rgba(71,85,105,.25); }
    .sqlr-btn-sample { background:linear-gradient(135deg,#a855f7,#7c3aed); box-shadow:0 8px 18px rgba(124,58,237,.28); }

    .sqlr-chip {
      display:inline-flex; align-items:center; gap:6px;
      padding:5px 11px; border-radius:999px; font-size:11px; font-weight:700;
      letter-spacing:.04em; text-transform:uppercase;
    }
    .sqlr-chip.select { background:#dcfce7; color:#166534; }
    .sqlr-chip.update { background:#fef3c7; color:#92400e; }
    .sqlr-chip.delete { background:#fee2e2; color:#991b1b; }
    .sqlr-chip.insert { background:#dbeafe; color:#1e40af; }
    .sqlr-chip.other  { background:#e2e8f0; color:#334155; }

    .sqlr-result-card .card-header {
      background:linear-gradient(135deg,#f8fafc,#eef2ff);
      border-bottom:1px solid #e2e8f0;
      padding:14px 22px; font-weight:800; color:#0f172a; font-size:14px;
      display:flex; justify-content:space-between; align-items:center;
    }
    .sqlr-result-table thead th {
      background:linear-gradient(135deg,#0f172a,#1e293b) !important;
      color:#e2e8f0 !important; font-size:12px; font-weight:700;
      text-transform:uppercase; letter-spacing:.03em;
      position:sticky; top:0; z-index:1; white-space:nowrap;
    }
    .sqlr-result-table tbody tr:nth-child(odd) td { background:#f8fafc; }
    .sqlr-result-table tbody tr:hover td { background:#eef2ff !important; }
    .sqlr-result-table td, .sqlr-result-table th { padding:10px 14px !important; font-size:13px; vertical-align:middle; }
    .sqlr-scroll { max-height:520px; overflow:auto; }
    .sqlr-scroll::-webkit-scrollbar { width:10px; height:12px; }
    .sqlr-scroll::-webkit-scrollbar-track { background:#f1f5f9; }
    .sqlr-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0ea5e9,#7c3aed); border-radius:6px; }

    .sqlr-empty { padding:60px 20px; text-align:center; color:#64748b; }
    .sqlr-empty .icon { font-size:46px; opacity:.5; }

    .sqlr-toolbar {
      display:flex; flex-wrap:wrap; gap:10px; align-items:center;
      padding:10px 18px; background:#f8fafc; border-bottom:1px solid #e2e8f0;
    }
    .sqlr-toolbar.bottom { border-top:1px solid #e2e8f0; border-bottom:0; border-radius:0 0 16px 16px; }
    .sqlr-search {
      flex:1; min-width:220px; max-width:380px;
      border:1px solid #cbd5e1; border-radius:10px; padding:7px 12px;
      font-size:13px; background:#fff; color:#0f172a; outline:none;
      transition: border-color .12s, box-shadow .12s;
    }
    .sqlr-search:focus { border-color:#0ea5e9; box-shadow:0 0 0 3px rgba(14,165,233,.18); }
    .sqlr-pagesize {
      border:1px solid #cbd5e1; border-radius:10px; padding:6px 10px;
      font-size:12px; background:#fff; color:#0f172a; font-weight:600; cursor:pointer;
    }
    .sqlr-pager { display:flex; gap:4px; align-items:center; margin-left:auto; }
    .sqlr-pager-btn {
      border:1px solid #cbd5e1; background:#fff; color:#334155;
      border-radius:8px; padding:6px 10px; font-size:12px; font-weight:700; cursor:pointer;
      min-width:34px;
    }
    .sqlr-pager-btn:hover:not(:disabled) { background:#eef2ff; border-color:#a5b4fc; color:#3730a3; }
    .sqlr-pager-btn:disabled { opacity:.45; cursor:not-allowed; }
    .sqlr-pager-info { font-size:12px; color:#475569; font-weight:600; padding:0 8px; }
    .sqlr-cell { max-width:360px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

    /* ---------- SweetAlert theming ---------- */
    .sqlr-swal-container { backdrop-filter: blur(5px); background: rgba(15,23,42,.45) !important; }
    .sqlr-swal {
      border-radius: 22px !important;
      padding: 6px 4px 18px !important;
      background: linear-gradient(180deg,#ffffff 0%,#f8fafc 100%) !important;
      box-shadow: 0 30px 80px rgba(15,23,42,.28), 0 0 0 1px rgba(15,23,42,.04) !important;
      overflow: hidden !important;
      position: relative !important;
      max-width: 520px !important;
    }
    .sqlr-swal::before {
      content:""; position:absolute; top:0; left:0; right:0; height:6px;
      background: linear-gradient(90deg,#94a3b8,#64748b);
    }
    .sqlr-swal-error::before   { background: linear-gradient(90deg,#f87171,#dc2626,#9f1239) !important; }
    .sqlr-swal-success::before { background: linear-gradient(90deg,#34d399,#0ea5e9,#6366f1) !important; }
    .sqlr-swal-warning::before { background: linear-gradient(90deg,#fbbf24,#f97316,#dc2626) !important; }

    .sqlr-swal .swal2-title {
      font-size: 22px !important; font-weight: 800 !important;
      color: #0f172a !important; letter-spacing: -.01em !important;
      margin-top: 6px !important; padding: 0 24px !important;
    }
    .sqlr-swal .swal2-html-container {
      font-size: 14px !important; color: #475569 !important;
      line-height: 1.6 !important; margin: 10px 22px 6px !important;
    }
    .sqlr-swal .swal2-icon {
      border-width: 3px !important;
      margin: 22px auto 6px !important;
      transform-origin: center;
    }
    .sqlr-swal-error   .swal2-icon.swal2-error   { box-shadow: 0 0 0 8px rgba(239,68,68,.10); }
    .sqlr-swal-success .swal2-icon.swal2-success { box-shadow: 0 0 0 8px rgba(34,197,94,.12); }
    .sqlr-swal-warning .swal2-icon.swal2-warning { box-shadow: 0 0 0 8px rgba(245,158,11,.14); }

    .sqlr-swal .swal2-actions { gap: 10px !important; margin-top: 18px !important; }
    .sqlr-swal .swal2-styled {
      border-radius: 12px !important; padding: 11px 28px !important;
      font-weight: 700 !important; font-size: 14px !important;
      letter-spacing: .01em !important; border: 0 !important;
      transition: transform .14s ease, box-shadow .14s ease, filter .14s !important;
    }
    .sqlr-swal .swal2-styled:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.05); }
    .sqlr-swal .swal2-styled:focus { box-shadow: 0 0 0 4px rgba(99,102,241,.20) !important; }
    .sqlr-swal-error   .swal2-confirm { background: linear-gradient(135deg,#ef4444,#b91c1c) !important; box-shadow: 0 12px 26px rgba(220,38,38,.30) !important; }
    .sqlr-swal-success .swal2-confirm { background: linear-gradient(135deg,#0ea5e9,#22d3ee) !important; box-shadow: 0 12px 26px rgba(14,165,233,.30) !important; }
    .sqlr-swal-warning .swal2-confirm { background: linear-gradient(135deg,#ef4444,#9f1239) !important; box-shadow: 0 12px 26px rgba(220,38,38,.30) !important; }
    .sqlr-swal .swal2-cancel { background: #f1f5f9 !important; color: #334155 !important; box-shadow: 0 4px 10px rgba(15,23,42,.06) !important; }
    .sqlr-swal .swal2-cancel:hover { background:#e2e8f0 !important; }

    @keyframes sqlr-pop-in { 0% { opacity:0; transform: scale(.88) translateY(14px);} 100% { opacity:1; transform: scale(1) translateY(0);} }
    @keyframes sqlr-pop-out { 0% { opacity:1; transform: scale(1);} 100% { opacity:0; transform: scale(.94);} }
    .sqlr-pop-show { animation: sqlr-pop-in .35s cubic-bezier(.34,1.56,.64,1); }
    .sqlr-pop-hide { animation: sqlr-pop-out .18s ease forwards; }

    .sqlr-query-preview {
      background: linear-gradient(180deg,#0b1220,#0f172a);
      color:#fca5a5; padding:14px 16px; border-radius:12px;
      font-family:"Fira Code",Consolas,monospace; font-size:13px; line-height:1.55;
      text-align:left; border:1px solid #7f1d1d;
      box-shadow: inset 0 0 0 1px rgba(248,113,113,.15), 0 8px 22px rgba(127,29,29,.18);
      max-height:220px; overflow:auto;
      white-space:pre-wrap; word-break:break-word;
    }
    .sqlr-query-preview::-webkit-scrollbar { width:8px; height:8px; }
    .sqlr-query-preview::-webkit-scrollbar-thumb { background:#7f1d1d; border-radius:6px; }

    .sqlr-countdown {
      margin-top:14px; padding:11px 14px; border-radius:12px;
      background: linear-gradient(135deg,#fef2f2,#fee2e2);
      color:#991b1b; font-weight:700; font-size:13px;
      border:1px dashed #fca5a5; display:flex; align-items:center; justify-content:center; gap:8px;
    }
    .sqlr-countdown .num {
      font-size:20px; font-weight:900; color:#dc2626; min-width:30px;
      display:inline-block; text-align:center;
      animation: sqlr-tick 1s ease-in-out infinite;
    }
    @keyframes sqlr-tick { 50% { transform: scale(1.12); } }
  `;
  document.head.appendChild(s);
}

// ---------- Helpers ----------
const detectQueryType = (raw) => {
  const q = String(raw || "").trim().replace(/^\(\s*/, "");
  const m = q.match(/^[a-zA-Z]+/);
  return m ? m[0].toUpperCase() : "OTHER";
};

const escapeHtml = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

function Query() {
  const [queryText, setQueryText] = useState("");
  const [validated, setValidated] = useState(false);
  const [running, setRunning] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // "" | "success" | "error" | "info"
  const [executedQuery, setExecutedQuery] = useState("");
  const lastTypeRef = useRef("");

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const filteredRows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      Object.values(r || {}).some((v) =>
        String(v ?? "").toLowerCase().includes(q)
      )
    );
  }, [rows, filter]);

  const effectivePageSize = pageSize === 0 ? Math.max(filteredRows.length, 1) : pageSize;
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / effectivePageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageStart = safePage * effectivePageSize;
  const pagedRows = filteredRows.slice(pageStart, pageStart + effectivePageSize);

  useEffect(() => { setPage(0); }, [rows, filter, pageSize]);

  const queryType = useMemo(() => detectQueryType(queryText), [queryText]);
  const chipClass =
    queryType === "SELECT" ? "select"
    : queryType === "UPDATE" ? "update"
    : queryType === "DELETE" ? "delete"
    : queryType === "INSERT" ? "insert"
    : "other";

  // ---------- Confirmation dialog (countdown + red query preview) ----------
  const confirmDestructive = (q, type, waitSecs) => {
    const safe = escapeHtml(q);
    const COUNT = Math.max(1, Number(waitSecs) || 30);

    return Swal.fire({
      icon: "warning",
      title: `Are you sure you want to run this ${type}?`,
      html: `
        <div style="text-align:left; font-size:13px; color:#475569; margin-bottom:10px;">
          You are about to execute the following <b style="color:#b91c1c;">${type}</b> query.
          Please review carefully — this action cannot be undone.
        </div>
        <pre class="sqlr-query-preview">${safe}</pre>
        <div class="sqlr-countdown">
          <span>Please wait</span>
          <span class="num" id="sqlr-cd">${COUNT}</span>
          <span>second(s) before you can confirm…</span>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `Confirm in ${COUNT}s`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      focusCancel: true,
      backdrop: true,
      showClass: { popup: "sqlr-pop-show" },
      hideClass: { popup: "sqlr-pop-hide" },
      customClass: {
        container: "sqlr-swal-container",
        popup: "sqlr-swal sqlr-swal-warning",
      },
      didOpen: () => {
        const popup = Swal.getPopup();
        const confirmBtn = Swal.getConfirmButton();
        const cdEl = popup.querySelector("#sqlr-cd");
        let remaining = COUNT;
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = "0.55";
        confirmBtn.style.cursor = "not-allowed";

        const t = setInterval(() => {
          remaining -= 1;
          if (cdEl) cdEl.textContent = String(remaining);
          confirmBtn.textContent = remaining > 0 ? `Confirm in ${remaining}s` : "Confirm";
          if (remaining <= 0) {
            clearInterval(t);
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = "1";
            confirmBtn.style.cursor = "pointer";
            const cd = popup.querySelector(".sqlr-countdown");
            if (cd) {
              cd.style.background = "#ecfdf5";
              cd.style.borderColor = "#86efac";
              cd.style.color = "#065f46";
              cd.innerHTML = "You may now confirm or cancel.";
            }
          }
        }, 1000);

        popup.addEventListener("swal-cleanup", () => clearInterval(t));
      },
      willClose: (popup) => {
        popup.dispatchEvent(new Event("swal-cleanup"));
      },
    });
  };

  const showError = (msg) =>
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      html: msg,
      confirmButtonText: "Got it",
      showClass: { popup: "sqlr-pop-show" },
      hideClass: { popup: "sqlr-pop-hide" },
      customClass: {
        container: "sqlr-swal-container",
        popup: "sqlr-swal sqlr-swal-error",
      },
    });

  const showInfo = (msg) =>
    Swal.fire({
      icon: "success",
      title: "All done",
      html: msg,
      confirmButtonText: "Great",
      showClass: { popup: "sqlr-pop-show" },
      hideClass: { popup: "sqlr-pop-hide" },
      customClass: {
        container: "sqlr-swal-container",
        popup: "sqlr-swal sqlr-swal-success",
      },
    });

  // ---------- Backend call ----------
  const callBackend = (q, confirmed) =>
    api.post(baseURL + "query/execute", { query: q, confirmed: !!confirmed });

  const handleContent = async (q, content) => {
    const type = content?.queryType || detectQueryType(q);
    lastTypeRef.current = type;

    // 1) Backend asks for confirmation (UPDATE / DELETE first call)
    if (content?.requiresConfirmation === true) {
      const wait = content.confirmationWaitSeconds || 30;
      const res = await confirmDestructive(q, type, wait);
      if (!res.isConfirmed) {
        setStatusMsg("Execution cancelled.");
        setStatusType("info");
        return;
      }
      // Second call with confirmed=true
      await executeRequest(q, true);
      return;
    }

    // 2) Validation error from backend (e.g. WHERE missing) → no affectedRows, no rows
    if (content?.affectedRows == null) {
      const msg = content?.message || "Query failed.";
      setRows([]); setColumns([]);
      setStatusMsg(msg); setStatusType("error");
      showError(msg);
      return;
    }

    // 3) SELECT → render rows + columns from backend
    if (type === "SELECT") {
      const cols = (Array.isArray(content.columns) && content.columns.length)
        ? content.columns
        : (content.rows && content.rows[0] ? Object.keys(content.rows[0]) : []);
      setColumns(cols);
      setRows(Array.isArray(content.rows) ? content.rows : []);
      setStatusMsg(content.message || `${content.affectedRows} row(s) returned.`);
      setStatusType("success");
      return;
    }

    // 4) UPDATE / DELETE / INSERT / OTHER → success
    setRows([]); setColumns([]);
    const okMsg = content.message || `${content.affectedRows} row(s) affected.`;
    setStatusMsg(okMsg);
    setStatusType("success");
    showInfo(`<b>${type}</b> executed successfully.<br/><small>${okMsg}</small>`);
  };

  const executeRequest = async (q, confirmed) => {
    setRunning(true);
    if (!confirmed) { setStatusMsg(""); setStatusType(""); }
    try {
      const response = await callBackend(q, confirmed);
      const content = response?.data?.content ?? response?.data ?? {};
      setExecutedQuery(q);
      await handleContent(q, content);
    } catch (err) {
      const msg =
        err?.response?.data?.content?.message ||
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Error executing query";
      setRows([]); setColumns([]);
      setStatusMsg(msg); setStatusType("error");
      showError(msg);
    } finally {
      setRunning(false);
    }
  };

  // ---------- Submit ----------
  const runQuery = async (event) => {
    event?.preventDefault?.();
    setValidated(true);
    const q = String(queryText || "").trim();
    if (!q) {
      showError("Please enter a SQL query to execute.");
      return;
    }
    await executeRequest(q, false);
  };

  const clearAll = () => {
    setQueryText("");
    setRows([]);
    setColumns([]);
    setStatusMsg("");
    setStatusType("");
    setExecutedQuery("");
    setValidated(false);
    setFilter("");
    setPage(0);
  };

  const insertSample = () => {
    setQueryText("SELECT * FROM your_table WHERE id = 1 LIMIT 50;");
  };

  return (
    <Layout title="SQL Query Runner">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">SQL Query Runner</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n3 sqlr-wrap">
        {/* Hero */}
        <div className="sqlr-hero mb-4">
          <Row className="g-3 align-items-center">
            <Col md={8}>
              <h2>SQL <span style={{ color: "#67e8f9" }}>Query Runner</span></h2>
              <p>
                Write any SQL — <b>SELECT</b> returns rows below.
                <b> UPDATE</b>/<b>DELETE</b> require a <b>WHERE</b> clause and a 30-second confirmation.
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <span className="sqlr-db-pill">
                <span className="dot" />
                Connected
              </span>
            </Col>
          </Row>
        </div>

        {/* Editor card */}
        <Card className="sqlr-card mb-4">
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={runQuery}>
              <Row className="g-3">
                <Col xs={12}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label htmlFor="queryName" className="mb-0" style={{ fontWeight: 700, color: "#0f172a" }}>
                      SQL Query <span className="text-danger">*</span>
                    </Form.Label>
                    <span className={`sqlr-chip ${chipClass}`}>
                      {queryType || "OTHER"}
                    </span>
                  </div>

                  <div className="sqlr-editor-wrap">
                    <div className="sqlr-editor-bar">
                      <span className="lights">
                        <span className="r" /><span className="y" /><span className="g" />
                      </span>
                      <span>query.sql</span>
                      <span style={{ fontSize: 11, opacity: .8 }}>
                        {queryText.length} chars
                      </span>
                    </div>
                    <Form.Control
                      as="textarea"
                      id="queryName"
                      name="queryName"
                      className="sqlr-textarea"
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder={`-- Examples:\nSELECT * FROM users WHERE id = 1 LIMIT 100;\nUPDATE users SET active = 1 WHERE id = 42;\nDELETE FROM users WHERE id = 99;`}
                      rows={10}
                      required
                      spellCheck={false}
                    />
                  </div>
                  <Form.Control.Feedback type="invalid">Query is required.</Form.Control.Feedback>

                  <div className="sqlr-actions">
                    <button type="submit" className="sqlr-btn sqlr-btn-run" disabled={running}>
                      {running ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" />
                          Running…
                        </>
                      ) : (
                        <>▶ Execute</>
                      )}
                    </button>
                    <button type="button" className="sqlr-btn sqlr-btn-clear" onClick={clearAll} disabled={running}>
                      ✕ Clear
                    </button>
                    <button type="button" className="sqlr-btn sqlr-btn-sample" onClick={insertSample} disabled={running}>
                      ✦ Insert sample
                    </button>

                    {statusMsg && (
                      <span
                        style={{
                          marginLeft: "auto",
                          padding: "8px 14px",
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            statusType === "success" ? "#dcfce7"
                            : statusType === "error"  ? "#fee2e2"
                            : "#e0e7ff",
                          color:
                            statusType === "success" ? "#166534"
                            : statusType === "error"  ? "#991b1b"
                            : "#3730a3",
                        }}
                      >
                        {statusMsg}
                      </span>
                    )}
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Results card */}
        <Card className="sqlr-card sqlr-result-card">
          <Card.Header className="card-header">
            <span>
              📊 Results
              {executedQuery && rows.length > 0 && (
                <Badge bg="dark" className="ms-2" style={{ fontSize: 11 }}>
                  {rows.length} row{rows.length === 1 ? "" : "s"}
                </Badge>
              )}
            </span>
            {executedQuery && (
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                Last query: {lastTypeRef.current || "—"}
              </span>
            )}
          </Card.Header>

          {rows.length === 0 ? (
            <div className="sqlr-empty">
              <div className="icon">🗂️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginTop: 8 }}>
                No rows to display
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Run a <b>SELECT</b> query to see results here.
              </div>
            </div>
          ) : (
            <>
              <div className="sqlr-toolbar">
                <input
                  type="text"
                  className="sqlr-search"
                  placeholder="🔍 Filter rows…"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <select
                  className="sqlr-pagesize"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  title="Rows per page"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                  <option value={0}>All</option>
                </select>

                <div className="sqlr-pager">
                  <button type="button" className="sqlr-pager-btn"
                    onClick={() => setPage(0)} disabled={safePage === 0}>«</button>
                  <button type="button" className="sqlr-pager-btn"
                    onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0}>‹</button>
                  <span className="sqlr-pager-info">
                    Page <b>{safePage + 1}</b> of <b>{pageCount}</b>
                  </span>
                  <button type="button" className="sqlr-pager-btn"
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    disabled={safePage >= pageCount - 1}>›</button>
                  <button type="button" className="sqlr-pager-btn"
                    onClick={() => setPage(pageCount - 1)}
                    disabled={safePage >= pageCount - 1}>»</button>
                </div>
              </div>

              <div className="sqlr-scroll">
                <Table striped hover className="sqlr-result-table mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: 56 }}>#</th>
                      {columns.map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((r, i) => {
                      const globalIdx = pageStart + i + 1;
                      return (
                        <tr key={globalIdx}>
                          <td style={{ color: "#94a3b8", fontWeight: 700 }}>{globalIdx}</td>
                          {columns.map((c) => {
                            const v = r?.[c];
                            const display =
                              v === null || v === undefined
                                ? <span style={{ color: "#94a3b8", fontStyle: "italic" }}>NULL</span>
                                : typeof v === "object" ? JSON.stringify(v) : String(v);
                            const text = typeof display === "string" ? display : "";
                            return (
                              <td key={c} className="sqlr-cell" title={text}>
                                {display}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              <div className="sqlr-toolbar bottom">
                <span className="sqlr-pager-info">
                  Showing <b>{filteredRows.length === 0 ? 0 : pageStart + 1}</b>–
                  <b>{Math.min(pageStart + effectivePageSize, filteredRows.length)}</b> of
                  &nbsp;<b>{filteredRows.length}</b>
                  {filter && rows.length !== filteredRows.length && (
                    <> &nbsp;(filtered from {rows.length})</>
                  )}
                </span>
              </div>
            </>
          )}
        </Card>
      </Block>
    </Layout>
  );
}

export default Query;
