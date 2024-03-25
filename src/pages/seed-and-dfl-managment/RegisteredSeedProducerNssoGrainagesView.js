import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function RegisteredSeedProducerNssoGrainagesView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [testingMoth, setTestingOfMoth] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `TestingOfMoth/get-info-by-id/${id}`)
      .then((response) => {
        setTestingOfMoth(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setTestingOfMoth({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Registered Seed Producer (RSP) NSSO Grainages View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {" "}
              Registered Seed Producer (RSP) NSSO Grainages View{" "}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages-list"
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
            Registered Seed Producer (RSP) NSSO Grainages Details
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
                        <td>{testingMoth.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Name of the Grainage and Address:
                        </td>
                        <td>{testingMoth.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot number/Year:</td>
                        <td>{testingMoth.race}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Number of Cocoons (CB, Hybrid):
                        </td>
                        <td>{testingMoth.dateOfDisposal}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date of moth emergence:</td>
                        <td>{testingMoth.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Egg sheet serial number:</td>
                        <td>{testingMoth.numberCocoons}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number of pairs:</td>
                        <td>{testingMoth.quantityInkgs}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number of Rejection:</td>
                        <td>{testingMoth.ratePerKgs}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>DFLs obtained:</td>
                        <td>{testingMoth.totalAmount}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Egg Recovery %:</td>
                        <td>{testingMoth.totalAmount}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Examination details (Date, etc):
                        </td>
                        <td>{testingMoth.totalAmount}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Test results:</td>
                        <td>{testingMoth.totalAmount}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Certification (Yes/No):</td>
                        <td>{testingMoth.totalAmount}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Additional remarks:</td>
                        <td>{testingMoth.totalAmount}</td>
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

export default RegisteredSeedProducerNssoGrainagesView;
