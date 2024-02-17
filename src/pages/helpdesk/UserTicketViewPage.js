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

const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function UserTicketView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [raiseTicket, setRaiseTicket] = useState({});
  const [loading, setLoading] = useState(false);

  // grabsthe id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `hdTicket/get-join/${id}`)
      .then((response) => {
        setRaiseTicket(response.data.content);
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
  const handleListInput = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setRaiseTicket({ ...raiseTicket, [name]: value });
  };

  return (
    <Layout title="View User Ticket Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">View User Ticket Details</Block.Title>
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
                      <tr>
                        <td style={{ ...styles.ctstyle, fontWeight: "bold" }}>
                          Solution:
                        </td>
                        <td style={{ fontWeight: "bold", color: "green" }}>
                          {raiseTicket.solution}
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

export default UserTicketView;
