import { useState } from "react";
import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import api from "../../services/auth/api";
import FarmerRepresentatives, { dmy } from "./FarmerRepresentatives";

// SR-005: authorised agents of farmers.
//  - "Find agent & transactions": look an agent up by mobile / name, see which farmer the agent is linked to, and
//    trace the market transactions (e-Inward lots) done under that agent.
//  - "Manage farmer's agents": find any farmer and add / edit / remove the farmer's authorised agents.
// Backends: farmer-registration /v1/farmer-representative/*, market-auction /v1/farmer-agent-txn/*

const baseURLRegistration = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const swalClass = { popup: "fa-swal-popup", title: "fa-swal-title", confirmButton: "fa-swal-confirm", cancelButton: "fa-swal-cancel" };
const swal = (o) => Swal.fire({ buttonsStyling: false, customClass: swalClass, ...o });

const inr = (v) => (v === null || v === undefined || v === "" ? "-" : Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const kg = (v) => (v === null || v === undefined || v === "" ? "-" : Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 }));
const fullName = (f) => [f?.firstName, f?.middleName, f?.lastName].filter(Boolean).join(" ");

const styles = `
  .fa { --fa-primary:#1e67a8; --fa-ink:#1f2d3d; --fa-muted:#6b7a8c; --fa-line:#e3eaf3; --fa-soft:#f4f8fd; }
  .fa-hero { position:relative; overflow:hidden; display:flex; flex-wrap:wrap; align-items:center; gap:18px; padding:20px 24px; border-radius:16px; margin-bottom:14px;
             background:linear-gradient(120deg,#174f86 0%,#1e67a8 45%,#3b8dd6 100%); box-shadow:0 8px 24px rgba(23,79,134,.28); }
  .fa-hero:after { content:""; position:absolute; right:-60px; top:-80px; width:260px; height:260px; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,.18),rgba(255,255,255,0) 70%); }
  .fa-hero-icon { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.28); color:#fff; font-size:1.7rem; flex-shrink:0; }
  .fa-hero h2 { color:#fff !important; margin:0; font-size:1.4rem; font-weight:800; }
  .fa-hero p { color:#dceafa; margin:4px 0 0; font-size:.88rem; }
  .fa-card { background:#fff; border-radius:16px; box-shadow:0 4px 20px rgba(16,42,77,.10); overflow:hidden; }
  .fa-tabs { display:flex; gap:6px; padding:14px 18px 0; border-bottom:1px solid var(--fa-line); background:#fbfdff; flex-wrap:wrap; }
  .fa-tab { border:none; background:transparent; padding:10px 16px 12px; font-weight:700; color:var(--fa-muted); font-size:.92rem; border-bottom:3px solid transparent; display:flex; align-items:center; gap:8px; }
  .fa-tab:hover { color:var(--fa-primary); }
  .fa-tab.active { color:var(--fa-primary); border-bottom-color:var(--fa-primary); }
  .fa-body { padding:20px 22px 24px; }
  .fa .form-label { font-size:.78rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.03em; margin-bottom:6px; }
  .fa .form-control, .fa .form-select { border-radius:10px; border-color:#d5dfeb; min-height:42px; font-size:.9rem; }
  .fa .form-control:focus, .fa .form-select:focus { border-color:#3b8dd6; box-shadow:0 0 0 3px rgba(59,141,214,.15); }
  .fa-panel { background:var(--fa-soft); border:1px solid var(--fa-line); border-radius:14px; padding:16px; }
  .fa-hint { font-size:.78rem; color:var(--fa-muted); display:flex; align-items:center; gap:6px; margin-top:10px; }
  .fa-btn { border-radius:10px !important; font-weight:700 !important; min-height:42px; display:inline-flex !important; align-items:center; justify-content:center; gap:6px; }
  .fa-btn-primary { background:linear-gradient(90deg,#1e67a8,#3b8dd6) !important; border:none !important; color:#fff !important; box-shadow:0 4px 12px rgba(30,103,168,.25); }
  .fa-btn-light { background:#fff !important; border:1px solid #d5dfeb !important; color:#4a5568 !important; }
  .fa-section { display:flex; align-items:center; gap:10px; margin:18px 0 12px; flex-wrap:wrap; }
  .fa-section h6 { margin:0; font-weight:800; color:var(--fa-ink); font-size:.95rem; }
  .fa-section .sub { color:var(--fa-muted); font-size:.8rem; }
  .fa-agents { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:12px; }
  .fa-agent { border:1px solid var(--fa-line); border-radius:14px; padding:14px; background:#fff; display:flex; flex-direction:column; gap:6px; transition:box-shadow .15s,border-color .15s; }
  .fa-agent:hover { border-color:#b9d3ee; box-shadow:0 4px 14px rgba(16,42,77,.08); }
  .fa-agent.sel { border-color:#3b8dd6; box-shadow:0 0 0 3px rgba(59,141,214,.15); }
  .fa-agent .nm { font-weight:800; color:var(--fa-primary); }
  .fa-agent .ln { font-size:.8rem; color:#4a5568; display:flex; gap:6px; align-items:flex-start; }
  .fa-agent .ln .icon { color:#8aa4c0; margin-top:2px; }
  .fa-link { display:flex; align-items:center; gap:8px; background:#f2f8ff; border:1px dashed #b9d3ee; border-radius:10px; padding:8px 10px; font-size:.8rem; color:var(--fa-ink); }
  .fa-link b { color:var(--fa-ink); }
  .fa-badge { display:inline-flex; align-items:center; gap:5px; border-radius:999px; padding:2px 9px; font-size:.7rem; font-weight:700; width:fit-content; }
  .fa-badge:before { content:""; width:6px; height:6px; border-radius:50%; background:currentColor; }
  .fa-badge.ok { background:#e7f7ee; color:#18794e; } .fa-badge.no { background:#fdecf0; color:#c43257; } .fa-badge.grey { background:#f0f2f5; color:#6b7a8c; }
  .fa-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
  .fa-stat { display:flex; align-items:center; gap:12px; background:#fff; border:1px solid var(--fa-line); border-radius:12px; padding:12px 14px; }
  .fa-stat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; background:#eaf2fb; color:var(--fa-primary); flex-shrink:0; }
  .fa-stat b { display:block; font-size:1.15rem; color:var(--fa-ink); line-height:1.15; }
  .fa-stat span { font-size:.7rem; color:var(--fa-muted); text-transform:uppercase; letter-spacing:.04em; font-weight:600; }
  .fa-who { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:12px; margin-bottom:14px; }
  .fa-who > div { border:1px solid var(--fa-line); border-radius:12px; padding:12px 14px; background:linear-gradient(180deg,#fbfdff,#fff); }
  .fa-who .lbl { font-size:.7rem; text-transform:uppercase; letter-spacing:.05em; color:var(--fa-muted); font-weight:700; }
  .fa-who .val { font-weight:800; color:var(--fa-ink); margin-top:2px; }
  .fa-who .sm { font-size:.8rem; color:#4a5568; }
  .fa-table-wrap { border:1px solid var(--fa-line); border-radius:12px; overflow:auto; max-height:520px; }
  .fa-table { margin:0 !important; }
  .fa-table thead th { position:sticky; top:0; z-index:1; background:#f4f8fd !important; font-size:.72rem; text-transform:uppercase; letter-spacing:.04em; color:#5a6b80; white-space:nowrap; padding:10px 12px !important; }
  .fa-table td { font-size:.85rem; vertical-align:middle; padding:10px 12px !important; border-color:#eef2f7 !important; }
  .fa-table tbody tr:nth-child(even) td { background:#fbfcfe; }
  .fa-table .num { text-align:right; white-space:nowrap; font-variant-numeric:tabular-nums; }
  .fa-status { border-radius:999px; padding:2px 9px; font-size:.72rem; font-weight:700; background:#eef3f9; color:#4a5568; white-space:nowrap; }
  .fa-empty { text-align:center; padding:32px 16px; color:var(--fa-muted); }
  .fa-empty-icon { width:64px; height:64px; margin:0 auto 10px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#eaf2fb; color:var(--fa-primary); font-size:1.8rem; }
  .fa-empty h6 { color:var(--fa-ink); font-weight:800; margin-bottom:4px; }
  .fa-empty p { font-size:.85rem; margin:0 auto; max-width:460px; }
  .fa-farmer { display:flex; flex-wrap:wrap; gap:18px; align-items:center; border:1px solid var(--fa-line); border-radius:12px; padding:12px 16px; margin:16px 0; background:#fff; }
  .fa-farmer .av { width:44px; height:44px; border-radius:50%; background:#eaf2fb; color:var(--fa-primary); display:flex; align-items:center; justify-content:center; font-size:1.3rem; }
  .fa-swal-popup { border-radius:16px !important; }
  .fa-swal-title { font-size:1.1rem !important; font-weight:800 !important; }
  .fa-swal-confirm { background:linear-gradient(90deg,#1e67a8,#3b8dd6); color:#fff; border:none; border-radius:10px; padding:9px 24px; font-weight:700; margin:0 6px; }
  .fa-swal-cancel { background:#fff; color:#4a5568; border:1px solid #d5dfeb; border-radius:10px; padding:9px 22px; font-weight:700; margin:0 6px; }
  @media (max-width:576px) { .fa-hero { padding:16px; } .fa-hero h2 { font-size:1.15rem; } .fa-body { padding:16px 14px 20px; } }
`;

function Stat({ icon, value, label }) {
  return (
    <div className="fa-stat">
      <div className="fa-stat-icon"><Icon name={icon} /></div>
      <div><b>{value}</b><span>{label}</span></div>
    </div>
  );
}

function FarmerAgents() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("find");

  // find agent
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [agents, setAgents] = useState(null);
  const [selected, setSelected] = useState(null);
  const [range, setRange] = useState({ fromDate: "", toDate: "" });
  const [trace, setTrace] = useState(null);
  const [tracing, setTracing] = useState(false);

  // manage
  const [farmerBy, setFarmerBy] = useState("fruitsId");
  const [farmerText, setFarmerText] = useState("");
  const [farmer, setFarmer] = useState(null);
  const [findingFarmer, setFindingFarmer] = useState(false);

  const searchAgents = (e) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) {
      swal({ icon: "info", title: t("Enter the agent's mobile number or name") });
      return;
    }
    setSearching(true);
    setSelected(null);
    setTrace(null);
    api.get(baseURLRegistration + "farmer-representative/search", { params: { q: text } })
      .then((res) => {
        const c = res.data?.content;
        if (c?.error) {
          swal({ icon: "warning", title: t("Cannot search"), text: c.error_description });
          setAgents(null);
          return;
        }
        const list = c?.farmerRepresentative || [];
        setAgents(list);
        if (list.length === 1) loadTrace(list[0], range);
      })
      .catch(() => swal({ icon: "error", title: t("Search failed"), text: t("Something went wrong!") }))
      .finally(() => setSearching(false));
  };

  const loadTrace = (agent, r = range) => {
    if (r.fromDate && r.toDate && r.fromDate > r.toDate) {
      swal({ icon: "warning", title: t("Check the dates"), text: t("From date is after To date.") });
      return;
    }
    setSelected(agent);
    setTracing(true);
    const params = { farmerRepresentativeId: agent.farmerRepresentativeId };
    if (r.fromDate) params.fromDate = r.fromDate;
    if (r.toDate) params.toDate = r.toDate;
    api.get(baseURLMarket + "farmer-agent-txn/trace", { params })
      .then((res) => {
        if (res.data?.errorCode === -1) {
          swal({ icon: "warning", title: t("Cannot load transactions"), text: res.data.errorMessages?.[0] });
          setTrace(null);
        } else {
          setTrace(res.data?.content || null);
        }
      })
      .catch(() => swal({ icon: "error", title: t("Transactions could not be loaded"), text: t("Something went wrong!") }))
      .finally(() => setTracing(false));
  };

  const clearFind = () => { setQ(""); setAgents(null); setSelected(null); setTrace(null); setRange({ fromDate: "", toDate: "" }); };

  const findFarmer = (e) => {
    e.preventDefault();
    const text = farmerText.trim();
    if (!text) {
      swal({ icon: "info", title: t("Enter the farmer's FRUITS ID, farmer number or mobile number") });
      return;
    }
    setFindingFarmer(true);
    setFarmer(null);
    api.post(baseURLRegistration + "farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number", { [farmerBy]: text })
      .then((res) => {
        const c = res.data?.content;
        if (!c || c.error || !c.farmerResponse) {
          swal({ icon: "warning", title: t("Farmer not found"), text: c?.error_description || "" });
          return;
        }
        setFarmer(c.farmerResponse);
      })
      .catch(() => swal({ icon: "warning", title: t("Farmer not found") }))
      .finally(() => setFindingFarmer(false));
  };

  const rows = trace?.rows || [];

  return (
    <Layout title={t("Farmer Agents")}>
      <style>{styles}</style>
      <div className="fa">
        <Block.Head>
          <div className="fa-hero">
            <div className="fa-hero-icon"><Icon name="users" /></div>
            <div style={{ flex: "1 1 320px", minWidth: 0, position: "relative", zIndex: 1 }}>
              <h2>{t("Farmer Agents")}</h2>
              <p>{t("Authorised agents / representatives of farmers, and the market transactions they did on the farmer's behalf.")}</p>
            </div>
          </div>
        </Block.Head>

        <Block>
          <div className="fa-card">
            <div className="fa-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === "find"} className={`fa-tab ${tab === "find" ? "active" : ""}`} onClick={() => setTab("find")}>
                <Icon name="search" /> {t("Find agent & transactions")}
              </button>
              <button type="button" role="tab" aria-selected={tab === "manage"} className={`fa-tab ${tab === "manage" ? "active" : ""}`} onClick={() => setTab("manage")}>
                <Icon name="user-add" /> {t("Manage farmer's agents")}
              </button>
            </div>

            <div className="fa-body">
              {tab === "find" && (
                <>
                  <Form onSubmit={searchAgents} className="fa-panel">
                    <Row className="g-3 align-items-end">
                      <Col lg={5} md={12}>
                        <Form.Label>{t("Agent mobile number or name")}</Form.Label>
                        <Form.Control value={q} onChange={(e) => setQ(e.target.value)} placeholder="9876543210 / Ramesh" maxLength={150} />
                      </Col>
                      <Col lg={2} md={4}>
                        <Form.Label>{t("From date")}</Form.Label>
                        <Form.Control type="date" value={range.fromDate} onChange={(e) => setRange((r) => ({ ...r, fromDate: e.target.value }))} />
                      </Col>
                      <Col lg={2} md={4}>
                        <Form.Label>{t("To date")}</Form.Label>
                        <Form.Control type="date" value={range.toDate} onChange={(e) => setRange((r) => ({ ...r, toDate: e.target.value }))} />
                      </Col>
                      <Col lg={3} md={4} className="d-flex gap-2">
                        <Button type="submit" disabled={searching} className="fa-btn fa-btn-primary flex-fill">
                          {searching ? <Spinner size="sm" /> : <Icon name="search" />} <span>{t("Search")}</span>
                        </Button>
                        <Button type="button" className="fa-btn fa-btn-light" onClick={clearFind}><Icon name="reload" /> <span>{t("Clear")}</span></Button>
                      </Col>
                    </Row>
                    <div className="fa-hint"><Icon name="info" /> {t("Mobile number finds the exact agent; a name needs at least 3 letters. Dates filter the transactions (optional).")}</div>
                  </Form>

                  {agents === null && !searching && (
                    <div className="fa-empty">
                      <div className="fa-empty-icon"><Icon name="users" /></div>
                      <h6>{t("Search an authorised agent")}</h6>
                      <p>{t("You will see which farmer the agent is linked to and every market transaction the agent brought on that farmer's behalf.")}</p>
                    </div>
                  )}

                  {agents && agents.length === 0 && (
                    <div className="fa-empty">
                      <div className="fa-empty-icon"><Icon name="info" /></div>
                      <h6>{t("No agent found")}</h6>
                      <p>{t("Check the mobile number, or add the agent to the farmer in the 'Manage farmer's agents' tab.")}</p>
                    </div>
                  )}

                  {agents && agents.length > 0 && (
                    <>
                      <div className="fa-section">
                        <h6>{t("Agents")}</h6>
                        <span className="sub">{agents.length} {t("found")}</span>
                      </div>
                      <div className="fa-agents">
                        {agents.map((a) => (
                          <div key={a.farmerRepresentativeId} className={`fa-agent ${selected?.farmerRepresentativeId === a.farmerRepresentativeId ? "sel" : ""}`}>
                            <div className="nm">{a.name}</div>
                            <div className="ln"><Icon name="mobile" /> {a.mobileNumber}{a.relationshipName ? ` · ${a.relationshipName}` : ""}</div>
                            <div className="ln"><Icon name="calendar" /> {dmy(a.authorisedFrom)} {t("to")} {a.authorisedTo ? dmy(a.authorisedTo) : t("no end date")}</div>
                            <span className={`fa-badge ${a.authorisedToday ? "ok" : "no"}`}>{a.authorisedToday ? t("Authorised today") : t("Not authorised today")}</span>
                            <div className="fa-link">
                              <Icon name="link" />
                              <span>{t("Agent of")} <b>{a.farmerName || "-"}</b>{a.fruitsId ? ` · ${a.fruitsId}` : ""}{a.farmerNumber ? ` · ${a.farmerNumber}` : ""}</span>
                            </div>
                            <Button size="sm" className="fa-btn fa-btn-primary mt-1" style={{ minHeight: 34 }} onClick={() => loadTrace(a)}>
                              <Icon name="list" /> <span>{t("View transactions")}</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {tracing && <div className="fa-empty"><Spinner /><p className="mt-2">{t("Loading transactions...")}</p></div>}

                  {trace && !tracing && (
                    <>
                      <div className="fa-section">
                        <h6>{t("Transactions under this agent")}</h6>
                      </div>
                      <div className="fa-who">
                        <div>
                          <div className="lbl">{t("Agent")}</div>
                          <div className="val">{trace.agent?.name}</div>
                          <div className="sm">{trace.agent?.mobileNumber}{trace.agent?.relationshipName ? ` · ${trace.agent.relationshipName}` : ""}</div>
                          <span className={`fa-badge ${trace.agent?.active ? "grey" : "no"} mt-1`}>{trace.agent?.active ? t("Active") : t("Removed")}</span>
                        </div>
                        <div>
                          <div className="lbl">{t("Linked farmer")}</div>
                          <div className="val">{trace.farmer?.farmerName}</div>
                          <div className="sm">{[trace.farmer?.fruitsId, trace.farmer?.farmerNumber, trace.farmer?.mobileNumber].filter(Boolean).join(" · ")}</div>
                        </div>
                      </div>
                      <div className="fa-stats mb-3">
                        <Stat icon="list" value={trace.transactionCount ?? 0} label={t("e-Inward transactions")} />
                        <Stat icon="layers" value={trace.lotCount} label={t("Lots")} />
                        <Stat icon="package" value={kg(trace.totalWeightKg)} label={t("Total kg")} />
                        <Stat icon="coins" value={`₹ ${inr(trace.totalAmount)}`} label={t("Total amount")} />
                      </div>
                      {rows.length === 0 ? (
                        <div className="fa-empty">
                          <div className="fa-empty-icon"><Icon name="info" /></div>
                          <h6>{t("No transactions under this agent yet")}</h6>
                          <p>{t("At e-Inward, choose this agent in 'Brought by' after fetching the farmer.")}</p>
                        </div>
                      ) : (
                        <div className="fa-table-wrap">
                          <Table hover size="sm" className="fa-table">
                            <thead>
                              <tr>
                                <th>{t("Transaction")}</th><th>{t("Date")}</th><th>{t("Market")}</th><th>{t("Lot")}</th><th>{t("Race")}</th>
                                <th>{t("Status")}</th><th>{t("Reeler")}</th>
                                <th className="num">{t("Kg")}</th><th className="num">{t("Rate (₹)")}</th><th className="num">{t("Amount (₹)")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((r, i) => (
                                <tr key={`${r.transactionId}-${r.lotNumber}-${i}`}>
                                  <td><b>#{r.transactionId}</b></td>
                                  <td style={{ whiteSpace: "nowrap" }}>{dmy(r.auctionDate)}</td>
                                  <td>{r.marketName || "-"}</td>
                                  <td><b>{r.lotNumber ?? "-"}</b></td>
                                  <td>{r.race || "-"}</td>
                                  <td><span className="fa-status">{r.lotStatus || r.inwardStatus || "-"}</span></td>
                                  <td>{r.reelerName || "-"}{r.reelerLicenceNo && <div style={{ fontSize: ".74rem", color: "#6b7a8c" }}>{r.reelerLicenceNo}</div>}</td>
                                  <td className="num">{kg(r.weightKg)}</td>
                                  <td className="num">{inr(r.ratePerKg)}</td>
                                  <td className="num"><b>{inr(r.amount)}</b></td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {tab === "manage" && (
                <>
                  <Form onSubmit={findFarmer} className="fa-panel">
                    <Row className="g-3 align-items-end">
                      <Col lg={3} md={4}>
                        <Form.Label>{t("Search by")}</Form.Label>
                        <Form.Select value={farmerBy} onChange={(e) => setFarmerBy(e.target.value)}>
                          <option value="fruitsId">{t("FRUITS ID")}</option>
                          <option value="farmerNumber">{t("Farmer number")}</option>
                          <option value="mobileNumber">{t("Mobile number")}</option>
                        </Form.Select>
                      </Col>
                      <Col lg={6} md={8}>
                        <Form.Label>{t("Farmer")}</Form.Label>
                        <Form.Control value={farmerText} onChange={(e) => setFarmerText(e.target.value)} placeholder={farmerBy === "fruitsId" ? "FID..." : ""} />
                      </Col>
                      <Col lg={3} md={12}>
                        <Button type="submit" disabled={findingFarmer} className="fa-btn fa-btn-primary w-100">
                          {findingFarmer ? <Spinner size="sm" /> : <Icon name="search" />} <span>{t("Find farmer")}</span>
                        </Button>
                      </Col>
                    </Row>
                  </Form>

                  {!farmer && !findingFarmer && (
                    <div className="fa-empty">
                      <div className="fa-empty-icon"><Icon name="user-add" /></div>
                      <h6>{t("Find the farmer first")}</h6>
                      <p>{t("Then add the people the farmer authorises to bring and sell cocoons at the market on the farmer's behalf.")}</p>
                    </div>
                  )}

                  {farmer && (
                    <>
                      <div className="fa-farmer">
                        <div className="av"><Icon name="user" /></div>
                        <div>
                          <div style={{ fontWeight: 800, color: "#1f2d3d" }}>{fullName(farmer) || "-"}</div>
                          <div style={{ fontSize: ".8rem", color: "#4a5568" }}>
                            {[farmer.fruitsId, farmer.farmerNumber, farmer.mobileNumber].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                      </div>
                      <FarmerRepresentatives farmerId={farmer.farmerId} />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </Block>
      </div>
    </Layout>
  );
}

export default FarmerAgents;
