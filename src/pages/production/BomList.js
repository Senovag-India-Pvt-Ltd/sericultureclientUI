// TODO
// Add ListPage

import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import { Icon } from "../../components";
import { bomColumns, boms } from "../../store/production/BomData";

function BomList() {
  return (
    <Layout title="Bill of Material" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Bill of Material</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item"><Link to="/seriui/ecommerce/products">Production</Link></li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  BoM
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/production/add-bill-of-material"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Add</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/production/add-bill-of-material"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Add BoM</span>
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
            data={boms}
            columns={bomColumns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default BomList;
