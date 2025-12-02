import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ConfigureReelingShedList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(0);
  const countPerPage = 10;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  // 👇 API params for pagination
  const _params = { params: { pageNumber: page, size: countPerPage } };

  // ✅ Fetch Configure ICB list with JOIN
  const getList = () => {
    setLoading(true);
    api
      .get(`${baseURL}configureReelingShed/list-with-join`, _params)
      .then((response) => {
        const content = response.data.content || {};
        setListData(content.configureReelingShed || []);
        setTotalRows(content.totalItems || 0);
        setLoading(false);
      })
      .catch(() => {
        setListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  // 👇 Navigation actions
  const handleView = (id) => {
    navigate(`/seriui/configure-reeling-shed-view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/seriui/configure-reeling-shed-edit/${id}`);
  };

  // 👇 SweetAlert delete handling
  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: t("Delete attempt was not successful"),
      text: t("Something went wrong!"),
    });
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
          .delete(`${baseURL}configureReelingShed/delete/${id}`)
          .then(() => {
            getList();
            Swal.fire(t("Deleted!"), t("Record deleted successfully!"), "success");
          })
          .catch(() => deleteError());
      } else {
        Swal.fire(t("Cancelled"), t("Your record is not deleted"), "info");
      }
    });
  };

  // ✅ Table theme setup
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

  // ✅ Columns based on ConfigureReelingShedResponse (joined data)
  const ConfigureReelingShedColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.reelingShedId)}
          >
            {t("View")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.reelingShedId)}
          >
            {t("Edit")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ms-2"
            onClick={() => deleteConfirm(row.reelingShedId)}
          >
            {t("Delete")}
          </Button>
        </div>
      ),
      width: "200px",
      sortable: false,
      grow: 2
    },
    {
      name: t("Machine Type"),
      selector: (row) => row.machineTypeName,
      sortable: true,
      wrap: true,
    },
   
    {
      name: t("Sqft/KW/Generator Capacity/Water Heater Capacity"),
      selector: (row) => row.reelingSqft,
      sortable: true,
      wrap: true,
    },
     {
      name: t("Model(Only For Solar Water Heater)"),
      selector: (row) => row.reelingUnit,
      sortable: true,
      wrap: true,
    },
    
    {
      name: t("Component"),
      selector: (row) => row.scComponentName,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Component Type"),
      selector: (row) => row.subSchemeName,
      sortable: true,
      wrap: true,
    },

    {
      name: t("Category"),
      selector: (row) => row.categoryName,
      sortable: true,
      wrap: true,
    },
    
    {
      name: t("Unit Cost"),
      selector: (row) => row.unitCost,
      right: true,
      sortable: true,
    },
    {
      name: t("Min"),
      selector: (row) => row.min,
      right: true,
      sortable: true,
    },
    {
      name: t("Max"),
      selector: (row) => row.max,
      right: true,
      sortable: true,
    },
  ];

  return (
    <Layout title={t("List Of Configure Reeling Shed/Adopting Silent Generator/Adopting Solar power Generator/Adopting Solar Water Heater")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("List Of Configure Reeling Shed/Adopting Silent Generator/Adopting Solar power Generator/Adopting Solar Water Heater")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/configure-reeling-shed"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/configure-reeling-shed"
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
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ConfigureReelingShedColumns}
            data={listData}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{ noRowsPerPage: true }}
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

export default ConfigureReelingShedList;
