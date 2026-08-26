import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import DataTable from "../../components/AppDataTable";
import api from "../../../src/services/auth/api";
import Swal from "sweetalert2";
import { Icon } from "../../components";



const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function DeleteLotPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lotList, setLotList] = useState([]);

  const [data, setData] = useState({
    transactionDate: new Date(),
    lotNo: "",
  });

  // 🔷 Handle Inputs
  const handleLotIdInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
     if (value) {
    setValidated(false); 
  }
  };

  const handleDateChange = (date) => {
    setData({ ...data, transactionDate: date });
  };

  // 🔷 Get Details API
  const getDetails = async () => {
    setLoading(true);
    try {
      const formattedDate =
        data.transactionDate.toLocaleDateString("en-CA");

      const marketId = localStorage.getItem("marketId");

      const response = await api.get(
      baseURL1 +
      `lotGroupage/getdetails?date=${formattedDate}&lotNo=${data.lotNo}&marketId=${marketId}`
    );
       setLotList(response.data.content || []);
        setValidated(false);
    } catch (err) {
       let errorMsg =
      err?.response?.data?.errorMessages?.[0]?.message?.[0]?.reason ||
      t("Something went wrong");
      setLotList([]);
          Swal.fire({
      icon: "error",
      title: t("Error"),
      text: errorMsg
    });
    } finally {
      setLoading(false);
    }
  };

  // 🔷 Form Submit
  const postData = (event) => {
    event.preventDefault();
    setValidated(true);
    if (!data.transactionDate || !data.lotNo) {
      
      return;
    }
    getDetails();
  };

 // 🔷 Delete Validation
// const handleDelete = async (lotId, transactionDate) => {

//   Swal.fire({
//     title: "Are you sure?",
//     text: "It will delete permanently!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Yes, delete it!",
//     cancelButtonText: "No",
//   }).then(async (result) => {

//     if (result.isConfirmed) {

//      const formattedDate =
//         data.transactionDate.toLocaleDateString("en-CA");
//       try {
//         await api.delete( baseURL1 + `lotgroupage/delete?lotId=${lotId}&date=${formattedDate}`);

//         Swal.fire(
//           "Deleted!",
//           "Lot deleted successfully",
//           "success"
//         );

//         getDetails(); // 🔄 refresh

//       } catch (err) {

//         const message =
//           err.response?.data?.message ||
//           err.response?.data?.errorMessages?.[0]?.message ||
//           "You cannot delete this lot as it is already distributed";

//         Swal.fire({
//           icon: "error",
//           title: "Delete Failed",
//           text: message,
//         });

//       }

//     } else {
//       Swal.fire("Cancelled", "Your record is safe", "info");
//     }

//   });
// };

const handleDelete = async (lotId, transactionDate) => {

  Swal.fire({
    title: t("Are you sure?"),
    text: t("It will delete permanently!"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("Yes, delete it!"),
    cancelButtonText: t("No"),
  }).then(async (result) => {

    if (result.isConfirmed) {

      // ✅ Correct variable used
      const formattedDate = new Date(transactionDate)
        .toLocaleDateString("en-CA"); // YYYY-MM-DD
      const marketId = localStorage.getItem("marketId");

      try {
        await api.delete(
          baseURL1 + `lotGroupage/delete?lotId=${lotId}&date=${formattedDate}&marketId=${marketId}`
        );
        

          Swal.fire({
      icon: "success",
      title: t("Deleted!"),
      text: t("Lot has been deleted successfully."),
      timer: 2000,
      showConfirmButton: false
    });

         //  Clear UI
    setLotList([]);
    setData({
      lotNo: "",
      transactionDate: null
    });

      } catch (err) {

     const message =
    err.response?.data?.errorMessages?.[0]?.message?.[0]?.reason ||
    err.response?.data?.errorMessages?.[0]?.message?.[0]?.message ||
    t("You cannot delete this lot as it is already distributed");

        Swal.fire({
          icon: "error",
          title: t("Delete Failed"),
          text: message,
        });

      }

    } else {
      Swal.fire(t("Cancelled"), t("Your record is safe"), "info");
    }

  });
};


  // 🔷 Table Styles
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        border: "1px solid black",
      },
    },
    cells: {
      style: {
        border: "1px solid black",
        padding: "6px",
      },
    },
  };

  // 🔷 Table Columns
  const DeleteLotColumns = [
    {
      name: t("Sl.No."),
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: t("Lot No"),
      selector: (row) => row.lotNo,
    },
    {
      name: t("Transaction Date"),
      selector: (row) => row.transactionDate,
    },
    {
      name: t("Farmer Name"),
      selector: (row) => row.farmerName,
    },
    {
      name: t("Total Weight"),
      selector: (row) => row.totalWeight,
    },
    {
      name: t("Transaction Amount"),
      selector: (row) => row.transactionAmount,
    },
    {
      name: t("Action"),
      cell: (row) => (
        <Button
          variant="danger"
          size="sm"
          disabled=  {row.status === "DISTRIBUTED"}
          onClick={() => handleDelete(row.lotId, row.transactionDate)}
        >
          {t("Delete")}
        </Button>
      ),
    },
  ];

  return (
    <Layout title={t("Delete Lot")} show="true">
      <Block.Head>
        <Block.Title tag="h2">{t("Delete Lot")}</Block.Title>
      </Block.Head>

      <Block>
        {/* 🔷 FORM */}
        <Card className="mb-3">
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="align-items-center">

                <Col md={3}>
                <Row>
        <Form.Label>{t("Transaction Date")}</Form.Label>
                  <DatePicker
                    selected={data.transactionDate}
                    onChange={handleDateChange}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    portalId="seri-datepicker-portal"
                  />
                </Row>
          
                </Col>

                <Col md={3}>
                  <Form.Label>
                    {t("Lot No")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="lotNo"
                    value={data.lotNo}
                    onChange={handleLotIdInputs}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
  {t("Lot No is required")}
</Form.Control.Feedback>
                </Col>

                <Col md={2} className="mt-4">
                  <Button type="submit">{t("Get Details")}</Button>
                </Col>

              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* 🔷 TABLE */}
        <DataTable
          columns={DeleteLotColumns}
          data={lotList}
          progressPending={loading}
          progressComponent={<div className="py-4">{t("Loading...")}</div>}
          noDataComponent={
            <div className="sh-empty">
              <Icon name="inbox" />
              <p className="mt-2 mb-0">{t("No records found")}</p>
            </div>
          }
          highlightOnHover
          responsive
          customStyles={customStyles}
        />
      </Block>
    </Layout>
  );
}

export default DeleteLotPage;
