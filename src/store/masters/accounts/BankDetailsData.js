import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";


// company table column
export const bankDetailsColumns = [
    {
        name: "Bank Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>{row.name}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Account Name",
        selector: (row) => row.accName,
        cell: (row) => (
            <span>{row.accName}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Account Number",
        selector: (row) => row.accNumber,
        cell: (row) => (
            <span>{row.accNumber}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Branch",
        selector: (row) => row.branch,
        cell: (row) => (
            <span>{row.branch}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "IFSC",
        selector: (row) => row.ifsc,
        cell: (row) => (
            <span>{row.ifsc}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Address",
        selector: (row) => row.address,
        cell: (row) => (
            <span>{row.address}</span>
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
                                <LinkListItem to={`/masters/bank-details-view/${row.id}`}>
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
const bankDetails = [
    {
        id:'uid01',
        name:'SBI',
        accName:'Ram',
        accNumber:'5484789426462',
        address:'Opp to Taluk Office,Thirthahalli',
        branch:'Thirthahalli',
        ifsc:'SBIN0040142',
        state:'Karnataka',
        country:'India'
    },
    {
        id:'uid02',
        name:'Canara',
        accName:'Hanuman',
        accNumber:'53535353353535',
        address:'Near Gandhi Chowk,Thirthahalli ',
        branch:'Thirthahalli',
        ifsc:'CNRB0000571',
        state:'Karnataka',
        country:'India'
    },
];

export default bankDetails;
