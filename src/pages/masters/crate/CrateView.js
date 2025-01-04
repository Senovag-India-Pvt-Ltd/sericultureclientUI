import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function CrateView() {
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
  // const [data] = useState(EducationDatas);
  const [crate, setCrate] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setDistrict(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `crateMaster/get-join/${id}`)
      .then((response) => {
        setCrate(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setCrate({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("Crate View")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Crate View")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/crate-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/crate-list"
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
          <Card.Header>{t("Crate Details")}</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> {t("ID")}:</td>
                      <td>{crate.crateMasterId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Market")}:</td>
                      <td>{crate.marketMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Race")}:</td>
                      <td>{crate.raceMasterName}</td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}> Godown:</td>
                      <td>{crate.godownName}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}> {t("Approx Weight Per Crate")}:</td>
                      <td>{crate.approxWeightPerCrate}</td>
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

export default CrateView;
