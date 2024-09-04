import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceofScreeningBatchRecordsView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [maintenanceScreen, setMaintenanceScreen] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `MaintenanceOfScreen/get-info-by-id/${id}`)
      .then((response) => {
        setMaintenanceScreen(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setMaintenanceScreen({});
        setLoading(false);
      });
  };

  console.log(maintenanceScreen);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Maintenance of Screening Batch Records View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance of Screening Batch Records View
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-of-Screening-Batch-Records-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-of-Screening-Batch-Records-List"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header style={{ fontWeight: "bold" }}>
            Maintenance of Screening Batch Records Details
          </Card.Header>
          <Card.Body>
            {loading ? (
              <h1 className="d-flex justify-content-center align-items-center">
                Loading...
              </h1>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}>ID:</td>
                        <td>{maintenanceScreen.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Total number of cocoons produced:
                        </td>
                        <td>
                          {maintenanceScreen.cocoonsProducedAtEachGeneration}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot number:</td>
                        <td>{maintenanceScreen.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Line Name:</td>
                        <td>{maintenanceScreen.lineName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Incubation Date:</td>
                        <td>{maintenanceScreen.incubationDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Black Boxing Date:</td>
                        <td>{maintenanceScreen.blackBoxingDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Brushed on date:</td>
                        <td>{maintenanceScreen.brushedOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Spun on date:</td>
                        <td>{maintenanceScreen.spunOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Screening Batch Number:</td>
                        <td>{maintenanceScreen.screeningBatchNo}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Total No of Cocoons Produced Screening:
                        </td>
                        <td>
                          {maintenanceScreen.cocoonsProducedAtEachScreening}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Screening Batch Results:</td>
                        <td>{maintenanceScreen.screeningBatchResults}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Chawki Percentage:</td>
                        <td>{maintenanceScreen.chawkiPercentage}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>
                          Selected Bed as per the Mean Performance:
                        </td>
                        <td>
                          {maintenanceScreen.selectedBedAsPerTheMeanPerformance}
                        </td>
                      </tr> */}
                      <tr>
                      <td style={styles.ctstyle}>
                        Selected Bed as per the Mean Performance:
                      </td>
                        {/* <td>
                          {maintenanceScreen.selectedBedAsPerTheMeanPerformance === "1"
                            ? "Bed 1"
                            : maintenanceScreen.selectedBedAsPerTheMeanPerformance === "2"
                            ? "Bed 2"
                            : maintenanceScreen.selectedBedAsPerTheMeanPerformance === "3"
                            ? "Bed 3"
                            : maintenanceScreen.selectedBedAsPerTheMeanPerformance === "4"
                            ? "Bed 4"
                            : maintenanceScreen.selectedBedAsPerTheMeanPerformance === "5"
                            ? "Bed 5"
                            : "Other"}
                        </td> */}
                        <td>
                      {String(maintenanceScreen.selectedBedAsPerTheMeanPerformance) === "1"
                        ? "Bed 1"
                        : String(maintenanceScreen.selectedBedAsPerTheMeanPerformance) === "2"
                        ? "Bed 2"
                        : String(maintenanceScreen.selectedBedAsPerTheMeanPerformance) === "3"
                        ? "Bed 3"
                        : String(maintenanceScreen.selectedBedAsPerTheMeanPerformance) === "4"
                        ? "Bed 4"
                        : String(maintenanceScreen.selectedBedAsPerTheMeanPerformance) === "5"
                        ? "Bed 5"
                        : "Other"}
                    </td>
                    </tr> 
                      <tr>
                        <td style={styles.ctstyle}>Crop Failure Details:</td>
                        <td>{maintenanceScreen.cropFailureDetails}</td>
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

export default MaintenanceofScreeningBatchRecordsView;
