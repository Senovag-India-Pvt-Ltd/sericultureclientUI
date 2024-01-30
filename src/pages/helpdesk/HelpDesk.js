import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon, Select } from "../../components";
import DatePicker from "react-datepicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../src/services/auth/api";
// import Quill from "../../components/Form/editors/Quill";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function HelpDesk() {
  const [data, setData] = useState({
    hdModuleId: "",
    hdFeatureId: "",
    hdBoardCategoryId: "",
    hdCategoryId: "",
    hdSubCategoryId: "",
    hdUsersAffected: "",
    query: "",
    queryDetails: "",
    hdAttachFiles: "",
    hdCreatedBy: "",
    ticketNumber: "",
  });

  const placeholder ="Enter your Query";

  const { quill, quillRef } = useQuill({placeholder});

  useEffect(()=>{
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        console.log(quill.getText()); 
        setData(prev=>({...prev,queryDetails:quill.getText().replace(/\n+$/,'')})) 
      });
    }
  }, [quill]);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

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
        .post(baseURL2 + `hdTicket/add`, data)
        .then((response) => {
          if (response.data.content.hdTicketId) {
            const hdAttach = response.data.content.hdTicketId;
            handleAttachFileUpload(hdAttach);
          }
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              hdModuleId: "",
              hdFeatureId: "",
              hdBoardCategoryId: "",
              hdCategoryId: "",
              hdSubCategoryId: "",
              hdUsersAffected: "",
              query: "",
              queryDetails: "",
              hdAttachFiles: "",
              hdCreatedBy: "",
              ticketNumber: "",
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
      hdModuleId: "",
      hdFeatureId: "",
      hdBoardCategoryId: "",
      hdCategoryId: "",
      hdSubCategoryId: "",
      hdUsersAffected: "",
      query: "",
      queryDetails: "",
      hdAttachFiles: "",
      hdCreatedBy: "",
      ticketNumber: "",
    });
    setAttachFiles("");
  };

  const [loading, setLoading] = useState(false);

  // to get Module
  const [hdModuleListData, setHdModuleListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `hdModuleMaster/get-all`)
      .then((response) => {
        setHdModuleListData(response.data.content.hdModuleMaster);
      })
      .catch((err) => {
        setHdModuleListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get Feature
  const [featureListData, setFeatureListData] = useState([]);

  const getFeatureList = (_id) => {
    const response = api
      .get(baseURL + `hdFeatureMaster/get-by-hd-module-id/${_id}`)
      .then((response) => {
        setFeatureListData(response.data.content.hdFeatureMaster);
        setLoading(false);
        if (response.data.content.error) {
          setFeatureListData([]);
        }
      })
      .catch((err) => {
        setFeatureListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data.hdModuleId) {
      getFeatureList(data.hdModuleId);
    }
  }, [data.hdModuleId]);

  // to get BoardCategory
  const [hdBoardCategoryListData, setHdBoardCategoryListData] = useState([]);

  const getHdBoardCategoryList = (_id) => {
    const response = api
      .get(baseURL + `hdBoardCategoryMaster/get-all`)
      .then((response) => {
        if (response.data.content.hdBoardCategoryMaster) {
          setHdBoardCategoryListData(
            response.data.content.hdBoardCategoryMaster
          );
        }
      })
      .catch((err) => {
        setHdBoardCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getHdBoardCategoryList();
  }, []);

  // to get hdCategory
  const [hdCategoryListData, setHdCategoryListData] = useState([]);

  const getHdCategoryList = (_id) => {
    const response = api
      .get(baseURL + `hdCategoryMaster/get-by-hd-board-category-id/${_id}`)
      .then((response) => {
        if (response.data.content.hdCategoryMaster) {
          setHdCategoryListData(response.data.content.hdCategoryMaster);
        }
      })
      .catch((err) => {
        setHdCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hdBoardCategoryId) {
      getHdCategoryList(data.hdBoardCategoryId);
    }
  }, [data.hdBoardCategoryId]);

  // to get hdCategory
  const [hdSubCategoryListData, setHdSubCategoryListData] = useState([]);

  const getHdSubCategoryList = (_id) => {
    const response = api
      .get(baseURL + `hdSubCategoryMaster/get-by-hd-category-id/${_id}`)
      .then((response) => {
        if (response.data.content.hdSubCategoryMaster) {
          setHdSubCategoryListData(response.data.content.hdSubCategoryMaster);
        }
      })
      .catch((err) => {
        setHdSubCategoryListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hdCategoryId) {
      getHdSubCategoryList(data.hdCategoryId);
    }
  }, [data.hdCategoryId]);

  //  // const YourFormComponent = ({ data, handleDateChange }) => {
  //   const handleRenewedDateChange = (date) => {
  //     // Calculate expiration date by adding 3 years to the renewed date
  //     const expirationDate = new Date(date);
  //     expirationDate.setFullYear(expirationDate.getFullYear() + 3);

  //     setData({
  //       ...data,
  //       receiptDate: date,
  //       licenseExpiryDate: expirationDate,
  //     });
  //   };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // Display Image
  const [attachFiles, setAttachFiles] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  const handleAttachFileChange = (e) => {
    const file = e.target.files[0];
    setAttachFiles(file);
    setData((prev) => ({ ...prev, trUploadPath: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleAttachFileUpload = async (hdTicketid) => {
    const parameters = `hdTicketId=${hdTicketid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", attachFiles);

      const response = await api.post(
        baseURL2 + `hdTicket/hd-attach-files?${parameters}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File upload response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };

  return (
    <Layout title="Create Ticket">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Create Ticket</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link to="/help-desk-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/help-desk-list"
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

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        Module<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdModuleId"
                          value={data.hdModuleId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdModuleId === undefined ||
                            data.hdModuleId === "0"
                          }
                        >
                          <option value="">Select Module</option>
                          {hdModuleListData.map((list) => (
                            <option
                              key={list.hdModuleId}
                              value={list.hdModuleId}
                            >
                              {list.hdModuleName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Module Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        Feature<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdFeatureId"
                          value={data.hdFeatureId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdFeatureId === undefined ||
                            data.hdFeatureId === "0"
                          }
                        >
                          <option value="">Select Feature</option>
                          {featureListData.map((list) => (
                            <option
                              key={list.hdFeatureId}
                              value={list.hdFeatureId}
                            >
                              {list.hdFeatureName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Feature Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        Board Category<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdBoardCategoryId"
                          value={data.hdBoardCategoryId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdBoardCategoryId === undefined ||
                            data.hdBoardCategoryId === "0"
                          }
                        >
                          <option value="">Select Board Category</option>
                          {hdBoardCategoryListData.map((list) => (
                            <option
                              key={list.hdBoardCategoryId}
                              value={list.hdBoardCategoryId}
                            >
                              {list.hdBoardCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Board Category Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Category<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdCategoryId"
                          value={data.hdCategoryId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdCategoryId === undefined ||
                            data.hdCategoryId === "0"
                          }
                        >
                          <option value="">Select Category</option>
                          {hdCategoryListData.map((list) => (
                            <option
                              key={list.hdCategoryId}
                              value={list.hdCategoryId}
                            >
                              {list.hdCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Category Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Sub Category<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdSubCategoryId"
                          value={data.hdSubCategoryId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdSubCategoryId === undefined ||
                            data.hdSubCategoryId === "0"
                          }
                        >
                          <option value="">Select Sub Category</option>
                          {hdSubCategoryListData.map((list) => (
                            <option
                              key={list.hdSubCategoryId}
                              value={list.hdSubCategoryId}
                            >
                              {list.hdSubCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Sub Category Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="trDuration">
                        Users Affected
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="hdUsersAffected"
                          name="hdUsersAffected"
                          value={data.hdUsersAffected}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Users Affected"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="12">
                    <Form.Group className="form-group mt-n4">
                      {/* <Form.Label htmlFor="address">
                        Query<span className="text-danger">*</span>
                      </Form.Label> */}
                      <Card.Header>Query</Card.Header>
                      <div className="form-control-wrap">
                        <Form.Control
                          // as="textarea"
                          id="query"
                          name="query"
                          value={data.query}
                          onChange={handleInputs}
                          type="text"
                          placeholder=""
                          rows="1"
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          Market Address is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="12">
                    <Form.Group className="form-group mt-n4">
                      {/* <Form.Label htmlFor="address">
                        Query<span className="text-danger">*</span>
                      </Form.Label> */}
                      <Card.Header>Query Details </Card.Header>
                      <div className="form-control-wrap">
                        {/* <Form.Control
                          as="textarea"
                          id="queryDetails"
                          name="queryDetails"
                          value={data.queryDetails}
                          onChange={handleInputs}
                          type="text"
                          placeholder=""
                          rows=""

                        /> */}
                         <div ref={quillRef} />
                        {/* <Quill
                          theme="snow"
                          defaultValue="hello"
                          placeholder="Enter the query"
                        /> */}
                        {/* <Form.Control.Feedback type="invalid">
                          Market Address is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="trUploadPath">
                        Attach Files
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          type="file"
                          id="hdAttachFiles"
                          name="hdAttachFiles"
                          // value={data.photoPath}
                          onChange={handleAttachFileChange}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3 d-flex justify-content-center">
                      {attachFiles ? (
                        <img
                          style={{ height: "100px", width: "100px" }}
                          src={URL.createObjectURL(attachFiles)}
                        />
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Col>

                  <div className="gap-col">
                    <ul className="d-flex align-items-start justify-content-start gap g-3">
                      <li>
                        {/* <Button type="button" variant="primary" onClick={postData}> */}
                        <Button type="submit" variant="primary">
                          Create New Ticket
                        </Button>
                      </li>
                      <li>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={clear}
                        >
                          Clear
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Row>
              </Card.Body>
            </Card>

            {/* <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData}>
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                  </li>
              </ul>
            </div> */}
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}
export default HelpDesk;