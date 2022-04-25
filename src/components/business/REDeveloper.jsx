import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
import DataTable from 'react-data-table-component'
import {
    Grid, TextField, Typography, Button, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box,
    AppBar, Tabs, Tab
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'


import { useStyles } from '../../services/stylemui'
import { getList, putRec, postRec, deleteRec } from '../../services/apiconnect'
import TabPanel, { posTab } from '../commons/TabPanel'
import { theme } from '../../services/customtheme'
import { dateBr } from '../../services/dateutils'


const objectRef = 'redeveloper/'
const objectId = 'redeveloperid/'

const REDeveloper = props => {

    const projectColumns = [
        {
            name: 'Nome',
            selector: row => row.name,
            sortable: true,
            width: '20vw',
            cell: row => (<Link href={"/reproject/" + row._id} >{row.name}</Link>)
        },
        {
            name: 'Endereço',
            selector: row => row.address,
            sortable: true,
            width: '20vw',
        },

    ];

    const eventColumns = [
        {
            name: 'Nome da Ação',
            selector: row => row.name,
            sortable: true,
            width: '30vw',
            cell: row => (<Link href={"/mktevent/" + row._id}>{row.name}</Link>)
        },
        {
            name: 'Data',
            selector: row => row.date,
            sortable: true,
            width: '10vw',
            cell: row => (<div>{dateBr(row.date)}</div>)
        },

    ];


    let { id } = useParams()

    const [_id, _idSet] = useState(id)
    const [name, nameSet] = useState('')
    const [email, emailSet] = useState('')
    const [fee, feeSet] = useState((id === '0' ? 15 : ''))

    const [insertMode, setInsertMode] = useState(id === '0')
    const [editMode, setEditMode] = useState(id === '0')

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteInfoDialog, setDeleteInfoDialog] = useState(false)
    const [emptyRecDialog, setEmptyRecDialog] = useState(false)
    const [recUpdated, setRecUpdated] = useState(true)

    const [projectList, projectListSet] = useState([])
    const [eventList, eventListSet] = useState([])


    const [tabValue, setTabValue] = useState(0);

    const classes = useStyles()

    useEffect(() => {
        if (id !== '0') {
            getList(objectId + _id)
                .then(items => {
                    nameSet(items.record.name || '')
                    emailSet(items.record.email || '')
                    feeSet(items.record.fee || '')

                })
            getList('reprojectperdeveloper/' + _id)
                .then(items => {
                    projectListSet(items.record)
                })
            getList('mkteventperdeveloper/' + _id)
                .then(items => {
                    eventListSet(items.record)
                })
        }

        setRecUpdated(true)
    }, [id, recUpdated])


    const saveRec = () => {
        if (!name) {
            setEmptyRecDialog(true)
            return null
        }
        let recObj = {
            name,
            email,
            fee,
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
                    <Typography variant='h5' className='tool-title' noWrap={true}>Registro de Incorporadoras</Typography>
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
                            href="/redeveloperlist" id='backButton' disabled={editMode}>LISTA
                        </Button>
                    </Box>
                </div>
            </div>
            <div className='data-form'>
                <Grid container spacing={2} >
                    <Grid item xs={5}>
                        <TextField
                            value={name}
                            onChange={(event) => { nameSet(event.target.value) }}
                            id='name'
                            label='Nome da Incorporadora'
                            fullWidth={true}
                            disabled={!insertMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={5}>
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
                            value={fee}
                            onChange={(event) => { feeSet(event.target.value) }}
                            id='fee'
                            label='Taxa FEE'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            inputProps={{ type: 'number' }}
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
                            <Tab label="Empreendimentos" {...posTab(0)} />
                            <Tab label="Ações" {...posTab(1)} />

                        </Tabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                        <div >
                            <DataTable
                                // title=""
                                noHeader={true}
                                columns={projectColumns}
                                // customStyles={customStyles1}
                                data={projectList}
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
                    <TabPanel value={tabValue} index={1} dir={theme.direction}>
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
                    <Box m={1}>
                        <Button size='small' color="warning" variant='contained' startIcon={<OpenInNewIcon />}
                            href="/reproject/0">Incluir Empreendimento
                        </Button>
                    </Box>
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

export default REDeveloper

