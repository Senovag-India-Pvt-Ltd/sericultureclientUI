import { Card, Button, Row, Col, Form, Modal,Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable from "../../components/AppDataTable";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

import ViewAllApplication from "../services-module/application-component/ViewAllApplication";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function TscMulberryTargets() {
  const { t } = useTranslation();
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 30;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, pageSize: countPerPage } };


  const [searchData, setSearchData] = useState({
    financialYearMasterId: "",
    districtId: "",
    targetType: "",
    year1: "",
    year2: ""
  });


  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getFinancialYearList = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
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


  let name, value;
//   const handleInputs = (e) => {
//     name = e.target.name;
//     value = e.target.value;
//     setSearchData({ ...searchData, [name]: value });

//   };

// Update searchData on input change
const handleInputs = (e) => {
    const { name, value } = e.target;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Fetch TSC list if a district is selected
    if (name === 'districtId' && value) {
      getTscList(value);
    }
  };

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        const year = response.data.content.financialYear;
        const [fromDate, toDate] = year.split("-");
        setSearchData({
          financialYearMasterId: response.data.content.financialYearMasterId, // Set the default financial year ID
          year1: fromDate,
          year2: toDate
        });
      })
      .catch((err) => {
        setSearchData({
          financialYearMasterId: "",
          year1: "",
          year2: ""
        });
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);
  

  
//   const styles = {
//     ctstyle: {
//       backgroundColor: "rgb(248, 248, 249, 1)",
//       color: "rgb(0, 0, 0)",
//       width: "50%",
//     },
//     headerStyle: {
//       backgroundColor: "#0f6cbe",
//       color: "white",
//       borderTopLeftRadius: "8px",
//       borderTopRightRadius: "8px",
//     },
//   };

const styles = {
    cardHeader: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      fontSize: "18px", // Reduced font size for compact design
      padding: "7px",
      textAlign: "center",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    cardBody: {
      backgroundColor: "rgb(255, 255, 255)",
      padding: "15px", // Reduced padding for a more compact design
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "10px", // Reduced margin between table and other elements
    },
    tableRow: {
      borderBottom: "1px solid #ddd",
    },
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249)",
      color: "rgb(0, 0, 0)",
      padding: "8px", // Reduced padding to decrease row height
      fontWeight: "600",
      width: "8%", // Adjusted width for a more even column layout
      wordWrap: "break-word", // To prevent overflow
    },
    cell: {
      padding: "8px", // Reduced padding for a more compact look
      textAlign: "left",
      color: "#333",
      width: "5%", // Adjusted width for consistent layout
      wordWrap: "break-word", // Prevent overflow of long text
    },
  };
  
 
  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
       
        if (response.data.content.district) {
            setDistrictListData(response.data.content.district);
          }
        })
        .catch((err) => {
            setDistrictListData([]);
        });
  };

//   useEffect(() => {
//     getDistrictList();
//   }, []);

  // to get district
  const [tscListData, setTscListData] = useState([]);

  // Fetching TSC List based on District ID
  const getTscList = (districtId) => {
    api
      .post(baseURL + `tscMaster/get-by-districtId`, { districtId }) // Pass districtId in the request body
      .then((response) => {
        const tscData = response.data.content.tscMaster;

        // Transform data to have separate rows for NAREGA and NON-NAREGA
        const transformedTscData = tscData.flatMap(tsc => [
          {
            name: tsc.name,
            targetType: "NAREGA",
            april: tsc.naregaApril,
            may: tsc.naregaMay,
            june: tsc.naregaJune,
            july: tsc.naregaJuly,
            august: tsc.naregaAugust,
            september: tsc.naregaSeptember,
            october: tsc.naregaOctober,
            november: tsc.naregaNovember,
            december: tsc.naregaDecember,
            january: tsc.naregaJanuary,
            february: tsc.naregaFebruary,
            march: tsc.naregaMarch,
          },
          {
            name: tsc.name,
            targetType: "NON-NAREGA",
            april: tsc.nonNaregaApril,
            may: tsc.nonNaregaMay,
            june: tsc.nonNaregaJune,
            july: tsc.nonNaregaJuly,
            august: tsc.nonNaregaAugust,
            september: tsc.nonNaregaSeptember,
            october: tsc.nonNaregaOctober,
            november: tsc.nonNaregaNovember,
            december: tsc.nonNaregaDecember,
            january: tsc.nonNaregaJanuary,
            february: tsc.nonNaregaFebruary,
            march: tsc.nonNaregaMarch,
          }
        ]);

        setTscListData(transformedTscData);
      })
      .catch((err) => {
        setTscListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  // useEffect to fetch district list on component mount
  useEffect(() => {
    getDistrictList();
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
        minHeight: "30px", // Row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8", // Header background color
        color: "#fff", // Header text color
        borderStyle: "solid", 
        borderWidth: "1px", 
        borderColor: "black", // Header cell border color
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        borderStyle: "solid", 
        borderWidth: "1px", 
        borderColor: "black", // Data cell border color
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };

  const [editableData, setEditableData] = useState([]);

  const handleInputChange = (index, field, value) => {
    setEditableData(prev => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [field]: value,
      };
      return newData;
    });
  };

  const ApplicationDataColumns = useMemo(() => {
    return [
        {
                name: "TSC",
                selector: (row, index) => {
                    return index === 0 || (tscListData[index]?.name !== tscListData[index - 1]?.name)
                    ? row.name
                    : "";
                },
                cell: (row, index) => {
                    if (tscListData[index]) { // Check if districtListData[index] exists
                    return (
                        <span>
                        {index === 0 || (tscListData[index].name !== tscListData[index - 1]?.name)
                            ? row.name
                            : ""}
                        </span>
                    );
                    }
                    return null; // Return null if the index is invalid
                },
                sortable: true,
                hide: "md",
        },
        // {
        //     name: "Target Type",
        //     selector: (row) => row.targetType,
        //     cell: (row, index) => {
        //         // Check if it's the first entry for a district or if the district changes
        //         const isFirstEntry = index === 0 || (tscListData[index]?.name !== tscListData[index - 1]?.name);
                
        //         return (
        //             <span>
        //                 {isFirstEntry ? "NAREGA" : ""}
        //                 {isFirstEntry ? "NON-NAREGA" : ""}
        //             </span>
        //         );
        //     },
        //     sortable: true,
        //     hide: "md",
        // },
        {
            name: "Target Type",
            selector: (row, index) => {
                // Alternate between "NAREGA" and "NON-NAREGA"
                return index % 2 === 0 ? "NAREGA" : "NON-NAREGA";
            },
            cell: (row, index) => {
                return (
                    <span>
                        {index % 2 === 0 ? "NAREGA" : "NON-NAREGA"}
                    </span>
                );
            },
            sortable: true,
            hide: "md",
        },
        ...Array.from({ length: 12 }, (_, i) => {
            const monthNames = [
                "April", "May", "June", "July", "August",
                "September", "October", "November", "December",
                "January", "February", "March"
            ];
            return {
                name: monthNames[i],
                cell: (row, index) => (
                    <input
                        type="text"
                        className="form-control" // Bootstrap class for styling
                        style={{ width: '100%', margin: '5px 0' }} // Adjust width and margin
                        value={editableData[index]?.[monthNames[i].toLowerCase()] || row[monthNames[i].toLowerCase()]}
                        onChange={(e) => handleInputChange(index, monthNames[i].toLowerCase(), e.target.value)}
                    />
                ),
                sortable: true,
                hide: "md",
            };
        }),
    ];
}, [tscListData, editableData]);
  


//   const ApplicationDataColumns = useMemo(() => {
//     return [
//         {
//             name: "District",
//             selector: (row, index) => {
//               return index === 0 || (districtListData[index]?.districtName !== districtListData[index - 1]?.districtName)
//                 ? row.districtName
//                 : "";
//             },
//             cell: (row, index) => {
//               if (districtListData[index]) { // Check if districtListData[index] exists
//                 return (
//                   <span>
//                     {index === 0 || (districtListData[index].districtName !== districtListData[index - 1]?.districtName)
//                       ? row.districtName
//                       : ""}
//                   </span>
//                 );
//               }
//               return null; // Return null if the index is invalid
//             },
//             sortable: true,
//             hide: "md",
//           },
//       {
//         name: "Target Type",
//         selector: (row) => row.targetType,
//         cell: (row) => <span>{row.targetType}</span>,
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "April",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.april || row.april}
//             onChange={(e) => handleInputChange(index, 'april', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "May",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.may || row.may}
//             onChange={(e) => handleInputChange(index, 'may', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "June",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.june || row.june}
//             onChange={(e) => handleInputChange(index, 'june', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "July",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.july || row.july}
//             onChange={(e) => handleInputChange(index, 'july', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "August",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.august || row.august}
//             onChange={(e) => handleInputChange(index, 'august', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "September",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.september || row.september}
//             onChange={(e) => handleInputChange(index, 'september', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "October",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.october || row.october}
//             onChange={(e) => handleInputChange(index, 'october', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "November",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.november || row.november}
//             onChange={(e) => handleInputChange(index, 'november', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "December",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.december || row.december}
//             onChange={(e) => handleInputChange(index, 'december', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "January",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.january || row.january}
//             onChange={(e) => handleInputChange(index, 'january', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "February",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.february || row.february}
//             onChange={(e) => handleInputChange(index, 'february', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//       {
//         name: "March",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={editableData[index]?.march || row.march}
//             onChange={(e) => handleInputChange(index, 'march', e.target.value)}
//           />
//         ),
//         sortable: true,
//         hide: "md",
//       },
//     ];
//   }, [districtListData, editableData]);

const [farmerdetails,setFarmerDetails] = useState({
    farmerFirstName:"",
    lotParentLevel:"",
    price:"",
    netWeight:"",
    farmerFruitsId:"",
    initialWeighment:""
  })
  
 
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Selected Application list will be proceeded for preinspection",
      text: message,
    });
  };
  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };


  
  return (
    <Layout title={t("District Wise Mulberry")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("District Wise Mulberry")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/service-application"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/service-application"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>New Application</span>
                </Link>
              </li>
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
  <Card>
    <Row className="m-2">
    <Col sm={2} lg={2}>
        <Form.Group className="form-group">
          <Form.Label>
            {t('Select Target Type')}<span className="text-danger">*</span>
          </Form.Label>
          <div className="form-control-wrap">
            <Form.Select
              name="targetType"
              value={searchData.targetType}
              onChange={handleInputs}
            >
              {/* <option value="">Select Target Type</option> */}
              <option value="Mulberry Extension">{t('Mulberry Extension')}</option>
              <option value="DFL Production">{t('DFL Production')}</option>
              <option value="Cocoon Production">{t('Cocoon Production')}</option>
              <option value="Raw Silk Production">{t('Raw Silk Production')}</option>
            </Form.Select>
          </div>
        </Form.Group>
      </Col>
      <Col sm={2} lg={2}>
        <Form.Group className="form-group">
          <Form.Label>
            {t('Select Financial Year')}<span className="text-danger">*</span>
          </Form.Label>
          <div className="form-control-wrap">
            <Form.Select
              name="financialYearMasterId"
              value={searchData.financialYearMasterId}
              onChange={handleInputs}
              onBlur={() => handleInputs}
              required
              isInvalid={searchData.financialYearMasterId === "0"}
            >
              <option value="">{t('Select Year')}</option>
              {financialyearListData.map((list) => (
                <option key={list.financialYearMasterId} value={list.financialYearMasterId}>
                  {list.financialYear}
                </option>
              ))}
            </Form.Select>
          </div>
        </Form.Group>
      </Col>

      <Col sm={2} lg={2}>
        <Form.Group className="form-group">
          <Form.Label>
            {t('Select District')}<span className="text-danger">*</span>
          </Form.Label>
          <div className="form-control-wrap">
            <Form.Select
              name="districtId"
              value={searchData.districtId}
              onChange={handleInputs}
              onBlur={() => handleInputs}
              required
              isInvalid={searchData.districtId === "0"}
            >
              <option value="">{t('Select District')}</option>
              {districtListData.map((list) => (
                <option key={list.districtId} value={list.districtId}>
                  {list.districtName}
                </option>
              ))}
            </Form.Select>
          </div>
        </Form.Group>
      </Col>
{/* 
      <Col sm={3}>
        <Button type="button" variant="primary">
          Save
        </Button>
      </Col> */}

      {/* Add the target details in the same Row */}
      <Col sm={3} lg={3}>
        <div className="table-responsive">
          <table style={styles.table} className="table small table-bordered">
            <tbody>
              <tr style={styles.tableRow}>
                <td style={styles.ctstyle}>{t('Yearly Target')}:</td>
                <td style={styles.cell}>{farmerdetails.farmerFruitsId}</td>
                <td style={styles.ctstyle}>{t('NAREGA Yearly')}:</td>
                <td style={styles.cell}>{farmerdetails.farmerFirstName}</td>
                <td style={styles.ctstyle}>{t('Non-NAREGA Yearly')}:</td>
                <td style={styles.cell}>{farmerdetails.marketAuctionDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  </Card>
</Block>

          <Block className='mt-3'>
      <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={ApplicationDataColumns}
            data={tscListData}
            highlightOnHover
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // paginationPerPage={countPerPage}
            // paginationComponentOptions={{
            //   noRowsPerPage: true,
            // }}
            // onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default TscMulberryTargets;
