import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
import api from "../../../services/auth/api";
import { t } from "i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function ReelerBalanceReport() {
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
        Swal.fire("Failed to load markets");
      });
  }, [marketTypeMasterId]); // ✅ IMPORTANT

  const [reportData, setReportData] = useState([]);

  const fetchReelerData = () => {
    if (!data.marketId) return;

    api
      .post(baseURLMarket + "lotGroupage/reeler-balance-data", null, {
        params: {
          marketId: data.marketId,
        },
      })
      .then((res) => {
        console.log("REELER DATA 👉", res.data);
        setReportData(res.data || []);
      })
      .catch(() => {
        setReportData([]);
        Swal.fire("Failed to load data");
      });
  };

  useEffect(() => {
    if (data.marketId) {
      fetchReelerData();
    }
  }, [data.marketId]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const downloadReport = () => {
    if (!data.marketId) {
      Swal.fire("Please select Market");
      return;
    }
    if (!reportData || reportData.length === 0) {
      Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
      return;
    }

    api
      .post(baseURLMarket + "lotGroupage/reeler-balance-report", null, {
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
        link.href = url;
        link.setAttribute("download", "reeler_balance.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => Swal.fire("Download failed"));
  };

  return (
    <Layout title={t("Reeler Balance Report")}>
      <style>{reelerBalanceReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.Title tag="h2" className="sh-page-title">Reeler Balance</Block.Title>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form>
          <Card className="shadow-sm border-0" style={{ borderRadius: "16px" }}>
            <Card.Body>
              <Row className="align-items-end g-3">
                <Col md={3}>
                  <Form.Label className="fw-semibold text-muted">
                    Market <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Select
                    name="marketId"
                    value={data.marketId}
                    onChange={handleInputs}
                    className="form-control-lg"
                    style={{ borderRadius: "10px" }}
                  >
                    <option value="">Select Market</option>
                    {marketList.map((m) => (
                      <option key={m.marketMasterId} value={m.marketMasterId}>
                        {m.marketMasterName}
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
                    {loading ? "Downloading..." : "Download Report"}
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
                  <h5 className="fw-bold mb-0">Reeler Details</h5>
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
                        <th>Virtual Account</th>
                        <th>Current Balance</th>
                        <th>Minimum Balance</th>
                        <th>Updated Date</th>
                      </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                      {reportData.map((item, index) => (
                        <tr key={index}>
                          <td className="text-muted">{index + 1}</td>

                          <td className="text-primary">{item.name || "-"}</td>

                          <td className="text-primary">{item.virtualAccountNumber || "-"}</td>

                          <td className="text-primary">
                            {item.currentBalance}
                          </td>

                          <td className="text-primary">
                            ₹ {item.minimumBalance}
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
const reelerBalanceReportStyles = `
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

export default ReelerBalanceReport;
