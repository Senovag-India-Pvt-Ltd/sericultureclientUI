import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function BudgetTalukView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id, types } = useParams();
  // const [data] = useState(CasteDatas);
  const [AcivityData, setAcivityData] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const [type, setType] = useState({
    budgetType: types,
  });

  const getIdList = () => {
    setLoading(true);
    if (type.budgetType === "allocate") {
      api
        .get(baseURLTargetSetting + `tsBudgetTaluk/get-join/${id}`)
        .then((response) => {
          setAcivityData(response.data.content);
          setLoading(false);
        })
        .catch((err) => {
          setAcivityData({});
          setLoading(false);
        });
    }
    if (type.budgetType === "release") {
      api
        .get(baseURLTargetSetting + `tsReleaseBudgetTaluk/get-join/${id}`)
        .then((response) => {
          setAcivityData(response.data.content);
          setLoading(false);
        })
        .catch((err) => {
          setAcivityData({});
          setLoading(false);
        });
    }
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title=" View Budget Taluk Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">View Budget Taluk Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budget-taluk-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budget-taluk-list"
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
          <Card.Header>View Taluk Budget Details</Card.Header>
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
                        <td style={styles.ctstyle}>Head Of Account:</td>
                        <td>
                          <span>{AcivityData.scHeadAccountName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date:</td>
                        <td>
                          <span>{AcivityData.date}</span>
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
                        <td style={styles.ctstyle}>Budget Amount:</td>
                        <td>
                          <span>{AcivityData.budgetAmount}</span>
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

export default BudgetTalukView;
