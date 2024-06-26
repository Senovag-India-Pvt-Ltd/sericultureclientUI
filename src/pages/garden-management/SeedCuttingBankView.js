import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import ReceiptOfDFLsEdit from "./ReceiptOfDFLsEdit";
import SeedCuttingBank from "./SeedCuttingBank";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function SeedCuttingBankView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [seedCuttingBank, setSeedCuttingBank] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `seed-cutting/get-info-by-id/${id}`)
      .then((response) => {
        setSeedCuttingBank(response.data);
        if (response.data.challanUpload) {
          getChallanFile(response.data.challanUpload);
        }
        setLoading(false);
      })
      .catch((err) => {
        setSeedCuttingBank({});
        setLoading(false);
      });
  };


   // To get Photo
   const [selectedChallanFile, setSelectedChallanFile] = useState(null);

   const getChallanFile = async (file) => {
     const parameters = `fileName=${file}`;
     try {
       const response = await api.get(
         baseURL2 + `v1/api/s3/download?${parameters}`,
         {
           responseType: "arraybuffer",
         }
       );
       const blob = new Blob([response.data]);
       const url = URL.createObjectURL(blob);
       setSelectedChallanFile(url);
     } catch (error) {
       console.error("Error fetching file:", error);
     }
   };
 
  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  const downloadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `v1/api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);

      const fileExtension = file.split(".").pop();

      const link = document.createElement("a");
      link.href = url;

      const modifiedFileName = file.replace(/_([^_]*)$/, ".$1");

      link.download = modifiedFileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  return (
    <Layout title="View Seed Cutting Bank Details ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">View Seed Cutting Bank Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/seed-cutting-bank-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/seed-cutting-bank-list"
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
          <Card.Header style={{ fontWeight: "bold" }}>Seed Cutting Bank Details</Card.Header>
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
                        <td>{seedCuttingBank.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Fruits ID:</td>
                        <td>{seedCuttingBank.fruitsId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Farmer Name:</td>
                        <td>{seedCuttingBank.farmerName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>
                          Quantity Of Seed Cuttings:
                        </td>
                        <td>{seedCuttingBank.quantityOfSeedCuttings}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Date Of Pruning:</td>
                        <td>{seedCuttingBank.dateOfPruning}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Rate Per Tonne:</td>
                        <td>{seedCuttingBank.ratePerTonne}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Receipt Number:</td>
                        <td>{seedCuttingBank.receiptNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Remittance Details:</td>
                        <td>{seedCuttingBank.remittanceDetails}</td>
                      </tr>

                      <tr>
                        <td style={styles.ctstyle}> Uploaded Challan:</td>
                        <td>
                          {" "}
                          {selectedChallanFile && (
                            <>
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedChallanFile}
                              alt="Selected File"
                            />
                            <Button
                                variant="primary"
                                size="sm"
                                className="ms-2"
                                onClick={() =>
                                  downloadFile(seedCuttingBank.challanUpload)
                                }
                              >
                                Download File
                              </Button>
                              </>
                          )}
                        </td>
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

export default SeedCuttingBankView;
