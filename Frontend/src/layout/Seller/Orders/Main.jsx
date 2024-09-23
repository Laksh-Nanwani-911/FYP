import React, { useState } from 'react'
import DashboardLayout from '../DashboardLayout'
import Layout from './Layout'

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