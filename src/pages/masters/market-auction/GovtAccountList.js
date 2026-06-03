import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function GovtAccountList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const countPerPage = 10;

  const getList = () => {
    setLoading(true);
    api
      .get(baseURL + `govtAccount/get-all`, { params: { pageNumber: page, size: countPerPage } })
      .then((response) => {
        const content = response.data?.content;
        if (Array.isArray(content)) {
          setListData(content);
          setTotalRows(content.length);
        } else if (content && typeof content === "object") {
          const listKey = Object.keys(content).find((k) => Array.isArray(content[k]));
          setListData(listKey ? content[listKey] : []);
          setTotalRows(content.totalItems || 0);
        } else {
          setListData([]);
        }
      })
      .catch(() => setListData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getList();
  }, [page]);

  const handleEdit = (id) => {
    navigate(`/seriui/govt-account-edit/${id}`);
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
          .delete(baseURL + `govtAccount/delete/${id}`)
          .then(() => {
            getList();
            Swal.fire(t("Deleted"), t("You successfully deleted this record"), "success");
          })
          .catch(() => Swal.fire({ icon: "error", title: t("Delete attempt was not successful") }));
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
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: { style: { paddingLeft: "8px", paddingRight: "8px" } },
  };

  const columns = [
    {
      name: t("Action"),
      cell: (row) => {
        const rowId = row.govtAccountId || row.id;
        return (
          <div className="text-start w-100">
            <Button variant="primary" size="sm" onClick={() => handleEdit(rowId)}>
              {t("Edit")}
            </Button>
            <Button variant="danger" size="sm" onClick={() => deleteConfirm(rowId)} className="ms-2">
              {t("Delete")}
            </Button>
          </div>
        );
      },
      sortable: false,
    },
    {
      name: t("Govt Account Number"),
      selector: (row) => row.govtAccountNumber,
      cell: (row) => <span>{row.govtAccountNumber}</span>,
      sortable: true,
    },
    {
      name: t("Bank Name"),
      selector: (row) => row.bankName,
      cell: (row) => <span>{row.bankName}</span>,
      sortable: true,
    },
    {
      name: t("Branch"),
      selector: (row) => row.branch,
      cell: (row) => <span>{row.branch}</span>,
      sortable: true,
    },
    {
      name: t("IFSC"),
      selector: (row) => row.ifscCode,
      cell: (row) => <span>{row.ifscCode}</span>,
      sortable: true,
    },
  ];

  return (
    <Layout title={t("Govt Account List")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Govt Account List")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/govt-account" className="btn btn-primary btn-md d-md-none">
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link to="/seriui/govt-account" className="btn btn-primary d-none d-md-inline-flex">
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={columns}
            data={listData}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{ noRowsPerPage: true }}
            onChangePage={(p) => setPage(p - 1)}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default GovtAccountList;
