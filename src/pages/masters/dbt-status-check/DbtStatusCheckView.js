import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DbtStatusCheckView() {
   // Translation
   const { t } = useTranslation();

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(LandCategoryDatas);
  const [DbtStatusCheck, setDbtStatusCheck] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setState(findUser);
  // }, [id, data]);
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL + `dbtStatusCheck/get/${id}`)
      .then((response) => {
        setDbtStatusCheck(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setDbtStatusCheck({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Dbt Status Check View" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Dbt Status Check View")}</Block.Title>
            
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/dbtStatusCheck-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/dbtStatusCheck-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Card>
          <Card.Header>{t("Dbt Status Check Details")}</Card.Header>
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
                        <td style={styles.ctstyle}>{t("ID")}</td>
                        <td>{DbtStatusCheck.dbtStatusCheckId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("Dept Code")}</td>
                        <td>{DbtStatusCheck.deptCode}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("Scheme Id")}</td>
                        <td>{DbtStatusCheck.schemeId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("Component Type Id")}</td>
                        <td>{DbtStatusCheck.componentTypeId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("Component Id")}</td>
                        <td>{DbtStatusCheck.componentId}</td>
                      </tr>
                       <tr>
                        <td style={styles.ctstyle}> {t("Sub Component Id")}</td>
                        <td>{DbtStatusCheck.subComponentId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("Dbt Scheme")}</td>
                        <td>{DbtStatusCheck.dbtScheme}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("User Name")}</td>
                        <td>{DbtStatusCheck.username}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("Password")}</td>
                        <td>{DbtStatusCheck.password}</td>
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

export default DbtStatusCheckView;
