import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
import {
    Grid, TextField, Typography, Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, AppBar, Tabs, Tab
} from '@mui/material'
import DataTable from 'react-data-table-component'
import AddIcon from '@mui/icons-material/Add';

import EditIcon from '@mui/icons-material/Edit'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'

import { useStyles } from '../../services/stylemui'
import { getList, putRec, postRec, deleteRec } from '../../services/apiconnect'
import TabPanel, { posTab } from '../commons/TabPanel'
import { theme } from '../../services/customtheme'
import { customStyles1 } from '../../services/datatablestyle'

const objectRef = 'tool/'
const objectId = 'toolid/'

var currentItem = 0
const currentItemSet = (value) => {
    currentItem = value
}

var dimensionListTemp = []
const dimensionListTempSet = (newObject) => {
    dimensionListTemp = newObject
}

const Tool = props => {

    let { id } = useParams()

    const [_id, _idSet] = useState(id)
    const [name, nameSet] = useState('')

    const [nameTemp, nameSetTemp] = useState('')

    const [dimensionList, dimensionListSet] = useState([])
    const [dimensionName, dimensionNameSet] = useState('')
    const [dimensionAcronym, dimensionAcronymSet] = useState('')

    const [insertMode, setInsertMode] = useState(id === '0')
    const [editMode, setEditMode] = useState(id === '0')

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteInfoDialog, setDeleteInfoDialog] = useState(false)
    const [emptyRecDialog, setEmptyRecDialog] = useState(false)

    const [tabValue, setTabValue] = useState(0);
    const [editDialog, editDialogSet] = useState(false)

    const columns = [
        {
            name: 'Nome da Dimensão',
            selector: row => row.name,
            sortable: true,
            width: '30vw',
        },
        {
            name: 'Sigla',
            selector: row => row.acronym,
            sortable: true,
            width: '30vw',
        },
    ];

    const classes = useStyles()

    useEffect(() => {
        if (id !== '0') {
            getList(objectId + id)
                .then(items => {
                    nameSet(items.record.name || '')
                    nameSetTemp(items.record.name || '')
                })
        }
        getList('dimensiontool/' + id)
            .then(items => {
                dimensionListSet(items.record)
            })
    }, [id])

    const saveRec = () => {
        if (!name) {
            setEmptyRecDialog(true)
            return null
        }
        let recObj = {
            name,
        }
        if (_id !== '0') {
            recObj = JSON.stringify(recObj)
            putRec(objectId + _id, recObj)
                .then(result => {
                    listSave(_id)
                })
        } else {
            recObj = JSON.stringify(recObj)
            postRec(objectRef, recObj)
                .then(result => {
                    listSave(result.record._id)
                    return result
                })
                .then(result => {
                    _idSet(result.record._id)
                })
        }
        nameSetTemp(name)
        setEditMode(false)
        setInsertMode(false)
    }

    const listSave = (parentId) => {
        for (var subitem in dimensionList) {
            let recObj = {
                tool_id: parentId,
                name: dimensionList[subitem].name,
                acronym: dimensionList[subitem].acronym
            }
            if (dimensionList[subitem].name === '* EXCLUIR *') {
                deleteRec('dimensionid/' + dimensionList[subitem]._id)
            } else if (typeof (dimensionList[subitem]._id) !== 'number') {
                recObj = JSON.stringify(recObj)
                putRec('dimensionid/' + dimensionList[subitem]._id, recObj)
            } else {
                recObj = JSON.stringify(recObj)
                postRec('dimension/', recObj)
            }
        }
    }

    const refreshRec = () => {
        if (insertMode) {
            document.getElementById("backButton").click();
        }
        nameSet(nameTemp)
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

    const addDimension = () => {
        
        let currentItemTemp = 0
        if (dimensionList) currentItemTemp = dimensionList.length

        dimensionNameSet('')
        dimensionAcronymSet('')
        if (dimensionList) {
            dimensionListTempSet([...dimensionList, { _id: currentItemTemp, name: 'x', acronym: 'x' }])
        } else {
            dimensionListTempSet([{ _id: currentItemTemp, name: 'x', acronym: 'x' }])
        }

        currentItemSet(currentItemTemp)
        editDialogSet(true)
        return null
    }

    const editOpen = (rowid) => {
        dimensionListTempSet(dimensionList)
        const currentItemTemp = dimensionList.findIndex((item) => { return item._id === rowid })

        dimensionNameSet(dimensionListTemp[currentItemTemp].name)
        dimensionAcronymSet(dimensionListTemp[currentItemTemp].acronym)

        currentItemSet(currentItemTemp)
        editDialogSet(true)

    }

    const editConfirm = () => {
        dimensionListTemp[currentItem].name = dimensionName
        dimensionListTemp[currentItem].acronym = dimensionAcronym

        dimensionListSet(dimensionListTemp)
        editDialogSet(false)
        setEditMode(true)
    }

    const editCancel = () => {
        editDialogSet(false)
    }

    const editDelete = () => {
        dimensionListTemp[currentItem].name = '* EXCLUIR *'
        dimensionListTemp[currentItem].acronym = ''
        dimensionListSet(dimensionListTemp)

        editDialogSet(false)
        setEditMode(true)
    }

    return (
        <div>
            <div className='tool-bar'>
                <div >
                    <Typography variant='h5' className='tool-title' noWrap={true}>Registro de Ferramenta</Typography>
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
                        onClick={_ => delRec()} disabled={editMode}>EXCLUIR
                    </Button>
                    <Button color='primary' variant='contained' size='small' startIcon={<KeyboardReturnIcon />}
                        href="/tools" id='backButton' disabled={editMode}>VOLTAR
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
                            label='Nome da Ferramenta'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
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
                            <Tab label="Dimensões" {...posTab(0)} />
                        </Tabs>
                    </AppBar>
                    <div className='tool-title-sub'>
                        <Button color='primary' variant='contained' size='small' endIcon={<AddIcon />}
                            onClick={_ => addDimension()} disabled={(false)} />
                    </div>
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                        <div >
                            <DataTable
                                // title=""
                                noHeader={true}
                                columns={columns}
                                customStyles={customStyles1}
                                data={dimensionList}
                                // selectableRows 
                                Clicked
                                // onSelectedRowsChange={handleChange}
                                keyField={'_id'}
                                highlightOnHover={true}
                                // pagination={true}
                                fixedHeader={true}
                                // noContextMenu={true}
                                // paginationComponentOptions={paginationBr}
                                paginationPerPage={6}
                                onRowClicked={(row, event) => { editOpen(row._id) }}
                            />
                        </div>
                    </TabPanel>
                </div>

            </Form>
            <Dialog
                open={editDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Alteração de Dimensão"}</DialogTitle>
                {/* <p/> */}
                <DialogContent dividers>
                    <div className='modal-form'>
                        <Grid container spacing={1} >
                            <Grid item xs={8}>
                                <TextField
                                    label='Nome da Dimensão'
                                    value={dimensionName}
                                    onChange={(event) => { dimensionNameSet(event.target.value) }}
                                    size='small'
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ step: 300 }}
                                // sx={{ width: 150 }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    label='Sigla'
                                    value={dimensionAcronym}
                                    onChange={(event) => { dimensionAcronymSet(event.target.value.toUpperCase()) }}
                                    size='small'
                                    type="text"
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                // sx={{ width: 150 }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={editDelete} color="primary" variant='contained' size='small'>
                        EXCLUIR
                    </Button>
                    <Button onClick={editConfirm} color="primary" variant='contained' size='small'>
                        SALVAR
                    </Button>
                    <Button onClick={editCancel} color="primary" variant='contained' size='small'>
                        CANCELAR
                    </Button>
                </DialogActions>
            </Dialog>

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

export default Tool