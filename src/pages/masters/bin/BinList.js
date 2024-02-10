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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Bin List</Block.Title>
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
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/bin"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            data={BinDatas}
            columns={BinDataColumns}
            expandableRows
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default BinList;
