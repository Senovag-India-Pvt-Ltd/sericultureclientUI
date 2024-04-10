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

function PreparationofeggsDFLsView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [prepareEggs, setPrepareEggs] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `EggPreparation/get-info-by-id/${id}`)
      .then((response) => {
        setPrepareEggs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setPrepareEggs({});
        setLoading(false);
      });
  };

  console.log(prepareEggs);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Preparation of Eggs (DFLs) View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Preparation of Eggs (DFLs) View
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs-List"
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
          Preparation of Eggs (DFLs) Details
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
                        <td>{prepareEggs.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot number:</td>
                        <td>{prepareEggs.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Number of Cocoons (CB, Hybrid):
                        </td>
                        <td>{prepareEggs.numberOfCocoonsCB}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date of moth emergence:</td>
                        <td>{prepareEggs.dateOfMothEmergence}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Laid On Date:</td>
                        <td>{prepareEggs.laidOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Egg sheet serial number:</td>
                        <td>{prepareEggs.eggSheetSerialNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number of pairs:</td>
                        <td>{prepareEggs.numberOfPairs}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number of Rejection:</td>
                        <td>{prepareEggs.numberOfRejection}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>DFLs obtained:</td>
                        <td>{prepareEggs.dflsObtained}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Egg Recovery %:</td>
                        <td>{prepareEggs.eggRecoveryPercentage}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Test results:</td>
                        <td>{prepareEggs.testResults}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Certification (Yes/No):</td>
                        <td>
                          {prepareEggs.certification === "1" ? "Yes" : "No"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Additional remarks:</td>
                        <td>{prepareEggs.additionalRemarks}</td>
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

export default PreparationofeggsDFLsView;
