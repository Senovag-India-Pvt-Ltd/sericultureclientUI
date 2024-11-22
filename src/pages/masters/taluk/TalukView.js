import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function TalukView() {
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
  const [Taluk, setTaluk] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `taluk/get-join/${id}`)
      .then((response) => {
        setTaluk(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setTaluk({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Taluk View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Taluk View")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/taluk-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/taluk-list"
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

      <Block className="mt-n4">
        <Card>
          <Card.Header>{t("Taluk Details")}</Card.Header>
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
                        <td style={styles.ctstyle}> {t("ID")}</td>
                        <td>{Taluk.talukId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("state")}</td>
                        <td>{Taluk.stateName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("district")}</td>
                        <td>{Taluk.districtName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>  {t("taluk")}</td>
                        <td>{Taluk.talukName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>  {t("Taluk Name in Kannada")}</td>
                        <td>{Taluk.talukNameInKannada}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Lg Taluk")}</td>
                        <td>{Taluk.lgTaluk}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Taluk Code")}</td>
                        <td>{Taluk.talukCode}</td>
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

export default TalukView;
