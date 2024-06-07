import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function UpdateLotWeight() {
  const [getLot, setGetLot] = useState({
    allottedLotId: "",
    marketId: "",
  });

  const [data, setData] = useState({
    marketId: getLot.marketId,
    godownId: "",
    allottedLotId: getLot.allottedLotId,
    noOfCrates: "",
    weight: "",
    remarks: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const [disable, setDisable] = useState(true);

  const handleOut = () => {
    // console.log(data.noOfCrates);
    const { godownId, noOfCrates, remarks } = data;
    const { marketId, allottedLotId } = getLot;

    const parameters = `marketId=${marketId}&godownId=${godownId}&allottedLotId=${allottedLotId}&noOfCrates=${noOfCrates}&remarks=${remarks}`;
    axios
      .post(
        baseURL1 + `auction/weigment/canContinuetoWeighment?${parameters}`,
        {},
        {
          headers: _header,
        }
      )
      .then((response) => {
        const res = response.data.errorMessages;
        // debugger
        console.log(res.length);
        if (response.data.errorMessages.length) {
          console.log(response.data.errorMessages);
          setDisable(true);
        } else {
          setDisable(false);
          search();
        }
        // setRes(response.data.content);

        // setData()
        // saveSuccess();
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    axios
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);

  // to get Godown
  const [godownListData, setGodownListData] = useState([]);
  const getGodownList = (_id) => {
    axios
      .get(baseURL + `godown/get-by-market-master-id/${_id}`)
      .then((response) => {
        setGodownListData(response.data.content.godown);
        // setTotalRows(response.data.content.totalItems);
        if (response.data.content.error) {
          setGodownListData([]);
        }
      })
      .catch((err) => {
        setGodownListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (getLot.marketId) {
      getGodownList(getLot.marketId);
    }
  }, [getLot.marketId]);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    axios
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

  const searchInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setGetLot({ ...getLot, [name]: value });
  };

  const [res, setRes] = useState({});

  const search = (e) => {
    const { allottedLotId, marketId } = getLot;
    const parameters = `marketId=${marketId}&allottedLotId=${allottedLotId}`;
    axios
      .post(
        baseURL1 + `auction/weigment/getUpdateWeighmentByLotId?${parameters}`,
        {},
        {
          headers: _header,
        }
      )
      .then((response) => {
        console.log(response);
        setRes(response.data.content);

        // setData()
        // saveSuccess();
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (e) => {
    const { godownId, remarks, noOfCrates } = data;
    const { marketId, allottedLotId } = getLot;
    const parameters = `marketId=${marketId}&godownId=${godownId}&allottedLotId=${allottedLotId}&noOfCrates=${noOfCrates}&remarks=${remarks}`;
    axios
      .post(
        baseURL1 +
          `auction/weigment/updateWeightToContinueToWeighment?${parameters}`,
        {},
        {
          headers: _header,
        }
      )
      .then((response) => {
        saveSuccess();
      })
      .catch((err) => {
        setData({});
        saveError();
      });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("/seriui/caste-list");
    });
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };
  return (
    <Layout title="Generate Bidding Slip">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Update Lot Weight</Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Update Lot Weight
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/caste-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/caste-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-1">
        <Form action="#">
          <Row className="g-3">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  {/* <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label> Lot No.</Form.Label>
                      <div className="form-control-wrap">
                        <input
                          placeholder="Lot No"
                          type="text"
                          id="fid"
                          class="form-control"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Button type="button" variant="primary" onClick={setData}>
                      Get Details
                    </Button>
                  </Col> */}
                  <Col lg="8">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        Lot ID
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          id="lotId"
                          name="allottedLotId"
                          value={getLot.allottedLotId}
                          onChange={searchInput}
                          type="text"
                          placeholder="Enter Lot Number"
                        />
                      </Col>
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        Market
                      </Form.Label>
                      <Col sm={4}>
                        {/* <Form.Control
                          id="lotId"
                          name="lotId"
                          value={getLot.lotId}
                          onChange={searchInput}
                          type="text"
                          placeholder="Enter Lot Number"
                        /> */}
                        <Form.Select
                          name="marketId"
                          value={getLot.marketId}
                          onChange={searchInput}
                        >
                          <option value="0">Select Market</option>
                          {marketListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={list.marketMasterId}
                            >
                              {list.marketMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={search}
                        >
                          Get Details
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-gs pt-2">
                  <Col lg="12">
                    {/* <table className="table table-striped table-bordered" style={{backgroundColor:"white"}}>
                      <thead
                        style={{ backgroundColor: "#0f6cbe", color: "#fff" }}
                      >
                        <tr>
                          <th>Farmer Details</th>
                          <th>Reeler Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Fruits ID: {res.farmerFruitsId}</td>
                          <td>{res.reelerLicense}</td>
                        </tr>
                        <tr>
                          <td>{res.farmerFirstName}</td>
                          <td>{res.reelerName}</td>
                        </tr>
                        <tr>
                          <td>{res.farmerVillage}</td>
                          <td>
                            Current Balance: {res.reelerCurrentAvailableBalance}
                          </td>
                        </tr>
                        <tr>
                          <td>Bid Amount: {res.bidAmount}</td>
                          <td>Blocked Amount: {res.blockedAmount}</td>
                          
                        </tr>
                      </tbody>
                    </table> */}

                    <table
                      className="table table-striped table-bordered"
                      style={{ backgroundColor: "white" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            colSpan="2"
                          >
                            Farmer Details
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            colSpan="2"
                          >
                            Reeler Details
                          </th>
                        </tr>
                        {/* <tr>
                          <th>Column 1</th>
                          <th>Column 2</th>
                          <th>Column 3</th>
                          <th>Column 4</th>
                          <th>Column 1</th>
                          <th>Column 2</th>
                          <th>Column 3</th>
                          <th>Column 4</th>
                        </tr> */}
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <span style={{ fontWeight: "bold" }}>
                              Fruits Id:
                            </span>
                            <span className="ms-1">
                              {res.farmerFruitsId ? res.farmerFruitsId : "---"}
                            </span>
                          </td>
                          {/* <td >{res.farmerFruitsId?res.farmerFruitsId:"---"}</td> */}
                          <td style={{ backgroundColor: "#fff" }}>
                            <span style={{ fontWeight: "bold" }}>
                              Farmer Name:
                            </span>
                            <span className="ms-1">
                              {res.farmerFirstName
                                ? res.farmerFirstName
                                : "---"}
                            </span>
                          </td>

                          <td>
                            <span style={{ fontWeight: "bold" }}>
                              Reeler Name:
                            </span>
                            <span className="ms-1">
                              {res.reelerName ? res.reelerName : "---"}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: "bold" }}>
                              Reeler License:
                            </span>
                            <span className="ms-1">
                              {res.reelerLicense ? res.reelerLicense : "---"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: "#f7f7f7" }}>
                            <span style={{ fontWeight: "bold" }}>
                              Farmer Number:
                            </span>
                            <span className="ms-1">
                              {res.farmerNumber ? res.farmerNumber : "---"}
                            </span>
                          </td>
                          {/* <td >{res.farmerFruitsId?res.farmerFruitsId:"---"}</td> */}
                          <td style={{ backgroundColor: "#f7f7f7" }}>
                            <span style={{ fontWeight: "bold" }}>
                              Bid Amount:
                            </span>
                            <span
                              style={{ color: "green", fontWeight: "bold" }}
                              className="ms-1"
                            >
                              {res.bidAmount ? res.bidAmount : "---"}
                            </span>
                          </td>

                          <td style={{ backgroundColor: "#f7f7f7" }}>
                            {" "}
                            <span style={{ fontWeight: "bold" }}>
                              Available Balance:
                            </span>
                            <span
                              style={{ color: "green", fontWeight: "bold" }}
                              className="ms-1"
                            >
                              {res.reelerCurrentAvailableBalance
                                ? res.reelerCurrentAvailableBalance
                                : "---"}
                            </span>
                          </td>
                          <td style={{ backgroundColor: "#f7f7f7" }}>
                            <span style={{ fontWeight: "bold" }}>
                              Blocked Amount:
                            </span>
                            <span
                              style={{ color: "red", fontWeight: "bold" }}
                              className="ms-1"
                            >
                              {res.blockedAmount ? res.blockedAmount : "---"}
                            </span>
                          </td>
                        </tr>
                        {/* Add more rows as needed */}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>Godown</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="godownId"
                          value={data.godownId}
                          onChange={handleInputs}
                        >
                          <option value="0">Select Godown</option>
                          {godownListData.map((list) => (
                            <option key={list.godownId} value={list.godownId}>
                              {list.godownName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label> Crates </Form.Label>
                      <div className="form-control-wrap">
                        <input
                          placeholder="Crates"
                          type="text"
                          id="crates"
                          name="noOfCrates"
                          value={data.noOfCrates}
                          onChange={handleInputs}
                          onBlur={handleOut}
                          class="form-control"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  {/* <Col lg="4">
                    <Form.Group className="form-group mt-3">
                      <Form.Label> Bid Amount </Form.Label>
                      <div className="form-control-wrap">
                        <input
                          placeholder="Bid Amount"
                          type="text"
                          id="bidamount"
                          class="form-control"
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col> */}
                </Row>

                <Row className="g-gs ">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label> Weight</Form.Label>
                      <div className="form-control-wrap">
                        <input
                          placeholder="weight"
                          type="text"
                          id="weight"
                          name="weight"
                          value={data.weight}
                          // onChange={handleInputs}
                          readOnly
                          class="form-control"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label> Remarks </Form.Label>
                      <div className="form-control-wrap">
                        <input
                          placeholder="Remarks"
                          type="text"
                          id="remarks"
                          name="remarks"
                          value={data.remarks}
                          onChange={handleInputs}
                          class="form-control"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={postData}
                    disabled={disable}
                  >
                    Update Weight
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

export default UpdateLotWeight;
