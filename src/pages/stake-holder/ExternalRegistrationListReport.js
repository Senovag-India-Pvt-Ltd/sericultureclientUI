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
            accept: "text/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `external_registration_report.csv`;
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
      name: t("Serial No"),
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("External Unit"),
      selector: (row) => row.externalUnitTypeName,
      cell: (row) => <span>{row.externalUnitTypeName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Race"),
      selector: (row) => row.raceMasterName,
      cell: (row) => <span>{row.raceMasterName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Name of the Unit"),
      selector: (row) => row.name,
      cell: (row) => <span>{row.name}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("address"),
      selector: (row) => row.address,
      cell: (row) => <span>{row.address}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Name of the Owner/Organisation"),
      selector: (row) => row.organisationName,
      cell: (row) => <span>{row.organisationName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("License/Registration Number"),
      selector: (row) => row.licenseNumber,
      cell: (row) => <span>{row.licenseNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("External Units ID"),
      selector: (row) => row.externalUnitNumber,
      cell: (row) => <span>{row.externalUnitNumber}</span>,
      sortable: true,
      hide: "md",
    },

    {
      name: t("Virtual Account Number"),
      selector: (row) => row.virtualAccountNumber,
      cell: (row) => <span>{row.virtualAccountNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Branch Name"),
      selector: (row) => row.branchName,
      cell: (row) => <span>{row.branchName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("IFSC Code"),
      selector: (row) => row.ifscCode,
      cell: (row) => <span>{row.ifscCode}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];



return (
  <Layout title={t("RSP/ CRC/ NSSO Registration Report")}>
    <Block.Head>
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2">{t("RSP/ CRC/ NSSO Registration Report")}</Block.Title>
        </Block.HeadContent>
      </Block.HeadBetween>
    </Block.Head>

    <Block className="mt-n4">
      <Card className="mt-1">
        {/* ✅ Race + External Unit Type + Search + Export all in one row */}
        <Row className="m-4 g-3 align-items-end">
  {/* Race Dropdown */}
  <Col lg={3}>
    <Form.Group className="form-group">
      <Form.Label>{t("Race")}</Form.Label>
      <Form.Select
        name="raceMasterId"
        value={data.raceMasterId}
        onChange={handleInputs}
      >
        <option value="">{t("Select Race")}</option>
        {raceListData?.map((list) => (
          <option key={list.raceMasterId} value={list.raceMasterId}>
            {list.raceMasterName}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* External Unit Type Dropdown */}
  <Col lg={3}>
    <Form.Group className="form-group">
      <Form.Label>{t("External Unit Type")}</Form.Label>
      <Form.Select
        name="externalUnitTypeId"
        value={data.externalUnitTypeId}
        onChange={handleInputs}
      >
        <option value="">{t("Select External Unit Type")}</option>
        {externalUnitTypeListData?.map((list) => (
          <option key={list.externalUnitTypeId} value={list.externalUnitTypeId}>
            {list.externalUnitTypeName}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  </Col>

  {/* Buttons (Search + Export in same col, side by side) */}
  <Col lg={3} className="d-flex gap-2">
    <Button type="button" variant="primary" onClick={search}>
      {t("Search")}
    </Button>
    <Button type="button" variant="primary" onClick={exportCsv}>
      {t("Export")}
    </Button>
  </Col>
</Row>


        {/* ✅ Data Table */}
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
          theme="solarized"
          customStyles={customStyles}
        />
      </Card>
    </Block>
  </Layout>
);
}

export default ExternalRegistrationListReport;
