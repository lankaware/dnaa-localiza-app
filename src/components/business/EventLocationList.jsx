import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import {
    Button, Box, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox,
} from '@mui/material'
import ReactToPrint from "react-to-print"

import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'
import SocialDistanceIcon from '@mui/icons-material/SocialDistance'
import EmailIcon from '@mui/icons-material/Email'

import { useStyles } from '../../services/stylemui'
import { deleteRec, getList, putRec, postRec } from '../../services/apiconnect'
import { customStyles1, paginationBr } from '../../services/datatablestyle'
import { regionPerCEP } from '../commons/RegionPerCEP'
import { defaultDateBr, prettyDate } from '../../services/dateutils'
import { Context } from '../../context/AuthContext'


import CompleteProposalLayout from './CompleteProposalLayout'
import ValuesProposalLayout from './ValuesProposalLayout'
import DispProposalLayout from './DispProposalLayout'

const objectRef = 'eventlocation/'
const objectId = 'eventlocationid/'
const objectChild = 'eventlocationevent/'
const objectPrevious = "mkteventprevious/"

var currentItem = '0'
// var addressType = ''
var fulladdress = ''
// var number = ''
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
            width: '15vw',
            cell: row => (<Link to={"/location/" + row.location_id} target="_blank">{row.location_name}</Link>)
        },
        {
            name: 'Endereço',
            selector: row => row.location_address,
            sortable: true,
            width: '15vw',
            cell: row => { return `${row.location_address_type} ${row.location_address}, ${row.location_number}` }

        },
        {
            name: 'Região',
            selector: row => row.location_zip,
            sortable: true,
            width: '10vw',
            cell: row => { return regionPerCEP(row.location_zip) }

        },
        {
            name: 'Perfil',
            selector: row => row.location_profile,
            sortable: true,
            width: '6vw',
            cell: row => { return profilePretty[row.location_profile - 1] }
        },
        {
            name: 'Distância',
            selector: row => row.distance,
            sortable: true,
            width: '8vw',
            right: true,
        },
        {
            name: 'Aprovado',
            selector: row => row.selected,
            width: '10vw',
            'data-tag': "allowRowEvents",
            cell: row => { return <Checkbox checked={row.selected} disabled={true} onChange={(event) => { selectedSet(event.target.checked) }} /> }
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
            cell: row => {
                return row.distance ? row.distance : <Button color='primary' size='large' id='searchButton' startIcon={<SocialDistanceIcon />}
                    onClick={_ => { console.log(row); calcDistance(row.localDest, row.index) }}>
                </Button>
            }

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
    const [selected, selectedSet] = useState(false)
    const [contracted, contractedSet] = useState(false)
    const [disponibility, disponibilitySet] = useState('')
    const [occupied, occupiedSet] = useState('')
    const [name, nameSet] = useState('')
    const [dayValue, dayValueSet] = useState('')
    const [weekendValue, weekendValueSet] = useState('')
    const [fifteenValue, fifteenValueSet] = useState('')
    const [monthValue, monthValueSet] = useState('')
    const [otherValues, otherValuesSet] = useState('')
    const [updatedBy, updatedBySet] = useState('')


    const { username } = useContext(Context);
    const dateChanged = prettyDate(defaultDateBr())



    const [editDialog, editDialogSet] = useState(false)
    const [localSelectDialog, localSelectDialogSet] = useState(false)
    const [appUpdate, setAppUpdate] = useState(true)
    const [locationSelectList, locationSelectListSet] = useState([])
    const [recalcEnabled, recalcEnabledSet] = useState(false)
    const [neighborFilter, neighborFilterSet] = useState("")

    const [proposalPreview, proposalPreviewSet] = useState(false)
    const [chooseProposal, chooseProposalSet] = useState(false)
    const [valuesProposal, valuesProposalSet] = useState(false)
    const [dispProposal, dispProposalSet] = useState(false)
    const [completeProposal, completeProposalSet] = useState(false)
    const [confirm, confirmSet] = useState(false)
    const proposalRef = useRef()

    useEffect(() => {
        if (mktEventId !== '0') {
            getList(objectChild + mktEventId)
                .then(items => {
                    console.log("eventlocationevent", items.record)
                    if (items) setList(items.record)
                })
        }
        setAppUpdate(true)
    }, [mktEventId, appUpdate]) // appUpdate retirado para teste

    useEffect(() => {
        getList('location/')
            .then(items => {
                locationListSet(items.record)
            })
    }, [mktEventId])

    useEffect(() => {
        if (mktEventId === '0') {
            getList(objectPrevious + props.reprojectId)
                .then(items => {
                    if (items) setList(items.record)
                })
        }
    }, [props.reprojectId])

    const editOpen = (rowid) => {
        getList(`${objectId}${rowid}`)
            .then(items => {
                _idSet(items.record._id || '')
                locationIdSet(items.record.location_id || '')
                locationZipSet(items.record.zip || '')
                distanceSet(items.record.distance || 0)
                selectedSet(items.record.selected || false)
                contractedSet(items.record.contracted || false)
                return items.record.location_id;
            }).then(actualLocationId => {
                // (locationId) {
                getList(`locationsummed/${actualLocationId}`)
                    .then(items => {
                        nameSet(items.record[0].name || "")
                        dayValueSet(items.record[0].dayValue || 0)
                        weekendValueSet(items.record[0].weekendValue || 0)
                        fifteenValueSet(items.record[0].fifteenValue || 0)
                        monthValueSet(items.record[0].monthValue || 0)
                        otherValuesSet(items.record[0].otherValues || "")
                        disponibilitySet(items.record[0].disponibility || "")
                        occupiedSet(items.record[0].occupied || "")
                        updatedBySet(items.record[0].updatedBy || "")
                    }).then(() => {
                        editDialogSet(true)
                    })
                // }
            })
        currentItem = rowid || '0'
    }

    const loadLocalSelect = () => {
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
                items.record.map((item, index) => {
                    // verficar se local já existe em eventLocation 
                    const alreadySelected = list.findIndex((listItem) => {
                        return listItem.location_id === item._id
                    })
                    if (alreadySelected !== -1) return null
                    console.log({ item, neighborFilter })
                    if (neighborFilter && item.neighborhood == neighborFilter) return null
                    const localDest = `${item.fulladdress} ${item.city} ${item.state}`
                    const uri = `locationdistance/${localOrigin}/${localDest}`
                    // getList(uri)
                    //     .then(result => {
                    let line = {
                        index: index,
                        name: item.name,
                        zip: item.zip,
                        profile: item.profile,
                        localDest: `${item.fulladdress} ${item.city} ${item.state}`,
                        distance: null,
                        locationId: item._id,
                        disponibility: item.disponibility,
                    }
                    locationListTemp = [...locationListTemp, line]
                    locationSelectListSet(locationListTemp)
                    // } )
                })
            })
    }


    const localSelectOpen = () => {
        loadLocalSelect();
        localSelectDialogSet(true)
        return null
    }

    const editConfirm = () => {
        let recObj = {
            event_id: mktEventId,
            location_id: locationId,
            distance,
            selected,
        }

        let recLocObj = {
            name,
            dayValue,
            weekendValue,
            fifteenValue,
            monthValue,
            otherValues,
            disponibility,
            occupied,
            updatedBy,
        }

        if (currentItem !== '0') {
            recObj = JSON.stringify(recObj);
            putRec(objectId + _id, recObj)
            recLocObj = JSON.stringify(recLocObj)
            putRec("locationid/" + locationId, recLocObj)
        } else {
            recObj = JSON.stringify(recObj);
            postRec(objectRef, recObj)
            // .then((res) => {
            //     res.record._id
            // })
        }
        setAppUpdate(false)
        editDialogSet(false)
    }

    const calcDistance = (localDest, index) => {
        const uri = `locationdistance/${localOrigin}/${localDest}`
        let localDistance = getList(uri)
            .then(result => {
                return result.distance;
            })
        locationSelectList.map(e => {
            if (e.index == index) {
                e.distance = 1 // localDistance;
            }
        })
        // let locationSelectListTemp = [...locationSelectList]
        locationSelectListSet([...locationSelectList])
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
        fulladdress = locationList[currentLocation].fulladdress
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

    const generateProposal = () => {
        proposalPreviewSet(true)
    }

    const closeProposal = () => {
        completeProposal && completeProposalSet(false);
        valuesProposal && valuesProposalSet(false);
        dispProposal && dispProposalSet(false);
        proposalPreviewSet(false);
    }

    return (
        <div>
            <div>
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
                {/* <Button color="warning" size='small' variant='contained' startIcon={<OpenInNewIcon />}
                    disabled={mktEventId === '0'} onClick={_ => editOpen('0')} sx={{ 'margin': '0 10px' }}>
                    INCLUIR LOCAL
                </Button> */}
                <Button color="success" size='small' variant='contained' startIcon={<AddLocationAltIcon />}
                    disabled={mktEventId === '0'} onClick={localSelectOpen} sx={{ 'margin': '0 10px' }}>
                    BUSCAR POR PROXIMIDADE
                </Button>
                <Button color="secondary" size='small' variant='contained' startIcon={<EmailIcon />}
                    disabled={mktEventId === '0'} onClick={() => chooseProposalSet(true)} sx={{ 'margin': '0 10px' }}>
                    GERAR PROPOSTA
                </Button>
                <Button color="info" size='small' variant='contained' startIcon={<EmailIcon />}
                    disabled={mktEventId === '0'} onClick={() => confirmSet(true)} sx={{ 'margin': '0 10px' }}>
                    Gerar Msg. de Confirmação
                </Button>
            </Box>

            <Dialog open={confirm} onClose={() => { confirmSet(false) }}>
                <DialogTitle>
                    Confirmação
                </DialogTitle>
                <DialogContent>
                    {list.map((location, index) => {
                        console.log(location)
                        return (
                            <>
                                <p>{`*${location.location_name}* - *${location.location_neighborhood}*`}<br/>
                                {`Data da ação:  ${location.occupied}`}<br/>
                                {`Endereço: ${location.location_address_type} ${location.location_address}`}<br/>
                                {`Horário: ${location.operatingHours}`}<br/>
                                {`Corretores: `}</p>
                            </>
                        )
                    })
                    }
                    <DialogActions>
                        {/* <Button color="secondary" size='small' variant='contained' startIcon={<EmailIcon />}
                            disabled={mktEventId === '0'} onClick={() => confirmSet(true)} sx={{ 'margin': '0 10px' }}>
                            Copiar
                        </Button> */}
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Dialog open={localSelectDialog} >
                <DialogTitle id="alert-dialog-title">{"Locais Próximos"}</DialogTitle>
                {/* <p/> */}
                <DialogContent dividers>
                    <div className='modal-form'>
                        <TextField
                            value={neighborFilter}
                            onChange={(event) => { neighborFilterSet(event.target.value) }}
                            onBlur={(event) => { loadLocalSelect() }}
                            id='neighborFilter'
                            label='Bairro de filtro'
                            fullWidth={true}
                            disabled={false}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            type='text'
                        />
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
                            {/* <Grid item xs={12}>
                                <TextField
                                    value={neighborFilter}
                                    onChange={(event) => { neighborFilterSet(event.target.value) }}
                                    id='neighborFilter'
                                    label='Bairro de filtro'
                                    fullWidth={true}
                                    disabled={false}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    type='text'
                                />
                            </Grid> */}

                            <Grid item xs={12}>

                                <TextField
                                    id='location-select'
                                    label='Local'
                                    value={name}
                                    // onChange={(event) => { handleLocationSelect(event.target.value) }}
                                    size='small'
                                    fullWidth={true}
                                    disabled={true}
                                    type='text'
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    // sx={{ width: 150 }}             cell: row => { return profilePretty[row.location_profile - 1] }
                                    TextField />

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
                            {/* <Button color='primary' size='large' id='searchButton' startIcon={<SocialDistanceIcon />}
                                onClick={_ => calcDistance()} disabled={!recalcEnabled}>
                            </Button> */}
                            <Grid item xs={5}></Grid>
                            <Grid item xs={3}>
                                <FormControlLabel
                                    label="Aprovado?"
                                    control={
                                        <Checkbox
                                            checked={selected}
                                            onChange={(event) => { selectedSet(event.target.checked) }}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={(parseFloat(dayValue).toFixed(2))}
                                    onChange={(event) => { dayValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                                    id='dayValue'
                                    label='Valor diária durante semana'
                                    fullWidth={true}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    inputProps={{ type: 'number' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={(parseFloat(weekendValue).toFixed(2))}
                                    onChange={(event) => { weekendValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                                    id='weekendValue'
                                    label='Valor diária final de semana'
                                    fullWidth={true}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    inputProps={{ type: 'number' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={(parseFloat(fifteenValue).toFixed(2))}
                                    onChange={(event) => { fifteenValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                                    id='fifteenValue'
                                    label='Valor Quinzenal'
                                    fullWidth={true}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    inputProps={{ type: 'number' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={(parseFloat(monthValue).toFixed(2))}
                                    onChange={(event) => { monthValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                                    id='monthValue'
                                    label='Valor Mensal'
                                    fullWidth={true}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    inputProps={{ type: 'number' }}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    value={otherValues}
                                    onChange={(event) => { otherValuesSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                                    id='otherValues'
                                    label='Outros Valores/Media Kit'
                                    fullWidth={true}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                // inputProps={{ type: 'number' }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    value={updatedBy}
                                    id='lastUpdated'
                                    label='Última atualização'
                                    fullWidth={true}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                // inputProps={{ type: 'number' }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    value={disponibility}
                                    onChange={(event) => { disponibilitySet(event.target.value) }}
                                    id='disponibility'
                                    label='Datas Disponíveis'
                                    fullWidth={true}
                                    disabled={false}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    type='text'
                                    multiline
                                    rows="2"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={occupied}
                                    onChange={(event) => { occupiedSet(event.target.value) }}
                                    id='occupied'
                                    label='Datas Selecionadas'
                                    fullWidth={true}
                                    disabled={false}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    type='text'
                                    multiline
                                    rows="2"
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

            <Dialog open={chooseProposal}>
                <DialogTitle>Escolha versão de proposta</DialogTitle>
                <DialogContent>
                    <Box m={1}>
                        <Button onClick={() => { valuesProposalSet(true); proposalPreviewSet(true); chooseProposalSet(false); }} color="primary" variant='contained' size='small'>
                            Valores
                        </Button></Box>
                    <Box m={1}>
                        <Button onClick={() => { dispProposalSet(true); proposalPreviewSet(true); chooseProposalSet(false); }} color="primary" variant='contained' size='small'>
                            Disponibilidade
                        </Button></Box>
                    <Box m={1}>
                        <Button onClick={() => { completeProposalSet(true); proposalPreviewSet(true); chooseProposalSet(false); }} color="primary" variant='contained' size='small'>
                            Valores + Disponibilidade
                        </Button></Box>
                </DialogContent>
            </Dialog>

            <Dialog
                open={proposalPreview}
                fullWidth={true}
                maxWidth={'lg'}
            >
                <DialogTitle id="alert-dialog-title">{"Proposta Comercial"}</DialogTitle>
                <DialogContent dividers>
                    {/* <FormControlLabel control={<Checkbox checked={proposalValues} onClick={() => proposalValues ? proposalValuesSet(false) : proposalValuesSet(true)} label="Valores" />} />
                    <FormControlLabel control={<Checkbox checked={proposalDisp} onClick={() => proposalDisp ? proposalDispSet(false) : proposalDispSet(true)} label="Disponibilidade" />} /> */}
                    {completeProposal &&
                        <CompleteProposalLayout
                            ref={proposalRef}
                            list={list}
                            reprojectName={props.reprojectName}
                            redeveloperName={props.redeveloperName}
                            eventAddress={props.eventAddress}
                            redeveloperFee={props.redeveloperFee}
                        />}
                    {valuesProposal &&
                        <ValuesProposalLayout
                            ref={proposalRef}
                            list={list}
                            reprojectName={props.reprojectName}
                            redeveloperName={props.redeveloperName}
                            eventAddress={props.eventAddress}
                            redeveloperFee={props.redeveloperFee}

                        />}
                    {dispProposal &&
                        <DispProposalLayout
                            ref={proposalRef}
                            list={list}
                            reprojectName={props.reprojectName}
                            redeveloperName={props.redeveloperName}
                            eventAddress={props.eventAddress}
                            redeveloperFee={props.redeveloperFee}
                        />}
                </DialogContent>
                <div className='data-bottom-margin'></div>
                <div className='only-buttons'>
                    <ReactToPrint className='button-link'
                        trigger={() =>
                            <Box m={1}>
                                <Button variant='contained' size='small' color='primary' href="#">
                                    Imprimir
                                </Button>
                            </Box>}
                        content={() => proposalRef.current}
                        onAfterPrint={() => { proposalPreviewSet(false) }}
                        documentTitle={'Proposta Comercial'}
                        pageStyle="@page { size: 5in 8in }"
                    />
                    <Box m={1}>
                        <Button color='primary' variant='contained' size='small'
                            onClick={closeProposal} disabled={false}>
                            Fechar
                        </Button>
                    </Box>
                </div>
            </Dialog>

        </div>
    )
}

export default EventLocationList

