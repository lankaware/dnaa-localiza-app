import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
import {
    Grid, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box,
    AppBar, Tabs, Tab, MenuItem
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'

import { getList, putRec, postRec, deleteRec } from '../../services/apiconnect'

const objectRef = 'emailparms/'
const objectId = 'emailparmsid/'

const EmailParms = props => {

    const [_id, _idSet] = useState('')
    const [requestText, requestTextSet] = useState('')
    const [emailHost, emailHostSet] = useState('')
    const [emailPort, emailPortSet] = useState('')
    const [emailUser, emailUserSet] = useState('')
    const [emailPass, emailPassSet] = useState('')
    const [emailFromName, emailFromNameSet] = useState('')
    const [emailFromMail, emailFromMailSet] = useState('')
    const [emailSubject, emailSubjectSet] = useState('')

    const [insertMode, setInsertMode] = useState(false)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        getList(objectRef)
            .then(items => {
                console.log('items.record', items.record)
                _idSet(items.record[0]._id || '0')
                requestTextSet(items.record[0].requestText || '')
                emailHostSet(items.record[0].emailHost || '')
                emailPortSet(items.record[0].emailPort || '')
                emailUserSet(items.record[0].emailUser || '')
                emailPassSet(items.record[0].emailPass || '')
                emailFromNameSet(items.record[0].emailFromName || '')
                emailFromMailSet(items.record[0].emailFromMail || '')
                emailSubjectSet(items.record[0].emailSubject || '')
            })
    }, [])

    const saveRec = () => {
        let recObj = {
            requestText,
            emailHost,
            emailPort,
            emailUser,
            emailPass,
            emailFromName,
            emailFromMail,
            emailSubject,
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
        setEditMode(false)
    }

    return (
        <div>
            <div className='tool-bar'>
                <div >
                    <Typography variant='h5' className='tool-title' noWrap={true}>Configurações para Envio de Email</Typography>
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
                        <Button color='primary' variant='contained' size='small' startIcon={<KeyboardReturnIcon />}
                            href="/" id='backButton' disabled={editMode}>VOLTAR
                        </Button>
                    </Box>
                </div>
            </div>
            <div className='data-form'>
                <Grid container spacing={2} >

                    <Grid item xs={3}>
                        <TextField
                            value={emailHost}
                            onChange={(event) => { emailHostSet(event.target.value) }}
                            id='emailHost'
                            label='Host'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            value={emailPort}
                            onChange={(event) => { emailPortSet(event.target.value) }}
                            id='emailPort'
                            label='Porta'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            value={emailUser}
                            onChange={(event) => { emailUserSet(event.target.value) }}
                            id='emailUser'
                            label='Login'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            value={emailPass}
                            onChange={(event) => { emailPassSet(event.target.value) }}
                            id='emailPass'
                            label='Senha'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false }}
                            variant='outlined'
                            size='small'
                         inputProps={{ type: 'password' }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            value={emailFromName}
                            onChange={(event) => { emailFromNameSet(event.target.value) }}
                            id='emailFromName'
                            label='Nome do Remetente'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            value={emailFromMail}
                            onChange={(event) => { emailFromMailSet(event.target.value) }}
                            id='emailFromMail'
                            label='Email do Remetente'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            value={emailSubject}
                            onChange={(event) => { emailSubjectSet(event.target.value) }}
                            id='emailSubject'
                            label='Assunto'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false }}
                            variant='outlined'
                            size='small'
                        // inputProps={{ type: 'number' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={requestText}
                            onChange={(event) => { requestTextSet(event.target.value.toUpperCase()) }}
                            id='requestText'
                            label='Texto Convite'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>
                </Grid>
            </div>


        </div>
    )
}

export default EmailParms