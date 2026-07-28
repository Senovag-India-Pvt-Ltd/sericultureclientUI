import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable, { createTheme } from "react-data-table-component";

import { Link, useParams } from "react-router-dom";

import axios from "axios";

import { Icon, Select } from "../../components";

import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ChawkidistributiontoFarmersEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const { t } = useTranslation();

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "numbersOfDfls" || name === "ratePer100Dfls") {
      const numberOfDfls = name === "numbersOfDfls" ? parseInt(value) : data.numbersOfDfls;
      const ratePer100Dfls = name === "ratePer100Dfls" ? parseInt(value) : data.ratePer100Dfls;
      const calculatedPrice = (numberOfDfls * ratePer100Dfls) / 100;
      setData(prevData => ({ ...prevData, price: calculatedPrice }));
    }

    if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "fruitsId" && value.length === 16) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    } 
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // const formatDate = (date) => {
  //   if (!date) return ""; // Handle null or undefined dates
  //   return (
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     date.getDate().toString().padStart(2, "0")
  //   );
  // };


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
      // const formattedReleaseDate = formatDate(data.dateOfMothEmergence);
      // const formattedBoxingDate = formatDate(data.laidOnDate);
      // const payload = {
      //   ...data,
      //   dateOfMothEmergence: formattedReleaseDate,
      //   laidOnDate: formattedBoxingDate,
      // };

      api
        .post(baseURL + `Chawki-distribution/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
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
              hobli:"",
              tsc: "",
              soldAfter1stOr2ndMould: "",
              ratePer100Dfls: "",
              price: "",
              dispatchDate: "",
              hatchingDate: "", 
              });
              setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () =>{
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
      hobli:"",
      tsc: "",
      soldAfter1stOr2ndMould: "",
      ratePer100Dfls: "",
      price: "",
      dispatchDate: "",
      hatchingDate: "",  
    });
  }

  // const [chawkiList ,setChawkiList]= useState({
  //   chawki_id: "",
  // })

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURL + `Chawki-distribution/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, []);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

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

  const isDataDispatchSet = !!data.dispatchDate;
  const isDataHatchingSet = !!data.hatchingDate;

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    });
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/chawki-distribution"));
  };

  return (
    <Layout title="Edit Chawki Distribution">
      <style>{editChawkiDistributionStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Edit Chawki Distribution")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/chawki-distribution-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/chawki-distribution-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-1 ">
            <Card className="sh-section-card">
              <Card.Header className="sh-section-header">
                <Icon name="search" />
                <span>{t("FRUITS ID")}</span>
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                  <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        {t("FRUITS ID")}<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          type="fruitsId"
                          name="fruitsId"
                          value={data.fruitsId}
                          onChange={handleInputs}
                          placeholder={t("Enter FRUITS ID")}
                          required
                          maxLength= "16"
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Fruits ID Should Contain 16 digits")}
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
              <Card className="sh-section-card">
                <Card.Header className="sh-section-header">
                  <Icon name="package" />
                  <span>{t("Chawki Sales Details")}</span>
                </Card.Header>
                  <Card.Body>
                      <Row className="g-gs">
                      <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                          {t("Farmer’s name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerName"
                            name="farmerName"
                            value={data.farmerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Farmer’s name")}
                            required
                          />
                           <Form.Control.Feedback type="invalid">
                          {t("Farmer Name is required")}
                        </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                          {t("Father’s Name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherName"
                            name="fatherName"
                            value={data.fatherName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Father Name")}
                            required
                          /> 
                          <Form.Control.Feedback type="invalid">
                            {t("Father Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                          {t("Lot Number")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lotNumberRsp"
                            name="lotNumberRsp"
                            value={data.lotNumberRsp}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Lot Number")}
                            required
                            // maxLength="6"
                          />
                           <Form.Control.Feedback type="invalid">
                            {t("Lot Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="4">
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
                    </Col> */}

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Number of DFL’s")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numbersOfDfls"
                            name="numbersOfDfls"
                            value={data.numbersOfDfls}
                            onChange={handleInputs}
                            type="text"
                            maxLength="4"
                            placeholder={t("Number of DFL’s")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Number of DFL’s is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Rate per 100 DFLs")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ratePer100Dfls"
                            name="ratePer100Dfls"
                            value={data.ratePer100Dfls}
                            onChange={handleInputs}
                            type="text"
                            maxLength="4"
                            placeholder={t("Enter Rate per 100 DFL")}
                            required
                          />
                           <Form.Control.Feedback type="invalid">
                          {t("Rate Per 100 DFL’s is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Price (in Rupees)")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="price"
                            name="price"
                            value={data.price}
                            onChange={handleInputs}
                            type="number"
                            placeholder={t("Price (in Rupees)")}
                            readOnly
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">{t("Source of DFLs")}<span className="text-danger">*</span></Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="dflsSource"
                            name="dflsSource"
                            value={data.dflsSource}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Source")}
                            required
                          />
                           <Form.Control.Feedback type="invalid">
                           {t("Source of DFLs is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Race")}<span className="text-danger">*</span>
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
                              <option value="">{t("Select Race")}</option>
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
                            {t("Race is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("TSC")}<span className="text-danger">*</span>
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
                            <option value="">{t("Select TSC")}</option>
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
                            {t("TSC is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                    <Form.Label>{t("Sold after 1st/2nd/3rd Moult")}<span className="text-danger">*</span></Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="soldAfter1stOr2ndMould"
                        value={data.soldAfter1stOr2ndMould}
                        onChange={handleInputs}
                      >
                      <option value="">{t("Select")}</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        {/* <option value="3">Other</option> */}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Sold after 1st/2nd/3rd Moult is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  </Col>

                          
                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                      {t("Hatching Date")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                      <div className="form-control-wrap">
                        {isDataHatchingSet && (
                          <DatePicker
                            selected={new Date(data.hatchingDate)}
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "hatchingDate"
                              )
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        )}
                      </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="sordfl">
                     {t("Dispatch Date")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                      <div className="form-control-wrap">
                        {isDataDispatchSet && (
                          <DatePicker
                            selected={new Date(data.dispatchDate)}
                            onChange={(date) =>
                              handleDateChange(date, "dispatchDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        )}
                      </div>
                      </Form.Group>
                    </Col>
                    </Row>
                </Card.Body>
              </Card>
            </Block>


            <Block className="mt-3">
              <Card className="sh-section-card">
                <Card.Header className="sh-section-header">
                  <Icon name="map-pin" />
                  <span>{t("Address")}</span>
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                  <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("State")}<span className="text-danger">*</span>
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
                            <option value="">{t("Select State")}</option>
                            {stateListData.map((list) => (
                              <option key={list.stateId} value={list.stateId}>
                                {list.stateName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("State Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("District")}<span className="text-danger">*</span>
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
                            <option value="">{t("Select District")}</option>
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
                            {t("District Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Taluk")}<span className="text-danger">*</span>
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
                            <option value="">{t("Select Taluk")}</option>
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
                            {t("Taluk Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg ="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Hobli")}<span className="text-danger">*</span>
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
                            <option value="">{t("Select Hobli")}</option>
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
                            {t("Hobli Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Village")}<span className="text-danger">*</span>
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
                            <option value="">{t("Select Village")}</option>
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
                            {t("Village Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              </Block>

              <div className="gap-col sh-actions-bar">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>{t("Update")}</span>
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
                    <span>{t("Cancel")}</span>
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

const editChawkiDistributionStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-section-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #d9e2ec;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 3px rgba(59, 141, 214, 0.15);
  }
  .sh-actions-bar {
    margin-top: 8px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
  }
`;

export default ChawkidistributiontoFarmersEdit;