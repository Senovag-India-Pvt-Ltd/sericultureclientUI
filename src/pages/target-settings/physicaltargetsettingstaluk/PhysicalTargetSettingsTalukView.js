import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function PhysicalTargetSettingsTalukView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [AcivityData, setAcivityData] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLTargetSetting + `tsPhysicalTaluk/get-join/${id}`)
      .then((response) => {
        setAcivityData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setAcivityData({});
        setLoading(false);
      });
  };

  // Date Formate
  const dateFormatter = (date) => {
    if (date) {
      return (
        new Date(date).getDate().toString().padStart(2, "0") +
        "-" +
        (new Date(date).getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date(date).getFullYear()
      );
    } else {
      return "";
    }
  };


  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title=" View Physical Target Settings Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              View Physical Target Settings Details
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/physicaltargetsettingstaluk-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/physicaltargetsettingstaluk-list"
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
          <Card.Header>View Taluk Physical Target Settings</Card.Header>
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
                        <td style={styles.ctstyle}>Financial Year:</td>
                        <td>{AcivityData.financialYear}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Scheme:</td>
                        <td>
                          <span>{AcivityData.schemeName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Sub Scheme:</td>
                        <td>
                          <span>{AcivityData.subSchemeName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>District:</td>
                        <td>
                          <span>{AcivityData.districtName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Taluk:</td>
                        <td>
                          <span>{AcivityData.talukName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date:</td>
                        <td>
                          <span>{dateFormatter(AcivityData.date)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Reporting Officer:</td>
                        <td>
                          <span>{AcivityData.username}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Implementing Officer:</td>
                        <td>
                          <span>{AcivityData.username}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Scheme Or Activity:</td>
                        <td>
                          <span>{AcivityData.schemeOrActivity}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Amount:</td>
                        <td>
                          <span>{AcivityData.amount}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Achieved Amount:</td>
                        <td>
                          <span>{AcivityData.achievedAmount}</span>
                        </td>
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

export default PhysicalTargetSettingsTalukView;
