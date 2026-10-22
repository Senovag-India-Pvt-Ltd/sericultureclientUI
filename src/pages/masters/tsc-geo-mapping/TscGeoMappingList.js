import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "../../../components/AppDataTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function TscGeoMappingList() {
  const { t } = useTranslation();
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 10;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const getList = () => {
    setLoading(true);
    api
      .get(baseURL + `sc-tsc-geo-mapping/list-with-join`, { params: { pageNumber: page, size: countPerPage } })
      .then((response) => {
        setListData(response.data.content.scTscGeoMapping);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch(() => {
        setListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const navigate = useNavigate();
  const handleEdit = (_id) => {
    navigate(`/seriui/tsc-geo-mapping-edit/${_id}`);
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
          .delete(baseURL + `sc-tsc-geo-mapping/delete/${_id}`)
          .then(() => {
            getList();
            Swal.fire(t("Deleted"), t("You successfully deleted this record"), "success");
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: t("Delete attempt was not successful"),
              text: t("Something went wrong!"),
            });
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
    table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
    rows: {
      style: { minHeight: "52px", fontSize: "13.5px", color: "#2b2d42", borderBottom: "1px solid #eef1f6 !important" },
      highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
      stripedStyle: { backgroundColor: "#fbfcfe" },
    },
    headRow: { style: { minHeight: "50px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
    headCells: { style: { backgroundColor: "transparent", color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase", paddingLeft: "12px", paddingRight: "12px" } },
    cells: { style: { paddingLeft: "12px", paddingRight: "12px" } },
    pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
  };

  const columns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="d-flex flex-nowrap align-items-center text-start w-100">
          <Button variant="primary" size="sm" onClick={() => handleEdit(row.scTscGeoMappingId)} className="text-nowrap">
            {t("Edit")}
          </Button>
          <Button variant="danger" size="sm" onClick={() => deleteConfirm(row.scTscGeoMappingId)} className="ms-2 text-nowrap">
            {t("delete")}
          </Button>
        </div>
      ),
      sortable: false,
      minWidth: "200px",
      grow: 0,
    },
    { name: t("District"), selector: (row) => row.districtName, sortable: true },
    { name: t("Taluk"), selector: (row) => row.talukName, sortable: true },
    { name: t("Hobli"), selector: (row) => row.hobliName || "—", sortable: true },
    { name: t("Village"), selector: (row) => row.villageName || "—", sortable: true },
    { name: t("TSC"), selector: (row) => row.tscName, sortable: true },
    { name: t("Officer"), selector: (row) => row.officerName || "—", sortable: true },
  ];

  return (
    <Layout title={t("TSC Geo Mapping List")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("TSC Geo Mapping List")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/tsc-geo-mapping" className="btn btn-primary btn-md d-md-none">
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link to="/seriui/tsc-geo-mapping" className="btn btn-primary d-none d-md-inline-flex">
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
          <div style={{ overflowX: "auto" }}>
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
              onChangePage={(newPage) => setPage(newPage - 1)}
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

export default TscGeoMappingList;
