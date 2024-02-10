import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import BinDatas from "../../../store/masters/bin/BinData";

function BinView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  const [data] = useState(BinDatas);
  const [bin, setBin] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setBin(findUser);
  }, [id, data]);

  return (
    <Layout title="Bin View" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Bin View</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/godawn-list">Bin List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Bin View
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/bin-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/bin-list"
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
          <Card.Header>Bin Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> ID:</td>
                      <td>{bin.id}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Market:</td>
                      <td>{bin.market}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Godown:</td>
                      <td>{bin.godown}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Type:</td>
                      <td>{bin.type}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Bin Number:</td>
                      <td>{bin.binno}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Status:</td>
                      <td>{bin.status}</td>
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

export default BinView;
