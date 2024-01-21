// import { Block, PreviewIcon } from '../../components';
import { useState, useEffect } from 'react';
import { Block } from '../../components';
import CardsLoop from '../../components/PreviewIcon/CardsLoop';
// import Layout from '../../layout/default';
import Layout from '../../layout/default/layoutNoSidebar';
import RequestData from '../../store/request/RequestData';


function TechnicianRequestList(){
    // set ModuleData to state
    const [technicianRequestRows, setTechnicianRequestRows] = useState([]);

    useEffect(() => {
        setTechnicianRequestRows(RequestData);
        // if(localStorage.getItem('role') === 'admin') {
        //     setModuleRows(modulesData)
        // }else if(localStorage.getItem('role') === 'crm') {
        //     setModuleRows(crmModulesData)
        // }else if(localStorage.getItem('role') === 'account') {
        //     setModuleRows(accountsModulesData)
        // }
    },[]);

    return(
        <Layout title="Technician Request List" content="container">
            <div>
                {/* <Block.Head page>
                    <Block.HeadContent>
                        <Block.Title>Welcome To ERP</Block.Title>
                        <Block.Text className="lead">Please Select Below Modules to Explore...</Block.Text>
                    </Block.HeadContent>
                </Block.Head>
                <Block>
                <div className="data-table-search">
                    <input 
                        className="form-control" 
                        placeholder="Search" 
                        type="text" 
                        // onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                </Block> */}

                <Block>
                    <CardsLoop.List>
                        {technicianRequestRows.map((request) => 
                            <CardsLoop id={request.id} reqby={request.reqby} status={request.status} reqon={request.reqon} address={request.address} mbno={request.mbno} key={request.id} description={request.description} servicetype={request.servicetype}/>
                        )}
                    </CardsLoop.List>
                </Block>
            </div>
        </Layout>

    )
}

export default TechnicianRequestList;