import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { TabBar } from 'zarm'
import s from './style.module.less'
import CustomIcon from './../CustomIcon'

const NavBar = ({ showNav }) => {
    const [activeKey, setActiveKey] = useState(useLocation().pathname)
    const history = useHistory()

    const changeTab = path => {
        setActiveKey(path)
        history.push(path)
    }
    return (
        <TabBar visible={showNav} className={s.tab} activeKey={activeKey} onChange={changeTab}>
            <TabBar.Item itemKey='/' title='账单' icon={<CustomIcon type='zhangdan'></CustomIcon>} />
            <TabBar.Item itemKey='/data' title='统计' icon={<CustomIcon type='tongji'></CustomIcon>} />
            <TabBar.Item itemKey='/user' title='我的' icon={<CustomIcon type='wode'></CustomIcon>} />
        </TabBar>
    )
}

NavBar.propTypes = {
    showNav: PropTypes.bool
}

export default NavBar
