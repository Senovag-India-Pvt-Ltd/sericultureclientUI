import { Card, Button, Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { createTheme } from "react-data-table-component";
import DataTable from "react-data-table-component";
import StakeHolderDatas from "../../store/stakeHolder/StakeHolderData";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function OtherStateFarmerList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage, type: 1 } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [data, setData] = useState({
    text: "",
    searchBy: "",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "fruitsId") {
      joinColumn = "farmer.fruitsId";
    }
    if (data.searchBy === "farmerNumber") {
      joinColumn = "farmer.farmerNumber";
    }
    if (data.searchBy === "mobileNumber") {
      joinColumn = "farmer.mobileNumber";
    }
    // console.log(joinColumn);
    const parameters = {
      params: {
        pageNumber: page,
        size: countPerPage,
        type: 1,
        searchText: data.text,
      },
    };
    api
      .get(baseURL2 + `farmer/list-with-join-with-filters`, parameters)
      .then((response) => {
        setListData(response.data.content.farmer);

        // if (response.data.content.error) {
        //   // saveError();
        // } else {
        //   console.log(response);
        //   // saveSuccess();
        // }
      })
      .catch((err) => {
        // saveError();
      });
  };

  const getList = () => {
    setLoading(true);
    api
      .get(baseURL2 + `farmer/list-with-join-with-filters`, _params)
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
    navigate(`/seriui/stake-holder-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/stake-holder-edit/${_id}`);
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
        api
          .delete(baseURL2 + `farmer/delete/${_id}`)
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

  const StakeHolderDataColumns = [
    {
      name: "Action",
      width: "300px",
      headerStyle: (selector, id) => {
        return { textAlign: "center" };
      },
      cell: (row) => (
        //   Button style
        <div className="text-end w-100 d-flex justify">
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
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.farmerId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: "Name",
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Fruits ID",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer Number",
      selector: (row) => row.farmerNumber,
      cell: (row) => <span>{row.farmerNumber}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "DOB",
    //   selector: (row) => row.dob,
    //   cell: (row) => <span>{row.dob}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "District",
    //   selector: (row) => row.districtName,
    //   cell: (row) => <span>{row.districtName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: "Taluk",
    //   selector: (row) => row.talukName,
    //   cell: (row) => <span>{row.talukName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },

    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Passbook Number",
      selector: (row) => row.passbookNumber,
      cell: (row) => <span>{row.passbookNumber}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: "Gender",
    //   selector: (row) => row.genderId,
    //   cell: (row) => <span>{row.genderId  === 1
    //     ? 'Male'
    //     : row.gender === 2
    //     ? 'Female'
    //     : 'Other'}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
  ];

  return (
    <Layout title="Other State Farmer List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Other State Farmer List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/other-state-farmer"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/other-state-farmer"
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
                  Search By
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="searchBy"
                      value={data.searchBy}
                      onChange={handleInputs}
                    >
                      {/* <option value="">Select</option> */}
                      {/* <option value="fruitsId">Fruits ID</option> */}
                      <option value="farmerNumber">Farmer Number</option>
                      {/* <option value="mobileNumber">Mobile Number</option> */}
                    </Form.Select>
                  </div>
                </Col>

                <Col sm={3}>
                  <Form.Control
                    id="farmerId"
                    name="text"
                    value={data.text}
                    onChange={handleInputs}
                    type="text"
                    placeholder="Search"
                  />
                </Col>
                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>
          <DataTable
            // title="Stake Holder List"
            tableClassName="data-table-head-light table-responsive"
            columns={StakeHolderDataColumns}
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
        </Card>
      </Block>
    </Layout>
  );
}

export default OtherStateFarmerList;
