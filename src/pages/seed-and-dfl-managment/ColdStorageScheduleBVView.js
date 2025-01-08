import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";



const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function ColdStorageScheduleBVView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [scheduleBV, setScheduleBV] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `Cold-Storage/get-info-by-id/${id}`)
      .then((response) => {
        setScheduleBV(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setScheduleBV({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("View Cold Storage Schedule BV Details")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> {t("View Cold Storage Schedule BV Details")} </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Cold-Storage-Schedule-BV-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Cold-Storage-Schedule-BV-List"
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
          <Card.Header style={{ fontWeight: "bold" }}>{t("Cold Storage Schedule BV Details")}</Card.Header>
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
                        <td>{scheduleBV.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Grainage Details")}:
                        </td>
                        <td>{scheduleBV.grainageDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Lot Number")}:</td>
                        <td>{scheduleBV.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Laid On Date")}:
                        </td>
                        <td>{scheduleBV.laidOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Date Of Deposit")}:
                        </td>
                        <td>{scheduleBV.dateOfDeposit}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Schedule Type")}:
                        </td>
                        <td>{scheduleBV.scheduleType}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Date Of Release")}:
                        </td>
                        <td>{scheduleBV.dateOfRelease}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>
                          {t("Storage Temperature")}:
                        </td>
                        <td>{scheduleBV.storageTemperature}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Storage Duration")}:
                        </td>
                        <td>{scheduleBV.storageDuration}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Remaining Duration")}:
                        </td>
                        <td>{scheduleBV.remainingDuration}</td>
                      </tr> */}
                     
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

export default ColdStorageScheduleBVView;
