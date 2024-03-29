import { Card, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "../../../components/DataTable/DataTable";
import { Select } from "../../../components";
import InventoryHistoryData, {
  iventoryHistoryColumns,
} from "../../../store/masters/inventory/InventoryHistoryData";

function InventoryHistoryListPage() {
  return (
    <Layout title="Inventory History List" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Inventory History</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/masters/inventory-history">
                    Inventory History List
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Inventory History
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <div>
        <Form action="#">
          <Row className="g-2 flex-left">
            <Col lg="4">
              <Form.Group className="form-group">
                <Form.Label>Select Store</Form.Label>
                <div className="form-control-wrap">
                  <Select removeItemButton>
                    <option value="">Select</option>
                    <option value="1">Store1</option>
                    <option value="2">Store2</option>
                    <option value="3">Store3</option>
                  </Select>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            data={InventoryHistoryData}
            columns={iventoryHistoryColumns}
          />
        </Card>
      </Block>

      {/* <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form action="#">
                        <Row className="g-3 ">

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="itemId">Item Id</Form.Label>
                                    <div className="form-control-wrap">
                                        <Form.Control id="itemId" type="text" placeholder="Enter Item ID" />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="itemName">Item Name</Form.Label>
                                    <div className="form-control-wrap">
                                        <Form.Control id="name" type="text" placeholder="Enter Item Name" />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label>Product/Service</Form.Label>
                                    <div className="form-control-wrap">
                                        <Select removeItemButton>
                                            <option value="">Select</option>
                                            <option value="1">Product</option>
                                            <option value="2">Service</option>
                                        </Select>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label>Buy/Sell/Both</Form.Label>
                                    <div className="form-control-wrap">
                                        <Select removeItemButton>
                                            <option value="">Select</option>
                                            <option value="1">Buy</option>
                                            <option value="2">Sell</option>
                                            <option value="3">Both</option>
                                        </Select>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label>Unit of Measurement(UoM)</Form.Label>
                                    <div className="form-control-wrap">
                                        <Select removeItemButton>
                                            <option value="">Select</option>
                                            <option value="1">Kilogram</option>
                                            <option value="2">Gram</option>
                                            <option value="3">Ton</option>
                                        </Select>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label>Item Category</Form.Label>
                                    <div className="form-control-wrap">
                                        <Select removeItemButton>
                                            <option value="">Select</option>
                                            <option value="1">Raw Materials</option>
                                            <option value="2">Semi-finished Goods</option>
                                            <option value="3">Consumables</option>
                                            <option value="4">Bought-out Parts</option>
                                            <option value="5">Trading Goods</option>
                                            <option value="6">Service</option>
                                        </Select>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="current-stock">Current Stock</Form.Label>
                                    <div className="form-control-wrap">
                                        <Form.Control id="current-stock" type="text" placeholder="Enter Current Stock" />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="price">Price</Form.Label>
                                    <div className="form-control-wrap">
                                        <Form.Control id="price" type="text" placeholder="Enter Price" />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="hsn">HSN Code</Form.Label>
                                    <div className="form-control-wrap">
                                        <Form.Control id="hsn" type="text" placeholder="Enter the HSN code" />
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <Form.Group className="form-group">
                                    <Form.Label>Tax</Form.Label>
                                    <div className="form-control-wrap">
                                        <Select removeItemButton>
                                            <option value="">Select</option>
                                            <option value="1">Tax:5%</option>
                                            <option value="2">Tax:28%</option>
                                            <option value="3">Tax:12%</option>
                                            <option value="4">Tax:18%</option>
                                            <option value="5">Tax:30%</option>
                                        </Select>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col lg="12">
                                <div className="d-flex gap g-2">
                                    <div className="gap-col">
                                        <Button variant="primary" onClick={handleCloseModal}>Add Item</Button>
                                    </div>
                                    <div className="gap-col">
                                        <button type="button" className="border-0 btn" onClick={handleCloseModal}>Discard</button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal> */}
    </Layout>
  );
}

export default InventoryHistoryListPage;
