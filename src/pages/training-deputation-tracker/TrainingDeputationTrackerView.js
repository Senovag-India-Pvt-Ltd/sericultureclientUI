import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link,useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import {
  Icon,
  Select,
} from "../../components";
import TrainingDeputationTracker from "./TrainingDeputationTracker";

// const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TrainingDeputationTrackerView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [trainingDeputationTracker, setTrainingDeputationTracker] = useState({});
  const [loading, setLoading] = useState(false);

  // grabsthe id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `trainingDeputationTracker/get-join/${id}`)
      .then((response) => {
        setTrainingDeputationTracker(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setTrainingDeputationTracker({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Training Deputation Tracker View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Training Deputation Tracker View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/training-deputation-tracker-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/training-deputation-tracker-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header>Training Deputation Tracker Details</Card.Header>
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
                        <td style={styles.ctstyle}>ID:</td>
                        <td>{trainingDeputationTracker.trainingDeputationId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Official Name:</td>
                        <td>{trainingDeputationTracker.officialName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Designation:</td>
                        <td>{trainingDeputationTracker.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Official Address:</td>
                        <td>{trainingDeputationTracker.officialAddress}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Mobile Number:</td>
                        <td>{trainingDeputationTracker.mobileNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Deputed Institute:</td>
                        <td>{trainingDeputationTracker.deputedInstituteName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Deputed From Date:</td>
                        <td>{trainingDeputationTracker.deputedFromDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Deputed To Date:</td>
                        <td>{trainingDeputationTracker.deputedToDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Training Program:</td>
                        <td>{trainingDeputationTracker.trProgramMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Training Course:</td>
                        <td>{trainingDeputationTracker.trCourseMasterName}</td>
                      </tr>
                      <tr>
                      <td style={styles.ctstyle}> Attended:</td>
                      <td>
                        {trainingDeputationTracker.deputedAttended === 1
                          ? 'Yes'
                          : trainingDeputationTracker.deputedAttended === 2
                          ? 'No'
                          : 'Other'
                          }
                      </td>
                    </tr>
                      <tr>
                        <td style={styles.ctstyle}>Remarks:</td>
                        <td>{trainingDeputationTracker.deputedRemarks}</td>
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
