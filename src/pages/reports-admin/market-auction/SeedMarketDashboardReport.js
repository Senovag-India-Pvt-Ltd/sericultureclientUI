import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import api from "../../../services/auth/api";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useTranslation } from "react-i18next";

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const thStyle = {
  backgroundColor: "#eaf4fb",
  color: "#1a5276",
  fontWeight: 700,
  padding: "10px 12px",
  whiteSpace: "nowrap",
  textAlign: "center",
  border: "1px solid #d0e8f5",
  fontSize: "0.78rem",
  letterSpacing: "0.3px",
  verticalAlign: "middle",
};

const tdStyle = (key) => ({
  padding: "9px 12px",
  border: "1px solid #e0eaf5",
  verticalAlign: "middle",
  textAlign: key === "seedMarketName" ? "left" : "center",
  fontWeight: key === "seedMarketName" ? 600 : 400,
  color: key === "seedMarketName" ? "#1a5276" : "#2c3e50",
  backgroundColor: key === "seedMarketName" ? "rgba(26,82,118,0.06)" : "transparent",
});

const footTd = {
  textAlign: "center",
  padding: "10px 12px",
  border: "1px solid #c5dff0",
  color: "#1a5276",
  fontWeight: 700,
  fontSize: "0.82rem",
};

const seedQty = (row) =>
  (Number(row.totalRspKg) || 0) +
  (Number(row.totalGovtGrainageKg) || 0) +
  (Number(row.totalNssoKg) || 0);

const sumList = (list, key) =>
  list.reduce((s, r) => s + (Number(r[key]) || 0), 0);

const sumSeedQty = (list) =>
  list.reduce((s, r) => s + seedQty(r), 0);

const totalQty = (row) => seedQty(row) + (Number(row.totalReelerKg) || 0);

const sumTotalQty = (list) =>
  list.reduce((s, r) => s + totalQty(r), 0);

function SeedMarketDashboardReport() {
  const { t } = useTranslation();

  const [auctionDate, setAuctionDate] = useState(null);
  const [dashboardList, setDashboardList] = useState([]);
  const [loading, setLoading] = useState(false);

  const formattedDate = auctionDate
    ? `${auctionDate.getDate().toString().padStart(2, "0")}/${(auctionDate.getMonth() + 1)
        .toString().padStart(2, "0")}/${auctionDate.getFullYear()}`
    : "All Dates";

  const formatDate = (date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const fmt = (v) => Number(v).toLocaleString("en-IN");
  const inr = (v) => `₹${Number(v).toLocaleString("en-IN")}`;

  const fetchDashboard = (date, showAlert = false) => {
    setLoading(true);
    api
      .post(baseURLMarket + "auction/report/getSeedMarketDashboard", {
        dashboardReportDate: date ? formatDate(date) : null,
      })
      .then((response) => {
        if (
          response.data.errorCode === 0 &&
          response.data.content &&
          response.data.content.length > 0
        ) {
          setDashboardList(response.data.content);
        } else {
          setDashboardList([]);
          if (showAlert) {
            Swal.fire({
              icon: "warning",
              title: t("No Record Found"),
              text: t("No data available for the selected date."),
            });
          }
        }
      })
      .catch((err) => {
        setDashboardList([]);
        const msg =
          err?.response?.data?.errorMessages?.[0]?.message?.[0]?.message ||
          "Something went wrong. Please try again.";
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
      })
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchDashboard(auctionDate); }, []);

  const postData = (event) => {
    event.preventDefault();
    fetchDashboard(auctionDate, true);
  };

  /* ── Split by seedAreaType from backend ── */
  const pureSeedList  = dashboardList.filter((r) =>
    (r.seedAreaType || "").toLowerCase().includes("mysore")
  );
  const bivoltineList = dashboardList.filter((r) =>
    (r.seedAreaType || "").toLowerCase().includes("bivoltine")
  );

  /* ── Grand totals (all rows) ── */
  const totalLots        = sumList(dashboardList, "noOfLots");
  const totalFarmers     = sumList(dashboardList, "totalNoOfFarmers");
  const totalInwardQty   = sumList(dashboardList, "totalInwardQuantity");
  const totalAmount      = sumList(dashboardList, "totalAmount");

  const summaryCards = [
    { label: t("Total Markets"),    value: dashboardList.length,            icon: "🏪", color: "#1a5276" },
    { label: t("Total Lots"),       value: totalLots,                       icon: "📦", color: "#117a65" },
    { label: t("Total Farmers"),    value: totalFarmers,                    icon: "👨‍🌾", color: "#7d6608" },
    { label: t("Inward Qty"),       value: totalInwardQty.toFixed(2),       icon: "⚖️",  color: "#6e2f6e" },
    { label: t("Total Qty"),         value: sumTotalQty(dashboardList).toFixed(2), icon: "🌱", color: "#117a65" },
    { label: t("Total Amount"),     value: inr(totalAmount),                icon: "💰", color: "#922b21" },
  ];

  /* ── Shared table headers (rendered identically for both sections) ── */
  const TableHeader = () => (
    <thead>
      <tr>
        <th rowSpan={2} style={thStyle}>{t("Sl No")}</th>
        <th rowSpan={2} style={{ ...thStyle, minWidth: "140px" }}>{t("Seed Market Name")}</th>
        <th rowSpan={2} style={thStyle}>{t("Payment Mode")}</th>
        <th rowSpan={2} style={thStyle}>{t("No Of Lots")}</th>
        <th rowSpan={2} style={thStyle}>{t("Total Farmers")}</th>
        <th rowSpan={2} style={thStyle}>{t("Inward Qty")}</th>
        <th colSpan={3} style={{ ...thStyle, backgroundColor: "#d6eaf8", borderBottom: "2px solid #2e86c1" }}>{t("RSP")}</th>
        <th colSpan={3} style={{ ...thStyle, backgroundColor: "#d5f5e3", borderBottom: "2px solid #1e8449" }}>{t("Govt Grainage")}</th>
        <th colSpan={3} style={{ ...thStyle, backgroundColor: "#fdebd0", borderBottom: "2px solid #ca6f1e" }}>{t("NSSO")}</th>
        <th colSpan={3} style={{ ...thStyle, backgroundColor: "#f9ebea", borderBottom: "2px solid #c0392b" }}>{t("Reeler")}</th>
        <th rowSpan={2} style={{ ...thStyle, backgroundColor: "#e8f8f5", color: "#117a65" }}>{t("Total Seed Qty")}</th>
        <th rowSpan={2} style={{ ...thStyle, backgroundColor: "#d4efdf", color: "#1e8449" }}>{t("Total Qty")}</th>
        <th rowSpan={2} style={{ ...thStyle, backgroundColor: "#fef9e7", color: "#7d6608" }}>{t("Total Seed Amount")}</th>
        <th rowSpan={2} style={thStyle}>{t("Total Amount")}</th>
        <th rowSpan={2} style={thStyle}>{t("Payment Status")}</th>
      </tr>
      <tr>
        <th style={{ ...thStyle, backgroundColor: "#ebf5fb" }}>{t("Total No of RSP")}</th>
        <th style={{ ...thStyle, backgroundColor: "#ebf5fb" }}>{t("Total No of Kgs")}</th>
        <th style={{ ...thStyle, backgroundColor: "#ebf5fb" }}>{t("Total Amount")}</th>
        <th style={{ ...thStyle, backgroundColor: "#eafaf1" }}>{t("Total No of Govt Grainage")}</th>
        <th style={{ ...thStyle, backgroundColor: "#eafaf1" }}>{t("Total No of Kgs")}</th>
        <th style={{ ...thStyle, backgroundColor: "#eafaf1" }}>{t("Total Amount")}</th>
        <th style={{ ...thStyle, backgroundColor: "#fef5e7" }}>{t("Total No of NSSO")}</th>
        <th style={{ ...thStyle, backgroundColor: "#fef5e7" }}>{t("Total No of Kgs")}</th>
        <th style={{ ...thStyle, backgroundColor: "#fef5e7" }}>{t("Total Amount")}</th>
        <th style={{ ...thStyle, backgroundColor: "#fdedec" }}>{t("Total No of Reeler")}</th>
        <th style={{ ...thStyle, backgroundColor: "#fdedec" }}>{t("Total No of Kgs")}</th>
        <th style={{ ...thStyle, backgroundColor: "#fdedec" }}>{t("Total Amount")}</th>
      </tr>
    </thead>
  );

  /* ── Data row renderer ── */
  const renderDataRow = (row, i) => (
    <tr
      key={i}
      style={{ backgroundColor: i % 2 === 0 ? "#f8fbff" : "#ffffff", transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ddeeff")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#f8fbff" : "#ffffff")}
    >
      <td style={tdStyle("slNo")}>{i + 1}</td>
      <td style={tdStyle("seedMarketName")}>{row.seedMarketName || "-"}</td>
      <td style={tdStyle("paymentMode")}>{row.paymentMode || "-"}</td>
      <td style={tdStyle("noOfLots")}>{row.noOfLots || "-"}</td>
      <td style={tdStyle("totalNoOfFarmers")}>{row.totalNoOfFarmers || "-"}</td>
      <td style={tdStyle("totalInwardQuantity")}>{row.totalInwardQuantity || "-"}</td>
      <td style={tdStyle("totalNoOfRSP")}>{row.totalNoOfRSP || "-"}</td>
      <td style={tdStyle("totalRspKg")}>{row.totalRspKg || "-"}</td>
      <td style={tdStyle("totalRspAmount")}>{row.totalRspAmount != null && Number(row.totalRspAmount) !== 0 ? fmt(row.totalRspAmount) : "-"}</td>
      <td style={tdStyle("totalNoOfGovtGrainage")}>{row.totalNoOfGovtGrainage || "-"}</td>
      <td style={tdStyle("totalGovtGrainageKg")}>{row.totalGovtGrainageKg || "-"}</td>
      <td style={tdStyle("totalGovtGrainageAmount")}>{row.totalGovtGrainageAmount != null && Number(row.totalGovtGrainageAmount) !== 0 ? fmt(row.totalGovtGrainageAmount) : "-"}</td>
      <td style={tdStyle("totalNoOfNSSO")}>{row.totalNoOfNSSO || "-"}</td>
      <td style={tdStyle("totalNssoKg")}>{row.totalNssoKg || "-"}</td>
      <td style={tdStyle("totalNssoAmount")}>{row.totalNssoAmount != null && Number(row.totalNssoAmount) !== 0 ? fmt(row.totalNssoAmount) : "-"}</td>
      <td style={tdStyle("totalNoOfReelers")}>{row.totalNoOfReelers || "-"}</td>
      <td style={tdStyle("totalReelerKg")}>{row.totalReelerKg || "-"}</td>
      <td style={tdStyle("totalReelerAmount")}>{row.totalReelerAmount != null && Number(row.totalReelerAmount) !== 0 ? fmt(row.totalReelerAmount) : "-"}</td>
      <td style={{ ...tdStyle("totalSeedQty"), backgroundColor: "#eafaf5", color: "#117a65", fontWeight: 600 }}>{seedQty(row).toFixed(2)}</td>
      <td style={{ ...tdStyle("totalQty"), backgroundColor: "#d4efdf", color: "#1e8449", fontWeight: 600 }}>{totalQty(row).toFixed(2)}</td>
      <td style={tdStyle("totalSeedAmount")}>{row.totalSeedAmount != null && Number(row.totalSeedAmount) !== 0 ? fmt(row.totalSeedAmount) : "-"}</td>
      <td style={tdStyle("totalAmount")}>{row.totalAmount != null && Number(row.totalAmount) !== 0 ? fmt(row.totalAmount) : "-"}</td>
      <td style={tdStyle("paymentStatus")}>
        {row.paymentStatus && row.paymentStatus.trim() !== "" ? (
          <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 600, backgroundColor: "#d5f5e3", color: "#1e8449" }}>
            {row.paymentStatus}
          </span>
        ) : "-"}
      </td>
    </tr>
  );

  /* ── Sub-total row renderer ── */
  const renderSubTotalRow = (list) => {
    const sL = (key) => sumList(list, key);
    return (
      <tr style={{ backgroundColor: "#ddeeff", fontWeight: 700 }}>
        <td colSpan={3} style={{ ...footTd, textAlign: "left" }}>{t("Sub Total")}</td>
        <td style={footTd}>{sL("noOfLots")}</td>
        <td style={footTd}>{sL("totalNoOfFarmers")}</td>
        <td style={footTd}>{sL("totalInwardQuantity").toFixed(2)}</td>
        <td style={footTd}>{sL("totalNoOfRSP")}</td>
        <td style={footTd}>{sL("totalRspKg").toFixed(2)}</td>
        <td style={footTd}>{fmt(sL("totalRspAmount"))}</td>
        <td style={footTd}>{sL("totalNoOfGovtGrainage")}</td>
        <td style={footTd}>{sL("totalGovtGrainageKg").toFixed(2)}</td>
        <td style={footTd}>{fmt(sL("totalGovtGrainageAmount"))}</td>
        <td style={footTd}>{sL("totalNoOfNSSO")}</td>
        <td style={footTd}>{sL("totalNssoKg").toFixed(2)}</td>
        <td style={footTd}>{fmt(sL("totalNssoAmount"))}</td>
        <td style={footTd}>{sL("totalNoOfReelers")}</td>
        <td style={footTd}>{sL("totalReelerKg").toFixed(2)}</td>
        <td style={footTd}>{fmt(sL("totalReelerAmount"))}</td>
        <td style={{ ...footTd, backgroundColor: "#e0f5ee", color: "#117a65" }}>{sumSeedQty(list).toFixed(2)}</td>
        <td style={{ ...footTd, backgroundColor: "#d4efdf", color: "#1e8449" }}>{sumTotalQty(list).toFixed(2)}</td>
        <td style={footTd}>{fmt(sL("totalSeedAmount"))}</td>
        <td style={footTd}>{fmt(sL("totalAmount"))}</td>
        <td style={footTd}></td>
      </tr>
    );
  };

  return (
    <Layout title={t("Seed Market Dashboard")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Seed Market Dashboard")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block>

        {/* ── Filter Banner ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a5276 0%, #2e86c1 60%, #5dade2 100%)",
            borderRadius: "16px",
            padding: "20px 32px",
            marginBottom: "24px",
            boxShadow: "0 6px 24px rgba(26,82,118,0.25)",
          }}
        >
          <Row className="align-items-center g-3">
            <Col md="auto">
              <Form noValidate onSubmit={postData}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                  <div>
                    <label style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                      {t("Auction Date")}
                    </label>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={auctionDate}
                      onChange={(date) => setAuctionDate(date)}
                      className="form-control"
                      maxDate={new Date()}
                      isClearable
                      placeholderText={t("All dates")}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: "#fff",
                      color: "#1a5276",
                      border: "none",
                      fontWeight: 700,
                      padding: "8px 22px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {loading ? "⏳ " + t("Loading...") : "🔍 " + t("Generate")}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </div>

        {dashboardList.length > 0 && (
          <>
            {/* ── Summary Cards (grand totals) ── */}
            <Row className="g-3 mb-4">
              {summaryCards.map((card, i) => (
                <Col key={i} xs={6} sm={4} md>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "18px 16px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      borderLeft: `4px solid ${card.color}`,
                      height: "100%",
                    }}
                  >
                    <div style={{ fontSize: "1.6rem", lineHeight: 1 }}>{card.icon}</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: card.color, marginTop: "6px" }}>
                      {card.value}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#7f8c8d", marginTop: "2px", fontWeight: 500 }}>
                      {card.label}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* ── Date label ── */}
            <div style={{ marginBottom: "12px", color: "#5d6d7e", fontSize: "0.82rem", fontWeight: 600 }}>
              📅 {t("Transactions for")}: <span style={{ color: "#1a5276" }}>{formattedDate}</span>
            </div>

            {/* ── Single unified table with both sections ── */}
            <Card style={{ borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.09)", border: "none", overflow: "hidden" }}>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-bordered mb-0" style={{ minWidth: "1500px", fontSize: "0.80rem" }}>
                    <TableHeader />
                    <tbody>

                      {/* Pure Seed Area section */}
                      {pureSeedList.length > 0 && (
                        <>
                          <tr>
                            <td colSpan={23} style={{ background: "linear-gradient(90deg, #1a5276, #2e86c1)", color: "#fff", fontWeight: 700, padding: "10px 16px", fontSize: "0.88rem" }}>
                              📋 {t("Pure Seed Area")} &mdash; {pureSeedList.length} {t("Markets")}
                            </td>
                          </tr>
                          {pureSeedList.map((row, i) => renderDataRow(row, i))}
                          {renderSubTotalRow(pureSeedList)}
                        </>
                      )}

                      {/* Bivoltine Seed Area section */}
                      {bivoltineList.length > 0 && (
                        <>
                          <tr>
                            <td colSpan={23} style={{ background: "linear-gradient(90deg, #117a65, #1abc9c)", color: "#fff", fontWeight: 700, padding: "10px 16px", fontSize: "0.88rem" }}>
                              📋 {t("Bivoltine Seed Area")} &mdash; {bivoltineList.length} {t("Markets")}
                            </td>
                          </tr>
                          {bivoltineList.map((row, i) => renderDataRow(row, i))}
                          {renderSubTotalRow(bivoltineList)}
                        </>
                      )}

                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </>
        )}
      </Block>
    </Layout>
  );
}

export default SeedMarketDashboardReport;
