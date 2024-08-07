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

function MaintenanceofMulberryfarmView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [maintenanceGarden, setMaintenanceGarden] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `MulberryFarm/get-info-by-id/${id}`)
      .then((response) => {
        setMaintenanceGarden(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setMaintenanceGarden({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Maintenance of Mulberry Garden in the Farms View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance of Mulberry Garden in the Farms View
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-of-mulberry-Garden-in-the-Farms-list"
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
            Maintenance of Mulberry Garden in the Farms Details
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
                        <td>{maintenanceGarden.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Plot Number:</td>
                        <td>{maintenanceGarden.plotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Mulberry Variety:</td>
                        <td>{maintenanceGarden.variety}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Area(In Hectares):</td>
                        <td>{maintenanceGarden.areaUnderEachVariety}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Pruning Date:</td>
                        <td>{maintenanceGarden.pruningDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Plantation Date:</td>
                        <td>{maintenanceGarden.plantationDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Fertilizer Application Date:
                        </td>
                        <td>{maintenanceGarden.fertilizerApplicationDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>FYM Date:</td>
                        <td>{maintenanceGarden.fymApplicationDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Irrigation Date:</td>
                        <td>{maintenanceGarden.irrigationDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Brushing Date:</td>
                        <td>{maintenanceGarden.brushingDate}</td>
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

export default MaintenanceofMulberryfarmView;
