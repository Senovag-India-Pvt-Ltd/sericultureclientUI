import { Card, Button, Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { createTheme } from "react-data-table-component";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ScProgramApprovalMappingList() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  // const [data, setData] = useState({
  //   text: "",
  //   searchBy: "scProgramName",
  // });

  // const handleInputs = (e) => {
  //   // debugger;
  //   let { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  // // Search
  // const search = (e) => {
  //   let joinColumn;
  //   if (data.searchBy === "scProgramName") {
  //     joinColumn = "scProgram.scProgramName";
  //   }
  //   if (data.searchBy === "stageName") {
  //     joinColumn = "scApprovalStage.stageName";
  //   }
  //   // console.log(joinColumn);
  //   api
  //     .post(baseURL + `scProgramApprovalMapping/search`, {
  //       searchText: data.text,
  //       joinColumn: joinColumn,
  //     })
  //     .then((response) => {
  //       setListData(response.data.content.scProgramApprovalMapping);
  //     })
  //     .catch((err) => {
  //     });
  // };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `master/cost/subScheme-work-flow-list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.subSchemeWorkFlow);
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
  // const handleView = (_id) => {
  //   navigate(`/seriui/sc-program-approval-mapping-view/${_id}`);
  // };

  const handleEdit = (_id) => {
    navigate(`/seriui/sc-program-approval-mapping-edit/${_id}`);
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
          .delete(baseURLDBT + `master/cost/deleteSubSchemeWorkFlowDetails/${_id}`)
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
        minHeight: "10px", // adjust this value to your desired row height
      },
    },
    // header: {
    //   style: {
    //     minHeight: "56px",
    //   },
    // },
    // headRow: {
    //   style: {
    //     borderTopStyle: "solid",
    //     borderTopWidth: "1px",
    //     // borderTop:"none",
    //     // borderTopColor: defaultThemes.default.divider.default,
    //     borderColor: "black",
    //   },
    // },
    headCells: {
      style: {
        // '&:not(:last-of-type)': {
        backgroundColor: "#1e67a8",
        color: "#fff",
        borderStyle: "solid",
        bordertWidth: "1px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
    cells: {
      style: {
        // '&:not(:last-of-type)': {
        borderStyle: "solid",
        borderWidth: "1px",
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
  };
  const ScProgramApprovalMappingDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.scProgramApprovalMappingId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id)}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      // grow:2,
    },
    {
      name: "Component Type",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Approval Stage",
      selector: (row) => row.stepName,
      cell: (row) => <span>{row.stepName}</span>,
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
      name: "Amount",
      selector: (row) => row.amount,
      cell: (row) => <span>{row.amount}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Orders",
      selector: (row) => row.stepId,
      cell: (row) => <span>{row.stepId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Version",
      selector: (row) => row.version,
      cell: (row) => <span>{row.version}</span>,
      sortable: true,
      hide: "md",
    },
   
  ];

  return (
    <Layout title="List Of Program Approval Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">List Of Program Approval Mapping</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-program-approval-mapping"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-program-approval-mapping"
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
                      <option value="scProgramName">Program</option>
                      <option value="stageName">Approval Stage</option>
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
            columns={ScProgramApprovalMappingDataColumns}
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

export default ScProgramApprovalMappingList;
