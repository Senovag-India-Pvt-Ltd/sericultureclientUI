import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import { Icon } from "../../components";
import RequestData, { requestColumns } from "../../store/request/RequestData";
// import { bomColumns, boms } from "../../store/production/BomData";

function RequestList() {
  return (
    <Layout title="Request List" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Request List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item"><Link to="/seriui/ecommerce/products">Production</Link></li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Request
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              {/* <li>
                <Link
                  to="/seriui/production/add-bill-of-material"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Add</span>
                </Link>
              </li> */}
              <li>
                <Link
                  to="/seriui/add-request"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Add Request</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={RequestData}
            columns={requestColumns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default RequestList;
