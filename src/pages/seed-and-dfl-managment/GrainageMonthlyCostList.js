import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable, { createTheme } from "react-data-table-component";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Icon } from "../../components";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const MONTH_LABEL = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function GrainageMonthlyCostList() {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grainageList, setGrainageList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [filter, setFilter] = useState({ grainageMasterId: "", financialYearMasterId: "" });
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));

    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => setFinancialYearList(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
  };

  const getList = () => {
    if (!filter.grainageMasterId) {
      Swal.fire({ icon: "warning", title: t("Please select a Grainage") });
      return;
    }
    setLoading(true);
    const params = { grainageMasterId: filter.grainageMasterId };
    if (filter.financialYearMasterId) params.financialYearMasterId = filter.financialYearMasterId;
    api
      .get(baseURLSeedDfl + `grainage-monthly-cost/get-by-grainage`, { params })
      .then((response) => {
        setListData(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(() => {
        setListData([]);
        setLoading(false);
      });
  };

  const grainageName = (id) => {
    const g = grainageList.find((x) => String(x.grainageMasterId) === String(id));
    return g ? g.grainageMasterName : id;
  };

  const handleEdit = (row) => {
    navigate(`/seriui/grainage-monthly-cost-edit/${row.grainageMonthlyCostId}`, {
      state: { row, grainageName: grainageName(row.grainageMasterId) },
    });
  };

  const deleteError = () => {
    Swal.fire({ icon: "error", title: t("Delete attempt was not successful"), text: t("Something went wrong!") });
  };

  const deleteConfirm = (_id) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("It will delete permanently!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
    }).then((result) => {
      if (result.value) {
        api
          .delete(baseURLSeedDfl + `grainage-monthly-cost/delete-info/${_id}`)
          .then(() => {
            getList();
            Swal.fire(t("Deleted"), t("You successfully deleted this record"), "success");
          })
          .catch(() => deleteError());
      } else {
        Swal.fire(t("Cancelled"), t("Your record is not deleted"), "info");
      }
    });
  };

  createTheme(
    "solarized",
    {
      text: { primary: "#004b8e", secondary: "#2aa198" },
      background: { default: "#fff" },
      context: { background: "#cb4b16", text: "#FFFFFF" },
      divider: { default: "#d3d3d3" },
      action: { button: "rgba(0,0,0,.54)", hover: "rgba(0,0,0,.02)", disabled: "rgba(0,0,0,.12)" },
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

  const columns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="d-flex align-items-center flex-nowrap gap-2" style={{ whiteSpace: "nowrap" }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleEdit(row)}
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Edit")}
          >
            <Icon name="edit" />
            <span>{t("Edit")}</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.grainageMonthlyCostId)}
            className="d-inline-flex align-items-center gap-1 shadow-sm"
            style={{ borderRadius: "6px", fontWeight: 500, fontSize: "12.5px", paddingInline: "10px" }}
            title={t("Delete")}
          >
            <Icon name="trash" />
            <span>{t("Delete")}</span>
          </Button>
        </div>
      ),
      sortable: false,
      grow: 2,
      minWidth: "220px",
    },
    {
      name: t("Grainage"),
      selector: (row) => grainageName(row.grainageMasterId),
      cell: (row) => <span>{grainageName(row.grainageMasterId)}</span>,
      sortable: true,
    },
    {
      name: t("Month"),
      selector: (row) => row.monthNo,
      cell: (row) => <span>{t(MONTH_LABEL[row.monthNo] || row.monthNo)}</span>,
      sortable: true,
    },
    {
      name: t("Staff Cost"),
      selector: (row) => row.staffCost,
      cell: (row) => <span>{row.staffCost ?? 0}</span>,
      sortable: true,
    },
    {
      name: t("Other Cost"),
      selector: (row) => row.otherCost,
      cell: (row) => <span>{row.otherCost ?? 0}</span>,
      sortable: true,
    },
    {
      name: t("Total Cost"),
      selector: (row) => (row.staffCost || 0) + (row.otherCost || 0),
      cell: (row) => <span>{(row.staffCost || 0) + (row.otherCost || 0)}</span>,
      sortable: true,
    },
    {
      name: t("Income"),
      selector: (row) => row.income,
      cell: (row) => <span>{row.income ?? 0}</span>,
      sortable: true,
    },
    {
      name: t("DCB Income"),
      selector: (row) => row.dcbIncome,
      cell: (row) => <span>{row.dcbIncome ?? 0}</span>,
      sortable: true,
    },
  ];

  return (
    <Layout title={t("List Of Grainage Monthly Cost")}>
      <style>{grainageMonthlyCostListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("List Of Grainage Monthly Cost")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/grainage-monthly-cost"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>{t("Create")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-list-wrap">
        <Card className="mb-3 sh-filter-card">
          <Card.Header className="sh-section-header">
            <Icon name="filter" />
            <span>{t("Filter")}</span>
          </Card.Header>
          <Card.Body>
            <Row className="g-gs align-items-end">
              <Col lg="4">
                <Form.Group className="form-group">
                  <Form.Label>{t("Grainage")}<span className="text-danger">*</span></Form.Label>
                  <Form.Select name="grainageMasterId" value={filter.grainageMasterId} onChange={handleChange}>
                    <option value="">{t("Select Grainage")}</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>
                        {g.grainageMasterName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg="4">
                <Form.Group className="form-group">
                  <Form.Label>{t("Financial Year")}</Form.Label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange}>
                    <option value="">{t("All")}</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>
                        {f.financialYear}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg="4">
                <Button variant="primary" onClick={getList} className="sh-save-btn">
                  <Icon name="search" />
                  <span>{t("Search")}</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="sh-list-card">
          <div className="sh-table-wrap">
            <DataTable
              tableClassName="data-table-head-light table-responsive"
              columns={columns}
              data={listData}
              highlightOnHover
              striped
              pointerOnHover
              pagination
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

const grainageMonthlyCostListStyles = `
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
  .sh-filter-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-list-card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-table-wrap {
    padding: 0 4px 4px;
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

export default GrainageMonthlyCostList;
