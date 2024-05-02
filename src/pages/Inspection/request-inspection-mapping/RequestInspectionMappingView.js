import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import CasteDatas from "../../../store/masters/caste/CasteData";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function RequestInspectionMappingView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [budgetData, setBudgetData] = useState({});
  const [loading, setLoading] = useState(false);

  // Date Formate
  const dateFormatter = (date) => {
    if (date) {
      return (
        new Date(date).getDate().toString().padStart(2, "0") +
        "-" +
        (new Date(date).getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date(date).getFullYear()
      );
    } else {
      return "";
    }
  };

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLMasterData + `tsBudget/get/${id}`)
      .then((response) => {
        setBudgetData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setBudgetData({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Request Inspection Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Request Inspection Mapping</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/requestinspectionmapping-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/requestinspectionmapping-list"
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
          <Card.Header>Budget View Details</Card.Header>
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
                        <td style={styles.ctstyle}> Request Type:</td>
                        <td>{budgetData.requesttype}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Inspection Type:</td>
                        <td>
                          <span>{budgetData.inspectiontype}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Request Type Name:</td>
                        <td>
                          <span>{budgetData.requesttypename}</span>
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

export default RequestInspectionMappingView;
