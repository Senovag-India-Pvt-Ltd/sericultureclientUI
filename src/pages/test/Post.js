// import DataTable from '../../components/DataTable/DataTableErp';
import DataTable from "react-data-table-component";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function PostListPage() {
  const [listData, setListData] = useState({});
  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };

  const getList = () => {
    setLoading(true);
    axios
      .get(baseURL + `/list`, _params)
      .then((response) => {
        setListData(response.data.content.education);
        setTotalRows(response.data.content.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        setListData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [page]);

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/education-view/${_id}`);
  };

  const handleEdit = (_id) => {
    // navigate(`/education/${_id}`);
    navigate("/seriui/education");
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

  const DataTableColumns = [
    {
      name: "action",
      cell: (row) => (
        <div className="text-start w-100">
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
      name: "Education",
      selector: (row) => row.name,
      cell: (row) => <span className="text-end w-100">{row.name}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Education List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Education List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
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
                <Link
                  to="/seriui/education"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/education"
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
            title="Education List"
            tableClassName="data-table-head-light table-responsive"
            columns={DataTableColumns}
            data={listData}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default PostListPage;
