import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import DistrictDatas from "../../../store/masters/district/DistrictData";
import api from "../../../../src/services/auth/api";
import ScSchemeDetailsView from "../sc-scheme-details/ScSchemeDetailsView";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScSubSchemeDetailsView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  const [ScSubSchemeDetails, setScSubSchemeDetails] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setDistrict(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scSubSchemeDetails/get-join/${id}`)
      .then((response) => {
        setScSubSchemeDetails(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setScSubSchemeDetails({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Sub Scheme Details View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sub Scheme Details View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-sub-scheme-details-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-sub-scheme-details-list"
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
          <Card.Header>Sub Scheme Details</Card.Header>
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
                        <td>{ScSubSchemeDetails.scSubSchemeDetailsId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Scheme Name:</td>
                        <td>{ScSubSchemeDetails.schemeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Sub Scheme Name:</td>
                        <td>{ScSubSchemeDetails.subSchemeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {" "}
                          Sub Scheme Name in Kannada:
                        </td>
                        <td>{ScSubSchemeDetails.subSchemeNameInKannada}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Sub Scheme Type:</td>
                        <td>{ScSubSchemeDetails.subSchemeType}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Sub Scheme Start Date:</td>
                        <td>{ScSubSchemeDetails.subSchemeStartDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Sub Scheme End Date:</td>
                        <td>{ScSubSchemeDetails.subSchemeEndDate}</td>
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

export default ScSubSchemeDetailsView;
