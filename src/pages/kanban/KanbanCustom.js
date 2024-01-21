import Layout from '../../layout/default';
import Block from '../../components/Block/Block';
import { KanbanCustom } from '../../components/Kanban/Kanban';

function KanbanCustomPage() {

  // kanban data
  const kanbanCustomData = [
    {
      id: "item-1",
      label: "Open",
      theme: "kanban-light",
      items: [
        {
            id: "content-1",
            title: "NioBoard Design Kit Update",
            content: "Update the new UI design for nioboard template with based on feedback"
        },
        {
            id: "content-2",
            title: "Implement Design into Template",
            content: "Start implementing new design in Coding nioboard."
        },
        {
            id: "content-3",
            title: "NioBoard React Version",
            content: "Implement new UI design in react version nioboard template as soon as possible."
        }
      ]
    },
    {
      id: "item-2",
      label: "In Progress",
      theme: "kanban-primary",
      items: [
        {
            id: "content-4",
            title: "Techyspec Keyword Research",
            content: "Keyword recarch for techyspec business profile and there other websites, to improve ranking."
        }, 
        {
            id: "content-5",
            title: "Fitness Next Website Design",
            content: "Design a awesome website for fitness_next new product launch."
        }, 
        {
            id: "content-6",
            title: "Runnergy Website Redesign",
            content: "Redesign there old/backdated website new modern and clean look keeping minilisim in mind."
        }, 
        {
            id: "content-7",
            title: "Wordlab Android App",
            content: "Wordlab Android App with with react native."
        }
      ]
    },
    {
      id: "item-3", 
      label: "In Review",
      theme: "kanban-warning",
      items: [
        {
            id: "content-8",
            title: "Oberlo Development",
            content: "Complete website development for Oberlo limited."
        }, 
        {
            id: "content-9",
            title: "IOS app for Getsocio",
            content: "Design and develop app for Getsocio IOS."
        },
        {
            id: "content-10",
            title: "Android app for Softnio",
            content: "Design and develop app for Softnio."
        }
      ]
    }, 
    {
      id: "item-4", 
      label: "Issues",
      theme: "kanban-danger",
      items: [
        {
            id: "content-11",
            title: "Qualitative research planning",
            content: "Complete website development for Oberlo limited."
        },
        {
            id: "content-12",
            title: "Qualitative research planning",
            content: "Complete website development for Oberlo limited."
        },
      ]
    }, 
    {
      id: "item-5", 
      label: "Completed",
      theme: "kanban-success",
      items: [
        {
            id: "content-13",
            title: "Nioboard project done",
            content: "Complete website development for Oberlo limited."
        }
      ]
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
          </Block.HeadContent>
        </Block.Head>

        <KanbanCustom containerClass="kanban-custom-board" data={kanbanCustomData}/>
      </Block>

    </Layout>
  )
}

export default KanbanCustomPage;