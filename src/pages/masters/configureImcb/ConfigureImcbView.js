import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ConfigureImcbView() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [configureImcb, setConfigureImcb] = useState({});
  const [loading, setLoading] = useState(false);

  const styles = {
    label: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "40%",
      fontWeight: "500",
    },
  };

  const getConfigureImcbById = () => {
    setLoading(true);
    api
      .get(`${baseURL}configureImcb/get-by-id-join/${id}`)
      .then((response) => {
        setConfigureImcb(response.data.content);
        setLoading(false);
      })
      .catch(() => {
        setConfigureImcb({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getConfigureImcbById();
  }, [id]);

  return (
    <Layout title={t("Configure Imcb View")} content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Configure Imcb View")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/configure-imcb-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/configure-imcb-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Card>
          <Card.Header>{t("Configure imcb Details")}</Card.Header>
          <Card.Body>
            {loading ? (
              <h5 className="d-flex justify-content-center align-items-center">
                {t("Loading...")}
              </h5>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <table className="table small table-bordered">
                    <tbody>
                      
                      <tr>
                        <td style={styles.label}>{t("imcb Basin Ends")}:</td>
                        <td>{configureImcb.imcbTable}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Category Name")}:</td>
                        <td>{configureImcb.categoryName}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Component Name")}:</td>
                        <td>{configureImcb.scComponentName}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Component Type (Sub Scheme)")}:</td>
                        <td>{configureImcb.subSchemeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Unit Cost")}:</td>
                        <td>{configureImcb.unitCost}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Minimum Value")}:</td>
                        <td>{configureImcb.min}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Maximum Value")}:</td>
                        <td>{configureImcb.max}</td>
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

export default ConfigureImcbView;