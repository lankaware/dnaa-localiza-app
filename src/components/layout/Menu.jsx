import React from "react"
import { Link } from "react-router-dom"
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar'

import HomeIcon from '@mui/icons-material/Home'
// import ListAltIcon from '@mui/icons-material/ListAlt'
// import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SettingsIcon from '@mui/icons-material/Settings'

import 'react-pro-sidebar/dist/css/styles.css'

const AppMenu = (props) => {

    // const [menuCollapse, setMenuCollapse] = useState(false)
    return (
        <div>
            <ProSidebar className='menu'
                collapsed={props.collapseMenu}
                width={200}
            // image={'../../../public/BackgroundImageMenu.jpg'}
            >
                <SidebarHeader>
                </SidebarHeader>
                <Menu iconShape='circle'>
                    <MenuItem icon={<HomeIcon />}>
                        Início
                        <Link to='/' />
                    </MenuItem>
                    <SubMenu title='Adm Contas' icon={<SettingsIcon />}>
                        <MenuItem> Clientes
                            <Link to='/customerList' />
                        </MenuItem>
                    </SubMenu>
                    <SubMenu title='Configurações' icon={<SettingsIcon />}>
                        <MenuItem> Logins
                            <Link to='/login' />
                        </MenuItem>
                        <MenuItem> Ferramentas
                            <Link to='/tools' />
                        </MenuItem>
                        <MenuItem> Questionários
                            <Link to='/quizzes' />
                        </MenuItem>
                    </SubMenu>
                </Menu>

                <SidebarContent>
                    {/**  You can add the content of the sidebar ex: menu, profile details, ... */}
                </SidebarContent>
                <SidebarFooter>
                    Direitos Reservados
                </SidebarFooter>

            </ProSidebar >
        </div>
    )
}

export default AppMenu

