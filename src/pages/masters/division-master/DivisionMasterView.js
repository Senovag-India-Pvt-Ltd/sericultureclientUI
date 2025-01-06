import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next"; // Add this line
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DivisionMasterView() {
  const { t } = useTranslation(); // Add this line
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(LandCategoryDatas);
  const [Division, setDivision] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setState(findUser);
  // }, [id, data]);
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `divisionMaster/get/${id}`)
      .then((response) => {
        setDivision(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setDivision({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("Division View")}> {/* Modify this line */}
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Division View")}</Block.Title> {/* Modify this line */}
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/division-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span> {/* Modify this line */}
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/division-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span> {/* Modify this line */}
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header>{t("Division Details")}</Card.Header> {/* Modify this line */}
          <Card.Body>
            {loading ? (
              <h1 className="d-flex justify-content-center align-items-center">
                {t("Loading...")} {/* Modify this line */}
              </h1>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}>{t("ID")}:</td> {/* Modify this line */}
                        <td>{Division.divisionMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Division Name")}:</td> {/* Modify this line */}
                        <td>{Division.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Division Name In Kannada")}:</td> {/* Modify this line */}
                        <td>{Division.nameInKannada}</td>
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

export default DivisionMasterView;
