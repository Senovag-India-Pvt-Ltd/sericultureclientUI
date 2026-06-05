import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const formatINR = (amount) =>
  amount != null
    ? "₹" + Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

function ReelerBankTransfer() {
  const { t } = useTranslation();
  const marketId = parseInt(localStorage.getItem("marketId")) || 0;

  const [buyerType, setBuyerType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [validatedSearch, setValidatedSearch] = useState(false);
  const [balanceData, setBalanceData] = useState(null);

  const [transferAmount, setTransferAmount] = useState("");
  const [comment, setComment] = useState("");
  const [fileName, setFileName] = useState("");
  const [transferring, setTransferring] = useState(false);

  const canTransfer =
    balanceData &&
    parseFloat(balanceData.transferableAmount) > 0 &&
    transferAmount &&
    parseFloat(transferAmount) > 0 &&
    parseFloat(transferAmount) <= parseFloat(balanceData.transferableAmount) &&
    fileName.trim();

  const handleSearch = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedSearch(true);
      return;
    }
    e.preventDefault();
    setBalanceData(null);
    setSearched(false);
    setTransferAmount("");
    setFileName("");
    setComment("");
    setLoading(true);

    api
      .get(baseURLMarket + "reelerBankTransfer/getReelerBalance", {
        params: { licenseNumber: licenseNumber.trim(), marketId, buyerType },
      })
      .then((res) => {
        const content = res.data?.content;
        if (content?.error) {
          Swal.fire({ icon: "error", title: t("Error"), text: content.error_description });
        } else {
          setBalanceData(content);
          setSearched(true);
          if (parseFloat(content?.transferableAmount) > 0)
            setTransferAmount(String(content.transferableAmount));
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.error_description || err.response?.data?.errorMessages?.[0]?.message || err.message || t("Buyer not found.");
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
      })
      .finally(() => setLoading(false));

    setValidatedSearch(false);
  };

  const handleTransfer = async () => {
    if (!canTransfer) return;
    const result = await Swal.fire({
      title: t("Confirm Transfer"),
      text: `Transfer ${formatINR(transferAmount)} to bank account ${balanceData.bankAccountNumber}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("Yes, Transfer"),
      confirmButtonColor: "#1e67a8",
    });
    if (!result.value) return;

    setTransferring(true);
    api
      .post(baseURLMarket + "reelerBankTransfer/transferToBank", null, {
        params: {
          buyerId: balanceData.buyerId || balanceData.reelerId,
          buyerType,
          marketId,
          transferAmount: parseFloat(transferAmount),
          fileName: fileName.trim(),
          comment: comment.trim(),
        },
      })
      .then((res) => {
        const content = res.data?.content;
        if (content?.error) {
          Swal.fire({ icon: "error", title: t("Error"), text: content.error_description });
        } else {
          Swal.fire({ icon: "success", title: t("Success"), text: `Transfer of ${formatINR(transferAmount)} initiated successfully.` });
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.error_description || err.response?.data?.errorMessages?.[0]?.message || err.message || t("Transfer failed.");
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
      })
      .finally(() => setTransferring(false));
  };

  const handleDownloadCSV = () => {
    const name = fileName.trim();
    api
      .get(baseURLMarket + "reelerBankTransfer/downloadCSV", {
        params: { marketId, fileName: name },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = name.endsWith(".csv") ? name : `${name}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          Swal.fire({ icon: "info", title: t("Not Found"), text: t("CSV not found. Please initiate a transfer first or check the file name.") });
        } else {
          Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to download CSV.") });
        }
      });
  };

  const handleClear = () => {
    setBuyerType("");
    setLicenseNumber("");
    setBalanceData(null);
    setSearched(false);
    setTransferAmount("");
    setComment("");
    setFileName("");
    setValidatedSearch(false);
  };

  const labelStyle = { fontWeight: 600, fontSize: "14px", color: "#4a5568" };

  const detailRows = balanceData ? [
    { label: t("Name"), value: balanceData.name || balanceData.reelerName },
    { label: t("License Number"), value: balanceData.licenseNumber },
    { label: t("Virtual Account Number"), value: balanceData.virtualAccountNumber },
    { label: t("Current Balance (₹)"), value: formatINR(balanceData.currentBalance) },
    { label: t("Minimum Balance (₹)"), value: formatINR(balanceData.minimumBalance) },
    { label: t("Bank Account Number"), value: balanceData.bankAccountNumber },
    { label: t("IFSC Code"), value: balanceData.ifscCode },
    { label: t("Bank Name"), value: balanceData.bankName },
    { label: t("Branch Name"), value: balanceData.branchName },
  ] : [];

  return (
    <Layout title={t("Reeler / RSP Bank Transfer")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Reeler / RSP Bank Transfer")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* Search Card */}
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏦</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Reeler / RSP Bank Transfer")}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{t("Select buyer type and search by license number")}</div>
            </div>
          </div>
          <Card.Body style={{ padding: "20px 24px" }}>
            <Form noValidate validated={validatedSearch} onSubmit={handleSearch}>
              <Row className="g-3 align-items-end">

                <Col md={2}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("Buyer Type")} <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={buyerType}
                      onChange={(e) => setBuyerType(e.target.value)}
                      required
                      style={{ borderRadius: "8px", fontSize: "14px" }}
                    >
                      <option value="">{t("Select")}</option>
                      <option value="Reeling">{t("Reeling")}</option>
                      <option value="RSP">{t("RSP")}</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{t("Select buyer type")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>{t("License Number")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder={t("Enter License Number")}
                      required
                      style={{ borderRadius: "8px", fontSize: "14px" }}
                    />
                    <Form.Control.Feedback type="invalid">{t("Please enter license number")}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={3} style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "8px 22px", fontWeight: 700, fontSize: "14px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 3px 10px rgba(30,103,168,0.25)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}>
                    🔍 {loading ? t("Searching...") : t("Search")}
                  </button>
                  <button type="button" onClick={handleClear} style={{ background: "#f0f6ff", border: "1.5px solid #1e67a8", borderRadius: "8px", padding: "8px 18px", fontWeight: 700, fontSize: "14px", color: "#1e67a8", cursor: "pointer", whiteSpace: "nowrap" }}>
                    {t("Clear")}
                  </button>
                </Col>

              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Balance Details Card */}
        {searched && balanceData && (
          <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(14,122,78,0.10)", marginBottom: 20 }}>
            <div style={{ background: "linear-gradient(135deg, #0e7a4e 0%, #10b981 100%)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>💰</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Balance Details")}</div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>{balanceData.name || balanceData.reelerName} — {buyerType}</div>
                </div>
              </div>
              <div style={{ background: parseFloat(balanceData.transferableAmount) > 0 ? "rgba(255,255,255,0.22)" : "rgba(255,100,100,0.25)", borderRadius: "12px", padding: "10px 24px", textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{t("Transferable Amount")}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "24px" }}>{formatINR(balanceData.transferableAmount)}</div>
              </div>
            </div>
            <Card.Body style={{ padding: "20px 24px" }}>
              {parseFloat(balanceData.transferableAmount) <= 0 && (
                <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", color: "#92400e", fontWeight: 600, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                  ⚠ {t("No transferable amount. Current balance is at or below minimum balance.")}
                </div>
              )}
              <Row className="g-3">
                {detailRows.map(({ label, value }) => (
                  <Col md={4} key={label}>
                    <div style={{ background: "#f8fafd", borderRadius: "10px", padding: "12px 16px", border: "1px solid #e2e8f0", height: "100%" }}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#718096", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#1e2a44" }}>{value || "—"}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Transfer Details Card */}
        {searched && balanceData && (
          <>
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", marginBottom: 20, marginTop: 4 }}>
              <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>💸</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("Transfer Details")}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{t("Fill in the details below to initiate the transfer")}</div>
                </div>
              </div>
              <Card.Body style={{ padding: "20px 24px" }}>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>{t("Transfer Amount")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        value={transferAmount}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v && parseFloat(v) > parseFloat(balanceData.transferableAmount)) return;
                          setTransferAmount(v);
                        }}
                        placeholder={t("Enter amount")}
                        min="0"
                        style={{ borderRadius: "8px", fontSize: "14px" }}
                      />
                      <div style={{ fontSize: "11px", color: "#718096", marginTop: 2 }}>
                        {t("Max")}: {formatINR(balanceData.transferableAmount)}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>{t("Comment")}</Form.Label>
                      <Form.Control
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value.slice(0, 500))}
                        placeholder={t("Enter reason / comment (optional)")}
                        maxLength={500}
                        style={{ borderRadius: "8px", fontSize: "14px" }}
                      />
                      <div style={{ fontSize: "11px", color: "#a0aec0", textAlign: "right", marginTop: 2 }}>{comment.length}/500</div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label style={labelStyle}>{t("File Name")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="e.g. REELER_TRANSFER_2026-06-05"
                        style={{ borderRadius: "8px", fontSize: "14px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <button
                type="button"
                disabled={!canTransfer || transferring}
                onClick={handleTransfer}
                style={{ background: !canTransfer ? "#e5e7eb" : "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "9px", padding: "10px 28px", fontWeight: 700, fontSize: "14px", color: !canTransfer ? "#9ca3af" : "#fff", cursor: (!canTransfer || transferring) ? "not-allowed" : "pointer", boxShadow: canTransfer ? "0 3px 12px rgba(30,103,168,0.30)" : "none", opacity: transferring ? 0.7 : 1 }}
              >
                {transferring
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" />{t("Transferring...")}</>
                  : `🏦 ${t("Transfer to Bank")}`}
              </button>

              <button
                type="button"
                disabled={!fileName.trim()}
                onClick={handleDownloadCSV}
                style={{ background: !fileName.trim() ? "#e5e7eb" : "linear-gradient(135deg,#7c3aed,#a78bfa)", border: "none", borderRadius: "9px", padding: "10px 28px", fontWeight: 700, fontSize: "14px", color: !fileName.trim() ? "#9ca3af" : "#fff", cursor: !fileName.trim() ? "not-allowed" : "pointer", boxShadow: fileName.trim() ? "0 3px 12px rgba(124,58,237,0.30)" : "none" }}
              >
                ⬇ {t("Download CSV")}
              </button>
            </div>
          </>
        )}

      </Block>
    </Layout>
  );
}

export default ReelerBankTransfer;
