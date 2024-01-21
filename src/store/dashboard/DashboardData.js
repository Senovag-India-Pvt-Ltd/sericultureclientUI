import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import { MediaGroup, Media, MediaText, Image, Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../components";
import { toInitials } from "../../utilities";

// user table column
export const crmUserColumns = [
    {
        name: "Employee Name",
        grow: 2,
        selector: (row) => row.name,
        cell: (row) => (
            <MediaGroup>
                <Media size="md" shape="circle" variant={row.theme && row.theme}>
                { row.avatar ? 
                    <Image src={row.avatar} staticImage/> :
                    <span className="smaller fw-medium">{toInitials(row.name)}</span>
                }
                </Media>
                <MediaText>
                    <Link to={`/user-manage/user-profile/${row.id}`} className="title">{row.name}</Link>
                    <span className="small text">{row.email}</span>
                </MediaText>
            </MediaGroup>
        ),
        sortable: true,
    },
    {
        name: "Follow Up",
        selector: (row) => row.followUp,
        cell: (row) => (
            <span>{row.followUp}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Meeting",
        selector: (row) => row.meeting,
        cell: (row) => (
            <span>{row.meeting}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Sale",
        selector: (row) => row.sale,
        cell: (row) => (
            <span>{row.sale}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Invoice",
        selector: (row) => row.invoice,
        cell: (row) => (
            <span>{row.invoice}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Total",
        selector: (row) => row.total,
        cell: (row) => (
            <span>{row.total}</span>
        ),
        // sortable: true,
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
                                <LinkListItem to={`/user-manage/user-profile/${row.id}`}>
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

// users data
const crmUsers = [
    {
        id:'uid01',
        name: 'John Doe',
        email: 'florenza@gmail.com',
        followUp:20,
        meeting:10,
        sale:10,
        invoice:10,
        total: 50,
        theme:'danger-soft'
    },
    {
        id:'uid02',
        name: 'Ram',
        email: 'ram@gmail.com',
        followUp:20,
        meeting:10,
        sale:10,
        invoice:10,
        total: 50,
        avatar:'/images/avatar/a.jpg'
    },
    {
        id:'uid03',
        name: 'Maruthi',
        email: 'Maruthi@gmail.com',
        followUp:30,
        meeting:30,
        sale:30,
        invoice:30,
        total: 120
    },
    {
        id:'uid04',
        name: 'Lakshman',
        email: 'Lakshaman@gmail.com',
        followUp:20,
        meeting:30,
        sale:10,
        invoice:20,
        total: 80
    },
];

export default crmUsers;