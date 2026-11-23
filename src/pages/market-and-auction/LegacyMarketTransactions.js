import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Nav, Row, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import api from "../../services/auth/api";

// XC-004: pre-project (legacy) cocoon market transactions - import the old system's Excel / CSV export (re-importing a
// newer export synchronises without duplicates) and trace transactions across the legacy and the new system.
// Backend: market-auction /v1/legacy-market/*

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const swalClass = { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" };

const styles = `
  .lmt-head { padding:12px 18px; background:linear-gradient(90deg,#1e67a8 0%,#2b7ac0 60%,#3b8dd6 100%); border-radius:12px; margin-bottom:10px; }
  .lmt-head h2 { color:#fff !important; margin:0; font-size:1.3rem; font-weight:700; }
  .lmt-head p { color:#e3effb; margin:4px 0 0; font-size:.84rem; }
  .lmt-card { border:none !important; border-radius:14px !important; box-shadow:0 2px 12px rgba(0,0,0,.08) !important; }
  .lmt-tabs .nav-link { font-weight:700; color:#4a5568; }
  .lmt-tabs .nav-link.active { color:#1e67a8; border-bottom:3px solid #1e67a8; }
  .lmt-badge { border-radius:999px; padding:2px 10px; font-size:.72rem; font-weight:700; white-space:nowrap; }
  .lmt-badge.LEGACY { background:#fff4e5; color:#b26a00; }
  .lmt-badge.NEW_SYSTEM { background:#e9f8ef; color:#18794e; }
  .lmt-stats { display:flex; flex-wrap:wrap; gap:8px; }
  .lmt-stat { background:#f3f8fe; border:1px solid #dbe6f3; border-radius:10px; padding:8px 14px; min-width:110px; }
  .lmt-stat b { display:block; font-size:1.15rem; color:#1f2d3d; }
  .lmt-stat span { font-size:.74rem; color:#6b7a8c; text-transform:uppercase; letter-spacing:.03em; }
  .lmt-stat.bad b { color:#c43257; } .lmt-stat.ok b { color:#18794e; }
  .lmt-table th { font-size:.74rem; text-transform:uppercase; color:#6b7a8c; white-space:nowrap; }
  .lmt-table td { font-size:.82rem; vertical-align:middle; }
  .lmt-note { font-size:.8rem; color:#6b7a8c; }
`;

const emptyQuery = { fruitsId: "", mobile: "", lotNumber: "", marketId: "", legacyTxnId: "", fromDate: "", toDate: "" };

function LegacyMarketTransactions() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("trace");
  const [markets, setMarkets] = useState([]);

  // trace
  const [query, setQuery] = useState(emptyQuery);
  const [trace, setTrace] = useState(null);
  const [tracing, setTracing] = useState(false);

  // import
  const [sourceSystem, setSourceSystem] = useState("");
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [importing, setImporting] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorsOf, setErrorsOf] = useState(null); // { run, rows }

  useEffect(() => {
    api.get(baseURLMaster + "marketMaster/get-all")
      .then((res) => setMarkets(res.data?.content?.marketMaster || []))
      .catch(() => setMarkets([]));
  }, []);

  const loadHistory = () => {
    api.get(baseURLMarket + "legacy-market/imports")
      .then((res) => setHistory(res.data?.content || []))
      .catch(() => setHistory([]));
  };
  useEffect(loadHistory, []);

  const setQ = (e) => setQuery((q) => ({ ...q, [e.target.name]: e.target.value }));

  const runTrace = (e) => {
    e.preventDefault();
    const params = {};
    Object.entries(query).forEach(([k, v]) => { if (String(v).trim()) params[k] = String(v).trim(); });
    if (!params.fruitsId && !params.mobile && !params.lotNumber && !params.legacyTxnId && !params.marketId) {
      Swal.fire({ icon: "info", title: t("Enter a FRUITS ID, mobile number, lot number, market or legacy transaction id."), customClass: swalClass });
      return;
    }
    setTracing(true);
    api.get(baseURLMarket + "legacy-market/trace", { params })
      .then((res) => {
        if (res.data?.errorCode === -1) {
          Swal.fire({ icon: "warning", title: t("Cannot search"), text: res.data.errorMessages?.[0], customClass: swalClass });
          setTrace(null);
        } else {
          setTrace(res.data?.content || null);
        }
      })
      .catch(() => Swal.fire({ icon: "error", title: t("Search failed"), text: t("Something went wrong!"), customClass: swalClass }))
      .finally(() => setTracing(false));
  };

  const downloadTemplate = () => {
    api.get(baseURLMarket + "legacy-market/template", { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "legacy-cocoon-market-template.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(() => Swal.fire({ icon: "error", title: t("Template could not be downloaded"), customClass: swalClass }));
  };

  const runImport = async (e) => {
    e.preventDefault();
    if (!sourceSystem.trim()) {
      Swal.fire({ icon: "info", title: t("Enter the legacy system name"), customClass: swalClass });
      return;
    }
    if (!file) {
      Swal.fire({ icon: "info", title: t("Choose the export file (.xlsx or .csv)"), customClass: swalClass });
      return;
    }
    const fd = new FormData();
    fd.append("sourceSystem", sourceSystem.trim());
    fd.append("file", file);
    setImporting(true);
    try {
      const res = await api.post(baseURLMarket + "legacy-market/import", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.errorCode === -1) {
        Swal.fire({ icon: "warning", title: t("Import not done"), text: res.data.errorMessages?.[0], customClass: swalClass });
        return;
      }
      const run = res.data?.content;
      setLastRun(run);
      setFile(null);
      setFileKey((k) => k + 1);
      loadHistory();
      Swal.fire({ icon: run?.rejected ? "warning" : "success", title: t("Import finished"), text: run?.message, customClass: swalClass });
    } catch (err) {
      const big = err?.response?.status === 413;
      Swal.fire({
        icon: "error",
        title: t("Import failed"),
        text: big ? t("The file is too large for the server. Split it into smaller files.") : t("Something went wrong!"),
        customClass: swalClass,
      });
    } finally {
      setImporting(false);
    }
  };

  const showErrors = (run) => {
    api.get(baseURLMarket + `legacy-market/imports/${run.importId}/errors`)
      .then((res) => setErrorsOf({ run, rows: res.data?.content || [] }))
      .catch(() => setErrorsOf({ run, rows: [] }));
  };

  const stats = (run) => (
    <div className="lmt-stats">
      <div className="lmt-stat"><b>{run.totalRows}</b><span>{t("Rows in file")}</span></div>
      <div className="lmt-stat ok"><b>{run.inserted}</b><span>{t("Added")}</span></div>
      <div className="lmt-stat"><b>{run.updated}</b><span>{t("Updated")}</span></div>
      <div className="lmt-stat"><b>{run.unchanged}</b><span>{t("Unchanged")}</span></div>
      <div className={`lmt-stat ${run.rejected ? "bad" : ""}`}><b>{run.rejected}</b><span>{t("Rejected")}</span></div>
      <div className="lmt-stat"><b>{run.alreadyInNewSystem}</b><span>{t("Also in new system")}</span></div>
    </div>
  );

  return (
    <Layout title={t("Legacy Market Transactions")}>
      <style>{styles}</style>
      <Block.Head>
        <div className="lmt-head">
          <h2>{t("Legacy Market Transactions")}</h2>
          <p>{t("Trace cocoon market transactions across the old market system and e-Reshme, and import the old system's export.")}</p>
        </div>
      </Block.Head>

      <Block>
        <Card className="lmt-card">
          <Card.Header className="bg-white">
            <Nav variant="tabs" className="lmt-tabs border-0" activeKey={tab} onSelect={(k) => setTab(k)}>
              <Nav.Item><Nav.Link eventKey="trace"><Icon name="search" /> {t("Trace transactions")}</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="import"><Icon name="upload-cloud" /> {t("Import legacy export")}</Nav.Link></Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            {tab === "trace" && (
              <>
                <Form onSubmit={runTrace}>
                  <Row className="g-3">
                    <Col md={3}><Form.Label>{t("FRUITS ID")}</Form.Label><Form.Control name="fruitsId" value={query.fruitsId} onChange={setQ} placeholder="FID..." /></Col>
                    <Col md={3}><Form.Label>{t("Farmer mobile")}</Form.Label><Form.Control name="mobile" value={query.mobile} onChange={setQ} maxLength={13} /></Col>
                    <Col md={2}><Form.Label>{t("Lot number")}</Form.Label><Form.Control name="lotNumber" value={query.lotNumber} onChange={setQ} /></Col>
                    <Col md={4}>
                      <Form.Label>{t("Market")}</Form.Label>
                      <Form.Select name="marketId" value={query.marketId} onChange={setQ}>
                        <option value="">{t("All markets")}</option>
                        {markets.map((m) => <option key={m.marketMasterId} value={m.marketMasterId}>{m.marketName}</option>)}
                      </Form.Select>
                    </Col>
                    <Col md={3}><Form.Label>{t("Legacy transaction id")}</Form.Label><Form.Control name="legacyTxnId" value={query.legacyTxnId} onChange={setQ} /></Col>
                    <Col md={3}><Form.Label>{t("From date")}</Form.Label><Form.Control type="date" name="fromDate" value={query.fromDate} onChange={setQ} /></Col>
                    <Col md={3}><Form.Label>{t("To date")}</Form.Label><Form.Control type="date" name="toDate" value={query.toDate} onChange={setQ} /></Col>
                    <Col md={3} className="d-flex align-items-end gap-2">
                      <Button type="submit" disabled={tracing} className="flex-fill">{tracing ? <Spinner size="sm" /> : <><Icon name="search" /> <span>{t("Search")}</span></>}</Button>
                      <Button variant="light" onClick={() => { setQuery(emptyQuery); setTrace(null); }}>{t("Clear")}</Button>
                    </Col>
                  </Row>
                </Form>

                {trace && (
                  <div className="mt-4">
                    <div className="lmt-stats mb-3">
                      <div className="lmt-stat"><b>{trace.total}</b><span>{t("Transactions")}</span></div>
                      <div className="lmt-stat"><b>{trace.legacyCount}</b><span>{t("Legacy system")}</span></div>
                      <div className="lmt-stat ok"><b>{trace.newSystemCount}</b><span>{t("e-Reshme")}</span></div>
                    </div>
                    {trace.rows.length === 0 ? (
                      <div className="lmt-note">{t("No transactions found.")}</div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover size="sm" className="lmt-table">
                          <thead>
                            <tr>
                              <th>{t("Source")}</th><th>{t("Reference")}</th><th>{t("Date")}</th><th>{t("Market")}</th><th>{t("Lot")}</th>
                              <th>{t("Farmer")}</th><th>{t("Reeler")}</th><th>{t("Race")}</th>
                              <th className="text-end">{t("Kg")}</th><th className="text-end">{t("Rate")}</th><th className="text-end">{t("Amount")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trace.rows.map((r, i) => (
                              <tr key={`${r.source}-${r.reference}-${i}`}>
                                <td><span className={`lmt-badge ${r.source}`}>{r.source === "LEGACY" ? `${t("Legacy")} · ${r.sourceSystem}` : "e-Reshme"}</span></td>
                                <td>{r.reference}</td>
                                <td>{r.auctionDate}</td>
                                <td>{r.marketName || "-"}</td>
                                <td>{r.lotNumber}</td>
                                <td>{[r.farmerName, r.farmerFruitsId, r.farmerMobile].filter(Boolean).join(" · ") || "-"}</td>
                                <td>{[r.reelerName, r.reelerLicenceNo].filter(Boolean).join(" · ") || "-"}</td>
                                <td>{r.race || "-"}</td>
                                <td className="text-end">{r.weightKg ?? "-"}</td>
                                <td className="text-end">{r.ratePerKg ?? "-"}</td>
                                <td className="text-end">{r.amount ?? "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                    <div className="lmt-note mt-2">{t("Legacy rows that are the same lot as an e-Reshme lot are shown only once (as e-Reshme). Up to 500 rows per source.")}</div>
                  </div>
                )}
              </>
            )}

            {tab === "import" && (
              <>
                <div className="lmt-note mb-3">
                  {t("Export the old system's transactions in the template format. Re-importing a newer export adds new transactions, updates changed ones and skips unchanged ones - matched by legacy transaction id, so nothing is duplicated.")}
                </div>
                <Form onSubmit={runImport}>
                  <Row className="g-3 align-items-end">
                    <Col md={3}>
                      <Form.Label>{t("Legacy system name")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control value={sourceSystem} onChange={(e) => setSourceSystem(e.target.value)} placeholder="e.g. OLD_EMARKET" maxLength={50} />
                    </Col>
                    <Col md={5}>
                      <Form.Label>{t("Export file (.xlsx or .csv)")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control key={fileKey} type="file" accept=".xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </Col>
                    <Col md={4} className="d-flex gap-2">
                      <Button type="submit" disabled={importing} className="flex-fill">{importing ? <><Spinner size="sm" /> {t("Importing...")}</> : <><Icon name="upload-cloud" /> <span>{t("Import")}</span></>}</Button>
                      <Button variant="outline-primary" onClick={downloadTemplate}><Icon name="download" /> <span>{t("Template")}</span></Button>
                    </Col>
                  </Row>
                </Form>

                {lastRun && (
                  <div className="mt-4">
                    <h6>{t("Last import")}: {lastRun.fileName} ({lastRun.sourceSystem})</h6>
                    {stats(lastRun)}
                    {lastRun.rejected > 0 && (
                      <Button size="sm" variant="outline-danger" className="mt-2" onClick={() => showErrors(lastRun)}>{t("View rejected rows")}</Button>
                    )}
                  </div>
                )}

                <h6 className="mt-4">{t("Import history")}</h6>
                {history.length === 0 ? (
                  <div className="lmt-note">{t("No imports yet.")}</div>
                ) : (
                  <div className="table-responsive">
                    <Table size="sm" hover className="lmt-table">
                      <thead>
                        <tr><th>#</th><th>{t("Source")}</th><th>{t("File")}</th><th className="text-end">{t("Rows")}</th><th className="text-end">{t("Added")}</th><th className="text-end">{t("Updated")}</th><th className="text-end">{t("Unchanged")}</th><th className="text-end">{t("Rejected")}</th><th className="text-end">{t("In e-Reshme")}</th><th /></tr>
                      </thead>
                      <tbody>
                        {history.map((h) => (
                          <tr key={h.importId}>
                            <td>{h.importId}</td><td>{h.sourceSystem}</td><td>{h.fileName}</td>
                            <td className="text-end">{h.totalRows}</td><td className="text-end">{h.inserted}</td><td className="text-end">{h.updated}</td>
                            <td className="text-end">{h.unchanged}</td><td className="text-end">{h.rejected}</td><td className="text-end">{h.alreadyInNewSystem}</td>
                            <td>{h.rejected > 0 && <Button size="sm" variant="link" className="p-0" onClick={() => showErrors(h)}>{t("Errors")}</Button>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Block>

      <Modal show={!!errorsOf} onHide={() => setErrorsOf(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.05rem" }}>{t("Rejected rows")} - {errorsOf?.run?.fileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {errorsOf && errorsOf.rows.length === 0 ? (
            <div className="lmt-note">{t("No rejected rows.")}</div>
          ) : (
            <Table size="sm" className="lmt-table">
              <thead><tr><th>{t("Row")}</th><th>{t("Legacy id")}</th><th>{t("Reason")}</th></tr></thead>
              <tbody>
                {(errorsOf?.rows || []).map((r, i) => (
                  <tr key={i}><td>{r.row}</td><td>{r.legacyTxnId || "-"}</td><td>{r.message}</td></tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default LegacyMarketTransactions;
