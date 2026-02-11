import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import LoginLogo from "../../components/Logo/LoginLogo";
import Swal from "sweetalert2";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

// 🔹 Small popup config
const smallPopup = {
  width: "320px",
  padding: "12px",
  customClass: {
    popup: "small-swal-popup",
    title: "small-swal-title",
    htmlContainer: "small-swal-text",
    confirmButton: "small-swal-btn",
  },
};

function DbtApplicationStatusCheck() {
  const { t } = useTranslation();

  const [validated, setValidated] = useState(false);
  const [applicationList, setApplicationList] = useState([]);

  const [searchData, setSearchData] = useState({
    select: "fid",
    text: "",
  });

  const handleSearchInputs = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const getDynamicLabel = () => {
    if (searchData.select === "mobileNo") return "Mobile Number";
    if (searchData.select === "fid") return "FRUITS ID";
    return "ARN Number";
  };

  const getNotExistMessage = () => {
    if (searchData.select === "mobileNo") return "Mobile Number does not exist";
    if (searchData.select === "fid") return "FRUITS ID does not exist";
    return "ARN does not exist";
  };

  const postData = (event) => {
    event.preventDefault();
    setValidated(true);

    // 🔴 Empty input
    if (!searchData.text.trim()) {
      Swal.fire({
        ...smallPopup,
        icon: "warning",
        title: `Please enter ${getDynamicLabel()}`,
        text: "Please try again!",
      });
      return;
    }

    api
      .post(
        baseURLDBT + "dashboard/getApplicationStatus",
        {},
        { params: { [searchData.select]: searchData.text } }
      )
      .then((response) => {
        const list = response.data?.content || [];

        // 🔴 Not exists
        if (list.length === 0) {
          Swal.fire({
            ...smallPopup,
            icon: "warning",
            title: getNotExistMessage(),
            text: "Please try again!",
          });
          setApplicationList([]);
          return;
        }

        setApplicationList(list);
      })
      .catch(() => {
        Swal.fire({
          ...smallPopup,
          icon: "warning",
          title: getNotExistMessage(),
          text: "Please try again!",
        });
        setApplicationList([]);
      });
  };

  return (
    <div className="p-4">
      {/* ================= HEADER ================= */}
      <Row className="justify-content-center mb-2">
        <Col lg={6} md={8}>
          <Card className="border-0 shadow-sm" style={{ backgroundColor: "#0f6cbe" }}>
            <Card.Body className="py-0 text-center" style={{ minHeight: "63px" }}>
              <div style={{ marginTop: "3px" }}>
                <LoginLogo style={{ height: "13px" }} />
              </div>
              <div className="fw-bold text-white" style={{ fontSize: "17px" }}>
                Department of Sericulture
              </div>
              <div className="fw-bold text-white" style={{ fontSize: "15px" }}>
                Government of Karnataka
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ================= SEARCH CARD ================= */}
      <Row className="justify-content-center">
        <Col lg={6} md={8}>
          <Card className="shadow border-0">
            <Card.Header className="text-center fw-bold" style={{ backgroundColor: "#0f6cbe", color: "#fff" }}>
              View Application Status
            </Card.Header>

            <Card.Body>
              <Form noValidate validated={validated} onSubmit={postData}>
                <Row className="g-3">
                  <Col md={5}>
                    <Form.Label>
                      Search By <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select name="select" value={searchData.select} onChange={handleSearchInputs}>
                      <option value="mobileNo">Mobile Number</option>
                      <option value="fid">FRUITS ID</option>
                      <option value="arn">ARN</option>
                    </Form.Select>
                  </Col>

                  <Col md={7}>
                    <Form.Label>
                      Enter {getDynamicLabel()} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="text"
                      value={searchData.text}
                      onChange={handleSearchInputs}
                      placeholder={`Enter ${getDynamicLabel()}`}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col className="d-flex justify-content-center gap-3">
                    <Button type="submit" variant="primary">
                      Check Status
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setSearchData({ select: "fid", text: "" });
                        setApplicationList([]);
                        setValidated(false);
                      }}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ================= RESULT TABLE ================= */}
      {applicationList.length > 0 && (
        <Row className="justify-content-center mt-5">
          <Col lg={11}>
            <Card className="shadow border-0">
              <Card.Body className="table-responsive">
                <table className="table table-bordered table-striped text-center align-middle">
                  <thead>
                    <tr style={{ backgroundColor: "#0f6cbe", color: "#fff" }}>
                      <th>SL No</th>
                      <th>Beneficiary Name</th>
                      <th>FRUITS ID</th>
                      <th>ARN No</th>
                      <th>Scheme Name</th>
                      <th>Component Name</th>
                      <th>Stage</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Currently With</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicationList.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.farmerName}</td>
                        <td>{item.fruitsId}</td>
                        <td>{item.arn}</td>
                        <td>{item.schemeName}</td>
                        <td>{item.componentName}</td>
                        <td>{item.stageName}</td>
                        <td>{item.schemeAmount}</td>
                        <td className="fw-bold text-success">{item.applicationStatus}</td>
                        <td>{item.userName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default DbtApplicationStatusCheck;