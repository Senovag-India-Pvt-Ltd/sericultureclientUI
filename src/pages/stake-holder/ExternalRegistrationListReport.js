import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ExternalRegistrationListReport() {
  const { t } = useTranslation();
//   const [listData, setListData] = useState({});
const [listData, setListData] = useState([]);
  const [listFarmerData, setListFarmerData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 25;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
//   const _params = { params: { pageNumber: page, size: countPerPage } };
const _params = { params: { pageNumber: page, pageSize: countPerPage } };

  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState({
    raceMasterId: "",
    externalUnitTypeId: "",
  });

  const [hobliData, setHobliData] = useState({
    hobliId: "",
  });

  // Search
  const search = (e) => {
    api
      .post(
        baseURLFarmer + `external-unit-registration/list-external`,
        {},
        {
          params: {
  raceMasterId: data.raceMasterId || 0,
  externalUnitTypeId: data.externalUnitTypeId || 0,
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
        baseURLFarmer + `external-unit-registration/report-external`,
        {},
        {
          params: {
            raceMasterId: data.raceMasterId || 0,
            externalUnitTypeId: data.externalUnitTypeId || 0,
          },
          responseType: 'blob',
          headers: {
            accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `external_unit_report${new Date().toLocaleDateString("en-GB").replace(/\//g,"-")}.xlsx`;
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
        baseURLFarmer + `external-unit-registration/list-external`,
        {},
        {
          params: {
            raceMasterId: data.raceMasterId || 0,
            externalUnitTypeId: data.externalUnitTypeId || 0, 
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

//   const handleInputs = (e) => {
//     // debugger;
//     let { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

const handleInputs = (e) => {
  let { name, value } = e.target;

  if (name === "raceMasterId" || name === "externalUnitTypeId") {
    setData({ ...data, [name]: value === "" ? "" : Number(value) });
  } else {
    setData({ ...data, [name]: value === "" ? null : value });
  }
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

  // to get external Unit
    const [externalUnitTypeListData, setExternalUnitTypeListData] = useState([]);
  
    const getExternalUnitTypeList = () => {
      const response = api
        .get(baseURL + `externalUnitType/get-all`)
        .then((response) => {
          setExternalUnitTypeListData(response.data.content.externalUnitType);
        })
        .catch((err) => {
          setExternalUnitTypeListData([]);
        });
    };
  
    useEffect(() => {
      getExternalUnitTypeList();
    }, []);

  // to get traderType Unit
    const [traderTypeListData, setTraderTypeListData] = useState([]);
  
    const getTraderTypeList = () => {
      const response = api
        .get(baseURL + `traderTypeMaster/get-all`)
        .then((response) => {
          setTraderTypeListData(response.data.content.traderTypeMaster);
        })
        .catch((err) => {
          setTraderTypeListData([]);
        });
    };
  
    useEffect(() => {
      getTraderTypeList();
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

 // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
         api
      .get(baseURL + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);
  
  const customStyles = {
    headRow: { style: { minHeight: "52px", height: "auto" } },
    headCells: {
      style: {
        background: ACCENT_TABLE, color: "#fff", fontWeight: 700, fontSize: "13px",
        padding: "10px 8px", borderRight: "1px solid rgba(255,255,255,0.5)",
        borderBottom: "2px solid rgba(255,255,255,0.6)", whiteSpace: "normal",
        wordBreak: "break-word", overflowWrap: "break-word", overflow: "visible",
        lineHeight: "1.4", minHeight: "52px", height: "auto",
        verticalAlign: "middle", justifyContent: "center", textAlign: "center",
      },
    },
    rows: {
      style: {
        minHeight: "32px",
        "&:nth-of-type(odd)":  { background: "#fff" },
        "&:nth-of-type(even)": { background: "#f7fafd" },
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #eef2f7", borderBottom: "1px solid #e8edf5",
        paddingTop: "4px", paddingBottom: "4px", paddingLeft: "8px", paddingRight: "8px",
        color: "#2d3748", fontSize: "13px", justifyContent: "center", textAlign: "center",
      },
    },
  };

  const colHeader = (label) => (
    <div style={{ whiteSpace: "normal", wordBreak: "break-word", textAlign: "center", lineHeight: "1.4", width: "100%", padding: "2px 0" }}>
      {label}
    </div>
  );

  const ReelerDataColumns = [
    { name: colHeader("Serial No"),                      selector: (row) => row.serialNumber,       cell: (row) => <span>{row.serialNumber}</span>,       sortable: true },
    { name: colHeader("External Unit"),                  selector: (row) => row.externalUnitTypeName, cell: (row) => <span>{row.externalUnitTypeName}</span>, sortable: true },
    { name: colHeader("Race"),                           selector: (row) => row.raceMasterName,     cell: (row) => <span>{row.raceMasterName}</span>,     sortable: true },
    { name: colHeader("Name of the Unit"),               selector: (row) => row.name,               cell: (row) => <span>{row.name}</span>,               sortable: true },
    { name: colHeader("Address"),                        selector: (row) => row.address,            cell: (row) => <span>{row.address}</span>,            sortable: true },
    { name: colHeader("Name of Owner/Organisation"),     selector: (row) => row.organisationName,   cell: (row) => <span>{row.organisationName}</span>,   sortable: true },
    { name: colHeader("License/Registration Number"),    selector: (row) => row.licenseNumber,      cell: (row) => <span>{row.licenseNumber}</span>,      sortable: true },
    { name: colHeader("External Units ID"),              selector: (row) => row.externalUnitNumber, cell: (row) => <span>{row.externalUnitNumber}</span>, sortable: true },
    // { name: colHeader("Virtual Account Number"),         selector: (row) => row.virtualAccountNumber, cell: (row) => <span>{row.virtualAccountNumber}</span>, sortable: true },
    // { name: colHeader("Branch Name"),                    selector: (row) => row.branchName,         cell: (row) => <span>{row.branchName}</span>,         sortable: true },
    // { name: colHeader("IFSC Code"),                      selector: (row) => row.ifscCode,           cell: (row) => <span>{row.ifscCode}</span>,           sortable: true },
  ];



  return (
    <Layout title={t("RSP/ CRC/ NSSO Registration Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("RSP/ CRC/ NSSO Registration Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* Filter Card */}
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🏭</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>RSP / CRC / NSSO Registration Report</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to view and export external unit registration data</div>
            </div>
          </div>

          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={3}>
                <label style={lbl}>{t("Race")}</label>
                <Form.Select name="raceMasterId" value={data.raceMasterId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Race")}</option>
                  {raceListData?.map((list) => (
                    <option key={list.raceMasterId} value={list.raceMasterId}>{list.raceMasterName}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col lg={3}>
                <label style={lbl}>{t("External Unit Type")}</label>
                <Form.Select name="externalUnitTypeId" value={data.externalUnitTypeId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select External Unit Type")}</option>
                  {externalUnitTypeListData?.map((list) => (
                    <option key={list.externalUnitTypeId} value={list.externalUnitTypeId}>{list.externalUnitTypeName}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs="auto" style={{ paddingTop: "20px" }}>
                <button
                  onClick={search}
                  style={{ height: CTRL_H, padding: "0 20px", background: ACCENT_TABLE, color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer", marginRight: "8px" }}
                >
                  {t("Search")}
                </button>
                <button
                  onClick={exportCsv}
                  style={{ height: CTRL_H, padding: "0 20px", background: "linear-gradient(135deg,#2d7a2d,#38a838)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                >
                  {t("Export")}
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Table Card */}
        <Card className="mt-3" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.08)" }}>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ReelerDataColumns}
            data={listData}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{ noRowsPerPage: true }}
            onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            customStyles={customStyles}
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default ExternalRegistrationListReport;
