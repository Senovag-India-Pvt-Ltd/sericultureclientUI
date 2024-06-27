import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function DistrictWiseFarmerCountList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };


  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    api
      .get(baseURLFarmer + `farmer/districtWiseFarmerCount`)
      .then((response) => {
        if (response.data.content.districtName) {
          setDistrictListData(response.data.content.districtName);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (districtId) => {
    api
      .post(baseURLFarmer + `farmer/talukWise`,{districtId})
      .then((response) => {
        if (response.data.content) {
          setTalukListData(response.data.content);
        } else {
          setTalukListData([]);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  // useEffect(() => {
  //   if (addressDetails.districtId) {
  //     getTalukList(addressDetails.districtId);
  //   }
  // }, [addressDetails.districtId]);

  // const [landData, setLandData] = useState({
  //   landId: "",
  //   talukId: "",
  // });

  // Search
  const [isActive, setIsActive] = useState(false);
  const display = () => {
    const districtId = data.districtId;
    const response = api
      .get(baseURLFarmer + `farmer/get-by-district-id/${districtId}`)
      .then((response) => {
        setMarket(response.data.content);
        setListData(response.data.content.farmer);
        setLoading(false);
        // setIsActive(true);
      })
      .catch((err) => {
        setMarket({});
        setLoading(false);
      });
    setIsActive((current) => !current);
    // setIsActive(false);
    // });
  };

  const [data, setData] = useState({
    districtId: "",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `farmer/list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.farmer);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

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
            getList();
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

  const RaceDataColumns = [
    {
      name: "action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.farmerId)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.farmerId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.farmerId)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    // {
    //   name: "Market",
    //   selector: (row) => row.marketMasterName,
    //   cell: (row) => <span>{row.marketMasterName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: "Farmer Count",
      selector: (row) => row.farmerCount,
      cell: (row) => <span>{row.farmerCount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Taluk Name",
      selector: (row) => row.talukName,
      cell: (row) => <span>{row.talukName}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
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

  return (
    <Layout title="District Wise Farmer Count List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Farmer Count List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
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
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  Market
                </Form.Label>
                <Col sm={3}>
                  {/* <Form.Label>Market</Form.Label> */}
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={data.districtId}
                      onChange={handleInputs}
                      onBlur={() => handleInputs}
                      required
                      isInvalid={
                        data.districtId === undefined ||
                        data.districtId === "0"
                      }
                    >
                      <option value="">Select Market</option>
                      {districtListData.map((list) => (
                        <option
                          key={list.districtId}
                          value={list.districtId}
                        >
                          {list.districtName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>

                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={display}>
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <div className={isActive ? "" : "d-none"}>
            <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={RaceDataColumns}
              data={listData}
              highlightOnHover
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={countPerPage}
              paginationComponentOptions={{
                noRowsPerPage: true,
              }}
              onChangePage={(page) => setPage(page - 1)}
              progressPending={loading}
              theme="solarized"
              customStyles={customStyles}
            />
          </div>
        </Card>
      </Block>
    </Layout>
  );
}

export default DistrictWiseFarmerCountList;
