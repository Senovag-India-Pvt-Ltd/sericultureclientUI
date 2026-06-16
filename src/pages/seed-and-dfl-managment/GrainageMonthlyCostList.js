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
    rows: { style: { minHeight: "45px" } },
    headCells: {
      style: { backgroundColor: "#1e67a8", color: "#fff", fontSize: "14px", paddingLeft: "8px", paddingRight: "8px" },
    },
    cells: { style: { paddingLeft: "8px", paddingRight: "8px" } },
  };

  const columns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="text-start w-100">
          <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ms-2"
            onClick={() => deleteConfirm(row.grainageMonthlyCostId)}
          >
            {t("Delete")}
          </Button>
        </div>
      ),
      sortable: false,
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
  ];

  return (
    <Layout title={t("List Of Grainage Monthly Cost")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("List Of Grainage Monthly Cost")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/grainage-monthly-cost"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
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
                <Button variant="primary" onClick={getList}>
                  <Icon name="search" />
                  <span>{t("Search")}</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={columns}
            data={listData}
            highlightOnHover
            pagination
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default GrainageMonthlyCostList;
