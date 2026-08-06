import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import api from "../../../src/services/auth/api";
import Swal from "sweetalert2";



const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const deleteLotPageStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-form-wrap { background: #eef2f8; border-radius: 14px; padding: 18px; }
  .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; }
  .sh-form-wrap .form-control, .sh-form-wrap .form-select {
    border-radius: 8px; border: 1px solid #dbe4f0; padding: 9px 12px; font-size: 13.5px;
  }
  .sh-form-wrap .form-control:focus, .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6; box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-form-wrap .btn-primary {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border: none !important;
    font-weight: 600; border-radius: 8px;
  }
  .sh-form-wrap table thead th {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    color: #fff !important; font-weight: 700; border: none !important;
  }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

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

      const response = await api.get(
      baseURL1 +
      `lotGroupage/getdetails?date=${formattedDate}&lotNo=${data.lotNo}`
    );
       setLotList(response.data.content || []);
        setValidated(false);
    } catch (err) {
       let errorMsg =
      err?.response?.data?.errorMessages?.[0]?.message?.[0]?.reason ||
      "Something went wrong";
      setLotList([]);
          Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMsg,
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
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
    title: "Are you sure?",
    text: "It will delete permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No",
    customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
  }).then(async (result) => {

    if (result.isConfirmed) {

      // ✅ Correct variable used
      const formattedDate = new Date(transactionDate)
        .toLocaleDateString("en-CA"); // YYYY-MM-DD
console.log(baseURL1);
      try {
        await api.delete(
          baseURL1 + `lotGroupage/delete?lotId=${lotId}&date=${formattedDate}`
        );
        

          Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Lot has been deleted successfully.",
      timer: 2000,
      showConfirmButton: false,
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
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
    "You cannot delete this lot as it is already distributed";

        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: message,
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
        });

      }

    } else {
      Swal.fire("Cancelled", "Your record is safe", "info");
    }

  });
};


  // 🔷 Table Styles
  const customStyles = {
    table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
    headRow: { style: { minHeight: "44px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
    headCells: {
      style: {
        backgroundColor: "transparent",
        color: "#fff",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: "13px",
        letterSpacing: "0.3px",
      },
    },
    rows: {
      style: { fontSize: "13.5px", color: "#2b2d42", borderBottom: "1px solid #eef1f6 !important" },
      highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
    },
    cells: {
      style: {
        padding: "10px 12px",
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
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Layout title={t("Delete Lot")} show="true">
      <style>{deleteLotPageStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.Title tag="h2" className="sh-page-title">{t("Delete Lot")}</Block.Title>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
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
  Lot No is required
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
          highlightOnHover
          responsive
          customStyles={customStyles}
        />
      </Block>
    </Layout>
  );
}

export default DeleteLotPage;
