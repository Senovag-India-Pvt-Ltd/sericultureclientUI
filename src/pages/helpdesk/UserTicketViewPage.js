import { Card, Form, Row, Col, Button, CardBody } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import HelpDeskFaqView from "../../pages/helpdesk/HelpDeskFaqView";
import HelpDeskFaqComponent from "./HelpDeskFaqComponent";
import { useTranslation } from "react-i18next";

const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function UserTicketView() {
  // Translation
  const { t } = useTranslation();
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [raiseTicket, setRaiseTicket] = useState({});
  const [loading, setLoading] = useState(false);

  // grabsthe id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `hdTicket/get-join/${id}`)
      .then((response) => {
        setRaiseTicket(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setRaiseTicket({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  //   const handleListInput = (e, row) => {
  //     // debugger;
  //     let { name, value } = e.target;
  //     const updatedRow = { ...row, [name]: value };
  //     const updatedDataList = raiseTicket.map((rowData) =>
  //       rowData.hdTicketId === row.hdTicketId ? updatedRow : rowData
  //     );
  //     setRaiseTicket(updatedDataList);
  //   };

  let name, value;
  const handleListInput = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setRaiseTicket({ ...raiseTicket, [name]: value });
  };

   // To get Photo
    const [selectedFile, setSelectedFile] = useState(null);
  
    const getFile = async (file) => {
      const parameters = `fileName=${file}`;
      try {
        const response = await api.get(
          baseURL + `api/s3/download?${parameters}`,
          {
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([response.data]);
        const url = URL.createObjectURL(blob);
        setSelectedFile(url);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

 const downloadHdAttachFile = async (file) => {
  if (!file) {
    console.error("No file provided for download");
    return;
  }

  try {
    const parameters = `fileName=${encodeURIComponent(file)}`;
    const response = await api.get(baseURL + `api/s3/download?${parameters}`, {
      responseType: "arraybuffer",
    });

    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);

    // ✅ Safely extract filename from S3 key or path
    const fileParts = file.split("/");
    const fileName = fileParts[fileParts.length - 1] || "download";

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName; // ✅ use actual filename instead of undefined variable
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};


  const viewHdAttachFile = async (file) => {
  const parameters = `fileName=${file}`;
  const response = await api.get(baseURL + `api/s3/download?${parameters}`, { responseType: "arraybuffer" });
  const blob = new Blob([response.data]);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

  return (
    <Layout title="View User Ticket Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("View User Ticket Details")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/user-dashboard"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/user-dashboard"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header>{t("View Raised Ticket Details")}</Card.Header>
          <Card.Body>
            {loading ? (
              <h1 className="d-flex justify-content-center align-items-center">
                {t("Loading...")}
              </h1>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <table className="table small table-bordered">
                    <tbody>
                      <tr>
                        <td style={styles.ctstyle}>{t("ID")}</td>
                        <td>{raiseTicket.hdTicketId}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Module Name")}</td>
                        <td>{raiseTicket.hdModuleName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Feature")}</td>
                        <td>{raiseTicket.hdFeatureName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Broad Category")}</td>
                        <td>{raiseTicket.hdBoardCategoryName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Category")}</td>
                        <td>{raiseTicket.hdCategoryName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Sub Category")}</td>
                        <td>{raiseTicket.hdSubCategoryName}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Users Affected")}</td>
                        <td>{raiseTicket.hdUsersAffected}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Query")}</td>
                        <td>{raiseTicket.query}</td>
                      </tr>
                      <tr>
                        <td style={styles.ctstyle}>{t("Query Details")}</td>
                        <td>{raiseTicket.queryDetails}</td>
                      </tr>

                     {raiseTicket?.hdAttachFiles && (
  <tr>
    <td style={styles.ctstyle}>{t("Attached File")}</td>
    <td>
      <Button onClick={() => viewHdAttachFile(raiseTicket.hdAttachFiles)}>...</Button>
      <Button onClick={() => downloadHdAttachFile(raiseTicket.hdAttachFiles)}>...</Button>
    </td>
  </tr>
)}


                      <tr>
                        <td style={styles.ctstyle}>{t("Ticket Number")}</td>
                        <td>{raiseTicket.ticketArn}</td>
                      </tr>
                      <tr>
                        <td style={{ ...styles.ctstyle, fontWeight: "bold" }}>
                          {t("Solution")}
                        </td>
                        <td style={{ fontWeight: "bold", color: "green" }}>
                          {raiseTicket.solution}
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

export default UserTicketView;
