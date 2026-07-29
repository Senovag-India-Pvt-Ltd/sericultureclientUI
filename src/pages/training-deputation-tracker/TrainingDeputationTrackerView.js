import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import { format } from 'date-fns';
import TrainingDeputationTracker from "./TrainingDeputationTracker";
import { useTranslation } from 'react-i18next';

// const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TrainingDeputationTrackerView() {
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
  const [trainingDeputationTracker, setTrainingDeputationTracker] = useState(
    {}
  );
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    const date = new Date(dateString); 
    return format(date, 'dd/MM/yyyy'); 
  };

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `trainingDeputationTracker/get-join/${id}`)
      .then((response) => {
        setTrainingDeputationTracker(response.data.content);
        if (response.data.content.fileUploadPath) {
          getUploadedFile(response.data.content.fileUploadPath);
        }
        setLoading(false);
      })
      .catch((err) => {
        setTrainingDeputationTracker({});
        setLoading(false);
      });
  };

  // To get Photo
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);

  const getUploadedFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedUploadFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  const downloadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);

      const fileExtension = file.split(".").pop();

      const link = document.createElement("a");
      link.href = url;

      const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

      link.download = modifiedFileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  return (
    <Layout title={t("View Training Deputation Tracker Details")}>
      <style>{trainingDeputationTrackerViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("View Training Deputation Tracker Details")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/training-deputation-tracker-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/training-deputation-tracker-list"
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
            <span>{t("Training Deputation Tracker Details")}</span>
          </Card.Header>
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
                        <td>
                          {trainingDeputationTracker.trainingDeputationId}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Official Name")}:</td>
                        <td>{trainingDeputationTracker.officialName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Designation")}:</td>
                        <td>{trainingDeputationTracker.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Official Address")}:</td>
                        <td>{trainingDeputationTracker.officialAddress}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Mobile Number")}:</td>
                        <td>{trainingDeputationTracker.mobileNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Deputed Institute Details")}:</td>
                        <td>
                          {trainingDeputationTracker.deputedInstitute}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Deputed From Date")}:</td>
                        <td>{formatDate(trainingDeputationTracker.deputedFromDate)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Deputed To Date")}:</td>
                        <td>{formatDate(trainingDeputationTracker.deputedToDate)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Program")}:</td>
                        <td>{trainingDeputationTracker.trProgramMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Course")}:</td>
                        <td>{trainingDeputationTracker.trCourseMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Attended")}:</td>
                        <td>
                          {trainingDeputationTracker.deputedAttended === 1
                            ? t("Yes")
                            : trainingDeputationTracker.deputedAttended === 2
                            ? t("No")
                            : t("Other")}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Remarks")}:</td>
                        <td>{trainingDeputationTracker.deputedRemarks}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Uploaded Pdf/PPt/Video")}:</td>
                        <td>
                          {" "}
                          {selectedUploadFile && (
                            <>
                              <img
                                style={{
                                  height: "100px",
                                  width: "100px",
                                }}
                                src={selectedUploadFile}
                                alt={t("Selected File")}
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
                                onClick={() =>
                                  downloadFile(trainingDeputationTracker.fileUploadPath)
                                }
                              >
                                <Icon name="download" />
                                {t("Download File")}
                              </Button>
                            </>
                          )}
                        </td>
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

const trainingDeputationTrackerViewStyles = `
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

export default TrainingDeputationTrackerView;
