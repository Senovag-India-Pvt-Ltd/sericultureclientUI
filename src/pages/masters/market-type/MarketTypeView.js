import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MarketTypeView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  const [marketType, setMarketType] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `marketTypeMaster/get/${id}`)
      .then((response) => {
        setMarketType(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setMarketType({});
        setLoading(false);
      });
  };

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    getIdList();
  }, [id]);
  return (
    <Layout title="Market Type View" >
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Market Type View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/market-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/market-type-list"
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
          <Card.Header>Market Type Details</Card.Header>
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
                        <td>{marketType.marketTypeMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Market Type:</td>
                        <td>{marketType.marketTypeMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Market Type Name in Kannada:</td>
                        <td>{marketType.marketTypeNameInKannada}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Reeler Fee:</td>
                        <td>{marketType.reelerFee}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Farmer Fee:</td>
                        <td>{marketType.farmerFee}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Trader Fee:</td>
                        <td>{marketType.traderFee}</td>
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

export default MarketTypeView;
