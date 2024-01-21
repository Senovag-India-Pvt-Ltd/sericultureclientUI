// TODO
// Add ListPage

import { Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Layout from '../../layout/default';
import Block from '../../components/Block/Block';
import DataTable from '../../components/DataTable/DataTable';
import { Icon, } from '../../components';
import { manufacturingOrderColumns, manufacturingOrderData } from '../../store/production/ManufacturingOrderData';

function ManufacturingOrderList() {
  return (
    <Layout title="Manufacturing Order" content="container">
        <Block.Head>
            <Block.HeadBetween>
                <Block.HeadContent>
                    <Block.Title tag="h2">Manufacturing Order</Block.Title>
                    <nav>
                        <ol className="breadcrumb breadcrumb-arrow mb-0">
                          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                          <li className="breadcrumb-item"><Link to="/ecommerce/products">Production</Link></li>
                          <li className="breadcrumb-item active" aria-current="page">Manufacturing Order</li>
                        </ol>
                    </nav>
                </Block.HeadContent>
                <Block.HeadContent>
                  <ul className="d-flex">
                    <li>
                      <Link to="/production/add-manufacturing-order" className="btn btn-primary btn-md d-md-none">
                        <Icon name="plus"/>
                        <span>Add</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/production/add-manufacturing-order" className="btn btn-primary d-none d-md-inline-flex">
                        <Icon name="plus"/>
                        <span>Add Manufacturing Order</span>
                      </Link>
                    </li>
                  </ul>
                </Block.HeadContent>
            </Block.HeadBetween>
        </Block.Head>

      <Block>
        <Card>
          <DataTable tableClassName="data-table-head-light table-responsive data-table-checkbox" data={manufacturingOrderData} columns={manufacturingOrderColumns} selectableRows ></DataTable>
        </Card>
      </Block>

    </Layout>
  )
}

export default ManufacturingOrderList;