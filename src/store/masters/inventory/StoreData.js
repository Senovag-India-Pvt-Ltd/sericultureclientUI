import { Dropdown } from "react-bootstrap";
import {  Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";


// company table column
export const storeColumns = [
    {
        name: "Store Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>{row.name}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Address1",
        selector: (row) => row.address1,
        cell: (row) => (
            <span>{row.address1}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Address2",
        selector: (row) => row.address2,
        cell: (row) => (
            <span>{row.address2}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "City",
        selector: (row) => row.city,
        cell: (row) => (
            <span>{row.city}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "State",
        selector: (row) => row.state,
        cell: (row) => (
            <span>{row.state}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Country",
        selector: (row) => row.country,
        cell: (row) => (
            <span>{row.country}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Pin",
        selector: (row) => row.pin,
        cell: (row) => (
            <span>{row.pin}</span>
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
                                <LinkListItem to={`/masters/stores-view/${row.id}`}>
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

// stores data
const stores = [
    {
        id:'uid01',
        name:'Sri Ram Stores',
        address1:'Soppugudde',
        address2:'',
        pin:577432,
        city:'Thirthahalli',
        state:'Karnataka',
        country:'India'
    },
    {
        id:'uid02',
        name:'Hanuman Stores',
        address1:'Sibinkere',
        address2:'',
        pin:577432,
        city:'Thirthahalli',
        state:'Karnataka',
        country:'India'
    },
];

export default stores;
