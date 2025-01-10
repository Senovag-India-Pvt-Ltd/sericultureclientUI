import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceAndSaleOfNurseryToFarmersView() {
  const { t } = useTranslation();
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [maintenanceNursery, setMaintenanceNursery] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Maintenance-sale/get-info-by-id/${id}`)
      .then((response) => {
        setMaintenanceNursery(response.data);
        if (response.data.challanUploadKey) {
          getChallanFile(response.data.challanUploadKey);
        }
        setLoading(false);
      })
      .catch((err) => {
        setMaintenanceNursery({});
        setLoading(false);
      });
  };

  // To get Photo
  const [selectedChallanFile, setSelectedChallanFile] = useState(null);

  const getChallanFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `v1/api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedChallanFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  const downloadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `v1/api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);

      const fileExtension = file.split(".").pop();

      const link = document.createElement("a");
      link.href = url;

      const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

      link.download = modifiedFileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  return (
    <Layout title={t("View Maintenance And Sale Of Nursery To Farmers Details")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("View Maintenance And Sale Of Nursery To Farmers Details")}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-and-sale-of-nursery-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-and-sale-of-nursery-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header style={{ fontWeight: "bold" }}>
            {t("Maintenance And Sale Of Nursery To Farmers Details")}
          </Card.Header>
          <Card.Body>
            {loading ? (
              <h1 className="d-flex justify-content-center align-items-center">
                {t("Loading...")}
              </h1>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}>{t("ID")}:</td>
                        <td>{maintenanceNursery.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Fruits Id")}:</td>
                        <td>{maintenanceNursery.fruitsId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Farmer Name")}:</td>
                        <td>{maintenanceNursery.farmerName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Mulberry Variety")}:</td>
                        <td>{maintenanceNursery.mulberryVariety}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Area")}:</td>
                        <td>{maintenanceNursery.area}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Date Of Planting")}:</td>
                        <td>{maintenanceNursery.dateOfPlanting}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Nursery Details")}:</td>
                        <td>{maintenanceNursery.nurserySaleDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Quantity")}:</td>
                        <td>{maintenanceNursery.quantity}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Date")}:</td>
                        <td>{maintenanceNursery.date}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Rate")}:</td>
                        <td>{maintenanceNursery.rate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Sapling Age")}:</td>
                        <td>{maintenanceNursery.saplingAge}</td>
                      </tr> 
                      {/* <tr>
                        <td style={styles.ctstyle}>Generate Receipt:</td>
                        <td>{maintenanceNursery.generateRecipt}</td>
                      </tr>  */}
                      <tr>
                        <td style={styles.ctstyle}>{t("Receipt Number")}:</td>
                        <td>{maintenanceNursery.receiptNumber}</td>
                      </tr> 
                      <tr>
                        <td style={styles.ctstyle}>{t("Remittance Details")}:</td>
                        <td>{maintenanceNursery.remittanceDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Challan")}:</td>
                        <td>
                          {" "}
                          {selectedChallanFile && (
                            <>
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedChallanFile}
                              alt={t("Selected File")}
                            />
                             <Button
                                variant="primary"
                                size="sm"
                                className="ms-2"
                                onClick={() =>
                                  downloadFile(maintenanceNursery.challanUploadKey)
                                }
                              >
                                {t("Download File")}
                              </Button>
                              </>
                          )}
                        </td>
                      </tr>                     
                    </tbody>
                  </table>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default MaintenanceAndSaleOfNurseryToFarmersView;
