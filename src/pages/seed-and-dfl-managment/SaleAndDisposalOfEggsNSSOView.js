import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function SaleAndDisposalOfEggsNSSOView() {
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
    <Layout title="Sale/Disposal of Eggs NSSO View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {" "}
              Sale/Disposal of Eggs NSSO View{" "}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sale-and-disposal-of-eggs-nsso-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sale-and-disposal-of-eggs-nsso-list"
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
            Sale/Disposal of Pierced Cocoons Details
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
                        <td style={styles.ctstyle}>Lot Number:</td>
                        <td>{testingMoth.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Egg sheet numbers:</td>
                        <td>{testingMoth.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Race:</td>
                        <td>{testingMoth.race}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date of disposal:</td>
                        <td>{testingMoth.dateOfDisposal}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number of DFLs disposed:</td>
                        <td>{testingMoth.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Name and address of the farm / farmer / CRC:
                        </td>
                        <td>{testingMoth.numberCocoons}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Rate per 100 DFLs Price (in Rupees):
                        </td>
                        <td>{testingMoth.quantityInkgs}</td>
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

export default SaleAndDisposalOfEggsNSSOView;
