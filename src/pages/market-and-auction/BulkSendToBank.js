import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Swal from "sweetalert2/src/sweetalert2.js";

import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../components";

import api from "../../services/auth/api";
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function BulkSendToBank() {
  // const [selectedDate, setSelectedDate] = useState("");

  const [data, setData] = useState({
    paymentDate: "",
  });

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (newDate) => {
    setData({ ...data, marketAuctionDate: newDate });
  };

  // const getAuctionDateForBulkSend = (e) => {
  //   api
  //     .post(baseURLMarket + `auction/fp/getAuctionDateListForBulkSend`, {
  //       marketId: localStorage.getItem("marketId"),
  //       godownId: 26,
  //     })
  //     .then((response) => {
  //       // debugger;
  //       console.log(response);
  //       // if (response.data.content.body.content) {
  //       //   setWeighmentCompletedList(response.data.content.body.content);
  //       //   const res = response.data.content.body.content;
  //       //   console.log(res);
  //       //   debugger;
  //       //   if (!res.ifscCode) {
  //       //     setShowBankError(true);
  //       //     setShowAddToButton(false);
  //       //   }
  //       // } else {
  //       //   setWeighmentCompletedList([]);
  //       // }
  //       // setSourceData(response.data.content);
  //       // setAllotedLotList(response.data.content.allotedLotList);
  //       // setBigBinList(response.data.content.allotedBigBinList);
  //       // setSmallBinList(response.data.content.allotedSmallBinList);
  //       // saveSuccess();
  //     })
  //     .catch((err) => {
  //       // setData({});
  //       // saveError();
  //     });
  // };

  // to get Auction Date List
  const [auctionDateList, setAuctionDateList] = useState([]);

  const getAuctionDateList = () => {
    api
      .post(baseURLMarket + `auction/fp/getAuctionDateListForBulkSend`, {
        marketId: localStorage.getItem("marketId"),
      })
      .then((response) => {
        console.log(response);
        if (response.data.content) {
          setAuctionDateList(response.data.content);
        }
      })
      .catch((err) => {
        setAuctionDateList([]);
      });
  };

  useEffect(() => {
    getAuctionDateList();
  }, []);

  const onSubmitBulkDate = (e) => {
    const date = new Date(data.paymentDate);
    const formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");

    api
      .post(baseURLMarket + `auction/fp/bulkSendToReadyForPayment`, {
        marketId: localStorage.getItem("marketId"),
        paymentDate: formattedDate,
      })
      .then((response) => {
        console.log(response);
        saveSuccess();
        getAuctionDateList();

        // if (response.data.content) {
        //   setAuctionDateList(response.data.content);
        // }
      })
      .catch((err) => {
        // setAuctionDateList([]);
      });
  };

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Bulk Send successfully Completed",
      // text: "You clicked the button!",
    });
    // .then(() => {
    //   navigate("/caste-list");
    // });
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);
  return (
    <Layout title="Bulk Send To Bank">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Bulk Send To Bank</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/stake-holder-registration"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/stake-holder-registration"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Card>
          <Card.Header className="text-center">Bulk Send To Bank</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="4">
                {/* <Dropdown onSelect={(date) => setSelectedDate(date)}>
                  <Dropdown.Toggle variant="success" id="date-dropdown">
                    {selectedDate
                      ? `Selected Date: ${selectedDate}`
                      : "Select Date"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    
                    <Dropdown.Item eventKey="2023-11-18">
                      2023-11-18
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2023-11-19">
                      2023-11-19
                    </Dropdown.Item>
                   
                  </Dropdown.Menu>
                </Dropdown> */}
                <Form.Group className="form-group">
                  <Form.Label>Date</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="paymentDate"
                      value={data.paymentDate}
                      onChange={handleInputs}
                    >
                      <option value="0">Select Date</option>
                      {auctionDateList.map((list) => (
                        <option key={list} value={list}>
                          {list}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col lg="4">
                {/* <Dropdown onSelect={(date) => setSelectedDate(date)}>
                  <Dropdown.Toggle variant="success" id="date-dropdown">
                    {selectedDate
                      ? `Selected Date: ${selectedDate}`
                      : "Select Date"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    
                    <Dropdown.Item eventKey="2023-11-18">
                      2023-11-18
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2023-11-19">
                      2023-11-19
                    </Dropdown.Item>
                   
                  </Dropdown.Menu>
                </Dropdown> */}
                <div className="gap-col mt-1">
                  <ul className="">
                    <li>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={onSubmitBulkDate}
                      >
                        Update
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
      {/* <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            data={SubsidyApprovalVerificationDatas}
            columns={SubsidyApprovalVerificationColumns}
            expandableRows
          />
        </Card>
      </Block> */}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Approve/Reject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}
                <Form.Group
                  as={Row}
                  className="form-group mt-3"
                  controlId="date"
                >
                  <Form.Label column sm={4}>
                    Market Auction Date
                  </Form.Label>
                  <Col sm={8}>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.marketAuctionDate}
                        onChange={handleDateChange}
                      />
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="actions">Actions</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="actions"
                      type="text"
                      placeholder="Actions"
                      value="actions1"
                    />
                  </div>
                </Form.Group>
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="slno">SL No</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="slno"
                      type="text"
                      placeholder="SL No"
                      value="1"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="lotno">Lot Nbr</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="lotno"
                      type="text"
                      placeholder="Lot Nbr"
                      value="411"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="tradate">Transaction_Date</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="tradate"
                      type="text"
                      placeholder="Transaction_Date"
                      value="16/05/2001"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      {/* <Form.Label>With Land</Form.Label> */}
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      {/* <Form.Label>With Land</Form.Label> */}
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal}>
                      Approve
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal}>
                      Reject
                    </Button>
                  </div>
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

      <Modal show={showModal1} onHide={handleCloseModal1} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}

                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fid">Farmer ID</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fid"
                      type="text"
                      placeholder="Farmer ID"
                      value="fid1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="fyear">Financial Year</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fyear"
                      type="text"
                      placeholder="Financial Year"
                      value="2023-2024"
                    />
                  </div>
                </Form.Group> */}
              </Col>
              <Col lg="6">
                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fname">Farmer Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Farmer Name"
                      value="Basappa"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mbl">Mobile</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mbl"
                      type="text"
                      placeholder="Mobile"
                      value="8596742302"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row> */}
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  {/* <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal1}>
                      Approve
                    </Button>
                  </div> */}
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal1}>
                      Close
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
          <Modal.Title>Modify Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}

                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fid">Farmer ID</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fid"
                      type="text"
                      placeholder="Farmer ID"
                      value="fid1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="fyear">Financial Year</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fyear"
                      type="text"
                      placeholder="Financial Year"
                      value="2023-2024"
                    />
                  </div>
                </Form.Group> */}
              </Col>
              <Col lg="6">
                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fname">Farmer Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Farmer Name"
                      value="Basappa"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mbl">Mobile</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mbl"
                      type="text"
                      placeholder="Mobile"
                      value="8596742302"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row> */}
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal2}>
                      Save
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal2}>
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

export default BulkSendToBank;
