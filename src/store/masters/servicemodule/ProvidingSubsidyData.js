import { Dropdown, Form } from "react-bootstrap";
import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
  LinkList,
  LinkListItem,
} from "../../../components";


//ProvidingSubsidy column
export const ProvidingSubsidyColumns = [
  {
    name: "Select",
    selector: (row) => row.id,
    cell: (row) => (
      <span>
        <Form.Check type="checkbox" id="flexCheckDefault" />
      </span>
    ),
    sortable: false,
    hide: "md",
  },
  {
    name: "District",
    selector: (row) => row.district,
    cell: (row) => <span>{row.district}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Taluk",
    selector: (row) => row.taluk,
    cell: (row) => <span>{row.taluk}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Hobli",
    selector: (row) => row.hobli,
    cell: (row) => <span>{row.hobli}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Village",
    selector: (row) => row.village,
    cell: (row) => <span>{row.village}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Survey No.",
    selector: (row) => row.surveyno,
    cell: (row) => <span>{row.surveyno}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Hissa No",
    selector: (row) => row.hissa,
    cell: (row) => <span>{row.hissa}</span>,
    sortable: true,
    hide: "md",
  },
  {
    name: "Land Owership",
    selector: (row) => row.landownership,
    cell: (row) => <span>{row.landownership}</span>,
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
                <LinkListItem to={`/user-manage/user-edit/${row.id}`}>
                  <Icon name="trash"></Icon>
                  <span>Delete</span>
                </LinkListItem>
                <LinkListItem to={`/masters/service-type-view/${row.id}`}>
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

// ProvidingSubsidy data
const ProvidingSubsidyData = [
  {
    id: "sid1",
    district: "Shivamoga",
    taluk: "Thirthahalli",
    hobli: "Hodla/Aralapura",
    village: "Hodla",
    hissa:"01",
    landownership:"Own",
    surveyno:"258",
  },
  {
    id: "sid2",
    district: "Shivamoga",
    taluk: "Thirthahalli",
    hobli: "Hodla/Aralapura",
    village: "Hodla",
    hissa:"02",
    landownership:"Joint",
    surveyno:"257",
  },
  {
    id: "sid3",
    district: "Shivamoga",
    taluk: "Thirthahalli",
    hobli: "Hodla/Aralapura",
    village: "Hodla",
    hissa:"03",
    landownership:"Lease",
    surveyno:"254",
  },
];

export default ProvidingSubsidyData;
