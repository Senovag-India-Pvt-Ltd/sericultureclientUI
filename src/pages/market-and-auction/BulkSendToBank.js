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
import { useTranslation } from "react-i18next";
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const bulkSendToBankStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-form-wrap { background: #eef2f8; border-radius: 14px; padding: 18px; }
  .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; }
  .sh-section-header {
    display: flex; align-items: center; gap: 10px; font-weight: 700 !important; font-size: 1rem !important;
    letter-spacing: 0.3px; background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important; color: #ffffff !important; padding: 14px 20px !important; border-bottom: none !important;
    justify-content: center;
  }
  .sh-form-wrap .form-label { font-weight: 600; color: #2b3a55; font-size: 13.5px; }
  .sh-form-wrap .form-control, .sh-form-wrap .form-select {
    border-radius: 8px; border: 1px solid #dbe4f0; padding: 9px 12px; font-size: 13.5px;
  }
  .sh-form-wrap .form-control:focus, .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6; box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border: none !important;
    font-weight: 600; padding: 8px 22px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-modal-content { border-radius: 12px !important; border: 1px solid #e3ebf6 !important; overflow: hidden; }
  .sh-modal-content .modal-header { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%); border-bottom: none; padding: 16px 22px; }
  .sh-modal-content .modal-header .btn-close { filter: brightness(0) invert(1); opacity: 0.85; }
  .sh-modal-content .modal-title { color: #ffffff; font-weight: 700; }
  .sh-modal-content .modal-body { padding: 22px 24px; }
  .sh-modal-content table thead th {
    background-color: #eef4fc !important; color: #2b3a55 !important; font-weight: 700; font-size: 13px;
    letter-spacing: 0.2px; border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-modal-content .btn-primary {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%); border: none; border-radius: 8px; font-weight: 600;
  }
  .sh-modal-content .btn-secondary {
    background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px; font-weight: 600;
  }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function BulkSendToBank() {
  const { t } = useTranslation();
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
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
    });
    // .then(() => {
    //   navigate("/seriui/caste-list");
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
    <Layout title={t("Bulk Send To Bank")} show="true">
      <style>{bulkSendToBankStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Bulk Send To Bank")}</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/stake-holder-registration"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/stake-holder-registration"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <Card.Header className="sh-section-header">{t("Bulk Send To Bank")}</Card.Header>
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
                  <Form.Label>{t("Date")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="paymentDate"
                      value={data.paymentDate}
                      onChange={handleInputs}
                    >
                      <option value="0">{t("Select Date")}</option>
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
                        className="sh-save-btn"
                        onClick={onSubmitBulkDate}
                      >
                        {t("Update")}
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("Approve/Reject")}</Modal.Title>
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
                    {t("Market Auction Date")}
                  </Form.Label>
                  <Col sm={8}>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.marketAuctionDate}
                        onChange={handleDateChange}
                        portalId="seri-datepicker-portal"
                      />
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="actions">{t("Actions")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="actions"
                      type="text"
                      placeholder={t("Actions")}
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
                  <Form.Label htmlFor="cmt">{t("Comment")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder={t("Enter Comment")}
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
                          label={t("Pre Inspection")}
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
                          label={t("Post Inspection")}
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
                      {t("Approve")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal}>
                      {t("Reject")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      {t("Cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("View Model")}</Modal.Title>
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
                      {t("Close")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("Modify Model")}</Modal.Title>
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
                      {t("Save")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal2}>
                      {t("Cancel")}
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
