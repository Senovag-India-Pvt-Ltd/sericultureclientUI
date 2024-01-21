import React from 'react'
import Layout from '../../layout/default';

import Icon from "../../components/Icon/Icon";



function SettingsDashboard() {
  return (
    <Layout title='Settings Dashboard' content='container'>
      {/* <div>SettingsDashboard</div> */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '200px' }}>
          <Icon name="setting"></Icon>
        </div>
        <h1>Settings</h1>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
          molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
          numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium</div>

      </div>
    </Layout>
  )
}

export default SettingsDashboard