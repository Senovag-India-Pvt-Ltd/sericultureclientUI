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

function SeedMarketBiddingReport() {

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    reportFromDate: new Date(),
    licenseNumber: "",
  });

  const [validated, setValidated] = useState(false);

  const [reportList, setReportList] = useState([]);

  const { t } = useTranslation();

  let name, value;

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setData((prev) => ({
      ...prev,
      reportFromDate: date,
    }));
  };

  useEffect(() => {
    handleDateChange(new Date());
  }, []);

  // SEARCH BUTTON
  const searchReport = (event) => {

    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const newDate = new Date(data.reportFromDate);

    const formattedDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getDate().toString().padStart(2, "0");

    api
      .post(
        baseURLMarket + "lotGroupage/getSeedMarketBiddingReport",
        {
          marketId: data.marketId,
          reportFromDate: formattedDate,
          licenseNumber: data.licenseNumber,
        }
      )
      .then((response) => {

        if (response.data.content.length > 0) {

          setReportList(response.data.content);

        } else {

          setReportList([]);

          Swal.fire({
            icon: "warning",
            title: "No Record Found",
          });
        }
      })
      .catch(() => {

        Swal.fire({
          icon: "error",
          title: "Something went wrong",
        });
      });
  };

  // GENERATE EXCEL
  const generateReport = () => {

    const newDate = new Date(data.reportFromDate);

    const formattedDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getDate().toString().padStart(2, "0");

    api
      .post(
        baseURLMarket + "lotGroupage/downloadSeedMarketBiddingReport",
        {
          marketId: data.marketId,
          reportFromDate: formattedDate,
          licenseNumber: data.licenseNumber,
        },
        {
          responseType: "blob",
        }
      )
      .then((response) => {

        const file = new Blob(
          [response.data],
          {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        );

        const fileURL = URL.createObjectURL(file);

        const link = document.createElement("a");

        link.href = fileURL;

        link.download = "SeedMarketBiddingReport.xlsx";

        link.click();
      });
  };

  return (
    <Layout title={t("Seed Market Bidding Report")}>

      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("Seed Market Bidding Report")}
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">

        <Form noValidate validated={validated} onSubmit={searchReport}>

          <Row className="g-3">

            <Card>

              <Card.Body>

                <Row className="g-gs">

                  <Col lg="12">

                    <Form.Group as={Row} className="form-group">

                      <Form.Label
                        column
                        sm={2}
                        style={{ fontWeight: "bold" }}
                      >
                        {t("License Number")}
                      </Form.Label>

                      <Col sm={3}>
                        <Form.Control
                          id="licenseNumber"
                          name="licenseNumber"
                          value={data.licenseNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter License Number")}
                        />
                      </Col>

                      <Form.Label column sm={1}>
                        {t("Date")}
                        <span className="text-danger">*</span>
                      </Form.Label>

                      <Col sm={2}>
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          selected={data.reportFromDate}
                          onChange={handleDateChange}
                          className="form-control"
                          maxDate={new Date()}
                        />
                      </Col>

                      <Col sm={2}>
                        <Button
                          type="submit"
                          variant="primary"
                        >
                          {t("Search")}
                        </Button>
                      </Col>

                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="success"
                          onClick={generateReport}
                        >
                          {t("Generate Report")}
                        </Button>
                      </Col>

                    </Form.Group>

                  </Col>

                </Row>

              </Card.Body>

            </Card>

          </Row>

        </Form>

        {/* TABLE */}

    {reportList.length > 0 && (

  <Card className="mt-3">

    <Card.Body>

      <Table bordered hover responsive>

       <thead>

  <tr>

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
      Buyer Type
    </th>

    <th
      style={{
        backgroundColor: "#0f6cbe",
        color: "#fff",
      }}
    >
      Bidder Name
    </th>

    <th
      style={{
        backgroundColor: "#0f6cbe",
        color: "#fff",
      }}
    >
      License Number
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
      Sold Amount
    </th>

    <th
      style={{
        backgroundColor: "#0f6cbe",
        color: "#fff",
      }}
    >
      Market Fee
    </th>

  </tr>

</thead>

        <tbody>

          {reportList.map((item, index) => (

            <tr key={index}>

              <td>{item.allottedLotId}</td>
              <td>{item.auctionDate}</td>
              <td>{item.buyerType}</td>
              <td>{item.bidderName}</td>
              <td>{item.licenseNumber}</td>
              <td>{item.lotWeight}</td>
              <td>{item.amount}</td>
              <td>{item.soldAmount}</td>
              <td>{item.marketFee}</td>

            </tr>

          ))}

        </tbody>

      </Table>

    </Card.Body>

  </Card>

)}
      </Block>

    </Layout>
  );
}

export default SeedMarketBiddingReport;