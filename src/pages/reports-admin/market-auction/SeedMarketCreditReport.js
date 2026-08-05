import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../../services/auth/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const baseURL1 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function SeedMarketCreditReport() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [validatedDisplay, setValidatedDisplay] = useState(false);

  const [seedMarketCreditData, setSeedMarketCreditData] = useState([]);

  const [marketData, setMarketData] = useState({});

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    transactionDate: new Date(),
  });

  const handleFromDateChange = (date) => {
    setData((prev) => ({
      ...prev,
      transactionDate: date,
    }));
  };
  // GET MARKET DETAILS

  const getMarket = (_id) => {
    api
      .get(baseURL1 + `marketMaster/get/${_id}`)
      .then((response) => {
        setMarketData(response.data.content);
      })
      .catch((err) => {
        setMarketData({});
      });
  };

  useEffect(() => {
    getMarket(localStorage.getItem("marketId"));
  }, []);

  // API CALL
  const getSeedMarketCreditReport = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedDisplay(true);
    } else {
      event.preventDefault();

      const sendData = {
        marketId: localStorage.getItem("marketId"),
        transactionDate: data.transactionDate.toISOString().split("T")[0],
      };

      setLoading(true);

      api
        .post(
          baseURLMarket + `auction/reeler/getSeedMarketCreditReport`,
          sendData,
        )
        .then((response) => {
          if (response.data.errorCode !== -1) {
            const content = response.data.content || [];
            setSeedMarketCreditData(content);
            if (!content || content.length === 0) {
              Swal.fire({
                icon: "info",
                title: "No Data Found",
              });
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: "Details not Found",
            });

            setSeedMarketCreditData([]);
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error(err);

          Swal.fire({
            icon: "error",
            title: "Something went wrong",
          });

          setLoading(false);
        });
    }
  };

  const downloadExcel = () => {
    if (!seedMarketCreditData || seedMarketCreditData.length === 0) {
      Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
      return;
    }
    const sendData = {
      marketId: localStorage.getItem("marketId"),

      transactionDate: data.transactionDate.toISOString().split("T")[0],
    };

    api
      .post(
        baseURLMarket + `auction/reeler/downloadSeedMarketCreditReport`,

        sendData,

        {
          responseType: "blob",
        },
      )

      .then((response) => {
        if (response.data.size > 0) {
          const file = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          const fileURL = URL.createObjectURL(file);

          const link = document.createElement("a");

          link.href = fileURL;

          link.download = "SeedMarketCreditReport.xlsx";

          link.click();
        } else {
          Swal.fire({
            icon: "warning",
            title: "No Record Found",
          });
        }
      })

      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
        });
      });
  };

  return (
    <Layout title={t("Seed Market Credit Report")}>
      <style>{seedMarketCreditReportStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Seed Market Credit Report")}</Block.Title>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* SEARCH FORM */}

        <Form
          noValidate
          validated={validatedDisplay}
          onSubmit={getSeedMarketCreditReport}
        >
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col sm={12} lg={12}>
                  <Form.Group as={Row} className="form-group">
                    <Form.Label column sm={2}>
                      {t("Transaction Date")}
                      <span className="text-danger">*</span>
                    </Form.Label>

                    <Col sm={3}>
                      <div className="form-control-wrap">
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          selected={data.transactionDate}
                          onChange={handleFromDateChange}
                          maxDate={new Date()}
                          className="form-control"
                        />
                      </div>
                    </Col>

                    <Col sm={4}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="me-2"
                      >
                        {loading ? "Loading..." : t("Search")}
                      </Button>
                      <Button
                        type="button"
                        variant="success"
                        onClick={downloadExcel}
                        disabled={!seedMarketCreditData || seedMarketCreditData.length === 0}
                      >
                        Download
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>

        {/* NO DATA */}
        {seedMarketCreditData && seedMarketCreditData.length === 0 && validatedDisplay && (
          <div className="text-center py-4 text-muted" style={{ fontSize: "15px" }}>
            No Data Found
          </div>
        )}

        {/* TABLE */}
        {seedMarketCreditData && seedMarketCreditData.length > 0 && (
          <Row className="g-gs pt-2 d-flex justify-content-center">
            <Col lg="12">
              <Card>
                <Card.Header className="d-flex flex-column justify-content-center align-items-center">
                  <div style={{ fontSize: "150%", fontWeight: "bold" }}>
                    {t("Government Cocoon Market")}:
                    <span style={{ color: "#a1ffe5" }}>
                      {seedMarketCreditData[0]?.marketName}
                    </span>
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
                          {t("SL No")}
                        </th>

                        <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                        >
                          {t("Posting Date")}
                        </th>

                        <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                        >
                          {t("Market Id")}
                        </th>

                        <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                        >
                          {t("Market Name")}
                        </th>

                        <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                        >
                          {t("Reeler Amount")}
                        </th>

                        <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                        >
                          {t("External Unit Amount")}
                        </th>

                        <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                        >
                          {t("Reeler Deposit Count")}
                        </th>

                        <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                        >
                          {t("External Unit Deposit Count")}
                        </th>

                        <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                        >
                          {t("Total Amount")}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {seedMarketCreditData &&
                        seedMarketCreditData.map((list, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>

                            <td>{list.postDate}</td>

                            <td>{list.marketId}</td>

                            <td>{list.marketName}</td>

                            <td>{list.totalReelerAmount}</td>

                            <td>{list.totalExternalUnitAmount}</td>

                            <td>{list.totalReelerDepositCount}</td>

                            <td>{list.totalExternalUnitDepositCount}</td>

                            <td>{list.totalAmount}</td>
                          </tr>
                        ))}
                      {/* TOTAL ROW */}

                      {seedMarketCreditData.length > 0 && (
                        <tr>
                          <td colSpan="4">
                            <b>{t("Total")}</b>
                          </td>

                          <td>
                            <b>
                              {seedMarketCreditData.reduce(
                                (a, b) => a + Number(b.totalReelerAmount || 0),
                                0,
                              )}
                            </b>
                          </td>

                          <td>
                            <b>
                              {seedMarketCreditData.reduce(
                                (a, b) =>
                                  a + Number(b.totalExternalUnitAmount || 0),
                                0,
                              )}
                            </b>
                          </td>

                          <td></td>

                          <td></td>
                          <td>
                            <b>
                              {seedMarketCreditData.reduce(
                                (a, b) => a + Number(b.totalAmount || 0),
                                0,
                              )}
                            </b>
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
      </Block>
    </Layout>
  );
}
const seedMarketCreditReportStyles = `
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

export default SeedMarketCreditReport;
