import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "../../../components/Form/DatePicker";
import { Icon, Select } from "../../../components";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TransferReelerLicense() {
  const [data, setData] = useState({
    reelerName: "",
    wardNumber: "",
    passbookNumber: "",
    fatherName: "",
    educationId: "",
    relationshipId: "",
    reelingUnitBoundary: "",
    dob: "",
    rationCard: "",
    machineTypeId: "",
    gender: "",
    dateOfMachineInstallation: "",
    electricityRrNumber: "",
    casteId: "",
    revenueDocument: "",
    numberOfBasins: "",
    mobileNumber: "",
    recipientId: "",
    mahajarDetails: "",
    emailId: "",
    representativeNameAddress: "",
    loanDetails: "",
    assignToInspectId: "",
    gpsLat: "",
    gpsLng: "",
    inspectionDate: "",
    arnNumber: "",
    chakbandiLat: "",
    chakbandiLng: "",
    address: "",
    pincode: "",
    stateId: "",
    districtId: "",
    talukId: "",
    hobliId: "",
    villageId: "",
    licenseReceiptNumber: "",
    licenseExpiryDate: "",
    receiptDate: "",
    functionOfUnit: "",
    reelingLicenseNumber: "",
    feeAmount: "",
    memberLoanDetails: "",
    mahajarEast: "",
    mahajarWest: "",
    mahajarNorth: "",
    mahajarSouth: "",
    mahajarNorthEast: "",
    mahajarNorthWest: "",
    mahajarSouthEast: "",
    mahajarSouthWest: "",
    bankName: "",
    bankAccountNumber: "",
    branchName: "",
    ifscCode: "",
    status: "",
    licenseRenewalDate: "",
    transferReelerId: "",
  });

  const [existingReelerName, setExistingReelerName] = useState("");

  const [validated, setValidated] = useState(false);

  // const { id } = useParams();
  // const [data] = useState(EducationDatas);
  // const [reeler, setReeler] = useState({});
  const [loading, setLoading] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
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
        .post(baseURL2 + `reeler/add`, {...data,transferReelerId:data.reelingLicenseNumber})
        .then((response) => {
          saveSuccess();
          api
            .delete(baseURL2 + `reeler/delete/${data.reelerId}`)
            .then((response) => {})
            .catch((err) => {});
        })
        .catch((err) => {
          setData({});
          saveError(err.response.data.validationErrors);
        });
      setValidated(true);
    }
  };

  const [isActive, setIsActive] = useState(false);
  const display = () => {
    const reelingLicenseNumber = licenseTransfer.reelingLicenseNumber;
    const response = api
      .get(
        baseURL2 +
          `reeler/get-by-reeling-license-number/${reelingLicenseNumber}`
      )
      .then((response) => {
        setData(response.data.content);
        setExistingReelerName(response.data.content.reelerName);
        setLoading(false);
      })
      .catch((err) => {
        setData({});
        setLoading(false);
      });
    setIsActive((current) => !current);
  };

  console.log(data);

  const [licenseTransfer, setLicenseTransfer] = useState({
    reelingLicenseNumber: "",
  });

  const handleLicenseTransferInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setLicenseTransfer({ ...licenseTransfer, [name]: value });
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
      html: Object.values(message).join("<br>"),
    });
  };

  // to get Caste
  const [casteListData, setCasteListData] = useState([]);

  const getCasteList = () => {
    const response = api
      .get(baseURL + `caste/get-all`)
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

  // to get Education
  const [educationListData, setEducationListData] = useState([]);

  const getEducationList = () => {
    const response = api
      .get(baseURL + `education/get-all`)
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
    const response = api
      .get(baseURL + `machine-type-master/get-all`)
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
    const response = api
      .get(baseURL + `state/get-all`)
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
    const response = api
      .get(baseURL + `district/get-by-state-id/${_id}`)
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
    const response = api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
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
    const response = api
      .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
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
    const response = api
      .get(baseURL + `village/get-by-hobli-id/${_id}`)
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

  // to get Relationship
  const [relationshipListData, setRelationshipListData] = useState([]);

  const getRelationshipList = () => {
    api
      .get(baseURL + `relationship/get-all`)
      .then((response) => {
        setRelationshipListData(response.data.content.relationship);
      })
      .catch((err) => {
        setRelationshipListData([]);
      });
  };

  useEffect(() => {
    getRelationshipList();
  }, []);

  return (
    <Layout title="Transfer of Reeler License">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Transfer of Reeler License</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                {/* <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link> */}
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2}>
                        License Transfer<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          id="reelingLicenseNumber"
                          name="reelingLicenseNumber"
                          value={licenseTransfer.reelingLicenseNumber}
                          onChange={handleLicenseTransferInputs}
                          type="text"
                          placeholder="Enter Reeler License Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          License Transfer is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        >
                          Search
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Block className="mt-3">
              <Card>
                <Card.Header>Enter Reeler Details</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="reelerName">
                          Existing Reeler Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelerName"
                            name="reelerName"
                            value={existingReelerName}
                            type="text"
                            placeholder="Enter Reeler Name"
                            required
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            Reeler Name is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="FarmerName">Farmer Photo</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="farmerName"
                          type="text"
                          placeholder="Enter Farmer Name"
                        />
                      </div>
                    </Form.Group> */}

                      <Form.Group className="form-group">
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

                      {/* <Form.Group className="form-group">
                        <Form.Label>DOB</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
                        <Form.Label>Caste</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="casteId"
                            value={data.casteId}
                            onChange={handleInputs}
                          >
                            <option value="0">Select Caste</option>
                            {casteListData.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.title}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="mobileNumber">
                          Mobile Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mobileNumber"
                            name="mobileNumber"
                            value={data.mobileNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Mobile Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
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
                      <Form.Group className="form-group">
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
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="reelerName">
                          License Transferred Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="reelerName"
                            name="reelerName"
                            // value={data.reelerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Reeler Name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Transferred Reeler Name is required.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
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
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="chakbandi">
                          Chakbandi Details(GPS Details)
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
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Relationship<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="relationshipId"
                            value={data.passbookNumber}
                            // value={familyMembers.relationshipId}
                            onChange={handleInputs}
                            required
                            isInvalid={
                              data.relationshipId === undefined ||
                              data.relationshipId === "0"
                            }
                          >
                            <option value="">Select Relationship</option>
                            {relationshipListData.map((list) => (
                              <option
                                key={list.relationshipId}
                                value={list.relationshipId}
                              >
                                {list.relationshipName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Relationship is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group">
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
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="reelunt">
                          Reeling Unit Boundary
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

                      <Form.Group className="form-group">
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
                            <option value="">Select Machine Type</option>
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

                      {/* <Form.Group className="form-group">
                        <Form.Label>Date of Machine Installation</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.dateOfMachineInstallation}
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "dateOfMachineInstallation"
                              )
                            }
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group">
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

                      {/* <Form.Group className="form-group">
                        <Form.Label htmlFor="mahajar">
                          Mahajar Details
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mahajarDetails"
                            name="mahajarDetails"
                            value={data.mahajarDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Number of Mahajar Details"
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group">
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

                      {/* <Form.Group className="form-group">
                        <Form.Label>Inspection Date</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.inspectionDate}
                            onChange={(date) =>
                              handleDateChange(date, "inspectionDate")
                            }
                          />
                        </div>
                      </Form.Group> */}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-4">
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
                            <option value="">Select State</option>
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

                      <Form.Group className="form-group">
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
                      <Form.Group className="form-group">
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
                      <Form.Group className="form-group">
                        <Form.Label>
                          Village<span className="text-danger">*</span>
                        </Form.Label>
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

                    <Col lg="4">
                      <Form.Group className="form-group">
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
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-4">
              <Card>
                <Card.Header>License Details</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group ">
                        <Form.Label htmlFor="licenseReceiptNumber">
                          Receipt number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="licenseReceiptNumber"
                            name="licenseReceiptNumber"
                            value={data.licenseReceiptNumber}
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

                      {/* <Form.Group className="form-group ">
                        <Form.Label>Receipt Date</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.receiptDate}
                            onChange={(date) =>
                              handleDateChange(date, "receiptDate")
                            }
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="memberLoanDetails">
                          Member of RCS/FPO/Others Loan Details
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="memberLoanDetails"
                            name="memberLoanDetails"
                            value={data.memberLoanDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Member of RCS/FPO/Others Loan Details"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      {/* <Form.Group className="form-group">
                        <Form.Label>License Expiry Date</Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.licenseExpiryDate}
                            onChange={(date) =>
                              handleDateChange(date, "licenseExpiryDate")
                            }
                          />
                        </div>
                      </Form.Group> */}

                      <Form.Group className="form-group">
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
                      <Form.Group className="form-group">
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
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <Block className="mt-4">
              <Card>
                <Card.Header>Chakbandi Details</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
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
                      <Form.Group className="form-group">
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
                      <Form.Group className="form-group">
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
                      <Form.Group className="form-group">
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

            <Block className="mt-4">
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

                      <Form.Group className="form-group">
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

                      <Form.Group className="form-group">
                        <Form.Label htmlFor="ifsc">
                          IFSC Code<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ifscCode"
                            name="ifscCode"
                            value={data.ifscCode}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter IFSC Code"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            IFSC Code is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Link to="#" className="btn btn-secondary border-0">
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

export default TransferReelerLicense;
