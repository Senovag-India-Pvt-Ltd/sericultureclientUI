import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import ReceiptOfDFLsEdit from "./ReceiptOfDFLsEdit";
import SeedCuttingBank from "./SeedCuttingBank";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function SupplyOfCocoonsToGrainageView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [supplyOfCoocons, setSupplyOfCocoons] = useState({});
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
      .get(baseURL2 + `supply-cocoons/get-info-by-id/${id}`)
      .then((response) => {
        setSupplyOfCocoons(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setSupplyOfCocoons({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("Supply Of Cocoons To Grainage View")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Supply Of Cocoons To Grainage View")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/supply-of-cocoons-to-grainage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/supply-of-cocoons-to-grainage-list"
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
          <Card.Header style={{ fontWeight: "bold" }}>{t("Supply Of Cocoons To Grainage Details")}</Card.Header>
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
                        <td>{supplyOfCoocons.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Grainage")}:</td>
                        <td>{supplyOfCoocons.grainageMasterName}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>Line Year:</td>
                        <td>{dispatchCocoon.lineName}</td>
                      </tr> */}
                      {/* <tr>
                        <td style={styles.ctstyle}>
                        Source:
                        </td>
                        <td>{dispatchCocoon.sourceMasterName}</td>
                      </tr> */}
                      <tr>
                        <td style={styles.ctstyle}>{t("Screening Batch No")}:</td>
                        <td>{supplyOfCoocons.screeningBatchNo}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Generation Number")}:</td>
                        <td>{supplyOfCoocons.generationNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Spun On Date")}:</td>
                        <td>{supplyOfCoocons.spunOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Lot Number")}:</td>
                        <td>{supplyOfCoocons.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Cocoon Supplied in Kg")}:</td>
                        <td>{supplyOfCoocons.cacoonsSuppliedInKg}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Number Of Cocoons Dispatched")}:</td>
                        <td>{supplyOfCoocons.numberOfCocoonsDispatched}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Date Of Supply")}:</td>
                        <td>{supplyOfCoocons.dateOfSupply}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Dispatch Date")}:</td>
                        <td>{supplyOfCoocons.dispatchDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Invoice No")}:</td>
                        <td>{supplyOfCoocons.invoiceNo}</td>
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

export default SupplyOfCocoonsToGrainageView;
