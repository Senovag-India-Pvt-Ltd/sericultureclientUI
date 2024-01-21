import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable from "../../components/DataTable/DataTable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import React from 'react';
import MaintenanceMulberryFarmDatas from "../../store/maintenance-mulberry-farm/MaintenanceMulberryFarmData";

function MaintenanceMulberryFarmList() {
  const MaintenanceMulberryFarmDataColumns = [
    {
      name: "action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button variant="primary" size="sm" onClick={()=>handleView(row.id)}>
            View
          </Button>
          <Button variant="primary" size="sm" className="ms-2" onClick={()=>handleEdit(row.id)}>
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
      name: "Plot Number",
      selector: (row) => row.plotnumber,
      cell: (row) => <span>{row.plotnumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: "Types of Mulberry Variety",
        selector: (row) => row.typesofmulberryvariety,
        cell: (row) => <span>{row.typesofmulberryvariety}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: "Pruning Date",
      selector: (row) => row.pruningdate,
      cell: (row) => <span className="text-end w-100">{row.pruningdate}</span>,
      sortable: true,
      hide: "md",
    },
  ];
  
  const navigate = useNavigate();
  const handleView = (_id) =>  {
    navigate(`/maintenance-mulberry-farm-view/${_id}`);
  }

  const handleEdit = (_id) =>  {
    // navigate(`/maintenance-mulberry-farm/${_id}`);
    navigate("/maintenance-mulberry-farm");
  }
  
  const deleteConfirm = () =>  {
    Swal.fire({
      title: 'Are you sure?',
      text: "It will delete permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if(result.value) {
          Swal.fire('Deleted', 'You successfully deleted this record', 'success')
        } else {
          Swal.fire('Cancelled', 'Your record is not deleted', 'info')
        }
    })
  };

  return (
    <Layout title="Maintenance of Mulberry Farm List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Maintenance of Mulberry Farm List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  List
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/maintenance-mulberry-farm" className="btn btn-primary btn-md d-md-none">
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/maintenance-mulberry-farm"
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
            data={MaintenanceMulberryFarmDatas}
            columns={MaintenanceMulberryFarmDataColumns}
            expandableRows
          />
        </Card>
      </Block>
    </Layout>
  );
};

export default MaintenanceMulberryFarmList;
