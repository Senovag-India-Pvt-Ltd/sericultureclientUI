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

function PreservationOfSeedCocoonForProcessingView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [seedCocoon, setSeedCocoon] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `PreservationOfSeed/get-info-by-id/${id}`)
      .then((response) => {
        setSeedCocoon(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setSeedCocoon({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);


  return (
    <Layout title={t("View Preservation of seed cocoon for processing Details")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("View Preservation of seed cocoon for processing Details")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/preservation-of-seed-cocoon-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/preservation-of-seed-cocoon-list"
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
          <Card.Header style={{ fontWeight: "bold" }}>{t("Preservation of seed cocoon for processing Details")}</Card.Header>
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
                        <td>{seedCocoon.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Lot Number")}:
                        </td>
                        <td>{seedCocoon.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Parent Lot Number")}:
                        </td>
                        <td>{seedCocoon.parentLotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Market")}:</td>
                        <td>{seedCocoon.marketMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Farm")}:</td>
                        <td>{seedCocoon.farmName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Race")}:</td>
                        <td>{seedCocoon.raceName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Name of the Government Seed Farm/Farmer")}:
                        </td>
                        <td>{seedCocoon.nameOfTheGovernmentSeedFarmOrFarmer}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Date Of Seed Cocoon Supply")}:
                        </td>
                        <td>{seedCocoon.dateOfSeedCocoonSupply}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Spun On Date")}:
                        </td>
                        <td>{seedCocoon.spunOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Spun On To Date")}:
                        </td>
                        <td>{seedCocoon.spunOnToDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Crop Number")}:
                        </td>
                        <td>{seedCocoon.cropNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Line Name")}:
                        </td>
                        <td>{seedCocoon.lineName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Cocoons Supplied in Kg")}:
                        </td>
                        <td>{seedCocoon.bedNumberOrKgsOfCocoonsSupplied}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Cocoons Supplied in Nos")}:
                        </td>
                        <td>{seedCocoon.cacoonSuppliedNumbers}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Number of pupa examined")}:
                        </td>
                        <td>{seedCocoon.numberOfPupaExamined}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Cocoon rejection details/ numbers")}:
                        </td>
                        <td>{seedCocoon.cocoonRejectionDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Invoice Date")}:
                        </td>
                        <td>{seedCocoon.invoiceDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Invoice No")}:
                        </td>
                        <td>{seedCocoon.invoiceNo}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {t("Rate Per Kg")}:
                        </td>
                        <td>{seedCocoon.ratePerKg}</td>
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

export default PreservationOfSeedCocoonForProcessingView;
