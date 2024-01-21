import { Card, Button,Col,Row,Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { createTheme } from 'react-data-table-component';
import React from "react";
import Swal from "sweetalert2";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import GodawnDatas from "../../../store/masters/godawn/GodawnData";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function GodawnList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [data, setData] = useState({
    searchBy: "godown",
    text: "",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "godown") {
      joinColumn = "godown.godownName";
    }
    if (data.searchBy === "marketMaster") {
      joinColumn = "marketMaster.marketMasterName";
    }
    // console.log(joinColumn);
    api
      .post(baseURL + `godown/search`, {
        searchText: data.text,
        joinColumn: joinColumn,
      })
      .then((response) => {
        setListData(response.data.content.godown);

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
      .get(baseURL + `godown/list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.godown);
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
    navigate(`/godawn-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/godawn-edit/${_id}`);
    // navigate("/district");
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
          .delete(baseURL + `godown/delete/${_id}`)
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

  const GodawnDataColumns = [
    {
      name: "action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.godownId)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.godownId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.godownId)}
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
      name: "Market",
      selector: (row) => row.marketMasterName,
      cell: (row) => <span>{row.marketMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Godown Name",
      selector: (row) => row.godownName,
      cell: (row) => <span>{row.godownName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Godown Name In Kannada",
      selector: (row) => row.godownNameInKannada,
      cell: (row) => <span>{row.godownNameInKannada}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  return (
    <Layout title="Godown List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Godown List</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
            <li>
                <Link to="/godawn" className="btn btn-primary btn-md d-md-none">
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/godawn"
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

      <Block className= "mt-n4">
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
                      <option value="godown">Godown</option>
                      <option value="marketMaster">Market</option>
                    </Form.Select>
                  </div>
                </Col>
              
                <Col sm={3}>
                  <Form.Control
                    id="godownId"
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
            tableClassName="data-table-head-light table-responsive"
            columns={GodawnDataColumns}
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

export default GodawnList;
