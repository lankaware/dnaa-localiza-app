import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from 'reactstrap';
import {
    Grid, TextField, Typography, Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, AppBar, Tabs, Tab, MenuItem, Checkbox, FormControlLabel
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

import EditIcon from '@mui/icons-material/Edit'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import LinkIcon from '@mui/icons-material/Link'

import { useStyles } from '../../services/stylemui'
import { getList, putRec, postRec, deleteRec } from '../../services/apiconnect'
import TabPanel, { posTab } from '../commons/TabPanel'
import { theme } from '../../services/customtheme'

import QuizCard from './QuizCard'

const objectRef = 'quiz/'
const objectId = 'quizid/'

const Quiz = props => {

    let { id } = useParams()

    const [_id, _idSet] = useState(id)
    const [name, nameSet] = useState('')
    const [active, activeSet] = useState(false)
    const [blockLimit, blockLimitSet] = useState('')
    const [questionLimit, questionLimitSet] = useState('')
    const [toolId, toolIdSet] = useState('')
    const [toolName, toolNameSet] = useState('')

    const [nameTemp, nameSetTemp] = useState('')
    const [activeTemp, activeSetTemp] = useState(false)
    const [blockLimitTemp, blockLimitSetTemp] = useState('')
    const [questionLimitTemp, questionLimitSetTemp] = useState('')
    const [toolIdTemp, toolIdSetTemp] = useState('')
    const [toolNameTemp, toolNameSetTemp] = useState('')

    const [toolList, toolListSet] = useState([])
    const [dimensionList, dimensionListSet] = useState([])

    const [cardBlock, cardBlockSet] = useState([])
    const [nOfCards, nOfCardsSet] = useState(0)

    const [insertMode, setInsertMode] = useState(id === '0')
    const [editMode, setEditMode] = useState(id === '0')

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteInfoDialog, setDeleteInfoDialog] = useState(false)
    const [emptyRecDialog, setEmptyRecDialog] = useState(false)

    const [tabValue, setTabValue] = useState(0);

    // const [refresh, refreshSet] = useState(true)

    const classes = useStyles()

    const emptyCard = () => {
        const nextNumber = cardBlock ? cardBlock.length + 1 : 1
        return {
            number: nextNumber,
            observation: '',
            questions: emptyCardList()
        }
    }

    const emptyCardList = () => {
        return dimensionList.map(item => {
            return {
                dimension: item.acronym,
                text: '',
            }
        })
    }

    useEffect(() => {
        if (id !== '0') {
            getList(objectId + id)
                .then(items => {
                    nameSet(items.record[0].name || '')
                    activeSet(items.record[0].active || false)
                    blockLimitSet(items.record[0].blockLimit || '')
                    questionLimitSet(items.record[0].questionLimit || '')
                    toolIdSet(items.record[0].tool_id || '')
                    toolNameSet(items.record[0].tool_name || '')

                    nameSetTemp(items.record[0].name || '')
                    activeSetTemp(items.record[0].active || false)
                    blockLimitSetTemp(items.record[0].blockLimit || '')
                    questionLimitSetTemp(items.record[0].questionLimit || '')
                    toolIdSetTemp(items.record[0].tool_id || '')
                    toolNameSetTemp(items.record[0].tool_name || '')

                    cardBlockSet(items.record[0].blocks)

                    if (items.record[0].blocks) {
                        nOfCardsSet(items.record[0].blocks.length)
                    } else {
                        nOfCardsSet(0)
                    }
                })
        }
        getList('tool/')
            .then(items => {
                toolListSet(items.record)
            })
        if (toolId) {
            getList('dimensiontool/' + toolId)
                .then(items => {
                    dimensionListSet(items.record)
                })
        }
    }, [id, toolId])

    const saveRec = () => {
        if (!name) {
            setEmptyRecDialog(true)
            return null
        }
        let recObj = {
            name,
            active,
            blockLimit,
            questionLimit,
            tool_id: toolId,
            blocks: cardBlock,
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
        nameSetTemp(name)
        activeSetTemp(active)
        blockLimitSetTemp(blockLimit)
        questionLimitSetTemp(questionLimit)
        toolIdSetTemp(toolId)
        toolNameSetTemp(toolName)
        setEditMode(false)
        setInsertMode(false)
    }

    const refreshRec = () => {
        if (insertMode) {
            document.getElementById("backButton").click();
        }
        nameSet(nameTemp)
        activeSet(activeTemp)
        blockLimitSet(blockLimitTemp)
        questionLimitSet(questionLimitTemp)
        toolIdSet(toolIdTemp)
        toolNameSet(toolNameTemp)
        setEditMode(false)
    }

    const cardMount = () => {
        if (!cardBlock) return null
        return cardBlock.map((item, index) => (
            <Grid item md={6} key={index}>
                <QuizCard
                    card={item}   // {cardBlock[index]}
                    changeCard={cardSet}
                    cardNumber={index}
                    editMode={editMode}
                />
                <Button color='primary' size='large' id='searchButton' startIcon={<DeleteForeverIcon />}
                    onClick={_ => cardDrop(index)} >
                </Button>
            </Grid>
        ))
    }

    const addCard = () => {
        const newCard = emptyCard()
        if (cardBlock) {
            cardBlockSet([...cardBlock, newCard])
        } else {
            cardBlockSet([newCard])
        }
        nOfCardsSet(nOfCards + 1)
    }

    const cardSet = (cardNumber, card) => {
        cardBlock[cardNumber] = card
    }

    const cardDrop = (cardNumber) => {

        let blockTemp = cardBlock
        blockTemp.splice(cardNumber, 1)
        cardBlockSet(blockTemp)

        nOfCardsSet(nOfCards - 1)
        setEditMode(true)

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

    return (
        <div>
            <div className='tool-bar'>
                <div >
                    <Typography variant='h5' className='tool-title' noWrap={true}>Gerenciamento de Questionário</Typography>
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
                        href="/quizzes" id='backButton' disabled={editMode}>VOLTAR
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
                            label='Nome do Questionário'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel
                            label="Ativo?"
                            control={
                                <Checkbox
                                    checked={active}
                                    onChange={(event) => { activeSet(event.target.checked) }}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id='tool'
                            label='Nome da Ferramenta'
                            value={toolId}
                            onChange={(event) => { toolIdSet(event.target.value) }}
                            size='small'
                            fullWidth={true}
                            disabled={!insertMode}
                            type='text'
                            variant='outlined'
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            select >
                            {toolList.map((option, index) => {
                                return (
                                    <MenuItem key={index} value={option._id}>{option.name}</MenuItem>
                                )
                            })}
                        </TextField>
                    </Grid>
                    <Grid item xs={3} />

                    <Grid item xs={3}>
                        <TextField
                            value={blockLimit}
                            onChange={(event) => { blockLimitSet(event.target.value.toUpperCase()) }}
                            id='blockLimit'
                            label='Limite de Conjuntos'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            type='number'
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            value={questionLimit}
                            onChange={(event) => { questionLimitSet(event.target.value.toUpperCase()) }}
                            id='questionLimit'
                            label='Limite de Questões'
                            fullWidth={false}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            type='number'
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            value={nOfCards}
                            // onChange={(event) => { questionLimitSet(event.target.value.toUpperCase()) }}
                            id='questionLimit'
                            label='Conjuntos Atuais'
                            fullWidth={false}
                            disabled={true}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            type='number'
                        />
                    </Grid>
                    <Grid item xs={3}>
                    <Button color='success' variant='contained' size='small' endIcon={<LinkIcon />}
                            href={`${process.env.REACT_APP_APPRES.trim()}${_id} `} target="_blank" disabled={(_id === '0')}>
                                Testar Questionário
                            </Button>
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
                            <Tab label="Conjuntos" {...posTab(0)} />
                        </Tabs>
                    </AppBar>
                    <div className='tool-title-sub'>
                        <div className='data-form-level2'>
                            <Grid container spacing={5} >
                                {cardMount()}
                            </Grid>
                        </div>
                        <Button color='primary' variant='contained' size='small' endIcon={<AddIcon />}
                            onClick={_ => addCard()} disabled={(false)} />
                    </div>
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
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

        </div>
    )
}

export default Quiz