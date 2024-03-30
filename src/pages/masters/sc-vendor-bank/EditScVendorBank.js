import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
//import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScVendorBankEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const datas = {
      scVendorBankId: id,
      bankName: data.bankName,
      ifscCode: data.ifscCode,
      branch:data.branch,
      accountNumber:data.accountNumber,
      upi:data.upi,
      scVendorId:data.scVendorId
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `scVendorBank/edit`, datas)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              bankName: "",
              ifscCode: "",
              branch:"",
              accountNumber: "",
              upi: "",
              scVendorId: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          updateError(err.response.data.validationErrors);
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      bankName: "",
      ifscCode: "",
      branch:"",
      accountNumber: "",
      upi: "",
      scVendorId: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scVendorBank/get/${id}`)
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

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  // to get Vendor
  const [scVendorListData, setScVendorListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `scVendor/get-all`)
      .then((response) => {
        setScVendorListData(response.data.content.ScVendor);
      })
      .catch((err) => {
        setScVendorListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const updateError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: Object.values(message).join("<br>"),
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };

  return (
    <Layout title="Edit Vendor Bank">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Vendor Bank </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-vendor-bank-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-vendor-bank-list"
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

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
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
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Bank Name
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="bankName"
                          type="text"
                          value={data.bankName}
                          onChange={handleInputs}
                          placeholder="Enter Bank Name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Bank Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Ifsc Code
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="ifscCode"
                          type="text"
                          value={data.ifscCode}
                          onChange={handleInputs}
                          placeholder="Enter Ifsc Code"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Ifsc Code is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Branch
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="branch"
                          type="text"
                          value={data.branch}
                          onChange={handleInputs}
                          placeholder="Enter Branch"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Branch Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Account Number
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="accountNumber"
                          type="text"
                          value={data.accountNumber}
                          onChange={handleInputs}
                          placeholder="Enter Account Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Account Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Upi
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="upi"
                          type="text"
                          value={data.upi}
                          onChange={handleInputs}
                          placeholder="Enter Upi"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Upi is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>


                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        Vendor<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="scVendorId"
                          value={data.scVendorId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.scVendorId === undefined || data.scVendorId === "0"
                          }
                        >
                          <option value="">Select Vendor</option>
                          {scVendorListData.map((list) => (
                            <option key={list.scVendorId} value={list.scVendorId}>
                              {list.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Vendor name is required
                        </Form.Control.Feedback>
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
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Update
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ScVendorBankEdit;
