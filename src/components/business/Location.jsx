import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
//import ImageUploading from 'react-images-uploading';
//import resizeFile from './resizer';
import DataTable from 'react-data-table-component'
// import Compress from "browser-image-compression";
import {
    Grid, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box,
    AppBar, Tabs, Tab, MenuItem, Input, Link
} from '@mui/material'

import { BsFillCircleFill } from "react-icons/bs";

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

const objectRef = 'location/'
const objectId = 'locationid/'


const Location = props => {

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
    const [lastUpdated, lastUpdatedSet] = useState('')
    const [unavailable, unavailableSet] = useState(false)
    const [history, historySet] = useState([]);


    const [insertMode, setInsertMode] = useState(id === '0')
    const [editMode, setEditMode] = useState(id === '0')

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteInfoDialog, setDeleteInfoDialog] = useState(false)
    const [emptyRecDialog, setEmptyRecDialog] = useState(false)
    const [recUpdated, setRecUpdated] = useState(true)
    const [repeatedDialog, repeatedDialogSet] = useState(false)
    const [repeatList, repeatListSet] = useState([])


    const [tabValue, setTabValue] = useState(0);

    const classes = useStyles()

    useEffect(() => {
        if (id !== '0') {
            getList(objectId + id)
                .then(items => {
                    console.log("Foto", items)
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
                    dayValueSet(items.record.dayValue || '')
                    weekendValueSet(items.record.weekendValue || '')
                    fifteenValueSet(items.record.fifteenValue || '')
                    monthValueSet(items.record.monthValue || '')
                    lastUpdatedSet(prettyDate(items.record.updatedAt) || '')
                    unavailableSet(items.record.unavailable || '')

                })
        } else {
            getList('location/')
                .then(items => {
                    repeatListSet(items.record)
                })
        }
        setRecUpdated(true)
    }, [id, recUpdated])

    const saveRec = () => {
        console.log(photo)
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
            operatingHours,
            capacity,
            dayValue,
            weekendValue,
            fifteenValue,
            monthValue,
            unavailable,
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

    const convertToBase64 = (file) => {
        console.log(typeof(file), file)
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
        let file = e.target.files[0];
        const base64 = await convertToBase64(file);
        photoSet(base64);
        console.log(photo);

    };

    const containPhoto = (photo) => {
        if (Boolean(photo)) {
            return (
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Box sx={{ width: '98%', height: '98%' }}>
                        <img src={photo} alt="" width="100%" />
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

    // const checkRepetition = () => {
    //     repeatList.forEach((el) => {
    //         console.log(el.address);
    //         let tempAddress = (`${el.address}, ${el.number}`).normalize("NFD").replace(/\p{Diacritic}/gu, "");
    //         let compareAddress = (`${address}, ${number}`).normalize("NFD").replace(/\p{Diacritic}/gu, "");
    //         console.log(tempAddress == compareAddress, tempAddress, compareAddress)
    //        if (tempAddress == compareAddress) {
    //            repeatedDialogSet(true);

    //        }
    //     })
    // }

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
                                        />
                                        <Button sx={{ margin: 1 }} variant='contained' component="span" disabled={!editMode}> 
                                            {/* onClick={reziseAndSet}> */}
                                            Adicionar Foto
                                        </Button>
                                    </label>
                                </Box>
                            </Grid>
                        </Grid>
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
                                    <MenuItem key={0} value={false}><BsFillCircleFill color="green" /></MenuItem>
                                    <MenuItem key={1} value={true}><BsFillCircleFill color="red" /></MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={type}
                                    onChange={(event) => { typeSet(event.target.value) }}
                                    id='type'
                                    label='Tipo do Local'
                                    fullWidth={true}
                                    disabled={!insertMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    value={name}
                                    onChange={(event) => { nameSet(event.target.value.toUpperCase()) }}
                                    id='name'
                                    label='Nome do Local'
                                    fullWidth={true}
                                    disabled={!insertMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                />
                            </Grid>
                            <Grid item xs={2}>
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
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    value={address}
                                    onChange={(event) => { addressSet(event.target.value) }}
                                    id='address'
                                    label='Endereço'
                                    // onBlur={checkRepetition}
                                    fullWidth={true}
                                    disabled={!editMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    value={number}
                                    onChange={(event) => { numberSet(event.target.value) }}
                                    id='number'
                                    label='Número'
                                    fullWidth={true}
                                    // onBlur={checkRepetition}
                                    disabled={!editMode}
                                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                                    variant='outlined'
                                    size='small'
                                    inputProps={{ type: 'number' }}
                                />
                            </Grid>
                            <Grid item xs={2}>
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
                            <Grid item xs={1}>
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
                            <Grid item xs={4}>
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
                            label='Horário de Funcionamento'
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
                            label='Capacidade'
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
                            label='Perfil do Local'
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
                        <TextField
                            value={dayValue}
                            onChange={(event) => { dayValueSet(event.target.value) }}
                            id='dayValue'
                            label='Valor diária durante semana'
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
                            value={weekendValue}
                            onChange={(event) => { weekendValueSet(event.target.value) }}
                            id='weekendValue'
                            label='Valor diária final de semana'
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
                            value={fifteenValue}
                            onChange={(event) => { fifteenValueSet(event.target.value) }}
                            id='fifteenValue'
                            label='Valor Quinzenal'
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
                            value={monthValue}
                            onChange={(event) => { monthValueSet(event.target.value) }}
                            id='monthValue'
                            label='Valor Mensal'
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
                            value={lastUpdated}
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
                    <Grid item xs={5}>
                        <TextField
                            value={disponibility}
                            onChange={(event) => { disponibilitySet(event.target.value) }}
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
                    <Grid item xs={5}>
                        <TextField
                            value={occupied}
                            onChange={(event) => { occupiedSet(event.target.value) }}
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

            <Dialog
                open={repeatedDialog}
            // onClose={emptyRecClose}
            >
                <DialogTitle id="alert-dialog-title">{"Já existente"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deseja continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        repeatedDialogSet(false)
                    }} color="primary" variant='contained'>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Location