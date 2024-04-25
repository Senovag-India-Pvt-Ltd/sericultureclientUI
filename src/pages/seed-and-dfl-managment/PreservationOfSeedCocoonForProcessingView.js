import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";


const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function PreservationOfSeedCocoonForProcessingView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [seedCocoon, setSeedCocoon] = useState({});
  const [loading, setLoading] = useState(false);

 

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `PreservationOfSeed/get-info-by-id/${id}`)
      .then((response) => {
        setSeedCocoon(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setSeedCocoon({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);


  return (
    <Layout title="View Preservation of seed cocoon for processing Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> View Preservation of seed cocoon for processing Details </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/preservation-of-seed-cocoon-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/preservation-of-seed-cocoon-list"
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
          <Card.Header style={{ fontWeight: "bold" }}>Preservation of seed cocoon for processing Details</Card.Header>
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
                        <td>{seedCocoon.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Lot Number:
                        </td>
                        <td>{seedCocoon.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Race:</td>
                        <td>{seedCocoon.raceName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Name of the Government Seed Farm/Farmer:
                        </td>
                        <td>{seedCocoon.nameOfTheGovernmentSeedFarmOrFarmer}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Date Of Seed Cocoon Supply:
                        </td>
                        <td>{seedCocoon.dateOfSeedCocoonSupply}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Spun On Date:
                        </td>
                        <td>{seedCocoon.spunOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Crop Number:
                        </td>
                        <td>{seedCocoon.cropNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Line Name:
                        </td>
                        <td>{seedCocoon.lineName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Bed Number/Kgs of cocoons supplied:
                        </td>
                        <td>{seedCocoon.bedNumberOrKgsOfCocoonsSupplied}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Number of pupa examined:
                        </td>
                        <td>{seedCocoon.numberOfPupaExamined}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Cocoon rejection details/ numbers:
                        </td>
                        <td>{seedCocoon.cocoonRejectionDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Invoice Date:
                        </td>
                        <td>{seedCocoon.invoiceDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Invoice No:
                        </td>
                        <td>{seedCocoon.invoiceNo}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Rate Per Kg:
                        </td>
                        <td>{seedCocoon.ratePerKg}</td>
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

export default PreservationOfSeedCocoonForProcessingView;
