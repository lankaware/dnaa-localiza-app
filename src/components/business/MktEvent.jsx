import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
import {
    Grid, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box,
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

import EventLocationList from './EventLocationList'

const objectRef = 'mktevent/'
const objectId = 'mkteventid/'

const MktEvent = props => {

    let { id } = useParams()

    const [_id, _idSet] = useState(id)

    const [name, nameSet] = useState('')
    const [date, dateSet] = useState('')
    const [profileFrom, profileFromSet] = useState('')
    const [profileTo, profileToSet] = useState('')
    const [reprojectId, reprojectIdSet] = useState('')

    const [reprojectName, reprojectNameSet] = useState('')
    const [fulladdress, fulladdressSet] = useState('')
    const [neighborhood, neighborhoodSet] = useState('')
    const [city, citySet] = useState('')
    const [state, stateSet] = useState('')
    const [zip, zipSet] = useState('')
    const [redeveloperId, redeveloperIdSet] = useState('')
    const [redeveloperName, redeveloperNameSet] = useState('')
    const [redeveloperFee, redeveloperFeeSet] = useState('')

    const [email, emailSet] = useState('')
    const [phone, phoneSet] = useState('')

    const [reprojectList, reprojectListSet] = useState([])

    const [insertMode, setInsertMode] = useState(id === '0')
    const [editMode, setEditMode] = useState(id === '0')

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteInfoDialog, setDeleteInfoDialog] = useState(false)
    const [emptyRecDialog, setEmptyRecDialog] = useState(false)
    const [recUpdated, setRecUpdated] = useState(true)

    const [tabValue, setTabValue] = useState(0);

    const classes = useStyles()

    useEffect(() => {
        getList('reproject')
            .then(items => {
                console.log('1')
                reprojectListSet(items.record)
            })
        if (id !== '0') {
            getList(objectId + id)
                .then(items => {
                    console.log('2')
                    nameSet(items.record.name || '')
                    dateSet((items.record.initialDate || '').substr(0, 10))
                    profileFromSet(items.record.profileFrom || '')
                    profileToSet(items.record.profileTo || '')
                    reprojectIdSet(items.record.reproject_id || '')
                    return items.record.reproject_id;
                })
                .then(id => {
                    if (!id) return null
                    getList('reprojectid/' + id)
                        .then(items => {
                            reprojectNameSet(items.record[0].name || '')
                            fulladdressSet(items.record[0].fulladdress || '')
                            neighborhoodSet(items.record[0].neighborhood || '')
                            citySet(items.record[0].city || '')
                            stateSet(items.record[0].state || '')
                            zipSet(items.record[0].zip || '')
                            redeveloperIdSet(items.record[0].reDeveloper_id || '')
                            return items.record[0].reDeveloper_id
                        })
                        .then(id => {
                            if (!id) return null
                            getList('redeveloperid/' + id)
                                .then(items => {

                                    redeveloperNameSet(items.record.name || '')
                                    emailSet(items.record.email || '')
                                    phoneSet(items.record.phone || '')
                                    redeveloperFeeSet(items.record.fee || 15)
                                })
                        })
                })

        }
        setRecUpdated(true)
    }, [id, recUpdated])

    useEffect(() => {
        getList('reprojectid/' + reprojectId)
            .then(items => {
                reprojectNameSet(items.record.name || '')
                fulladdressSet(items.record.fulladdress || '')
                neighborhoodSet(items.record.neighborhood || '')
                citySet(items.record.city || '')
                stateSet(items.record.state || '')
                zipSet(items.record.zip || '')
                redeveloperIdSet(items.record.reDeveloper_id || '')
            })
            .then(id => {
                if (!id) return null
                getList('redeveloperid/' + id)
                    .then(items => {
                        emailSet(items.record.email || '')
                        phoneSet(items.record.phone || '')
                    })
            })
    }, [reprojectId])

    useEffect(() => {
        console.log('5')
        getList('redeveloperid/' + redeveloperId)
            .then(items => {
                emailSet(items.record.email || '')
                phoneSet(items.record.phone || '')
            })
    }, [redeveloperId])

    useEffect(() => {
        console.log('6')
        getList('redeveloperid/' + redeveloperId)
            .then(items => {
                emailSet(items.record.email || '')
                phoneSet(items.record.phone || '')
            })
    }, [_id])

    const saveRec = () => {
        if (!name) {
            setEmptyRecDialog(true)
            return null
        }
        let recObj = {
            name,
            reproject_id: reprojectId,
            date,
            profileFrom,
            profileTo,


        }
        if (_id !== '0') {
            recObj = JSON.stringify(recObj)
            putRec(objectId + _id, recObj)
        } else {
            recObj = JSON.stringify(recObj)
            postRec(objectRef, recObj)
                .then(result => {
                    _idSet(result.record._id)
                    if (reprojectId !== 0)
                        getList("mkteventprevious/" + reprojectId + "/" + result.record._id).then((record) => console.log(record))
                })
        }
        setEditMode(false)
        setInsertMode(false)
    }

    const refreshRec = () => {
        if (insertMode) {
            document.getElementById("backButton").click();
        }
        setRecUpdated(false)
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
                    <Typography variant='h5' className='tool-title' noWrap={true}>Registro de Ações Promocionais</Typography>
                </div>
                <div className='tool-buttons'>
                    <Box m={1}>
                        <Button color='primary' variant='contained' size='small' startIcon={<EditIcon />}
                            onClick={_ => setEditMode(true)} disabled={editMode}>EDITAR
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button color='primary' variant='contained' size='small' startIcon={<SaveAltIcon />}
                            onClick={_ => saveRec()} disabled={!editMode}>SALVAR
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button color='primary' variant='contained' size='small' startIcon={<CancelIcon />}
                            onClick={_ => refreshRec()} disabled={!editMode}>CANCELAR
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button color='primary' variant='contained' size='small' startIcon={<DeleteForeverIcon />}
                            onClick={_ => delRec()} disabled={editMode}>APAGAR
                        </Button>
                    </Box>
                    <Box m={1}>
                        <Button color='primary' variant='contained' size='small' startIcon={<KeyboardReturnIcon />}
                            href="/mkteventList" id='backButton' disabled={editMode}>LISTA
                        </Button>
                    </Box>
                </div>
            </div>
            <div className='data-form'>
                <Grid container spacing={2} >
                    <Grid item xs={4}>
                        <TextField
                            id='reprojectId'
                            label='Empreendimento'
                            value={reprojectId}
                            onChange={(event) => { reprojectIdSet(event.target.value) }}
                            size='small'
                            fullWidth={true}
                            type='text'
                            disabled={!insertMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            select>
                            {reprojectList.map((option) => (
                                <MenuItem key={option._id} value={option._id}>{option.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            value={name}
                            onChange={(event) => { nameSet(event.target.value) }}
                            id='name'
                            label='Nome da ação'
                            fullWidth={true}
                            disabled={!insertMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            value={date}
                            onChange={(event) => { dateSet(event.target.value) }}
                            id='date'
                            label='Data'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            inputProps={{ type: 'date' }}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            value={fulladdress}
                            onChange={(event) => { fulladdressSet(event.target.value) }}
                            id='adreess'
                            label='Endereço'
                            fullWidth={true}
                            disabled={true}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            value={neighborhood}
                            onChange={(event) => { neighborhoodSet(event.target.value) }}
                            id='neighborhood'
                            label='Bairro'
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
                            id='profileFrom'
                            label='Perfil do Evento - de:'
                            value={profileFrom}
                            onChange={(event) => { profileFromSet(event.target.value) }}
                            size='small'
                            fullWidth={true}
                            disabled={!editMode}
                            type='text'
                            variant='outlined'
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            select >
                            <MenuItem key={0} value={'1'}>{'$'}</MenuItem>
                            <MenuItem key={1} value={'2'}>{'$$'}</MenuItem>
                            <MenuItem key={2} value={'3'}>{'$$$'}</MenuItem>
                            <MenuItem key={3} value={'4'}>{'$$$$'}</MenuItem>
                            <MenuItem key={4} value={'5'}>{'$$$$$'}</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id='profileTo'
                            label='Perfil do Evento - até:'
                            value={profileTo}
                            onChange={(event) => { profileToSet(event.target.value) }}
                            size='small'
                            fullWidth={true}
                            disabled={!editMode}
                            type='text'
                            variant='outlined'
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            select >
                            <MenuItem key={0} value={'1'}>{'$'}</MenuItem>
                            <MenuItem key={1} value={'2'}>{'$$'}</MenuItem>
                            <MenuItem key={2} value={'3'}>{'$$$'}</MenuItem>
                            <MenuItem key={3} value={'4'}>{'$$$$'}</MenuItem>
                            <MenuItem key={4} value={'5'}>{'$$$$$'}</MenuItem>
                        </TextField>
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
                            <Tab label="Locais" {...posTab(0)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                        <EventLocationList
                            mktEventId={_id}
                            editMode={editMode}
                            eventAddress={`${fulladdress} ${city} ${state}`}
                            profileFrom={profileFrom}
                            profileTo={profileTo}
                            zip={zip}
                            reprojectId={reprojectId}
                            reprojectName={reprojectName}
                            redeveloperFee={redeveloperFee}
                            redeveloperName={redeveloperName}
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
                    <Button onClick={delCancel} color="primary" variant='contained' autoFocus>
                        Cancelar
                    </Button>
                    <Button onClick={delConfirm} color="secondary" variant='contained'>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteInfoDialog}>
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

            <Dialog open={emptyRecDialog}>
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

export default MktEvent