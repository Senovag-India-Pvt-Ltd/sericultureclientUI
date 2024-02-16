import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ExternalUnitRegisterView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [ExternalUnitRegister, setExternalUnitRegister] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `external-unit-registration/get-join/${id}`)
      .then((response) => {
        setExternalUnitRegister(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setExternalUnitRegister({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="External Unit Registration View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">External Unit Registration View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/external-unit-registration-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/external-unit-registration-list"
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
          <Card.Header>External Unit Registration Details</Card.Header>
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
                        <td>
                          {ExternalUnitRegister.externalUnitRegistrationId}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>External Unit Type:</td>
                        <td>{ExternalUnitRegister.externalUnitTypeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Name:</td>
                        <td>{ExternalUnitRegister.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Address:</td>
                        <td>{ExternalUnitRegister.address}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>License Number:</td>
                        <td>{ExternalUnitRegister.licenseNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>External Unit Number:</td>
                        <td>{ExternalUnitRegister.externalUnitNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Name of the Organisation:
                        </td>
                        <td>{ExternalUnitRegister.organisationName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Race:</td>
                        <td>{ExternalUnitRegister.raceMasterName}</td>
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

export default ExternalUnitRegisterView;
