import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DataTable from "../../../components/DataTable/DataTable";
import { Icon } from "../../../components";
import CompanyData, {
  companyColumns,
} from "../../../store/masters/company/CompaniesData";

function CompanyListPage() {
  //   const [showModal, setShowModal] = useState(false);

  //   const handleShowModal = () => setShowModal(true);
  //   const handleCloseModal = () => setShowModal(false);

  return (
    <Layout title="Company List" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Company List</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/masters/company-list">Company list</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Companies
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/masters/add-company"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Add</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/masters/add-company"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Add Company</span>
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
            data={CompanyData}
            columns={companyColumns}
          />
        </Card>
      </Block>

      {/* <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
              <Row className="g-3">
                  <Col lg="12">
                      <Form.Group className="form-group">
                          <Form.Label htmlFor="name">Name</Form.Label>
                          <div className="form-control-wrap">
                              <Form.Control id="name" type="text" placeholder="Company Name"/>
                          </div>
                      </Form.Group>
                  </Col>

                  <Col lg="12">
                      <Form.Group className="form-group">
                          <Form.Label htmlFor="description">Description</Form.Label>
                          <div className="form-control-wrap">
                              <Form.Control id="description" type="text" placeholder="Description"/>
                          </div>
                      </Form.Group>
                  </Col>

                  <Col lg="12">
                      <div className="d-flex gap g-2">
                          <div className="gap-col">
                              <Button variant="primary" onClick={handleCloseModal}>Add Company</Button>
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

export default CompanyListPage;
