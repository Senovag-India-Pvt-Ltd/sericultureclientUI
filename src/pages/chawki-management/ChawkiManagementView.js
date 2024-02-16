import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import ChawkiManagement from "./ChawkiManagement";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;

function ChawkiManagementView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [chawkiManagement, setChawkiManagement] = useState({});
  const [loading, setLoading] = useState(false);

  // grabsthe id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `chowkimanagement/get-info-by-id/${id}`)
      .then((response) => {
        setChawkiManagement(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setChawkiManagement({});
        setLoading(false);
      });
  };


  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title=" Chawki Management (Sale Of Chawki Worms) View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Chawki Management (Sale Of Chawki Worms) View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/chawki-management-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/chawki-management-list"
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
          <Card.Header>Chawki Management (Sale Of Chawki Worms) Details</Card.Header>
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
                        <td>{chawkiManagement.chawkiId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Fruits ID:</td>
                        <td>{chawkiManagement.fruitsId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Farmer Name:</td>
                        <td>{chawkiManagement.farmerName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Father Name:</td>
                        <td>{chawkiManagement.fatherName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>DFLs Source:</td>
                        <td>{chawkiManagement.dflsSource}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Race of DFLs:</td>
                        <td>{chawkiManagement.raceOfDfls}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number Of DFLs:</td>
                        <td>{chawkiManagement.numbersOfDfls}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot Number (of the RSP):</td>
                        <td>{chawkiManagement.lotNumberRsp}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot No. (CRC):</td>
                        <td>{chawkiManagement.lotNumberCrc}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}> State:</td>
                        <td>{chawkiManagement.stateName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>District:</td>
                        <td>{chawkiManagement.districtName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Taluk:</td>
                        <td>{chawkiManagement.talukName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Hobli:</td>
                        <td>{chawkiManagement.hobliName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Village:</td>
                        <td>{chawkiManagement.villageName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Dispatch Date:</td>
                        <td>{chawkiManagement.dispatchDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Hatching Date:</td>
                        <td>{chawkiManagement.hatchingDate}</td>
                    </tr>
                    <tr>
                        <td style={styles.ctstyle}>Number of DFL’s:</td>
                        <td>{chawkiManagement.numbersOfDfls}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Rate per 100 DFLs:</td>
                        <td>{chawkiManagement.ratePer100Dfls}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Price (in Rupees):</td>
                        <td>{chawkiManagement.price}</td>
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

export default ChawkiManagementView;
