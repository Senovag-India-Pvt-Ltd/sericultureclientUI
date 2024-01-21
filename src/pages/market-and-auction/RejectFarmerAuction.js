import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import React, { useState, useEffect } from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;


function RejectFarmerAuction() {
  const navigate = useNavigate();

  const rejectSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Rejected successfully",
      text: "Bid Number-123 has been Rejected!",
    }).then(() => {
      navigate("#");
    });
  };

  const [isActive, setIsActive] = useState(false);
  const display = () => {
    setIsActive((current) => !current);
  };

 // to get Bid Rejection
 const [bidRejectionListData, setBidRejectionListData] = useState([]);

 const getBidRejectionList = () => {
   axios
     .get(baseURL + `reason-bid-reject-master/get-all`)
     .then((response) => {
       setBidRejectionListData(response.data.content.reasonBidRejectMaster);
     })
     .catch((err) => {
       setBidRejectionListData([]);
     });
 };

 useEffect(() => {
  getBidRejectionList();
 }, []);

  return (
    <Layout title="Reject Farmer Auction">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reject Farmer Auction</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Reject Farmer Auction
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="8">
                    <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={2}>
                        FRUITS ID
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Enter FRUITS ID"
                        />
                      </Col>
                      <Col sm={4}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        >
                          Search
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className={isActive ? "" : "d-none"}>
              <Row className="g-gs">
                <Col lg="12">
                  <Card>
                    <Card.Header>Print Bidding Slip</Card.Header>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <Block>
                            <Card>
                              <div
                                className="table-responsive"
                                // style={{ paddingBottom: "30px" }}
                              >
                                <table className="table small">
                                  <thead>
                                    <tr style={{ backgroundColor: "#f1f2f7" }}>
                                      <th>Bid Number</th>
                                      <th>Market</th>
                                      <th>Godown</th>
                                      <th>Reason</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>123</td>
                                      <td>Kaveri</td>
                                      <td>Krishna</td>
                                      <td>
                                        <div>
                                          <select>
                                            <option value="0">
                                              Select Reason
                                            </option>
                                            {bidRejectionListData.map(
                                              (list) => (
                                                <option
                                                  key={list.reasonBidRejectId}
                                                  value={list.reasonBidRejectId}
                                                >
                                                  {list.reasonBidRejectName}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        </div>
                                      </td>
                                      <td>
                                        <div>
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => rejectSuccess()}
                                            className="ms-2"
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </Card>
                          </Block>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                  {/* <div className="gap-col mt-4">
                    <ul className="d-flex align-items-center justify-content-center gap g-3">
                      <li>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => rejectSuccess()}
                        >
                          Reject Lot
                        </Button>
                      </li>
                    </ul>
                  </div> */}
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default RejectFarmerAuction;
