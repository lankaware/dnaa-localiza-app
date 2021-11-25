import { useContext, useState } from 'react'
import { Navbar, Nav, NavbarBrand, NavbarText } from 'reactstrap'
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material'
import MenuIcon from '@mui/icons-material/MenuOpen'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { Context } from '../../context/AuthContext'

const PageHeader = props => {
    const {userSign} = useContext(Context)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const logout = () => {
        setConfirmDialog(true)
    }

    const logoutConfirm = () => {
        userSign(false)
        setConfirmDialog(false)
    }

    const stayIn = () => {
        setConfirmDialog(false)
    }

    return (
        <div>
            <Navbar color='secondary' dark expand='md' fixed='top'>
                <Button
                    color='inherit'
                    variant='standard'
                    size='large'
                    onClick={props.toggleMenu}
                    startIcon={<MenuIcon />}
                >
                </Button>
                <NavbarBrand href='/'>
                    HR ASSESSMENT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </NavbarBrand>
                {/* <NavbarToggler onClick={props.toggleMenu} /> */}
                <Nav className='mr-auto ' navbar >
                </Nav>
                <NavbarText >{props.userName}</NavbarText>
                <Button
                    color='inherit'
                    variant='standard'
                    size='small'
                    onClick= {logout}//{setConfirmDialog(true)}
                    startIcon={<ExitToAppIcon />}
                >
                </Button>

            </Navbar>

            <Dialog
                open={confirmDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Deseja sair do sistema?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={logoutConfirm} color="primary" variant='contained' autoFocus>
                        Confirmar
                    </Button>
                    <Button onClick={stayIn} color="secondary" variant='contained'>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default PageHeader