import { Card, Form, Row, Col, Button, CardBody } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import HelpDeskFaqView from "../../pages/helpdesk/HelpDeskFaqView";
import HelpDeskFaqComponent from "./HelpDeskFaqComponent";
import Swal from "sweetalert2";

const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function RaiseTicketView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [raiseTicket, setRaiseTicket] = useState({
    solution: "",
    hdSeverityId: "",
  });
  const [loading, setLoading] = useState(false);

  // grabsthe id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL + `hdTicket/get-join/${id}`)
      .then((response) => {
        setRaiseTicket((prev) => ({ ...prev, ...response.data.content }));
        setLoading(false);
      })
      .catch((err) => {
        setRaiseTicket({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  //   const handleListInput = (e, row) => {
  //     // debugger;
  //     let { name, value } = e.target;
  //     const updatedRow = { ...row, [name]: value };
  //     const updatedDataList = raiseTicket.map((rowData) =>
  //       rowData.hdTicketId === row.hdTicketId ? updatedRow : rowData
  //     );
  //     setRaiseTicket(updatedDataList);
  //   };

  let name, value;
  const handleInput = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setRaiseTicket({ ...raiseTicket, [name]: value });
  };

  // to get Severity
  const [severityListData, setSeverityListData] = useState([]);

  const getSeverityList = () => {
    api
      .get(baseURLMaster + `hdSeverityMaster/get-all`)
      .then((response) => {
        setSeverityListData(response.data.content.hdSeverityMaster);
      })
      .catch((err) => {
        setSeverityListData([]);
      });
  };

  useEffect(() => {
    getSeverityList();
  }, []);

  // to get Status
  const [hdStatusListData, setHdStatusListData] = useState([]);

  const getStatusList = () => {
    api
      .get(baseURLMaster + `hdStatusMaster/get-all`)
      .then((response) => {
        setHdStatusListData(response.data.content.hdStatusMaster);
      })
      .catch((err) => {
        setHdStatusListData([]);
      });
  };

  useEffect(() => {
    getStatusList();
  }, []);

  // Submit
  const submit = () => {
    const { solution, hdSeverityId, hdTicketId } = raiseTicket;
    api
      .post(baseURL + `hdTicket/edit`, {
        ...raiseTicket,
        hdTicketId,
        solution,
        hdSeverityId,
      })
      .then((response) => {
        saveSuccess();
        setRaiseTicket({
          solution: "",
          hdSeverityId: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [show, setShow] = useState(false);
  const displaySeverity = () => {
    setShow((prev) => !prev);
  };

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Solution sent to User",
      // text: "You clicked the button!",
    });
  };

  return (
    <Layout title="View Raised Ticket Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">View Raised Ticket Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/help-desk"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/help-desk"
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
          <Card.Header>View Raised Ticket Details</Card.Header>
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
                        <td>{raiseTicket.hdTicketId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Module Name:</td>
                        <td>{raiseTicket.hdModuleName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Feature:</td>
                        <td>{raiseTicket.hdFeatureName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Broad Category:</td>
                        <td>{raiseTicket.hdBoardCategoryName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Category:</td>
                        <td>{raiseTicket.hdCategoryName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Sub Category:</td>
                        <td>{raiseTicket.hdSubCategoryName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Users Affected:</td>
                        <td>{raiseTicket.hdUsersAffected}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Query:</td>
                        <td>{raiseTicket.query}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Query Details:</td>
                        <td>{raiseTicket.queryDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Ticket Number:</td>
                        <td>{raiseTicket.ticketNumber}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}>Status:</td>
                        <td>
                            <div className="text-start w-100">
                            <Form.Group className="form-group">
                                <div className="form-control-wrap">
                                <Form.Select
                                    name="hdStatusId"
                                    value={raiseTicket.hdStatusId}
                                    onChange={(e) => handleListInput(e, raiseTicket)}
                                    // onBlur={() => handleInputs}
                                >
                                    <option value="">Select Status</option>
                                    {hdStatusListData.map((list) => (
                                    <option key={list.hdStatusId} value={list.hdStatusId}>
                                        {list.hdStatusName}
                                    </option>
                                    ))}
                                </Form.Select>
                                </div>
                            </Form.Group>
                            </div>
                        </td>
                        </tr>

                        <tr>
                        <td style={styles.ctstyle}>Severity:</td>
                        <td>
                            <div className="text-start w-100">
                            <Form.Group className="form-group">
                                <div className="form-control-wrap">
                                <Form.Select
                                    name="hdSeverityId"
                                    value={raiseTicket.hdSeverityId}
                                    onChange={(e) => handleListInput(e, raiseTicket)}
                                    // onBlur={() => handleInputs}
                                >
                                    <option value="">Select Severity</option>
                                    {severityListData.map((list) => (
                                    <option key={list.hdSeverityId} value={list.hdSeverityId}>
                                        {list.hdSeverityName}
                                    </option>
                                    ))}
                                </Form.Select>
                                </div>
                            </Form.Group>
                            </div>
                        </td>
                        </tr> */}
                    </tbody>
                  </table>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Block>
      <Block className="mt-2">
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between">
              <div>solution</div>
              <div style={{ cursor: "pointer" }} onClick={displaySeverity}>
                <Icon name="view-row-wd"></Icon>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="4">
                <Form.Group className="form-group">
                  <div className="form-control-wrap">
                    <Form.Select
                      name="hdStatusId"
                      value={raiseTicket.hdStatusId}
                      onChange={() => handleInput}
                      disabled
                      // onBlur={() => handleInputs}
                    >
                      <option value="">Select Status</option>
                      {hdStatusListData.map((list) => (
                        <option key={list.hdStatusId} value={list.hdStatusId}>
                          {list.hdStatusName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              {show ? (
                <Col lg="4">
                  <Form.Group className="form-group">
                    <div className="form-control-wrap">
                      <Form.Select
                        name="hdSeverityId"
                        value={raiseTicket.hdSeverityId}
                        onChange={() => handleInput}
                        // onBlur={() => handleInputs}
                      >
                        <option value="">Select Severity</option>
                        {severityListData.map((list) => (
                          <option
                            key={list.hdSeverityId}
                            value={list.hdSeverityId}
                          >
                            {list.hdSeverityName}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
              ) : (
                ""
              )}
            </Row>
            <Row className="mt-2">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="solution">Solution</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="solution"
                      name="solution"
                      value={raiseTicket.solution}
                      onChange={handleInput}
                      // type="text"
                      as="textarea"
                      rows={4}
                      placeholder="Enter Solutions"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <div className="gap-col">
                <ul className="d-flex align-items-center justify-content-start gap g-3 mt-3">
                  <li>
                    <Button type="button" variant="primary" onClick={submit}>
                      Submit
                    </Button>
                  </li>
                </ul>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Block>
      <Block className="mt-2">
        <Card>
          <Card.Body>
            <HelpDeskFaqComponent />
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default RaiseTicketView;
