import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";


// item table column
export const iventoryHistoryColumns = [
    {
        name: "Date",
        selector: (row) => row.date,
        cell: (row) => (
            <span>{row.date}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Item ID",
        selector: (row) => row.id,
        cell: (row) => (
            <span>{row.id}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>{row.name}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Transacted By",
        selector: (row) => row.transactedby,
        cell: (row) => (
            <span>{row.transactedby}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Transaction Id",
        selector: (row) => row.trasactionid,
        cell: (row) => (
            <span>{row.trasactionid}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Previous Quantity",
        selector: (row) => row.prevqty,
        cell: (row) => (
            <span>{row.prevqty}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Change Quantity",
        selector: (row) => row.changeqty,
        cell: (row) => (
            <span>{row.changeqty}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "New Quantity",
        selector: (row) => row.newqty,
        cell: (row) => (
            <span>{row.newqty}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Price",
        selector: (row) => row.price,
        cell: (row) => (
            <span>{row.price}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "User",
        selector: (row) => row.user,
        cell: (row) => (
            <span>{row.user}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Store",
        selector: (row) => row.store,
        cell: (row) => (
            <span>{row.store}</span>
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
                                <LinkListItem to={`/masters/item-view/${row.id}`}>
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
const inventoryHistory = [
    {
        id: 'uid01',
        date: '20/12/22',
        name: 'Screw',
        transactedby: 'Messi',
        trasactionid: '52545',
        prevqty: 250,
        changeqty: 245,
        newqty: 20,
        price: 15,
        user: 'Ronaldo',
        store: 'Lemo',
    },
    {
        id: 'uid02',
        date: '21/12/22',
        name: 'Bolt',
        transactedby: 'Levondoski',
        trasactionid: '52545',
        prevqty: 250,
        changeqty: 245,
        newqty: 20,
        price: 15,
        user: 'Mbappe',
        store: 'Gappo',
    },
    {
        id: 'uid01',
        date: '20/12/22',
        name: 'Screw',
        transactedby: 'Neymer',
        trasactionid: '52545',
        prevqty: 250,
        changeqty: 245,
        newqty: 20,
        price: 15,
        user: 'Ronaldino',
        store: 'Lorenca',
    },
];

export default inventoryHistory;
