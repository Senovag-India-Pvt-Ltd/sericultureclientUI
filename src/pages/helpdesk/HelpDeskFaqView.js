import { Card, Form, Row, Col, Button, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "../../components";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function HelpDeskFaqView() {
  const [data, setData] = useState({
    hdQuestionName: "",
    hdQuestionAnswerName: "",
    hdFaqUploadPath: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // To get faq
  const [faqData, setFaqData] = useState([]);

  const getFaq = () => {
    api
      .get(baseURL + `hdQuestionMaster/get-all`)
      .then((response) => {
        // debugger;
        setFaqData(response.data.content.hdQuestionMaster);
      })
      .catch((err) => {
        // setMarketData([]);
      });
  };

  useEffect(() => {
    getFaq();
  }, []);

  console.log(faqData);

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
        .post(baseURL + `hdQuestionMaster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              hdQuestionName: "",
              hdQuestionAnswerName: "",
              hdFaqUploadPath: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          saveError();
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      hdQuestionName: "",
      hdQuestionAnswerName: "",
      hdFaqUploadPath: "",
    });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };
  return (
    <Layout title="FAQ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">FAQ</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="/hd-question-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/hd-question-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className= "mt-n4">
        <Card>
          <Card.Body>
            <Accordion defaultActiveKey="0">
              {faqData && faqData.length
                ? faqData.map((data, i) => (
                    <Accordion.Item eventKey={i}>
                      <Accordion.Header style={{backgroundColor:"#dfdfe8"}} className="mb-2">{data.hdQuestionName}</Accordion.Header>
                      <Accordion.Body>
                        {data.hdQuestionAnswerName}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))
                : ""}
            </Accordion>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default HelpDeskFaqView;
