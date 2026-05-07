import { Card, Form, Row, Col, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2/src/sweetalert2.js";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function SeedMarketTransactionReport() {
  const { t } = useTranslation();
  const [reportList, setReportList] = useState([]);
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    fromDate: new Date(),
    toDate: new Date(),
    licenseNumber: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleFromDateChange = (date) => {
    setData((prev) => ({
      ...prev,
      fromDate: date,
    }));
  };

  const handleToDateChange = (date) => {
    setData((prev) => ({
      ...prev,
      toDate: date,
    }));
  };

  useEffect(() => {
    handleFromDateChange(new Date());
    handleToDateChange(new Date());
  }, []);
  const postData = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);

      return;
    }

    const { marketId, godownId, fromDate, toDate, licenseNumber } = data;

    const formattedFromDate =
      fromDate.getFullYear() +
      "-" +
      (fromDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      fromDate.getDate().toString().padStart(2, "0");

    const formattedToDate =
      toDate.getFullYear() +
      "-" +
      (toDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      toDate.getDate().toString().padStart(2, "0");
    api
      .post(baseURLMarket + "lotGroupage/getSeedMarketTxnReport", {
        marketId: marketId,
        godownId: godownId,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        licenseNumber: licenseNumber,
      })
      .then((response) => {
        console.log(response.data);

        if (response.data.content.reelerTransactionReports.length > 0) {
          setReportList(response.data.content.reelerTransactionReports);
        } else {
          setReportList([]);

          Swal.fire({
            icon: "warning",
            title: "No Record Found",
          });
        }
      })
      .catch((error) => {
        console.log(error);

        Swal.fire({
          icon: "error",
          title: "Something went wrong",
        });
      });
  };

  const downloadExcel = () => {
    const formattedFromDate =
      data.fromDate.getFullYear() +
      "-" +
      (data.fromDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      data.fromDate.getDate().toString().padStart(2, "0");

    const formattedToDate =
      data.toDate.getFullYear() +
      "-" +
      (data.toDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      data.toDate.getDate().toString().padStart(2, "0");

    api
      .post(
        baseURLMarket + "lotGroupage/downloadSeedMarketTxnReport",
        {
          marketId: data.marketId,
          godownId: data.godownId,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          licenseNumber: data.licenseNumber,
        },
        {
          responseType: "blob",
        },
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");

        link.href = url;

        link.setAttribute("download", "SeedMarketTransactionReport.xlsx");

        document.body.appendChild(link);

        link.click();
      });
  };
  return (
    <Layout title={t("Seed Market Transaction Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("Seed Market Transaction Report")}
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        {t("License Number")}
                        <span className="text-danger">*</span>
                      </Form.Label>

                      <Col sm={3}>
                        <Form.Control
                          id="licenseNumber"
                          name="licenseNumber"
                          value={data.licenseNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter License Number")}
                          required
                        />

                        <Form.Control.Feedback type="invalid">
                          {t("License Number is required")}
                        </Form.Control.Feedback>
                      </Col>

                      <Form.Label column sm={1}>
                        {t("From Date")}
                        <span className="text-danger">*</span>
                      </Form.Label>

                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.fromDate}
                            onChange={handleFromDateChange}
                            maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Col>

                      <Form.Label column sm={1}>
                        {t("To Date")}
                        <span className="text-danger">*</span>
                      </Form.Label>

                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.toDate}
                            onChange={handleToDateChange}
                            maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row className="d-flex justify-content-center mt-2">
              <Col sm={2}>
                <Button type="submit" variant="primary" className="me-2">
                  {t("Search")}
                </Button>
                <Button variant="success" onClick={downloadExcel}>
                  Download Excel
                </Button>
              </Col>
            </Row>
          </Row>
        </Form>

        {reportList.length > 0 && (
          <Card className="mt-3">
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-bordered">
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
                        Date
                      </th>

                      <th
                        style={{
                          backgroundColor: "#0f6cbe",
                          color: "#fff",
                        }}
                      >
                        Transaction Type
                      </th>

                      <th
                        style={{
                          backgroundColor: "#0f6cbe",
                          color: "#fff",
                        }}
                      >
                        Deposit Amount
                      </th>

                      <th
                        style={{
                          backgroundColor: "#0f6cbe",
                          color: "#fff",
                        }}
                      >
                        Payment Amount
                      </th>

                      <th
                        style={{
                          backgroundColor: "#0f6cbe",
                          color: "#fff",
                        }}
                      >
                        Balance
                      </th>

                      <th
                        style={{
                          backgroundColor: "#0f6cbe",
                          color: "#fff",
                        }}
                      >
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportList.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>

                        <td>{item.transactionDate}</td>

                        <td>{item.transactionType}</td>

                        <td>{item.depositAmount || 0}</td>

                        <td>{item.paymentAmount || 0}</td>

                        <td>{item.balance || 0}</td>

                        <td>{item.operationDescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )}
      </Block>
    </Layout>
  );
}

export default SeedMarketTransactionReport;
