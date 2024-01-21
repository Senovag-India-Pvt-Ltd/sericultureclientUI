import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { Icon } from "../../../components";
import React from "react";
import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";

function AcceptBid() {

const [data, setData] = useState({});

// const [acceptBidListData, setAcceptBidListData] = useState([]);
// const handleInputs = (e) => {
//   };
  
  const display = () => {
    // Define the display function logic here
    console.log("Displaying data");
    // Add your logic here
  };
  
  const handleDateChange = (newDate) => {
    setData({ ...data, marketAuctionDate: newDate });
  };


  return (
    <Layout title="Bid Acceptance">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Bid Acceptance</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item"><Link to="/crm/case-task">Subsidy Verification List</Link></li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  List
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      
      <Block className="mt-4">
        <Form action="#">
            <Row className="g-3">
                <Card>
                <Card.Body>
                <Row className="g-gs">
                <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="lotno">Lot No</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="lotno"
                      type="text"
                      placeholder="Actions"
                      value="Enter Lot No"
                    />
                  </div>
                </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group as={Row} className="form-group mt-3"controlId="date">
                    <Form.Label column sm={1}>
                        Date
                    </Form.Label>
                    <Col sm={8}>
                      <div className="form-control-wrap">
                        <DatePicker
                            selected={data.marketAuctionDate}
                            onChange={handleDateChange}
                                />
                        </div>
                    </Col>
                    </Form.Group>
                </Col>
               </Row>
              </Card.Body>
            </Card>


            <div className="d-flex align-items-center justify-content-center mt-3">
              <Button type="button" variant="primary" onClick={display}>
                Click for Details
              </Button>
              <Link to="#" className="btn btn-secondary border-0">
                Back
             </Link>
            </div>
            </Row>
          </Form>
        </Block>
    </Layout>
  );
}

export default AcceptBid;
