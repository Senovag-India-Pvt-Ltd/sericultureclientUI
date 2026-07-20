import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";
const CTRL_H = "44px";
const lbl = { fontSize: "12px", fontWeight: 600, color: "#212529", marginBottom: "3px", display: "block" };
const sel = { height: CTRL_H, fontSize: "14px", backgroundColor: "#fff" };

function GrainageTargetReport() {
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
    financialYearId: "",
    raceId: "",
    grainageId: "",
  });


  // Search
  const search = (e) => {
    // api
    //   .post(
    //     baseURLFarmer + `targets/getGrainageTargetsDetails`,
    //     {},
    //     {
    //       params: {
    //         financialYearId: data.financialYearId || 0,
    //         raceId: data.raceId || 0,
    //         grainageId: data.grainageId || 0,
    //         pageNumber: page,
    //         pageSize: countPerPage,
    //       },
    //     }
    //   )

    api.post(
  baseURLFarmer + `targets/getGrainageTargetsDetails`,
  {
    financialYearMasterId: data.financialYearId || 0,
    raceMasterId: data.raceId || 0,
    grainageMasterId: data.grainageId || 0,
  },
  {
    params: {
      pageNumber: page,
      pageSize: countPerPage,
    },
  }
)

       .then((response) => {
  const records = response?.data?.content?.body?.content || [];
  setListData(records);

  const total = response?.data?.content?.body?.totalRecords || 0;
  setTotalRows(total);
})
      .catch((err) => {
        setListData([]);
      });
  };

  const exportCsv = (e) => {
    // api
    //   .post(
    //     baseURLFarmer + `targets/getGrainageTargetsReport`,
    //     {},
    //     {
    //       params: {
    //         financialYearId: data.financialYearId || 0,
    //         raceId: data.raceId || 0,
    //         grainageId: data.grainageId || 0,
    //       },
    //       responseType: 'blob',
    //       headers: {
    //         accept: "text/csv",
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    api.post(
  baseURLFarmer + `targets/getGrainageTargetsReport`,
  {
    financialYearMasterId: data.financialYearId || 0,
    raceMasterId: data.raceId || 0,
    grainageMasterId: data.grainageId || 0,
  },
  {
    responseType: 'blob',
  }
)

      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `grainage_targets_report.xlsx`;
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

  const getFarmerList = (e) => {
    api
      .post(
        baseURLFarmer + `targets/getGrainageTargetsDetails`,
        {},
        {
          params: {
            financialYearId: data.financialYearId || 0,
            raceId: data.raceId || 0,
            grainageId: data.grainageId || 0,
            pageNumber: page,
            pageSize: countPerPage,
          },
        }
      )
        .then((response) => {
  const records = response?.data?.content?.body?.content || [];
  setListData(records);

  const total = response?.data?.content?.body?.totalRecords || 0;
  setTotalRows(total);
})
      .catch((err) => {
        setListData([]);
      });
  };

  useEffect(() => {
    getFarmerList();
  }, [page]);

  const handleInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };


    // to get TrGroup
  const [trGroupListData, setTrGroupListData] = useState([]);

  const getTrGroupList = () => {
    const response = api
      .get(baseURL + `trGroupMaster/get-all`)
      .then((response) => {
        setTrGroupListData(response.data.content.trGroupMaster);
      })
      .catch((err) => {
        setTrGroupListData([]);
      });
  };

  useEffect(() => {
    getTrGroupList();
  }, []);

  // to get TrProgram
  const [trProgramListData, setTrProgramListData] = useState([]);

  const getTrProgramList = () => {
    const response = api
      .get(baseURL + `trProgramMaster/get-all`)
      .then((response) => {
        setTrProgramListData(response.data.content.trProgramMaster);
      })
      .catch((err) => {
        setTrProgramListData([]);
      });
  };

  useEffect(() => {
    getTrProgramList();
  }, []);

  // to get Course
  const [trCourseListData, setTrCourseListData] = useState([]);

  const getTrCourseList = () => {
    const response = api
      .get(baseURL + `trCourseMaster/get-all`)
      .then((response) => {
        setTrCourseListData(response.data.content.trCourseMaster);
      })
      .catch((err) => {
        setTrCourseListData([]);
      });
  };

  useEffect(() => {
    getTrCourseList();
  }, []);

  // to get TrInstitutionMaster
  const [trInstituteListData, setTrInstituteListData] = useState([]);

  const getTrInstitutionMasterList = () => {
    api
      .get(baseURL + `trInstitutionMaster/get-all`)
      .then((response) => {
        setTrInstituteListData(response.data.content.trInstitutionMaster);
      })
      .catch((err) => {
        setTrInstituteListData([]);
      });
  };

  useEffect(() => {
    getTrInstitutionMasterList();
  }, []);

  // to get Financial Year
    const [financialyearListData, setFinancialyearListData] = useState([]);

    const getFinancialYearList = () => {
       api
        .get(baseURL + `financialYearMaster/get-all`)
        .then((response) => {
          setFinancialyearListData(response.data.content.financialYearMaster);
        })
        .catch((err) => {
          setFinancialyearListData([]);
        });
    };

    useEffect(() => {
      getFinancialYearList();
    }, []);

     // to get Race
         const [raceListData, setRaceListData] = useState([]);

         const getRaceList = () => {
           const response = api
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


    // to get username
    const [userListData, setUserListData] = useState([]);

    const getUserList = () => {
      api
        .get(baseURL + `userMaster/get-all`)
        .then((response) => {
          setUserListData(response.data.content.userMaster);
        })
        .catch((err) => {
          setUserListData([]);
        });
    };

    useEffect(() => {
      getUserList();
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

  const FarmerDataColumns = [
    { name: colHeader("Sl.No"),          selector: (row) => row.serialNumber,  cell: (row) => <span>{row.serialNumber}</span>,  sortable: true, hide: "md" },
    { name: colHeader("Financial Year"), selector: (row) => row.financialYear,  cell: (row) => <span>{row.financialYear}</span>,  sortable: true, hide: "md" },
    { name: colHeader("Race Name"),      selector: (row) => row.raceName,       cell: (row) => <span>{row.raceName}</span>,       sortable: true, hide: "md" },
    { name: colHeader("Grainage Name"),  selector: (row) => row.grainageName,   cell: (row) => <span>{row.grainageName}</span>,   sortable: true, hide: "md" },
    { name: colHeader("User"),           selector: (row) => row.username,       cell: (row) => <span>{row.username}</span>,       sortable: true, hide: "md" },
    { name: colHeader("Target"),         selector: (row) => row.value,          cell: (row) => <span>{row.value}</span>,          sortable: true, hide: "md" },
    { name: colHeader("Month"),          selector: (row) => row.month,          cell: (row) => <span>{row.month}</span>,          sortable: true, hide: "md" },
  ];

  return (
    <Layout title={t("Grainage Target Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Grainage Target Details Report")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent></Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)", backgroundColor: "#fff" }}>
          <div style={{ background: ACCENT_HEADER, padding: "11px 18px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "12px 12px 0 0" }}>
            <span style={{ fontSize: "20px" }}>🏭</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>Grainage Target Details Report</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>Select filters to view and export grainage target data</div>
            </div>
          </div>
          <Card.Body className="pb-2">
            <Row className="g-2 mb-2 align-items-end">
              <Col lg={2}>
                <label style={lbl}>{t("Financial Year")}</label>
                <Form.Select name="financialYearId" value={data.financialYearId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Year")}</option>
                  {financialyearListData && financialyearListData.length
                    ? financialyearListData.map((list) => (
                        <option key={list.financialYearMasterId} value={list.financialYearMasterId}>
                          {list.financialYear}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("Grainage")}</label>
                <Form.Select name="grainageId" value={data.grainageId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Grainage")}</option>
                  {grainageListData && grainageListData.length
                    ? grainageListData.map((list) => (
                        <option key={list.grainageMasterId} value={list.grainageMasterId}>
                          {list.grainageMasterName}
                        </option>
                      ))
                    : ""}
                </Form.Select>
              </Col>
              <Col lg={2}>
                <label style={lbl}>{t("Race")}</label>
                <Form.Select name="raceId" value={data.raceId} onChange={handleInputs} style={sel}>
                  <option value="">{t("Select Race")}</option>
                  {raceListData.map((list) => (
                    <option key={list.raceMasterId} value={list.raceMasterId}>
                      {list.raceMasterName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs="auto" style={{ paddingTop: "20px" }}>
                <button onClick={search} style={{ height: CTRL_H, padding: "0 20px", background: ACCENT_TABLE, color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer", marginRight: "8px" }}>
                  {t("Search")}
                </button>
                <button onClick={exportCsv} style={{ height: CTRL_H, padding: "0 20px", background: "linear-gradient(135deg,#2d7a2d,#38a838)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
                  {t("Export")}
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-3" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.08)" }}>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={FarmerDataColumns}
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

export default GrainageTargetReport;
