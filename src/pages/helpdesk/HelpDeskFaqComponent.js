import React, { useState, useEffect } from "react";
import { Card, Form, Row, Col, Button, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const HelpDeskFaqComponent = () => {
  const [helpDeskFaq, setHelpDeskFaq] = useState({
    text: "",
    searchBy: "hdQuestionName",
  });

  const handleHelpDeskFaqInputs = (e) => {
    let { name, value } = e.target;
    setHelpDeskFaq({ ...helpDeskFaq, [name]: value });
  };

  const [faqData, setFaqData] = useState([]);

  const getFaq = () => {
    api
      .get(baseURL + `hdQuestionMaster/get-all`)
      .then((response) => {
        setFaqData(response.data.content.hdQuestionMaster);
      })
      .catch((err) => {
        // Handle error
      });
  };

  useEffect(() => {
    getFaq();
  }, []);

  const search = (e) => {
    api
      .post(baseURL + `hdQuestionMaster/search`, {
        searchText: helpDeskFaq.text,
        searchBy: helpDeskFaq.searchBy,
      })
      .then((response) => {
        setFaqData(response.data.content.hdQuestionMaster);
      })
      .catch((err) => {
        // Handle error
      });
  };

  return (
    <div>
      <Row className="m-2">
        <Col>
          <Form.Group as={Row} className="form-group" id="fid">
            <Form.Label column sm={1}>
              Search By
            </Form.Label>
            <Col sm={3}>
              <div className="form-control-wrap">
                <Form.Select
                  name="searchBy"
                  value={helpDeskFaq.searchBy}
                  onChange={handleHelpDeskFaqInputs}
                >
                  <option value="hdQuestionName">Question Or Answer</option>
                </Form.Select>
              </div>
            </Col>

            <Col sm={3}>
              <Form.Control
                id="hdTicketId"
                name="text"
                value={helpDeskFaq.text}
                onChange={handleHelpDeskFaqInputs}
                type="text"
                placeholder="Search"
              />
            </Col>
            <Col sm={3}>
              <Button type="button" variant="primary" onClick={search}>
                Search
              </Button>
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Accordion defaultActiveKey="0">
        {faqData &&
          faqData.map((data, i) => (
            <Accordion.Item eventKey={i} key={i}>
              <Accordion.Header style={{ backgroundColor: "#dfdfe8" }} className="mb-2">
                {data.hdQuestionName}
              </Accordion.Header>
              <Accordion.Body>{data.hdQuestionAnswerName}</Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
};

export default HelpDeskFaqComponent;
