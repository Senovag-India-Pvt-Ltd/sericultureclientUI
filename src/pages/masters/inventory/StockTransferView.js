import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card,Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import StockTransferData from "../../../store/masters/inventory/StockTransferData";
// import { toInitials } from "../../../utilities";
// import DataTable from '../../../components/DataTable/DataTable';

function StockTransferViewPage() {
  const { id } = useParams();
  const [data] = useState(StockTransferData);
  const [item, setItem] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setItem(findUser);
  }, [id, data]);

  return (
    <Layout title="Item View" content="container">
      <Row>
        <Col xxl="12">
          <Block className="mt-4">
            <Card>
              <Card.Header>Stock Transfer Details</Card.Header>
              <Card.Body>
                <div className="bio-block">
                  <Row className="border-bottom p-1">
                    <Col lg={4} xs={6}>
                      <span>Transaction Id:</span>
                    </Col>
                    <Col lg={8} xs={6}>
                      <span>{item.id}</span>
                    </Col>
                  </Row>
                  <Row className="border-bottom p-1">
                    <Col lg={4} xs={6}>
                      <span>Item Name:</span>
                    </Col>
                    <Col lg={8} xs={6}>
                      <span>{item.name}</span>
                    </Col>
                  </Row>

                  <Row className="border-bottom p-1">
                    <Col lg={4} xs={6}>
                      <span>From:</span>
                    </Col>
                    <Col lg={8} xs={6}>
                      <span>{item.from}</span>
                    </Col>
                  </Row>
                  <Row className="border-bottom p-1">
                    <Col lg={4} xs={6}>
                      <span>To:</span>
                    </Col>
                    <Col lg={8} xs={6}>
                      <span>{item.to}</span>
                    </Col>
                  </Row>

                  <Row className="border-bottom p-1">
                    <Col lg={4} xs={6}>
                      <span>Quantity:</span>
                    </Col>
                    <Col lg={8} xs={6}>
                      <span>{item.qty}</span>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Block>
        </Col>
        {/* <Col xxl="4">
                    <Block className="mt-4">
                        <Card>
                            <Card.Header>Stock Details</Card.Header>
                            <Card.Body>
                                <div className="bio-block">
                                    <Row className="border-bottom p-1">
                                        <Col lg={6} xs={6}><span>Current Stock:</span></Col>
                                        <Col lg={6} xs={6}><span>{item.currentStock}</span></Col>
                                    </Row>
                                    <Row className="border-bottom p-1">
                                        <Col lg={6} xs={6}><span>Minimum Stock:</span></Col>
                                        <Col lg={6} xs={6}><span>{item.minStock}</span></Col>
                                    </Row>
                                    <Row className="border-bottom p-1">
                                        <Col lg={6} xs={6}><span>Maximum Stock:</span></Col>
                                        <Col lg={6} xs={6}><span>{item.maxStock}</span></Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Block>
                    <Block className="mt-4">
                        <Card>
                            <Card.Header>Attachments</Card.Header>
                            <Card.Body>
                                <div className="list-group-dotted mt-3">
                                    <div className="list-group-wrap">
                                        <div className="p-3">
                                            <MediaGroup>
                                                <Media className="rounded-0">
                                                    <Image src="/images/icon/file-type-pdf.svg" alt="icon" />
                                                </Media>
                                                <MediaText className="ms-1">
                                                    <a href="#download" className="title">Item Details.pdf</a>
                                                    <span className="text smaller">1.6.mb</span>
                                                </MediaText>
                                            </MediaGroup>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Block>
                </Col>
                <Block  className="mt-4">
                <Card>
                    <DataTable tableClassName="data-table-head-light table-responsive" data={ItemHistoryData} columns={iventoryHistoryColumns} />
                </Card>
            </Block> */}
      </Row>
    </Layout>
  );
}

export default StockTransferViewPage;
