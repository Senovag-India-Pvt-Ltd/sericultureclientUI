import { Card} from 'react-bootstrap';
import Layout from '../../layout/default';
import Block from '../../components/Block/Block';

function BreakpointPage() {
  return (
    <Layout title="Breakpoints" content="container">
      <Block.Head page>
        <Block.HeadContent>
            <Block.Title>Breakpoints</Block.Title>
            <Block.Text>Breakpoints are customizable widths that determine how your responsive layout behaves across device or viewport sizes in Bootstrap.</Block.Text>
        </Block.HeadContent>
      </Block.Head>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Breakpoints</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Card>
          <Card.Body>
          <div className="table-responsive">
                <table className="table">
                <thead>
                    <tr>
                        <th>Breakpoint</th>
                        <th>Class infix</th>
                        <th>Dimensions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="small">Extra small</td>
                        <td><em>None</em></td>
                        <td className="small">&lt;576px</td>
                    </tr>
                    <tr>
                        <td className="small">Small</td>
                        <td><code>sm</code></td>
                        <td className="small">≥576px</td>
                    </tr>
                    <tr>
                        <td className="small">Medium</td>
                        <td><code>md</code></td>
                        <td className="small">≥768px</td>
                    </tr>
                    <tr>
                        <td className="small">Large</td>
                        <td><code>lg</code></td>
                        <td className="small">≥992px</td>
                    </tr>
                    <tr>
                        <td className="small">Extra large</td>
                        <td><code>xl</code></td>
                        <td className="small">≥1200px</td>
                    </tr>
                    <tr>
                        <td className="small">Extra extra large</td>
                        <td><code>xxl</code></td>
                        <td className="small">≥1400px</td>
                    </tr>
                </tbody>
                </table>
            </div>
          </Card.Body>
        </Card>
      </Block>

      
    </Layout>
  )
}

export default BreakpointPage