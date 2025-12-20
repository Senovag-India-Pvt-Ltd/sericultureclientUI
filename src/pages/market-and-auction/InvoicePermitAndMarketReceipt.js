import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
// import Select from "react-select";
import ReactSelect from "react-select";



const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function InvoicePermitAndMarketReceipt() {
   // Translation
   const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const _header = { "Content-Type": "application/json", accept: "*/*" };


  const [selectedCategory, setSelectedCategory] = useState("farm");

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    allottedLotId: "",
    auctionDate: "",
    grainageMasterId: "",
    externalUnitRegistrationId: "",
    fromDate: "",
    toDate: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

   const handleFromDateChange = (date) => {
      setData((prev) => ({ ...prev, fromDate: date }));
    };
  
    const handleToDateChange = (date) => {
      setData((prev) => ({ ...prev, toDate: date }));
    };

    const handleAuctionDateChange = (date) => {
      setData((prev) => ({ ...prev, auctionDate: date }));
    };
  
    useEffect(() => {
      handleFromDateChange(new Date());
      handleToDateChange(new Date());
      handleAuctionDateChange(new Date());
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

     // to get Grainage
  const [externalListData, setExternalListData] = useState([]);

  const getExternalList = () => {
    const response = api
      .get(baseURLFarmer + `external-unit-registration/get-all`)
      .then((response) => {
        setExternalListData(response.data.content.externalUnitRegistration);
      })
      .catch((err) => {
        setExternalListData([]);
      });
  };

  useEffect(() => {
    getExternalList();
  }, []);

     const externalUserOptions = externalListData?.map((list) => ({
      value: list.externalUnitRegistrationId,
      label: `${list.name} (${list.licenseNumber})`,
    }));


    const generateInvoiceReport = async () => {
        const { fromDate, toDate } = data;
        const formattedFromDate =
          fromDate.getFullYear() +
          "-" +
          (fromDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          fromDate.getDate().toString().padStart(2, "0");
        const formattedToDate =
          toDate.getFullYear() +
          "-" +
          (toDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          toDate.getDate().toString().padStart(2, "0");
    
        try {
          const response = await api.post(
            baseURLReport + `get-Invoice`,
            {
              marketId: data.marketId,
              grainageMasterId: data.grainageMasterId,
              fromDate: formattedFromDate,
              toDate: formattedToDate,
            },
            {
              responseType: "blob", //Force to receive data in a Blob Format
            }
          );
    
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        } catch (error) {
          // console.log("error", error);
        }
      };

       const generatePermitReport = async () => {
        const { fromDate, toDate } = data;
        const formattedFromDate =
          fromDate.getFullYear() +
          "-" +
          (fromDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          fromDate.getDate().toString().padStart(2, "0");
        const formattedToDate =
          toDate.getFullYear() +
          "-" +
          (toDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          toDate.getDate().toString().padStart(2, "0");
    
        try {
          const response = await api.post(
            baseURLReport + `get-Permit`,
            {
              marketId: data.marketId,
              externalUnitRegistrationId: data.externalUnitRegistrationId,
              fromDate: formattedFromDate,
              toDate: formattedToDate,
            },
            {
              responseType: "blob", //Force to receive data in a Blob Format
            }
          );
    
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        } catch (error) {
          // console.log("error", error);
        }
      };

      const generateCashReceiptReport = async () => {
        const { auctionDate} = data;
        const formattedAuctionDate =
          auctionDate.getFullYear() +
          "-" +
          (auctionDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          auctionDate.getDate().toString().padStart(2, "0");
       
    
        try {
          const response = await api.post(
            baseURLReport + `get-Rasheedi`,
            {
              marketId: data.marketId,
              allottedLotId: data.allottedLotId,
              auctionDate: formattedAuctionDate,
            },
            {
              responseType: "blob", //Force to receive data in a Blob Format
            }
          );
    
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        } catch (error) {
          // console.log("error", error);
        }
      };

      const generateMarketReceiptReport = async () => {
        const { auctionDate} = data;
        const formattedAuctionDate =
          auctionDate.getFullYear() +
          "-" +
          (auctionDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          auctionDate.getDate().toString().padStart(2, "0");
       
    
        try {
          const response = await api.post(
            baseURLReport + `get-market-reciept`,
            {
              marketId: data.marketId,
              allottedLotId: data.allottedLotId,
              auctionDate: formattedAuctionDate,
            },
            {
              responseType: "blob", //Force to receive data in a Blob Format
            }
          );
    
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        } catch (error) {
          // console.log("error", error);
        }
      };

const handleGenerateReport = (e) => {
    e.preventDefault(); // prevent default page refresh
  switch (selectedCategory) {
    case "invoice":
      generateInvoiceReport();
      break;
    case "permit":
      generatePermitReport();
      break;
    case "cashReceipt":
      generateCashReceiptReport();
      break;
    case "marketReceipt":
      generateMarketReceiptReport();
      break;
    default:
      break;
  }
};

  
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

  

  return (
    <Layout title={t("Seed Market Invoice,Permit,Cash Receipt And Market Receipt")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Seed Market Invoice,Permit,Cash Receipt And Market Receipt")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      {/* Radio Buttons */}
    <Form onSubmit={handleGenerateReport}>
    <Block className="mt-n4">
        <Row className="g-3">
            <Card className="bg-light border-0 shadow-sm px-2 py-3">
            <Card.Body>
                <div className="d-flex flex-wrap justify-content-start gap-4">
                {[
                    { id: "farm", value: "invoice", label: t("Invoice") },
                    { id: "farmer", value: "permit", label: t("Permit") },
                    { id: "crc1", value: "cashReceipt", label: t("Cash Receipt") },
                    { id: "crc2", value: "marketReceipt", label: t("Market Receipt") },
                    ].map((item) => (
                    <Form.Group
                        key={item.id}
                        controlId={item.id}
                        className="d-flex align-items-center gap-2"
                    >
                        <Form.Check
                        type="radio"
                        name="userType"
                        value={item.value}
                        checked={selectedCategory === item.value}
                        onChange={handleCategoryChange}
                        className="mt-0"
                        />
                        <Form.Label className="mb-0 fw-bold">{item.label}</Form.Label>
                    </Form.Group>
                    ))}

                </div>
            </Card.Body>
            </Card>
        </Row>
        </Block>


      {/* Conditionally Render Data Table */}
      <Block className="mt-3">
        <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
               <Row className="g-gs">
                    <Col lg="12">
                        <Form.Group as={Row} className="form-group">

                        {/* Invoice - Grainage + Dates */}
                        {selectedCategory === "invoice" && (
                            <>
                            <Form.Label>{t("Grainage")}<span className="text-danger">*</span></Form.Label>
                            <Col>
                                <Form.Select
                                name="grainageMasterId"
                                value={data.grainageMasterId}
                                onChange={handleInputs}
                                required
                                >
                                <option value="">{t("Select Grainage")}</option>
                                {grainageListData?.map((list) => (
                                    <option key={list.grainageMasterId} value={list.grainageMasterId}>
                                    {list.grainageMasterName}
                                    </option>
                                ))}
                                </Form.Select>
                            </Col>
                            </>
                        )}

                        {/* Permit - External Users + Dates */}
                        {selectedCategory === "permit" && (
                            <>
                            <Form.Label>{t("External Users")}<span className="text-danger">*</span></Form.Label>
                            <Col>
                                {/* <Form.Select
                                name="externalUnitRegistrationId"
                                value={data.externalUnitRegistrationId}
                                onChange={handleInputs}
                                required
                                >
                                <option value="">{t("Select External Users")}</option>
                                {externalListData?.map((list) => (
                                    <option key={list.externalUnitRegistrationId} value={list.externalUnitRegistrationId}>
                                     {list.name} ({list.licenseNumber})
                                    </option>
                                ))}
                                </Form.Select> */}
                                <ReactSelect
                                options={externalUserOptions}
                                placeholder={t("Select External Users")}
                                isSearchable
                                menuPlacement="auto"
                                value={externalUserOptions?.find(
                                  (opt) => opt.value === data.externalUnitRegistrationId
                                )}
                                onChange={(selectedOption) => {
                                  setData((prev) => ({
                                    ...prev,
                                    externalUnitRegistrationId: selectedOption?.value || "",
                                  }));
                                }}
                              />
                                
                            </Col>
                            </>
                        )}

                        {/* Common: From Date & To Date for Invoice and Permit */}
                        {(selectedCategory === "invoice" || selectedCategory === "permit") && (
                            <>
                            <Form.Label column sm={1}>{t("From Date")}<span className="text-danger">*</span></Form.Label>
                            <Col sm={2}>
                                <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={data.fromDate}
                                onChange={handleFromDateChange}
                                className="form-control"
                                maxDate={new Date()}
                                />
                            </Col>
                            <Form.Label column sm={1}>{t("To Date")}<span className="text-danger">*</span></Form.Label>
                            <Col sm={2}>
                                <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={data.toDate}
                                onChange={handleToDateChange}
                                className="form-control"
                                maxDate={new Date()}
                                />
                            </Col>
                            </>
                        )}

                        {/* Cash Receipt & Market Receipt - Auction Date + Bidding Slip Lot No */}
                        {(selectedCategory === "cashReceipt" || selectedCategory === "marketReceipt") && (
                            <>
                            <Form.Label column sm={1}>{t("Auction Date")}<span className="text-danger">*</span></Form.Label>
                            <Col sm={2}>
                                <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={data.auctionDate}
                                onChange={handleAuctionDateChange}
                                className="form-control"
                                maxDate={new Date()}
                                 required
                                />
                            </Col>

                            <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                                {t("Bidding Slip Lot No")}<span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm={3}>
                                <Form.Control
                                id="allottedLotId"
                                name="allottedLotId"
                                value={data.allottedLotId}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Enter Bidding Slip Lot No"
                                 required
                                />
                            </Col>
                            </>
                        )}
                        </Form.Group>
                    </Col>
                    </Row>

              </Card.Body>
            </Card>
            </Row>

            <Row className="d-flex justify-content-center mt-2">
              <Col sm={2}>
                {/* <Button type="button" variant="primary" onClick={handleGenerateReport}>
                {t("Generate Report")}
                </Button> */}
                <Button type="submit" variant="primary">
                {t("Generate Report")}
                </Button>


              </Col>
            </Row>
      </Block>
      </Form>
    </Layout>
  );
}

export default InvoicePermitAndMarketReceipt;
