import { Card } from 'react-bootstrap';

import Layout from '../layout/default';
import Block from '../components/Block/Block';
import CodePreview from '../components/CodePreview/CodePreview';
import DataTable from '../components/DataTable/DataTable';
import { tableData, tableColumns } from '../components/DataTable/TableData';

function DataTablePage() {
  return (
    <Layout title="Data Tables" content="container">
        <Block.Head page className="wide-md">
        <Block.HeadContent>
            <Block.Title>Data tables</Block.Title>
            <Block.Text>The tables in this section has used the <a href="https://react-data-table-component.netlify.app/?path=/story/getting-started-intro--page" target="_blank" rel="noreferrer">React-Data-Table-Component</a> plugin. for more info visit the <a href="https://react-data-table-component.netlify.app/?path=/story/getting-started-intro--page" target="_blank" rel="noreferrer">website</a>.
            </Block.Text>
        </Block.HeadContent>
      </Block.Head>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Example</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Card>
          <DataTable tableClassName="data-table-head-light table-responsive" data={tableData} columns={tableColumns} expandableRows/>
          <CodePreview>
          {`import DataTable from '../components/DataTable/DataTable';
import { tableData, tableColumns } from '../components/DataTable/TableData';

function DataTableExample() {
  return (
    <DataTable data={tableData} columns={tableColumns} expandableRows/>
  );
}

export default DataTableExample;
`}
          </CodePreview>
          
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Data table with export</Block.Title>
            <Block.Text>Pass in the <code>actions</code> props to <code>DataTable</code> add export option to the table.</Block.Text>
          </Block.HeadContent>
        </Block.Head>
        <Card>
          <DataTable tableClassName="data-table-head-light table-responsive" data={tableData} columns={tableColumns} expandableRows actions/>
          <CodePreview>
          {`import DataTable from '../components/DataTable/DataTable';
import { tableData, tableColumns } from '../components/DataTable/TableData';

function DataTableExample() {
  return (
    <DataTable data={tableData} columns={tableColumns} expandableRows actions/>
  );
}

export default DataTableExample;
`}
          </CodePreview>
          
        </Card>
      </Block>

    </Layout>
  )
}

export default DataTablePage;