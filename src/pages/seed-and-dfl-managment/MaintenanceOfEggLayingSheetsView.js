import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import MaintenanceOfEggLayingSheets from "./MaintenanceOfEggLayingSheets";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceOfEggLayingSheetsView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [eggSheets, setEggSheets] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `EggLayingSheet/get-info-by-id/${id}`)
      .then((response) => {
        setEggSheets(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setEggSheets({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="View  Maintenance Of Egg Laying Sheets Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> View  Maintenance Of Egg Laying Sheets Details </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-of-egg-laying-sheets-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-of-egg-laying-sheets-list"
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
          <Card.Header style={{ fontWeight: "bold" }}> Maintenance Of Egg Laying Sheets Details</Card.Header>
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
                        <td>{eggSheets.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Lot Number:
                        </td>
                        <td>{eggSheets.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date:</td>
                        <td>{eggSheets.date}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Number Of Egg Sheets:
                        </td>
                        <td>{eggSheets.numberOfEggSheetsUsed}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Egg Sheet Number:
                        </td>
                        <td>{eggSheets.eggSheetNumbers}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                       Balance No Of Sheets:
                        </td>
                        <td>{eggSheets.balanceNumberOfSheets}</td>
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

export default MaintenanceOfEggLayingSheetsView;
