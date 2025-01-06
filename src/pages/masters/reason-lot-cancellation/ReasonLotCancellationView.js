import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next"; // Add translation hook

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReasonLotCancellationView() {
  const { t } = useTranslation(); // Initialize translation function
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(ReasonLotCancellationDatas);
  const [ReasonLotRejectMaster, setReasonLotRejectMaster] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setReasonLotCancellation(findUser);
  // }, [id, data]);
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL + `reason-lot-reject-master/get/${id}`)
      .then((response) => {
        setReasonLotRejectMaster(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setReasonLotRejectMaster({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("Reason for Lot Cancellation View")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Reason for Lot Cancellation View")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/reason-lot-cancellation-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/reason-lot-cancellation-list"
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
        <Card className="card-gutter-md">
          <Card.Header>{t("Reason for Lot Cancellation Details")}</Card.Header>
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
                        <td>{ReasonLotRejectMaster.reasonLotRejectId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Reason for Lot Cancellation")}:</td>
                        <td>{ReasonLotRejectMaster.reasonLotRejectName}</td>
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

export default ReasonLotCancellationView;
