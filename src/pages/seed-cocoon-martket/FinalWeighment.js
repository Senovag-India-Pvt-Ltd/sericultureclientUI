import React, { useState,useEffect } from "react";
import { Card, Form, Row, Col, Button, Table, Modal } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Icon from "../../components/Icon/Icon";
import { useNavigate } from "react-router-dom";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2/src/sweetalert2.js";

const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function FinalWeighment() {
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
  });

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };


const [listData, setListData] = useState([]);
const [page, setPage] = useState(0);
const countPerPage = 5;
const [totalRows, setTotalRows] = useState(0);
const [loading, setLoading] = useState(false);
const [farmerDetails, setFarmerDetails] = useState({});
const _params = { params: { pageNumber: page, size: countPerPage } };

const [marketAuctionId, setMarketAuctionId] = useState("");
const getList = () => {
  setLoading(true);

  api
    .get(baseURL1 + `cocoon/getFinalWeighmentList`)
    .then((response) => {
      console.log(response.data);
      setListData(response.data);
      
      // Assuming you're getting a list, pick the first item's marketAuctionId for demonstration.
      if (response.data.length > 0) {
        setMarketAuctionId(response.data[0].marketAuctionId); // Set the marketAuctionId
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
};

useEffect(() => {
    getList();
  }, []);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

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
            .post(baseURL1 + `cocoon/getFinalWeighmentList`, {
                ...data,
                marketAuctionId: marketAuctionId, // Use the marketAuctionId from state
            })
            .then((response) => {
                // Destructure the response to get relevant fields
                const { errorCode, content } = response.data;

                // Access the nested errorCode and content from body
                const nestedErrorCode = content?.body?.errorCode; // Accessing the nested errorCode
                const nestedContent = content?.body?.content; // Accessing the nested content message

                // Check if the response indicates success
                if (nestedErrorCode === 0) {
                    // Success condition based on nested errorCode
                    saveSuccess();
                    setData({
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
                    }); // Optionally reset the form
                } else if (nestedErrorCode === -1) {
                    // Handle the case when an assessment has already been done
                    if (nestedContent) {
                        saveError(nestedContent); // Use the nested content message for errors
                    } else {
                        saveError(); // Default error if no specific message
                    }
                } else {
                    // Handle unexpected error codes if necessary
                    saveError("Unexpected error occurred.");
                }
            })
            .catch((err) => {
                console.error(err);
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
    const [showModalPupaTesting, setShowModalPupaTesting] = useState(false);
    const handleShowModalPupaTesting = () => setShowModalPupaTesting(true);
    const handleCloseModalPupaTesting = () => setShowModalPupaTesting(false);

     // Below for modal window for Initial Weighment
     const [showModalCocoonAssessment, setShowModalCocoonAssessment] = useState(false);
     const handleShowModalCocoonAssessment = () => setShowModalCocoonAssessment(true);
     const handleCloseModalCocoonAssessment = () => setShowModalCocoonAssessment(false);

      // Below for modal window for Initial Weighment
      const [showModalBasePriceFixation, setShowModalBasePriceFixation] = useState(false);
      const handleShowModalBasePriceFixation = () => setShowModalBasePriceFixation(true);
      const handleCloseModalBasePriceFixation = () => setShowModalBasePriceFixation(false);

    

  // Below for modal window for Initial Weighment
  const [showModalAssesment, setShowModalAssesment] = useState(false);
  // const handleShowModalAssesment = () => setShowModalAssesment(true);
  const handleCloseModalAssesment = () => setShowModalAssesment(false);

  // const handleShowModalAssesment = (item) => {
  //   setMarketAuctionId(item.marketAuctionId); // Set marketAuctionId from the selected item
  //   setData(prevData => ({ ...prevData, marketAuctionId: item.marketAuctionId })); // Ensure data is set correctly
  //   setShowModalAssesment(true);
  // };

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

const openModalWithPupaTesting = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalPupaTesting(); // Open FC details modal
};

const openModalWithCocoonAssessment = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalCocoonAssessment(); // Open Crop details modal
};

const openModalWithBasePriceFixation = (item) => {
  setFarmerDetails(item); // Set the selected farmer's details
  handleShowModalBasePriceFixation(); // Open Weighment details modal
};

const navigate = useNavigate();
const handleShowModalAssesment = (item) => {
  // Any other logic before navigation (e.g., passing the item to state, showing modal, etc.)
  
  // Navigate to the desired route
  navigate('/seriui/weighment-for-seed-market');
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
  // const handleRadioChange = (e) => {
  //   setIsDiseaseFree(e.target.value);
  // };
  const handleRadioChange = (e) => {
    const { name, value } = e.target; // Use value for radio buttons
    setData((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the field based on the radio button's value
    }));
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
    <Layout title="Final Weighment Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Final Weighment Details</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block>
      <Form
          noValidate
          validated={validated}
          onSubmit={postData}
          className="mt-2"
        >
        <Row className="g-3">
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="12">
                  <Table striped bordered hover>
                  <thead>
                    <tr style={{ backgroundColor: '#0f6cbe', color: 'white', fontWeight: 'bold' }}>
                      <th style={{ width: '80px' }}>Action</th>
                      <th style={{ width: '50px' }}>Sl.No</th> {/* Custom width for Sl.No */}
                      <th style={{ width: '150px' }}>Date of Issuance of Bidding Slip</th>
                      <th style={{ width: '150px' }}>FID</th>
                      <th style={{ width: '150px' }}>Farmer Name</th>
                      <th style={{ width: '150px' }}>Phone Number</th>
                      <th style={{ width: '150px' }}>Personal Details</th>
                      <th style={{ width: '150px' }}>Crop Details</th>
                      <th style={{ width: '150px' }}>FC Details</th>
                      <th style={{ width: '150px' }}>Pupa Testing Result</th>
                      <th style={{ width: '150px' }}>Cocoon assessment Result</th>
                      <th style={{ width: '150px' }}>Weighment Details</th>
                      <th style={{ width: '100px' }}>Price</th>
                    </tr>
                  </thead>
                    <tbody>
                      {listData.map((item, index) => (
                        <tr key={index}>
                        <td>
                        <Button 
                          variant="primary" 
                          style={{ backgroundColor: 'white', color: 'red', fontWeight: 'bold', borderColor: 'red' }} 
                          onClick={() => handleShowModalAssesment(item)}
                        >
                          Click For Final Weighment
                        </Button>
                        </td>
                        <td>{item.serialNumber}</td>
                        <td>{item.marketAuctionDate}</td>
                        <td>{item.fruitsId}</td>
                        <td>{item.firstName}</td>
                        <td>{item.mobileNumber}</td>
                        <td>
                          <div className="d-flex align-items-center" onClick={() => openModalWithDetails(item)}>
                            <Icon name="info-fill" size="lg"></Icon>
                            {/* <span>Personal Details</span> */}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center" onClick={() => openModalWithCropDetails(item)}>
                            <Icon name="info-fill" size="lg"></Icon>
                            {/* <span>Crop Details</span> */}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center" onClick={() => openModalWithFCDetails(item)}>
                            <Icon name="info-fill" size="lg"></Icon>
                            {/* <span>FC Details</span> */}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center" onClick={() => openModalWithPupaTesting(item)}>
                            <Icon name="info-fill" size="lg"></Icon>
                            {/* <span>Pupa Testing Result</span> */}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center" onClick={() => openModalWithCocoonAssessment(item)}>
                            <Icon name="info-fill" size="lg"></Icon>
                            {/* <span>Cocoon Assessment Result</span> */}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center" onClick={() => openModalWithWeighmentDetails(item)}>
                            <Icon name="info-fill" size="lg"></Icon>
                            {/* <span>Weighment Details</span> */}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center" onClick={() => openModalWithBasePriceFixation(item)}>
                            <Icon name="info-fill" size="lg"></Icon>
                            {/* <span>Price</span> */}
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
        show={showModalBasePriceFixation}
        onHide={handleCloseModalBasePriceFixation}
        size="lg"
      >
        <Modal.Header closeButton style={styles.modalHeader}>
        <Modal.Title style={styles.modalTitle}>Price</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styles.modalBody}>
        <div className="d-flex justify-content-center">
          <Row className="g-5">
            <Col lg="12"> {/* Use full width for the table */}
            <Table striped bordered hover responsive className="table-sm" style={styles.table}>
              {/* <table> */}
                <tbody>
                  <tr>
                    <td style={styles.ctstyle}>Price:</td>
                    <td>{farmerDetails?.pricePerKg || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Fixation Date:</td>
                    <td>{farmerDetails?.fixationDate || 'N/A'}</td>
                  </tr>
                  
                </tbody>
              {/* </table> */}
              </Table>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      </Modal>

      <Modal
        show={showModalPupaTesting}
        onHide={handleCloseModalPupaTesting}
        size="lg"
      >
        <Modal.Header closeButton style={styles.modalHeader}>
        <Modal.Title style={styles.modalTitle}>Pupa Testing Result</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styles.modalBody}>
        <div className="d-flex justify-content-center">
          <Row className="g-5 d-flex justify-content-center" style={{ width: "100%" }}>
            <Col lg="12"> {/* Use full width for the table */}
            <Table striped bordered hover responsive className="table-sm" style={styles.table}>
                <tbody>
                  <tr>
                    <td style={styles.ctstyle}>No Of Cocoon Taken For Examination:</td>
                    <td>{farmerDetails?.noOfCocoonTakenForExamination || 'N/A'}</td>
                    </tr>

                    <tr>
                    <td style={styles.ctstyle}>No Of DFL From FC:</td>
                    <td>{farmerDetails?.noOfDFlFromFc || 'N/A'}</td>
                  </tr>

                  <tr>
                    <td style={styles.ctstyle}>Date:</td>
                    <td>{farmerDetails?.testDate || 'N/A'}</td>
                    </tr>

                    <tr>
                    <td style={styles.ctstyle}>Disease Type:</td>
                    <td>{farmerDetails?.diseaseType || 'N/A'}</td>
                    </tr>

                    <tr>
                    <td style={styles.ctstyle}>No Of Cocoon Examined:</td>
                    <td>{farmerDetails?.noOfCocoonsExamined || 'N/A'}</td>
                  </tr>
                  
                </tbody>
            </Table>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      </Modal>

      <Modal
        show={showModalCocoonAssessment}
        onHide={handleCloseModalCocoonAssessment}
        size="lg"
      >
        <Modal.Header closeButton style={styles.modalHeader}>
        <Modal.Title style={styles.modalTitle}>Cocoon Assessment Result</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styles.modalBody}>
        <div className="d-flex justify-content-center">
          <Row className="g-5 d-flex justify-content-center" style={{ width: "100%" }}>
            <Col lg="12"> {/* Use full width for the table */}
            <Table striped bordered hover responsive className="table-sm" style={styles.table}>
                <tbody>
                  <tr>
                    <td style={styles.ctstyle}>No Of Cocoon Per Kg:</td>
                    <td>{farmerDetails?.noOfCocoonPerKg || 'N/A'}</td>
                    </tr>

                    <tr>
                    <td style={styles.ctstyle}>Melt Percentage:</td>
                    <td>{farmerDetails?.meltPercentage || 'N/A'}</td>
                  </tr>
                  
                </tbody>
                </Table>
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
          <Modal.Title>Assess Now </Modal.Title>
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
                      name="noOfCocoonTakenForExamination"
                      value={data.noOfCocoonTakenForExamination}
                      onChange={handleInputs}
                      type="text"
                      placeholder="Enter No. of Cocoons Taken for Examination"
                      required
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
                      id="noOfDflFromFc"
                      name="noOfDflFromFc"
                      value={data.noOfDflFromFc}
                      onChange={handleInputs}
                      type="text"
                      placeholder="Enter No. of DFL’s from FC"
                      required
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
                  No. of Pupa Examined
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="pupaTestResult"
                      name="pupaTestResult"
                      value={data.pupaTestResult}
                      onChange={handleInputs}
                      type="text"
                      placeholder="Enter No. of Pupa Examined"
                      required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Name is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                          Test Date
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.testDate}
                            onChange={(date) =>
                              handleDateChange(date, "testDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            // required
                          />
                        </div>
                      </Form.Group>
                    </Col>

              <Col lg="6">
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
                        value="true" // Set the value to "yes"
                        checked={data.diseaseFree === "true"} // Check if the value in state is "yes"
                        onChange={handleRadioChange} // Handle radio button change
                      />
                    </Col>
                    <Col lg="auto">
                      <Form.Check
                        type="radio"
                        id="no"
                        name="diseaseFree"
                        label="No"
                        value="false" // Set the value to "no"
                        checked={data.diseaseFree === "false"} // Check if the value in state is "no"
                        onChange={handleRadioChange} // Handle radio button change
                      />
                    </Col>
                  </Row>
                </div>

                {/* Conditionally render the disease name input field if "Yes" is selected */}
                {data.diseaseFree === "true" && (
                  <Col lg="6">
                  <Form.Group className="mt-3">
                    <Form.Label>Disease Type</Form.Label>
                    <Form.Control
                      id="diseaseType"
                      name="diseaseType"
                      value={data.diseaseType || ""}
                      onChange={handleInputs}
                      type="text"
                      placeholder="Enter Disease Type"
                    />
                  </Form.Group>
                  </Col>
                )}
              </Form.Group>
            </Col>


                

                    <Block className="mt-3">
                    <Card  className="mt-3"
                          style={{
                            border: "none",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                          }}>
                <Card.Header style={{
                              // backgroundColor: "#0a2463",
                              backgroundColor: "#0F6CBE",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              padding: "7px 12px",
                              position: "relative",
                              color: "white",
                              overflow: "hidden",
                            }}> <span>Cocoon Assessment</span>
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "3rem",
                                color: "rgba(255, 255, 255, 0.1)", // Light watermark color
                                zIndex: 0,
                                pointerEvents: "none", // Allow interactions to pass through
                                whiteSpace: "nowrap",
                              }}
                            >
                              {/* Farmers Details */}
                            </div></Card.Header>
                <Card.Body>
                <Row className="g-gs">
            <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="farmerFamilyName">
                  No. of Cocoons per Kg. 
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="noOfCocoonPerKg"
                      name="noOfCocoonPerKg"
                      value={data.noOfCocoonPerKg}
                      onChange={handleInputs}
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
                      id="meltPercentage"
                      name="meltPercentage"
                      value={data.meltPercentage}
                      onChange={handleInputs}
                      type="text"
                      placeholder="Melt %"
                      // required
                    />
                  </div>
                </Form.Group>
              </Col>
              </Row>
              </Card.Body>
              </Card>
              </Block>

              
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
      </Form>
      </Block>
    </Layout>
  );
}

export default FinalWeighment;
