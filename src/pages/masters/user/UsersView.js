import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function UsersView() {
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
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `userMaster/get-join/${id}`)
      .then((response) => {
        console.log(response);
        setUser(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setUser({});
        setLoading(false);
      });
  };

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="User View">
      <style>{usersViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("User View")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/users-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/users-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <Card.Header className="sh-section-header">
            <Icon name="eye" />
            <span>{t("User Details")}</span>
          </Card.Header>
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
                        <td style={styles.ctstyle}>{t("ID")}</td>
                        <td>{user.userMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("User Name")}</td>
                        <td>{user.username}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> {t("First Name")}</td>
                        <td>{user.firstName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Middle Name")}</td>
                        <td>{user.middleName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Last Name")}</td>
                        <td>{user.lastName}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>Password:</td>
                        <td>{user.password}</td>
                      </tr> */}
                      <tr>
                        <td style={styles.ctstyle}> {t("Email")}</td>
                        <td>{user.emailID}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Mobile Number")}</td>
                        <td>{user.phoneNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Designation")}</td>
                        <td>{user.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("state")}</td>
                        <td>{user.stateName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("district")}</td>
                        <td>{user.districtName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("taluk")}</td>
                        <td>{user.talukName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Role")}</td>
                        <td>{user.roleName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Market")}</td>
                        <td>{user.marketMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Working Institution")}</td>
                        <td>{user.workingInstitutionName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("tsc")} </td>
                        <td>{user.tscName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("DDO Code")}</td>
                        <td>{user.ddoCode}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Division Name")}</td>
                        <td>{user.nameInKannada}</td>
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

const usersViewStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-form-wrap table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-form-wrap table tbody tr:hover {
    background-color: #f7faff !important;
  }
`;

export default UsersView;
