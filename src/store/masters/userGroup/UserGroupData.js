import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import { MediaGroup, Media, MediaText, Image, Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";
import { toInitials } from "../../../utilities";

// user group table column
export const userGroupColumns = [
    {
        name: "User Group",
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
                    <Link to={`/masters/user-group-view/${row.id}`} className="title">{row.name}</Link>
                    {/* <span className="small text">{row.email}</span> */}
                </MediaText>
            </MediaGroup>
        ),
        sortable: true,
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
        name: "status",
        selector: (row) => row.status,
        cell: (row) => (
            <span className={`badge text-bg-${
                row.status === "Active" ? "success-soft" 
                : row.status === "Pending" ? "warning-soft" 
                : row.status === "Inactive" ? "secondary-soft" 
                : "primary-soft"}`
            }>
            {row.status ? row.status : 'General'}
            </span>
        ),
        sortable: true,
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
                                <LinkListItem to={`/masters/user-group-view/${row.id}`}>
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

// users group data
const userGroups = [
    {
        id:'uid01',
        name: 'Management',
        email: 'florenza@gmail.com',
        website: 'www.sevencrore.com',
        avatar: '/images/avatar/a.jpg',
        description: ` Management is how businesses organize and direct workflow`,
        role: 'Owner & Founder',
        plan: 'Basic',
        billing: 'Auto Debit',
        joining: '2022/04/25',
        status: 'Active',
        followers: '2574',
        following: '78',
        address: 'California, United States',
        company: 'Softnio',
        designation: 'Frontend Developer',
        skills: ['Photoshop','illustrator','HTML','CSS','Javascript','React','Vue','Angular','Python'],
    },
    {
        id:'uid02',
        name: 'Support',
        email: 'anna@gmail.com',
        website: 'www.sevencrore.com',
        avatar: '/images/avatar/b.jpg',
        description: `Technical support `,
        role: 'Subscriber',
        plan: 'Enterprise',
        billing: 'Manual - Paypal',
        joining: '2022/03/23',
        status: 'Active',
        followers: '143',
        following: '34',
        address: 'New York, United States',
        company: 'Softnio',
        designation: 'Frontend Developer',
        skills: ['Photoshop','illustrator','HTML','CSS','Javascript','React','Vue','Angular','Python'],
    },
];

export default userGroups;
