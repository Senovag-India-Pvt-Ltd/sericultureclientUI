import { Dropdown } from "react-bootstrap";

import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
  LinkList,
  LinkListItem,
} from "../../components";
// import { toInitials } from "../../../utilities";

// company table column
export const requestColumns = [
  {
    name: "Request No",
    selector: (row) => row.id,
    cell: (row) => <span>{row.id}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Requested By",
    selector: (row) => row.reqby,
    cell: (row) => <span>{row.reqby}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Requested On",
    selector: (row) => row.reqon,
    cell: (row) => <span>{row.reqon}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Address",
    selector: (row) => row.address,
    cell: (row) => <span>{row.address}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Mobile Number",
    selector: (row) => row.mbno,
    cell: (row) => <span>{row.mbno}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Description",
    selector: (row) => row.description,
    cell: (row) => <span>{row.description}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Service Type",
    selector: (row) => row.servicetype,
    cell: (row) => <span>{row.servicetype}</span>,
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
                <LinkListItem to={`/user-manage/user-edit/${row.id}`}>
                  <Icon name="edit"></Icon>
                  <span>Edit</span>
                </LinkListItem>
                <LinkListItem to={`/assign-request-tech`}>
                  <Icon name="link-group"></Icon>
                  <span>Assign</span>
                </LinkListItem>
                <LinkListItem to={`/assign-request-tech`}>
                  <Icon name="minus"></Icon>
                  <span>Close Request</span>
                </LinkListItem>
                <LinkListItem to={`/user-manage/user-edit/${row.id}`}>
                  <Icon name="trash"></Icon>
                  <span>Delete</span>
                </LinkListItem>
                <LinkListItem to={`/request-view/${row.id}`}>
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

//  request data
const request = [
  {
    id: "rid01",
    reqby: "Customer1",
    address: "address1",
    mbno: 987654321,
    reqon: "22/03/2023",
    description: "Washing Machine is not working",
    servicetype: "Electronics",
    status: "Opened",
  },
  {
    id: "rid02",
    reqby: "Customer2",
    address: "address2",
    mbno: 987354321,
    reqon: "24/03/2023",
    description: "Leakage of tap water",
    servicetype: "Plumbing",
    status: "Assigned",
  },
  {
    id: "rid03",
    reqby: "Customer3",
    address: "address3",
    mbno: 987653321,
    reqon: "25/03/2023",
    description: "Compound construction ",
    servicetype: "Mason work",
    status: "Under-Progress",
  },
  {
    id: "rid04",
    reqby: "Customer4",
    address: "address4",
    mbno: 987353321,
    reqon: "26/03/2023",
    description: "TV repair",
    servicetype: "Electronics",
    status: "Closed",
  },
  {
    id: "rid05",
    reqby: "Customer5",
    address: "address5",
    mbno: 983353321,
    reqon: "27/03/2023",
    description: "Leakage of tap water",
    servicetype: "Plumbing",
    status: "Under-Progress",
  },
  {
    id: "rid06",
    reqby: "Customer6",
    address: "address6",
    mbno: 933353331,
    reqon: "28/03/2023",
    description: "Compound construction",
    servicetype: "Mason work",
    status: "Opened",
  },
];

export default request;
