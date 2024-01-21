import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";


// service type table column
export const serviceTypeColumns = [
    {
        name: "Id",
        selector: (row) => row.id,
        cell: (row) => (
            <span>{row.id}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Service Type Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>{row.name}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Description",
        selector: (row) => row.description,
        cell: (row) => (
            <span>{row.description}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "action",
        cell: (row) => (
            <div className="text-end w-100">
                <Dropdown>
                    <Dropdown.Toggle size="sm" as={CustomDropdownToggle} className="btn btn-sm btn-icon btn-zoom me-n1">
                        <Icon name="more-v"></Icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-sm" as={CustomDropdownMenu} align="end">
                        <div className="dropdown-content py-1">
                            <LinkList className="link-list-hover-bg-primary link-list-md">
                                <LinkListItem to={`/user-manage/user-edit/${row.id}`}>
                                    <Icon name="edit"></Icon><span>Edit</span>
                                </LinkListItem>
                                <LinkListItem to={`/user-manage/user-edit/${row.id}`}>
                                    <Icon name="trash"></Icon><span>Delete</span>
                                </LinkListItem>
                                <LinkListItem to={`/masters/service-type-view/${row.id}`}>
                                    <Icon name="eye"></Icon><span>View Details</span>
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

// service type data
const sevicetypes = [
    {
        id:'sid1',
        name: 'Electronics',
        description: '',
    },
    {
        id:'sid2',
        name: 'Plumbing',
        description: '',
    },
    {
        id:'sid3',
        name: 'Mason Work',
        description: '',
    },
    {
        id:'sid4',
        name: 'Fabrication',
        description: '',
    },
    {
        id:'sid5',
        name: 'Painting',
        description: '',
    },
];

export default sevicetypes;
