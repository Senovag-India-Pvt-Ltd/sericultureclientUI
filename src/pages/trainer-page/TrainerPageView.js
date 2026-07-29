import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col,Button} from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import api from "../../services/auth/api";
import { format } from 'date-fns';

const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;
// const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TrainerPageView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  const [trTrainer, setTrTrainer] = useState({});
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    const date = new Date(dateString); 
    return format(date, 'dd/MM/yyyy'); 
  };

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL2 + `trSchedule/get-join/${id}`)
      .then((response) => {
        setTrTrainer(response.data.content);
        if (response.data.content.trUploadPath) {
          getPPtFile(response.data.content.trUploadPath);
        }
        setLoading(false);
      })
      .catch((err) => {
        setTrTrainer({});
        setLoading(false);
      });
  };

  const [trDetailsList, setTrDetailsList] = useState([]);
  const getTrDetailsList = () => {
    api
      .get(baseURL2 + `trTrainee/get-by-tr-schedule-id-join/${id}`)
      .then((response) => {
        setTrDetailsList(response.data.content.trTrainee);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setTrDetailsList([]);
        // editError(message);
      });
  };

  // To get Photo
  const [selectedPPtFile, setSelectedPPtFile] = useState(null);

  const getPPtFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
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

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
    getTrDetailsList();
  }, [id]);

  const navigate = useNavigate();
  const handleEdit = (_id) => {
    navigate(`/seriui/trainer-page-edit/${_id}`);
  };

  const downloadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
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
    <Layout title="View Scheduled Training and Trainee Details">
      <style>{trainerPageViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                View Scheduled Training and Trainee Details
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/trainer-page-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/trainer-page-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
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
            <span>Scheduled Training Details</span>
          </Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Schedule ID:</td>
                      <td>{trTrainer.trScheduleId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Stake Holder Type:</td>
                      <td>
                        {trTrainer.trStakeholderType === 1
                          ? "Training For Internal Stake Holders"
                          : trTrainer.trStakeholderType === 2
                          ? "Training For External Stake Holders"
                          : "Other"}
                      </td>
                    </tr>
                    {/* <tr>
                      <td style={styles.ctstyle}>User Name:</td>
                      <td>{trTrainer.username}</td>
                    </tr> */}
                    <tr>
                      <td style={styles.ctstyle}>Institute Name:</td>
                      <td>{trTrainer.trInstitutionMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Group Name:</td>
                      <td>{trTrainer.trGroupMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Program:</td>
                      <td>{trTrainer.trProgramMasterName}</td>
                    </tr>

                    <tr>
                      <td style={styles.ctstyle}>Course Name:</td>
                      <td>{trTrainer.trCourseMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Training Mode:</td>
                      <td>{trTrainer.trModeMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Start Date:</td>
                      <td>{formatDate(trTrainer.trStartDate)}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Date Of Completion:</td>
                      <td>{formatDate(trTrainer.trDateOfCompletion)}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Duration:</td>
                      <td>{trTrainer.trDuration}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Period:</td>
                      <td>{trTrainer.trPeriod}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>No of Participant:</td>
                      <td>{trTrainer.trNoOfParticipant}</td>
                    </tr>
                    <tr>
                        <td style={styles.ctstyle}> Uploaded Pdf/PPt/Video:</td>
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
                                alt="Selected File"
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
                                onClick={() =>
                                  downloadFile(trTrainer.trUploadPath)
                                }
                              >
                                <Icon name="download" />
                                Download File
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                  </tbody>
                </table>
                <Button
                variant="primary"
                size="sm"
                className="ms-2 sh-save-btn"
                onClick={() => handleEdit(trTrainer.trScheduleId)}
              >
                <Icon name="activity-round" />
                <span>Start Training</span>
              </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header className="sh-section-header">
            <Icon name="user-list" />
            <span>Trainee Details</span>
          </Card.Header>
          <Card.Body>
           
            {trDetailsList && trDetailsList.length > 0
              ? trDetailsList.map((trDetails) => (
                  <Row className="g-gs">
                    {console.log(trDetails.trTraineeId)}
                    <Col lg="12">
                      <table className="table small table-bordered">
                        <tbody>
                          <tr>
                            <td style={styles.ctstyle}> ID:</td>
                            <td>{trDetails.trTraineeId}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Schedule ID:</td>
                            <td>{trDetails.trScheduleId}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {" "}
                              Training Trainee Name:
                            </td>
                            <td>{trDetails.trTraineeName}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Designation:</td>
                            <td>{trDetails.name}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Office Name:</td>
                            <td>{trDetails.trOfficeName}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Gender:</td>
                            <td>
                              {trDetails.gender === 1
                                ? "Male"
                                : trDetails.gender === 2
                                ? "Female"
                                : "Other"}
                            </td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Mobile Number:</td>
                            <td>{trDetails.mobileNumber}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Place:</td>
                            <td>{trDetails.place}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>State:</td>
                            <td>{trDetails.stateName}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>District:</td>
                            <td>{trDetails.districtName}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Taluk:</td>
                            <td>{trDetails.talukName}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Hobli:</td>
                            <td>{trDetails.hobliName}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Village:</td>
                            <td>{trDetails.villageName}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Pre Test Score:</td>
                            <td>{trDetails.preTestScore}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Post Test Score:</td>
                            <td>{trDetails.postTestScore}</td>
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Percentage Improved:</td>
                            <td>{trDetails.percentageImproved}</td>
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

const trainerPageViewStyles = `
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
    margin-bottom: 18px;
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
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.25);
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

export default TrainerPageView;
