import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import ReceiptOfDFLsEdit from "./ReceiptOfDFLsEdit";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function ReceiptOfDFLsView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [receiptOfDFLs, setReceiptOfDFLs] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Receipt/get-info-by-id/${id}`)
      .then((response) => {
        setReceiptOfDFLs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setReceiptOfDFLs({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Receipt of DFLs View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Receipt of DFLs View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/receipt-of-dfls-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/receipt-of-dfls-list"
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
          <Card.Header>Receipt of DFLs Details</Card.Header>
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
                        <td>{receiptOfDFLs.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Race Of DFLs:</td>
                        <td>{receiptOfDFLs.raceOfDfls}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Grainage:</td>
                        <td>{receiptOfDFLs.grainage}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Laid On Date:</td>
                        <td>{receiptOfDFLs.laidOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot Number:</td>
                        <td>{receiptOfDFLs.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number Of DFLs Received:</td>
                        <td>{receiptOfDFLs.numberOfDFLsReceived}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Invoice Details:</td>
                        <td>{receiptOfDFLs.invoiceDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>DFLs Received Date:</td>
                        <td>{receiptOfDFLs.dflsRecDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Generation Details:</td>
                        <td>{receiptOfDFLs.generationDetails}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>View Receipt:</td>
                        <td>{receiptOfDFLs.viewReceipt}</td>
                      </tr> */}
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

export default ReceiptOfDFLsView;
