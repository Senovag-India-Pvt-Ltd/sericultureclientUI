import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { createTheme } from "react-data-table-component";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function DistrictWiseMegaClusterList() {
  // Translation
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [data, setData] = useState({
    searchBy: "district",
    text: "",
  });

  const getList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `districtWiseMegaCluster/list`, _params)
      .then((response) => {
        setListData(response.data.content.districtWiseMegaCluster);
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
  const search = (e) => {
    const endpoint =
      data.searchBy === "megaCluster" ? `search-mega-cluster` : `search-district`;
    api
      .get(baseURL + `districtWiseMegaCluster/${endpoint}`, {
        params: { searchText: data.text },
      })
      .then((response) => {
        setListData(response.data.content.districtWiseMegaCluster);
      })
      .catch((err) => {
        // saveError();
      });
  };

  const handleInputs = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/district-wise-mega-cluster-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/district-wise-mega-cluster-edit/${_id}`);
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
          .delete(baseURL + `districtWiseMegaCluster/delete/${_id}`)
          .then((response) => {
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
      } else {
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

  const DistrictWiseMegaClusterDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => handleView(row.districtWiseMegaClusterId)}
          >
            <Icon name="eye" />
            <span>{t("View")}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => handleEdit(row.districtWiseMegaClusterId)}
          >
            <Icon name="edit" />
            <span>{t("Edit")}</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.districtWiseMegaClusterId)}
            className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
          >
            <Icon name="trash" />
            <span>{t("delete")}</span>
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: t("district"),
      selector: (row) => row.districtName,
      cell: (row) => <span>{row.districtName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Mega Cluster"),
      selector: (row) => row.name,
      cell: (row) => <span>{row.name}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="District Wise Mega Cluster List">
      <style>{districtWiseMegaClusterListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("District Wise Mega Cluster List")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/district-wise-mega-cluster"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("create")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/district-wise-mega-cluster"
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
                  Search By
                </Form.Label>
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="searchBy"
                      value={data.searchBy}
                      onChange={handleInputs}
                    >
                      <option value="district">{t("district")}</option>
                      <option value="megaCluster">{t("Mega Cluster")}</option>
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
                  <Button
                    type="button"
                    variant="primary"
                    onClick={search}
                    className="d-inline-flex align-items-center gap-1"
                  >
                    <Icon name="search" />
                    <span>{t("search")}</span>
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={DistrictWiseMegaClusterDataColumns}
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

const districtWiseMegaClusterListStyles = `
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

export default DistrictWiseMegaClusterList;
