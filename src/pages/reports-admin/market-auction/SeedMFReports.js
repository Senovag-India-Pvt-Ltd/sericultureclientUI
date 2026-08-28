import DatePicker from "react-datepicker";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function SeedMFReports() {
  const { t } = useTranslation();

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    fromDate: "",
    toDate: "",
    licenseNumber: "", // ✅ added
  });

  const [counterData, setCounterData] = useState([]);

  const handleFromDateChange = (date) => {
    setData((prev) => ({ ...prev, fromDate: date }));
  };

  const handleToDateChange = (date) => {
    setData((prev) => ({ ...prev, toDate: date }));
  };

  useEffect(() => {
    handleFromDateChange(new Date());
    handleToDateChange(new Date());
  }, []);

  const postData = (event) => {
    event.preventDefault();

    const { marketId, fromDate, toDate, licenseNumber } = data;

    const formatDate = (d) =>
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      d.getDate().toString().padStart(2, "0");

    api
      .post(baseURLMarket + "lotGroupage/getSeedMFReport", {
        marketId,
        fromDate: formatDate(new Date(fromDate)),
        toDate: formatDate(new Date(toDate)),
        licenseNumber, // ✅ sending to backend
      })
      .then((response) => {
        console.log("DATA:", response.data);
        setCounterData(response.data.content || []);
        if (!response.data.content || response.data.content.length === 0) {
          Swal.fire({
            icon: "warning",
            title: t("No Data Found", { ns: "reports" }),
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: t("Error fetching report", { ns: "reports" }),
        });
      });
  };

  const downloadExcel = () => {
    if (!counterData || counterData.length === 0) {
      Swal.fire({ icon: "info", title: t("No Data Found", { ns: "reports" }), text: t("No records found for the selected criteria.", { ns: "reports" }) });
      return;
    }
    const { marketId, fromDate, toDate, licenseNumber } = data;

    const formatDate = (d) =>
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      d.getDate().toString().padStart(2, "0");

    api
      .post(
        baseURLMarket + "lotGroupage/downloadSeedMFReport",
        {
          marketId,
          fromDate: formatDate(new Date(fromDate)),
          toDate: formatDate(new Date(toDate)),
          licenseNumber,
        },
        { responseType: "blob" }, // 🔥 IMPORTANT
      )
      .then((response) => {
        if (response.data) {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "SeedMFReport.xlsx";
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: t("Error downloading file", { ns: "reports" }),
        });
      });
  };
  return (
    <Layout title={t("Seed MF Report")}>
      <style>{seedMFReportsStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.Title tag="h2" className="sh-page-title">{t("Seed MF Report")}</Block.Title>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form onSubmit={postData}>
          <Row className="g-3">
            <Card>
              <Card.Body>
          
                  <Row className="align-items-end">
                    {/* LICENSE NUMBER */}
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          {t("License Number", { ns: "reports" })}
                        </Form.Label>
                        <Form.Control
                          name="licenseNumber"
                          value={data.licenseNumber}
                          onChange={(e) =>
                            setData({
                              ...data,
                              licenseNumber: e.target.value,
                            })
                          }
                          type="text"
                          placeholder={t("Enter License Number", { ns: "reports" })}
                        />
                      </Form.Group>
                    </Col>

                    {/* FROM DATE */}
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label className="fw-bold">{t("From Date")}</Form.Label>
                        <DatePicker
                          selected={data.fromDate}
                          onChange={handleFromDateChange}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          maxDate={new Date()}
                        />
                      </Form.Group>
                    </Col>

                    {/* TO DATE */}
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label className="fw-bold">{t("To Date")}</Form.Label>
                        <DatePicker
                          selected={data.toDate}
                          onChange={handleToDateChange}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          maxDate={new Date()}
                        />
                      </Form.Group>
                    </Col>

                    {/* SEARCH BUTTON */}
                    <Col md={2}>
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mt-2"
                      >
                        {t("Search", { ns: "reports" })}
                      </Button>
                    </Col>

                    {/* EXCEL BUTTON */}
                    <Col md={2}>
                      <Button
                        variant="success"
                        type="button"
                        onClick={downloadExcel}
                        className="w-100 mt-2"
                        disabled={!counterData || counterData.length === 0}
                      >
                        {t("Generate Excel", { ns: "reports" })}
                      </Button>
                    </Col>
                  </Row>
          
              </Card.Body>
            </Card>

            {/* 🔥 TABLE */}
            {counterData && counterData.length > 0 && (
              <Row className="g-gs pt-2 d-flex justify-content-center">
                <Col lg="12">
                  <Card>
                    <Card.Header className="d-flex flex-column justify-content-center align-items-center">
                      <div style={{ fontSize: "150%", fontWeight: "bold" }}>
                        Seed MF Report
                      </div>
                    </Card.Header>

                    <Card.Body>
                      <table
                        className="table table-striped table-bordered"
                        style={{ backgroundColor: "white" }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              SL No
                            </th>

                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              Lot No
                            </th>

                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              Date
                            </th>

                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              License
                            </th>

                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              Buyer Name
                            </th>

                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              Bid Amount
                            </th>

                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              Weight
                            </th>

                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              Amount
                            </th>

                            <th
                              style={{
                                backgroundColor: "#0f6cbe",
                                color: "#fff",
                              }}
                            >
                              MF Amount
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {counterData && counterData.length > 0 ? (
                            counterData.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>

                                <td>{item.allottedLotId}</td>

                                <td>{item.auctionDate}</td>

                                <td>{item.licenseNumber}</td>

                                <td>{item.buyerName}</td>

                                <td>{item.bidAmount}</td>

                                <td>{item.totalWeight}</td>

                                <td>{item.totalSoldAmount}</td>

                                <td>{item.totalMarketFee}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9" style={{ textAlign: "center" }}>
                                No Data
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const seedMFReportsStyles = `
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

export default SeedMFReports;
