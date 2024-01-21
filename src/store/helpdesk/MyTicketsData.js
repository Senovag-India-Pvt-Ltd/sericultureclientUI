import { Dropdown } from "react-bootstrap";
import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
  LinkList,
  LinkListItem,
} from "../../components";

// task table column
export const MyTicketColumns = [
  {
    name: "Ticket",
    selector: (row) => row.name,
    cell: (row) => <span>{row.name}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Ticket Type",
    selector: (row) => row.type,
    cell: (row) => <span>{row.type}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Created Date",
    selector: (row) => row.createdate,
    cell: (row) => <span>{row.createdate}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    cell: (row) => <span>{row.status}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Created By",
    selector: (row) => row.createdby,
    cell: (row) => <span>{row.createdby}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Module Name",
    selector: (row) => row.mname,
    cell: (row) => <span>{row.mname}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Functionality",
    selector: (row) => row.functionality,
    cell: (row) => <span>{row.functionality}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Description Summary",
    selector: (row) => row.summary,
    cell: (row) => <span>{row.summary}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Severity",
    selector: (row) => row.severity,
    cell: (row) => <span>{row.severity}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Escalate /Deescalate",
    selector: (row) => row.escalate,
    cell: (row) => <span>{row.escalate}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Ticket Response",
    selector: (row) => row.response,
    cell: (row) => <span>{row.response}</span>,
    sortable: true,
    hide: "md",
  },

  {
    name: "action",
    cell: (row) => (
      <div className="text-end w-100">
        <Dropdown>
          <Dropdown.Toggle
            size="sm"
            as={CustomDropdownToggle}
            className="btn btn-sm btn-icon btn-zoom me-n1"
          >
            <Icon name="more-v"></Icon>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu-sm"
            as={CustomDropdownMenu}
            align="end"
          >
            <div className="dropdown-content py-1">
              <LinkList className="link-list-hover-bg-primary link-list-md">
                {/* <LinkListItem to={`/user-manage/user-edit/${row.id}`}> */}
                <LinkListItem to={`#`}>
                  <Icon name="edit"></Icon>
                  <span>Edit</span>
                </LinkListItem>
                <LinkListItem to={`#`}>
                  <Icon name="trash"></Icon>
                  <span>Delete</span>
                </LinkListItem>
                <LinkListItem to={`/my-tickets/${row.id}`}>
                  <Icon name="eye"></Icon>
                  <span>View Details</span>
                </LinkListItem>
              </LinkList>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    ),
    sortable: false,
    hide: "md",
  },
];

// tasks data
const MyTicketsData = [
  {
    id: "uid01",
    name: "Ticket 1",
    type: "Technical",
    createdate: "02/06/2020",
    status: "Resolved",
    createdby: "Amar",
    mname: "Training Module",
    functionality: "Workshops/Training",
    summary: "Not working",
    severity: "4",
    escalate: "",
    response: "Resolved",
  },
  {
    id: "uid02",
    name: "Ticket 2",
    type: "Functional",
    createdate: "02/07/2020",
    status: "Resolved",
    createdby: "Akbar",
    mname: "Training Module",
    functionality: "Workshops/Training",
    summary: "Not working",
    severity: "4",
    escalate: "",
    response: "Resolved",
  },
  {
    id: "uid03",
    name: "Ticket 3",
    type: "General Information",
    createdate: "02/12/2020",
    status: "Resolved",
    createdby: "Antony",
    mname: "Training Module",
    functionality: "Workshops/Training",
    summary: "Not working",
    severity: "4",
    escalate: "",
    response: "Resolved",
  },
];

export default MyTicketsData;
