import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import { Icon, Select } from "../../../components";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function ServiceApplication() {
  // Translation
  const { t } = useTranslation();
  return (
    <Layout title="Application for Subsidy / Incentives">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("title_service_application")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/stake-holder-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/stake-holder-list"
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
        {/* <Form action="#"> */}
        {/* <Form noValidate validated={searchValidated} onSubmit={search}> */}
        <Form noValidate>
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Form.Group as={Row} className="form-group">
                    <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                      {t("FRUITS ID")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={4}>
                      <Form.Control
                        id="fruitsId"
                        name="fruitsId"
                        // value={data.fruitsId}
                        // onChange={handleInputs}
                        type="text"
                        maxLength="16"
                        placeholder={t("Enter FRUITS ID")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Fruits ID 16 Digits is required.
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2}>
                      <Button type="submit" variant="primary">
                        {t("search")}
                      </Button>
                    </Col>
                    <Col sm={2}>
                      <Button
                        type="button"
                        variant="primary"
                        href="https://fruits.karnataka.gov.in/OnlineUserLogin.aspx"
                        target="_blank"
                        // onClick={search}
                      >
                        Generate FRUITS ID
                      </Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
      </Block>
    </Layout>
  );
}

export default ServiceApplication;
