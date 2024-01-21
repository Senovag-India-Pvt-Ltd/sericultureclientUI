import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../components";


// item table column
export const leadColumns = [
    {
        name: "Lead Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>{row.name}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => (
            <span>{row.status}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Company Name",
        selector: (row) => row.compname,
        cell: (row) => (
            <span>{row.compname}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Assign To",
        selector: (row) => row.assignTo,
        cell: (row) => (
            <span>{row.assignTo}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Created On",
        selector: (row) => row.createdon,
        cell: (row) => (
            <span>{row.createdon}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Created By",
        selector: (row) => row.createdby,
        cell: (row) => (
            <span>{row.createdby}</span>
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
                                <LinkListItem to={`/crm/add-task`}>
                                    <Icon name="task"></Icon><span>Add Task</span>
                                </LinkListItem>
                                <LinkListItem to={`/crm/lead-view/${row.id}`}>
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

// leads data
const leads = [
    {
        id: 'uid01',
        name: 'Ram',
        status:'New',
        compname:'Ayodhya Pvt Ltd',
        assignTo:'Siya',
        createdon:'18/12/2020',
        createdby:'Dasharath'
    },
    {
        id: 'uid02',
        name: 'Lax',
        status:'Assigned',
        compname:'Ayodhya Pvt Ltd',
        assignTo:'Urmila',
        createdon:'13/05/2020',
        createdby:'Dasharath'
    },
    {
        id: 'uid03',
        name: 'Maruthi',
        status:'Inprocess',
        compname:'Anjanadri Pvt Ltd',
        assignTo:'Suvarchala',
        createdon:'27/06/2020',
        createdby:'Kesari'
    },
];

export default leads;
