import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'

import {
    Button, Box, Grid, TextField, Dialog, InputLabel,
    DialogTitle, DialogContent, DialogActions, Select, FormControlLabel, Checkbox,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'

import { useStyles } from '../../services/stylemui'
import { deleteRec, getList, putRec, postRec } from '../../services/apiconnect'
import { customStyles1, paginationBr } from '../../services/datatablestyle'
import { prettyDate, timeBr } from '../../services/dateutils'

const objectRef = 'eventlocation/'
const objectId = 'eventlocationid/'
const objectChild = 'eventlocationevent/'

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
        },
        {
            name: 'Perfil',
            selector: row => row.location_profile,
            sortable: true,
            width: '10vw',
        },
        {
            name: 'Distância',
            selector: row => row.distance,
            sortable: true,
            width: '10vw',
        },
        {
            name: 'Escolhido',
            selector: row => row.selected,
            width: '10vw',
            'data-tag': "allowRowEvents",
            cell: row => {return <Checkbox checked={row.selected} onChange={(event) => { selectedSet(event.target.checked) }} />}
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
    const [locationList, locationListSet] = useState([])
    const mktEventId = props.mktEventId
    const localOrigin = props.eventAddress

    const [_id, _idSet] = useState('')
    const [locationId, locationIdSet] = useState('')
    const [distance, distanceSet] = useState('')
    const [disponibility, disponibilitySet] = useState('')
    const [selected, selectedSet] = useState(false)
    const [contracted, contractedSet] = useState(false)

    const [editDialog, editDialogSet] = useState(false)
    const [localSelectDialog, localSelectDialogSet] = useState(false)
    const [appUpdate, setAppUpdate] = useState(true)
    const [locationSelectList, locationSelectListSet] = useState([])

    useEffect(() => {
        if (mktEventId !== '0') {
            getList(objectChild + mktEventId)
                .then(items => {
                    if (items) setList(items.record)
                })
        }
        getList('location/')
            .then(items => {
                locationListSet(items.record)
            })

        setAppUpdate(true)
    }, [mktEventId, appUpdate])

    const editOpen = (rowid) => {
        if (rowid) {
            getList(`${objectId}${rowid}`)
                .then(items => {
                    _idSet(items.record._id || '')
                    locationIdSet(items.record.location_id || '')
                    distanceSet(items.record.distance || 0)
                    disponibilitySet(items.record.disponibility || '')
                    selectedSet(items.record.selected || false)
                    contractedSet(items.record.contracted || false)
                })
        } else {
            locationIdSet('')
            distanceSet(0)
            disponibilitySet('')
            selectedSet(false)
            contractedSet(false)
        }
        currentItem = rowid || '0'
        editDialogSet(true)
    }

    const localSelectOpen = () => {
        // let searchParm = { '$and': [{ 'name': { '$gte': req.params.name } }, { 'name': { '$lte': req.params.name + '~' } }] }

        let recObj = { '$and': [{ 'profile': props.profile }, { 'zip': { "$regex": props.zip } }] }
        recObj = JSON.stringify(recObj)

        putRec('location/', recObj)
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
                locationSelectListSet(locationListTemp)
            })
        localSelectDialogSet(true)
    }

    const editConfirm = () => {
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
            .then(result => console.log('result', result))
        }
        setAppUpdate(false)
        editDialogSet(false)
    }

    const localSelectConfirm = () => {
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
        localSelectDialogSet(false)
    }

    const editCancel = () => {
        setAppUpdate(false)
        editDialogSet(false)
    }

    const localSelectCancel = () => {
        setAppUpdate(false)
        localSelectDialogSet(false)
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
                    disabled={mktEventId === '0'} onClick={_ => editOpen('0')} sx={{ 'margin': '0 10px' }}>
                    INCLUIR LOCAL
                </Button>
                <Button color="success" size='small' variant='contained' startIcon={<AddLocationAltIcon />}
                    disabled={mktEventId === '0'} onClick={localSelectOpen} sx={{ 'margin': '0 10px' }}>
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
                            data={locationSelectList}
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
                    <Button onClick={localSelectConfirm} color="primary" variant='contained' size='small'>
                        SELECIONAR
                    </Button>
                    <Button onClick={localSelectCancel} color="primary" variant='contained' size='small'>
                        CANCELAR
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialog} >
                <DialogTitle id="alert-dialog-title">{"Escolher Local"}</DialogTitle>
                {/* <p/> */}
                <DialogContent dividers>
                    <div className='modal-form'>
                        <Grid container spacing={2} >
                            <Grid item xs={12}>
                                <InputLabel id='location-select-label' style={{ 'margin': '0px 0px 0px 0px', 'color': 'primary' }} >Local</InputLabel>
                                <Select
                                    native
                                    value={locationId}
                                    onChange={event => { locationIdSet(locationList[locationList.findIndex(e => e._id === event.target.value)]._id) }}
                                    id='location-select'
                                    labelId='location-select-label'
                                    autoFocus={true}
                                    variant='outlined'
                                    size='small'
                                >
                                    {locationList.map((item, i) => {
                                        return <option key={i} value={item._id}>{`${item.name} / ${item.profile} / ${item.address}`}</option>
                                    })}
                                </Select>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    value={distance}
                                    onChange={(event) => { distanceSet(event.target.value) }}
                                    id='distance'
                                    label='Distância do Evento'
                                    fullWidth={true}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    type='number'
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <FormControlLabel
                                    label="Selecionado?"
                                    control={
                                        <Checkbox
                                            checked={selected}
                                            onChange={(event) => { selectedSet(event.target.checked) }}
                                        />
                                    }
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <FormControlLabel
                                    label="Contratado?"
                                    control={
                                        <Checkbox
                                            checked={contracted}
                                            onChange={(event) => { contractedSet(event.target.checked) }}
                                        />
                                    }
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

export default EventLocationList

