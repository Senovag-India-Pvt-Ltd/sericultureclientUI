import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import { format } from 'date-fns';

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceOfLineRecordForEachRaceView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [lineRecord, setLineRecord] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `LineRecord/get-info-by-id/${id}`)
      .then((response) => {
        setLineRecord(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLineRecord({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    const date = new Date(dateString); 
    return format(date, 'dd/MM/yyyy'); 
  };

  return (
    <Layout title="View Maintenance of Line records for each race Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> View Maintenance of Line records for each race Details </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-of-Line-Records-for-Each-Race-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-of-Line-Records-for-Each-Race-List"
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
          <Card.Header style={{ fontWeight: "bold" }}>Maintenance of Line records for each race Details</Card.Header>
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
                        <td>{lineRecord.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Line Name:
                        </td>
                        <td>{lineRecord.lineName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date Of Selection Cocoon:</td>
                        <td>{formatDate(lineRecord.dateOfSelectionCocoon)}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Race:
                        </td>
                        <td>{lineRecord.raceName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Fruits ID:</td>
                        <td>{lineRecord.fruitsId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Farmer Name:
                        </td>
                        <td>{lineRecord.farmerName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Pupa Test Details:</td>
                        <td>{lineRecord.pupaTestDetails}</td>
                      </tr>
                      
                      <tr>
                        <td style={styles.ctstyle}>Market:</td>
                        <td>{lineRecord.marketMasterName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Lot Number:
                        </td>
                        <td>{lineRecord.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        No Of Cocoons Selected:
                        </td>
                        <td>{lineRecord.noOfCocoonsSelected}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Average Weight:
                        </td>
                        <td>{lineRecord.averageWeight}</td>
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

export default MaintenanceOfLineRecordForEachRaceView;
