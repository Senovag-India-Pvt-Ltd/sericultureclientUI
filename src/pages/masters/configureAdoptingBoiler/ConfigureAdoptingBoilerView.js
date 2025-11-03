import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ConfigureAdoptingBoilerView() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [configureAdoptingBoiler, setConfigureAdoptingBoiler] = useState({});
  const [loading, setLoading] = useState(false);

  const styles = {
    label: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "40%",
      fontWeight: "500",
    },
  };

  const getConfigureAdoptingBoilerById = () => {
    setLoading(true);
    api
      .get(`${baseURL}configureAdoptingBoiler/get-by-id-join/${id}`)
      .then((response) => {
        setConfigureAdoptingBoiler(response.data.content);
        setLoading(false);
      })
      .catch(() => {
        setConfigureAdoptingBoiler({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getConfigureAdoptingBoilerById();
  }, [id]);

  return (
    <Layout title={t("Configure Adapting Boiler Details")} content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Configure Adapting Boiler Details")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/configure-adopting-boiler-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/configure-adopting-boiler-list"
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
          <Card.Header>{t("Configure Adapting Boiler Details")}</Card.Header>
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
                        <td style={styles.label}>{t("Boiler In Kg")}:</td>
                        <td>{configureAdoptingBoiler.boilerInKg}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Category Name")}:</td>
                        <td>{configureAdoptingBoiler.categoryName}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Component Name")}:</td>
                        <td>{configureAdoptingBoiler.scComponentName}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Component Type (Sub Scheme)")}:</td>
                        <td>{configureAdoptingBoiler.subSchemeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Unit Cost")}:</td>
                        <td>{configureAdoptingBoiler.unitCost}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Minimum Value")}:</td>
                        <td>{configureAdoptingBoiler.min}</td>
                      </tr>
                      <tr>
                        <td style={styles.label}>{t("Maximum Value")}:</td>
                        <td>{configureAdoptingBoiler.max}</td>
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

export default ConfigureAdoptingBoilerView;