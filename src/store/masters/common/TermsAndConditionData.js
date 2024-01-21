// import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

// import { MediaGroup, Media, MediaText, Image, Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";
import {Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";
// import { toInitials } from "../../../utilities";

// company table column
export const termsAndConditionsColumns = [
    {
        name: "Term and Condition",
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
                                <LinkListItem to={`/masters/terms-and-conditions-view/${row.id}`}>
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

// terms-and-condition data
const termsAndConditions = [
    {
        id:'uid01',
        name:'Term&Condition1',
        description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia',
    },
    {
        id:'uid02',
        name:'Term&Condition2',
        description:' Quo neque error repudiandae fuga? Ipsa laudantium molestias eos ',
    },
];

export default termsAndConditions;
