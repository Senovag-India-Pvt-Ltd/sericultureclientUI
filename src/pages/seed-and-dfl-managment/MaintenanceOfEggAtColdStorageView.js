import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";


const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceOfEggsAtColdStorageView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [coldStorage, setColdStorage] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `MaintenanceOfEggsAtColdStorage/get-info-by-id/${id}`)
      .then((response) => {
        setColdStorage(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setColdStorage({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="View Maintenance Of Egg At Cold Storage Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> View Maintenance Of Egg At Cold Storage Details </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-of-eggs-at-cold-storage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-of-eggs-at-cold-storage-list"
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
          <Card.Header style={{ fontWeight: "bold" }}>Maintenance Of Eggs At Cold Storage Details</Card.Header>
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
                        <td>{coldStorage.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Lot Number:
                        </td>
                        <td>{coldStorage.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number Of DFLs:</td>
                        <td>{coldStorage.noOfDFLs}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Grainage Details:
                        </td>
                        <td>{coldStorage.grainageDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Date Of Cold Storage:
                        </td>
                        <td>{coldStorage.dateOfColdStorage}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Laid On Date:
                        </td>
                        <td>{coldStorage.laidOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Date Of Release:
                        </td>
                        <td>{coldStorage.releaseDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                        Incubation Details:
                        </td>
                        <td>{coldStorage.incubationDetails}</td>
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

export default MaintenanceOfEggsAtColdStorageView;
