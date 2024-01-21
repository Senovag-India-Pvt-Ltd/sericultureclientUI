import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";


// K2StateShares column
export const K2StateSharesColumns = [
    {
        name: "id",
        selector: (row) => row.id,
        cell: (row) => (
            <span>{row.id}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Caste",
        selector: (row) => row.caste,
        cell: (row) => (
            <span>{row.caste}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Percentage",
        selector: (row) => row.percentage,
        cell: (row) => (
            <span>{row.percentage}</span>
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
const K2StateShares = [
    {
        id:'sid1',
        caste: '106(General)',
        percentage: '50%',
    },
    {
        id:'sid2',
        caste: '422(SC)',
        percentage: '65%',
    },
    {
        id:'sid3',
        caste: '423(ST)',
        percentage: '65%',
    },
];

export default K2StateShares;
