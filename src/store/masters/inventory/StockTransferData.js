import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";


// stock transfer table column
export const stockTransferColumns = [
    {
        name: "Transaction Id",
        selector: (row) => row.id,
        cell: (row) => (
            <span>{row.id}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Item Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>{row.name}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "From",
        selector: (row) => row.from,
        cell: (row) => (
            <span>{row.from}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "To",
        selector: (row) => row.to,
        cell: (row) => (
            <span>{row.to}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Quantity",
        selector: (row) => row.qty,
        cell: (row) => (
            <span>{row.qty}</span>
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
                                <LinkListItem to={`/masters/stock-transfer/${row.id}`}>
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

// stock transfer data
const stockTransfer = [
    {
        id: 'uid01',
        name: 'Item1',
        from: 'Store1',
        to: 'Store2',
        qty: 35,
    },
    {
        id: 'uid02',
        name: 'Item2',
        from: 'Store2',
        to: 'Store1',
        qty: 10,
    },
    {
        id:'uid03',
        name:'Item3',
        from:'Store2',
        to:'Store3',
        qty:7,
    },
];

export default stockTransfer;
