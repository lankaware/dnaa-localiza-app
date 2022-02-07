import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
import DataTable from 'react-data-table-component'
import {
    Grid, TextField, Typography, Link, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box,
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

import { prettyDate } from '../../services/dateutils'

const objectRef = 'reproject/'
const objectId = 'reprojectid/'

const REProject = props => {

    const eventColumns = [
        {
            name: 'Nome',
            selector: row => row.name,
            sortable: true,
            width: '20vw',
            cell: row => (<Link href={"/mktevent/" + row._id} >{row.name}</Link>)
        },
        {
            name: 'Data',
            selector: row => prettyDate(row.date),
            sortable: true,
            width: '20vw',
        },

    ];

    let { id } = useParams()

    const [_id, _idSet] = useState(id)
    const [name, nameSet] = useState('')
    const [address, addressSet] = useState('')
    const [neighborhood, neighborhoodSet] = useState('')
    const [city, citySet] = useState('')
    const [state, stateSet] = useState('')
    const [zip, zipSet] = useState('')
    const [redeveloperId, redeveloperIdSet] = useState('')

    const [email, emailSet] = useState('')
    const [phone, phoneSet] = useState('')

    const [redeveloperList, redeveloperListSet] = useState([])
    const [eventList, eventListSet] = useState([]);

    const [insertMode, setInsertMode] = useState(id === '0')
    const [editMode, setEditMode] = useState(id === '0')

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteInfoDialog, setDeleteInfoDialog] = useState(false)
    const [emptyRecDialog, setEmptyRecDialog] = useState(false)
    const [recUpdated, setRecUpdated] = useState(true)

    const [tabValue, setTabValue] = useState(0);

    const classes = useStyles()



    useEffect(() => {
        getList('redeveloper')
            .then(items => {
                redeveloperListSet(items.record)
            })
        if (id !== '0') {
            getList(objectId + id)
                .then(items => {
                    console.log(items)
                    nameSet(items.record.name || '')
                    addressSet(items.record.address || '')
                    neighborhoodSet(items.record.neighborhood || '')
                    citySet(items.record.city || '')
                    stateSet(items.record.state || '')
                    zipSet(items.record.zip || '')
                    redeveloperIdSet(items.record.reDeveloper_id || '')
                    return items.record.reDeveloper_id
                })
                .then(id => {
                    if (!id) return null
                    getList('redeveloperid/' + redeveloperId)
                        .then(items => {
                            emailSet(items.record.email || '')
                            phoneSet(items.record.phone || '')
                        })
                })

            getList('mkteventperproject/' + _id)
                .then(items => {
                    eventListSet(items.record)
                })
        }
        setRecUpdated(true)
    }, [id, recUpdated])

    useEffect(() => {
        getList('redeveloperid/' + redeveloperId)
            .then(items => {
                emailSet(items.record.email || '')
                phoneSet(items.record.phone || '')
            })
    }, [redeveloperId])

    const saveRec = () => {
        if (!name) {
            setEmptyRecDialog(true)
            return null
        }
        let recObj = {
            name,
            reDeveloper_id: redeveloperId,
            address,
            neighborhood,
            city,
            state,
            zip,
        }
        console.log(recObj)

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


    // const handleDeveloperChange = (e) => {
    //     const currentItemTemp = redeveloperList.findIndex((item) => { return item._id === e })
    //     redeveloperIdSet(e)
    // }

    return (
        <div>
            <div className='tool-bar'>
                <div >
                    <Typography variant='h5' className='tool-title' noWrap={true}>Registro de Empreendimentos</Typography>
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
                            href="/reprojectlist" id='backButton' disabled={editMode}>LISTA
                        </Button>
                    </Box>
                </div>
            </div>
            <div className='data-form'>
                <Grid container spacing={2} >
                    <Grid item xs={4}>
                        <TextField
                            id='redeveloperId'
                            label='Incorporadora'
                            value={redeveloperId}
                            onChange={(event) => { redeveloperIdSet(event.target.value) }}
                            size='small'
                            fullWidth={true}
                            type='text'
                            disabled={!insertMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            select>
                            {redeveloperList.map((option) => (
                                <MenuItem key={option._id} value={option._id}>{option.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            value={name}
                            onChange={(event) => { nameSet(event.target.value) }}
                            id='name'
                            label='Nome do Empreendimento'
                            fullWidth={true}
                            disabled={!insertMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={5}>
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
                    <Grid item xs={2}>
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
                        <Button color="primary" variant='contained'>
                            Gerar Recibo
                        </Button>
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
                            <Tab label="Ações" {...posTab(1)} />

                        </Tabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                        <div >
                            <DataTable
                                // title=""
                                noHeader={true}
                                columns={eventColumns}
                                // customStyles={customStyles1}
                                data={eventList}
                                // selectableRows 
                                // onSelectedRowsChange={handleChange}
                                Clicked
                                keyField={'_id'}
                                highlightOnHover={true}
                                // pagination={true}
                                fixedHeader={true}
                                // noContextMenu={true}
                                // paginationComponentOptions={paginationBr}
                                paginationPerPage={10}
                                noDataComponent={'Nenhum registro disponível.'}
                            // onRowClicked={(row, event) => { editOpen(row._id) }}
                            // selectableRows
                            // selectableRowsHighlight
                            // onSelectedRowsChange={({ allSelected, selectedCount, selectedRows }) => {
                            //     handleListChange(allSelected, selectedCount, selectedRows)
                            // }}
                            />
                        </div>
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

export default REProject;