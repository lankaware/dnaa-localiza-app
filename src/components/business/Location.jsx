import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
import DataTable from 'react-data-table-component'
import {
    Grid, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box,
    AppBar, Tabs, Tab, MenuItem, Input, Divider, InputAdornment
} from '@mui/material'
// import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import ComboBoxLists from "../commons/ComboBoxLists.json"

import { BsFillCircleFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FcPhotoReel } from "react-icons/fc";


import EditIcon from '@mui/icons-material/Edit'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'

import { useStyles } from '../../services/stylemui'
import { getList, putRec, postRec, deleteRec } from '../../services/apiconnect'
import TabPanel, { posTab } from '../commons/TabPanel'
import { theme } from '../../services/customtheme'
import { defaultDateBr, prettyDate } from '../../services/dateutils'
import { Context } from '../../context/AuthContext'

const objectRef = 'location/'
const objectId = 'locationid/'

var repeatedLocationId
var repeatedLocationName

const Location = props => {
    let addressTypeList = ComboBoxLists.AddressTypeList;
    let typeOfLocation = ComboBoxLists.TypeOfLocation;

    const historyColumns = [
        {
            name: 'Nome da Ação',
            selector: row => row.name,
            sortable: true,
            width: '30vw',
            cell: row => (<Link to={"/mktevent/" + row._id}>{row.name}</Link>)
        },
    ];

    let { id } = useParams()

    const [type, typeSet] = useState('')
    const [_id, _idSet] = useState(id)
    const [name, nameSet] = useState('')
    const [profile, profileSet] = useState('')
    const [addressType, addressTypeSet] = useState('')
    const [address, addressSet] = useState('')
    const [number, numberSet] = useState('')
    const [neighborhood, neighborhoodSet] = useState('')
    const [city, citySet] = useState('')
    const [state, stateSet] = useState('')
    const [zip, zipSet] = useState('')
    const [contactPreference, contactPreferenceSet] = useState('')
    const [email, emailSet] = useState('')
    const [phoneContact, phoneContactSet] = useState('')
    const [phone, phoneSet] = useState('')
    const [whats, whatsSet] = useState('')
    const [photo, photoSet] = useState('')
    const [disponibility, disponibilitySet] = useState('')
    const [occupied, occupiedSet] = useState('')
    const [operatingHours, operatingHoursSet] = useState('')
    const [capacity, capacitySet] = useState('')
    const [dayValue, dayValueSet] = useState('')
    const [weekendValue, weekendValueSet] = useState('')
    const [fifteenValue, fifteenValueSet] = useState('')
    const [monthValue, monthValueSet] = useState('')
    const [otherValues, otherValuesSet] = useState('')
    const [unavailable, unavailableSet] = useState(false)
    const [updatedBy, updatedBySet] = useState('')
    const [history, historySet] = useState([]);
    const [bankInfo, bankInfoSet] = useState('');
    const [observation, observationSet] = useState('');

    const [insertMode, setInsertMode] = useState(id === '0')
    const [editMode, setEditMode] = useState(id === '0')


    const [openImage, openImageSet] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteInfoDialog, setDeleteInfoDialog] = useState(false)
    const [emptyRecDialog, setEmptyRecDialog] = useState(false)
    const [recUpdated, setRecUpdated] = useState(true)
    const [repeatedDialog, repeatedDialogSet] = useState(false)
    const [repeatList, repeatListSet] = useState([])

    const { username } = useContext(Context);
    const dateChanged = prettyDate(defaultDateBr())

    const [tabValue, setTabValue] = useState(0);

    const classes = useStyles()

    useEffect(() => {
        if (id !== '0') {
            getList(objectId + id)
                .then(items => {
                    // historySet(items.history || [])
                    typeSet(items.record.type || '')
                    nameSet(items.record.name || '')
                    profileSet(items.record.profile || '')
                    addressTypeSet(items.record.addressType || '')
                    addressSet(items.record.address || '')
                    numberSet(items.record.number || '')
                    neighborhoodSet(items.record.neighborhood || '')
                    citySet(items.record.city || '')
                    stateSet(items.record.state || '')
                    zipSet(items.record.zip || '')
                    contactPreferenceSet(items.record.contactPreference || '')
                    emailSet(items.record.email || '')
                    phoneContactSet(items.record.phoneContact || '')
                    phoneSet(items.record.phone || '')
                    whatsSet(items.record.whats || '')
                    photoSet(items.record.photo || '')
                    disponibilitySet(items.record.disponibility || '')
                    occupiedSet(items.record.occupied || '')
                    operatingHoursSet(items.record.operatingHours || '')
                    capacitySet(items.record.capacity || '')
                    // dayValueSet(items.record.dayValue || '')
                    dayValueSet(items.record.dayValue ? parseFloat(items.record.dayValue).toFixed(2).toString() : '')
                    weekendValueSet(items.record.weekendValue ? parseFloat(items.record.weekendValue).toFixed(2).toString() : '')
                    fifteenValueSet(items.record.fifteenValue ? parseFloat(items.record.fifteenValue).toFixed(2).toString() : '')
                    monthValueSet(items.record.monthValue ? parseFloat(items.record.monthValue).toFixed(2).toString() : '')
                    otherValuesSet(items.record.otherValues || '')
                    unavailableSet(items.record.unavailable || '')
                    updatedBySet(items.record.updatedBy || '')
                    bankInfoSet(items.record.bankInfo || '')
                    observationSet(items.record.observation || '')
                    repeatedDialogSet(false)
                    setInsertMode(false)
                    setEditMode(false)
                })
        } else {
            getList('locationrepeated/')
                .then(items => {
                    repeatListSet(items.record)
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
            type,
            name,
            profile,
            addressType,
            address,
            number,
            neighborhood,
            city,
            state,
            zip,
            contactPreference,
            email,
            phoneContact,
            phone,
            whats,
            photo,
            disponibility,
            occupied,
            operatingHours,
            capacity,
            dayValue,
            weekendValue,
            fifteenValue,
            monthValue,
            otherValues,
            unavailable,
            updatedBy,
            bankInfo,
            observation,
        }
        if (_id !== '0') {
            recObj = JSON.stringify(recObj)
            putRec(objectId + _id, recObj)
            .then(result => {
                console.log({result})
            })
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

    const convertToBase64 = (file) => {
        console.log({file})
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    }

    const resizeAndSet = async (e) => {
        console.log({editMode})
        if (editMode) {
            let file = e.target.files[0];
            const base64 = await convertToBase64(file);
            if (base64.length > 100000) {
                alert("A imagem deve ter no máximo 70k.")
                return null
            }
            photoSet(base64);
        }
        return null
    };

    const containPhoto = (photo) => {
        if (Boolean(photo)) {
            return (
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Box sx={{ width: '98%', height: '98%' }}>
                        <img src={photo} onClick={() => openImageSet(true)} alt="" width="100%" />
                    </Box>
                </Box>)
        } else {
            return (
                <Box sx={{
                    width: '100%', height: '100%'
                }}>
                    <Box sx={{
                        width: 280, height: 150, display: "flex",
                        justifyContent: "center", alignItems: 'center'
                    }}>
                        <Typography>
                            Adicionar Imagem
                        </Typography>
                    </Box >
                </Box >
            )
        }
    }

    const checkRepetition = () => {
        console.log('repeatList', repeatList)
        repeatList.forEach((el) => {
            let tempAddress = (`${el.address}, ${el.number}`).normalize("NFD").replace(/\p{Diacritic}/gu, "");
            let compareAddress = (`${address}, ${number}`).normalize("NFD").replace(/\p{Diacritic}/gu, "");
            console.log('compareAddress', compareAddress)
            if (tempAddress === compareAddress) {
                repeatedLocationId = el._id
                repeatedLocationName = el.name
                repeatedDialogSet(true);
            }
        })
    }

    const selectMap = (array) => {
        array.map((el, i) => {
            return <MenuItem value={el}> el </MenuItem>
        })
    }

    return (
        <div>
            <div className='tool-bar'>
                <div >
                    <Typography variant='h5' className='tool-title' noWrap={true}>Registro de Pontos</Typography>
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
                            href="/locationList" id='backButton' disabled={editMode}>LISTA
                        </Button>
                    </Box>
                </div>
            </div>
            <div className='data-form'>
                <Grid container spacing={2} >
                    <Grid item xs={3}>
                        <Grid container spacing={2} >
                            <Grid item xs={12} height>
                                <Box sx={{ width: '100%', height: '100%' }} >
                                    {containPhoto(photo)}
                                    <label htmlFor="button-file">
                                        <Input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="button-file"
                                            onChange={resizeAndSet}
                                            type="file"
                                            disabled={!editMode}
                                        />
                                        <Button sx={{ mt: 1 }} variant='contained' startIcon={<FcPhotoReel />} component="span" disabled={!editMode}>
                                            {/* onClick={reziseAndSet}> */}
                                            Ad. Foto
                                        </Button>
                                    </label>
                                    <Button sx={{ mt: 1, ml: 1 }} variant='outlined' component="span" startIcon={<FcGoogle />}
                                        onClick={() => (window.open(`https://www.google.com/search?q=${type}+${name.split(' ').join('+')}+${addressType}+${address.split(' ').join('+')}+${number}`))}>
                                        Pesquisar
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>,
                    </Grid>
                    <Grid item xs={9}>
                        <Grid container spacing={2} >
                            <Grid item xs={2}>
                                <TextField
                                    value={unavailable}
                                    onChange={(event) => { unavailableSet(event.target.value) }}
                                    id='unavailable'
                                    label='Disponível'
                                    fullWidth={true}
                                    disabled={!editMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    select>
                                    <MenuItem key={0} value={"false"}><BsFillCircleFill color="green" /></MenuItem>
                                    <MenuItem key={1} value={"true"}><BsFillCircleFill color="red" /></MenuItem>
                                    <MenuItem key={2} value={"closed"}><BsFillCircleFill color="yellow" /></MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={type.toUpperCase()}
                                    onChange={(event) => { typeSet(event.target.value) }}
                                    id='type'
                                    label='Tipo do Local'
                                    fullWidth={true}
                                    disabled={!editMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    select>
                                    {typeOfLocation.map((el, i) => {
                                        return <MenuItem key={i} value={el}> {el} </MenuItem>
                                    })}
                                </TextField>

                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    value={name}
                                    onChange={(event) => { nameSet(event.target.value) }}
                                    id='name'
                                    label='Nome do Local'
                                    fullWidth={true}
                                    disabled={!editMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={addressType}
                                    onChange={(event) => { addressTypeSet(event.target.value) }}
                                    id='addressType'
                                    label='Logradouro'
                                    fullWidth={true}
                                    disabled={!editMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    select>
                                    {addressTypeList.map((el, i) => {
                                        return <MenuItem key={i} value={el}> {el} </MenuItem>
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    value={address}
                                    onChange={(event) => { addressSet(event.target.value) }}
                                    id='address'
                                    label='Endereço'
                                    onBlur={checkRepetition}
                                    fullWidth={true}
                                    disabled={!editMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={number}
                                    onChange={(event) => { numberSet(event.target.value) }}
                                    id='number'
                                    label='Número'
                                    fullWidth={true}
                                    onBlur={checkRepetition}
                                    disabled={!editMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    inputProps={{ type: 'text' }}
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
                            <Grid item xs={4}>
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
                            <Grid item xs={3}>
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
                                    value={phoneContact}
                                    onChange={(event) => { phoneContactSet(event.target.value) }}
                                    id='phoneContact'
                                    label='Responsável do contato'
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
                                    id='contactPreference'
                                    label='Contato Preferencial'
                                    value={contactPreference}
                                    onChange={(event) => { contactPreferenceSet(event.target.value) }}
                                    size='small'
                                    fullWidth={true}
                                    disabled={!editMode}
                                    type='text'
                                    variant='outlined'
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    select>
                                    <MenuItem key={0} value={'whatsapp'}>{'whatsapp'}</MenuItem>
                                    <MenuItem key={1} value={'email'}>{'email'}</MenuItem>
                                    <MenuItem key={1} value={'telefone'}>{'telefone'}</MenuItem>
                                    <MenuItem key={1} value={'pessoalmente'}>{'pessoalmente'}</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
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
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            value={phone}
                            onChange={(event) => { phoneSet(event.target.value) }}
                            id='phone'
                            label='Telefone Fixo'
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
                            value={whats}
                            onChange={(event) => { whatsSet(event.target.value) }}
                            id='whats'
                            label='Whatsapp'
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
                            value={operatingHours}
                            onChange={(event) => { operatingHoursSet(event.target.value) }}
                            id='operatingHours'
                            label='Horário da Ação'
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
                            value={capacity}
                            onChange={(event) => { capacitySet(event.target.value) }}
                            id='capacity'
                            label='Máximo de corretores'
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
                            id='profile'
                            label='Perfil'
                            value={profile}
                            onChange={(event) => { profileSet(event.target.value) }}
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
                        {/* <CurrencyTextField
                            label="Valor diária durante semana"
                            variant="outlined"
                            value={dayValue}
                            currencySymbol="R$"
                            //minimumValue="0"
                            outputFormat="number"
                            decimalCharacter=","
                            digitGroupSeparator="."
                            onChange={(event) => { dayValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                            disabled={!editMode}
                            size='small'
                        /> */}

                        <TextField
                            value={dayValue}
                            onChange={(event) => { dayValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                            id='dayValue'
                            label='Valor diária durante semana'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            inputProps={{ type: 'number' }}
                            onBlur={(event) => { dayValueSet(parseFloat(event.target.value || 0).toFixed(2).toString()) }}
                            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            value={weekendValue}
                            onChange={(event) => { weekendValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                            id='weekendValue'
                            label='Valor diária final de semana'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            inputProps={{ type: 'number' }}
                            onBlur={(event) => { weekendValueSet(parseFloat(event.target.value  || 0).toFixed(2).toString()) }}
                            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            value={fifteenValue}
                            onChange={(event) => { fifteenValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                            id='fifteenValue'
                            label='Valor Quinzenal'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            inputProps={{ type: 'number' }}
                            onBlur={(event) => { fifteenValueSet(parseFloat(event.target.value || 0).toFixed(2).toString()) }}
                            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            value={monthValue}
                            onChange={(event) => { monthValueSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                            id='monthValue'
                            label='Valor Mensal'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            inputProps={{ type: 'number' }}
                            onBlur={(event) => { monthValueSet(parseFloat(event.target.value || 0).toFixed(2).toString()) }}
                            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            value={otherValues}
                            onChange={(event) => { otherValuesSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                            id='otherValues'
                            label='Outros Valores/Media Kit'
                            fullWidth={true}
                            disabled={!editMode}
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

                    <Grid item xs={6}>
                        <TextField
                            value={disponibility}
                            onChange={(event) => { disponibilitySet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                            id='disponibility'
                            label='Datas Disponiveis'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            multiline
                            rows="2"
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            value={occupied}
                            onChange={(event) => { occupiedSet(event.target.value); updatedBySet(`${dateChanged} - ${username}`) }}
                            id='occupied'
                            label='Datas Selecionadas'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            multiline
                            rows="2"
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            value={bankInfo}
                            onChange={(event) => { bankInfoSet(event.target.value) }}
                            id='bankInfo'
                            label='Dados Bancários'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            multiline
                            rows="2"
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            value={observation}
                            onChange={(event) => { observationSet(event.target.value) }}
                            id='observation'
                            label='Observações'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            multiline
                            rows="2"
                        // inputProps={{ type: 'number' }}
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
                            <Tab label="Eventos Realizados" {...posTab(0)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                        <DataTable
                            noHeader={true}
                            columns={historyColumns}
                            data={history}
                            Clicked
                            keyField={'_id'}
                            highlightOnHover={true}
                            fixedHeader={true}
                            paginationPerPage={10}
                            noDataComponent={'Nenhum registro disponível.'}
                        />
                    </TabPanel>
                </div>

            </Form>

            <Dialog open={openImage}>
                <img src={photo} onClick={() => openImageSet(false)} alt="" width="100%" />
            </Dialog>

            <Dialog
                open={deleteDialog}
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

            <Dialog
                open={repeatedDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Endereço já cadastrado"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Clique no link abaixo para acessar o registro ou no botão para continuar o cadastro.
                    </DialogContentText>
                    <Link to={"/location/" + repeatedLocationId}>{repeatedLocationName}</Link>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { repeatedDialogSet(false) }} color="primary" size='small' variant='contained'>
                        Continuar
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Location