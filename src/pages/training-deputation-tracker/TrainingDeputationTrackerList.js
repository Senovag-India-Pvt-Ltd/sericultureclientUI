import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { createTheme } from 'react-data-table-component';
import { useNavigate } from "react-router-dom";
import {
  Icon,
  Select,
} from "../../components";
import api from "../../../src/services/auth/api";
import TrainingDeputationTracker from "./TrainingDeputationTracker";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
// const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TrainingDeputationTrackerList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [data, setData] = useState({
    text: "",
    searchBy: "officialName",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "officialName") {
      joinColumn = "trainingDeputationTracker.officialName";
    }
    if (data.searchBy === "mobileNumber") {
      joinColumn = "trainingDeputationTracker.mobileNumber";
    }
    // console.log(joinColumn);
    api
      .post(baseURL2 + `trainingDeputationTracker/search`, {
        searchText: data.text,
        joinColumn: joinColumn,
      }, {
        headers: _header,
      })
      .then((response) => {
        setListData(response.data.content.trainingDeputationTracker);

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
    const response = api
      .get(baseURL2 + `trainingDeputationTracker/list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.trainingDeputationTracker);
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
    navigate(`/training-deputation-tracker-view/${_id}`);
  };

  // const handleEdit = (_id) => {
  //   // navigate(`/caste/${_id}`);
  //   navigate("/caste-edit");
  // };

  const handleEdit = (_id) => {
    navigate(`/training-deputation-tracker-edit/${_id}`);
    // navigate("/training Schedule");
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
        console.log("hello");
        const response = api
          .delete(baseURL2 + `trainingDeputationTracker/delete/${_id}`)
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

  const TrainingDeputationTrackerDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.trainingDeputationId)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.trainingDeputationId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.trainingDeputationId)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: "Official Name",
      selector: (row) => row.officialName,
      cell: (row) => <span>{row.officialName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Designation",
      selector: (row) => row.name,
      cell: (row) => <span>{row.name}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: "Mobile Number",
        selector: (row) => row.mobileNumber,
        cell: (row) => <span>{row.mobileNumber}</span>,
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
  ];

  return (
    <Layout title="Training Deputation Tracker List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Training Deputation Tracker  List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/training-deputation-tracker" className="btn btn-primary btn-md d-md-none">
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/training-deputation-tracker"
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
                      <option value="officialName">Official Name</option>
                      <option value="mobileNumber">Mobile Number</option>
                    </Form.Select>
                  </div>
                </Col>
              
                <Col sm={3}>
                  <Form.Control
                    id="trScheduleId"
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
            // title="Training Schedule List"
            tableClassName="data-table-head-light table-responsive"
            columns={TrainingDeputationTrackerDataColumns}
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

export default TrainingDeputationTrackerList;