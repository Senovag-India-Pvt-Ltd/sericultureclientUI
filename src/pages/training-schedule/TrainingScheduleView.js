import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TrainingScheduleView() {
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
  const [trainingSchedule, setTrainingSchedule] = useState({});
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `trSchedule/get-join/${id}`)
      .then((response) => {
        setTrainingSchedule(response.data.content);
        if (response.data.content.trUploadPath) {
          getPPtFile(response.data.content.trUploadPath);
        }
        setLoading(false);
      })
      .catch((err) => {
        setTrainingSchedule({});
        setLoading(false);
      });
  };

  const [trainerUserList, setTrainerUserList] = useState([]);
  const getTrainerUserList = () => {
    api
      .get(baseURL + `trainingScheduleUser/get-by-tr-schedule-id-join/${id}`)
      .then((response) => {
        setTrainerUserList(response.data.content.trainingScheduleUser);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setTrainerUserList([]);
        // editError(message);
      });
  };
  useEffect(() => {
    getIdList();
    getTrainerUserList();
  }, [id]);

  // To get Photo
  const [selectedPPtFile, setSelectedPPtFile] = useState(null);

  const getPPtFile = async (file) => {
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
      setSelectedPPtFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  //console.log(Caste);

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
    <Layout title={t("View Scheduled Training and Trainer Details")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("View Scheduled Training and Trainer Details")}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/training-schedule-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/training-schedule-list"
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
          <Card.Header>{t("Scheduled Training Details")}</Card.Header>
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
                        <td>{trainingSchedule.trScheduleId}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>Training Institution:</td>
                        <td>{trainingSchedule.trInstitutionMasterName}</td>
                      </tr> */}
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Group")}:</td>
                        <td>{trainingSchedule.trGroupMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Program")}:</td>
                        <td>{trainingSchedule.trProgramMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Course")}:</td>
                        <td>{trainingSchedule.trCourseMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Mode Master")}:</td>
                        <td>{trainingSchedule.trModeMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Duration")}:</td>
                        <td>{trainingSchedule.trDuration}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Period")}:</td>
                        <td>{trainingSchedule.trPeriod}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("No Of Participant")}:</td>
                        <td>{trainingSchedule.trNoOfParticipant}</td>
                      </tr>
                       <tr>
                        <td style={styles.ctstyle}>{t("District")}:</td>
                        <td>{trainingSchedule.districtName}</td>
                      </tr>
                       <tr>
                        <td style={styles.ctstyle}>{t("Taluk")}:</td>
                        <td>{trainingSchedule.talukName}</td>
                      </tr>
                       <tr>
                        <td style={styles.ctstyle}>{t("Place")}:</td>
                        <td>{trainingSchedule.place}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Training Start Date")}:</td>
                        <td>{formatDate(trainingSchedule.trStartDate)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Date Of Completion")}:</td>
                        <td>
                          {formatDate(trainingSchedule.trDateOfCompletion)}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Uploaded Pdf/PPt/Video")}:</td>
                        <td>
                          {" "}
                          {selectedPPtFile && (
                            <>
                              <img
                                style={{
                                  height: "100px",
                                  width: "100px",
                                }}
                                src={selectedPPtFile}
                                alt={t("Selected File")}
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                className="ms-2"
                                onClick={() =>
                                  downloadFile(trainingSchedule.trUploadPath)
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

        <Card className="mt-3">
          <Card.Header>{t("Trainers List")}</Card.Header>
          <Card.Body>
            {trainerUserList && trainerUserList.length > 0
              ? trainerUserList.map((trainerUser) => (
                  <Row className="g-gs">
                    {console.log(trainerUser.trainingScheduleUserId)}
                    <Col lg="4">
                      <table className="table small table-bordered">
                        <tbody>
                          <tr>
                            <td style={styles.ctstyle}>
                              {t("Training Schedule User ID")}:
                            </td>
                            <td>{trainerUser.trainingScheduleUserId}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {t("Training Schedule Id")}:
                            </td>
                            <td>{trainerUser.trScheduleId}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("User Name")}:</td>
                            <td>{trainerUser.username}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>{t("Institution Name")}:</td>
                            <td>{trainerUser.trInstitutionMasterName}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                ))
              : ""}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default TrainingScheduleView;
