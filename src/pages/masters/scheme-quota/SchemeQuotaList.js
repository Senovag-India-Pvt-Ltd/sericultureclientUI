// import { Card, Button } from "react-bootstrap";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { createTheme } from "react-data-table-component";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SchemeQuotaList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [data, setData] = useState({
    searchBy: "scHeadAccountName",
    text: "",
  });

  // console.log("Test",data);
  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `schemeQuota/list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.schemeQuota);
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

  // Search
//   const search = (e) => {
//     let joinColumn;
//     if (data.searchBy === "scHeadAccountName") {
//       joinColumn = "scHeadAccount.scHeadAccountName";
//     }
//     if (data.searchBy === "categoryName") {
//       joinColumn = "scCategory.categoryName";
//     }
//     console.log(joinColumn);
//     api
//       .post(baseURL + `scUnitCost/search`, {
//         searchText: data.text,
//         joinColumn: joinColumn,
//       })
//       .then((response) => {
//         setListData(response.data.content.ScUnitCost);

//         // if (response.data.content.error) {
//         //   // saveError();
//         // } else {
//         //   console.log(response);
//         //   // saveSuccess();
//         // }
//       })
//       .catch((err) => {
//         // saveError();
//       });
//   };

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/scheme-quota-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/scheme-quota-edit/${_id}`);
    // navigate("/seriui/district");
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
          .delete(baseURL + `schemeQuota/delete/${_id}`)
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

  const ScUnitCostDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.schemeQuotaId)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.schemeQuotaId)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.schemeQuotaId)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow:2,
    },
    {
        name: "Scheme Details",
        selector: (row) => row.schemeName,
        cell: (row) => <span>{row.schemeName}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: "Scheme Quota Name",
      selector: (row) => row.schemeQuotaName,
      cell: (row) => <span>{row.schemeQuotaName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Scheme Quota Type",
      selector: (row) => row.schemeQuotaType,
      cell: (row) => <span>{row.schemeQuotaType}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Scheme Quota Code",
      selector: (row) => row.schemeQuotaCode,
      cell: (row) => <span>{row.schemeQuotaCode}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Scheme Quota Payment Type",
      selector: (row) => row.schemeQuotaPaymentType,
      cell: (row) => <span>{row.schemeQuotaPaymentType}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "DBT Code",
      selector: (row) => row.dbtCode,
      cell: (row) => <span>{row.dbtCode}</span>,
      sortable: true,
      hide: "md",
    },

  ];

  return (
    <Layout title="List Of Scheme Quota">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">List Of Scheme Quota</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/scheme-quota"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/scheme-quota"
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

      {/* <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            data={DistrictDatas}
            columns={DistrictDataColumns}
            expandableRows
          />
        </Card>
      </Block> */}

      <Block className="mt-n4">
        <Card>
          {/* <Row className="m-2">
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
                      <option value="scHeadAccountName">ScHeadAccount</option>
                      <option value="categoryName">ScCategory</option>
                    </Form.Select>
                  </div>
                </Col>

                <Col sm={3}>
                  <Form.Control
                    id="fruitsId"
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
          </Row> */}

          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ScUnitCostDataColumns}
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

export default SchemeQuotaList;
