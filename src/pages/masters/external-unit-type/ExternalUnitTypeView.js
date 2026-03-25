import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import ExternalUnitType from "./ExternalUnitType";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ExternalUnitTypeView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(LandCategoryDatas);
  const [ExternalUnitType, setExternalUnitType] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setState(findUser);
  // }, [id, data]);
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `externalUnitType/get/${id}`)
      .then((response) => {
        setExternalUnitType(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setExternalUnitType({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);


  const paymentMethod =
  ExternalUnitType.paymentViaBank
    ? "Bank"
    : ExternalUnitType.paymentViaK2
    ? "K2"
    : "-";

  return (
    <Layout title={t("External Unit Type View")} content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("External Unit Type View")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/external-unit-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/external-unit-type-list"
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

      <Block className="mt-n4">
        <Card>
          <Card.Header>{t("External Unit Type Details")}</Card.Header>
          <Card.Body>
            {loading ? (
              <h1 className="d-flex justify-content-center align-items-center">
                {t("Loading...")}
              </h1>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}>{t("ID")}:</td>
                        <td>{ExternalUnitType.externalUnitTypeId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("External Unit Type")}:</td>
                        <td>{ExternalUnitType.externalUnitTypeName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("External Unit Type Name in Kannada")}:</td>
                        <td>{ExternalUnitType.externalUnitTypeNameInKannada}</td>
                      </tr>
                    <tr>
                       <td style={styles.ctstyle}>{t("Payment Method")}:</td>
                        <td>{paymentMethod}</td>
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

export default ExternalUnitTypeView;