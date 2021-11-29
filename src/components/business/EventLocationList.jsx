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

import axios from 'axios'

const objectRef = 'eventlocation/'
const objectId = 'eventlocationid/'

var currentItem = '0'

const EventLocationList = props => {

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

    const dialogColumns = [
        {
            name: 'Local',
            selector: row => row.name,
            sortable: true,
            width: '20vw',
        },
        {
            name: 'Distância',
            selector: row => row.distance,
            sortable: true,
            width: '20vw',
        },
    ];

    const classes = useStyles();
    const [list, setList] = useState([])
    const [locationList, setLocationList] = useState([])
    const mktEventId = props.mktEventId
    const localOrigin = props.eventLocation

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
        if (mktEventId !== '0') {
            getList(objectRef + mktEventId)
                .then(items => {
                    setList(items.record)
                })
        }
        setAppUpdate(true)
    }, [mktEventId, appUpdate])

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
        getList('location/')
            .then(items => {
                var locationListTemp = []
                items.record.map(item => {
                    const localDest = `${item.address} ${item.city} ${item.state}`
                    const uri = `locationdistance/${localOrigin}/${localDest}`
                    console.log('uri', uri)
                    getList(uri)
                    .then(result => {
                            console.log('result', result)
                            let line = {
                                name: item.name,
                                distance: result.distance,
                            }
                            locationListTemp = [...locationListTemp, line]
                        })
                })
                setLocationList(locationListTemp)
            })
        editDialogSet(true)
    }

    const editConfirm = () => {
        console.log('currentItem', currentItem)
        let recObj = {
            mktEvent_id: mktEventId,
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
                    disabled={mktEventId === '0'}
                    onClick={insertOpen} >INCLUIR
                </Button>
            </Box>

            <Dialog
                open={editDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Locais Próximos"}</DialogTitle>
                {/* <p/> */}
                <DialogContent dividers>
                    <div className='modal-form'>
                        <DataTable
                            // title=""
                            noHeader={true}
                            columns={dialogColumns}
                            customStyles={customStyles1}
                            data={locationList}
                            Clicked
                            keyField={'_id'}
                            highlightOnHover={true}
                            pagination={true}
                            fixedHeader={true}
                            paginationComponentOptions={paginationBr}
                            paginationPerPage={10}
                            noDataComponent={'Nenhum registro disponível.'}
                        // onRowClicked={(row, event) => { editOpen(row._id) }}
                        />
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

export default EventLocationList

