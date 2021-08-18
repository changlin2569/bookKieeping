import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom'
import routes from './router'
import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import 'zarm/dist/zarm.css'
import NavBar from './components/NavBar'

function App() {
  const [showNav, setShowNav] = useState(false)
  const location = useLocation()
  const { pathname } = location
  const showNavPath = ['/', '/data', '/user']
  useEffect(() => {
    setShowNav(showNavPath.includes(pathname))
  }, [pathname])
  return <>
    <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
    <Switch>
      {
        routes.map(item => <Route exact path={item.path} key={item.path}>
          <item.component></item.component>
        </Route>)
      }
    </Switch>
    </ConfigProvider>
    <NavBar showNav={showNav}></NavBar>
  </>
}

export default App