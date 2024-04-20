import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScVendorContactView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(LandCategoryDatas);
  const [ScVendorContact, setScVendorContact] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setState(findUser);
  // }, [id, data]);
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scVendorContact/get-join/${id}`)
      .then((response) => {
        setScVendorContact(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setScVendorContact({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title=" Vendor Contact View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> Vendor Contact View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-vendor-contact-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-vendor-contact-list"
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
          <Card.Header> Vendor Contact Details</Card.Header>
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
                        <td>{ScVendorContact.scVendorContactId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Vendor Address:</td>
                        <td>{ScVendorContact.vendorAddress}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Phone:</td>
                        <td>{ScVendorContact.phone}</td>
                      </tr>

                      <tr>
                        <td style={styles.ctstyle}> Email:</td>
                        <td>{ScVendorContact.email}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>  Vendor:</td>
                        <td>{ScVendorContact.name}</td>
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

export default ScVendorContactView;
