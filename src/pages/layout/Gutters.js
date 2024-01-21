import { Card, Row, Col} from 'react-bootstrap';
import Layout from '../../layout/default';
import Block from '../../components/Block/Block';
import CodePreview from '../../components/CodePreview/CodePreview';

function GutterPage() {
  return (
    <Layout title="Gutters" content="container">
      <Block.Head page className="wide-md">
        <Block.HeadContent>
            <Block.Title>Gutters</Block.Title>
            <Block.Text>Gutters are the padding between your columns, used to responsively space and align content in the Bootstrap grid system.</Block.Text>
        </Block.HeadContent>
      </Block.Head>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Horizontal gutters</Block.Title>
            <Block.Text><code>.gx-*</code> classes can be used to control the horizontal gutter widths. The <code>.container</code> or <code>.container-fluid</code> parent may need to be adjusted if larger gutters are used too to avoid unwanted overflow, using a matching padding utility. For example, in the following example we’ve increased the padding with <code>.px-4</code>:</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <Row className="gx-5">
                    <Col>
                        <div className="p-3 border bg-light">Custom column padding</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Custom column padding</div>
                    </Col>
                </Row>
            </Card.Body>
          <CodePreview>
          {`import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HorizontalGutter() {
  return (
    <Row className="gx-5">
        <Col>
            <div className="p-3 border bg-light">Custom column padding</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Custom column padding</div>
        </Col>
    </Row>
  );
}

export default HorizontalGutter;
`}
          </CodePreview>
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Vertical gutters</Block.Title>
            <Block.Text><code>.gy-*</code> classes can be used to control the vertical gutter widths. Like the horizontal gutters, the vertical gutters can cause some overflow below the <code>Row</code> at the end of a page. If this occurs, you add a wrapper around <code>Row</code> with the <code>.overflow-hidden</code> class:</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <div className="overflow-hidden">
                    <Row className="gy-5">
                        <Col lg="6">
                            <div className="p-3 border bg-light">Custom column padding</div>
                        </Col>
                        <Col lg="6">
                            <div className="p-3 border bg-light">Custom column padding</div>
                        </Col>
                        <Col lg="6">
                            <div className="p-3 border bg-light">Custom column padding</div>
                        </Col>
                        <Col lg="6">
                            <div className="p-3 border bg-light">Custom column padding</div>
                        </Col>
                    </Row>
                </div>
            </Card.Body>
          <CodePreview>
          {`import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function VerticalGutter() {
  return (
    <div className="overflow-hidden">
        <Row className="gy-5">
            <Col lg="6">
                <div className="p-3 border bg-light">Custom column padding</div>
            </Col>
            <Col lg="6">
                <div className="p-3 border bg-light">Custom column padding</div>
            </Col>
            <Col lg="6">
                <div className="p-3 border bg-light">Custom column padding</div>
            </Col>
            <Col lg="6">
                <div className="p-3 border bg-light">Custom column padding</div>
            </Col>
        </Row>
    </div>
  );
}

export default VerticalGutter;
`}
          </CodePreview>
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Horizontal & vertical gutters</Block.Title>
            <Block.Text><code>.g-*</code> classes can be used to control the horizontal gutter widths, for the following example we use a smaller gutter width, so there won’t be a need to add the <code>.overflow-hidden</code> wrapper class.</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <Row className="g-2">
                    <Col lg="6">
                        <div className="p-3 border bg-light">Custom column padding</div>
                    </Col>
                    <Col lg="6">
                        <div className="p-3 border bg-light">Custom column padding</div>
                    </Col>
                    <Col lg="6">
                        <div className="p-3 border bg-light">Custom column padding</div>
                    </Col>
                    <Col lg="6">
                        <div className="p-3 border bg-light">Custom column padding</div>
                    </Col>
                </Row>
            </Card.Body>
          <CodePreview>
          {`import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HorizontalAndVerticalGutter() {
  return (
    <Row className="g-2">
        <Col lg="6">
            <div className="p-3 border bg-light">Custom column padding</div>
        </Col>
        <Col lg="6">
            <div className="p-3 border bg-light">Custom column padding</div>
        </Col>
        <Col lg="6">
            <div className="p-3 border bg-light">Custom column padding</div>
        </Col>
        <Col lg="6">
            <div className="p-3 border bg-light">Custom column padding</div>
        </Col>
    </Row>
  );
}

export default HorizontalAndVerticalGutter;
`}
          </CodePreview>
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Row columns gutters</Block.Title>
            <Block.Text>Gutter classes can also be added to row columns. In the following example, we use responsive row columns and responsive gutter classes.</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <Row className="row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                    <Col>
                        <div className="p-3 border bg-light">Row column</div>
                    </Col>
                </Row>
            </Card.Body>
          <CodePreview>
          {`import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function RowColumnGutter() {
  return (
    <Row className="row-cols-2 row-cols-lg-5 g-2 g-lg-3">
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
        <Col>
            <div className="p-3 border bg-light">Row column</div>
        </Col>
    </Row>
  );
}

export default RowColumnGutter;
`}
          </CodePreview>
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">No gutters</Block.Title>
            <Block.Text>The gutters between columns in our predefined grid classes can be removed with <code>.g-0</code>. This removes the negative margins from <code>.row</code> and the horizontal padding from all immediate children columns.</Block.Text>
            <Block.Text>Need an edge-to-edge design? Drop the parent <code>.container</code> or <code>.container-fluid</code> and add <code>.mx-0</code> to the <code>.row</code> to prevent overflow.</Block.Text>
            <Block.Text>In practice, here’s how it looks. Note you can continue to use this with all other predefined grid classes (including column widths, responsive tiers, reorders, and more).</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <Row className="g-0">
                    <Col md="8" className="p-3 border bg-light">.col-md-8</Col>
                    <Col md="4" className="col-md-4 p-3 border bg-light">.col-md-4</Col>
                </Row>
            </Card.Body>
          <CodePreview>
          {`import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function NoGutter() {
  return (
    <Row className="g-0">
        <Col md="8" className="p-3 border bg-light">.col-md-8</Col>
        <Col md="4" className="col-md-4 p-3 border bg-light">.col-md-4</Col>
    </Row>
  );
}

export default NoGutter;
`}
          </CodePreview>
        </Card>
      </Block>


    </Layout>
  )
}

export default GutterPage