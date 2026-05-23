import { Card, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2/src/sweetalert2.js";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import React, { useState, useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

if (!document.getElementById("lwpf-styles")) {
  const s = document.createElement("style");
  s.id = "lwpf-styles";
  s.innerHTML = `
    .swal-pop { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
    .swal-pop .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; }
    .swal-pop .swal2-icon { margin: 20px auto 4px !important; }
    .swal-pop .swal2-html-container { margin: 0 !important; padding: 0 !important; }
    .swal-pop .swal2-actions { gap: 10px !important; }
    .swal-pop .swal2-confirm, .swal-pop .swal2-cancel { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; font-size: 14px !important; }
    .lwpf-delete-btn { background: linear-gradient(135deg,#e53e3e,#fc5c7d); border: none; border-radius: 7px; padding: 5px 14px; font-size: 12px; font-weight: 700; color: #fff; cursor: pointer; transition: opacity 0.15s; }
    .lwpf-delete-btn:hover { opacity: 0.85; }
  `;
  document.head.appendChild(s);
}

const inputStyle = {
  borderRadius: "8px",
  border: "1.5px solid #d0d9e8",
  padding: "8px 12px",
  fontSize: "14px",
  background: "#f8fafd",
  color: "#333",
  width: "100%",
};
const labelStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#4a5568",
  marginBottom: "5px",
  display: "block",
};
const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "4px",
};

const customTableStyles = {
  rows: { style: { minHeight: "40px", fontSize: "13px" } },
  headCells: {
    style: {
      background: "linear-gradient(135deg,#1e67a8,#2d9cdb)",
      color: "#fff",
      fontSize: "13px",
      fontWeight: 700,
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  cells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
      paddingTop: "6px",
      paddingBottom: "6px",
      borderBottom: "1px solid #e2e8f0",
    },
  },
};

function LotWisePriceFixation() {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  const { id } = useParams();

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    fixationDate: new Date(),
    pricePerKg: "",
    allottedLotId: "",
  });

  const [validated, setValidated] = useState(false);
  const [allottedLotOptions, setAllottedLotOptions] = useState([]);

  const getAllottedLotIdsForPrice = async () => {
    try {
      const response = await api.post(
        baseURL1 + `cocoon/getAllottedLotIdsForPrice`,
      );
      setAllottedLotOptions(response?.data?.content || []);
    } catch {
      setAllottedLotOptions([]);
    }
  };

  const getList = () => {
    setLoading(true);
    api
      .get(baseURL1 + `cocoon/getPrices`)
      .then((response) => {
        setListData(response.data.content || []);
        setLoading(false);
      })
      .catch(() => {
        setListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllottedLotIdsForPrice();
    getList();
  }, []);

  const handleLotIdInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const acceptSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Price Fixed Successfully",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#f0fff4,#fff);border:1.5px solid #9ae6b4;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#38a169,#48bb78);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">✅</div><div><p style="color:#22543d;font-size:14px;font-weight:700;margin:0 0 5px">Price Added Successfully</p><p style="color:#276749;font-size:13px;margin:0;line-height:1.65">The lot wise price has been recorded successfully.</p></div></div></div>`,
      confirmButtonText: "OK",
      confirmButtonColor: "#38a169",
      background: "#fff",
      customClass: { popup: "swal-pop" },
    }).then(() => window.location.reload());
  };

  const acceptError = (message = t("Something went wrong!")) => {
    const errorMessage =
      typeof message === "object"
        ? Object.values(message).join("<br>")
        : message;
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">❌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Could Not Save</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${errorMessage}</p></div></div></div>`,
      confirmButtonText: "Close",
      confirmButtonColor: "#e53e3e",
      background: "#fff",
      customClass: { popup: "swal-pop" },
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Delete this record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#718096",
      customClass: { popup: "swal-pop" },
    }).then((result) => {
      if (result.value) {
        api
          .delete(baseURL1 + `cocoon/delete/${_id}`)
          .then(() => {
            getList();
            Swal.fire({
              icon: "success",
              title: "Deleted",
              text: "Record deleted successfully.",
              customClass: { popup: "swal-pop" },
            });
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Delete Failed",
              text: "Something went wrong!",
              customClass: { popup: "swal-pop" },
            });
          });
      }
    });
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      if (isSaving) return;
      setIsSaving(true);
      api
        .post(baseURL1 + `cocoon/saveLotWiseBasePriceKGLot`, { ...data })
        .then((response) => {
          if (response.data.errorCode === 0) {
            acceptSuccess();
            getList();
            setData({
              marketId: localStorage.getItem("marketId"),
              fixationDate: new Date(),
              pricePerKg: "",
              allottedLotId: "",
            });
          } else if (response.data.errorCode === -1) {
            if (response.data.content) {
              acceptError(response.data.content);
            } else if (response.data.errorMessages?.length > 0) {
              acceptError(response.data.errorMessages[0].message);
            } else {
              acceptError();
            }
          }
        })
        .catch(() => {
          acceptError();
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  };

  const UserDataColumns = [
    {
      name: t("Sl.No."),
      cell: (row, i) => (
        <span style={{ fontWeight: 600, color: "#4a5568" }}>{i + 1}</span>
      ),
      width: "70px",
    },
    {
      name: t("Bidding Slip Lot No"),
      selector: (row) => row.allottedLotId,
      cell: (row) => (
        <span
          style={{
            background: "#ebf8ff",
            color: "#1e67a8",
            borderRadius: "6px",
            padding: "3px 10px",
            fontWeight: 700,
            fontSize: "12px",
          }}
        >
          {row.allottedLotId}
        </span>
      ),
      sortable: true,
    },
    {
      name: t("Fixation Date"),
      selector: (row) => row.fixationDate,
      cell: (row) => <span>{row.fixationDate}</span>,
      sortable: true,
    },
    {
      name: t("Price Per Kg (₹)"),
      selector: (row) => row.pricePerKg,
      cell: (row) => (
        <span style={{ fontWeight: 700, color: "#276749" }}>
          ₹ {row.pricePerKg}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          type="button"
          className="lwpf-delete-btn"
          onClick={() => deleteConfirm(row.id)}
        >
          🗑 Delete
        </button>
      ),
    },
  ];

  return (
    <Layout title={t("Lot Wise Price Fixation")} show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Lot Wise Price Fixation")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* Form Card */}
        <Card
          style={{
            borderRadius: "14px",
            border: "none",
            boxShadow: "0 4px 24px rgba(30,103,168,0.10)",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "14px 14px 0 0",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              💰
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>
                Lot Wise Price Fixation
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", marginTop: "1px" }}>
                Set price per kg for a bidding slip lot
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "20px",
                padding: "4px 14px",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}
              >
                Seed Market
              </span>
            </div>
          </div>

          <Card.Body style={{ padding: "10px 16px 12px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#1e67a8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "3px",
                  height: "14px",
                  background: "#1e67a8",
                  borderRadius: "2px",
                  display: "inline-block",
                }}
              />
              Price Details
            </div>

            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 align-items-end">
                <Col md={3} style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    Bidding Slip Lot No{" "}
                    <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <Form.Select
                    id="allottedLotId"
                    name="allottedLotId"
                    value={data.allottedLotId}
                    onChange={handleLotIdInputs}
                    style={inputStyle}
                    required
                  >
                    <option value="">{t("Select Lot No")}</option>
                    {allottedLotOptions.map((lotId) => (
                      <option key={lotId} value={lotId}>
                        {lotId}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#fff5f5",
                        border: "1px solid #feb2b2",
                        borderRadius: "6px",
                        padding: "3px 9px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#c53030",
                        marginTop: "4px",
                      }}
                    >
                      ⚠ {t("Bidding Slip Lot No is required.")}
                    </span>
                  </Form.Control.Feedback>
                </Col>

                <Col md={3} style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    Price Per Kg (₹) <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <Form.Control
                    id="pricePerKg"
                    name="pricePerKg"
                    value={data.pricePerKg}
                    onChange={handleLotIdInputs}
                    type="number"
                    placeholder={t("Enter Price")}
                    style={inputStyle}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#fff5f5",
                        border: "1px solid #feb2b2",
                        borderRadius: "6px",
                        padding: "3px 9px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#c53030",
                        marginTop: "4px",
                      }}
                    >
                      ⚠ {t("Price is required.")}
                    </span>
                  </Form.Control.Feedback>
                </Col>

                <Col md={3} style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    Transaction Date <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <DatePicker
                    selected={data.fixationDate}
                    onChange={(date) => handleDateChange(date, "fixationDate")}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    maxDate={new Date()}
                    minDate={new Date()}
                  />
                </Col>

                <Col md={3} style={fieldGroupStyle}>
                  <label
                    style={{
                      ...labelStyle,
                      visibility: "hidden",
                      userSelect: "none",
                    }}
                  >
                    _
                  </label>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      background: isSaving
                        ? "#c8d6e5"
                        : "linear-gradient(135deg,#1e67a8,#2d9cdb)",
                      border: "none",
                      borderRadius: "9px",
                      padding: "8px 20px",
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#fff",
                      width: "100%",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      boxShadow: isSaving
                        ? "none"
                        : "0 4px 12px rgba(30,103,168,0.32)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "7px",
                      height: "38px",
                    }}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />{" "}
                        Saving…
                      </>
                    ) : (
                      <>✅ {t("Submit")}</>
                    )}
                  </button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Table Card */}
        <Card
          style={{
            borderRadius: "14px",
            border: "none",
            boxShadow: "0 4px 24px rgba(30,103,168,0.10)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1e67a8 0%, #2d9cdb 100%)",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "14px 14px 0 0",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              📋
            </div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>
              Price Fixation Records
            </div>
          </div>

          <Card.Body style={{ padding: "6px 16px 8px" }}>
            <DataTable
              columns={UserDataColumns}
              data={listData}
              highlightOnHover
              progressPending={loading}
              customStyles={customTableStyles}
              noDataComponent={
                <div
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: "#718096",
                    fontSize: "14px",
                  }}
                >
                  📭 No price fixation records found.
                </div>
              }
            />
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default LotWisePriceFixation;
