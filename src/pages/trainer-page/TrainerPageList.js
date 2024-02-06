import { Card, Button,Col,Row,Form  } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { createTheme } from 'react-data-table-component';
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../services/auth/api";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;
// const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TrainerPageList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [data, setData] = useState({
    text: "",
    searchBy: "username",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "username") {
      joinColumn = "userMaster.username";
    }
    if (data.searchBy === "trScheduleId") {
      joinColumn = "trSchedule.trScheduleId";
    }
    // console.log(joinColumn);
    api
      .post(baseURL2 + `trSchedule/search`, {
        searchText: data.text,
        joinColumn: joinColumn,
      }, {
        headers: _header,
      })
      .then((response) => {
        setListData(response.data.content.trSchedule);

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

  const [trScheduleList, setTrScheduleListData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
  });

  const getList = (e) => {
    // setLoading(true);
    api
      .post(baseURL2 + `trSchedule/get-by-user-master-id`,{userMasterId:e})
      .then((response) => {
        setListData(response.data.content.trSchedule);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
        if (response.data.content.error) {
          setListData([]);
        }
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    if (trScheduleList.userMasterId) {
      getList(trScheduleList.userMasterId);
    }
  }, [trScheduleList.userMasterId]);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/trainer-page-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/trainer-page-edit/${_id}`);
    // navigate("/state");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  // const deleteConfirm = (_id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "It will delete permanently!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.value) {
  //       api
  //         .delete(baseURL2 + `trSchedule/delete/${_id}`)
  //         .then((response) => {
  //           // deleteConfirm(_id);
  //           getList();
  //           Swal.fire(
  //             "Deleted",
  //             "You successfully deleted this record",
  //             "success"
  //           );
  //         })
  //         .catch((err) => {
  //           deleteError();
  //         });
  //       // Swal.fire("Deleted", "You successfully deleted this record", "success");
  //     } else {
  //       Swal.fire("Cancelled", "Your record is not deleted", "info");
  //     }
  //   });
  // };

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


  const TrTraineeLicenseDataColumns = [
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
            onClick={() => handleView(row.trScheduleId)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.trScheduleId)}
          >
            Edit
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.trScheduleId)}
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
      name: "User Name",
      selector: (row) => row.username,
      cell: (row) => <span>{row.username}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Training Institution Name",
      selector: (row) => row.trInstitutionMasterName,
      cell: (row) => <span>{row.trInstitutionMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: "Training Group Name",
        selector: (row) => row.trGroupMasterName,
        cell: (row) => <span>{row.trGroupMasterName}</span>,
        sortable: true,
        hide: "md",
    },
    {
        name: "Training Program Name",
        selector: (row) => row.trProgramMasterName,
        cell: (row) => <span>{row.trProgramMasterName}</span>,
        sortable: true,
        hide: "md",
    }, 
    {
      name: "Training Course Name",
      selector: (row) => row.trCourseMasterName,
      cell: (row) => <span>{row.trCourseMasterName}</span>,
      sortable: true,
      hide: "md",
  }, 
  {
    name: "Training Mode",
    selector: (row) => row.trModeMasterName,
    cell: (row) => <span>{row.trModeMasterName}</span>,
    sortable: true,
    hide: "md",
  },          
  ];

  return (
    <Layout title="Trainer Page List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Trainer Page List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="#"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
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
                      <option value="username">User Name</option>
                      <option value="trScheduleId">Training Schedule</option>
                      
                    </Form.Select>
                  </div>
                </Col>
              
                <Col sm={3}>
                  <Form.Control
                    id="reelerId"
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
            // title="Reeler License List"
            tableClassName="data-table-head-light table-responsive"
            columns={TrTraineeLicenseDataColumns}
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

export default TrainerPageList;
