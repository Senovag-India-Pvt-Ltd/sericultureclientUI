import React, { useState } from "react";
import { Card, Form, Row, Col, Button, Table, Modal } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Icon from "../../components/Icon/Icon";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2/src/sweetalert2.js";

function PupaAndCocoonAssessmentPage() {
  const [data, setData] = useState({
    allotedLotId: "",
    amount: "",
    farmerFirstName: "",
    farmerMiddleName: "",
    farmerLastName: "",
    farmerFruitsId: "",
    reelerName: "",
    reelerFruitsId: "",
    reelingLicenseNumber: "",
    reelerAuctionId: "",
    marketDate: new Date(),
    price: "",
  });

  const [validated, setValidated] = useState(false);
  const [hardCodeDataList] = useState([
    {
      fid: "FID123870981123",
      farmerName: "Ramappa",
      phoneNumber: "9876543210",
      address: "123, Silk Street",
      cropDetails: "Crop A",
      fcDetails: "FC123",
      weighmentDetails: "10kg",
    },
    {
      fid: "FID123870888456",
      farmerName: "SH Siddappa",
      phoneNumber: "9123456789",
      address: "456, Mulberry Road",
      cropDetails: "Crop B",
      fcDetails: "FC456",
      weighmentDetails: "15",
    },
  ]);

  const [showCropModal, setShowCropModal] = useState(false);
  const [showFcModal, setShowFcModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showWeighmentModal, setShowWeighmentModal] = useState(false);
  const [showAssessModal, setShowAssessModal] = useState(false);

  // Handlers to show and hide modals
  const handleShowAddressModal = () => setShowAddressModal(true);
  const handleCloseAddressModal = () => setShowAddressModal(false);

  const handleShowAssessModal = () => setShowAssessModal(true);
  const handleCloseAssessModal = () => setShowAssessModal(false);

  const handleShowCropModal = () => setShowCropModal(true);
  const handleCloseCropModal = () => setShowCropModal(false);

  const handleShowFcModal = () => setShowFcModal(true);
  const handleCloseFcModal = () => setShowFcModal(false);

  const handleShowWeighmentModal = () => setShowWeighmentModal(true);
  const handleCloseWeighmentModal = () => setShowWeighmentModal(false);

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    top: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    sweetsize: {
      width: "100px",
      height: "100px",
    },
  };

  const [isDiseaseFree, setIsDiseaseFree] = useState("no"); // Initial state is "no"

  // Function to handle the change of radio buttons
  const handleRadioChange = (e) => {
    setIsDiseaseFree(e.target.value);
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
      setShowAssessModal(false);
      setValidatedInitialWeighment(false);
      acceptSuccess();
    }
    // e.preventDefault();
  };

  // Function to display the success message
const acceptSuccess = () => {
  Swal.fire({
    icon: "success",
    title: "Allotted successfully",
    text: "You Can Proceed To Allotment",
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
                      {hardCodeDataList.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <Button variant="primary" onClick={handleShowAssessModal}>Assess Now</Button>
                          </td>
                          <td>{item.fid}</td>
                          <td>{item.farmerName}</td>
                          <td>{item.phoneNumber}</td>
                          <td>
                            {/* <Button variant="info" onClick={handleShowAddressModal}>
                              Address (i)
                            </Button> */}
                            <div
                                className="d-flex align-items-center"
                                onClick={handleShowAddressModal}
                              >
                                <Icon name="info-fill" size="lg"></Icon>
                                <span>Address Details</span>
                              </div>
                          </td>
                          <td>
                            {/* <Button variant="info" onClick={handleShowCropModal}>
                              Crop Details (i)
                            </Button> */}
                            <div
                                className="d-flex align-items-center"
                                onClick={handleShowCropModal}
                              >
                                <Icon name="info-fill" size="lg"></Icon>
                                <span>Crop Details</span>
                              </div>
                          </td>
                          <td>
                            {/* <Button variant="info" onClick={handleShowFcModal}>
                              FC Details (i)
                            </Button> */}
                            <div
                                className="d-flex align-items-center"
                                onClick={handleShowFcModal}
                              >
                                <Icon name="info-fill" size="lg"></Icon>
                                <span>FC Details</span>
                              </div>
                          </td>
                          <td>
                            {/* <Button
                              variant="info"
                              onClick={handleShowWeighmentModal}
                            >
                              Weighment (i)
                            </Button> */}
                            <div
                                className="d-flex align-items-center"
                                onClick={handleShowWeighmentModal}
                              >
                                <Icon name="info-fill" size="lg"></Icon>
                                <span>Weighment Details</span>
                              </div>
                          </td>
                          {/* <td>
                            <Button variant="success">Asses Now</Button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>

        <Modal show={showAddressModal} onHide={handleCloseAddressModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Personal Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <Row className="g-5">
              <Col lg="6">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Number:</td>
                      {/* <td>{farmerNumber}</td> */}
                      <td>00004825062024</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Name:</td>
                      {/* <td>{farmerDetails && farmerDetails.firstName}</td> */}
                      <td>SHIVANNA</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Father's/Husband's Name:</td>
                      {/* <td>{farmerDetails && farmerDetails.fatherName}</td> */}
                      <td>Veerabhadraiah</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Gender:</td>
                      {/* <td>
                        {farmerDetails && farmerDetails.genderId === 1
                          ? "Male"
                          : farmerDetails && farmerDetails.genderId === 2
                          ? "Female"
                          : "Other"}
                      </td> */}
                      <td>Male</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Phone Number:</td>
                      {/* <td>{farmerDetails && farmerDetails.mobileNumber}</td> */}
                      <td>9632297390</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Farmer Address:</td>
                      {/* <td>
                        {farmerAddress &&
                          farmerAddress.length > 0 &&
                          farmerAddress[0].addressText &&
                          farmerAddress[0].addressText}
                      </td> */}
                      <td>S BYADARAHALLI</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>

        {/* Modal for Crop Details */}
        <Modal show={showCropModal} onHide={handleCloseCropModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crop Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="d-flex justify-content-center">
            <Row
              className="g-5 d-flex justify-content-center"
              style={{ width: "100%" }}
            >
              <Col lg="6">
                <table
                  className="table small table-bordered"
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> No of DFL's:</td>
                      <td>200</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Lot No.:</td>
                      <td>MAG003</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Source(Grainage Name):</td>
                      <td>CV</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Variety(Field Name):</td>
                      <td>Magadi</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Parental Level:</td>
                      <td>P3</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>
        </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCropModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for FC Details */}
        <Modal show={showFcModal} onHide={handleCloseFcModal} size="lg">
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
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseFcModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for Weighment Details */}
        <Modal show={showWeighmentModal} onHide={handleCloseWeighmentModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Weighment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="d-flex justify-content-center">
            <Row
              className="g-5 d-flex justify-content-center"
              style={{ width: "100%" }}
            >
              <Col lg="6">
                <table
                  className="table small table-bordered"
                  style={{ width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>Weight:</td>
                      <td>10kg</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Lot No.:</td>
                      <td>MAG003</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Source(Grainage Name):</td>
                      <td>CV</td>
                    </tr>
                    
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseWeighmentModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
        show={showAssessModal}
        onHide={handleCloseAssessModal}
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
                      onClick={handleCloseAssessModal}
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
