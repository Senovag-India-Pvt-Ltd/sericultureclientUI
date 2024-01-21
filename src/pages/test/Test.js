import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable/DataTableErp';
import TestData, { testColumns } from '../../store/test/TestData';

function TestListPage() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [perPage, setPerPage] = useState(10)

    const columns = [
        {
            name: "User ID",
            selector: (row) => row.userId,
        },
        {
            name: "Title",
            selector: (row) => row.title,
        },
        {
            name: "Completed",
            selector: (row) => (row.completed ? "Yes" : "No"),
        },
    ]

    useEffect(() => {
        fetchTableData()
        console.log('hello')
    }, [])

    async function fetchTableData() {
        setLoading(true)
        const URL = "https://jsonplaceholder.typicode.com/todos"
        const response = await fetch(URL)

        const users = await response.json()

        // console.log(users)

        setData(prev => {
            // return [...prev, ...users]
            return [...users]
        })
        setLoading(false)
       
    }
    // console.log(data);
    return (
        <div style={{ margin: "20px" }}>
            <DataTable
                title="Data"
                columns={testColumns}
                data={TestData}
                progressPending={loading}
                pagination
            />
        </div>
    )




    // const [responseData, setResponseData] = useState([])
    // const [postData, setPostData] = useState([])


    // const [showModal, setShowModal] = useState(false);
    // // const [responseData, setResponseData] = useState('');

    // const handleShowModal = () => setShowModal(true);
    // const handleCloseModal = () => setShowModal(false);

    // async function fetchTableData() {
    //     // setLoading(true)
    //     const URL = "https://jsonplaceholder.typicode.com/posts"
    //     const response = await fetch(URL)

    //     const posts = await response.json()
    //     setPostData(posts)


    //     // setLoading(false)
    // }

    // useEffect(() => {
    //     fetchTableData()
    // }, [])

    // useEffect(() => {
    //     setResponseData(postData)
    //     console.log(responseData);
    // }, [postData])





    // // useEffect(() => {

    // //     const getData = async () => {
    // //         try {
    // //             // const response = await Axios.get("https://restcountries.com/v2/all")
    // //             const response = await Axios.get("https://jsonplaceholder.typicode.com/posts")
    // //             setResponseData([...response.data])
    // //             //// console.log(response.data)
    // //             console.log(responseData[3])

    // //         } catch (error) {
    // //             console.log(error)
    // //         }
    // //     }

    // //     getData();
    // // }, []);


    // // useEffect(() => {
    // //         Axios.get("https://jsonplaceholder.typicode.com/posts")
    // //             .then(res => {
    // //                 // setResponseData(res.data);
    // //                 setResponseData(test);
    // //                 // console.log(responseData)
    // //                 console.log(responseData)
    // //             })
    // //             .then( e => {
    // //                 // responseData.data.rows.map(data=>console.log(data))  
    // //             })
    // //             .catch(e => {
    // //                 console.log(e.message);
    // //             })
    // // }, [])

    // // useEffect(() => {
    //     // responseData.map(data=>console.log(data))
    // // }, [responseData]);

    // return (
    //     <Layout title="Users List" content="container">
    //         <Block.Head>
    //             <Block.HeadBetween>
    //                 <Block.HeadContent>
    //                     <Block.Title tag="h2">Users List</Block.Title>
    //                     <nav>
    //                         <ol className="breadcrumb breadcrumb-arrow mb-0">
    //                             <li className="breadcrumb-item"><Link to="/">Home</Link></li>
    //                             <li className="breadcrumb-item"><Link to="/user-manage/user-list">User Manage</Link></li>
    //                             <li className="breadcrumb-item active" aria-current="page">Users</li>
    //                         </ol>
    //                     </nav>
    //                 </Block.HeadContent>
    //                 <Block.HeadContent>
    //                     <ul className="d-flex">
    //                         <li>
    //                             <Button className="d-md-none" size="md" variant="primary" onClick={handleShowModal}>
    //                                 <Icon name="plus" />
    //                                 <span>Add</span>
    //                             </Button>
    //                         </li>
    //                         <li>
    //                             <Button className="d-none d-md-inline-flex" variant="primary" onClick={handleShowModal}>
    //                                 <Icon name="plus" />
    //                                 <span>Add User</span>
    //                             </Button>
    //                         </li>
    //                     </ul>
    //                 </Block.HeadContent>
    //             </Block.HeadBetween>
    //         </Block.Head>

    //         <Block>
    //             <Card>
    //                 <DataTable tableClassName="data-table-head-light table-responsive" data={responseData} columns={testColumns} />
    //             </Card>
    //         </Block>

    //         <Modal show={showModal} onHide={handleCloseModal}>
    //             <Modal.Header closeButton>
    //                 <Modal.Title>Add User</Modal.Title>
    //             </Modal.Header>
    //             <Modal.Body>
    //                 <Form action="#">
    //                     <Row className="g-3">
    //                         <Col lg="6">
    //                             <Form.Group className="form-group">
    //                                 <Form.Label htmlFor="firstname">First Name</Form.Label>
    //                                 <div className="form-control-wrap">
    //                                     <Form.Control id="firstname" type="text" placeholder="First name" />
    //                                 </div>
    //                             </Form.Group>
    //                         </Col>
    //                         <Col lg="6">
    //                             <Form.Group className="form-group">
    //                                 <Form.Label htmlFor="lastname">Last Name</Form.Label>
    //                                 <div className="form-control-wrap">
    //                                     <Form.Control id="lastname" type="text" placeholder="Last name" />
    //                                 </div>
    //                             </Form.Group>
    //                         </Col>
    //                         <Col lg="6">
    //                             <Form.Group className="form-group">
    //                                 <Form.Label htmlFor="email">Email Address</Form.Label>
    //                                 <div className="form-control-wrap">
    //                                     <Form.Control id="email" type="text" placeholder="Email address" />
    //                                 </div>
    //                             </Form.Group>
    //                         </Col>
    //                         <Col lg="6">
    //                             <Form.Group className="form-group">
    //                                 <Form.Label>Status</Form.Label>
    //                                 <div className="form-control-wrap">
    //                                     <Select removeItemButton>
    //                                         <option value="">Select a status</option>
    //                                         <option value="1">Pending</option>
    //                                         <option value="2">Active</option>
    //                                         <option value="3">Inactive</option>
    //                                     </Select>
    //                                 </div>
    //                             </Form.Group>
    //                         </Col>
    //                         <Col lg="12">
    //                             <Form.Group className="form-group">
    //                                 <Form.Label>Role</Form.Label>
    //                                 <div className="form-control-wrap">
    //                                     <Select removeItemButton>
    //                                         <option value="">Select a role</option>
    //                                         <option value="1">Administrator</option>
    //                                         <option value="2">Developer</option>
    //                                         <option value="3">Analyst</option>
    //                                         <option value="4">Support</option>
    //                                         <option value="5">Trial</option>
    //                                     </Select>
    //                                 </div>
    //                             </Form.Group>
    //                         </Col>
    //                         <Col lg="12">
    //                             <Form.Group className="form-group">
    //                                 <Form.Label>User Group</Form.Label>
    //                                 <div className="form-control-wrap">
    //                                     <Select removeItemButton>
    //                                         <option value="">Select a user group</option>
    //                                         <option value="1">Group-1</option>
    //                                         <option value="2">Group-2</option>
    //                                         <option value="3">Group-3</option>
    //                                         <option value="4">Group-4</option>
    //                                         <option value="5">Group-5</option>
    //                                     </Select>
    //                                 </div>
    //                             </Form.Group>
    //                         </Col>
    //                         <Col lg="12">
    //                             <div className="d-flex gap g-2">
    //                                 <div className="gap-col">
    //                                     <Button variant="primary" onClick={handleCloseModal}>Add User</Button>
    //                                 </div>
    //                                 <div className="gap-col">
    //                                     <button type="button" className="border-0 btn" onClick={handleCloseModal}>Discard</button>
    //                                 </div>
    //                             </div>
    //                         </Col>
    //                     </Row>
    //                 </Form>
    //             </Modal.Body>
    //         </Modal>

    //     </Layout>
    // )
}

export default TestListPage;