import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScUnitCostView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  const [ScUnitCost, setScUnitCost] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setDistrict(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scUnitCost/get-join/${id}`)
      .then((response) => {
        setScUnitCost(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setScUnitCost({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Unit Cost View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Unit Cost View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-unit-cost-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-unit-cost-list"
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
          <Card.Header>Unit Cost Details</Card.Header>
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
                        <td>{ScUnitCost.scUnitCostId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Head Account:</td>
                        <td>{ScUnitCost.scHeadAccountName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Category:</td>
                        <td>{ScUnitCost.categoryName}</td>
                      </tr>

                      <tr>
                        <td style={styles.ctstyle}> Sub Scheme Details:</td>
                        <td>{ScUnitCost.subSchemeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Central Share:</td>
                        <td>{ScUnitCost.centralShare}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> State Share:</td>
                        <td>{ScUnitCost.stateShare}</td>
                      </tr>

                      <tr>
                        <td style={styles.ctstyle}> Benificiary Share:</td>
                        <td>{ScUnitCost.benificiaryShare}</td>
                      </tr>

                      <tr>
                        <td style={styles.ctstyle}>Unit Cost:</td>
                        <td>{ScUnitCost.unitCost}</td>
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

export default ScUnitCostView;
