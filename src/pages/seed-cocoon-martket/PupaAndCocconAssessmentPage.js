import React, { useState,useEffect } from "react";
import { Card, Form, Row, Col, Button, Table, Modal } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Icon from "../../components/Icon/Icon";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2/src/sweetalert2.js";

const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function PupaAndCocoonAssessmentPage() {
  const [data, setData] = useState({
    marketAuctionId: "",
    testDate: "",
    noOfCocoonTakenForExamination: "",
    noOfDflFromFc: "",
    diseaseFree: "",
    diseaseType: "",
    noOfCocoonPerKg: "",
    meltPercentage: "",
    pupaTestResult: "",
    cocoonAssessmentResult: "",
    pupaCocoonStatus: "",
  });

const [listData, setListData] = useState([]);
const [page, setPage] = useState(0);
const countPerPage = 5;
const [totalRows, setTotalRows] = useState(0);
const [loading, setLoading] = useState(false);
const [farmerDetails, setFarmerDetails] = useState({});
const _params = { params: { pageNumber: page, size: countPerPage } };

const getList = () => {
  setLoading(true);

  const response = api
    .get(baseURL1 + `cocoon/getPupaCocoonAssessmentList`)
    .then((response) => {
      console.log(response.data);
      setListData(response.data);
      setFarmerDetails()
      // setTotalRows(response.data.content.totalItems);
      setLoading(false);
    })
    .catch((err) => {
      // setListData({});
      setLoading(false);
    });
};

useEffect(() => {
    getList();
  }, []);

  const [validated, setValidated] = useState(false);

  const postData = (event) => {
    const form = event.currentTarget;
  
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
  
      api
        .post(baseURL1 + `cocoon/saveBasePriceKGLot`, {
          ...data,
        })
        .then((response) => {
          if (response.data.errorCode === 0) {
            saveSuccess();
            setData({
              marketId: localStorage.getItem("marketId"),
              fixationDate: new Date(),
              pricePerKg: "",
            }); // Optionally reset the form
          } else if (response.data.errorCode === -1) {
            if (response.data.content) {
              saveError(response.data.content);
            } else if (response.data.errorMessages.length > 0) {
              saveError(response.data.errorMessages[0].message);
            } else {
              saveError(); // Default error if no specific message
            }
          }
        })
        .catch((err) => {
          saveError(); // Handle the error if the API call fails
        });
    }
  };

  // Below for modal window for personal details
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Below for modal window for FC details
  const [showModalFC, setShowModalFC] = useState(false);
  const handleShowModalFC = () => setShowModalFC(true);
  const handleCloseModalFC = () => setShowModalFC(false);

  // Below for modal window for Crop details
  const [showModalCrop, setShowModalCrop] = useState(false);
  const handleShowModalCrop = () => setShowModalCrop(true);
  const handleCloseModalCrop = () => setShowModalCrop(false);

  // Below for modal window for Initial Weighment
  const [showModalWeighment, setShowModalWeighment] = useState(false);
  const handleShowModalWeighment = () => setShowModalWeighment(true);
  const handleCloseModalWeighment = () => setShowModalWeighment(false);

  // Below for modal window for Initial Weighment
  const [showModalAssesment, setShowModalAssesment] = useState(false);
  const handleShowModalAssesment = () => setShowModalAssesment(true);
  const handleCloseModalAssesment = () => setShowModalAssesment(false);

  // Function to open modals with specific farmer details
const openModalWithDetails = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModal(); // Open personal details modal
};

const openModalWithFCDetails = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalFC(); // Open FC details modal
};

const openModalWithCropDetails = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalCrop(); // Open Crop details modal
};

const openModalWithWeighmentDetails = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalWeighment(); // Open Weighment details modal
};

// handle intial Weighment
const [validatedInitialWeighment, setValidatedInitialWeighment] =
useState(false);
const handleinitialWeighment = (e) => {
const form = e.currentTarget;
if (form.checkValidity() === false) {
  e.preventDefault();
  e.stopPropagation();
  setValidatedInitialWeighment(true);
} else {
  e.preventDefault();
  // setFamilyMembersList((prev) => [...prev, familyMembers]);
  // setFamilyMembers({
  //   relationshipId: "",
  //   farmerFamilyName: "",
  // });
  setShowModalWeighment(false);
  setValidatedInitialWeighment(false);
}
// e.preventDefault();
};



  // const styles = {
  //   ctstyle: {
  //     backgroundColor: "rgb(248, 248, 249, 1)",
  //     color: "rgb(0, 0, 0)",
  //     width: "50%",
  //   },
  //   top: {
  //     backgroundColor: "rgb(15, 108, 190, 1)",
  //     color: "rgb(255, 255, 255)",
  //     width: "50%",
  //     fontWeight: "bold",
  //     fontSize: "25px",
  //     textAlign: "center",
  //   },
  //   bottom: {
  //     fontWeight: "bold",
  //     fontSize: "25px",
  //     textAlign: "center",
  //   },
  //   sweetsize: {
  //     width: "100px",
  //     height: "100px",
  //   },
  // };
  const styles = {
    ctstyle: {
      fontWeight: 'bold',
      color: '#2e314a',
      backgroundColor: '#f8f9fa',
      padding: '10px 15px', // Keep some padding for cells
      fontSize: '1rem', // Font size for better readability
    },
    table: {
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      width: '100%', // Full width for the table
      tableLayout: 'fixed', // Use fixed layout for better control over column widths
    },
    modalHeader: {
      backgroundColor: '#0f6cbe',
      color: '#fff',
      textAlign: 'center',
      padding: '10px', // Reduced padding for a smaller header
      fontSize: '1.2rem', // Reduced font size for the header
    },
    modalTitle: {
      fontWeight: '600',
      fontSize: '1.2rem', // Reduced title font size
    },
    modalBody: {
      padding: '20px', // Padding around the body
      height: '100%', // Expand the body to full height
      overflowY: 'auto', // Allow scrolling if content overflows
    },
  };

  const [isDiseaseFree, setIsDiseaseFree] = useState("no"); // Initial state is "no"

  // Function to handle the change of radio buttons
  const handleRadioChange = (e) => {
    setIsDiseaseFree(e.target.value);
  };

  // Function to display the success message
const saveSuccess = () => {
  Swal.fire({
    icon: "success",
    title: "Allotted successfully",
    text: "You Can Proceed To Allotment",
  });
};

const saveError = (message = "Something went wrong!") => {
  Swal.fire({
    icon: "error",
    title: "Save attempt was not successful",
    text: message,
  });
};



  return (
    <Layout title="Pupa Testing And Cocoon Assessment">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Pupa Testing And Cocoon Assessment</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block>
        <Row className="g-3">
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Table striped bordered hover>
                    <thead>
                      <tr style={{ backgroundColor: '#0f6cbe', color: 'white', fontWeight: 'bold' }}>
                        <th>Action</th>
                        <th>FID</th>
                        <th>Farmer Name</th>
                        <th>Phone Number</th>
                        <th>Address Details</th>
                        <th>Crop Details</th>
                        <th>FC Details</th>
                        <th>Weighment Details</th>
                        {/* <th>Asses Now</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {listData.map((item, index) => (
                        <tr key={index}>
                        <td>
          <Button variant="primary" onClick={() => handleShowModalAssesment(item)}>Assess Now</Button>
        </td>
        <td>{item.fruitsId}</td>
        <td>{item.firstName}</td>
        <td>{item.mobileNumber}</td>
        <td>
          <div className="d-flex align-items-center" onClick={() => openModalWithDetails(item)}>
            <Icon name="info-fill" size="lg"></Icon>
            <span>Address Details</span>
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center" onClick={() => openModalWithCropDetails(item)}>
            <Icon name="info-fill" size="lg"></Icon>
            <span>Crop Details</span>
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center" onClick={() => openModalWithFCDetails(item)}>
            <Icon name="info-fill" size="lg"></Icon>
            <span>FC Details</span>
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center" onClick={() => openModalWithWeighmentDetails(item)}>
            <Icon name="info-fill" size="lg"></Icon>
            <span>Weighment Details</span>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
      <Modal.Header closeButton style={styles.modalHeader}>
        <Modal.Title style={styles.modalTitle}>Personal Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styles.modalBody}>
        <div className="d-flex justify-content-center">
          <Row className="g-5">
            <Col lg="12">
              <Table striped bordered hover responsive className="table-sm" style={styles.table}>
                <tbody>
                  <tr>
                    <td style={styles.ctstyle}>Farmer Number:</td>
                    <td>{farmerDetails?.farmerNumber || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Farmer Name:</td>
                    <td>{farmerDetails?.firstName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Father's/Husband's Name:</td>
                    <td>{farmerDetails?.fatherName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Phone Number:</td>
                    <td>{farmerDetails?.mobileNumber || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>TSC:</td>
                    <td>{farmerDetails?.tscName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>State:</td>
                    <td>{farmerDetails?.stateName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>District:</td>
                    <td>{farmerDetails?.districtName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Taluk:</td>
                    <td>{farmerDetails?.talukName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Village:</td>
                    <td>{farmerDetails?.villageName || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>

      <Modal show={showModalFC} onHide={handleCloseModalFC} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>FC Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center">
            <Row className="g-5">
              <Col
                lg="12"
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <h3>Fitness Certificate</h3>
                <img
                  src="https://5.imimg.com/data5/ANDROID/Default/2024/7/434434494/XL/GV/OX/14251721/prod-20240712-2228471980760355427493851-jpg-1000x1000.jpg"
                  alt="FC Details"
                  width="300"
                  height="300"
                />
              </Col>
            </Row>
            <Row className="g-5">
              <Col
                lg="12"
                className="d-flex justify-content-center align-items-center"
              >
                <Form.Group className="form-group mt-3">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Confirmed
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Row className="d-flex align-items-center">
                      <Col lg="auto">
                        <Form.Check
                          type="radio"
                          id="yes"
                          name="subsidyAvailed"
                          label="Yes"
                          value="yes"
                          // onChange={handleChange}
                          // checked={selected === "yes"}
                        />
                      </Col>
                      <Col lg="auto">
                        <Form.Check
                          type="radio"
                          id="no"
                          value="no"
                          name="subsidyAvailed"
                          defaultChecked
                          // onChange={handleChange}
                          // checked={selected === "no"}
                          label="No"
                        />
                      </Col>
                    </Row>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModalCrop} onHide={handleCloseModalCrop} size="lg">
      <Modal.Header closeButton style={styles.modalHeader}>
        <Modal.Title style={styles.modalTitle}>Crop Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styles.modalBody}>
        <div className="d-flex justify-content-center">
          <Row className="g-5 d-flex justify-content-center" style={{ width: "100%" }}>
            <Col lg="12"> {/* Use full width for the table */}
              <table className="table small table-bordered" style={styles.table}>
                {/* <thead>
                  <tr>
                    <th style={{ width: '40%', textAlign: 'left' }}>Field</th>
                    <th style={{ width: '60%', textAlign: 'left' }}>Details</th>
                  </tr>
                </thead> */}
                <tbody>
                  <tr>
                    <td style={styles.ctstyle}>No of DFL's:</td>
                    <td>{farmerDetails?.numbersOfDfls || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Lot No.:</td>
                    <td>{farmerDetails?.lotNumberRsp || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Source Name:</td>
                    <td>{farmerDetails?.dflsSource || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Variety:</td>
                    <td>{farmerDetails?.raceOfDfls || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
      <Modal
        show={showModalWeighment}
        onHide={handleCloseModalWeighment}
        size="lg"
      >
        <Modal.Header closeButton style={styles.modalHeader}>
        <Modal.Title style={styles.modalTitle}>Weighment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styles.modalBody}>
        <div className="d-flex justify-content-center">
          <Row className="g-5 d-flex justify-content-center" style={{ width: "100%" }}>
            <Col lg="12"> {/* Use full width for the table */}
              <table className="table small table-bordered" style={styles.table}>
                
                <tbody>
                  <tr>
                    <td style={styles.ctstyle}>Initial Weighment:</td>
                    <td>{farmerDetails?.initialWeighment || 'N/A'}</td>
                  </tr>
                  
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      </Modal>

      <Modal
        show={showModalAssesment}
        onHide={handleCloseModalAssesment}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Crop Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedInitialWeighment}
            onSubmit={handleinitialWeighment}
          >
            <Row className="g-3">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  No. of Cocoons Taken for Examination
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="farmerFamilyName"
                      name="farmerFamilyName"
                      // value={familyMembers.farmerFamilyName}
                      // onChange={handleFMInputs}
                      type="text"
                      placeholder="Enter No. of Cocoons Taken for Examination"
                      // required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  No. of DFLs From the Fc
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="farmerFamilyName"
                      name="farmerFamilyName"
                      // value={familyMembers.farmerFamilyName}
                      // onChange={handleFMInputs}
                      type="text"
                      placeholder="Enter No. of DFL’s from FC"
                      // required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>

              {/* <Row className="g-5"> */}
      <Col
        lg="6"
        // className="d-flex justify-content-center align-items-center"
      >
        <Form.Group className="form-group mt-3">
          <Form.Label style={{ fontSize: "20px" }}>Disease Free</Form.Label>
          <div className="form-control-wrap">
            <Row className="d-flex align-items-center">
              <Col lg="auto">
                <Form.Check
                  type="radio"
                  id="yes"
                  name="diseaseFree"
                  label="Yes"
                  value="yes"
                  onChange={handleRadioChange}
                  checked={isDiseaseFree === "yes"}
                />
              </Col>
              <Col lg="auto">
                <Form.Check
                  type="radio"
                  id="no"
                  value="no"
                  name="diseaseFree"
                  onChange={handleRadioChange}
                  checked={isDiseaseFree === "no"}
                  label="No"
                />
              </Col>
            </Row>
          </div>

          {/* Conditionally render the disease name input field if "Yes" is selected */}
          {isDiseaseFree === "yes" && (
            <Form.Group className="mt-3">
              <Form.Label>Disease Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Disease Name"
                name="diseaseName"
              />
            </Form.Group>
          )}
        </Form.Group>
      </Col>
            <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  No. of Cocoons per Kg. 
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="farmerFamilyName"
                      name="farmerFamilyName"
                      // value={familyMembers.farmerFamilyName}
                      // onChange={handleFMInputs}
                      type="text"
                      placeholder="No. of Cocoons per Kg."
                      // required
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  Melt %
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="farmerFamilyName"
                      name="farmerFamilyName"
                      // value={familyMembers.farmerFamilyName}
                      // onChange={handleFMInputs}
                      type="text"
                      placeholder="Melt %"
                      // required
                    />
                  </div>
                </Form.Group>
              </Col>
    {/* </Row> */}


              <Col lg="12">
                <div className="d-flex gap g-2 justify-content-center">
                  <div className="gap-col">
                    {/* <Button variant="primary" onClick={handleinitialWeighment}> */}
                    <Button type="submit" variant="primary">
                      Proceed To Allotment
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button
                      variant="secondary"
                      onClick={handleCloseModalAssesment}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      </Block>
    </Layout>
  );
}

export default PupaAndCocoonAssessmentPage;
