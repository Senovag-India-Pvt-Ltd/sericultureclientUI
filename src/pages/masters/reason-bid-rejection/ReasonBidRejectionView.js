import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import axios from "axios";
import ReasonBidRejectionDatas from "../../../store/masters/reason-bid-rejection/ReasonBidRejectionData";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReasonBidRejectionView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(ReasonLotCancellationDatas);
  const [ReasonBidRejectMaster, setReasonBidRejectMaster] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setReasonBidRejection(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    axios
      .get(baseURL + `reason-bid-reject-master/get/${id}`)
      .then((response) => {
        setReasonBidRejectMaster(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setReasonBidRejectMaster({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="Reason for Bid Rejection View" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reason for Bid Rejection View</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/reason-bid-rejection">
                    Reason for Bid Rejection List
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Reason for Bid Rejection View
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/reason-bid-rejection-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/reason-bid-rejection-list"
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

      <Block className="mt-4">
        <Card className="card-gutter-md">
          <Card.Header>Reason for Bid Rejection Details</Card.Header>
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
                        <td>{ReasonBidRejectMaster.reasonBidRejectId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          {" "}
                          Reason for Bid Rejection:
                        </td>
                        <td>{ReasonBidRejectMaster.reasonBidRejectName}</td>
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

export default ReasonBidRejectionView;
