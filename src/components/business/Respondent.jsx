import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
import {
    Grid, TextField, Typography, Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Checkbox, FormControlLabel,
    AppBar, Tabs, Tab, MenuItem
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'

import { useStyles } from '../../services/stylemui'
import { getList, putRec, postRec, deleteRec } from '../../services/apiconnect'
import TabPanel, { posTab } from '../commons/TabPanel'
import { theme } from '../../services/customtheme'

import ApplicationList from './ApplicationList'
import { timeBr } from '../../services/dateutils';

const objectRef = 'respondent/'
const objectId = 'respondentid/'

const Customer = props => {

    let { customer, id } = useParams()

    const [_id, _idSet] = useState(id)

    const [name, nameSet] = useState('')
    const [email, emailSet] = useState('')
    const [birthDate, birthDateSet] = useState('')

    const [nameTemp, nameSetTemp] = useState('')
    const [emailTemp, emailSetTemp] = useState('')
    const [birthDateTemp, birthDateSetTemp] = useState('')

    const [insertMode, setInsertMode] = useState(id === '0')
    const [editMode, setEditMode] = useState(id === '0')

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteInfoDialog, setDeleteInfoDialog] = useState(false)
    const [emptyRecDialog, setEmptyRecDialog] = useState(false)

    const [tabValue, setTabValue] = useState(0);


    const classes = useStyles()

    useEffect(() => {
        if (id !== '0') {
            getList(objectId + id)
                .then(items => {
                    // _idSet(items)

                    nameSet(items.record.name || '')
                    emailSet(items.record.email || '')
                    birthDateSet((items.record.birthDate || '').substr(0, 10))

                    nameSetTemp(items.record.name || '')
                    emailSetTemp(items.record.email || '')
                    birthDateSetTemp((items.record.birthDate || '').substr(0, 10))
                })
        }

    }, [id])

    const saveRec = () => {
        if (!name) {
            setEmptyRecDialog(true)
            return null
        }
        let recObj = {
            customer_id: customer,
            name,
            email,
            birthDate
        }
        if (_id !== '0') {
            recObj = JSON.stringify(recObj)
            putRec(objectId + _id, recObj)
        } else {
            recObj = JSON.stringify(recObj)
            postRec(objectRef, recObj)
                .then(result => {
                    _idSet(result.record._id)
                })
        }
        nameSetTemp(name)
        emailSetTemp(email)
        birthDateSetTemp(birthDate)

        setEditMode(false)
        setInsertMode(false)
    }

    const refreshRec = () => {
        if (insertMode) {
            document.getElementById("backButton").click();
        }
        nameSet(nameTemp)
        emailSet(emailTemp)
        birthDateSet(birthDateTemp)

        setEditMode(false)
    }

    const delRec = () => {
        setDeleteDialog(true)
    }

    const delConfirm = () => {
        deleteRec(objectId + _id)
        setDeleteDialog(false)
        setDeleteInfoDialog(true)
    }

    const delCancel = () => {
        setDeleteDialog(false)
    }

    const delInformClose = () => {
        document.getElementById("backButton").click();
    }

    const emptyRecClose = () => {
        setEmptyRecDialog(false)
    }

    return (
        <div>
            <div className='tool-bar'>
                <div >
                    <Typography variant='h5' className='tool-title' noWrap={true}>Registro de Respondente</Typography>
                </div>
                <div className={classes.toolButtons + ' button-link'}>
                    <Button color='primary' variant='contained' size='small' startIcon={<EditIcon />}
                        onClick={_ => setEditMode(true)} disabled={editMode}>EDITAR
                    </Button>
                    <Button color='primary' variant='contained' size='small' startIcon={<SaveAltIcon />}
                        onClick={_ => saveRec()} disabled={!editMode}>SALVAR
                    </Button>
                    <Button color='primary' variant='contained' size='small' startIcon={<CancelIcon />}
                        onClick={_ => refreshRec()} disabled={!editMode}>CANCELAR
                    </Button>
                    <Button color='primary' variant='contained' size='small' startIcon={<DeleteForeverIcon />}
                        onClick={_ => delRec()} disabled={editMode}>APAGAR
                    </Button>
                    <Button color='primary' variant='contained' size='small' startIcon={<KeyboardReturnIcon />}
                        href={`/customer/${customer}`} id='backButton' disabled={editMode}>VOLTAR
                    </Button>
                </div>
            </div>
            <div className='data-form'>
                <Grid container spacing={2} >
                    <Grid item xs={4}>
                        <TextField
                            value={name}
                            onChange={(event) => { nameSet(event.target.value.toUpperCase()) }}
                            id='name'
                            label='Nome do Respondente'
                            fullWidth={true}
                            disabled={!insertMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            value={email}
                            onChange={(event) => { emailSet(event.target.value) }}
                            id='email'
                            label='Email'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            value={birthDate}
                            onChange={(event) => { birthDateSet(event.target.value) }}
                            id='birthDate'
                            label='Data de Nascimento'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            inputProps={{ type: 'date' }}
                        />
                    </Grid>
                </Grid>
            </div>
            <Form className='data-form-level1'>
                <div >
                    <AppBar position="static" color="default">
                        <Tabs
                            value={tabValue}
                            onChange={(event, newValue) => { setTabValue(newValue) }}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Aplicações" {...posTab(0)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                        <ApplicationList
                            respondentId={_id}
                            editMode={editMode}
                        // onChangeSublist={availabilityListSet}
                        />
                    </TabPanel>
                </div>

            </Form>

            <Dialog
                open={deleteDialog}
            // onClose={delCancel}
            >
                <DialogTitle id="alert-dialog-title">{"Apagar o registro selecionado?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Após confirmada essa operação não poderá ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={delCancel} color="primary" variant='contained' autoFocus
                    >Cancelar
                    </Button>
                    <Button onClick={delConfirm} color="secondary" variant='contained'
                    >Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteInfoDialog}
            // onClose={delInformClose}
            >
                <DialogTitle id="alert-dialog-title">{"Registro removido do cadastro."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Clique para voltar a lista.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={delInformClose} color="primary" variant='contained'>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={emptyRecDialog}
            // onClose={emptyRecClose}
            >
                <DialogTitle id="alert-dialog-title">{"Registro sem descrição ou já existente não pode ser gravado."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Clique para continuar.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={emptyRecClose} color="primary" variant='contained'>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Customer