import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
import ChawkiManagement from "../chawki-management/ChawkiManagement";
import DispatchofCocoonstoP4Grainage from "../seed-and-dfl-managment/DispatchofCocoonstoP4Grainage";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function DispatchOfCocoonsToGrainageReport() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listDispatchOfCocoonsData, setListDispatchOfCocoonsData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    grainageMasterId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLSeedDfl + `DispatchOfCocoons/dispatchOfCocoonsDetails`,
        {},
        {
          params: {
            grainageMasterId: data.grainageMasterId || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  const exportCsv = (e) => {
    api
      .post(
        baseURLSeedDfl + `DispatchOfCocoons/dispatchOfCocoonsReport`,
        {},
        {
          params: {
            grainageMasterId: data.grainageMasterId || 0,
          },
          responseType: 'blob',
          headers: {
            accept: "text/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `dispatch_of_cocoons_report_.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
        });
      });
};

  const getDispatchOfCocoonsList = (e) => {
    api
      .post(
        baseURLSeedDfl + `DispatchOfCocoons/dispatchOfCocoonsDetails`,
        {},
        {
          params: {
            grainageMasterId: data.grainageMasterId || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
      .then((response) => {
        setListData(response.data.content);
        setTotalRows(response.data.totalRecords);
      })
      .catch((err) => {
        setListData([]);
      });
  };

  useEffect(() => {
    getDispatchOfCocoonsList();
  }, [page]);

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL + `grainageMaster/get-all`)
      .then((response) => {
        setGrainageListData(response.data.content.grainageMaster);
      })
      .catch((err) => {
        setGrainageListData([]);
      });
  };

  useEffect(() => {
    getGrainageList();
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
        minHeight: "30px", // override the row height
      },
    },
    headCells: {
      style: {
        // '&:not(:last-of-type)': {
        backgroundColor: "#1e67a8",
        color: "#fff",
        borderStyle: "solid",
        bordertWidth: "1px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
    cells: {
      style: {
        // '&:not(:last-of-type)': {
        borderStyle: "solid",
        borderWidth: "1px",
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
        // borderColor: defaultThemes.default.divider.default,
        borderColor: "black",
        // },
      },
    },
  };

  const DispatchOfCocoonsDataColumns = [
    {
      name: "Sl.No",
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Lot Number",
      selector: (row) => row.lotNumber,
      cell: (row) => <span>{row.lotNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: "Date Of Supply",
      selector: (row) => row.dateOfSupply,
      cell: (row) => <span>{row.dateOfSupply}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Dispatch Date",
      selector: (row) => row.dispatchDate,
      cell: (row) => <span>{row.dispatchDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Grainage",
      selector: (row) => row.grainageMasterName,
      cell: (row) => <span>{row.grainageMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Line",
      selector: (row) => row.lineYear,
      cell: (row) => <span>{row.lineYear}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "No Of Cocoons Dispatched",
      selector: (row) => row.numberOfCocoonsDispatched,
      cell: (row) => <span>{row.numberOfCocoonsDispatched}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Screeing Batch No",
      selector: (row) => row.screeningBatchNo,
      cell: (row) => <span>{row.screeningBatchNo}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Spun On Date(From)",
      selector: (row) => row.spunOnDate,
      cell: (row) => <span>{row.spunOnDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Spun On Date(To)",
      selector: (row) => row.spunOnToDate,
      cell: (row) => <span>{row.spunOnToDate}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Cocoon Supplied In Kg",
      selector: (row) => row.cocoonSuppliedInKg,
      cell: (row) => <span>{row.cocoonSuppliedInKg}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Generation Number",
      selector: (row) => row.generationNumber,
      cell: (row) => <span>{row.generationNumber}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  return (
    <Layout title={t("Dispatch Of Cocoons To P4 Grainage Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Dispatch Of Cocoons To P4 Grainage Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1">
          <Row className="m-4">
           

           <Col sm={2}>
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Grainage")}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="grainageMasterId"
                              value={data.grainageMasterId}
                              onChange={handleInputs}
                            >
                              <option value="">{t("Select Grainage")}</option>
                              {grainageListData && grainageListData.length?(grainageListData.map((list) => (
                                <option
                                  key={list.grainageMasterId}
                                  value={list.grainageMasterId}
                                >
                                  {list.grainageMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

           
            <Col sm={1}>
              <Button type="button" variant="primary" onClick={search}>
                {t("Search")}
              </Button>
            </Col>
            <Col sm={1}>
              <Button type="button" variant="primary" onClick={exportCsv}>
                {t("Export")}
              </Button>
            </Col>
          </Row>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={DispatchOfCocoonsDataColumns}
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

export default DispatchOfCocoonsToGrainageReport;
