import { Card } from 'react-bootstrap';
import Layout from '../../layout/default';
import Block from '../../components/Block/Block';
import { KanbanBasic } from '../../components/Kanban/Kanban';

function KanbanBasicPage() {

  // kanban data
  const kanbanBasicData = [
    {
      id: "item-1",
      label: "in Process",
      items: [
          {
            id: "content-1", 
            content: "Plan marketing campaign"
          },
          {
            id: "content-2", 
            content: "Collect design assets"
          },
      ],
    },
    {
      id: "item-2",
      label: "Working",
      items: [
          {
            id: "content-3", 
            content: "Do Something!"
          }, 
          {
            id: "content-4", 
            content: "Run?"
          }, 
      ],
    },
    {
      id: "item-3", 
      label: "Done",
      items: [
          {
            id: "content-5", 
            content: "All right"
          }, 
          {
            id: "content-6", 
            content: "Ok!"
          }, 
      ],
    }, 
  ];

  // kanban colored data
  const kanbanBasicColoredData = [
    {
      id: "item-1",
      label: "in Process",
      theme: "kanban-primary",
      items: [
          {
            id: "content-1",
            content: "Plan marketing campaign"
          },
          {
            id: "content-2",
            content: "Collect design assets"
          },
      ],
    },
    {
      id: "item-2",
      label: "Working",
      theme: "kanban-warning",
      items: [
          {
            id: "content-3",
            content: "Do Something!"
          }, 
          {
            id: "content-4",
            content: "Run?"
          }, 
      ],
    },
    {
      id: "item-3", 
      label: "Done",
      theme: "kanban-success",
      items: [
          {
            id: "content-5",
            content: "All right"
          }, 
          {
            id: "content-6",
            content: "Ok!"
          }, 
      ],
    }, 
  ];

  return (
    <Layout title="Kanban Basic" content="container">
        <Block.Head page>
        <Block.HeadContent>
            <Block.Title>Kanban Board</Block.Title>
            <Block.Text className="lead">Kanban board using <a href="https://github.com/atlassian/react-beautiful-dnd" target="_blank" rel="noreferrer">react-beautiful-dnd</a> plugin.</Block.Text>
        </Block.HeadContent>
      </Block.Head>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Text><strong className="text-black">Note:</strong> When you copy the code example and if you paste your copied code to any other component. these will not work because you just copied the component's name from code example. to use you have to <code>import</code> these component.
            </Block.Text>
            <Block.Text>How to import component and use see the <a href="#docs">docs</a></Block.Text>
            <Block.Title tag="h3">Basic Example</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Card>
          <Card.Body>
            <KanbanBasic data={kanbanBasicData}/>
          </Card.Body>
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Colored Example</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Card>
          <Card.Body>
            <KanbanBasic containerClass="kanban-colored" data={kanbanBasicColoredData}/>
          </Card.Body>
        </Card>
      </Block>

    </Layout>
  )
}

export default KanbanBasicPage;