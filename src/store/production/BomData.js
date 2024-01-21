// import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

// import { MediaGroup, Media, MediaText, Image, Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem, Schedule } from "../../components";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem } from "../../components";

// categories table column
export const bomColumns = [
    {
        name: "BoM ID",
        selector: (row) => row.id,
        cell: (row) => (
            <span>
                {row.id}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "BoM Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>
                {row.name}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => (
            <span>
                {row.status}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Finished Good Name",
        selector: (row) => row.fgName,
        cell: (row) => (
            <span>
                {row.fgName}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Number of Raw Material",
        selector: (row) => row.numOfrm,
        cell: (row) => (
            <span>
                {row.numOfrm}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Created By",
        selector: (row) => row.createdby,
        cell: (row) => (
            <span>
                {row.createdby}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Created On",
        selector: (row) => row.createdon,
        cell: (row) => (
            <span>
                {row.createdon}
            </span>
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
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="edit"></Icon><span>Edit</span>
                                </LinkListItem>
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="trash"></Icon><span>Delete</span>
                                </LinkListItem>
                                <LinkListItem to={`/production/billing-of-material-view/${row.id}`}>
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


export const fgColumns = [
    {
        name: "ID",
        selector: (row) => row.id,
        cell: (row) => (
            <span>
                {row.id}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>
                {row.name}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Category",
        selector: (row) => row.category,
        cell: (row) => (
            <span>
                {row.category}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Quantity",
        selector: (row) => row.quantity,
        cell: (row) => (
            <span>
                {row.quantity}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Unit Of Measurement",
        selector: (row) => row.uom,
        cell: (row) => (
            <span>
                {row.uom}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Comment",
        selector: (row) => row.comment,
        cell: (row) => (
            <span>
                {row.comment}
            </span>
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
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="edit"></Icon><span>Edit</span>
                                </LinkListItem>
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="trash"></Icon><span>Delete</span>
                                </LinkListItem>
                                <LinkListItem to={`/production/billing-of-material-view/${row.id}`}>
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

export const rmColumns = [
    {
        name: "ID",
        selector: (row) => row.id,
        cell: (row) => (
            <span>
                {row.id}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>
                {row.name}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Category",
        selector: (row) => row.category,
        cell: (row) => (
            <span>
                {row.category}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Quantity",
        selector: (row) => row.quantity,
        cell: (row) => (
            <span>
                {row.quantity}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Unit Of Measurement",
        selector: (row) => row.uom,
        cell: (row) => (
            <span>
                {row.uom}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Comment",
        selector: (row) => row.comment,
        cell: (row) => (
            <span>
                {row.comment}
            </span>
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
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="edit"></Icon><span>Edit</span>
                                </LinkListItem>
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="trash"></Icon><span>Delete</span>
                                </LinkListItem>
                                <LinkListItem to={`/production/billing-of-material-view/${row.id}`}>
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

export const scrapColumns = [
    {
        name: "ID",
        selector: (row) => row.id,
        cell: (row) => (
            <span>
                {row.id}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>
                {row.name}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Category",
        selector: (row) => row.category,
        cell: (row) => (
            <span>
                {row.category}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Quantity",
        selector: (row) => row.quantity,
        cell: (row) => (
            <span>
                {row.quantity}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Unit Of Measurement",
        selector: (row) => row.uom,
        cell: (row) => (
            <span>
                {row.uom}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Comment",
        selector: (row) => row.comment,
        cell: (row) => (
            <span>
                {row.comment}
            </span>
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
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="edit"></Icon><span>Edit</span>
                                </LinkListItem>
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="trash"></Icon><span>Delete</span>
                                </LinkListItem>
                                <LinkListItem to={`/production/billing-of-material-view/${row.id}`}>
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


export const otherChargesColumns = [
    {
        name: "ID",
        selector: (row) => row.id,
        cell: (row) => (
            <span>
                {row.id}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        cell: (row) => (
            <span>
                {row.name}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Amount",
        selector: (row) => row.amount,
        cell: (row) => (
            <span>
                {row.amount}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "Description",
        selector: (row) => row.description,
        cell: (row) => (
            <span>
                {row.description}
            </span>
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
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="edit"></Icon><span>Edit</span>
                                </LinkListItem>
                                <LinkListItem to={`/ecommerce/edit-category/${row.id}`}>
                                    <Icon name="trash"></Icon><span>Delete</span>
                                </LinkListItem>
                                <LinkListItem to={`/production/billing-of-material-view/${row.id}`}>
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





// categories data
export const boms = [
    {
        id: 'uid01',
        name: 'Dummy1',
        status: 'Published',
        fgName: 'Finished Goods',
        numOfrm: 18,
        createdby: 'ram',
        createdon: '1/1/2020'
    },
    {
        id: 'uid02',
        name: 'Dummy2',
        status: 'Unpublished',
        fgName: 'Finished Goods',
        numOfrm: 10,
        createdby: 'Maruthi',
        createdon: '11/1/2020'
    },
    {
        id:'uid03',
        name:'Dummy3',
        status:'Published',
        fgName:'Finished Goods',
        numOfrm:20,
        createdby:'Lax',
        createdon:'12/1/2020'
    },
];

export const fgdata = [
    {
        id: 'uid01',
        name: 'Hammer',
        category: 'Hardware',
        quantity: 58,
        uom: 'kilogram',
        comment: ''
    },
    {
        id: 'uid02',
        name: 'axe',
        category: 'Hardware',
        quantity: 88,
        uom: 'kilogram',
        comment: ''
    },
    {
        id: 'uid03',
        name: 'Nail',
        category: 'Hardware',
        quantity: 5000,
        uom: 'gram',
        comment: ''
    },
];

export const rmdata = [
    {
        id: 'uid01',
        name: 'Iron',
        category: 'Raw Material',
        quantity: 5,
        uom: 'Ton',
        comment: ''
    },
    {
        id: 'uid02',
        name: 'Wood',
        category: 'Raw Material',
        quantity: 88,
        uom: 'kilogram',
        comment: ''
    },
    {
        id: 'uid03',
        name: 'Coal',
        category: 'Raw Material',
        quantity: 8,
        uom: 'ton',
        comment: 'Required For Forging'
    }
];

export const scrapdata = [
    {
        id: 'uid01',
        name: 'Hammer',
        category: 'Rejected',
        quantity: 5,
        uom: 'kilogram',
        comment: 'Quality issue'
    },
    {
        id: 'uid02',
        name: 'Wood',
        category: 'Scrap',
        quantity: 8,
        uom: 'kilogram',
        comment: 'Wooden pieces'
    },
];

export const otherChargesdata = [
    {
        id: 'uid01',
        name: 'Labour Charges',
        amount:1000,
        description: ''
    },
    {
        id: 'uid02',
        name: 'Machinery Charges',
        amount:10000,
        description: ''
    },
    {
        id: 'uid03',
        name: 'Electricity Charges',
        amount:5000,
        description: ''
    },
];

