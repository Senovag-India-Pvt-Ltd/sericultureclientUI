import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../components";

function BidDashboard() {
  const styles = {
    ctstyle: {
      // Add your style properties here
    },
  };
  return (
    <Layout title="Dashboard">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Dashboard</Block.Title>
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

      <Col lg="5">
        <Card>
          <Card.Header>Dashboard</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    {/* <td style={styles.ctstyle}> Bidding Status:</td> */}
                    <h2 className="text-centre">Bidding Status:Start</h2>
                    <h2 className="text-centre">Acceptance Status:Start</h2>
                    <tr>
                      <td style={styles.ctstyle}> Total Lots:</td>
                      <td>CSR-70</td>
                      <td>CB-48</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Total Lots Bid:</td>
                      <td>118</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Total Lots Not Bid:</td>
                      <td>0</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Total Bids:</td>
                      <td>1897</td>
                      <td>36</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Total Reelers:</td>
                      <td>107(Active)</td>
                      <td>253(Paid)</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Current Auction-Max Bid:</td>
                      <td>540</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Accepted Lots:</td>
                      <td>105</td>
                      <td>12:32:47</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Online Lots:</td>
                      <td>105</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Accepted Lots-Max Bid:</td>
                      <td>557.000</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Accepted Lots-Min Bid:</td>
                      <td>290.000</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Average Rate:</td>
                      <td>0</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Weighed Lots:</td>
                      <td>0</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Layout>
  );
}

export default BidDashboard;
