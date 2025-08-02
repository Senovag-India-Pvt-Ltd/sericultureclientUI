import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import DispatchofCocoonstoP4Grainage from "./DispatchofCocoonstoP4Grainage";
import { useTranslation } from "react-i18next";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function DispatchofCocoonstoP4GrainageView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [dispatchCocoon, setDispatchCocoon] = useState({});
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
      .get(baseURLSeedDfl + `DispatchOfCocoons/get-info-by-id/${id}`)
      .then((response) => {
        setDispatchCocoon(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setDispatchCocoon({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("View Dispatch of Cocoons to P4 Grainage")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("View Dispatch of Cocoons to P4 Grainage Details")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Dispatch-of-Cocoons-to-P4-Grainage-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Dispatch-of-Cocoons-to-P4-Grainage-List"
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
          <Card.Header style={{ fontWeight: "bold" }}>{t("Dispatch of Cocoons to P4 Grainage Details")}</Card.Header>
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
                        <td>{dispatchCocoon.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Grainage")}:
                        </td>
                        <td>{dispatchCocoon.grainageMasterName}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>{t("Line Year")}:</td>
                        <td>{dispatchCocoon.lineName}</td>
                      </tr> */}
                      {/* <tr>
                        <td style={styles.ctstyle}>
                        {t("Source")}:
                        </td>
                        <td>{dispatchCocoon.sourceMasterName}</td>
                      </tr> */}
                      <tr>
                        <td style={styles.ctstyle}>
                        {t("Screening Batch No")}:
                        </td>
                        <td>{dispatchCocoon.screeningBatchNo}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        {t("Generation Number")}:
                        </td>
                        <td>{dispatchCocoon.generationNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        {t("Spun on date(From)")}:
                        </td>
                        <td>{dispatchCocoon.spunOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        {t("Lot Number")}:
                        </td>
                        <td>{dispatchCocoon.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        {t("Number Of Cocoons Dispatched")}:
                        </td>
                        <td>{dispatchCocoon.numberOfCocoonsDispatched}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        {t("Date Of Supply")}:
                        </td>
                        <td>{dispatchCocoon.dateOfSupply}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        {t("Dispatch Date")}:
                        </td>
                        <td>{dispatchCocoon.dispatchDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        {t("Invoice No")}:
                        </td>
                        <td>{dispatchCocoon.invoiceNo}</td>
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

export default DispatchofCocoonstoP4GrainageView;
