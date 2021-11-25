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

import RespondentList from './RespondentList'
import { timeBr } from '../../services/dateutils';

const objectRef = 'customer/'
const objectId = 'customerid/'

const Customer = props => {

    let { id } = useParams()

    const [_id, _idSet] = useState(id)
    const [name, nameSet] = useState('')
    const [cpf, cpfSet] = useState('')
    const [cnpj, cnpjSet] = useState('')
    const [legalName, legalNameSet] = useState('')
    const [email, emailSet] = useState('')
    const [phone, phoneSet] = useState('')
    const [personType, personTypeSet] = useState('')
    const [address, addressSet] = useState('')
    const [city, citySet] = useState('')
    const [state, stateSet] = useState('')
    const [zip, zipSet] = useState('')
    const [active, activeSet] = useState(false)
    const [registerDate, registerDateSet] = useState('')

    const [nameTemp, nameSetTemp] = useState('')
    const [cpfTemp, cpfSetTemp] = useState('')
    const [cnpjTemp, cnpjSetTemp] = useState('')
    const [legalNameTemp, legalNameSetTemp] = useState('')
    const [emailTemp, emailSetTemp] = useState('')
    const [phoneTemp, phoneSetTemp] = useState('')
    const [personTypeTemp, personTypeSetTemp] = useState('')
    const [addressTemp, addressSetTemp] = useState('')
    const [cityTemp, citySetTemp] = useState('')
    const [stateTemp, stateSetTemp] = useState('')
    const [zipTemp, zipSetTemp] = useState('')
    const [activeTemp, activeSetTemp] = useState(false)
    const [registerDateTemp, registerDateSetTemp] = useState('')

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
                    cpfSet(items.record.cpf || '')
                    cnpjSet(items.record.cnpj || '')
                    legalNameSet(items.record.legalName || '')
                    emailSet(items.record.email || '')
                    phoneSet(items.record.phone || '')
                    personTypeSet(items.record.personType || '')
                    addressSet(items.record.address || '')
                    citySet(items.record.city || '')
                    stateSet(items.record.state || '')
                    zipSet(items.record.zip || '')
                    activeSet(items.record.active || '')
                    registerDateSet((items.record.registerDate || '').substr(0, 10))

                    nameSetTemp(items.record.name || '')
                    cpfSetTemp(items.record.cpf || '')
                    cnpjSetTemp(items.record.cnpj || '')
                    legalNameSetTemp(items.record.legalName || '')
                    emailSetTemp(items.record.email || '')
                    phoneSetTemp(items.record.phone || '')
                    personTypeSetTemp(items.record.personType || '')
                    addressSetTemp(items.record.address || '')
                    citySetTemp(items.record.city || '')
                    stateSetTemp(items.record.state || '')
                    zipSetTemp(items.record.zip || '')
                    activeSetTemp(items.record.active || '')
                    registerDateSetTemp((items.record.registerDate || '').substr(0, 10))
                })
        }
    }, [id])

    const saveRec = () => {
        if (!name) {
            setEmptyRecDialog(true)
            return null
        }
        let recObj = {
            name,
            cpf,
            cnpj,
            legalName,
            email,
            phone,
            personType,
            address,
            city,
            state,
            zip,
            active,
            registerDate
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
        cpfSetTemp(cpf)
        cnpjSetTemp(cnpj)
        legalNameSetTemp(legalName)
        emailSetTemp(email)
        phoneSetTemp(phone)
        personTypeSetTemp(personType)
        addressSetTemp(address)
        citySetTemp(city)
        stateSetTemp(state)
        zipSetTemp(zip)
        activeSetTemp(active)
        registerDateSetTemp(registerDate)

        setEditMode(false)
        setInsertMode(false)
    }

    const refreshRec = () => {
        if (insertMode) {
            document.getElementById("backButton").click();
        }
        nameSet(nameTemp)
        cpfSet(cpfTemp)
        cnpjSet(cnpjTemp)
        legalNameSet(legalNameTemp)
        emailSet(emailTemp)
        phoneSet(phoneTemp)
        personTypeSet(personTypeTemp)
        addressSet(addressTemp)
        citySet(cityTemp)
        stateSet(stateTemp)
        zipSet(zipTemp)
        activeSet(activeTemp)
        registerDateSet(registerDateTemp)

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
                    <Typography variant='h5' className='tool-title' noWrap={true}>Registro de Cliente</Typography>
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
                        href="/customerList" id='backButton' disabled={editMode}>VOLTAR
                    </Button>
                </div>
            </div>
            <div className='data-form'>
                <Grid container spacing={2} >
                    <Grid item xs={3}>
                        <TextField
                            value={name}
                            onChange={(event) => { nameSet(event.target.value.toUpperCase()) }}
                            id='name'
                            label='Nome do Cliente'
                            fullWidth={true}
                            disabled={!insertMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id='personType'
                            label='Tipo Pessoa'
                            value={personType}
                            onChange={(event) => { personTypeSet(event.target.value) }}
                            size='small'
                            fullWidth={true}
                            disabled={!editMode}
                            type='text'
                            variant='outlined'
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            select >
                            <MenuItem key={0} value={'F'}>{'Física'}</MenuItem>
                            <MenuItem key={1} value={'J'}>{'Jurídica'}</MenuItem>
                        </TextField>
                    </Grid>
                    {function () {
                        if (personType === 'F')
                            return (
                                <Grid item xs={3}>
                                    <TextField
                                        value={cpf}
                                        onChange={(event) => { cpfSet(event.target.value) }}
                                        id='cpf'
                                        label='CPF'
                                        fullWidth={false}
                                        disabled={!editMode}
                                        InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                        variant='outlined'
                                        size='small'
                                    />
                                </Grid>
                            )
                    }()}
                    {function () {
                        if (personType === 'J')
                            return (
                                <Grid item xs={3}>
                                    <TextField
                                        value={cnpj}
                                        onChange={(event) => { cnpjSet(event.target.value) }}
                                        id='cnpj'
                                        label='CNPJ'
                                        fullWidth={false}
                                        disabled={!editMode}
                                        InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                        variant='outlined'
                                        size='small'
                                    />
                                </Grid>
                            )
                    }()}
                    {function () {
                        if (personType === 'J')
                            return (
                                <Grid item xs={4}>
                                    <TextField
                                        value={legalName}
                                        onChange={(event) => { legalNameSet(event.target.value) }}
                                        id='legalName'
                                        label='Razão Social'
                                        fullWidth={true}
                                        disabled={!editMode}
                                        InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                        variant='outlined'
                                        size='small'
                                    // inputProps={{ type: 'number' }}
                                    />
                                </Grid>
                            )
                        else
                            return (
                                <Grid item xs={3}>
                                </Grid>
                            )
                    }()}

                    <Grid item xs={3}>
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
                    <Grid item xs={2}>
                        <TextField
                            value={phone}
                            onChange={(event) => { phoneSet(event.target.value) }}
                            id='phone'
                            label='Fone'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            value={address}
                            onChange={(event) => { addressSet(event.target.value) }}
                            id='adreess'
                            label='Endereço'
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
                            value={city}
                            onChange={(event) => { citySet(event.target.value) }}
                            id='city'
                            label='Cidade'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            value={state}
                            onChange={(event) => { stateSet(event.target.value) }}
                            id='state'
                            label='Estado'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            value={zip}
                            onChange={(event) => { zipSet(event.target.value) }}
                            id='zip'
                            label='CEP'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            value={registerDate}
                            onChange={(event) => { registerDateSet(event.target.value) }}
                            id='registerDate'
                            label='Data de Registro'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            inputProps={{ type: 'date' }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel
                            label="Ativo?"
                            control={
                                <Checkbox
                                    checked={active}
                                    onChange={(event) => { activeSet(event.target.checked) }}
                                />
                            }
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
                            <Tab label="Respondentes" {...posTab(0)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                        <RespondentList
                            customerId={_id}
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