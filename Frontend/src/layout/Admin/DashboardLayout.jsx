import React from 'react'
import LeftNav from './LeftNav'

const DashboardLayout = ({ component,setShowSideNav,showSideNav }) => {

  return (

    <div className='flex items-start w-screen h-screen relative overflow-y-hidden overflow-x-auto'>

      <div className='h-[100%]'>
        <LeftNav showSideNav={showSideNav} setShowSideNav={setShowSideNav}/>
      </div>

      <div className='flex-1 h-[100%] overflow-x-auto'>
        {component}
      </div>

    </div>
  )
}

export default DashboardLayout
