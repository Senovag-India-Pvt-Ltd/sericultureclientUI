import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function RearHouseRoofTypeView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  const [RearHouseRoofType, setRearHouseRoofType] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `roofType/get/${id}`)
      .then((response) => {
        setRearHouseRoofType(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setRearHouseRoofType({});
        setLoading(false);
      });
  };

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Rear House Roof Type View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Rear House Roof Type View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/rear-house-roof-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/rear-house-roof-type-list"
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

      <Block className="mt-4">
        <Card>
          <Card.Header>Rear House Roof Type Details</Card.Header>
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
                        <td>{RearHouseRoofType.roofTypeId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Rear House Roof Type:</td>
                        <td>{RearHouseRoofType.roofTypeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Rear House Roof Type Name In Kannada:</td>
                        <td>{RearHouseRoofType.roofTypeNameInKannada}</td>
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

export default RearHouseRoofTypeView;
