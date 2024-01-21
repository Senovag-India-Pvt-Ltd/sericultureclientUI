import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import ChawkiManagementData from "../../store/chawki-management/ChawkiManagementData";

function SaleChawkiWormsView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  const [data] = useState(ChawkiManagementData);
  const [saleChawkiWorms, setSaleChawkiWorms] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setSaleChawkiWorms(findUser);
  }, [id, data]);

  return (
    <Layout title="Sale of Chawki Worms View" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sale of Chawki Worms View</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/sale-chawki-worms-list">
                    Sale of Chawki Worms List
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Sale of Chawki Worms View
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/sale-chawki-worms-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/sale-chawki-worms-list"
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
        <Card>
          <Card.Header>Sale of Chawki Worms Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> ID:</td>
                      <td>{saleChawkiWorms.id}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Source of DFLs:</td>
                      <td>{saleChawkiWorms.source}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Race of DFLs:</td>
                      <td>{saleChawkiWorms.race}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Dispatch Date:</td>
                      <td>{saleChawkiWorms.dispatch}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Lot Number:</td>
                      <td>{saleChawkiWorms.lotno}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Receipt Number:</td>
                      <td>{saleChawkiWorms.receiptno}</td>
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

export default SaleChawkiWormsView;
