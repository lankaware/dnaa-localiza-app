import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'

import {
    Button, Box, Grid, TextField, MenuItem, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { useStyles } from '../../services/stylemui'
import { deleteRec, getList, putRec, postRec } from '../../services/apiconnect'
import { customStyles1, paginationBr } from '../../services/datatablestyle'
import { prettyDate, timeBr } from '../../services/dateutils'

const objectRef = 'application/'
const objectId = 'applicationid/'

var currentItem = '0'

const ApplicationList = props => {

    const columns = [
        {
            name: 'Questionário',
            selector: row => row.quiz_name,
            sortable: true,
            width: '20vw',
        },
        {
            name: 'Data de Envio',
            selector: row => row.responseDate,
            sortable: true,
            width: '10vw',
            cell: row => (prettyDate(row.responseDate))
        },
        {
            name: 'Data Limite',
            selector: row => row.limitDate,
            sortable: true,
            width: '10vw',
            cell: row => (prettyDate(row.limitDate))
        },
        {
            name: 'Link para Responder',
            selector: row => row.limitDate,
            sortable: true,
            width: '30vw',
            cell: row => (`${process.env.REACT_APP_APPRES.trim()}${row.quiz_id}`)
        },
    ];

    const classes = useStyles();
    const [list, setList] = useState([])
    const [quizList, setQuizList] = useState([])
    const respondentId = props.respondentId

    const [_id, _idSet] = useState('')
    const [quizId, quizIdSet] = useState('')
    const [quizName, quizNameSet] = useState('')
    const [limitDate, limitDateSet] = useState('')
    const [socialName, socialNameSet] = useState('')
    const [role, roleSet] = useState('')
    const [email, emailSet] = useState('')
    const [quizLink, quizLinkSet] = useState('')

    const [editDialog, editDialogSet] = useState(false)
    const [appUpdate, setAppUpdate] = useState(true)

    useEffect(() => {
        if (respondentId !== '0') {
            getList(objectRef + respondentId)
                .then(items => {
                    setList(items.record)
                })
        }
        getList('quiz/')
            .then(items => {
                setQuizList(items.record)
            })
        setAppUpdate(true)
    }, [respondentId, appUpdate])

    const refreshRec = () => {
        let recObj = {}
        recObj = JSON.stringify(recObj)
        putRec(objectRef, recObj)
            .then(items => {
                setList(items.record)
            })
    }

    const editOpen = (rowid) => {
        //       if (!props.editMode) return

        // const currentItemTemp = itemList.findIndex((item) => { return item._id === rowid })

        if (rowid) {
            getList(`${objectId}${rowid}`)
                .then(items => {
                    _idSet(items.record[0]._id || '')
                    quizIdSet(items.record[0].quiz_id || '')
                    quizNameSet(items.record[0].quiz_name[0] || '')
                    limitDateSet((items.record[0].limitDate || '').substr(0, 10))
                    socialNameSet(items.record[0].socialName || '')
                    roleSet(items.record[0].role || '')
                    emailSet(items.record[0].email || '')
                    quizLinkSet(`${process.env.REACT_APP_APPRES.trim()}${items.record[0].quiz_id}`)
                })
        } else {
            quizIdSet('')
            quizNameSet('')
            limitDateSet('')
            socialNameSet('')
            roleSet('')
            emailSet('')
            quizLinkSet('')
        }
        currentItem = rowid || '0'
        editDialogSet(true)
    }

    const insertOpen = () => {
        //       if (!props.editMode) return

        // const currentItemTemp = itemList.findIndex((item) => { return item._id === rowid })

        quizIdSet('')
        quizNameSet('')
        limitDateSet('')
        socialNameSet('')
        roleSet('')
        emailSet('')
        currentItem = '0'
        quizLinkSet('')
        editDialogSet(true)
    }

    const editConfirm = () => {
        console.log('currentItem', currentItem)
        let recObj = {
            respondent_id: respondentId,
            quiz_id: quizId,
            limitDate,
            socialName,
            role,
            email,
        }
        if (currentItem !== '0') {
            recObj = JSON.stringify(recObj);
            putRec(objectId + _id, recObj)
        } else {
            recObj = JSON.stringify(recObj);
            postRec(objectRef, recObj)
        }
        setAppUpdate(false)
        editDialogSet(false)
    }

    const editCancel = () => {
        setAppUpdate(false)
        editDialogSet(false)
    }

    const editDelete = () => {
        deleteRec(`${objectId}${currentItem}`)
        setAppUpdate(false)
        editDialogSet(false)
    }

    return (
        <div>
            <div >
                <DataTable
                    // title=""
                    noHeader={true}
                    columns={columns}
                    customStyles={customStyles1}
                    data={list}
                    // selectableRows 
                    Clicked
                    // onSelectedRowsChange={handleChange}
                    keyField={'_id'}
                    highlightOnHover={true}
                    pagination={true}
                    fixedHeader={true}
                    // noContextMenu={true}
                    paginationComponentOptions={paginationBr}
                    paginationPerPage={10}
                    noDataComponent={'Nenhum registro disponível.'}
                    onRowClicked={(row, event) => { editOpen(row._id) }}
                />
            </div>
            <Box m={1}>
                <Button color="primary" size='small' variant='contained' startIcon={<OpenInNewIcon />}
                    disabled={respondentId === '0'}
                    onClick={insertOpen} >INCLUIR
                </Button>
            </Box>

            <Dialog
                open={editDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Aplicação"}</DialogTitle>
                {/* <p/> */}
                <DialogContent dividers>
                    <div className='modal-form'>
                        <Grid container spacing={2} >
                            <Grid item xs={6}>
                                <TextField
                                    id="quiz"
                                    label='Questionário'
                                    value={quizId}
                                    onChange={(event) => { quizIdSet(event.target.value) }}
                                    size='small'
                                    fullWidth={true}
                                    disabled={false}
                                    type='text'
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    // sx={{ width: 150 }}
                                    select
                                >
                                    {quizList.map((option) => (
                                        <MenuItem key={option._id} value={option._id}>{option.name}</MenuItem>
                                    ))}
                                </TextField>

                                {/* <Autocomplete
                                    id="quiz"
                                    options={quizList}
                                    getOptionLabel={(option) => option.name}
                                    // style={{ width: 230 }}
                                    size='small'
                                    disabled={false}
                                    onChange={(event, newValue) => { if (newValue._id) quizIdSet(newValue._id) }}
                                    inputValue={quizName}
                                    onInputChange={(event, newInputValue) => { if (event && event.type !== 'blur') quizNameSet(newInputValue) }}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Questionário"
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                            inputProps={{ ...params.inputProps }}
                                        />}
                                /> */}

                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    value={limitDate}
                                    onChange={(event) => {
                                        limitDateSet(event.target.value);
                                    }}
                                    id="limitDate"
                                    label="Data Limite"
                                    fullWidth={true}
                                    disabled={false}
                                    InputLabelProps={{shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{ type: "date" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    value={socialName}
                                    onChange={(event) => {
                                        socialNameSet(event.target.value.toUpperCase());
                                    }}
                                    id="socialName"
                                    label="Nome Social"
                                    fullWidth={true}
                                    disabled={false}
                                    InputLabelProps={{shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    value={role}
                                    onChange={(event) => {
                                        roleSet(event.target.value.toUpperCase());
                                    }}
                                    id="role"
                                    label="Cargo ou Função"
                                    fullWidth={true}
                                    disabled={false}
                                    InputLabelProps={{shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={11}>
                                <TextField
                                    value={email}
                                    onChange={(event) => {
                                        emailSet(event.target.value);
                                    }}
                                    id="email"
                                    label="Email Alternativo"
                                    fullWidth={true}
                                    disabled={false}
                                    InputLabelProps={{shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{ type: "text" }}
                                />
                            </Grid>
                            <Grid item xs={11}>
                                <TextField
                                    value={quizLink}
                                    id="quizLink"
                                    label="Link para Responder"
                                    fullWidth={true}
                                    disabled={true}
                                    InputLabelProps={{shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{ type: "text" }}
                                />
                            </Grid>
                        </Grid>

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={editDelete} color="primary" variant='contained' size='small'
                        disabled={currentItem === '0'}>
                        APAGAR
                    </Button>
                    <Button onClick={editConfirm} color="primary" variant='contained' size='small'>
                        SALVAR
                    </Button>
                    <Button onClick={editCancel} color="primary" variant='contained' size='small'>
                        CANCELAR
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default ApplicationList

