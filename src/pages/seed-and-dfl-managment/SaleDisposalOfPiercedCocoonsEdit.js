import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function SaleDisposalOfPiercedCocoonsEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "quantityInKgs" || name === "ratePerKg") {
      const quantityInKgs = name === "quantityInKgs" ? parseInt(value) : data.quantityInKgs;
      const ratePerKg = name === "ratePerKg" ? parseInt(value) : data.ratePerKg;
      const calculatedPrice = (quantityInKgs*ratePerKg);
      setData(prevData => ({ ...prevData, percentageImproved: calculatedPrice }));
      
    }
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDataDisposalDate = !!data.dateOfDisposal;

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
        .post(baseURLSeedDfl + `Disposal-Pierced/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              lotNumber: "",
              raceId: "",
              dateOfDisposal: "",
              merchantNameAndAddress:"",
              numberOfCocoons: "",
              quantityInKgs: "",
              ratePerKg: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      lotNumber: "",
      raceId: "",
      dateOfDisposal: "",
      merchantNameAndAddress:"",
      numberOfCocoons: "",
      quantityInKgs: "",
      ratePerKg: "",
    });
  };


  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `Disposal-Pierced/get-info-by-id/${id}`)
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
  }, [id]);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL + `raceMaster/get-all`)
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

   // to get Lot
   const [lotListData, setLotListData] = useState([]);

   const getLotList = () => {
     const response = api
       .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
       .then((response) => {
         setLotListData(response.data);
       })
       .catch((err) => {
         setLotListData([]);
       });
   };
 
   useEffect(() => {
     getLotList();
   }, []);

   
  const navigate = useNavigate();

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      text: message,
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
    }).then(() => navigate("#"));
  };
  return (
    <Layout title="Edit Sale/Disposal of Pierced Cocoons">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Sale/Disposal of Pierced Cocoons</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sale-disposal-of-pierced-cocoons-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sale-disposal-of-pierced-cocoons-list"
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
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Edit Sale/Disposal of Pierced Cocoons
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
              <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                    Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option
                              key={list.id}
                              value={list.lotNumber}
                            >
                              {list.lotNumber}
                            </option>
                          ))):""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Lot Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
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
                          name="raceId"
                          value={data.raceId}
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

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Date of disposal
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                    {isDataDisposalDate && (
                      <DatePicker
                        selected={new Date(data.dateOfDisposal)}
                        onChange={(date) =>
                          handleDateChange(date, "dateOfDisposal")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        // minDate={new Date()}
                        required
                      />
                      )}
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Name and address of the PC Merchant
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="merchantNameAndAddress"
                        name="merchantNameAndAddress"
                        value={data.merchantNameAndAddress}
                        onChange={handleInputs}
                        // maxLength="4"
                        type="text"
                        placeholder="Enter Name and address of the PC Merchant"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Name and address of the PC Merchant is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      Number of cocoons
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfCocoons"
                        name="numberOfCocoons"
                        value={data.numberOfCocoons}
                        onChange={handleInputs}
                        type="number"
                        placeholder="Enter Number of cocoons"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Number of cocoons is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                    Cocoons Quantity in kgs
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="quantityInKgs"
                        name="quantityInKgs"
                        value={data.quantityInKgs}
                        onChange={handleInputs}
                        type="number"
                        placeholder="Enter Quantity in kgs"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Quantity in kgs is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      Rate per Kgs
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="ratePerKg"
                        name="ratePerKg"
                        value={data.ratePerKg}
                        onChange={handleInputs}
                        type="number"
                        placeholder="Enter Rate per Kgs"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Rate per Kgs is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      Total Amount (In Rs)
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="totalAmount"
                        name="totalAmount"
                        value={data.totalAmount}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Total Amount"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Total Amount is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col mt-1">
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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

export default SaleDisposalOfPiercedCocoonsEdit;
