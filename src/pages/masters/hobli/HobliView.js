import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import HobliDatas from "../../../store/masters/hobli/HobliData";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function HobliView() {
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
  const [Hobli, setHobli] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setHobli(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `hobli/get-join/${id}`)
      .then((response) => {
        setHobli(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setHobli({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Hobli View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Hobli View")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/hobli-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/hobli-list"
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
          <Card.Header>{t("Hobli Details")}</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>{t("ID")}</td>
                      <td>{Hobli.hobliId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("state")}</td>
                      <td>{Hobli.stateName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>  {t("district")}</td>
                      <td>{Hobli.districtName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("taluk")}</td>
                      <td>{Hobli.talukName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("hobli")}</td>
                      <td>{Hobli.hobliName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Hobli Name in Kannada")}</td>
                      <td>{Hobli.hobliNameInKannada}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Hobli Code")}</td>
                      <td>{Hobli.hobliCode}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default HobliView;
