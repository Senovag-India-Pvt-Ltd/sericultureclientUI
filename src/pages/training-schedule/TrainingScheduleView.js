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

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
// const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TrainingScheduleView() {
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

  // grabsthe id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `trSchedule/get-join/${id}`)
      .then((response) => {
        setTrainingSchedule(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setTrainingSchedule({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Training Schedule View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Training Schedule View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/training-schedule-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/training-schedule-list"
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
          <Card.Header>Training Schedule Details</Card.Header>
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
                        <td>{trainingSchedule.trScheduleId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>User Name:</td>
                        <td>{trainingSchedule.username}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Training Institution:</td>
                        <td>{trainingSchedule.trInstitutionMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Training Group:</td>
                        <td>{trainingSchedule.trGroupMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Training Program:</td>
                        <td>{trainingSchedule.trProgramMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Training Course:</td>
                        <td>{trainingSchedule.trCourseMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Training Mode Master:</td>
                        <td>{trainingSchedule.trModeMasterId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Training Duration:</td>
                        <td>{trainingSchedule.trDuration}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Training Period:</td>
                        <td>{trainingSchedule.trPeriod}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>No Of Participant:</td>
                        <td>{trainingSchedule.trNoOfParticipant}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Upload:</td>
                        <td>{trainingSchedule.trUploadPath}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Training Start Date:</td>
                        <td>{trainingSchedule.trStartDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date Of Completion:</td>
                        <td>{trainingSchedule.trDateOfCompletion}</td>
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

export default TrainingScheduleView;
