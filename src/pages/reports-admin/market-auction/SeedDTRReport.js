import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
import api from "../../../services/auth/api";
import { t } from "i18next";
import DatePicker from "react-datepicker";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function SeedDtrReport() {

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    allottedLotId: "",
    fromDate: new Date(),
    toDate: new Date()
  });

  const [marketList, setMarketList] = useState([]);
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFromDateChange = (date) => {
    setData((prev) => ({ ...prev, fromDate: date }));
  };

  const handleToDateChange = (date) => {
    setData((prev) => ({ ...prev, toDate: date }));
  };

  useEffect(() => {
    api.get(baseURL + "marketMaster/get-all")
      .then(res => setMarketList(res.data.content.marketMaster))
      .catch(() => setMarketList([]));
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const getPayload = () => {
    const fDate = new Date(data.fromDate);
    const tDate = new Date(data.toDate);

    return {
      marketId: data.marketId,
      allottedLotId: data.allottedLotId ? parseInt(data.allottedLotId) : null,
      fromDate: fDate.getFullYear() + "-" +
        (fDate.getMonth() + 1).toString().padStart(2, "0") + "-" +
        fDate.getDate().toString().padStart(2, "0"),
      toDate: tDate.getFullYear() + "-" +
        (tDate.getMonth() + 1).toString().padStart(2, "0") + "-" +
        tDate.getDate().toString().padStart(2, "0"),
    };
  };

  const postData = (e) => {
    e.preventDefault();

    setLoading(true);

    api.post(baseURLMarket + "lotGroupage/getSeedCocoonDTRReport", getPayload())
      .then((res) => {
        if (res.data.content && res.data.content.length) {
          setListData(res.data.content);
        } else {
          setListData([]);
          Swal.fire("No Data Found");
        }
      })
      .catch(() => Swal.fire("Error fetching data"))
      .finally(() => setLoading(false));
  };

  const printReport = () => {
    api.post(baseURLReport + "get-seed-DTR", getPayload(), {
      responseType: "blob"
    }).then((res) => {
      const file = new Blob([res.data], { type: "application/pdf" });
      window.open(URL.createObjectURL(file));
    }).catch(() => Swal.fire("Print failed"));
  };

  return (
    <Layout title={t("Seed DTR Report")}>

      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Seed DTR Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">

        <Form onSubmit={postData}>
          <Row className="g-3">

            <Card style={{
              borderRadius: "20px",
              minHeight: "140px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <Card.Body>

                <Row className="align-items-end">

                  <Col md={2}>
                    <Form.Label><b>Market</b></Form.Label>
                    <Form.Select
                      name="marketId"
                      value={data.marketId}
                      onChange={handleInputs}
                    >
                      <option>Select Market</option>
                      {marketList.map(m => (
                        <option key={m.marketMasterId} value={m.marketMasterId}>
                          {m.marketMasterName}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={2}>
                    <Form.Label>Lot Number</Form.Label>
                    <Form.Control
                      name="allottedLotId"
                      value={data.allottedLotId}
                      onChange={handleInputs}
                    />
                  </Col>

                  <Col md={2}>
                    <Form.Label>From Date</Form.Label>
                    <DatePicker
                      selected={data.fromDate}
                      onChange={handleFromDateChange}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                  </Col>

                  <Col md={2}>
                    <Form.Label>To Date</Form.Label>
                    <DatePicker
                      selected={data.toDate}
                      onChange={handleToDateChange}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                  </Col>

                  <Col md={4} className="text-end">
                    <Button type="submit" variant="primary">
                      {loading ? "Loading..." : "Generate Report"}
                    </Button>

                    <Button
                      type="button"
                      variant="primary"
                      className="ms-2"
                      onClick={printReport}
                    >
                      Generate PDF
                    </Button>
                  </Col>

                </Row>

              </Card.Body>
            </Card>

            {listData.length > 0 && (
              <>
                

                <Row className="mt-2">
                  <Col lg="12">
                    <table className="table table-bordered" style={{ backgroundColor: "#fff" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#0f6cbe", color: "#fff" }}>
                          <th>Sl No</th>
                          <th>Lot No</th>
                          <th>Farmer Name</th>
                          <th>Father Name</th>
                          <th>FRUITS ID</th>
                          <th>Village</th>
                          <th>Parental</th>
                          <th>DFLs</th>
                          <th>FC</th>
                          <th>Lot Weight</th>
                          <th>Estimated</th>
                          <th>Market</th>
                          <th>Cocoon/Kg</th>
                          <th>Melt %</th>
                          <th>Total Qty</th>
                          <th>RSP</th>
                          <th>NSSO</th>
                          <th>Govt</th>
                          <th>Reeling</th>
                          <th>Date</th>
                          <th>Remaining</th>
                        </tr>
                      </thead>

                      <tbody>
                        {listData.map((row, i) => (
                          <tr key={i}>
                            <td>{row.serialNumber}</td>
                            <td>{row.allottedLotId}</td>
                            <td>{row.farmerFullName}</td>
                            <td>{row.fatherNameKan}</td>
                            <td>{row.farmerFruitsId}</td>
                            <td>{row.farmerVillage}</td>
                            <td>{row.parentalLevel}</td>
                            <td>{row.noOfDfls}</td>
                            <td>{row.fcIssued}</td>
                            <td>{row.lotWeight}</td>
                            <td>{row.estimatedWeight}</td>
                            <td>{row.marketName}</td>
                            <td>{row.cocoonsPerKg}</td>
                            <td>{row.meltPercentage}</td>
                            <td>{row.totalQuantity}</td>
                            <td>{row.rspQty}</td>
                            <td>{row.nssoQty}</td>
                            <td>{row.govtGrainageQty}</td>
                            <td>{row.reelingQty}</td>
                            <td>{row.auctionDate}</td>
                            <td>{row.remainingCocoon}</td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </Col>
                </Row>
              </>
            )}

          </Row>
        </Form>

      </Block>
    </Layout>
  );
}

export default SeedDtrReport;