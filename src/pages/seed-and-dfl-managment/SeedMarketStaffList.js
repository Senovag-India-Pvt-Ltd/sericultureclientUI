import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable, { createTheme } from "react-data-table-component";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Icon } from "../../components";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const MONTHS = [
  { v: 1, l: "January" }, { v: 2, l: "February" }, { v: 3, l: "March" },
  { v: 4, l: "April" }, { v: 5, l: "May" }, { v: 6, l: "June" },
  { v: 7, l: "July" }, { v: 8, l: "August" }, { v: 9, l: "September" },
  { v: 10, l: "October" }, { v: 11, l: "November" }, { v: 12, l: "December" },
];

function SeedMarketStaffList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    marketId: localStorage.getItem("marketId") || "",
    reportYear: new Date().getFullYear(),
    reportMonth: new Date().getMonth() + 1,
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  const getList = () => {
    if (!filter.marketId || !filter.reportYear || !filter.reportMonth) {
      setRows([]);
      return;
    }
    setLoading(true);
    api
      .get(baseURLSeedDfl + `seed-market-staff-position/get-by-market`, {
        params: { marketId: filter.marketId, reportYear: filter.reportYear, reportMonth: filter.reportMonth },
      })
      .then((res) => {
        setRows(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setRows([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.marketId, filter.reportYear, filter.reportMonth]);

  const handleEdit = (row) => {
    // No get-by-id endpoint exists, so carry the row to the edit page (and cache it for refresh).
    localStorage.setItem(`smsp_${row.seedMarketStaffPositionId}`, JSON.stringify(row));
    navigate(`/seriui/seed-market-staff-edit/${row.seedMarketStaffPositionId}`, { state: { row } });
  };

  const deleteConfirm = (id) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("It will delete permanently!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
    }).then((result) => {
      if (result.value) {
        api
          .get(baseURLSeedDfl + `seed-market-staff-position/delete-info/${id}`)
          .then(() => {
            getList();
            Swal.fire(t("Deleted"), t("You successfully deleted this record"), "success");
          })
          .catch(() => {
            Swal.fire({ icon: "error", title: t("Delete attempt was not successful"), text: t("Something went wrong!") });
          });
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
    rows: { style: { minHeight: "45px" } },
    headCells: { style: { backgroundColor: "#1e67a8", color: "#fff", fontSize: "14px", paddingLeft: "8px", paddingRight: "8px" } },
    cells: { style: { paddingLeft: "8px", paddingRight: "8px" } },
  };

  const columns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="text-start w-100">
          <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>{t("Edit")}</Button>
          <Button variant="danger" size="sm" className="ms-2" onClick={() => deleteConfirm(row.seedMarketStaffPositionId)}>{t("Delete")}</Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
    { name: t("Designation"), selector: (row) => row.designationCode, cell: (row) => <span>{row.designationCode}</span>, sortable: true, hide: "md" },
    { name: t("Sanctioned"), selector: (row) => row.sanctioned, cell: (row) => <span>{row.sanctioned}</span>, sortable: true, hide: "md" },
    { name: t("Filled"), selector: (row) => row.filled, cell: (row) => <span>{row.filled}</span>, sortable: true, hide: "md" },
    { name: t("Vacant"), selector: (row) => row.vacant, cell: (row) => <span>{row.vacant}</span>, sortable: true, hide: "md" },
    { name: t("Deputed"), selector: (row) => row.deputed, cell: (row) => <span>{row.deputed}</span>, sortable: true, hide: "md" },
    { name: t("Outsourced"), selector: (row) => row.outsourced, cell: (row) => <span>{row.outsourced}</span>, sortable: true, hide: "md" },
  ];

  return (
    <Layout title={t("Seed Market Staff Establishment List")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Seed Market Staff Establishment List")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/seed-market-staff-entry" className="btn btn-primary d-none d-md-inline-flex">
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label>{t("Market Id")} *</Form.Label>
                <Form.Control type="number" name="marketId" value={filter.marketId} onChange={handleFilter} />
              </Col>
              <Col md={3}>
                <Form.Label>{t("Year")} *</Form.Label>
                <Form.Control type="number" name="reportYear" value={filter.reportYear} onChange={handleFilter} />
              </Col>
              <Col md={3}>
                <Form.Label>{t("Month")} *</Form.Label>
                <Form.Select name="reportMonth" value={filter.reportMonth} onChange={handleFilter}>
                  {MONTHS.map((m) => (<option key={m.v} value={m.v}>{m.l}</option>))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={columns}
            data={rows}
            highlightOnHover
            pagination
            paginationPerPage={5}
            paginationComponentOptions={{ noRowsPerPage: true }}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
            noDataComponent={<div className="p-4 text-muted">{t("No entries for this market/month.")}</div>}
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default SeedMarketStaffList;
