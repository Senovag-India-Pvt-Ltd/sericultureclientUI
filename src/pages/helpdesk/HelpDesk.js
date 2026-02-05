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
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_HELPDESK;

function HelpDesk() {

  // Translation
  const { t } = useTranslation();
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
    ticketNumber: "",
    hdStatusId: "1",
    hdSeverityId: "4",
    onBehalfOf: localStorage.getItem("userMasterId"),
  });

  const placeholder = t("Enter your Query");

  const { quill, quillRef } = useQuill({ placeholder });

  // console.log(quillRef);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        console.log(quill.getText());
        setData((prev) => ({
          ...prev,
          queryDetails: quill.getText().replace(/\n+$/, ""),
        }));
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
  const [check, setCheck] = useState(false);

  const handleCheckBox = (e) => {
    setCheck(e.target.checked);
    if (!e.target.checked) {
      setData((prev) => ({
        ...prev,
        onBehalfOf: localStorage.getItem("userMasterId"),
      }));
    }
  };

  console.log(data.onBehalfOf);

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
            saveSuccess(response.data.content.ticketArn);
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
              hdStatusId: "1",
              hdSeverityId: "4",
              onBehalfOf: localStorage.getItem("userMasterId"),
            });
            setAttachFiles("");
            document.getElementById("hdAttachFiles").value = "";
            quill.setText("");
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
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
      hdStatusId: "1",
      hdSeverityId: "4",
      onBehalfOf: localStorage.getItem("userMasterId"),
    });
    setAttachFiles("");
    document.getElementById("hdAttachFiles").value = "";
    quill.setText("");
  };

  const [loading, setLoading] = useState(false);

  // to get Status
  const [hdStatusListData, setHdStatusListData] = useState([]);

  const getStatusList = () => {
    const response = api
      .get(baseURL + `hdStatusMaster/get-all`)
      .then((response) => {
        setHdStatusListData(response.data.content.hdStatusMaster);
      })
      .catch((err) => {
        setHdStatusListData([]);
      });
  };

  useEffect(() => {
    getStatusList();
  }, []);

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

  
    // Display Image
    const [image, setImage] = useState("");
    // const [photoFile,setPhotoFile] = useState("")
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
      setData((prev) => ({ ...prev, hdAttachFiles: file.name }));
      // setPhotoFile(file);
    };
  
    // // Upload Image to S3 Bucket
    // const handleAttachFileUpload = async (hdid) => {
    //   const parameters = `hdTicketId=${hdid}`;
    //   try {
    //     const formData = new FormData();
    //     formData.append("multipartFile", image);
  
    //     const response = await api.post(
    //       baseURL2 + `hdTicket/hd-attach-files?${parameters}`,
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       }
    //     );
    //     console.log("File upload response:", response.data);
    //   } catch (error) {
    //     console.error("Error uploading file:", error);
    //   }
    // };

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

  // to get username
  const [userListData, setUserListData] = useState([]);

  const getUserList = () => {
    api
      .get(baseURL + `userMaster/get-all`)
      .then((response) => {
        setUserListData(response.data.content.userMaster);
      })
      .catch((err) => {
        setUserListData([]);
      });
  };

  useEffect(() => {
    getUserList();
  }, []);

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

  // const handleAttachFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setAttachFiles(file);
  //   setData((prev) => ({ ...prev, hdAttachFiles: file.name }));
  //   // setPhotoFile(file);
  // };

  const handleAttachFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachFiles(file);
      setData((prev) => ({ ...prev, hdAttachFiles: file.name }));
    } else {
      // Handle the case when the file selection is canceled
      setAttachFiles(null);
      setData((prev) => ({ ...prev, hdAttachFiles: "" }));
    }
  };
  

 // ✅ Corrected File Upload Function (matches backend @RequestParam)
const handleAttachFileUpload = async (hdTicketId) => {
  if (!attachFiles) {
    console.error("No file selected for upload");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("multipartFile", attachFiles); // matches @RequestParam("multipartFile")
    formData.append("hdTicketId", hdTicketId);     // matches @RequestParam("hdTicketId")

    const response = await api.post(
      `${baseURL2}hdTicket/hd-attach-files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ File upload response:", response.data);
  } catch (error) {
    console.error("❌ Error uploading file:", error);
  }
};



  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Ticket Number is ${message}`,
    });
  };
  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Create Ticket">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Create Ticket")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
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
                      {t("Module")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Module")}</option>
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
                          {t("Module Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        {t("Feature")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Feature")}</option>
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
                          {t("Feature Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        {t("Broad Category")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Broad Category")}</option>
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
                          {t("Broad Category Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                      {t("Category")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Category")}</option>
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
                        {t("Category is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Sub Category")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Sub Category")}</option>
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
                          {t("Sub Category Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>


                 <Col lg="4">
  <Form.Group className="form-group mt-n4">
    <Form.Label htmlFor="hdUsersAffected">
      {t("Number Of Users Affected   (Numeric  Only)")}
    </Form.Label>

    <div className="form-control-wrap">
      <Form.Control
        id="hdUsersAffected"
        name="hdUsersAffected"
        value={data.hdUsersAffected}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            handleInputs(e);
          }
        }}
        type="text"
        placeholder={t("Enter Number Of Users Affected")}
      />

      {/* Smaller helper text (non-italic) */}
      <small
        className="text-secondary d-block mt-1"
        style={{ fontSize: "11px", letterSpacing: "0.3px" }}
      >
        {t("")}
      </small>
    </div>
  </Form.Group>
</Col>

                  <Col lg="4">
                    <Form.Group as={Row} className="form-group mt-2">
                      <Form.Label column sm={3} className="mt-n2">
                        {t("On Behalf Of")}
                      </Form.Label>
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          id="defaultAddress"
                          checked={check}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                    </Form.Group>
                  </Col>

                  {check ? (
                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          {t("User Name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="onBehalfOf"
                            value={data.onBehalfOf}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}

                            // isInvalid={
                            //   data.onBehalfOf === undefined ||
                            //   data.onBehalfOf === "0"
                            // }
                          >
                            <option value="">{t("Select Feature")}</option>
                            {userListData.map((list) => (
                              <option
                                key={list.userMasterId}
                                value={list.userMasterId}
                              >
                                {list.username}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>
                  ) : (
                    ""
                  )}

                  <Col lg="12">
                    <Form.Group className="form-group mt-n1">
                      {/* <Form.Label htmlFor="address">
                        Query<span className="text-danger">*</span>
                      </Form.Label> */}
                      <Card.Header>{t("Query")}</Card.Header>
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

                  {/* <Col lg="12">
                    <Form.Group className="form-group mt-n1">
                      <Card.Header>{t("Query Details")} </Card.Header>
                      <div className="form-control-wrap">
                        <div ref={quillRef} />
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="12">
  <Form.Group className="form-group mt-n1">

    <Form.Label
      className="fw-bold text-dark mb-2 text-center w-100"
      style={{ fontSize: "22px" }}   
    >
      {t(
        "Please  include  your  Name and Mobile Number in the Query details  for  any  clarification  regarding   the   raised   Query."
      )}
    </Form.Label>

    <Card.Header className="mt-2">
      {t("Query Details")}
    </Card.Header>

    <div className="form-control-wrap">
      <div ref={quillRef} />
    </div>
  </Form.Group>
</Col>


                  {/* <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Status<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hdStatusId"
                          value={data.hdStatusId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.hdStatusId === undefined ||
                            data.hdStatusId === "0"
                          }
                        >
                          <option value="">Select Status</option>
                          {hdStatusListData.map((list) => (
                            <option
                              key={list.hdStatusId}
                              value={list.hdStatusId}
                            >
                              {list.hdStatusName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Status is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  {/* <Col lg="4">
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
                  </Col> */}
                  

<Col lg="4">
  <Form.Group className="form-group mt-n4">
    <Form.Label htmlFor="trUploadPath">
      {t("Attach Files")}
    </Form.Label>
    <div className="form-control-wrap">
      <Form.Control
        type="file"
        id="hdAttachFiles"
        name="hdAttachFiles"
        onChange={handleImageChange} // File input handler remains the same
      />
    </div>
  </Form.Group>

  <Form.Group className="form-group mt-3 d-flex justify-content-center">
                          {image ? (
                            <>
                              {image.type.startsWith("image/") ||
                              image.name.endsWith(".jpeg") ||
                              image.name.endsWith(".jpg") ||
                              image.name.endsWith(".png") ? (
                                <img
                                  style={{
                                    height: "300px",
                                    width: "auto",
                                    objectFit: "cover",
                                  }}
                                  src={URL.createObjectURL(image)}
                                  alt="Uploaded Image"
                                />
                              ) : image.type === "application/pdf" ? (
                                <embed
                                  src={URL.createObjectURL(image)}
                                  type="application/pdf"
                                  width="300px"
                                  height="300px"
                                />
                              ) : image.name.endsWith(".docx") ? (
                                <p>
                                  Preview not available for .docx files. File
                                  name: {image.name}
                                </p>
                              ) : (
                                <p>
                                  Preview not available for this file type:{" "}
                                  {image.name}
                                </p>
                              )}
                            </>
                          ) : (
                            <p>No file selected or file was canceled.</p>
                          )}
                        </Form.Group>

  {/* Show preview and download option for the uploaded file */}
  {/* <Form.Group className="form-group mt-3 d-flex flex-column align-items-center">
    {attachFiles && attachFiles.name ? (
      <>
        {attachFiles.type.startsWith('image/') || 
          attachFiles.name.endsWith('.jpeg') || 
          attachFiles.name.endsWith('.jpg') || 
          attachFiles.name.endsWith('.png') ? ( // Check if the uploaded file is an image
          <img
            style={{ height: "300px", width: "auto", objectFit: "cover" }} // Larger size for image preview
            src={URL.createObjectURL(attachFiles)}
            alt="Uploaded Image"
          />
        ) : attachFiles.type === 'application/pdf' ? ( // Check if the uploaded file is a PDF
          <embed
            src={URL.createObjectURL(attachFiles)}
            type="application/pdf"
            width="300px" // Larger size for PDF preview
            height="300px"
          />
        ) : attachFiles.name.endsWith('.docx') ? ( // Handle `.docx` files
          <p>Preview not available for .docx files. File name: {attachFiles.name}</p>
        ) : (
          <p>Preview not available for this file type: {attachFiles.name}</p> // Fallback for unsupported file types
        )}

        {/* Download link for all file types */}
        {/* <a
          href={URL.createObjectURL(attachFiles)}
          download={attachFiles.name}
          className="btn btn-primary mt-3"
        >
          {t("Download")} {attachFiles.name}
        </a>
      </>
    ) : (
      <p>{t("No file selected or file was canceled.")}</p>
    )}
  </Form.Group> */}
  
  </Col>  

  
  
                        

                  <div className="gap-col">
                    <ul className="d-flex align-items-start justify-content-start gap g-3">
                      <li>
                        {/* <Button type="button" variant="primary" onClick={postData}> */}
                        <Button type="submit" variant="primary">
                        {t("save")}
                        </Button>
                      </li>
                      <li>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={clear}
                        >
                          {t("Create New Ticket")}
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
