import { Card, Row, Col} from 'react-bootstrap';
import Layout from '../../layout/default';
import Block from '../../components/Block/Block';
import CodePreview from '../../components/CodePreview/CodePreview';

function ContainerPage() {
  return (
    <Layout title="Containers" content="container">
      <Block.Head page className="wide-md">
        <Block.HeadContent>
            <Block.Title>Containers</Block.Title>
            <Block.Text>Containers are a fundamental building block of Bootstrap that contain, pad, and align your content within a given device or viewport.</Block.Text>
        </Block.HeadContent>
      </Block.Head>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Containers</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Card>
          <Card.Body>
          <div className="table-responsive">
                <table className="table small">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Extra small<div className="fw-normal">&lt;576px</div></th>
                            <th>Small<div className="fw-normal">≥576px</div></th>
                            <th>Medium<div className="fw-normal">≥768px</div></th>
                            <th>Large<div className="fw-normal">≥992px</div></th>
                            <th>X-Large<div className="fw-normal">≥1200px</div></th>
                            <th>XX-Large<div className="fw-normal">≥1400px</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>.container</code></td>
                            <td><span className="text-muted">100%</span></td>
                            <td>540px</td>
                            <td>720px</td>
                            <td>960px</td>
                            <td>1140px</td>
                            <td>1320px</td>
                        </tr>
                        <tr>
                            <td><code>.container-sm</code></td>
                            <td><span className="text-muted">100%</span></td>
                            <td>540px</td>
                            <td>720px</td>
                            <td>960px</td>
                            <td>1140px</td>
                            <td>1320px</td>
                        </tr>
                        <tr>
                            <td><code>.container-md</code></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td>720px</td>
                            <td>960px</td>
                            <td>1140px</td>
                            <td>1320px</td>
                        </tr>
                        <tr>
                            <td><code>.container-lg</code></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td>960px</td>
                            <td>1140px</td>
                            <td>1320px</td>
                        </tr>
                        <tr>
                            <td><code>.container-xl</code></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td>1140px</td>
                            <td>1320px</td>
                        </tr>
                        <tr>
                            <td><code>.container-xxl</code></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td>1320px</td>
                        </tr>
                        <tr>
                            <td><code>.container-fluid</code></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                            <td><span className="text-muted">100%</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </Card.Body>
        </Card>
      </Block>


      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Default container</Block.Title>
            <Block.Text>Our default <code>.container</code> class is a responsive, fixed-width container, meaning its max-width changes at each breakpoint.</Block.Text>
            <Block.Text>Use <code>.container-fluid</code> for a full width container, spanning the entire width of the viewport.</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
          <CodePreview>
          {`<div className="container">
  <!-- Content here -->
</div>
`}
          </CodePreview>
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Grid system</Block.Title>
            <Block.Text>Use our powerful mobile-first flexbox grid to build layouts of all shapes and sizes thanks to a twelve column system, six default responsive tiers, Sass variables and mixins, and dozens of predefined classes.</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <Row>
                    <Col className="bg-light border p-3">
                        Column
                    </Col>
                    <Col className="bg-light border p-3">
                        Column
                    </Col>
                    <Col className="bg-light border p-3">
                        Column
                    </Col>
                </Row>
            </Card.Body>
          <CodePreview>
          {`import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function GridExample() {
  return (
    <Row>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
    </Row>
  );
}

export default GridExample;
`}
          </CodePreview>
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Responsive grids</Block.Title>
            <Block.Text>The <code>Col</code> lets you specify column widths across 6 breakpoint sizes (xs, sm, md, lg, xl and xxl). For every breakpoint, you can specify the amount of columns to span, or set the prop to <code>&lt;Col lg={true} /&gt;</code> for auto layout widths.</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <Row>
                    <Col className="bg-light border p-3" sm={8}>sm=8</Col>
                    <Col className="bg-light border p-3" sm={4}>sm=4</Col>
                </Row>
                <Row>
                    <Col className="bg-light border p-3" sm>sm=true</Col>
                    <Col className="bg-light border p-3" sm>sm=true</Col>
                    <Col className="bg-light border p-3" sm>sm=true</Col>
                </Row>
            </Card.Body>
          <CodePreview>
          {`<Row>
    <Col className="bg-light border p-3" sm={8}>sm=8</Col>
    <Col className="bg-light border p-3" sm={4}>sm=4</Col>
</Row>
<Row>
    <Col className="bg-light border p-3" sm>sm=true</Col>
    <Col className="bg-light border p-3" sm>sm=true</Col>
    <Col className="bg-light border p-3" sm>sm=true</Col>
</Row>
`}
          </CodePreview>
        </Card>
      </Block>

    </Layout>
  )
}

export default ContainerPage