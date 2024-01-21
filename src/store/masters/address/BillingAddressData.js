import { Dropdown } from "react-bootstrap";
import {  Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";


// company table column
export const billingAddressColumns = [
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
        name: "Pin",
        selector: (row) => row.pin,
        cell: (row) => (
            <span>{row.pin}</span>
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
                                <LinkListItem to={`/masters/billing-address-view/${row.id}`}>
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

// company data
const billingAddress = [
    {
        id:'uid01',
        name:'Soppugudde',
        address1:'Soppugudde',
        address2:'',
        pin:577432,
        city:'Thirthahalli',
        state:'Karnataka',
        country:'India'
    },
    {
        id:'uid02',
        name:'Sibinkere',
        address1:'Sibinkere',
        address2:'',
        pin:577432,
        city:'Thirthahalli',
        state:'Karnataka',
        country:'India'
    },
];

export default billingAddress;
