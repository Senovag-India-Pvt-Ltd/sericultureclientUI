import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link,useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import {
  Icon,
  Select,
} from "../../components";


const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function RearingOfDFLsView(){
    const styles = {
      ctstyle: {
        backgroundColor: "rgb(248, 248, 249, 1)",
        color: "rgb(0, 0, 0)",
        width: "50%",
      },
    };
  
    const { id } = useParams();
    // const [data] = useState(CasteDatas);
    const [rearingOfDFLs, setRearingOfDFLs] = useState({});
    const [loading, setLoading] = useState(false);
  
    // grabs the id form the url and loads the corresponding data
    // useEffect(() => {
    // let findUser = data.find((item) => item.id === id);
    // setCaste(findUser);
    // }, [id, data]);
  
    const getIdList = () => {
      setLoading(true);
      const response = api
        .get(baseURL2 + `Rearing-of-dfls/get-info-by-id/${id}`)
        .then((response) => {
          setRearingOfDFLs(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setRearingOfDFLs({});
          setLoading(false);
        });
    };
  
    //console.log(Caste);
  
    useEffect(() => {
      getIdList();
    }, [id]);
  
    return (
        <Layout title="Rearing of DFLs View">
          <Block.Head>
            <Block.HeadBetween>
              <Block.HeadContent>
                <Block.Title tag="h2">Rearing of DFLs View</Block.Title>
              </Block.HeadContent>
              <Block.HeadContent>
                <ul className="d-flex">
                  <li>
                    <Link
                      to="/rearing-of-dfls-list"
                      className="btn btn-primary btn-md d-md-none"
                    >
                      <Icon name="arrow-long-left" />
                      <span>Go to List</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rearing-of-dfls-list"
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
          <Card.Header>Rearing of DFLs Details</Card.Header>
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
                        <td>{rearingOfDFLs.id}</td>
                      </tr>
                    <tr>
                        <td style={styles.ctstyle}>Disinfectant Usage Details:</td>
                        <td>{rearingOfDFLs.disinfectantUsageDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Crop Details:</td>
                        <td>{rearingOfDFLs.cropDetail}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Crop Number:</td>
                        <td>{rearingOfDFLs.cropNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot Number:</td>
                        <td>{rearingOfDFLs.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number Of DFLs:</td>
                        <td>{rearingOfDFLs.numberOfDFLs}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Laid On Date:</td>
                        <td>{rearingOfDFLs.laidOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Cold Storage Details:</td>
                        <td>{rearingOfDFLs.coldStorageDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Released On Date:</td>
                        <td>{rearingOfDFLs.releasedOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Chawki Percentage:</td>
                        <td>{rearingOfDFLs.chawkiPercentage}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Worm Weight:</td>
                        <td>{rearingOfDFLs.wormWeight}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Spun On Date:</td>
                        <td>{rearingOfDFLs.spunOnDate}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Worm Test Details:</td>
                        <td>{rearingOfDFLs.wormTestDetails}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Cocoon Assessment Details:</td>
                        <td>{rearingOfDFLs.cocoonAssessmentDetails}</td>
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

export default RearingOfDFLsView;
