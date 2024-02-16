import { Card, Form, Row, Col, Button } from "react-bootstrap";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Select } from "../../components";

function AddRequest() {
  return (
    <Layout title="Add Request" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Add Request</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item"><Link to="/seriui/crm/case">Case List</Link></li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Add Request
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group className="form-group">
                      <Form.Label>Requester</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Requester</option>
                          <option value="1">Requester 1</option>
                          <option value="2">Requester 2</option>
                          <option value="3">Requester 3</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="12">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="description">Description</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="description"
                          type="text"
                          placeholder="Write Here..."
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="12">
                    <Form.Group className="form-group">
                      <Form.Label>Service Type</Form.Label>
                      <div className="form-control-wrap">
                        <Select removeItemButton>
                          <option value="">Select Service Type</option>
                          <option value="1">Electronics</option>
                          <option value="2">Plumbing</option>
                          <option value="3">Mason Work</option>
                        </Select>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Link to="/seriui/request" className="btn border-0">
                    Cancel
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default AddRequest;
