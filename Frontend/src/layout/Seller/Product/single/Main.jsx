import React, { useState } from 'react'
import Layout from './Layout'
import DashboardLayout from '../../DashboardLayout'

const Main = () => {

  const [showSideNav, setShowSideNav] = useState(false)

  return (

    <div>

      <DashboardLayout showSideNav={showSideNav} setShowSideNav={setShowSideNav}
        component={<Layout showSideNav={showSideNav} setShowSideNav={setShowSideNav} />}
      />

    </div>
  )
}

export default Main