import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScHeadAccountEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  let name, value;

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (e) => {
    axios
      .post(baseURL + `scHeadAccount/edit`, data, {
        headers: _header,
      })
      .then((response) => {
        updateSuccess();
      })
      .catch((err) => {
        setData({});
        updateError();
      });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    axios
      .get(baseURL + `scHeadAccount/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/sc-head-account-list"));
  };

  const updateError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/sc-head-account-list"));
  };

  return (
    <Layout title="Edit Head of Account">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Head of Account</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Edit Head of Account
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-head-account-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-head-account-list"
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

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="headAccount">
                          Head of Account
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="headAccount"
                            name="scHeadAccountName"
                            type="text"
                            value={data.scHeadAccountName}
                            onChange={handleInputs}
                            placeholder="Enter Head of Account"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData}>
                    Update
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/sc-head-account-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
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

export default ScHeadAccountEdit;
