import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function RearingOfDFLsForThe8LinesView() {
  const { t } = useTranslation();
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    const date = new Date(dateString); 
    return format(date, 'dd/MM/yyyy'); 
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [rearing8Lines, setRearing8Lines] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `8linesController/get-info-by-id/${id}`)
      .then((response) => {
        setRearing8Lines(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setRearing8Lines({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("View Rearing of DFLs for the 8 lines Details")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("View Rearing of DFLs for the 8 lines Details")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Rearing-of-DFLs-for-the-8-Lines-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Rearing-of-DFLs-for-the-8-Lines-List"
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
          <Card.Header style={{ fontWeight: "bold" }}>{t("Rearing of DFLs for the 8 lines Details")}</Card.Header>
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
                        <td style={styles.ctstyle}>ID:</td>
                        <td>{rearing8Lines.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Disinfectant Usage Details")}:</td>
                        <td>{rearing8Lines.disinfectantMasterName}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>Crop Details:</td>
                        <td>{rearing8Lines.cropDetail}</td>
                      </tr> */}
                      <tr>
                        <td style={styles.ctstyle}>{t("Crop Number")}:</td>
                        <td>{rearing8Lines.cropNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Lot Number")}:</td>
                        <td>{rearing8Lines.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Number Of DFLs")}:</td>
                        <td>{rearing8Lines.numberOfDFLs}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Laid On Date")}:</td>
                        <td>{formatDate(rearing8Lines.laidOnDate)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Cold Storage Details")}:</td>
                        <td>{rearing8Lines.coldStorageDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Released On")}:</td>
                        <td>{formatDate(rearing8Lines.releasedOnDate)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Chawki Percentage")}:</td>
                        <td>{rearing8Lines.chawkiPercentage}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Worm Weight In Grams")}:</td>
                        <td>{rearing8Lines.wormWeightInGrams}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Spun on date(From)")}:</td>
                        <td>{formatDate(rearing8Lines.spunOnDate)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Worm Test Results")}:</td>
                        <td>{rearing8Lines.wormTestDatesAndResults}</td>
                      </tr>
                      
                      <tr>
                        <td style={styles.ctstyle}>{t("Crop Failure Details")}:</td>
                        <td>{rearing8Lines.cropFailureDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Low Yield")}:</td>
                        <td>{rearing8Lines.lowYield}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Failed Eggs")}:</td>
                        <td>{rearing8Lines.failedEggs}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>{t("Cocoon Produced in NOs")}:</td>
                        <td>{rearing8Lines.cocoonAssessmentDetails}</td>
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

export default RearingOfDFLsForThe8LinesView;
