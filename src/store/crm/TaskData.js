import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../components";


// task table column
export const taskColumns = [
    {
        name: "Lead Name",
        selector: (row) => row.lname,
        cell: (row) => (
            <span>{row.lname}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Type",
        selector: (row) => row.type,
        cell: (row) => (
            <span>{row.type}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Task Name",
        selector: (row) => row.tname,
        cell: (row) => (
            <span>{row.tname}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Start Time",
        selector: (row) => row.starttime,
        cell: (row) => (
            <span>{row.starttime}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "End Time",
        selector: (row) => row.endtime,
        cell: (row) => (
            <span>{row.endtime}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Assign To",
        selector: (row) => row.assignto,
        cell: (row) => (
            <span>{row.assignto}</span>
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
                                <LinkListItem to={`/crm/task-view/${row.id}`}>
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

// tasks data
const tasks = [
    {
        id: 'uid01',
        lname: 'Ram',
        tname:'task1',
        type:'Call',
        starttime:'23/7/2022  9.00AM',
        endtime:'23/7/2023 6.00PM',
        description:'',
        assignto:'Siya',
        status:'Inprogress'
    },
    {
        id: 'uid02',
        lname: 'Lax',
        tname:'task2',
        type:'Email',
        starttime:'17/7/2022  9.00AM',
        endtime:'18/7/2023 6.00PM',
        description:'',
        assignto:'Urmila',
        status:'Closed'
    },
    {
        id: 'uid03',
        lname: 'Maruthi',
        tname:'task3',
        type:'Website Visit',
        starttime:'27/6/2022  9.00AM',
        endtime:'5/7/2023 6.00AM',
        description:'',
        assignto:'Suvarchala',
        status:'Open'
    },
   
];

export default tasks;
