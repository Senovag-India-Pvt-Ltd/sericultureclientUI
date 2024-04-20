import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import DistrictDatas from "../../../store/masters/district/DistrictData";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function GrainageTypeView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(EducationDatas);
  const [GrainageType, setGrainageType] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setDistrict(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `grainageType/get-join/${id}`)
      .then((response) => {
        setGrainageType(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setGrainageType({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Grainage Type View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Grainage Type View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/grainage-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/grainage-type-list"
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
          <Card.Header>Grainage Type Details</Card.Header>
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
                        <td>{GrainageType.grainageTypeId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Grainage Name:</td>
                        <td>{GrainageType.grainageMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> Grainage Type Name:</td>
                        <td>{GrainageType.name}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {" "}
                          Grainage Type Name in Kannada:
                        </td>
                        <td>{GrainageType.nameInKannada}</td>
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

export default GrainageTypeView;
