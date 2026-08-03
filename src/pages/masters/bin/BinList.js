import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DataTable from "../../../components/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import GodawnDatas from "../../../store/masters/godawn/GodawnData";
import BinDatas from "../../../store/masters/bin/BinData";

function BinList() {
  const BinDataColumns = [
    {
      name: "action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.id)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteConfirm()}
            className="ms-2"
          >
            Delete
          </Button>
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: "Market",
      selector: (row) => row.market,
      cell: (row) => <span>{row.market}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Godown",
      selector: (row) => row.godown,
      cell: (row) => <span>{row.godown}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      cell: (row) => <span>{row.type}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Bin Number",
      selector: (row) => row.binno,
      cell: (row) => <span>{row.binno}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => <span className="text-end w-100">{row.status}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/bin-view/${_id}`);
  };

  const handleEdit = (_id) => {
    // navigate(`/seriui/village/${_id}`);
    navigate("/seriui/bin");
  };

  const deleteConfirm = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will delete permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        Swal.fire("Deleted", "You successfully deleted this record", "success");
      } else {
        Swal.fire("Cancelled", "Your record is not deleted", "info");
      }
    });
  };

  return (
    <Layout title="Bin List">
      <style>{binListStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">Bin List</Block.Title>
              <nav>
                <ol className="breadcrumb breadcrumb-arrow mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/seriui/">Home</Link>
                  </li>
                  {/* <li className="breadcrumb-item"><Link to="/seriui/crm/case-task">Village List</Link></li> */}
                  <li className="breadcrumb-item active" aria-current="page">
                    List
                  </li>
                </ol>
              </nav>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/bin"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>Create</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/bin"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="plus" />
                    <span>Create</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="sh-form-wrap">
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            data={BinDatas}
            columns={BinDataColumns}
            expandableRows
            customStyles={customStyles}
          />
        </Card>
      </Block>
    </Layout>
  );
}

const customStyles = {
  table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
  rows: {
    style: { minHeight: "52px", fontSize: "13.5px", color: "#2b2d42", borderBottom: "1px solid #eef1f6 !important", transition: "background-color 0.15s ease" },
    highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
    stripedStyle: { backgroundColor: "#fbfcfe" },
  },
  headRow: { style: { minHeight: "50px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
  headCells: {
    style: {
      backgroundColor: "transparent",
      color: "#fff",
      fontSize: "13px",
      fontWeight: 600,
      letterSpacing: "0.3px",
      textTransform: "uppercase",
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  cells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
};

const binListStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
`;

export default BinList;
