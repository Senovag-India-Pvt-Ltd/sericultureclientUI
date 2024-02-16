import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function UsersView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `userMaster/get-join/${id}`)
      .then((response) => {
        console.log(response);
        setUser(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setUser({});
        setLoading(false);
      });
  };

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="User View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">User View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/users-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/users-list"
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
          <Card.Header>User Details</Card.Header>
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
                        <td>{user.userMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> User Name:</td>
                        <td>{user.username}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> First Name:</td>
                        <td>{user.firstName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Middle Name:</td>
                        <td>{user.middleName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Last Name:</td>
                        <td>{user.lastName}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>Password:</td>
                        <td>{user.password}</td>
                      </tr> */}
                      <tr>
                        <td style={styles.ctstyle}>Email:</td>
                        <td>{user.emailID}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Mobile Number:</td>
                        <td>{user.phoneNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Designation:</td>
                        <td>{user.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>State:</td>
                        <td>{user.stateName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>District:</td>
                        <td>{user.districtName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Taluk:</td>
                        <td>{user.talukName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Role:</td>
                        <td>{user.roleName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Market:</td>
                        <td>{user.marketMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Working Institution:</td>
                        <td>{user.workingInstitutionName}</td>
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

export default UsersView;
