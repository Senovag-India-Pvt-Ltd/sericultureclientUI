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
import { useTranslation } from "react-i18next";
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScProgramApprovalMappingList() {
  // Translation
  const { t } = useTranslation();
  
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 30;
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

  const [searchData, setSearchData] = useState({
      subSchemeId: "",
      pageNumber: page,
      pageSize: countPerPage,
    });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setSearchData({ ...searchData, [name]: value });
  };

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

  const search = (e) => {
    api.get(`${baseURLDBT}master/cost/subScheme-work-flow-list-with-join`, { 
        params: {
            subSchemeId: searchData.subSchemeId,
            pageNumber: searchData.pageNumber,
            pageSize: searchData.pageSize,
        },
        headers: {
          "Content-Type": "application/json"
      }
    })
    .then((response) => {
        setListData(response.data.content.subSchemeWorkFlow);
        setTotalRows(response.data.content.totalItems);
    })
    .catch((err) => {
        console.error("Error fetching data:", err);
        setListData([]);
    });
};

  // to get sc-sub-scheme-details by sc-scheme-details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
    []
  );
  const getSubSchemeList = () => {
    api
      .get(baseURL + `scSubSchemeDetails/get-all`)
      .then((response) => {
        if (response.data.content.scSubSchemeDetails) {
          setScSubSchemeDetailsListData(
            response.data.content.scSubSchemeDetails
          );
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);


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
    table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
    rows: {
      style: { minHeight: "52px", fontSize: "13.5px", color: "#2b2d42", borderBottom: "1px solid #eef1f6 !important", transition: "background-color 0.15s ease" },
      highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
      stripedStyle: { backgroundColor: "#fbfcfe" },
    },
    headRow: { style: { minHeight: "50px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
    headCells: {
      style: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
  };
  const ScProgramApprovalMappingDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
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
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            onClick={() => handleEdit(row.id)}
          >
           <Icon name="edit" />
           {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id)}
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
          >
             <Icon name="trash" />
             {t("delete")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      width: "220px",
      minWidth: "220px",
      grow: 0,
    },
    {
      name: t("Component Type"),
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Approval Stage"),
      selector: (row) => row.stepName,
      cell: (row) => <span>{row.stepName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Designation"),
      selector: (row) => row.name,
      cell: (row) => <span>{row.name}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Amount"),
      selector: (row) => row.amount,
      cell: (row) => <span>{row.amount}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Orders"),
      selector: (row) => row.stepId,
      cell: (row) => <span>{row.stepId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Version"),
      selector: (row) => row.version,
      cell: (row) => <span>{row.version}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Action"),
      selector: (row) => row.action,
      cell: (row) => <span>{row.action}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Designation Step"),
      selector: (row) => row.designationStep,
      cell: (row) => <span>{row.designationStep}</span>,
      sortable: true,
      hide: "md",
    },
   
  ];

  return (
    <Layout title="List Of Program Approval Mapping">
      <style>{scProgramApprovalMappingListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("List Of Program Approval Mapping")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/sc-program-approval-mapping"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/sc-program-approval-mapping"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <Row className="m-2">
            <Col>
              <Form.Group as={Row} className="form-group" id="fid">
                <Form.Label column sm={1}>
                  {t("Search By Component Type")}
                </Form.Label>
                <Col sm={3}>
                  {/* <Form.Group className="form-group mt-n4"> */}
                    {/* <Form.Label>
                    {t("Component Type")}
                      <span className="text-danger">*</span>
                    </Form.Label> */}
                    <div className="form-control-wrap">
                      <Form.Select
                        name="subSchemeId"
                        value={searchData.subSchemeId}
                        onChange={handleInputs}
                      >
                        <option value="">{t("Select Component Type")}</option>
                        {scSubSchemeDetailsListData &&
                          scSubSchemeDetailsListData.map((list) => (
                            <option
                              key={list.scSubSchemeDetailsId}
                              value={list.scSubSchemeDetailsId}
                            >
                              {list.subSchemeName}
                            </option>
                          ))}
                      </Form.Select>
                    </div>
                  {/* </Form.Group> */}
                </Col>

                <Col sm={3}>
                  <Button type="button" variant="primary" onClick={search}>
                  {t("search")}
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>
          </Card>
         </Block>

      <Block className='mt-3 sh-form-wrap'>
        <Card>
          <div style={{ overflowX: "auto" }}>
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
              progressComponent={<div className="p-3">{t("Loading...")}</div>}
              theme="solarized"
              customStyles={customStyles}
              noDataComponent={t("There are no records to display")}
            />
          </div>
        </Card>
      </Block>
    </Layout>
  );
}

const scProgramApprovalMappingListStyles = `
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
`;

export default ScProgramApprovalMappingList;
