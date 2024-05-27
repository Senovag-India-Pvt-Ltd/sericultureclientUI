import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import api from "../../../../src/services/auth/api";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScSchemeDetailsView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(LandCategoryDatas);
  const [ScSchemeDetails, setScSchemeDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scSchemeDetails/get/${id}`)
      .then((response) => {
        setScSchemeDetails(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setScSchemeDetails({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Scheme Details View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Scheme Details View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-scheme-details-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-scheme-details-list"
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
          <Card.Header>Scheme Details</Card.Header>
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
                        <td>{ScSchemeDetails.scSchemeDetailsId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Scheme Name:</td>
                        <td>{ScSchemeDetails.schemeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {" "}
                          Scheme Name In Kannada:
                        </td>
                        <td>{ScSchemeDetails.schemeNameInKannada}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Scheme Start Date:</td>
                        <td>{formatDate(ScSchemeDetails.schemeStartDate)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Scheme End Date:</td>
                        <td>{formatDate(ScSchemeDetails.schemeEndDate)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>DBT Code:</td>
                        <td>{ScSchemeDetails.dbtCode}</td>
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

export default ScSchemeDetailsView;
