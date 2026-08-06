import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

const updateFarmerVirtualBankAccountSeedMarketStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function UpdateFarmerVirtualBankAccountSeedMarket() {
  const { t } = useTranslation();

  const [search, setSearch] = useState({ text: "", type: "fruitsId" });
  const [validatedSearch, setValidatedSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  const [farmerDetails, setFarmerDetails] = useState(null);
  const [vbAccountList, setVbAccountList] = useState([]);
  const [marketMasterListData, setMarketMasterListData] = useState([]);

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [validatedAdd, setValidatedAdd] = useState(false);
  const [validatedEdit, setValidatedEdit] = useState(false);

  const [vbLock, setVbLock] = useState(false);
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    reenterVirtualAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
    marketMasterName: "",
  });

  useEffect(() => {
    api
      .get(baseURL + `marketMaster/get-all`)
      .then((res) => setMarketMasterListData(res.data.content.marketMaster || []))
      .catch(() => setMarketMasterListData([]));
  }, []);

  const getVbList = (farmerId) => {
    api
      .get(baseURL2 + `farmer-virtual-bank-account/get-by-farmer-id/${farmerId}`)
      .then((res) => setVbAccountList(res.data.content?.farmerVirtualBankAccounts || []))
      .catch(() => setVbAccountList([]));
  };

  const handleSearch = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedSearch(true);
      return;
    }
    e.preventDefault();
    setFarmerDetails(null);
    setVbAccountList([]);
    setLoading(true);

    api
      .post(baseURL2 + `farmer/get-farmer-details-by-fruits-id-or-mobile-number-or-csb-register-number`, {
        text: search.text,
        type: search.type,
      })
      .then((res) => {
        const resData = res.data;

        if (resData?.errorMessages && resData.errorMessages.length > 0) {
          const msg =
            resData.errorMessages[0]?.message?.[0]?.message ||
            resData.errorMessages[0]?.message ||
            t("No farmer record found for the given input.");
          Swal.fire({ icon: "warning", title: t("Not Found"), text: msg, customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } });
          setLoading(false);
          return;
        }

        if (Array.isArray(resData) && resData.length > 0) {
          const farmer = resData[0];
          setFarmerDetails(farmer);
          getVbList(farmer.farmerId);
        } else {
          Swal.fire({ icon: "warning", title: t("Not Found"), text: t("No farmer record found for the given input."), customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } });
        }
      })
      .catch((err) => {
        const errData = err.response?.data;
        const msg =
          errData?.errorMessages?.[0]?.message?.[0]?.message ||
          errData?.errorMessages?.[0]?.message ||
          err.message ||
          t("Failed to fetch farmer details.");
        Swal.fire({ icon: "warning", title: t("Not Found"), text: msg, customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } });
      })
      .finally(() => setLoading(false));
    setValidatedSearch(false);
  };

  const resetVbForm = () => {
    setVbAccount({
      virtualAccountNumber: "",
      reenterVirtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
      marketMasterName: "",
    });
    setVbLock(false);
  };

  const handleVbInputs = (e) => {
    const { name, value } = e.target;
    const formatted =
      name === "branchName" || name === "ifscCode" ? value.toUpperCase() : value;
    setVbAccount((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleMarketOption = (e) => {
    const chooseId = parseInt(e.target.value);
    const market = marketMasterListData.find((m) => m.marketMasterId === chooseId);
    setVbAccount((prev) => ({
      ...prev,
      marketMasterId: chooseId,
      marketMasterName: market?.marketMasterName || "",
    }));
  };

  const validateVb = (isEdit) => {
    if (vbAccount.ifscCode.length !== 11) {
      Swal.fire({
        icon: "warning",
        title: t("Invalid IFSC Code"),
        text: t("IFSC Code must be exactly 11 characters."),
        customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
      });
      return false;
    }
    if (vbAccount.virtualAccountNumber !== vbAccount.reenterVirtualAccountNumber) {
      Swal.fire({
        icon: "warning",
        title: t("Account Number Mismatch"),
        text: t("Virtual Account Number and Re-enter do not match."),
        customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
      });
      return false;
    }
    const isDuplicate = vbAccountList.some(
      (v) =>
        v.virtualAccountNumber === vbAccount.virtualAccountNumber &&
        (!isEdit || v.farmerVirtualBankAccountId !== vbAccount.farmerVirtualBankAccountId)
    );
    if (isDuplicate) {
      Swal.fire({
        icon: "warning",
        title: t("Duplicate Account"),
        text: t("This Virtual Account Number already exists."),
        customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
      });
      return false;
    }
    return true;
  };

  const handleAdd = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedAdd(true);
      return;
    }
    e.preventDefault();
    if (!validateVb(false)) return;
    const { reenterVirtualAccountNumber, ...payload } = vbAccount;
    api
      .post(baseURL2 + `farmer-virtual-bank-account/add`, {
        ...payload,
        isLocked: vbLock,
        farmerId: farmerDetails.farmerId,
      })
      .then(() => {
        getVbList(farmerDetails.farmerId);
        setShowModalAdd(false);
        resetVbForm();
        setValidatedAdd(false);
        Swal.fire({
          icon: "success",
          title: t("Saved"),
          text: t("Virtual Bank Account added successfully."),
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
        });
      })
      .catch(() =>
        Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to add Virtual Bank Account."), customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } })
      );
  };

  const handleOpenEdit = (item) => {
    const market = marketMasterListData.find((m) => m.marketMasterId === item.marketMasterId);
    setVbAccount({
      ...item,
      reenterVirtualAccountNumber: item.virtualAccountNumber,
      marketMasterName: market?.marketMasterName || item.marketMasterName || "",
    });
    setVbLock(item.isLocked || false);
    setShowModalEdit(true);
  };

  const handleEdit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedEdit(true);
      return;
    }
    e.preventDefault();
    if (!validateVb(true)) return;
    const { reenterVirtualAccountNumber, ...payload } = vbAccount;
    api
      .post(baseURL2 + `farmer-virtual-bank-account/edit`, { ...payload, isLocked: vbLock })
      .then(() => {
        getVbList(farmerDetails.farmerId);
        setShowModalEdit(false);
        resetVbForm();
        setValidatedEdit(false);
        Swal.fire({
          icon: "success",
          title: t("Updated"),
          text: t("Virtual Bank Account updated successfully."),
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
        });
      })
      .catch(() =>
        Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to update Virtual Bank Account."), customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } })
      );
  };

  const handleDelete = (vbAccountId) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("This Virtual Bank Account will be permanently deleted."),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3193e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("Yes, delete it"),
      cancelButtonText: t("Cancel"),
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(baseURL2 + `farmer-virtual-bank-account/delete/${vbAccountId}`)
          .then(() => {
            getVbList(farmerDetails.farmerId);
            Swal.fire({
              icon: "success",
              title: t("Deleted"),
              text: t("Virtual Bank Account deleted."),
              timer: 2000,
              showConfirmButton: false,
              customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
            });
          })
          .catch(() =>
            Swal.fire({ icon: "error", title: t("Error"), text: t("Failed to delete Virtual Bank Account."), customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" } })
          );
      }
    });
  };

  const cardHeader = (gradient, icon, title, subtitle) => (
    <div
      style={{
        background: gradient,
        padding: "16px 24px",
        borderRadius: "14px 14px 0 0",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{title}</div>
        {subtitle && (
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{subtitle}</div>
        )}
      </div>
    </div>
  );

  const inputStyle = { borderRadius: "8px", border: "1.5px solid #d0d9e8", fontSize: "13px" };
  const labelStyle = { fontWeight: 600, fontSize: "13px", color: "#4a5568" };

  const VbFormFields = () => (
    <Row className="g-3">
      <Col lg="6">
        <Form.Group className="form-group">
          <Form.Label style={labelStyle}>
            {t("Virtual Account Number")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            name="virtualAccountNumber"
            value={vbAccount.virtualAccountNumber}
            onChange={handleVbInputs}
            type="text"
            placeholder={t("Enter Virtual Account Number")}
            required
            style={inputStyle}
          />
          <Form.Control.Feedback type="invalid">
            {t("Virtual Account Number is required")}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg="6">
        <Form.Group className="form-group">
          <Form.Label style={labelStyle}>
            {t("Re-enter Virtual Account Number")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            name="reenterVirtualAccountNumber"
            value={vbAccount.reenterVirtualAccountNumber}
            onChange={handleVbInputs}
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            type="password"
            placeholder={t("Re-enter Virtual Account Number")}
            required
            style={inputStyle}
          />
          <Form.Control.Feedback type="invalid">{t("Re-enter is required")}</Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg="6">
        <Form.Group className="form-group">
          <Form.Label style={labelStyle}>
            {t("Branch Name")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            name="branchName"
            value={vbAccount.branchName}
            onChange={handleVbInputs}
            type="text"
            placeholder={t("Enter Branch Name")}
            required
            style={inputStyle}
          />
          <Form.Control.Feedback type="invalid">{t("Branch Name is required")}</Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg="6">
        <Form.Group className="form-group">
          <Form.Label style={labelStyle}>
            {t("IFSC Code")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            name="ifscCode"
            value={vbAccount.ifscCode}
            onChange={handleVbInputs}
            type="text"
            maxLength="11"
            placeholder={t("Enter 11-character IFSC Code")}
            required
            style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.5px" }}
          />
          <Form.Control.Feedback type="invalid">{t("IFSC Code is required")}</Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg="6">
        <Form.Group className="form-group">
          <Form.Label style={labelStyle}>
            {t("Market")} <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="marketMasterId"
            value={vbAccount.marketMasterId || ""}
            onChange={handleMarketOption}
            required
            style={inputStyle}
          >
            <option value="">{t("Select Market")}</option>
            {marketMasterListData.map((m) => (
              <option key={m.marketMasterId} value={m.marketMasterId}>
                {m.marketMasterName}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{t("Market is required")}</Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg="6" className="d-flex align-items-end">
        <Form.Group
          className="form-group w-100"
          style={{
            background: "#f5f3ff",
            border: "1.5px solid #ddd6fe",
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Form.Check
            type="checkbox"
            id="vbLockCheck"
            checked={vbLock}
            onChange={(e) => setVbLock(e.target.checked)}
          />
          <Form.Label
            htmlFor="vbLockCheck"
            style={{ margin: 0, fontWeight: 600, fontSize: "13px", color: "#5b21b6", cursor: "pointer" }}
          >
            🔒 {t("Lock Virtual Bank Account")}
          </Form.Label>
        </Form.Group>
      </Col>
    </Row>
  );

  return (
    <Layout title={t("Update Farmer Virtual Bank Account")}>
      <style>{updateFarmerVirtualBankAccountSeedMarketStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Update Farmer Virtual Bank Account")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4">

        {/* Search Card */}
        <Card
          style={{ borderRadius: 14, border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", marginBottom: 20 }}
        >
          {cardHeader(
            "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)",
            "🔍",
            t("Search Farmer"),
            t("Search by Fruits ID, Farmer Number or Mobile Number")
          )}
          <Card.Body style={{ padding: "14px 20px" }}>
            <Form noValidate validated={validatedSearch} onSubmit={handleSearch}>
              <Col sm={8} lg={12}>
                <Form.Group as={Row} className="form-group mb-0" id="fid">
                  <Form.Label column sm={1} lg={2} style={{ fontWeight: 600, fontSize: "13px", color: "#4a5568" }}>
                    {t("Search Farmer Details By")}
                  </Form.Label>
                  <Col sm={1} lg={2}>
                    <Form.Select
                      name="type"
                      value={search.type}
                      onChange={(e) => setSearch((p) => ({ ...p, type: e.target.value }))}
                      style={{ borderRadius: "8px", border: "1.5px solid #d0d9e8", fontSize: "13px" }}
                    >
                      <option value="mobileNumber">{t("Mobile Number")}</option>
                      <option value="fruitsId">{t("Fruits Id")}</option>
                      {/* <option value="farmerNumber">{t("RSCP Number")}</option> */}
                    </Form.Select>
                  </Col>
                  <Col sm={2} lg={2}>
                    <Form.Control
                      name="text"
                      value={search.text}
                      onChange={(e) => setSearch((p) => ({ ...p, text: e.target.value }))}
                      type="text"
                      placeholder={t("Search")}
                      required
                      style={{ borderRadius: "8px", border: "1.5px solid #d0d9e8", fontSize: "13px" }}
                    />
                    <Form.Control.Feedback type="invalid">{t("Field Value is Required")}</Form.Control.Feedback>
                  </Col>
                  <Col sm={2} lg={3} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "7px 22px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 3px 10px rgba(30,103,168,0.30)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}
                    >
                      🔍 {loading ? t("Searching...") : t("Search")}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSearch({ text: "", type: "mobileNumber" }); setFarmerDetails(null); setVbAccountList([]); setValidatedSearch(false); }}
                      style={{ background: "#f0f6ff", border: "1.5px solid #1e67a8", borderRadius: "8px", padding: "7px 18px", fontWeight: 700, fontSize: "13px", color: "#1e67a8", cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      {t("Clear")}
                    </button>
                  </Col>
                </Form.Group>
              </Col>
            </Form>
          </Card.Body>
        </Card>

        {/* Farmer Details Card */}
        {farmerDetails && (
          <>
            <Card
              style={{ borderRadius: 14, border: "none", boxShadow: "0 4px 24px rgba(14,159,110,0.10)", marginBottom: 20 }}
            >
              {cardHeader(
                "linear-gradient(135deg, #0e9f6e 0%, #31c48d 100%)",
                "👨‍🌾",
                t("Farmer Details"),
                `${t("Farmer ID")}: ${farmerDetails.farmerId}`
              )}
              <Card.Body style={{ padding: "20px 24px" }}>
                <Row className="g-3">
                  {[
                    {
                      label: t("Full Name"),
                      value: `${farmerDetails.firstName || ""} ${farmerDetails.middleName || ""} ${farmerDetails.lastName || ""}`.trim(),
                    },
                    { label: t("Mobile Number"), value: farmerDetails.mobileNumber },
                    
                  ].map((item, i) => (
                    <Col lg="2" md="4" sm="6" key={i}>
                      <div
                        style={{
                          background: "#f8faff",
                          border: "1px solid #e3eaf6",
                          borderRadius: 10,
                          padding: "12px 16px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "#6b7a90",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: 4,
                          }}
                        >
                          {item.label}
                        </div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e2a44" }}>
                          {item.value || "—"}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Virtual Bank Accounts Card */}
            <Card
              style={{ borderRadius: 14, border: "none", boxShadow: "0 4px 24px rgba(79,70,229,0.10)" }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  padding: "16px 24px",
                  borderRadius: "14px 14px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    💳
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
                      {t("Virtual Bank Accounts")}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                      {vbAccountList.length} {t("account(s) found")}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="light"
                  size="sm"
                  style={{ fontWeight: 600, borderRadius: 8 }}
                  onClick={() => { resetVbForm(); setShowModalAdd(true); }}
                >
                  + {t("Add Account")}
                </Button>
              </div>

              <Card.Body style={{ padding: 0 }}>
                {vbAccountList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 12, opacity: 0.4 }}>🏦</div>
                    <div style={{ fontWeight: 600, fontSize: "1rem", color: "#6b7280" }}>
                      {t("No Virtual Bank Accounts found")}
                    </div>
                    <div style={{ fontSize: "0.85rem", marginTop: 4 }}>
                      {t("Click 'Add Account' to add a virtual bank account for this farmer.")}
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table small" style={{ marginBottom: 0 }}>
                      <thead>
                        <tr style={{ background: "linear-gradient(90deg, #f0f4ff, #f5f0ff)" }}>
                          <th style={{ padding: "12px 16px", color: "#4f46e5", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #e5e7f0" }}>{t("Action")}</th>
                          <th style={{ padding: "12px 16px", color: "#4f46e5", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #e5e7f0" }}>{t("Virtual Account Number")}</th>
                          <th style={{ padding: "12px 16px", color: "#4f46e5", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #e5e7f0" }}>{t("Branch Name")}</th>
                          <th style={{ padding: "12px 16px", color: "#4f46e5", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #e5e7f0" }}>{t("IFSC Code")}</th>
                          <th style={{ padding: "12px 16px", color: "#4f46e5", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #e5e7f0" }}>{t("Market")}</th>
                          <th style={{ padding: "12px 16px", color: "#4f46e5", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #e5e7f0", textAlign: "center" }}>{t("Lock Status")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vbAccountList.map((item, i) => (
                          <tr key={item.farmerVirtualBankAccountId || i} style={{ borderBottom: "1px solid #f0f2f7" }}>
                            <td style={{ padding: "11px 16px", verticalAlign: "middle" }}>
                              <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={() => handleOpenEdit(item)}
                                disabled={item.isLocked}
                                title={item.isLocked ? t("Account is locked") : ""}
                              >
                                {t("Edit")}
                              </Button>
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleDelete(item.farmerVirtualBankAccountId)}
                                disabled={item.isLocked}
                                title={item.isLocked ? t("Account is locked") : ""}
                              >
                                {t("Delete")}
                              </Button>
                            </td>
                            <td style={{ padding: "11px 16px", verticalAlign: "middle", fontFamily: "monospace", fontWeight: 700, color: "#1a56db" }}>
                              {item.virtualAccountNumber}
                            </td>
                            <td style={{ padding: "11px 16px", verticalAlign: "middle" }}>{item.branchName}</td>
                            <td style={{ padding: "11px 16px", verticalAlign: "middle" }}>
                              <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 8px", borderRadius: 4, fontSize: "0.85rem" }}>
                                {item.ifscCode}
                              </span>
                            </td>
                            <td style={{ padding: "11px 16px", verticalAlign: "middle" }}>
                              {marketMasterListData.find((m) => m.marketMasterId === item.marketMasterId)?.marketMasterName || item.marketMasterName || "—"}
                            </td>
                            <td style={{ padding: "11px 16px", verticalAlign: "middle", textAlign: "center" }}>
                              {item.isLocked ? (
                                <span style={{ background: "#fde8ec", color: "#c81e45", border: "1px solid #fbc8d4", borderRadius: 20, padding: "3px 12px", fontSize: "0.78rem", fontWeight: 700 }}>
                                  🔒 {t("Locked")}
                                </span>
                              ) : (
                                <span style={{ background: "#e6f9f1", color: "#0e7a4e", border: "1px solid #a7f0d0", borderRadius: 20, padding: "3px 12px", fontSize: "0.78rem", fontWeight: 700 }}>
                                  🔓 {t("Unlocked")}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </Block>

      {/* Add Modal */}
      <Modal
        show={showModalAdd}
        onHide={() => { setShowModalAdd(false); resetVbForm(); setValidatedAdd(false); }}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", borderRadius: "8px 8px 0 0" }}
        >
          <Modal.Title style={{ fontWeight: 700, fontSize: "1rem" }}>
            💳 {t("Add Virtual Bank Account")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 24px" }}>
          <Form noValidate validated={validatedAdd} onSubmit={handleAdd}>
            {VbFormFields()}
            <div className="d-flex justify-content-center mt-4" style={{ gap: "10px" }}>
              <button type="submit" style={{ background: "linear-gradient(135deg,#0e9f6e,#31c48d)", border: "none", borderRadius: "8px", padding: "8px 28px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: "pointer", boxShadow: "0 3px 10px rgba(14,159,110,0.30)", whiteSpace: "nowrap" }}>
                ✅ {t("Save Account")}
              </button>
              <button type="button" onClick={() => { setShowModalAdd(false); resetVbForm(); setValidatedAdd(false); }} style={{ background: "#f3f4f6", border: "1.5px solid #d1d5db", borderRadius: "8px", padding: "8px 22px", fontWeight: 600, fontSize: "13px", color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}>
                {t("Cancel")}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showModalEdit}
        onHide={() => { setShowModalEdit(false); resetVbForm(); setValidatedEdit(false); }}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", borderRadius: "8px 8px 0 0" }}
        >
          <Modal.Title style={{ fontWeight: 700, fontSize: "1rem" }}>
            ✏️ {t("Edit Virtual Bank Account")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 24px" }}>
          <Form noValidate validated={validatedEdit} onSubmit={handleEdit}>
            {VbFormFields()}
            <div className="d-flex justify-content-center mt-4" style={{ gap: "10px" }}>
              <button type="submit" style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", padding: "8px 28px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: "pointer", boxShadow: "0 3px 10px rgba(30,103,168,0.30)", whiteSpace: "nowrap" }}>
                ✅ {t("Update Account")}
              </button>
              <button type="button" onClick={() => { setShowModalEdit(false); resetVbForm(); setValidatedEdit(false); }} style={{ background: "#f3f4f6", border: "1.5px solid #d1d5db", borderRadius: "8px", padding: "8px 22px", fontWeight: 600, fontSize: "13px", color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}>
                {t("Cancel")}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default UpdateFarmerVirtualBankAccountSeedMarket;
