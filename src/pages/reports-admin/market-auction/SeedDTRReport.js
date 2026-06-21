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
    marketId: Number(localStorage.getItem("marketId")),
    allottedLotId: "",
    auctionDate: new Date()
  });

  const [marketList, setMarketList] = useState([]);
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAuctionDateChange = (date) => {
    setData((prev) => ({ ...prev, auctionDate: date }));
  };

  useEffect(() => {
    api.get(baseURL + "marketMaster/get-all")
      .then(res => setMarketList(res.data.content.marketMaster))
      .catch(() => setMarketList([]));
  }, []);

  const handleInputs = (e) => {
  const { name, value } = e.target;

  setData({
    ...data,
    [name]: name === "marketId" ? Number(value) : value
  });
};

  const getPayload = () => {
    const aDate = new Date(data.auctionDate);

    return {
      marketId: data.marketId,
      allottedLotId: data.allottedLotId && data.allottedLotId.trim() !== ""
  ? parseInt(data.allottedLotId)
  : null,
      auctionDate:
        aDate.getFullYear() + "-" +
        (aDate.getMonth() + 1).toString().padStart(2, "0") + "-" +
        aDate.getDate().toString().padStart(2, "0"),
    };
  };

  const postData = (e) => {
  e.preventDefault();

  // ✅ VALIDATION
  if (!data.marketId) {
    Swal.fire("Please select Market");
    return;
  }

  if (!data.auctionDate) {
    Swal.fire("Please select Auction Date");
    return;
  }

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

  // ✅ VALIDATION
  if (!data.marketId) {
    Swal.fire("Please select Market");
    return;
  }

  if (!data.auctionDate) {
    Swal.fire("Please select Auction Date");
    return;
  }

  api.post(baseURLReport + "get-seed-DTR", getPayload(), {
    responseType: "blob"
  }).then(async (res) => {
    const blobData = res.data;
    if (!blobData || blobData.size === 0) {
      Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
      return;
    }
    const firstBytes = await blobData.slice(0, 10).text();
    if (!firstBytes.startsWith('%PDF')) {
      Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
      return;
    }
    window.open(URL.createObjectURL(blobData));
  }).catch(async (err) => {
    let isNoData = false;
    try { const b = err?.response?.data; if (b instanceof Blob) { const t = await b.text(); isNoData = /out of bounds|No Data|length 0/i.test(t); } } catch (_) {}
    if (isNoData) Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
    else Swal.fire({ icon: "error", title: "Generation Failed", text: "Could not generate the report. Please try again." });
  });
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

                  {/* Market */}
                  <Col md={2}>
                    <Form.Label><b>Market *</b></Form.Label>
                    <Form.Select
                      name="marketId"
                      value={data.marketId}
                      onChange={handleInputs}
                    >
                      <option value="">Select Market</option>
                      {marketList.map(m => (
                        <option key={m.marketMasterId} value={m.marketMasterId}>
                          {m.marketMasterName}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Lot Number */}
                  <Col md={2}>
                    <Form.Label>Lot Number</Form.Label>
                    <Form.Control
                      name="allottedLotId"
                      value={data.allottedLotId}
                      onChange={handleInputs}
                    />
                  </Col>

                  {/* Auction Date */}
                  <Col md={2}>
                    <Form.Label>Auction Date</Form.Label>
                    <DatePicker
                      selected={data.auctionDate}
                      onChange={handleAuctionDateChange}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                    />
                  </Col>

                  {/* Buttons */}
                  <Col md={6} className="text-end">
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

            {/* Table */}
            {listData.length > 0 && (
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
            )}

          </Row>
        </Form>

      </Block>
    </Layout>
  );
}

export default SeedDtrReport;