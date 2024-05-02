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
  const [seedDisposal, setSeedDisposal] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURLSeedDfl + `sale-disposal-of-egg-rsso/get-info-by-id/${id}`)
      .then((response) => {
        setSeedDisposal(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setSeedDisposal({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Sale / Disposal of DFL's(eggs) NSSO View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {" "}
              Sale / Disposal of DFL's(eggs) NSSO View{" "}
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
            Sale / Disposal of DFL's(eggs) View
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
                        <td>{seedDisposal.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Fruits ID:</td>
                        <td>{seedDisposal.fruitsId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot Number:</td>
                        <td>{seedDisposal.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Race:</td>
                        <td>{seedDisposal.raceName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Egg Sheet Numbers:</td>
                        <td>{seedDisposal.eggSheetNumbers}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date of disposal:</td>
                        <td>{seedDisposal.dateOfDisposal}</td>
                      </tr>
                    

                      <tr>
                        <td style={styles.ctstyle}>Number Of Dfls Disposed:</td>
                        <td>{seedDisposal.numberOfDflsDisposed}</td>
                      </tr>

                      <tr>
                        <td style={styles.ctstyle}>
                          Name and address of the Farm:
                        </td>
                        <td>{seedDisposal.nameAndAddressOfTheFarm}</td>
                      </tr>

                      <tr>
                        <td style={styles.ctstyle}>Rate per 100 Dfls Price:</td>
                        <td>{seedDisposal.ratePer100DflsPrice}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Invoice Number:</td>
                        <td>{seedDisposal.invoiceNumber}</td>
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
