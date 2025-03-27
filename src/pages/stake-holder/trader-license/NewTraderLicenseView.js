import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";
import { Icon, Select } from "../../../components";
import NewTraderLicense from "./NewTraderLicense";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function NewTraderLicenseView() {
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
  // const [data] = useState(CasteDatas);
  const [NewTraderLicense, setNewTraderLicense] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `trader-license/get-join/${id}`)
      .then((response) => {
        setNewTraderLicense(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setNewTraderLicense({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="New Trader License View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("New Trader License View")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/issue-new-trader-license-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/issue-new-trader-license-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header>{t("New Trader License Details")}</Card.Header>
          <Card.Body>
            {loading ? (
              <h1 className="d-flex justify-content-center align-items-center">
                Loading...
              </h1>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}>{t("ID")}:</td>
                        <td>{NewTraderLicense.traderLicenseId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("ARN Number")}</td>
                        <td>{NewTraderLicense.arnNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Trader Type")}</td>
                        <td>{NewTraderLicense.traderTypeMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Name of the Applicant")}</td>
                        <td>{NewTraderLicense.firstName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Father's Name")}</td>
                        <td>{NewTraderLicense.fatherName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("state")}</td>
                        <td>{NewTraderLicense.stateName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("district")}</td>
                        <td>{NewTraderLicense.districtName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("address")}</td>
                        <td>{NewTraderLicense.address}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Premises Description")}</td>
                        <td>{NewTraderLicense.premisesDescription}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Application Date")}</td>
                        <td>{NewTraderLicense.applicationDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Application Number")}</td>
                        <td>{NewTraderLicense.applicationNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Trader License Number")}</td>
                        <td>{NewTraderLicense.traderLicenseNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Representative Details")}</td>
                        <td>{NewTraderLicense.representativeDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("License Fee")}</td>
                        <td>{NewTraderLicense.licenseFee}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("License Challan Number")}</td>
                        <td>{NewTraderLicense.licenseChallanNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Godown Details")}</td>
                        <td>{NewTraderLicense.godownDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Corresponding Silk Exchange Mahajar")}</td>
                        <td>{NewTraderLicense.silkExchangeMahajar}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Silk Type")}</td>
                        <td>{NewTraderLicense.silkType}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Market")}</td>
                        <td>{NewTraderLicense.marketMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("mobile_number")}</td>
                        <td>{NewTraderLicense.mobileNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Virtual Account Number")}</td>
                        <td>{NewTraderLicense.virtualAccountNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Branch Name")}</td>
                        <td>{NewTraderLicense.branchName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("IFSC Code")}</td>
                        <td>{NewTraderLicense.ifscCode}</td>
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

export default NewTraderLicenseView;
