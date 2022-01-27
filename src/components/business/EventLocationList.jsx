import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { regionPerCEP } from '../commons/RegionPerCEP'

import {
    Button, Box, Grid, TextField, Dialog, MenuItem, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'
import SocialDistanceIcon from '@mui/icons-material/SocialDistance'
import EmailIcon from '@mui/icons-material/Email'

import { useStyles } from '../../services/stylemui'
import { deleteRec, getList, putRec, postRec } from '../../services/apiconnect'
import { customStyles1, paginationBr } from '../../services/datatablestyle'

const objectRef = 'eventlocation/'
const objectId = 'eventlocationid/'
const objectChild = 'eventlocationevent/'

var currentItem = '0'
var address = ''
var city = ''
var state = ''
var selectedToSave = []

const profilePretty = ['$', '$$', '$$$', '$$$$', '$$$$$']

const EventLocationList = props => {

    const columns = [
        {
            name: 'Nome',
            selector: row => row.location_name,
            sortable: true,
            width: '20vw',
            cell: row => (<Link to={"/location/" + row.location_id} target="_blank">{row.location_name}</Link>)
        },
        {
            name: 'Endereço',
            selector: row => row.location_address,
            sortable: true,
            width: '20vw',
        },
        {
            name: 'Região',
            selector: row => row.zip,
            sortable: true,
            width: '20vw',
        },

        {
            name: 'Perfil',
            selector: row => row.location_profile,
            sortable: true,
            width: '10vw',
            cell: row => { return profilePretty[row.location_profile - 1] }
        },
        {
            name: 'Distância',
            selector: row => row.distance,
            sortable: true,
            width: '10vw',
            right: true,
        },
        {
            name: 'Selecionado Cliente',
            selector: row => row.selected,
            width: '10vw',
            'data-tag': "allowRowEvents",
            cell: row => { return <Checkbox checked={row.selected} onChange={(event) => { selectedSet(event.target.checked) }} /> }
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
            width: '7vw',
            right: true,
        },
        {
            name: 'CEP',
            selector: row => row.zip,
            sortable: true,
            width: '5vw',
        },
        {
            name: 'Perfil',
            selector: row => row.profile,
            sortable: true,
            width: '5vw',
            cell: row => { return profilePretty[row.profile - 1] }
        },
    ];

    const classes = useStyles();
    const [list, setList] = useState([])
    const [locationList, locationListSet] = useState([])
    const mktEventId = props.mktEventId
    const localOrigin = props.eventAddress

    const [_id, _idSet] = useState('')
    const [locationId, locationIdSet] = useState('')
    const [locationZip, locationZipSet] = useState('')
    const [distance, distanceSet] = useState('')
    const [disponibility, disponibilitySet] = useState('')
    const [selected, selectedSet] = useState(false)
    const [contracted, contractedSet] = useState(false)

    const [editDialog, editDialogSet] = useState(false)
    const [localSelectDialog, localSelectDialogSet] = useState(false)
    const [appUpdate, setAppUpdate] = useState(true)
    const [locationSelectList, locationSelectListSet] = useState([])
    const [recalcEnabled, recalcEnabledSet] = useState(false)

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
        if (rowid !== '0') {
            getList(`${objectId}${rowid}`)
                .then(items => {
                    console.log(items)
                    _idSet(items.record._id || '')
                    locationIdSet(items.record.location_id || '')
                    locationZipSet(items.record.zip || '')
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
        var locationListTemp = []
        let recObj = {
            '$and': [
                { 'profile': { '$gte': props.profileFrom } },
                { 'profile': { '$lte': props.profileTo } },
                { 'zip': { "$gte": props.zip.substr(0, 2) } },
                { 'zip': { "$lte": `${props.zip.substr(0, 2)}A` } }
            ]
        }
        recObj = JSON.stringify(recObj)
        putRec('location/', recObj)
            .then(items => {
                items.record.map(item => {
                    // verficar se local já existe em enventLocation 
                    const alreadySelected = list.findIndex((listItem) => {
                        return listItem.location_id === item._id
                    })
                    if (alreadySelected !== -1) return null
                    const localDest = `${item.address} ${item.city} ${item.state}`
                    const uri = `locationdistance/${localOrigin}/${localDest}`
                    getList(uri)
                        .then(result => {
                            let line = {
                                name: item.name,
                                zip: item.zip,
                                profile: item.profile,
                                distance: result.distance,
                                locationId: item._id,
                                disponibility: item.disponibility,
                            }
                            locationListTemp = [...locationListTemp, line]
                            locationSelectListSet(locationListTemp)
                        })
                    return null
                })
                localSelectDialogSet(true)
            })
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
        }
        setAppUpdate(false)
        editDialogSet(false)
    }

    const calcDistance = () => {
        const localDest = `${address} ${city} ${state}`
        const uri = `locationdistance/${localOrigin}/${localDest}`
        getList(uri)
            .then(result => {
                const distance = result.distance
                distanceSet(distance)
                recalcEnabledSet(false)
            })
    }

    const localSelectConfirm = () => {
        selectedToSave.map(selectedLocal => {
            let recObj = {
                event_id: mktEventId,
                location_id: selectedLocal.locationId,
                distance: selectedLocal.distance,
                disponibility: selectedLocal.disponibility,
                selected: false,
                contracted: false,
            }
            recObj = JSON.stringify(recObj);
            postRec(objectRef, recObj)
            return null
        })
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

    const handleLocationSelect = (evalue) => {
        locationIdSet(evalue)
        const currentLocation = locationList.findIndex((item) => { return item._id === evalue })
        address = locationList[currentLocation].address
        city = locationList[currentLocation].city
        state = locationList[currentLocation].state
        recalcEnabledSet(true)
    }

    const handleSelectChange = (allSelected, selectedCount, selectedRows) => {
        selectedToSave = selectedRows
        return null
    }

    const handleListChange = (allSelected, selectedCount, selectedRows) => {
        //selectedToSave = selectedRows
        return null
    }

    const sendMessageSelected = (allSelected, selectedCount, selectedRows) => {
        //selectedToSave = selectedRows
        return null
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
                    // onSelectedRowsChange={handleChange}
                    Clicked
                    keyField={'_id'}
                    highlightOnHover={true}
                    pagination={true}
                    fixedHeader={true}
                    // noContextMenu={true}
                    paginationComponentOptions={paginationBr}
                    paginationPerPage={10}
                    noDataComponent={'Nenhum registro disponível.'}
                    onRowClicked={(row, event) => { editOpen(row._id) }}
                    selectableRows
                    selectableRowsHighlight
                    onSelectedRowsChange={({ allSelected, selectedCount, selectedRows }) => {
                        handleListChange(allSelected, selectedCount, selectedRows)
                    }}
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
                <Button color="secondary" size='small' variant='contained' startIcon={<EmailIcon />}
                    disabled={mktEventId === '0'} onClick={sendMessageSelected} sx={{ 'margin': '0 10px' }}>
                    ENVIAR MENSAGEM
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
                            selectableRows
                            selectableRowsHighlight
                            onSelectedRowsChange={({ allSelected, selectedCount, selectedRows }) => {
                                handleSelectChange(allSelected, selectedCount, selectedRows)
                            }}
                        // onRowClicked={(row, event) => { editOpen(row._id) }}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={localSelectConfirm} color="primary" variant='contained' size='small'>
                        ADICIONAR SELECIONADOS
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

                                <TextField
                                    id='location-select'
                                    label='Local'
                                    value={locationId}
                                    onChange={(event) => { handleLocationSelect(event.target.value) }}
                                    size='small'
                                    fullWidth={true}
                                    // disabled={!editMode}
                                    type='text'
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    // sx={{ width: 150 }}             cell: row => { return profilePretty[row.location_profile - 1] }
                                    select>
                                    {locationList.map((option) => (
                                        <MenuItem key={option._id} value={option._id}>{`${option.name} / ${option.address} / ${option.neighborhood} - ${profilePretty[option.profile - 1]} `}</MenuItem>
                                    ))}
                                </TextField>

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
                            <Button color='primary' size='large' id='searchButton' startIcon={<SocialDistanceIcon />}
                                onClick={_ => calcDistance()} disabled={!recalcEnabled}>
                            </Button>

                            <Grid item xs={4}>
                                <FormControlLabel
                                    label="Selecionado Cliente?"
                                    control={
                                        <Checkbox
                                            checked={selected}
                                            onChange={(event) => { selectedSet(event.target.checked) }}
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

