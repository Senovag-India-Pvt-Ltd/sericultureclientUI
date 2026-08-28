import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
import api from "../../../services/auth/api";
import { t } from "i18next";
import i18next from "i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function ExternalUnitBalanceReport() {
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId") || "",
  });

  const [marketData, setMarketData] = useState({});

  const [marketTypeMasterId, setMarketTypeMasterId] = useState(null);

  const getMarket = (_id) => {
    api
      .get(baseURL + `marketMaster/get/${_id}`)
      .then((response) => {
        // debugger;
        setMarketData(response.data.content);
        setMarketTypeMasterId(response.data.content.marketTypeMasterId);
      })
      .catch((err) => {
        // setMarketData([]);
      });
  };

  useEffect(() => {
    if (data.marketId) {
      getMarket(data.marketId);
    }
  }, [data.marketId]);

  const [marketList, setMarketList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch markets
  useEffect(() => {
    if (!marketTypeMasterId) return; // ✅ wait until value comes

    api
      .post(baseURL + "marketMaster/get-market-by-typeMasterId", {
        marketTypeMasterId: marketTypeMasterId,
      })
      .then((res) => {
        const markets = res.data.content.marketMaster || [];
        setMarketList(markets);
      })
      .catch(() => {
        setMarketList([]);
        Swal.fire(t("Failed to load markets", { ns: "reports" }));
      });
  }, [marketTypeMasterId]); // ✅ IMPORTANT

  // ✅ Handle input
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Download
  const downloadReport = () => {
    if (!data.marketId) {
      Swal.fire(t("Please select Market", { ns: "reports" }));
      return;
    }
    if (!reportData || reportData.length === 0) {
      Swal.fire({ icon: "info", title: t("No Data Found", { ns: "reports" }), text: t("No records found for the selected criteria.", { ns: "reports" }) });
      return;
    }

    setLoading(true);

    api
      .post(baseURLMarket + "lotGroupage/external-unit-balance-report", null, {
        params: {
          marketId: data.marketId,
        },
        responseType: "blob",
      })
      .then((res) => {
        const file = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");

        // ✅ dynamic filename (optional)
        const fileName = `external_unit_balance_${data.marketId}.xlsx`;

        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        Swal.fire(t("Download successful", { ns: "reports" }), "", "success");
      })
      .catch((err) => {
        console.error(err);
        Swal.fire(t("Download failed", { ns: "reports" }), t("Please try again", { ns: "reports" }), "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [reportData, setReportData] = useState([]);

  const fetchReportData = () => {
    if (!data.marketId) return;

    api
      .post(baseURLMarket + "lotGroupage/external-unit-balance-data", null, {
        params: {
          marketId: data.marketId,
        },
      })
      .then((res) => {
        console.log("DATA 👉", res.data);
        setReportData(res.data || []); // ✅ IMPORTANT FIX
      })
      .catch(() => {
        setReportData([]);
        Swal.fire(t("Failed to load data", { ns: "reports" }));
      });
  };

  useEffect(() => {
    if (data.marketId) {
      fetchReportData();
    }
  }, [data.marketId]);
  return (
    <Layout title={t("External Unit Balance Report", { ns: "reports" })}>
      <style>{externalUnitBalanceReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.Title tag="h2" className="sh-page-title">{t("External Unit Balance", { ns: "reports" })}</Block.Title>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form>
          {/* FILTER CARD */}
          <Card className="shadow-sm border-0" style={{ borderRadius: "16px" }}>
            <Card.Body>
              <Row className="align-items-end g-3">
                <Col md={3}>
                  <Form.Label className="fw-semibold text-muted">
                    {t("Market")} <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Select
                    name="marketId"
                    value={data.marketId}
                    onChange={handleInputs}
                    className="form-control-lg"
                    style={{ borderRadius: "10px" }}
                  >
                    <option value="">{t("Select Market")}</option>
                    {marketList.map((m) => (
                      <option key={m.marketMasterId} value={m.marketMasterId}>
                        {i18next.language === "kn" ? (m.marketNameInKannada || m.marketMasterName) : m.marketMasterName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col md={4} className="text-end">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={downloadReport}
                    disabled={!data.marketId || loading || !reportData || reportData.length === 0}
                    style={{
                      borderRadius: "10px",
                    }}
                  >
                    {loading ? t("Downloading...", { ns: "reports" }) : t("Download Report", { ns: "reports" })}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            className="mt-4 border-0"
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <Card.Body>
              {/* HEADER (LIKE DOWNLOAD CARD) */}
              <Row className="align-items-center mb-3">
                <Col md={6}>
                  <h5 className="fw-bold mb-0">External Unit Details</h5>
                </Col>
              </Row>

              {/* TABLE / EMPTY */}
              {reportData.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No data available
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    {/* HEADER */}
                    <thead
                      style={{ backgroundColor: "#1f5fa8", color: "white" }}
                    >
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>License No</th>
                        <th>Virtual Account</th>
                        <th>Balance</th>
                        <th>Updated Date</th>
                      </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                      {reportData.map((item, index) => (
                        <tr key={index}>
                          <td className="text-muted">{index + 1}</td>

                          <td className="text-primary">{item.name || "-"}</td>

                          <td className="text-primary">{item.licenseNo || "-"}</td>

                          <td className="text-primary">
                            {item.virtualAccountNumber}
                          </td>

                          <td className="text-primary">
                            ₹ {item.currentBalance}
                          </td>

                          <td className="text-primary">{item.updatedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>{" "}
        </Form>
      </Block>
    </Layout>
  );
}

const externalUnitBalanceReportStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
`;

export default ExternalUnitBalanceReport;
