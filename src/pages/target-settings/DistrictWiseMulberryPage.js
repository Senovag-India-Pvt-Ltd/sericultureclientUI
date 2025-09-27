import { Card, Button, Row, Col, Form, Modal,Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";
import ViewAllApplication from "../services-module/application-component/ViewAllApplication";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DistrictWiseMulberryPage() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 30;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, pageSize: countPerPage } };


  const [searchData, setSearchData] = useState({
    userMasterId: localStorage.getItem("userMasterId"),
    searchText: "",
    type: 4,
    pageNumber: page,
    pageSize: countPerPage,
  });


  // console.log("Nodo Batha antha", data);
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

  const handleInputsSearch = (e) => {
    const { name, value } = e.target;
    
    // If type is 4, set the financial year ID in searchData
    if (value == 4) {
      setSearchData((prev) => ({
        ...prev,
        [name]: value,
        searchText: data.financialYearMasterId, // Use the fetched financialYearMasterId
      }));
    } else {
      setSearchData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

  };

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        const year = response.data.content.financialYear;
        const [fromDate, toDate] = year.split("-");
        setData({
          financialYearMasterId: response.data.content.financialYearMasterId,
          year1: fromDate,
          year2: toDate
        });
        setSearchData((prev) => ({
          ...prev,
          searchText: response.data.content.financialYearMasterId // Pre-fill text with financial year
        }));
      })
      .catch((err) => {
        setData({
          financialYearMasterId: "",
          year1: "",
          year2: ""
        });
      });
  };

    useEffect(() => {
      getFinancialDefaultDetails();
    //   getList();
    }, [page]);
  
  const [data, setData] = useState({
    financialYearMasterId: "",
    year1: "",
    year2: ""
  });
  
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
      width: "15%", // Adjusted width for a more even column layout
      wordWrap: "break-word", // To prevent overflow
    },
    cell: {
      padding: "8px", // Reduced padding for a more compact look
      textAlign: "left",
      color: "#333",
      width: "18%", // Adjusted width for consistent layout
      wordWrap: "break-word", // Prevent overflow of long text
    },
  };
  

  

 
  // to get component
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
        const districts = response.data.content.district;
  
        // Transform data to have separate rows for NAREGA and NON-NAREGA
        const transformedDistrictData = districts.flatMap(district => [
          {
            districtName: district.districtName,
            targetType: "NAREGA",
            april: district.naregaApril,
            may: district.naregaMay,
            june: district.naregaJune,
            july: district.naregaJuly,
            august: district.naregaAugust,
            september: district.naregaSeptember,
            october: district.naregaOctober,
            november: district.naregaNovember,
            december: district.naregaDecember,
            january: district.naregaJanuary,
            february: district.naregaFebruary,
            march: district.naregaMarch,
          },
          {
            districtName: district.districtName,
            targetType: "NON-NAREGA",
            april: district.nonNaregaApril,
            may: district.nonNaregaMay,
            june: district.nonNaregaJune,
            july: district.nonNaregaJuly,
            august: district.nonNaregaAugust,
            september: district.nonNaregaSeptember,
            october: district.nonNaregaOctober,
            november: district.nonNaregaNovember,
            december: district.nonNaregaDecember,
            january: district.nonNaregaJanuary,
            february: district.nonNaregaFebruary,
            march: district.nonNaregaMarch,
          }
        ]);
  
        setDistrictListData(transformedDistrictData);
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

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

  // const handleInputChange = (index, field, value) => {
  //   setEditableData(prev => {
  //     const newData = [...prev];
  //     newData[index] = {
  //       ...newData[index],
  //       [field]: value,
  //     };
  //     return newData;
  //   });
  // };

  const handleInputChange = (index, field, value) => {
  setEditableData(prev => {
    const newData = [...prev];
    newData[index] = {
      ...newData[index],
      [field]: value === "" ? null : parseFloat(value), // ✅ convert to float
    };
    return newData;
  });
};


  const ApplicationDataColumns = useMemo(() => {
    return [
        {
                        name: "District",
                        selector: (row, index) => {
                          return index === 0 || (districtListData[index]?.districtName !== districtListData[index - 1]?.districtName)
                            ? row.districtName
                            : "";
                        },
                        cell: (row, index) => {
                          if (districtListData[index]) { // Check if districtListData[index] exists
                            return (
                              <span>
                                {index === 0 || (districtListData[index].districtName !== districtListData[index - 1]?.districtName)
                                  ? row.districtName
                                  : ""}
                              </span>
                            );
                          }
                          return null; // Return null if the index is invalid
                        },
                        sortable: true,
                        hide: "md",
              },
        {
            name: "Target Type",
            selector: (row) => row.targetType,
            cell: (row) => <span>{row.targetType}</span>,
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
                    // <input
                    //     type="text"
                    //     className="form-control" // Bootstrap class for styling
                    //     style={{ width: '100%', margin: '5px 0' }} // Adjust width and margin
                    //     value={editableData[index]?.[monthNames[i].toLowerCase()] || row[monthNames[i].toLowerCase()]}
                    //     onChange={(e) => handleInputChange(index, monthNames[i].toLowerCase(), e.target.value)}
                    // />
                    <input
  type="number"
  step="0.01" // allow decimals
  className="form-control"
  value={editableData[index]?.[monthNames[i].toLowerCase()] ?? row[monthNames[i].toLowerCase()]}
  onChange={(e) =>
    handleInputChange(
      index,
      monthNames[i].toLowerCase(),
      e.target.value ? parseFloat(e.target.value) : 0 // convert to float
    )
  }
/>

                ),
                sortable: true,
                hide: "md",
            };
        }),
    ];
}, [districtListData, editableData]);
  




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
    <Layout title="District Wise Mulberry">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">District Wise Mulberry</Block.Title>
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
            Select Financial Year<span className="text-danger">*</span>
          </Form.Label>
          <div className="form-control-wrap">
            <Form.Select
              name="searchText"
              value={searchData.searchText}
              onChange={handleInputsSearch}
              onBlur={() => handleInputsSearch}
              required
              isInvalid={searchData.searchText === "0"}
            >
              <option value="">Select Year</option>
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
            Select Target Type<span className="text-danger">*</span>
          </Form.Label>
          <div className="form-control-wrap">
            <Form.Select
              name="searchText"
              value={searchData.searchText}
              onChange={handleInputsSearch}
            >
              <option value="">Select Target Type</option>
              <option value="Mulberry Extension">Mulberry Extension</option>
              <option value="DFL Production">DFL Production</option>
              <option value="Cocoon Production">Cocoon Production</option>
              <option value="Raw Silk Production">Raw Silk Production</option>
            </Form.Select>
          </div>
        </Form.Group>
      </Col>

      <Col sm={3}>
        <Button type="button" variant="primary">
          Save
        </Button>
      </Col>

      {/* Add the target details in the same Row */}
      <Col sm={5} lg={5}>
        <div className="table-responsive">
          <table style={styles.table} className="table small table-bordered">
            <tbody>
              <tr style={styles.tableRow}>
                <td style={styles.ctstyle}>Yearly Target:</td>
                <td style={styles.cell}>{farmerdetails.farmerFruitsId}</td>
                <td style={styles.ctstyle}>NAREGA Yearly:</td>
                <td style={styles.cell}>{farmerdetails.farmerFirstName}</td>
                <td style={styles.ctstyle}>Non-NAREGA Yearly:</td>
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
            data={districtListData}
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

export default DistrictWiseMulberryPage;
