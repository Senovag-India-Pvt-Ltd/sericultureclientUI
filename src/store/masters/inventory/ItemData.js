import { Dropdown } from "react-bootstrap";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../../components";


// item table column
export const itemColumns = [
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
        name: "Item Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>{row.name}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Item Category",
        selector: (row) => row.itemCategory,
        cell: (row) => (
            <span>{row.itemCategory}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Current Stock",
        selector: (row) => row.currentStock,
        cell: (row) => (
            <span>{row.currentStock}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Minimum Stock",
        selector: (row) => row.minStock,
        cell: (row) => (
            <span>{row.minStock}</span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Maximum Stock",
        selector: (row) => row.maxStock,
        cell: (row) => (
            <span>{row.maxStock}</span>
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
const item = [
    {
        id: 'uid01',
        name: 'Screw',
        pors: '',
        borsorb: '',
        uom: '',
        itemCategory: 'Hardware',
        currentStock: 250,
        minStock:20,
        maxStock:500,
        price: 15,
        hsnCode: '',
        tax: '',
    },
    {
        id: 'uid02',
        name: 'Bolt',
        pors: '',
        borsorb: '',
        uom: '',
        itemCategory: 'Hardware',
        currentStock: 300,
        minStock:30,
        maxStock:600,
        price: 25,
        hsnCode: '',
        tax: '',
    },
    {
        id: 'uid03',
        name: 'Screw-Driver',
        pors: '',
        borsorb: '',
        uom: '',
        itemCategory: 'Hardware',
        currentStock: 100,
        minStock:10,
        maxStock:300,
        price: 25,
        hsnCode: '',
        tax: '',
    },
];

export default item;
