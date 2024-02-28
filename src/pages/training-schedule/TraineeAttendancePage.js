import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col,Form, Button } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DatePicker from "react-datepicker";
import api from "../../services/auth/api";
import Swal from "sweetalert2";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TraineeAttendancePage() {
  const { id } = useParams();
  const [trDetailsList, setTrDetailsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    trainingDate: "",
    trScheduleId: "",
    isPresent:"",
    trTraineeId: "",
  });

  const [validated, setValidated] = useState(false);

  const getTrDetailsList = () => {
    api
      .get(baseURL2 + `trTrainee/get-by-tr-schedule-id-join/${id}`)
      .then((response) => {
        setTrDetailsList(response.data.content.trTrainee);
      })
      .catch((err) => {
        setTrDetailsList([]);
      });
  };

  useEffect(() => {
    getTrDetailsList();
  }, [id]);

  const [trTraineeList,setTrTraineeList] = useState([])
  const handleCheckBox = (e, trTrainee) => {
    const isChecked = e.target.checked;
    if(isChecked){
        setTrTraineeList((prev=>
            [...prev,trTrainee]
        ))
    }else{
       setTrTraineeList((prev)=>prev.filter(item=>item.trTraineeId !== trTrainee.trTraineeId))
    }
   
  };

  // console.log(trTraineeList);

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      trTraineeList.forEach(i=>{
        api
        .post(baseURL2 + `trTrainingAttendance/add`, {trScheduleId:id,trainingDate:data.trainingDate,isPresent:true,trTraineeId:i.trTraineeId})
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                trainingDate: "",
                trScheduleId: "",
                isPresent: "",
                trTraineeId: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
        //   if (Object.keys(err.response.data.validationErrors).length > 0) {
        //     saveError(err.response.data.validationErrors);
        //   }
        const validationErrors = err.response?.data?.validationErrors; // Using optional chaining to safely access nested properties
        if (validationErrors && Object.keys(validationErrors).length > 0) {
          saveError(validationErrors);
        }
        });
      setValidated(true);

      })
     
    }
  };


  const clear = () => {
    setData({
      trainingDate: "",
      trScheduleId: "",
      isPresent: "",
      trTraineeId: "",
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Attendance Updated Successfully",
    });
  };

  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  return (
    <Layout title="Trainee Attendance Page">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Trainee Attendance Page</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/trainer-page-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/trainer-page-list"
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
                <Card className="mt-3">
                <Card.Header>Trainees</Card.Header>
                <Card.Body>

                <Col lg="6">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label> Date</Form.Label>
                      <Row>
                        <Col lg="6">
                          <div className="form-control-wrap">
                            <DatePicker
                              selected={data.trainingDate}
                              onChange={(date) =>
                                handleDateChange(date, "trainingDate")
                              }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                            />
                          </div>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
            {trDetailsList && trDetailsList.length > 0 ? (
              trDetailsList.map((trDetails) => (
                <Row className="g-gs" key={trDetails.trTraineeId}>
                  <Col lg="12">
                    <table className="table small table-bordered">
                      <tbody>
                        <tr>
                          <td style={styles.ctstyle}>Trainee Name:</td>
                          <td>
                            <input
                              type="checkbox"
                              id={trDetails.trTraineeId}
                              name={trDetails.trTraineeId}
                              value={trDetails.trTraineeName} 
                              onChange={(e) =>
                                handleCheckBox(e, trDetails)
                              }
                            />
                            <label
                              htmlFor={trDetails.trTraineeId}
                              style={{ marginLeft: "5px" }}
                            >
                              {trDetails.trTraineeName}
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              ))
            ) : (
              <p>No trainees available.</p>
            )}
          </Card.Body>
        </Card>

        <div className="gap-col">
          <ul className="d-flex align-items-center justify-content-center gap g-3">
            <li>
              <Button type="button" variant="primary" onClick={postData}>
                Submit
              </Button>
            </li>
            <li>
              <Button type="button" variant="secondary" onClick={clear}>
                Cancel
              </Button>
            </li>
          </ul>
        </div>
      </Block>
    </Layout>
  );
}

export default TraineeAttendancePage;
