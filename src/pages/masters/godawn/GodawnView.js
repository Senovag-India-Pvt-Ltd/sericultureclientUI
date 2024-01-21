import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import GodawnDatas from "../../../store/masters/godawn/GodawnData";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function GodawnView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(LandCategoryDatas);
  const [Godawn, setGodawn] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setGodawn(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `godown/get-join/${id}`)
      .then((response) => {
        setGodawn(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setGodawn({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Godown View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Godown View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/godawn-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/godawn-list"
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

      <Block className= "mt-n4">
        <Card>
        <Card.Header>Godown Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> ID:</td>
                      <td>{Godawn.godownId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Market:</td>
                      <td>{Godawn.marketMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Godown name:</td>
                      <td>{Godawn.godownName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Godown name In Kannada:</td>
                      <td>{Godawn.godownNameInKannada}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default GodawnView;
