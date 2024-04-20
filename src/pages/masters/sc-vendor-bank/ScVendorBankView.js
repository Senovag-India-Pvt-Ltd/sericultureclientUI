import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScVendorBankView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(LandCategoryDatas);
  const [ScVendorBank, setScVendorBank] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setState(findUser);
  // }, [id, data]);
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scVendorBank/get-join/${id}`)
      .then((response) => {
        setScVendorBank(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setScVendorBank({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Vendor Bank View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Vendor Bank View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-vendor-bank-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-vendor-bank-list"
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
          <Card.Header>Vendor Bank Details</Card.Header>
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
                        <td>{ScVendorBank.scVendorBankId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Bank Name:</td>
                        <td>{ScVendorBank.bankName}</td>
                      </tr>

                      <tr>
                        <td style={styles.ctstyle}> Ifsc Code:</td>
                        <td>{ScVendorBank.ifscCode}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Branch:</td>
                        <td>{ScVendorBank.branch}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Account Number:</td>
                        <td>{ScVendorBank.accountNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Upi:</td>
                        <td>{ScVendorBank.upi}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Vendor:</td>
                        <td>{ScVendorBank.name}</td>
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

export default ScVendorBankView;
