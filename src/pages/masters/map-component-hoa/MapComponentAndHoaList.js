import { Card, Button,Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
// import DataTable from "../../../components/DataTable/DataTable";
import DataTable from "react-data-table-component";
import StateDatas from "../../../store/masters/state/StateData";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
// import axios from "axios";
import { useTranslation } from "react-i18next";
import api from "../../../../src/services/auth/api";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MapComponentAndHoaList() {
    // Translation
    const { t } = useTranslation();

  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 30;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `master/cost/list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.unitCost);
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

const [searchData, setSearchData] = useState({
      schemeId: "",
      subSchemeId: "",
      scComponentId: "",
      pageNumber: page,
      pageSize: countPerPage,
    });

    let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setSearchData({ ...searchData, [name]: value });
  };
   const search = (e) => {
      api.get(`${baseURLDBT}master/cost/list-with-join`, { 
          params: {
              schemeId: searchData.schemeId,
              subSchemeId: searchData.subSchemeId,
              scComponentId: searchData.scComponentId,
              pageNumber: searchData.pageNumber,
              pageSize: searchData.pageSize,
          },
          headers: {
            "Content-Type": "application/json"
        }
      })
      .then((response) => {
          setListData(response.data.content.unitCost);
          setTotalRows(response.data.content.totalItems);
      })
      .catch((err) => {
          console.error("Error fetching data:", err);
          setListData([]);
      });
  };

  // to get sc-scheme-details
    const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
    const getSchemeList = () => {
      api
        .get(baseURLMasterData + `scSchemeDetails/get-all`)
        .then((response) => {
          setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
        })
        .catch((err) => {
          setScSchemeDetailsListData([]);
        });
    };
  
    useEffect(() => {
      getSchemeList();
    }, []);
  
    // to get sc-sub-scheme-details by sc-scheme-details
    const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
      []
    );
    const getSubSchemeList = (_id) => {
      api
        .get(baseURLDBT + `master/cost/get-by-scheme-id/${_id}`)
        .then((response) => {
          if (response.data.content.unitCost) {
            setScSubSchemeDetailsListData(response.data.content.unitCost);
          }
        })
        .catch((err) => {
          setScSubSchemeDetailsListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
      if (searchData.schemeId) {
        getSubSchemeList(searchData.schemeId);
      }
    }, [searchData.schemeId]);

    // to get component
      const [scComponentListData, setScComponentListData] = useState([]);
    
      const getComponentList = (schemeId, subSchemeId) => {
        api
          .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId`, {
            schemeId: schemeId,
            subSchemeId: subSchemeId,
          })
          .then((response) => {
            setScComponentListData(response.data.content.unitCost);
          })
          .catch((err) => {
            setScComponentListData([]);
          });
      };
    
      
      useEffect(() => {
        if (searchData.schemeId && searchData.subSchemeId) {
          getComponentList(searchData.schemeId, searchData.subSchemeId);
         
        }
      }, [searchData.schemeId, searchData.subSchemeId]);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/sc-scheme-details-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/map-component-edit/${_id}`);
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
          .delete(baseURLDBT + `master/cost/deleteMapComponentDetails/${_id}`)
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

  const ScSchemeDetailsDataColumns = [
    {
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.scSchemeDetailsId)}
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
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.id)}
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
          >
            <Icon name="trash" />
            Delete
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
        name: t("Head Of Account"),
        selector: (row) => row.scHeadAccountName,
        cell: (row) => <span>{row.scHeadAccountName}</span>,
        sortable: true,
        hide: "md",
      },
    // {
    //   name: t("Unit Type"),
    //   selector: (row) => row.unitType,
    //   cell: (row) => <span>{row.unitType}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
        name: t("Measurement Unit"),
        selector: (row) => row.measurementUnit,
        cell: (row) => <span>{row.measurementUnit}</span>,
        sortable: true,
        hide: "md",
      },

       {
        name: t("Release No"),
        selector: (row) => row.releaseNo,
        cell: (row) => <span>{row.releaseNo}</span>,
        sortable: true,
        hide: "md",
      },

       {
  name: t("Release Date"),
  selector: (row) => row.releaseDate,
  cell: (row) => {
    if (!row.releaseDate) return "-";
    const date = new Date(row.releaseDate);
    const formattedDate = date.toLocaleDateString("en-GB"); // dd/mm/yyyy
    return <span>{formattedDate}</span>;
  },
  sortable: true,
  hide: "md",
},

      // {
      //   name: t("Minimum Quantity"),
      //   selector: (row) => row.minQty,
      //   cell: (row) => <span>{row.minQty}</span>,
      //   sortable: true,
      //   hide: "md",
      // },
      // {
      //   name: t("Maximum Quantity"),
      //   selector: (row) => row.maxQty,
      //   cell: (row) => <span>{row.maxQty}</span>,
      //   sortable: true,
      //   hide: "md",
      // },
      // {
      //   name: t("Maximum Amount"),
      //   selector: (row) => row.maxAmount,
      //   cell: (row) => <span>{row.maxAmount}</span>,
      //   sortable: true,
      //   hide: "md",
      // },
      // {
      //   name: t("Minimum Amount"),
      //   selector: (row) => row.minAmount,
      //   cell: (row) => <span>{row.minAmount}</span>,
      //   sortable: true,
      //   hide: "md",
      // },
      {
        name: t("Unit Cost In  Rupees"),
        selector: (row) => row.unitCostInRupees,
        cell: (row) => <span>{row.unitCostInRupees}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Share in %"),
        selector: (row) => row.shareInPercentage,
        cell: (row) => <span>{row.shareInPercentage}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Scheme Name"),
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: t("Sub Scheme"),
        selector: (row) => row.subSchemeName,
        cell: (row) => <span>{row.subSchemeName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Category"),
        selector: (row) => row.codeNumber,
        cell: (row) => <span>{row.codeNumber}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Scheme Quota"),
        selector: (row) => row.schemeQuotaName,
        cell: (row) => <span>{row.schemeQuotaName   }</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Component"),
        selector: (row) => row.scComponentName,
        cell: (row) => <span>{row.scComponentName   }</span>,
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
  ];

  return (
    <Layout title="List Of Map Component and Hoa">
      <style>{mapComponentListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("List Of Map Component and Hoa")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/map-component"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/map-component"
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
          <Col sm={3}>
            <Form.Group className="form-group">
              <Form.Label>{t("Scheme")} </Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="schemeId"
                  value={searchData.schemeId}
                  onChange={handleInputs}
                 
                >
                  <option value="">{t("Select Scheme Names")}</option>
                  {scSchemeDetailsListData &&
                    scSchemeDetailsListData.map((list) => (
                      <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                        {list.schemeName}
                      </option>
                    ))}
                </Form.Select>
              
              </div>
            </Form.Group>
          </Col>

          <Col sm={3}>
            <Form.Group className="form-group" id="fid">
              <Form.Label>{t("Search By Component Type")}</Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="subSchemeId"
                  value={searchData.subSchemeId}
                  onChange={handleInputs}
                >
                  <option value="">{t("Select Component Type")}</option>
                  {scSubSchemeDetailsListData &&
                    scSubSchemeDetailsListData.map((list) => (
                      <option key={list.subSchemeId} value={list.subSchemeId}>
                        {list.subSchemeName}
                      </option>
                    ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>

          <Col sm={3}>
            <Form.Group className="form-group">
              <Form.Label>{t("Component")} </Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="scComponentId"
                  value={searchData.scComponentId}
                  onChange={handleInputs}
                  isInvalid={
                    searchData.scComponentId === undefined ||
                    searchData.scComponentId === "0"
                  }
                >
                  <option value="">{t("Select Component")}</option>
                  {scComponentListData &&
                    scComponentListData.map((list) => (
                      <option key={list.scComponentId} value={list.scComponentId}>
                        {list.scComponentName}
                      </option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {t("Component is required")}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </Col>

          

          <Col sm={2}>
            <Button type="button" variant="primary" onClick={search}>
              {t("search")}
            </Button>
          </Col>
        </Row>
      </Card>
    </Block>


      <Block className="mt-3 sh-form-wrap">
        <Card>
          <div style={{ overflowX: "auto" }}>
            <DataTable
              // title="TrainingProgram List"
              tableClassName="data-table-head-light table-responsive"
              columns={ScSchemeDetailsDataColumns}
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

const mapComponentListStyles = `
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

export default MapComponentAndHoaList;
