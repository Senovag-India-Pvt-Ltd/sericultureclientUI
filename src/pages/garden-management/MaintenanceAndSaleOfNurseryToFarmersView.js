import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceAndSaleOfNurseryToFarmersView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [maintenanceNursery, setMaintenanceNursery] = useState({});
  const [loading, setLoading] = useState(false);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Maintenance-sale/get-info-by-id/${id}`)
      .then((response) => {
        setMaintenanceNursery(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setMaintenanceNursery({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="View Maintenance And Sale Of Nursery To Farmers Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
            View Maintenance And Sale Of Nursery To Farmers Details
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-and-sale-of-nursery-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-and-sale-of-nursery-list"
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
          <Card.Header style={{ fontWeight: "bold" }}> Maintenance And Sale Of Nursery To Farmers  Details</Card.Header>
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
                        <td>{maintenanceNursery.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Fruits Id:</td>
                        <td>{maintenanceNursery.fruitsId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Farmer Name:</td>
                        <td>{maintenanceNursery.farmerName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Mulberry Variety:</td>
                        <td>{maintenanceNursery.mulberryVariety}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Area:</td>
                        <td>{maintenanceNursery.area}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Date Of Planting:
                        </td>
                        <td>{maintenanceNursery.dateOfPlanting}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Nursery Details:</td>
                        <td>{maintenanceNursery.nurserySaleDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Quantity:</td>
                        <td>{maintenanceNursery.quantity}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date:</td>
                        <td>{maintenanceNursery.date}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Rate:</td>
                        <td>{maintenanceNursery.rate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Sapling Age:</td>
                        <td>{maintenanceNursery.saplingAge}</td>
                      </tr> 
                      <tr>
                        <td style={styles.ctstyle}>Generate Receipt:</td>
                        <td>{maintenanceNursery.generateRecipt}</td>
                      </tr> 
                      <tr>
                        <td style={styles.ctstyle}>Receipt Number:</td>
                        <td>{maintenanceNursery.receiptNumber}</td>
                      </tr> 
                      <tr>
                        <td style={styles.ctstyle}>Remittance Details:</td>
                        <td>{maintenanceNursery.remittanceDetails}</td>
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

export default MaintenanceAndSaleOfNurseryToFarmersView;
