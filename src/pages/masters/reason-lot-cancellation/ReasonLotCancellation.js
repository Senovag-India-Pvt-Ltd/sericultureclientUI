import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
// import axios from "axios";
import { useState } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next"; // Add this line

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReasonLotCancellation() {
  const { t } = useTranslation(); // Add this line
  const [data, setData] = useState({
    reasonLotRejectName: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURL + `reason-lot-reject-master/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
          }
        })
        .catch((err) => {
          setData({});
          saveError();
        });
      setValidated(true);
    }
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"), // Add translation function
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/reason-lot-cancellation-list"));
  };

  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: t("Save attempt was not successful"), // Add translation function
      text: message,
    });
  };

  return (
    <Layout title={t("Reason for Lot Cancellation")}> {/* Add translation function */}
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Reason for Lot Cancellation")}</Block.Title> {/* Add translation function */}
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/reason-lot-cancellation-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span> {/* Add translation function */}
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/reason-lot-cancellation-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span> {/* Add translation function */}
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card className="card-gutter-md">
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="rear">
                        {t("Reason for Lot Cancellation")} {/* Add translation function */}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="Reason Lot Cancellation"
                          name="reasonLotRejectName"
                          type="text"
                          value={data.reasonLotRejectName}
                          onChange={handleInputs}
                          placeholder={t("Enter Reason for Lot Cancellation")} 
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Reason for Lot Cancellation is required")} {/* Add translation function */}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    {t("Save")} {/* Add translation function */}
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/reason-lot-cancellation-list"
                    className="btn btn-secondary border-0"
                  >
                    {t("Cancel")} {/* Add translation function */}
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ReasonLotCancellation;
