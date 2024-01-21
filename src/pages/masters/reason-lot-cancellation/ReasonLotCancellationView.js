import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import axios from "axios";
import api from "../../../../src/services/auth/api";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReasonLotCancellationView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(ReasonLotCancellationDatas);
  const [ReasonLotRejectMaster, setReasonLotRejectMaster] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setReasonLotCancellation(findUser);
  // }, [id, data]);
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL + `reason-lot-reject-master/get/${id}`)
      .then((response) => {
        setReasonLotRejectMaster(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setReasonLotRejectMaster({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Reason for Lot Cancellation View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reason for Lot Cancellation View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/reason-lot-cancellation-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/reason-lot-cancellation-list"
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
        <Card className="card-gutter-md">
          <Card.Header>Reason for Lot Cancellation Details</Card.Header>
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
                        <td>{ReasonLotRejectMaster.reasonLotRejectId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {" "}
                          Reason for Lot Cancellation:
                        </td>
                        <td>{ReasonLotRejectMaster.reasonLotRejectName}</td>
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

export default ReasonLotCancellationView;
