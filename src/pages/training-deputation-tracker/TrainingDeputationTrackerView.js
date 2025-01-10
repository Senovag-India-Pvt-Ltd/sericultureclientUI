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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("View Training Deputation Tracker Details")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/training-deputation-tracker-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/training-deputation-tracker-list"
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
          <Card.Header>{t("Training Deputation Tracker Details")}</Card.Header>
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
                                className="ms-2"
                                onClick={() =>
                                  downloadFile(trainingDeputationTracker.fileUploadPath)
                                }
                              >
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

export default TrainingDeputationTrackerView;
