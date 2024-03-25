import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
// import DatePicker from "../../../components/Form/DatePicker";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ReelerLicenceEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  // Virtual Bank Account
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
  });

  const [validated, setValidated] = useState(false);
  const [validatedVbAccount, setValidatedVbAccount] = useState(false);
  const [validatedVbAccountEdit, setValidatedVbAccountEdit] = useState(false);

  const [vbAccountList, setVbAccountList] = useState([]);
  const getVbDetailsList = () => {
    api
      .get(baseURL + `reeler-virtual-bank-account/get-by-reeler-id-join/${id}`)
      .then((response) => {
        setVbAccountList(response.data.content.reelerVirtualBankAccount);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setVbAccountList([]);
        editError(message);
      });
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => {
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (event) => {
    const withReelerId = {
      ...vbAccount,
      reelerId: id,
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedVbAccount(true);
    } else {
      event.preventDefault();
      if (vbAccount.ifscCode.length < 11 || vbAccount.ifscCode.length > 11) {
        return;
      }
      api
        .post(baseURL + `reeler-virtual-bank-account/add`, withReelerId)
        .then((response) => {
          getVbDetailsList();
          setShowModal(false);
        })
        .catch((err) => {
          getVbDetailsList();
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidatedVbAccount(true);
    }
  };

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/reeler-license-list"));
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

  // Handle Options
  // Market
  const handleMarketOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setVbAccount({
      ...vbAccount,
      marketMasterId: chooseId,
      marketMasterName: chooseName,
    });
  };

  const handleDelete = (i) => {
    api
      .delete(baseURL + `reeler-virtual-bank-account/delete/${i}`)
      .then((response) => {
        getVbDetailsList();
      })
      .catch((err) => {
        getVbDetailsList();
      });
  };

  //   const [vb, setVb] = useState({});
  const handleVbGet = (i) => {
    api
      .get(baseURL + `reeler-virtual-bank-account/get-join/${i}`)
      .then((response) => {
        setVbAccount(response.data.content);
        setShowModal2(true);
      })
      .catch((err) => {
        setVbAccount({});
      });
  };

  const handleEdit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidatedVbAccountEdit(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `reeler-virtual-bank-account/edit`, vbAccount)
        .then((response) => {
          getVbDetailsList();
          setShowModal2(false);
        })
        .catch((err) => {
          getVbDetailsList();
        });
      setValidatedVbAccountEdit(true);
    }
  };

  const handleVbInputs = (e) => {
    const { name, value } = e.target;
    setVbAccount({ ...vbAccount, [name]: value });

    if (name === "ifscCode" && (value.length < 11 || value.length > 11)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "ifscCode" && value.length === 11) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => {
    setShowModal2(false);
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
  };

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "mobileNumber" && value.length === 10) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }

    if (name === "ifscCode" && (value.length < 11 || value.length > 11)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "ifscCode" && value.length === 11) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
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
      if (data.mobileNumber.length < 10 || data.mobileNumber.length > 10) {
        return;
      }

      if (data.ifscCode.length < 11 || data.ifscCode.length > 11) {
        return;
      }

      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(baseURL + `reeler/edit`, data)
        .then((response) => {
          const reelerId = response.data.content.reelerId;
          if (reelerId) {
            handleMahajarUpload(reelerId);
          }
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setValidated(false);
          }
        })
        .catch((err) => {
          // setData({});
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  //   to get data from api
  const getIdList = () => {
    // setLoading(true);
    api
      .get(baseURL + `reeler/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        // setLoading(false);
        if (response.data.content.mahajarDetails) {
          getMahajarFile(response.data.content.mahajarDetails);
        }
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        // setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
    getVbDetailsList();
  }, [id]);

  // to get Caste
  const [casteListData, setCasteListData] = useState([]);

  const getCasteList = () => {
    api
      .get(baseURL2 + `caste/get-all`)
      .then((response) => {
        setCasteListData(response.data.content.caste);
      })
      .catch((err) => {
        setCasteListData([]);
      });
  };

  useEffect(() => {
    getCasteList();
  }, []);

  // to get Reeler Type
  const [reelerTypeListData, setReelerTypeListData] = useState([]);

  const getReelerTypeList = () => {
    api
      .get(baseURL2 + `reelerTypeMaster/get-all`)
      .then((response) => {
        setReelerTypeListData(response.data.content.reelerTypeMaster);
      })
      .catch((err) => {
        setReelerTypeListData([]);
      });
  };

  useEffect(() => {
    getReelerTypeList();
  }, []);

  // to get Education
  const [educationListData, setEducationListData] = useState([]);

  const getEducationList = () => {
    api
      .get(baseURL2 + `education/get-all`)
      .then((response) => {
        setEducationListData(response.data.content.education);
      })
      .catch((err) => {
        setEducationListData([]);
      });
  };

  useEffect(() => {
    getEducationList();
  }, []);

  // to get Machine Type
  const [machineTypeListData, setMachineTypeListData] = useState([]);

  const getMachineTypeList = () => {
    api
      .get(baseURL2 + `machine-type-master/get-all`)
      .then((response) => {
        setMachineTypeListData(response.data.content.machineTypeMaster);
      })
      .catch((err) => {
        setMachineTypeListData([]);
      });
  };

  useEffect(() => {
    getMachineTypeList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    api
      .get(baseURL2 + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    api
      .get(baseURL2 + `district/get-by-state-id/${_id}`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    api
      .get(baseURL2 + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    api
      .get(baseURL2 + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        setHobliListData(response.data.content.hobli);
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.talukId) {
      getHobliList(data.talukId);
    }
  }, [data.talukId]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    api
      .get(baseURL2 + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.hobliId) {
      getVillageList(data.hobliId);
    }
  }, [data.hobliId]);

  // to get Market
  const [marketMasterListData, setMarketMasterListData] = useState([]);

  const getMarketMasterList = () => {
    api
      .get(baseURL2 + `marketMaster/get-all`)
      .then((response) => {
        setMarketMasterListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketMasterListData([]);
      });
  };

  useEffect(() => {
    getMarketMasterList();
  }, []);

  // to get TSC
  const [chawkiListData, setChawkiListData] = useState([]);

  const getChawkiList = () => {
    const response = api
      .get(baseURL2 + `tscMaster/get-all`)
      .then((response) => {
        setChawkiListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setChawkiListData([]);
      });
  };

  useEffect(() => {
    getChawkiList();
  }, []);

  const handleRenewedDateChange = (date) => {
    console.log(data);
    console.log(date);
    const expirationDate = new Date(date);
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);
    // console.log(expirationDate.setFullYear(expirationDate.getFullYear() + 3));

    setData((prev) => ({
      ...prev,
      receiptDate: date,
      licenseExpiryDate: expirationDate,
    }));

    // setData(prev=>({
    //   ...prev,
    //   // receiptDate: date,
    //   licenseExpiryDate: date,
    // }));
  };

  // Display Image
  const [mahajar, setMahajar] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  const handleMahajarChange = (e) => {
    const file = e.target.files[0];
    setMahajar(file);
    setData((prev) => ({ ...prev, mahajarDetails: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handleMahajarUpload = async (reelerid) => {
    const parameters = `reelerId=${reelerid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", mahajar);

      const response = await api.post(
        baseURL + `reeler/upload-document?${parameters}`,
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

  // To get Photo from S3 Bucket
  const [selectedMahajarFile, setMahajarFile] = useState(null);

  const getMahajarFile = async (file) => {
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
      setMahajarFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/reeler-license-list"));
  };
  const updateError = (message) => {
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
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/reeler-license-list"));
  };

  // Display Document
  const [document, setDocument] = useState("");

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
  };

  return (
    <Layout title="Reeler License Edit">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reeler License Edit</Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Reeler License Edit List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Reeler License Edit
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/reeler-license-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/reeler-license-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        FRUITS ID<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          type="fruitsId"
                          name="fruitsId"
                          value={data.fruitsId}
                          onChange={handleInputs}
                          placeholder="Enter FRUITS ID "
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Fruits ID is required.
                        </Form.Control.Feedback>
                      </Col>
                      {/* <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          // onClick={display}
                        >
                          Search
                        </Button>
                      </Col> */}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Block className="mt-3">
              <Card>
                <Card.Header>Reeler Personal info</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="reelerName">
                          Reeler Name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelerName"
                            name="reelerName"
                            value={data.reelerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Reeler Name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Reeler Name is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="fatherName">
                          Father's/Husband's Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherName"
                            name="fatherName"
                            value={data.fatherName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Father's/Husband's Name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Fathers/Husband Name is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>DOB</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.dob ? new Date(data.dob) : null}
                            onChange={(date) => handleDateChange(date, "dob")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>Gender</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="gender"
                            value={data.gender}
                            onChange={handleInputs}
                          >
                            <option value="">Select Gender</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Third Gender</option>
                          </Form.Select>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          Caste<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="casteId"
                            value={data.casteId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.casteId === undefined || data.casteId === "0"
                            }
                          >
                            <option value="">Select Caste</option>
                            {casteListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.title}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Caste is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="mobileNumber">
                          Mobile Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mobileNumber"
                            name="mobileNumber"
                            value={data.mobileNumber}
                            onChange={handleInputs}
                            maxLength="10"
                            type="tel"
                            placeholder="Enter Mobile Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="emailId">Email ID</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="emailId"
                            name="emailId"
                            value={data.emailId}
                            onChange={handleInputs}
                            type="email"
                            placeholder="Enter Email"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>Assign To Inspect</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="assignToInspectId"
                            value={data.assignToInspectId}
                            onChange={handleInputs}
                          >
                            <option value="">Select TSC</option>
                            <option value="1">TSC(G)</option>
                            <option value="2">TSC(R)</option>
                            <option value="3">PCT</option>
                          </Form.Select>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label>
                          TSC<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="assignToInspectId"
                            value={data.assignToInspectId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.assignToInspectId === undefined || data.assignToInspectId === "0"
                            }
                          >
                            <option value="">Select TSC</option>
                            {chawkiListData.map((list) => (
                              <option
                                key={list.tscMasterId}
                                value={list.tscMasterId}
                              >
                                {list.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            TSC is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}
                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="arnNumber">
                          ARN Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="arnNumber"
                            name="arnNumber"
                            value={data.arnNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter ARN Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ARN Number is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="reelerNumber">
                          Reeler Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelerNumber"
                            name="reelerNumber"
                            value={data.reelerNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Reeler Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Reeler Number is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="wnumber">Ward Number</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="wardNumber"
                            name="wardNumber"
                            value={data.wardNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Ward Number"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>Education</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="educationId"
                            value={data.educationId}
                            onChange={handleInputs}
                          >
                            <option value="0">Select Education</option>
                            {educationListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="rationCard">
                          Ration Card
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="rationCard"
                            name="rationCard"
                            value={data.rationCard}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Ration Card Number"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="rrno">
                          Electricity RR Numbers
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="electricityRrNumber"
                            name="electricityRrNumber"
                            value={data.electricityRrNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Electricity RR Numbers"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="revenueDocument">
                          Revenue Document (e-Khata / Reeling Unit)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="revenueDocument"
                            name="revenueDocument"
                            value={data.revenueDocument}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Revenue Document"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="recipientId">
                          Recipient ID(From Khazane)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="recipientId"
                            name="recipientId"
                            value={data.recipientId}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Recipient ID"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="representativeNameAddress">
                          Representative/Agent name and Address
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="representativeNameAddress"
                            name="representativeNameAddress"
                            value={data.representativeNameAddress}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Representative/Agent name and Address"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>
                          Reeler Type <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="reelerTypeMasterId"
                            value={data.reelerTypeMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.reelerTypeMasterId === undefined ||
                              data.reelerTypeMasterId === "0"
                            }
                          >
                            <option value="">Select Reeler Type</option>
                            {reelerTypeListData.map((list) => (
                              <option
                                key={list.reelerTypeMasterId}
                                value={list.reelerTypeMasterId}
                              >
                                {list.reelerTypeMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Reeler Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      {/* <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="gpsLat">
                          GPS Coordinates of reeling unit
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="gpsLat"
                            name="gpsLat"
                            value={data.gpsLat}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter GPS Coordinates of reeling unit"
                          />
                        </div>
                      </Form.Group> */}
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="chakbandi">
                          GPS Coordinates of reeling unit
                        </Form.Label>
                        <Row>
                          <Col lg="6">
                            <Form.Control
                              id="chakbandiLng"
                              name="chakbandiLng"
                              value={data.chakbandiLng}
                              onChange={handleInputs}
                              placeholder="Enter Longitude"
                            />
                          </Col>

                          <Col lg="6">
                            <Form.Control
                              id="chakbandiLat"
                              name="chakbandiLat"
                              value={data.chakbandiLat}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Latitude"
                            />
                          </Col>
                        </Row>
                        {/* <div className="form-control-wrap">
                        <Form.Control
                          id="chakbandi"
                          type="text"
                          placeholder="Enter Chakbandi Details"
                        />
                      </div> */}
                      </Form.Group>
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="passbook">
                          Passbook Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="passbookNumber"
                            name="passbookNumber"
                            value={data.passbookNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Passbook Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Passbook Number is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="reelunt">
                          Reeling Unit Boundary(In Sqft)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelingUnitBoundary"
                            name="reelingUnitBoundary"
                            value={data.reelingUnitBoundary}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Reeling Unit Boundary"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          Machine Type<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="machineTypeId"
                            value={data.machineTypeId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.machineTypeId === undefined ||
                              data.machineTypeId === "0"
                            }
                          >
                            <option value="0">Select Machine Type</option>
                            {machineTypeListData.map((list) => (
                              <option
                                key={list.machineTypeId}
                                value={list.machineTypeId}
                              >
                                {list.machineTypeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Machine Type is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>Date of Machine Installation</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.dateOfMachineInstallation
                                ? new Date(data.dateOfMachineInstallation)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "dateOfMachineInstallation"
                              )
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="numberOfBasins">
                          Number of Basins/Charaka
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelingUnitBoundary"
                            name="reelingUnitBoundary"
                            value={data.reelingUnitBoundary}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Number of Basins/Charaka"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="loanDetails">
                          Loan Details
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="loanDetails"
                            name="loanDetails"
                            value={data.loanDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Number of Loan Details"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>Inspection Date</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.inspectionDate
                                ? new Date(data.inspectionDate)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(date, "inspectionDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="photoPath">
                          Upload Mahajar Details(Pdf/jpg/png)(Max:2mb)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="mahajarDetails"
                            name="mahajarDetails"
                            // value={data.trUploadPath}
                            onChange={handleMahajarChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {mahajar ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(mahajar)}
                          />
                        ) : (
                          selectedMahajarFile && (
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedMahajarFile}
                              alt="Selected File"
                            />
                          )
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header>Address</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label>
                          State<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="stateId"
                            value={data.stateId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.stateId === undefined || data.stateId === "0"
                            }
                          >
                            <option value="0">Select State</option>
                            {stateListData.map((list) => (
                              <option key={list.stateId} value={list.stateId}>
                                {list.stateName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            State Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          District<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="districtId"
                            value={data.districtId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.districtId === undefined ||
                              data.districtId === "0"
                            }
                          >
                            <option value="">Select District</option>
                            {districtListData && districtListData.length
                              ? districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
                                    {list.districtName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            District Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          Taluk<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="talukId"
                            value={data.talukId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.talukId === undefined || data.talukId === "0"
                            }
                          >
                            <option value="">Select Taluk</option>
                            {talukListData && talukListData.length
                              ? talukListData.map((list) => (
                                  <option
                                    key={list.talukId}
                                    value={list.talukId}
                                  >
                                    {list.talukName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Taluk Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Hobli<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="hobliId"
                            value={data.hobliId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.hobliId === undefined || data.hobliId === "0"
                            }
                          >
                            <option value="">Select Hobli</option>
                            {hobliListData && hobliListData.length
                              ? hobliListData.map((list) => (
                                  <option
                                    key={list.hobliId}
                                    value={list.hobliId}
                                  >
                                    {list.hobliName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Hobli Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group mt-3">
                        <Form.Label>Village</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="villageId"
                            value={data.villageId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.villageId === undefined ||
                              data.villageId === "0"
                            }
                          >
                            <option value="">Select Village</option>
                            {villageListData && villageListData.length
                              ? villageListData.map((list) => (
                                  <option
                                    key={list.villageId}
                                    value={list.villageId}
                                  >
                                    {list.villageName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Village Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="pincode">
                          Pin Code<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="pincode"
                            name="pincode"
                            value={data.pincode}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Pin Code"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Pincode is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="address">
                          Address<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            as="textarea"
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Address"
                            rows="2"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Address is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header>License Details</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="recipientId">
                          Receipt number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="recipientId"
                            name="recipientId"
                            value={data.recipientId}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Receipt number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Receipt number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="reelingLicenseNumber">
                          Reeling License Number
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelingLicenseNumber"
                            name="reelingLicenseNumber"
                            value={data.reelingLicenseNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Reeling License Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Reeling License Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="memberLoanDetails">
                          Member of RCS/FPO/Others
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="memberLoanDetails"
                            name="memberLoanDetails"
                            value={data.memberLoanDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Member of RCS/FPO/Others"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="feeAmount">Fee Amount</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="feeAmount"
                            name="feeAmount"
                            value={data.feeAmount}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Fee Amount"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>Function of the Unit</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="functionOfUnit"
                            value={data.functionOfUnit}
                            onChange={handleInputs}
                          >
                            <option value="">Select</option>
                            <option value="1">Yes</option>
                            <option value="2">No</option>
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>Receipt Date</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.receiptDate
                                ? new Date(data.receiptDate)
                                : null
                            }
                            onChange={(date) =>
                              handleRenewedDateChange(date, "receiptDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>License Expiry Date</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={
                              data.licenseExpiryDate
                                ? new Date(data.licenseExpiryDate)
                                : null
                            }
                            onChange={(date) =>
                              handleDateChange(date, "licenseExpiryDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
                            className="form-control"
                            readOnly
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header>Chakbandi Details</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="mahajarEast">
                          East<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarEast"
                            name="mahajarEast"
                            value={data.mahajarEast}
                            onChange={handleInputs}
                            type="text"
                            placeholder="East"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            This Field is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="mahajarWest">
                          West<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarWest"
                            name="mahajarWest"
                            value={data.mahajarWest}
                            onChange={handleInputs}
                            type="text"
                            placeholder="West"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            This Field is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="mahajarNorth">
                          North<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarNorth"
                            name="mahajarNorth"
                            value={data.mahajarNorth}
                            onChange={handleInputs}
                            type="text"
                            placeholder="North"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            This Field is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="mahajarSouth">
                          South<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarSouth"
                            name="mahajarSouth"
                            value={data.mahajarSouth}
                            onChange={handleInputs}
                            type="text"
                            placeholder="South"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            This Field is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header>Bank Account Details</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="bankName">
                          Bank Name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="bankName"
                            name="bankName"
                            value={data.bankName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Bank Name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Bank Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="branchName">
                          Branch Name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="branchName"
                            name="branchName"
                            value={data.branchName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Branch Name"
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
                        <Form.Label htmlFor="accno">
                          Bank Account Number
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="bankAccountNumber"
                            name="bankAccountNumber"
                            value={data.bankAccountNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Bank Account Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Bank Account Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="ifsc">
                          IFSC Code<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ifscCode"
                            name="ifscCode"
                            value={data.ifscCode}
                            onChange={handleInputs}
                            maxLength="11"
                            type="text"
                            placeholder="Enter IFSC Code"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            IFSC Code is required and equals to 11 digit
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-3">
              <Card>
                <Card.Header>Virtual Bank Account</Card.Header>
                <Card.Body>
                  {/* <h3>Virtual Bank account</h3> */}
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                        <div className="form-control-wrap">
                          <ul className="">
                            <li>
                              <Button
                                className="d-md-none"
                                size="md"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>Add</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>Add</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {vbAccountList && vbAccountList.length > 0 ? (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div
                            className="table-responsive"
                            // style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  {/* <th></th> */}
                                  <th>Action</th>
                                  <th>Virtual Account Number</th>
                                  <th>Branch Name</th>
                                  <th>IFSC Code</th>
                                  <th>Market</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vbAccountList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() =>
                                            handleVbGet(
                                              item.reelerVirtualBankAccountId
                                            )
                                          }
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            handleDelete(
                                              item.reelerVirtualBankAccountId
                                            )
                                          }
                                          className="ms-2"
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.virtualAccountNumber}</td>
                                    <td>{item.branchName}</td>
                                    <td>{item.ifscCode}</td>
                                    <td>{item.marketMasterName}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Update
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/reeler-license-list"
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Virtual Bank Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form noValidate validated={validatedVbAccount} onSubmit={handleAdd}>
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="virtualAccountNumber">
                    Virtual Account Number<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="virtualAccountNumber"
                      name="virtualAccountNumber"
                      value={vbAccount.virtualAccountNumber}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder="Enter Virtual Account Number"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Virtual Account Number is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="branchNamevb">
                    Branch Name<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="branchNamevb"
                      name="branchName"
                      value={vbAccount.branchName}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder="Enter Branch Name"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Branch Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ifscCodevb">
                    IFSC Code<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ifscCodevb"
                      name="ifscCode"
                      value={vbAccount.ifscCode}
                      onChange={handleVbInputs}
                      type="text"
                      maxLength="11"
                      placeholder="Enter IFSC Code"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      IFSC Code is required and equals to 11 digit
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    Market<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                      onChange={handleMarketOption}
                      onBlur={() => handleMarketOption}
                      required
                      isInvalid={
                        vbAccount.marketMasterId === undefined ||
                        vbAccount.marketMasterId === "0"
                      }
                    >
                      <option value="">Select Market</option>
                      {marketMasterListData.length
                        ? marketMasterListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={`${list.marketMasterId}_${list.marketMasterName}`}
                            >
                              {list.marketMasterName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Market is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="primary">
                      Add
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Virtual Bank Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedVbAccountEdit}
            onSubmit={handleEdit}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="virtualAccountNumber">
                    Virtual Account Number<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="virtualAccountNumber"
                      name="virtualAccountNumber"
                      value={vbAccount.virtualAccountNumber}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder="Enter Virtual Account Number"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Virtual Account Number is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="branchNamevb">
                    Branch Name<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="branchNamevb"
                      name="branchName"
                      value={vbAccount.branchName}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder="Enter Branch Name"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Branch Name is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="ifscCodevb">
                    IFSC Code<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="ifscCodevb"
                      name="ifscCode"
                      value={vbAccount.ifscCode}
                      onChange={handleVbInputs}
                      type="text"
                      placeholder="Enter IFSC Code"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      IFSC Code is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>Market</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="marketMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                      onChange={handleMarketOption}
                      onBlur={() => handleMarketOption}
                      required
                      isInvalid={
                        vbAccount.marketMasterId === undefined ||
                        vbAccount.marketMasterId === "0"
                      }
                    >
                      <option value="">Select Market</option>
                      {marketMasterListData.length
                        ? marketMasterListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={`${list.marketMasterId}_${list.marketMasterName}`}
                            >
                              {list.marketMasterName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Market is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleEdit}> */}
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default ReelerLicenceEdit;
