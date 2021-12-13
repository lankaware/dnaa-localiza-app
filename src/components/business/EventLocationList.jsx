import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'

import {
    Button, Box, Grid, TextField, MenuItem, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'

import { useStyles } from '../../services/stylemui'
import { deleteRec, getList, putRec, postRec } from '../../services/apiconnect'
import { customStyles1, paginationBr } from '../../services/datatablestyle'
import { prettyDate, timeBr } from '../../services/dateutils'

const objectRef = 'eventlocation/'
const objectId = 'eventlocationeventid/'

var currentItem = '0'

const EventLocationList = props => {

    const columns = [
        {
            name: 'Nome',
            selector: row => row.location_name,
            sortable: true,
            width: '20vw',
        },
        {
            name: 'Endereço',
            selector: row => row.location_address,
            sortable: true,
            width: '20vw',
            cell: row => (prettyDate(row.responseDate))
        },
        {
            name: 'Perfil',
            selector: row => row.location_profile,
            sortable: true,
            width: '10vw',
            cell: row => (prettyDate(row.limitDate))
        },
        {
            name: 'distance',
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
    const localOrigin = props.eventAddress

    const [_id, _idSet] = useState('')
    const [locationId, locationIdSet] = useState('')
    const [distance, distanceSet] = useState('')
    const [disponibility, disponibilitySet] = useState('')
    const [selected, selectedSet] = useState('')
    const [contracted, contractedSet] = useState('')
 
    const [editDialog, editDialogSet] = useState(false)
    const [localSelectDialog, localSelectDialogSet] = useState(false)
    const [appUpdate, setAppUpdate] = useState(true)

    useEffect(() => {
        if (mktEventId !== '0') {
            getList(objectId + mktEventId)
                .then(items => {
                    setList(items.record)
                })
        }
        setAppUpdate(true)
    }, [mktEventId, appUpdate])

    const editOpen = (rowid) => {
        if (rowid) {
            getList(`${objectId}${rowid}`)
                .then(items => {
                    _idSet(items.record[0]._id || '')
                    locationIdSet(items.record[0].location_id || '')
                    distanceSet(items.record[0].distance || 0)
                    disponibilitySet(items.record[0].disponibility || '')
                    selectedSet(items.record[0].selected || false)
                    contractedSet(items.record[0].contracted || false)
                })
        } else {
            locationIdSet('')
            distanceSet(0)
            disponibilitySet('')
            selectedSet(false)
            contractedSet('')
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
        localSelectDialogSet(true)
    }

    const editConfirm = () => {
        console.log('currentItem', currentItem)
        let recObj = {
            event_id: mktEventId,
            location_id: locationId,
            distance,
            disponibility,
            selected,
            contracted,
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
            <Box m={1} >
                <Button color="warning" size='small' variant='contained' startIcon={<OpenInNewIcon />}
                    disabled={mktEventId === '0'} onClick={insertOpen} sx={{'margin': '0 10px'}}>
                        INCLUIR LOCAL
                </Button>
                <Button color="success" size='small' variant='contained' startIcon={<AddLocationAltIcon />}
                    disabled={mktEventId === '0'} onClick={insertOpen} sx={{'margin': '0 10px'}}>
                        BUSCAR POR PROXIMIDADE
                </Button>
            </Box>
            <Dialog open={localSelectDialog} >
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

