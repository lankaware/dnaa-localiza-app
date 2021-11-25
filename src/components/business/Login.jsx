import React, { useState, useEffect } from 'react'
import {
    Grid, TextField, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions
} from '@mui/material'
import CryptoJS from 'crypto-js'

import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

import { getList, putRec, postRec } from '../../services/apiconnect'
import { useStyles } from '../../services/stylemui'

const objectRef = 'login/'
const objectId = 'loginid/'

const Login = props => {

    const [_id] = useState('')
    const [name, nameSet] = useState('')
    const [login, loginSet] = useState('')
    const [passw, passwSet] = useState('')
    const classes = useStyles()

    const [infoOkDialog, infoOkDialogSet] = useState(false)
    const [invalidDialog, invalidDialogSet] = useState(false)

    useEffect(() => {
        loginSet('')
        nameSet('')
        passwSet('')       
    }, [])

    const loginConfirm = () => {
        if (!name || !login || !passw) {
            invalidDialogSet(true)
            return null
        }
        getList('loginlogin/' + login)
            .then(async item => {
                if (item.record[0]) {
                    invalidDialogSet(true)
                    return null
                }
                const passwcr = CryptoJS.AES.encrypt(passw, process.env.REACT_APP_SECRET).toString();
                let recObj = {
                    name,
                    login,
                    passw: passwcr,
                }
                if (_id) {
                    recObj = JSON.stringify(recObj)
                    putRec(objectId + _id, recObj)
                        .then(result => {
                            if (!result.error) success()
                        })
                } else {
                    recObj = JSON.stringify(recObj)
                    postRec(objectRef, recObj)
                        .then(result => {
                            if (!result.error) success()
                        })
                }
                return null
            })
    }
    const success = () => {
        infoOkDialogSet(true)
        loginSet('')
        nameSet('')
        passwSet('')
    }

    const infoOkDialogClose = () => {
        infoOkDialogSet(false)
    }

    const invalidDialogClose = () => {
        invalidDialogSet(false)
    }

    return (
        <>
            <div >

                <div >
                    <Grid container spacing={2} >
                        <Grid item xs={12}>
                            <div >
                                <Typography variant='h5'>Cadastro de Logins:</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={name}
                                onChange={(event) => { nameSet(event.target.value.toUpperCase()) }}
                                id='name'
                                label='Nome do Usuário'
                                fullWidth={false}
                                disabled={false}
                                InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                variant='outlined'
                                size='small'
                                sx={{ width: 300 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={login}
                                onChange={(event) => { loginSet(event.target.value) }}
                                id='login'
                                label='Login'
                                fullWidth={false}
                                disabled={false}
                                InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                variant='outlined'
                                size='small'
                                sx={{ width: 300 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={passw}
                                onChange={(event) => { passwSet(event.target.value) }}
                                id='passw'
                                label='Senha'
                                fullWidth={false}
                                disabled={false}
                                InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                variant='outlined'
                                size='small'
                                type='password'
                                sx={{ width: 300 }}
                            />
                        </Grid>
                        <Box sx={{ '& > button': { m: 1 } }} style={{ 'marginLeft': 15 }}>
                            {/* <div className={classes.bottomButtons}> */}
                            <Button color='primary' variant='contained' size='small' endIcon={<SubscriptionsIcon />}
                                onClick={_ => loginConfirm()} disabled={(false)}>Confirmar</Button>
                            <Button color='secondary' variant='contained' size='small' endIcon={<CancelScheduleSendIcon />}
                                // onClick={_ => loginClose()} 
                                disabled={false} href='/'>Cancelar</Button>
                            {/* </div> */}
                        </Box>
                    </Grid>
                    <Grid container spacing={2}>
                    </Grid>
                </div>
            </div>
            <Dialog
                open={invalidDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Todos os campos são obrigatórios e o login não pode coincidir com outro já cadastrado."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Clique em Ok para continuar.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={invalidDialogClose} color="primary" variant='contained'>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={infoOkDialog}
            // onClose={delInformClose}
            >
                <DialogTitle id="alert-dialog-title">{"Login registrado com sucesso."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Clique em Ok para continuar.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={infoOkDialogClose} color="primary" variant='contained'>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
export default Login