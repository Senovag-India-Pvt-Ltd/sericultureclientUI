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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function OtherStateFarmerListReport() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
 districtId: "",
    talukId: "",
    hobliId: "",
    stateId: "",
    casteId: "",
  });

  const [hobliData, setHobliData] = useState({
    hobliId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `farmer/list-nonka`,
        {},
        {
          params: {
             districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            hobliId: data.hobliId || 0,
             stateId: data.stateId || 0,
             casteId: data.casteId || 0,
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
        baseURLFarmer + `farmer/report-nonka`,
        {},
        {
          params: {
              districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            hobliId: data.hobliId || 0,
             stateId: data.stateId || 0,
             casteId: data.casteId || 0,
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
        link.download = `Other_State_Farmer.csv`;
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

  const getReelerList = (e) => {
    api
      .post(
        baseURLFarmer + `farmer/list-nonka`,
        {},
        {
          params: {
             districtId: data.districtId || 0,
            talukId: data.talukId || 0,
            hobliId: data.hobliId || 0,
             stateId: data.stateId || 0,
             casteId: data.casteId || 0,
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
    getReelerList();
  }, [page]);

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleHobliInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setHobliData({ ...hobliData, [name]: value });
  };

  // to get State
  const [districtListData, setDistrictListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    const response = api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    const response = api
      .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        if (response.data.content.hobli) {
          setHobliListData(response.data.content.hobli);
        }
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.talukId) {
      getHobliList(data.talukId);
    }
  }, [data.talukId]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    api
      .get(baseURL + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };



  useEffect(() => {
    if (hobliData.hobliId) {
      getVillageList(hobliData.hobliId);
    }
  }, [hobliData.hobliId]);

  // to get caste
      const [casteListData, setCasteListData] = useState([]);
    
      const getCasteList = () =>
        api
          .get(baseURL + `caste/get-all`)
          .then((response) => {
            setCasteListData(response.data.content.caste);
          })
          .catch((err) => {
            setCasteListData([]);
          });
    
      useEffect(() => {
        getCasteList();
      }, []);

// to get State
  const [stateListData, setStateListData] = useState([]);

  const getStateList = () => {
    const response = api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        if (response.data.content.state) {
          setStateListData(response.data.content.state);
        }
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getStateList();
  }, []);


  // to get District Implementing Officer
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = (districtId) => {
    api
      .post(baseURL + `marketMaster/get-market-by-districtId`, {
        districtId: districtId,
      })
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getMarketList(data.districtId);
    }
  }, [data.districtId]);

 
  
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

  const ReelerDataColumns = [
    {
      name: "Sl.No",
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },

    
    {
      name:  t("Name"),
      selector: (row) => row.firstName,
      cell: (row) => <span>{row.firstName}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: t("FRUITS ID"),
    //   selector: (row) => row.fruitsId,
    //   cell: (row) => <span>{row.fruitsId}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    {
      name: t("farmer_number"),
      selector: (row) => row.farmerNumber,
      cell: (row) => <span>{row.farmerNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Caste",
      selector: (row) => row.title,
      cell: (row) => <span>{row.title}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("mobile_number"),
      selector: (row) => row.mobileNumber,
      cell: (row) => <span>{row.mobileNumber}</span>,
      sortable: true,
      hide: "md",
    },
    // {
    //   name: t("State "),
    //   selector: (row) => row.stateName,
    //   cell: (row) => <span>{row.stateName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    // {
    //   name: t("District "),
    //   selector: (row) => row.districtName,
    //   cell: (row) => <span>{row.districtName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    //  {
    //   name: t("Taluk  "),
    //   selector: (row) => row.talukName,
    //   cell: (row) => <span>{row.talukName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
    //  {
    //   name: t("Hobli  "),
    //   selector: (row) => row.hobliName,
    //   cell: (row) => <span>{row.hobliName}</span>,
    //   sortable: true,
    //   hide: "md",
    // },
  ];

  return (
  <Layout title={t("Other State Farmer Report")}>
    <Block.Head>
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2">{t("Other State Farmer Report")}</Block.Title>
        </Block.HeadContent>
        <Block.HeadContent></Block.HeadContent>
      </Block.HeadBetween>
    </Block.Head>

    <Block className="mt-n4">
      <Card className="mt-1">
        <Row className="m-4 align-items-end">
          {/* State (Not Mandatory) */}
          <Col sm={2}>
            <Form.Group className="form-group">
                                  <Form.Label>
                                    {t("State")}<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="form-control-wrap">
                                    <Form.Select
                                      name="stateId"
                                      value={data.stateId}
                                      onChange={handleInputs}
                                      onBlur={() => handleInputs}
                                      required
                                      isInvalid={
                                        data.stateId === undefined || data.stateId === "0"
                                      }
                                    >
                                      <option value="">{t("Select State")}</option>
                                      {stateListData.map((list) => (
                                        <option key={list.stateId} value={list.stateId}>
                                          {list.stateName}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      {t("State Name is required")}
                                    </Form.Control.Feedback>
                                  </div>
                                </Form.Group>
          </Col>

          {/* District */}
          <Col sm={2}>
            <Form.Group className="form-group">
              <Form.Label>{t("District")}</Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="districtId"
                  value={data.districtId}
                  onChange={handleInputs}
                  onBlur={() => handleInputs}
                >
                  <option value="">{t("Select District")}</option>
                  {districtListData && districtListData.length
                    ? districtListData.map((list) => (
                        <option key={list.districtId} value={list.districtId}>
                          {list.districtName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>

          {/* Taluk */}
          <Col sm={2}>
            <Form.Group className="form-group">
              <Form.Label>{t("Taluk")}</Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="talukId"
                  value={data.talukId}
                  onChange={handleInputs}
                  onBlur={() => handleInputs}
                >
                  <option value="">{t("Select Taluk")}</option>
                  {talukListData && talukListData.length
                    ? talukListData.map((list) => (
                        <option key={list.talukId} value={list.talukId}>
                          {list.talukName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>

          {/* Hobli */}
          <Col sm={2}>
            <Form.Group className="form-group">
              <Form.Label>{t("Hobli")}</Form.Label>
              <div className="form-control-wrap">
                <Form.Select
                  name="hobliId"
                  value={hobliData.hobliId}
                  onChange={handleHobliInputs}
                  onBlur={() => handleHobliInputs}
                >
                  <option value="">{t("Select Hobli")}</option>
                  {hobliListData && hobliListData.length
                    ? hobliListData.map((list) => (
                        <option key={list.hobliId} value={list.hobliId}>
                          {list.hobliName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>

          <Col sm={2}>
            <Form.Group className="w-100 mb-0"> 
                <Form.Label>{t("Caste")}</Form.Label>
                <Form.Select
                  name="casteId"
                  value={data.casteId}
                  onChange={handleInputs}
                >
                  <option value="0">{t("Select Caste")}</option>
                  {casteListData.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
          </Col>

          {/* Buttons */}
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
          columns={ReelerDataColumns}
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

export default OtherStateFarmerListReport;
