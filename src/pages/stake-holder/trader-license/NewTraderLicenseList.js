import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function NewTraderLicenseList() {
   // Translation
   const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 50;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [data, setData] = useState({
    text: "",
    searchBy: "traderTypeMasterName",
  });

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Search
  const search = (e) => {
    let joinColumn;
    if (data.searchBy === "traderTypeMasterName") {
      joinColumn = "traderTypeMaster.traderTypeMasterName";
    }
    if (data.searchBy === "arnNumber") {
      joinColumn = "traderLicense.arnNumber";
    }
    if (data.searchBy === "firstName") {
      joinColumn = "traderLicense.firstName";
    }
    api
      .post(
        baseURL2 + `trader-license/search`,
        {
          searchText: data.text,
          joinColumn: joinColumn,
        },
        {
          headers: _header,
        }
      )
      .then((response) => {
        setListData(response.data.content.traderLicense);
      })
      .catch((err) => {
      });
  };

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `trader-license/list-with-join`, _params)
      .then((response) => {
        setListData(response.data.content.traderLicense);
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
    navigate(`/seriui/issue-new-trader-license-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/issue-new-trader-license-edit/${_id}`);
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
          .delete(baseURL2 + `trader-license/delete/${_id}`)
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
    table: {
      style: {
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)",
      },
    },
    rows: {
      style: {
        minHeight: "52px",
        fontSize: "13.5px",
        color: "#2b2d42",
        borderBottom: "1px solid #eef1f6 !important",
        transition: "background-color 0.15s ease",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f4f8fd",
        cursor: "pointer",
        outline: "none",
      },
      stripedStyle: {
        backgroundColor: "#fbfcfe",
      },
    },
    headRow: {
      style: {
        minHeight: "50px",
        background:
          "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
      },
    },
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
    pagination: {
      style: {
        borderTop: "1px solid #eef1f6",
        fontSize: "13px",
        color: "#5a6577",
      },
    },
  };

  const NewTraderLicenseDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="d-flex flex-nowrap align-items-center gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleView(row.traderLicenseId)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "12.5px",
              paddingInline: "10px",
            }}
            title={t("View")}
          >
            <Icon name="eye" />
            <span>{t("View")}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleEdit(row.traderLicenseId)}
            className="d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "12.5px",
              paddingInline: "10px",
            }}
            title={t("Edit")}
          >
            <Icon name="edit" />
            <span>{t("Edit")}</span>
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.traderLicenseId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      width: "220px",
      minWidth: "220px",
      grow: 0,
    },
    {
      name: t("ARN Number"),
      selector: (row) => row.arnNumber,
      cell: (row) => <span>{row.arnNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Trader Type"),
      selector: (row) => row.traderTypeMasterName,
      cell: (row) => <span>{row.traderTypeMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Name of the Applicant"),
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("mobile_number"),
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("address"),
      selector: (row) => row.address,
      cell: (row) => <span>{row.address}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Trader License Number"),
      selector: (row) => row.traderLicenseNumber,
      cell: (row) => <span>{row.traderLicenseNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Virtual Account Number"),
      selector: (row) => row.virtualAccountNumber,
      cell: (row) => <span>{row.virtualAccountNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Branch Name"),
      selector: (row) => row.branchName,
      cell: (row) => <span>{row.branchName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("IFSC Code"),
      selector: (row) => row.ifscCode,
      cell: (row) => <span>{row.ifscCode}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Market"),
      selector: (row) => row.marketMasterName,
      cell: (row) => <span>{row.marketMasterName}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="New Trader License List">
      <style>{traderListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("New Trader License List")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/issue-new-trader-license"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/issue-new-trader-license"
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

      <Block className="mt-n4 sh-list-wrap">
        <Card className="sh-list-card">
          <Card.Body className="pb-0">
            <Row className="g-2 align-items-end sh-search-bar">
              <Col xs={12} md={3}>
                <Form.Label className="sh-field-label">
                  {t("Search By")}
                </Form.Label>
                <Form.Select
                  name="searchBy"
                  value={data.searchBy}
                  onChange={handleInputs}
                  className="sh-control"
                >
                  <option value="traderTypeMasterName">{t("Trader Type")}</option>
                  <option value="arnNumber">{t("ARN Number")}</option>
                  <option value="firstName"> {t("Name")}</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={5}>
                <Form.Label className="sh-field-label">{t("Search")}</Form.Label>
                <div className="sh-search-wrap">
                  <Icon name="search" className="sh-search-icon" />
                  <Form.Control
                    id="traderLicenseId"
                    name="text"
                    value={data.text}
                    onChange={handleInputs}
                    type="text"
                    placeholder={t("Search")}
                    className="sh-control sh-search-input"
                  />
                </div>
              </Col>
              <Col xs={12} md={4}>
                <Button
                  type="button"
                  variant="primary"
                  onClick={search}
                  className="sh-search-btn"
                >
                  <Icon name="search" />
                  <span className="ms-1">{t("search")}</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
          <div className="sh-table-wrap">
            <DataTable
              // title="New Trader License List"
              tableClassName="data-table-head-light table-responsive"
              columns={NewTraderLicenseDataColumns}
              data={listData}
              highlightOnHover
              striped
              pointerOnHover
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
              noDataComponent={
                <div className="sh-empty">
                  <Icon name="inbox" />
                  <p className="mt-2 mb-0">{t("No records found")}</p>
                </div>
              }
            />
          </div>
        </Card>
      </Block>
    </Layout>
  );
}

const traderListStyles = `
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
  .sh-list-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-list-card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-search-bar {
    margin-bottom: 14px;
  }
  .sh-field-label {
    font-size: 12.5px;
    font-weight: 600;
    color: #5a6577;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-control {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-control:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-control:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
  }
  .sh-search-wrap {
    position: relative;
  }
  .sh-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #8a96a8;
    pointer-events: none;
    z-index: 2;
  }
  .sh-search-input {
    padding-left: 36px !important;
  }
  .sh-search-btn {
    border-radius: 8px;
    font-weight: 600;
    padding: 8px 16px;
    display: inline-flex;
    align-items: center;
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    border: none;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-search-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.3);
  }
  .sh-table-wrap {
    padding: 0 4px 4px;
    overflow-x: auto;
  }
  .sh-empty {
    padding: 36px 12px;
    text-align: center;
    color: #8a96a8;
    font-size: 14px;
  }
  .sh-empty svg {
    width: 40px;
    height: 40px;
    opacity: 0.5;
  }
`;

export default NewTraderLicenseList;
