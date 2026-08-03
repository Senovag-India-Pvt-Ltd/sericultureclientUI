import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function Bin() {
  // Translation
    const { t } = useTranslation();
  const [small, setSmall] = useState([]);
  const smallBin = [
    {
      id: "uid01",
      binno: 50,
      status: 1,
    },
    {
      id: "uid02",
      binno: 30,
      status: 1,
    },
    {
      id: "uid03",
      binno: 80,
      status: 1,
    },
    {
      id: "uid04",
      binno: 80,
      status: 1,
    },
    {
      id: "uid05",
      binno: 80,
      status: 1,
    },
    {
      id: "uid06",
      binno: 80,
      status: 1,
    },
    {
      id: "uid07",
      binno: 80,
      status: 1,
    },
    {
      id: "uid08",
      binno: 80,
      status: 1,
    },
    {
      id: "uid09",
      binno: 80,
      status: 1,
    },
    {
      id: "uid10",
      binno: 80,
      status: 1,
    },
    {
      id: "uid11",
      binno: 80,
      status: 1,
    },
  ];

  const [big, setBig] = useState([]);
  const bigBin = [
    {
      id: "uid01",
      binno: 200,
      status: 1,
    },
    {
      id: "uid02",
      binno: 150,
      status: 1,
    },
    {
      id: "uid03",
      binno: 321,
      status: 1,
    },
    {
      id: "uid04",
      binno: 321,
      status: 1,
    },
    {
      id: "uid05",
      binno: 321,
      status: 1,
    },
    {
      id: "uid06",
      binno: 321,
      status: 1,
    },
    {
      id: "uid07",
      binno: 321,
      status: 1,
    },
    {
      id: "uid08",
      binno: 321,
      status: 1,
    },
  ];

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (e) => {
    const {
      marketId,
      godownId,
      smallBinStart,
      smallBinEnd,
      bigBinstart,
      bigBinEnd,
    } = data;
    const parameters = `bigBinstart=${bigBinstart}&bigBinEnd=${bigBinEnd}&smallBinStart=${smallBinStart}&smallBinEnd=${smallBinEnd}&marketId=${marketId}&godownId=${godownId}`;
    const parameters1 = `type=big&marketId=${marketId}&godownId=${godownId}&startNumber=${bigBinstart}&EndNumber=${bigBinEnd}`;
    const parameters2 = `type=small&marketId=${marketId}&godownId=${godownId}&startNumber=${smallBinStart}&EndNumber=${smallBinEnd}`;
    api
      .post(baseURL1 + `addAllMaster/addBinCounterMaster?${parameters}`, {})
      .then((response) => {
        api
          .post(
            baseURL1 + `addAllMaster/addBinMaster?${parameters1}`,
            {},
            {
              headers: _header,
            }
          )
          .then((response) => {
            // console.log("hello...");
          });

        api
          .post(baseURL1 + `addAllMaster/addBinMaster?${parameters2}`, {})
          .then((response) => {
            // console.log("hello2...");
          });
        saveSuccess();
      })
      .catch((err) => {
        setData({});
      });
  };

  const BigBinDataColumns = [
    {
      name: "Big Bin Number",
      selector: (row) => row.binno,
      cell: (row) => <span>{row.binno}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Available Status",
      cell: (row) => (
        <div className="text-start w-100">
          <Form.Check
            type="switch"
            id={`active${row.id}`}
            defaultChecked={row.status === 0 ? false : true}
          />
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

  const SmallBinDataColumns = [
    {
      name: "Small Bin Number",
      selector: (row) => row.binno,
      cell: (row) => <span>{row.binno}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Available Status",
      cell: (row) => (
        <div className="text-start w-100">
          <Form.Check
            type="switch"
            id={`active${row.id}`}
            defaultChecked={row.status === 0 ? false : true}
          />
        </div>
      ),
      sortable: false,
      hide: "md",
    },
  ];

  // const [binStatus, setBinStatus] = useState({});
  const [data, setData] = useState({
    marketId: "",
    godownId: 0,
    smallBinStart: "",
    smallBinEnd: "",
    bigBinstart: "",
    bigBinEnd: "",
  });

  let name, value;
  const change = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
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

  const [isActive, setIsActive] = useState(false);
  const display = () => {
    setIsActive((current) => !current);
    const start = data.smallBinStart;
    const end = data.smallBinEnd;
    const man = smallBin.slice(start - 1, end);
    setSmall(man);
    // console.log(man);
    // console.log("dsgdhsh");
    const bigStart = data.bigBinStart;
    const bigEnd = data.bigBinEnd;
    const man1 = bigBin.slice(bigStart - 1, bigEnd);
    setBig(man1);
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    })
  };

  const [marketListData, setMarketListData] = useState([]);
  const [godownListData, setGodownListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const _params = { params: { pageNumber: page, size: countPerPage } };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setMarketListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  // godown/get-by-market-master-id/1
  const getGodownList = (_id) => {
    const response = api
      .get(baseURL + `godown/get-by-market-master-id/${_id}`)
      .then((response) => {
        setGodownListData(response.data.content.godown);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
        if (response.data.content.error) {
          setGodownListData([]);
        }
      })
      .catch((err) => {
        setGodownListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data.marketId) {
      getGodownList(data.marketId);
    }
  }, [data.marketId]);

  return (
    <Layout title={t("Bin")}>
      <style>{binStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Bin")}</Block.Title>
              {/* <nav>
                <ol className="breadcrumb breadcrumb-arrow mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/seriui/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Bin
                  </li>
                </ol>
              </nav> */}
            </Block.HeadContent>
            {/* <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/bin-list"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/bin-list"
                    className="btn btn-primary d-none d-md-inline-flex"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent> */}
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="setting" />
                <span>{t("Bin Details")}</span>
              </Card.Header>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>{t("Market")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="marketId"
                          value={data.marketId}
                          onChange={change}
                        >
                          <option value="0">{t("Select Market")}</option>
                          {marketListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={list.marketMasterId}
                            >
                              {list.marketMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>{t("Godown")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="godownId"
                          value={data.godownId}
                          onChange={change}
                        >
                          <option value="0">{t("Select Godown")}</option>
                          {godownListData.map((list) => (
                            <option key={list.godownId} value={list.godownId}>
                              {list.godownName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>Type</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Type</option>
                          <option value="1">Available</option>
                          <option value="0">Not Available</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="bin">Bin Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="bin"
                          type="text"
                          placeholder="Enter Bin Number"
                        />
                      </div>
                    </Form.Group>
                  </Col> */}
                <Row className="mt-3">
                  <Col lg="3">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="smallBinStart">
                        {t("Small Bin Start Number")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="smallBinStart"
                          type="number"
                          name="smallBinStart"
                          value={data.smallBinStart}
                          onChange={change}
                          placeholder={t("Enter Small Bin Start Number")}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="3">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="smallBinEnd">
                        {t("Small Bin End Number")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="smallBinEnd"
                          type="number"
                          name="smallBinEnd"
                          value={data.smallBinEnd}
                          onChange={change}
                          placeholder={t("Enter Small Bin End Number")}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="3">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="binbigstart">
                        {t("Big Bin Start Number")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="binbigstart"
                          type="number"
                          name="bigBinstart"
                          value={data.bigBinstart}
                          onChange={change}
                          placeholder={t("Enter Big Bin Start Number")}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="3">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="binbigend">
                        {t("Big Bin End Number")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="binbigend"
                          type="number"
                          name="bigBinEnd"
                          value={data.bigBinEnd}
                          onChange={change}
                          placeholder={t("Enter Big Bin End Number")}
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
                  {/* <Button type="button" variant="primary" onClick={display}> */}
                  <Button type="button" variant="primary" onClick={postData}>
                    {t("Generate Bin Status")}
                  </Button>
                </li>
              </ul>
            </div>

            <div className={isActive ? "mt-3" : "d-none"}>
              <Card>
                <Card.Header>{t("Small Bins")}</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="12">
                      {/* <Block>
                        <Card>
                          <div
                            className="table-responsive"
                            style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  <th>Small Bin Number</th>
                                  <th>Available Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>123</td>
                                  <td>
                                    {" "}
                                    <Form.Check
                                      type="switch"
                                      id="active1"
                                      label="Active"
                                      defaultChecked
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>321</td>
                                  <td>
                                    {" "}
                                    <Form.Check
                                      type="switch"
                                      id="active2"
                                      label="Active"
                                      defaultChecked
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block> */}
                      <Block>
                        <Card>
                          <DataTable
                            title="Bin List"
                            tableClassName="data-table-head-light table-responsive"
                            columns={SmallBinDataColumns}
                            data={small}
                            highlightOnHover
                            // pagination
                            // paginationServer
                            // paginationTotalRows={totalRows}
                            // paginationPerPage={countPerPage}
                            // paginationComponentOptions={{
                            //   noRowsPerPage: true,
                            // }}
                            // onChangePage={(page) => setPage(page - 1)}
                            // progressPending={loading}
                          />
                        </Card>
                      </Block>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="mt-3">
                <Card.Header>{t("Big Bins")}</Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="12">
                      {/* <Block>
                        <Card>
                          <div className="table-responsive">
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  <th>Big Bin Number</th>
                                  <th>Available Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>123</td>
                                  <td>
                                    {" "}
                                    <Form.Check
                                      type="switch"
                                      id="active3"
                                      label="Active"
                                      defaultChecked
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>321</td>
                                  <td>
                                    {" "}
                                    <Form.Check
                                      type="switch"
                                      id="active4"
                                      label="Active"
                                      defaultChecked
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block> */}
                      <Block>
                        <Card>
                          <DataTable
                            title="Bin List"
                            tableClassName="data-table-head-light table-responsive"
                            columns={BigBinDataColumns}
                            data={big}
                            highlightOnHover
                            // pagination
                            // paginationServer
                            // paginationTotalRows={totalRows}
                            // paginationPerPage={countPerPage}
                            // paginationComponentOptions={{
                            //   noRowsPerPage: true,
                            // }}
                            // onChangePage={(page) => setPage(page - 1)}
                            // progressPending={loading}
                          />
                        </Card>
                      </Block>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <div className="gap-col mt-3">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => saveSuccess()}
                      className="sh-save-btn"
                    >
                      <Icon name="save" />
                      {t("save")}
                    </Button>
                  </li>
                  <li>
                    <Link to="#" className="btn btn-secondary border-0 sh-cancel-btn">
                    <Icon name="cross" />
                    {t("cancel")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Row>
        </Form>
      </Block>

      {/* <Row >
    <Col lg="6" >
      <Card>
        <Card.Header>Small Bin Status</Card.Header>
        <Card.Body>
          {/* <Row className="g-gs">
            <Col lg="12"> */}
      {/* <table className="table small table-bordered">
                <tbody>
                  <tr>
                    <td style={styles.ctstyle}> Market:</td>
                    <td>
                      {binStatus && binStatus.marketId}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>Godown:</td>
                    <td>
                      {binStatus && binStatus.godownId}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}>
                      {" "}
                      Small bin Start Number:
                    </td>
                    <td>
                      {binStatus && binStatus.smallBinStart}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}> Small bin End Number:</td>
                    <td>
                      {binStatus && binStatus.smallBinEnd}
                    </td>
                  </tr>
                </tbody>
              </table>
              </Card.Body>
            </Card>
          </Col>  */}

      {/* <Col lg="6" >
      <Card className="card-gutter-md mt-4">
        <Card.Header>Big Bin Status</Card.Header>
        <Card.Body >

              <table className="table small table-bordered">
                <tbody>
                  <tr>
                    <td style={styles.ctstyle}> Market :</td>
                    <td>{binStatus.marketId}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}> Godown:</td>
                    <td>{binStatus.godownId}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}> Big bin start Number:</td>
                    <td>{binStatus.bigBinStart}</td>
                  </tr>
                  <tr>
                    <td style={styles.ctstyle}> Big bin End Number:</td>
                    <td>{binStatus.bigBinEnd}</td>
                  </tr>
                </tbody>
              </table>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}

      {/* <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{"add_address"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="4">
                <Form.Group className="form-group mt-3">
                  <Form.Label>{t("state")}</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">{t("select_state")}</option>
                      <option value="1">Andra Pradesh</option>
                      <option value="2">Karnataka</option>
                      <option value="3">Kerala</option>
                      <option value="4">Tamil Nadu</option>
                      <option value="5">Telangana</option>
                    </Select>
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label>{t("district")}</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">{t("select_district")}</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Select>
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label>{t("taluk")}</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">{t("select_taluk")}</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group className="form-group mt-3">
                  <Form.Label>{t("hobli")}</Form.Label>
                  <div className="form-control-wrap">
                    <Select removeItemButton>
                      <option value="">{t("select_hobli")}</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Select>
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="village">{t("village")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="village"
                      type="text"
                      placeholder={t("enter_village_name")}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="address">{t("address")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      id="address"
                      type="text"
                      placeholder={t("enter_address")}
                      rows="2"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="4">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="pin">{t("pin_code")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="pin"
                      type="text"
                      placeholder={t("enter_pin_code")}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="default">
                    {t("make_this_address_default")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Check type="checkbox" id="default" defaultChecked />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal}>
                      {t("save")}
                    </Button>
                  </div>
                 
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal> */}
    </Layout>
  );
}

const binStyles = `
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
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
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
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #2b3a55;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #dbe4f0;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff !important;
    color: #c43257 !important;
    border: 1px solid #e3496a !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }
  .sh-cancel-btn:hover {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%) !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }
`;

export default Bin;
