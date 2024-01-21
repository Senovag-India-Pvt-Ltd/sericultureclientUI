// import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

// import { MediaGroup, Media, MediaText, Image, Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem, Schedule } from "../../components";
import { Icon, CustomDropdownToggle, CustomDropdownMenu, LinkList, LinkListItem} from "../../components";

// categories table column
export const manufacturingOrderColumns = [
    {
        name: "so_number",
        selector: (row) => row.sno,
        cell: (row) => (
            <span>
            {row.sno}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "customer",
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
        name: "ref_number",
        selector: (row) => row.refNo,
        cell: (row) => (
            <span>
            {row.refNo}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "mo_number",
        selector: (row) => row.MONumber,
        cell: (row) => (
            <span>
            {row.MONumber}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "item",
        selector: (row) => row.itemsName,
        cell: (row) => (
            <span>
            {row.itemsName}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "item_code",
        selector: (row) => row.itemCode,
        cell: (row) => (
            <span>
            {row.itemCode}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "qty",
        selector: (row) => row.qty,
        cell: (row) => (
            <span>
            {row.qty}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "status",
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
        name: "schedule_start",
        selector: (row) => row.scheduleStart,
        cell: (row) => (
            <span>
            {row.scheduleStart}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "schedule_finish",
        selector: (row) => row.scheduleFinish,
        cell: (row) => (
            <span>
            {row.scheduleFinish}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "due_date",
        selector: (row) => row.dueDate,
        cell: (row) => (
            <span>
            {row.dueDate}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "actual_start",
        selector: (row) => row.actualStart,
        cell: (row) => (
            <span>
            {row.actualStart}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "actual_finish",
        selector: (row) => row.actualFinish,
        cell: (row) => (
            <span>
            {row.actualFinish}
            </span>
        ),
        sortable: true,
        hide: "md",
    },
    {
        name: "View BOM",
        selector: (row) => row.viewBOM,
        cell: (row) => (
            <span>
            {row.viewBOM}
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
export const manufacturingOrderData = [
    {
        id:'uid01',
        sno: 1,
        name: 'Suraj',
        refNo:'',
        MONumber: 'MO-00310',
        itemsName: "Aloo Bujiya",
        itemCode:'123AS',
        qty:35,
        status:'Scheduled',
        scheduleStart: '12/12/2020',
        scheduleFinish:'24/3/2021',
        dueDate:'',
        actualStart:'30/3/2021',
        actualFinish:'',
        viewBOM:'',
    },
    {
        id:'uid01',
        sno: 2,
        name: 'Alok',
        refNo:'',
        MONumber: 'MO-00380',
        itemsName: "Pakoda",
        itemCode:'123BS',
        qty:5,
        status:'Scheduled',
        scheduleStart: '25/12/2020',
        scheduleFinish:'30/3/2021',
        dueDate:'',
        actualStart:'3/4/2021',
        actualFinish:'',
        viewBOM:'',
    },
     {
        id:'uid01',
        sno: 1,
        name: 'Shamath',
        refNo:'',
        MONumber: 'MO-00340',
        itemsName: "Vada Pav",
        itemCode:'123CS',
        qty:6,
        status:'Scheduled',
        scheduleStart: '12/12/2020',
        scheduleFinish:'24/3/2021',
        dueDate:'',
        actualStart:'',
        actualFinish:'',
        viewBOM:'',
    },

    
];

