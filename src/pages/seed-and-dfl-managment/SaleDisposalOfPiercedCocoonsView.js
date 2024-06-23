import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function SaleDisposalOfPiercedCocoonsView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [piercedCocoons, setPiercedCocoons] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `Disposal-Pierced/get-info-by-id/${id}`)
      .then((response) => {
        setPiercedCocoons(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setPiercedCocoons({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Sale Disposal Of Pierced Cocoons View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {" "}
              Sale Disposal Of Pierced Cocoons View{" "}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sale-disposal-of-pierced-cocoons-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sale-disposal-of-pierced-cocoons-list"
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
                        <td>{piercedCocoons.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot Number:</td>
                        <td>{piercedCocoons.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Race:</td>
                        <td>{piercedCocoons.raceName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date of disposal:</td>
                        <td>{piercedCocoons.dateOfDisposal}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Name and address of the PC Merchant:
                        </td>
                        <td>{piercedCocoons.merchantNameAndAddress}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number of cocoons:</td>
                        <td>{piercedCocoons.numberOfCocoons}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Cocoons Quantity in kgs:</td>
                        <td>{piercedCocoons.quantityInKgs}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Rate per Kgs:</td>
                        <td>{piercedCocoons.ratePerKg}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Total Amount:</td>
                        <td>{piercedCocoons.totalAmount}</td>
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

export default SaleDisposalOfPiercedCocoonsView;
