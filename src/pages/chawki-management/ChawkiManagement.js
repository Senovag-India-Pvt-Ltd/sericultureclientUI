import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";

import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ChawkiManagement() {
  const [data, setData] = useState({
    farmerName: "",
    fatherName: "",
    fruitsId: "",
    dflsSource: "",
    raceOfDfls: "",
    numbersOfDfls: "",
    lotNumberRsp: "",
    lotNumberCrc: "",
    village: "",
    district: "",
    state: "",
    taluk: "",
    hobli: "",
    tsc: "",
    soldAfter1stOr2ndMould: "",
    ratePer100Dfls: "",
    price: "",
    dispatchDate: null,
    hatchingDate: "",
  });

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "numbersOfDfls" || name === "ratePer100Dfls") {
      const numberOfDfls =
        name === "numbersOfDfls" ? parseInt(value) : data.numbersOfDfls;
      const ratePer100Dfls =
        name === "ratePer100Dfls" ? parseInt(value) : data.ratePer100Dfls;
      const calculatedPrice = (numberOfDfls * ratePer100Dfls) / 100;
      setData((prevData) => ({ ...prevData, price: calculatedPrice }));
    }


    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    } 
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(baseURL + `chowkimanagement/add-info`, data)
        .then((response) => {
          // debugger;
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.receiptNo);
            setData({
              farmerName: "",
              fatherName: "",
              fruitsId: "",
              dflsSource: "",
              raceOfDfls: "",
              numbersOfDfls: "",
              lotNumberRsp: "",
              lotNumberCrc: "",
              village: "",
              district: "",
              state: "",
              taluk: "",
              hobli: "",
              tsc: "",
              soldAfter1stOr2ndMould: "",
              ratePer100Dfls: "",
              price: "",
              dispatchDate: null,
              hatchingDate: "",
            });
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
      farmerName: "",
      fatherName: "",
      fruitsId: "",
      dflsSource: "",
      raceOfDfls: "",
      numbersOfDfls: "",
      lotNumberRsp: "",
      lotNumberCrc: "",
      village: "",
      district: "",
      state: "",
      taluk: "",
      hobli: "",
      tsc: "",
      soldAfter1stOr2ndMould: "",
      ratePer100Dfls: "",
      price: "",
      dispatchDate: null,
      hatchingDate: "",
    });
  };

  const search = () => {
    api
      .post(
        "http://13.200.62.144:8000/farmer-registration/v1/farmer/get-farmer-details-by-fruits-id-or-farmer-number-or-mobile-number",
        { fruitsId: data.fruitsId }
      )
      .then((response) => {
        console.log(response);
        if (!response.data.content.error) {
          if (response.data.content.farmerResponse) {
            const firstName = response.data.content.farmerResponse.firstName;
            const fatherName = response.data.content.farmerResponse.fatherName;
            setData((prev) => ({
              ...prev,
              farmerName: firstName,
              fatherName: fatherName,
            }));
          }
        } else {
          saveError(response.data.content.error_description);
        }
      })
      .catch((err) => {
        if (Object.keys(err.response.data.validationErrors).length > 0) {
          saveError(err.response.data.validationErrors);
        }
      });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL2 + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  // to get User
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

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getStateList = () => {
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
    getStateList();
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
    if (data.state) {
      getDistrictList(data.state);
    }
  }, [data.state]);

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
    if (data.district) {
      getTalukList(data.district);
    }
  }, [data.district]);

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
    if (data.taluk) {
      getHobliList(data.taluk);
    }
  }, [data.taluk]);

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
    if (data.hobli) {
      getVillageList(data.hobli);
    }
  }, [data.hobli]);

  // const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Receipt Number ${message}`,
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Sale Of Chawki Worms To Farmers">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sale Of Chawki Worms To Farmers</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/chawki-management-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/chawki-management-list"
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
          <Row className="g-1 ">
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
                          placeholder="Enter FRUITS ID"
                          required
                          maxLength= "16"
                        />
                        <Form.Control.Feedback type="invalid">
                          Fruits ID Should Contain 16 digits
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={search}
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
                <Card.Header>Chawki Sales Details</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                          Farmer’s name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerName"
                            name="farmerName"
                            value={data.farmerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Farmer’s name"
                            required
                          />
                           <Form.Control.Feedback type="invalid">
                          Farmer Name is required
                        </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                          Father’s Name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherName"
                            name="fatherName"
                            value={data.fatherName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Father Name"
                            required
                          /> 
                          <Form.Control.Feedback type="invalid">
                            Father Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                          Lot Number (of the RSP)<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lotNumberRsp"
                            name="lotNumberRsp"
                            value={data.lotNumberRsp}
                            onChange={handleInputs}
                            type="text"
                            placeholder="  Lot Number (of the RSP)"
                            required
                            // maxLength="6"
                          />
                           <Form.Control.Feedback type="invalid">
                            Lot Number(of the RSP) is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="lotNumberCrc">
                          Lot No. (CRC)<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lotNumberCrc"
                            name="lotNumberCrc"
                            value={data.lotNumberCrc}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Lot No. (CRC)"
                            required
                            // maxLength="6"
                          />
                          <Form.Control.Feedback type="invalid">
                            Lot Number(CRC) is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of DFL’s<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numbersOfDfls"
                            name="numbersOfDfls"
                            value={data.numbersOfDfls}
                            onChange={handleInputs}
                            type="text"
                            maxLength="4"
                            placeholder=" Number of DFL’s"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Number of DFL’s is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Rate per 100 DFLs<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ratePer100Dfls"
                            name="ratePer100Dfls"
                            value={data.ratePer100Dfls}
                            onChange={handleInputs}
                            type="text"
                            maxLength="4"
                            placeholder=" Enter Rate per 100 DFL"
                            required
                          />
                           <Form.Control.Feedback type="invalid">
                          Rate Per 100 DFL’s is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Price (in Rupees)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="price"
                            name="price"
                            value={data.price}
                            onChange={handleInputs}
                            type="number"
                            placeholder=" Price (in Rupees)"
                            readOnly
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">Source of DFLs<span className="text-danger">*</span></Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="dflsSource"
                            name="dflsSource"
                            value={data.dflsSource}
                            onChange={handleInputs}
                            type="text"
                            placeholder=" Enter Source"
                            required
                          />
                           <Form.Control.Feedback type="invalid">
                           Source of DFLs is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Race<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="raceOfDfls"
                              value={data.raceOfDfls}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Race</option>
                              {raceListData.map((list) => (
                                <option
                                  key={list.raceMasterId}
                                  value={list.raceMasterId}
                                >
                                  {list.raceMasterName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                            Race is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          TSC<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="tsc"
                            value={data.tsc}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.tsc === undefined || data.tsc === "0"
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
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                    <Form.Label> Sold after 1st/2nd/3rd Moult<span className="text-danger">*</span></Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="soldAfter1stOr2ndMould"
                        value={data.soldAfter1stOr2ndMould}
                        onChange={handleInputs}
                      >
                      <option value="">Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        {/* <option value="3">Other</option> */}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Sold after 1st/2nd/3rd Moult is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                      {/* <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                        Sold after 1st/2nd/3rd Moult<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="soldAfter1stOr2ndMould"
                            name="soldAfter1stOr2ndMould"
                            value={data.soldAfter1stOr2ndMould}
                            onChange={handleInputs}
                            type="number"
                            max={3}
                            min={1}
                            placeholder=" Enter Sold after 1st/2nd/3rd Moult"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Sold after 1st/2nd/3rd Moult is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group> */}
                    </Col>

                   

                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                      Hatching Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                      <div className="form-control-wrap">
                        
                        <DatePicker
                          selected={data.hatchingDate}
                          onChange={(date) =>
                            handleDateChange(date, "hatchingDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          required
                        />
                      </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                      Dispatch Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={data.dispatchDate}
                          onChange={(date) =>
                            handleDateChange(date, "dispatchDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          minDate={new Date()}
                          required
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
                <Card.Header>Address</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          State<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="state"
                            value={data.state}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.state === undefined || data.state === "0"
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
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          District<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="district"
                            value={data.district}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.district === undefined ||
                              data.district === "0"
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
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Taluk<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="taluk"
                            value={data.taluk}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.taluk === undefined || data.taluk === "0"
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

                    <Col lg ="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Hobli<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="hobli"
                            value={data.hobli}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.hobli === undefined || data.hobli === "0"
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
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Village<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="village"
                            value={data.village}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.village === undefined || data.village === "0"
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

export default ChawkiManagement;
