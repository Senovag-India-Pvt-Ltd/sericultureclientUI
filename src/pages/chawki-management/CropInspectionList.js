import { Card, Form, Row, Col, Button } from "react-bootstrap";
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
import api from "../../../src/services/auth/api";
import ChawkiManagement from "./ChawkiManagement";
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function CropInspectionList() {
  const { t } = useTranslation();
/* get table detais */

const [listData, setListData] = useState([]);
const [page, setPage] = useState(0);
const countPerPage = 5;
const [totalRows, setTotalRows] = useState(0);
const [loading, setLoading] = useState(false);
const _params = { params: { pageNumber: page, size: countPerPage } };

const [tscMasterId, setTscMasterId] = useState(null); 

const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL1 + `userMaster/get/${localStorage.getItem("userMasterId")}`)
      .then((response) => {
        setTscMasterId(response.data.content.tscMasterId);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setTscMasterId({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, []);

const getList = () => {
    setLoading(true);
    api
      .post(baseURL + `cropInspection/getCropInspectionDetails`, null, {
        params: {
          tscId: tscMasterId,
          pageNumber: 0,
          pageSize: 50,
        },
      })
      .then((response) => {
        setListData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setLoading(false);
      });
  };

  useEffect(() => {
    if (tscMasterId) {
      getList();
    }
  }, [tscMasterId]);

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
//   const handleView = (_id) => {
//     navigate(`/seriui/chawki-management-view/${_id}`);
//   };

  const handleEdit = (_id) => {
    navigate(`/seriui/crop-inspection-edit/${_id}`);
    // navigate("/seriui/state");
  };

  const deleteError = () => {
    Swal.fire({
      icon: "error",
      title: "Delete attempt was not successful",
      text: "Something went wrong!",
    });
  };

  const ChawkiDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.chowkiId)}
          >
            View
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.cropInspectionId)}
          >
            {t("Edit")}
          </Button>
          {/* <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm(row.chowkiId)}
            className="ms-2"
          >
            Delete
          </Button> */}
        </div>
      ),
      sortable: false,
      hide: "md",
      // grow: 2,
    },
    {
        name: t("Fruits Id"),
        selector: (row) => row.fruitsId,
        cell: (row) => <span>{row.fruitsId}</span>,
        sortable: true,
        hide: "md",
      },
    {
        name: t("Farmer"),
        selector: (row) => row.farmerName,
        cell: (row) => <span>{row.farmerName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Father Name"),
        selector: (row) => row.fatherName,
        cell: (row) => <span>{row.fatherName}</span>,
        sortable: true,
        hide: "md",
      },
    {
        name: t("TSC"),
        selector: (row) => row.tscName,
        cell: (row) => <span>{row.tscName}</span>,
        sortable: true,
        hide: "md",
      },
    {
        name: t("Moult"),
        selector: (row) => row.mountName,
        cell: (row) => <span>{row.mountName}</span>,
        sortable: true,
        hide: "md",
      },
      {
        name: t("Crop Status"),
        selector: (row) => row.cropStatusName,
        cell: (row) => <span>{row.cropStatusName}</span>,
        sortable: true,
        hide: "md",
      },
    {
        name: t("Crop Inspection Date"),
        selector: (row) => row.cropInspectionDate,
        cell: (row) => (
            <span>
            {row.cropInspectionDate
                ? new Date(row.cropInspectionDate).toLocaleDateString()
                : "-"}
            </span>
        ),
        sortable: true,
        hide: "md", 
        },
    // {
    //   name: t("Reason"),
    //   selector: (row) => row.reasonName,
    //   cell: (row) => <span>{row.reasonName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: t("Disinfectant Name"),
    //   selector: (row) => row.disinfectantName,
    //   cell: (row) => <span>{row.disinfectantName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    
    
  ];

  return (
    <Layout title={t("List Of Crop Inspection Details")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("List Of Crop Inspection Details")}</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/supply-of-disinfectants"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/supply-of-disinfectants"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Create")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
        <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ChawkiDataColumns}
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

export default CropInspectionList;

