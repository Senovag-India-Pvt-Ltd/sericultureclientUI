import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable from "../../components/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import ChawkiManagementData from "../../store/chawki-management/ChawkiManagementData";

function SaleChawkiWormsList() {
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

  const navigate = useNavigate();
  const handleView = (_id) => {
    navigate(`/seriui/sale-chawki-worms-view/${_id}`);
  };

  const handleEdit = (_id) => {
    // navigate(`/seriui/caste/${_id}`);
    navigate("/seriui/sale-chawki-worms");
  };

  const ChawkiManagementDataColumns = [
    {
      name: "action",
      width: "300px",
      headerStyle: (selector, id) => {
        return { textAlign: "center" };
      },
      cell: (row) => (
        //   Button style
        <div className="text-end w-100 d-flex justify">
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
      name: "Source of DFLs",
      selector: (row) => row.source,
      cell: (row) => <span>{row.source}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Race of DFLs",
      selector: (row) => row.race,
      cell: (row) => <span>{row.race}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Dispatch Date",
      selector: (row) => row.dispatch,
      cell: (row) => <span>{row.dispatch}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot Number",
      selector: (row) => row.lotno,
      cell: (row) => <span>{row.lotno}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Receipt Number",
      selector: (row) => row.receiptno,
      cell: (row) => <span className="text-end w-100">{row.receiptno}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Sale Chawki Worms List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sale Chawki Worms List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item"><Link to="/seriui/crm/case-task">Farmer registration List</Link></li> */}
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
                  to="/seriui/sale-chawki-worms"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sale-chawki-worms"
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
            data={ChawkiManagementData}
            columns={ChawkiManagementDataColumns}
            expandableRows
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default SaleChawkiWormsList;
