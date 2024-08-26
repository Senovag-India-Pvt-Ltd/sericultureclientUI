import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DistrictWiseFarmerCountList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get District
  const [districtFarmerListData, setDistrictFarmerListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .post(baseURLFarmer + `farmer/districtWiseFarmerCount`)
      .then((response) => {
        if (response.data.content) {
          setDistrictFarmerListData(response.data.content);
        }
      })
      .catch((err) => {
        setDistrictFarmerListData([]);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  const getTalukList = (districtId) => {
    setLoading(true);
    api
      .post(baseURLFarmer + `farmer/talukWise`, { districtId })
      .then((response) => {
        if (response.data.content) {
          setListData(response.data.content);
          // setTotalRows(response.data.totalCount); // Assuming total count is returned
        } else {
          setListData([]);
          setTotalRows(0);
        }
        setIsActive(true); // Show DataTable when data is fetched successfully
      })
      .catch((err) => {
        setListData([]);
        setIsActive(false); // Hide DataTable on error
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [data, setData] = useState({
    districtId: "",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // const getList = () => {
  //   setLoading(true);
  //   const response = api
  //     .get(baseURL + `farmer/list-with-join`, _params)

  //     .then((response) => {
  //       setListData(response.data.content.farmer);
  //       setTotalRows(response.data.content.totalItems);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setListData({});
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   getList();
  // }, [page]);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/farmer-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/farmer-edit/${_id}`);
    // navigate("/seriui/state");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const response = api
          .delete(baseURL + `farmer/delete/${_id}`)
          .then((response) => {
            // deleteConfirm(_id);
            // getList();
            Swal.fire(
              "Deleted",
              "You successfully deleted this record",
              "success"
            );
          })
          .catch((err) => {
            deleteError();
          });
        // Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        console.log(result.value);
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  createTheme(
    "solarized",
    {
      text: {
        primary: "#004b8e",
        secondary: "#2aa198",
      },
      background: {
        default: "#fff",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#d3d3d3",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const DistrictDataColumns = [
    

    {
      name: "District Name",
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Count",
      selector: (row) => row.farmerCount,
      cell: (row) => <span>{row.farmerCount}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  const TalukDataColumns = [
    
    {
      name: "Taluk Name",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Count",
      selector: (row) => row.farmerCount,
      cell: (row) => <span>{row.farmerCount}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  // // to get Market
  // const [marketListData, setMarketListData] = useState([]);

  // const getMarketList = () => {
  //   const response = api
  //     .get(baseURL + `marketMaster/get-all`)
  //     .then((response) => {
  //       setMarketListData(response.data.content.marketMaster);
  //     })
  //     .catch((err) => {
  //       setMarketListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getMarketList();
  // }, []);

  

  return (
    <Layout title="District Wise Farmer Count">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">District Wise Farmer Count</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/districtWiseFarmerCount"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/districtWiseFarmerCount"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      {/* <Block className="mt-n4">
        <Card>
          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label>
                  District
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={data.districtId}
                      onChange={handleInputs}
                      onBlur={() => handleInputs}
                      required
                      isInvalid={
                        data.districtId === undefined || data.districtId === "0"
                      }
                    >
                      <option value="">Select District</option>
                      {districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>
                          {list.districtName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>

                

                <Col sm={2}>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => getTalukList(data.districtId)}
                  >
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row> */}

    <Block className="mt-n4">
      <Card style={{width:"48rem"}}>
        <Row className="m-2 align-items-center">
      <Col sm={1}>
        <Form.Label>District</Form.Label>
      </Col>
      <Col sm={4}>
        <div className="form-control-wrap">
          <Form.Select
            name="districtId"
            value={data.districtId}
            onChange={handleInputs}
            onBlur={() => handleInputs}
            required
            isInvalid={
              data.districtId === undefined || data.districtId === "0"
            }
          >
            <option value="">Select District</option>
            {districtListData.map((list) => (
              <option key={list.districtId} value={list.districtId}>
                {list.districtName}
              </option>
            ))}
          </Form.Select>
        </div>
      </Col>
      <Col sm={2}>
        <Button
          type="button"
          variant="primary"
          onClick={() => getTalukList(data.districtId)}
        >
          Search
        </Button>
      </Col>
    </Row>
  </Card>

        {isActive ? (
            <Row lg={10} className="d-flex">
              <Col lg={5} className="mt-2">
              <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={TalukDataColumns}
              data={listData}
              highlightOnHover
              // pagination
              // paginationServer
              // paginationTotalRows={totalRows}
              // paginationPerPage={countPerPage}
              // paginationComponentOptions={{
              //   noRowsPerPage: true,
              // }}
              // onChangePage={(page) => setPage(page - 1)}
              progressPending={loading}
              theme="solarized"
              customStyles={customStyles}
            />
              </Col>
            </Row>

          ) : (
            <Row lg={10} className="d-flex">
            <Col lg={5} className="mt-2">
            <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={DistrictDataColumns}
              data={districtFarmerListData}
              highlightOnHover
              // pagination
              // paginationServer
              // paginationTotalRows={totalRows}
              // paginationPerPage={countPerPage}
              // paginationComponentOptions={{
              //   noRowsPerPage: true,
              // }}
              // onChangePage={(page) => setPage(page - 1)}
              progressPending={loading}
              theme="solarized"
              customStyles={customStyles}
            />
             </Col>
             </Row>
          )}
      </Block>
    </Layout>
  );
}

export default DistrictWiseFarmerCountList;
