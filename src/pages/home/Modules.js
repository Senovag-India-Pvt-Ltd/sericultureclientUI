// import { Block, PreviewIcon } from '../../components';
import { useState, useEffect } from 'react';
import { Block } from '../../components';
import MyPreviewIcon from '../../components/PreviewIcon/MyPreviewIcon';
// import Layout from '../../layout/default';
import Layout from '../../layout/default/layoutNoSidebar';
import {modulesData, crmModulesData, accountsModulesData} from '../../store/module/ModuleData.js';


function Modules(){
    // set ModuleData to state
    const [moduleRows, setModuleRows] = useState([]);

    useEffect(() => {
        if(localStorage.getItem('role') === 'admin') {
            setModuleRows(modulesData)
        }else if(localStorage.getItem('role') === 'crm') {
            setModuleRows(crmModulesData)
        }else if(localStorage.getItem('role') === 'account') {
            setModuleRows(accountsModulesData)
        }
    },[]);

    return(
        <Layout title="Module" content="container">
            <div>
                <Block.Head page>
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
                </Block>

                <Block>
                    <MyPreviewIcon.List>
                        {moduleRows.map((icon) => 
                            <MyPreviewIcon icon={icon.icon} title={icon.name} key={icon.icon} link={icon.link} menu={icon.menu}/>
                        )}
                    </MyPreviewIcon.List>
                </Block>
            </div>
        </Layout>

    )
}

export default Modules;