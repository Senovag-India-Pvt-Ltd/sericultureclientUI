import { Card, Form, Row, Col, Button,Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../components";
import { AiOutlineInfoCircle } from 'react-icons/ai';
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceandSaleofNurserytoFarmersList() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listLogsData, setListLogsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5; 
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const getList = () => {
    setLoading(true);

    const response = api
      .get(baseURL + `Maintenance-sale/get-info`)
      .then((response) => {
        console.log(response.data);
        setListData(response.data);
        // setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        // setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  
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
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const navigate = useNavigate();

  const handleView = (_id) => {
    navigate(`/seriui/maintenance-and-sale-of-nursery-view/${_id}`);
  };

  const handleEdit = (_id) => {
    navigate(`/seriui/maintenance-and-sale-of-nursery-edit/${_id}`);
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
        console.log("hello");
        const response = api
          .delete(baseURL + `Maintenance-sale/delete-info/${_id}`)
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

  const GardenNursaryDataColumns = [
    {
      name: t("Fruits Id"),
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Farmer Name"),
      selector: (row) => row.farmerName,
      cell: (row) => <span>{row.farmerName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Mulberry Variety"),
      selector: (row) => row.mulberryVariety,
      cell: (row) => <span>{row.mulberryVariety}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Area"),
      selector: (row) => row.area,
      cell: (row) => <span>{row.area}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Date Of Planting"),
      selector: (row) => row.dateOfPlanting,
      cell: (row) => <span>{row.dateOfPlanting}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Nursery Sale Details"),
      selector: (row) => row.nurserySaleDetails,
      cell: (row) => <span>{row.nurserySaleDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Quantity"),
      selector: (row) => row.quantity,
      cell: (row) => <span>{row.quantity}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Date"),
      selector: (row) => row.date,
      cell: (row) => <span>{row.date}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Rate"),
      selector: (row) => row.rate,
      cell: (row) => <span>{row.rate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Sapling Age"),
      selector: (row) => row.saplingAge,
      cell: (row) => <span>{row.saplingAge}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Receipt Number"),
      selector: (row) => row.receiptNumber,
      cell: (row) => <span>{row.receiptNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Remittance Details"),
      selector: (row) => row.remittanceDetails,
      cell: (row) => <span>{row.remittanceDetails}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Action"),
      cell: (row) => (
        <div className="text-start w-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.id)}
          >
            {t("View")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.id)}
          >
            {t("Edit")}
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
      grow: 2,
    },
  ];
  return (
    <Layout title={t("Maintenance and Sale of Nursery to Farmers List")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("Maintenance and Sale of Nursery to Farmers List")}
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/Maintenance-and-Sale-of-Nursery-to-Farmers" className="btn btn-primary btn-md d-md-none">
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-and-Sale-of-Nursery-to-Farmers"
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
            columns={GardenNursaryDataColumns}
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

export default MaintenanceandSaleofNurserytoFarmersList;