import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import CasteDatas from "../../../store/masters/caste/CasteData";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function BudgetDistrictExtensionView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id,types } = useParams();
  // const [data] = useState(CasteDatas);
  const [budgetDistrictData, setBudgetDistrictData] = useState({});
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState({
    budgetType: types,
  });

  const getIdList = () => {
    setLoading(true);
    if (type.budgetType === "allocate") {
      api
      .get(baseURLTargetSetting + `tsBudgetDistrictExt/get-join/${id}`)
      .then((response) => {
        setBudgetDistrictData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setBudgetDistrictData({});
        setLoading(false);
      });
    }
    if (type.budgetType === "release") {
      api
      .get(baseURLTargetSetting + `tsReleaseBudgetDistrictExt/get-join/${id}`)
      .then((response) => {
        setBudgetDistrictData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setBudgetDistrictData({});
        setLoading(false);
      });
    }
  };
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

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="View District Budget mapping scheme and programs">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              View District Budget mapping scheme and programs
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budgetdistrictextension-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budgetdistrictextension-list"
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
          <Card.Header>
            District Budget mapping scheme and programs View Details
          </Card.Header>
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
                        <td style={styles.ctstyle}>Financial Year:</td>
                        <td>
                          <span>{budgetDistrictData.financialYear}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> District Name:</td>
                        <td>{budgetDistrictData.districtName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Budget Amount:</td>
                        <td>
                          <span>{budgetDistrictData.budgetAmount}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Scheme:</td>
                        <td>
                          <span>{budgetDistrictData.budgetScheme}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Sub Scheme:</td>
                        <td>
                          <span>{budgetDistrictData.budgetSubScheme}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Category:</td>
                        <td>
                          <span>{budgetDistrictData.budgetCategory}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date:</td>
                        <td>
                          <span>{dateFormatter(budgetDistrictData.date)}</span>
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

export default BudgetDistrictExtensionView;