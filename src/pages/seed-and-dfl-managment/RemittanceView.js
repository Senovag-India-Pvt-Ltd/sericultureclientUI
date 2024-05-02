import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function RemittanceView() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [remittance, setRemittance] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `RemittanceOfEgg/get-info-by-id/${id}`)
      .then((response) => {
        setRemittance(response.data);
        if (response.data.viewReceipt) {
          getUploadReceipt(response.data.viewReceipt);
        }
        setLoading(false);
      })
      .catch((err) => {
        setRemittance({});
        setLoading(false);
      });
  };

  // To get Photo from S3 Bucket
const [selectedUploadReceipt, setSelectedUploadReceipt] = useState(null);

const getUploadReceipt = async (file) => {
  const parameters = `fileName=${file}`;
  try {
    const response = await api.get(
      baseURLSeedDfl + `v1/api/s3/download?${parameters}`,
      {
        responseType: "arraybuffer",
      }
    );
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    setSelectedUploadReceipt(url);
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

  useEffect(() => {
    getIdList();
  }, [id]);

  const downloadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURLSeedDfl + `v1/api/s3/download?${parameters}`,
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
    <Layout title="View Remittance(Eggs/PC/Others) Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">View Remittance(Eggs/PC/Others) Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/remittance-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/remittance-list"
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
          <Card.Header style={{ fontWeight: "bold" }}>Remittance(Eggs/PC/Others) Details</Card.Header>
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
                        <td>{remittance.id}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Lot Number:</td>
                        <td>{remittance.lotNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Race Of DFLs:</td>
                        <td>{remittance.raceName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Number Of DFLs:</td>
                        <td>{remittance.numberOfDFLs}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Total Amount:</td>
                        <td>{remittance.totalAmount}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Bill Number:</td>
                        <td>{remittance.billNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>Bank Challan No:</td>
                        <td>{remittance.bankChallanNumber}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>KTC 25:</td>
                        <td>{remittance.ktc25AndDate}</td>
                      </tr>
                      {/* <tr>
                        <td style={styles.ctstyle}> Uploaded Receipt:</td>
                        <td>
                          {" "}
                          {selectedUploadReceipt && (
                            <>
                              <img
                                style={{
                                  height: "100px",
                                  width: "100px",
                                }}
                                src={selectedUploadReceipt}
                                alt="Selected File"
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                className="ms-2"
                                onClick={() =>
                                  downloadFile(remittance.viewReceipt)
                                }
                              >
                                Download File
                              </Button>
                            </>
                          )}
                        </td>
                      </tr> */}
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

export default RemittanceView;
