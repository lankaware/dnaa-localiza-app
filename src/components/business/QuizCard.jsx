import React, { useState } from 'react'
import {
    Card, CardContent, Typography, Grid, TextField
} from '@mui/material'

import { useStyles } from '../../services/stylemui'
import QuizQuestion from './QuizQuestion'

const QuizCard = props => {

    const card = props.card
    const editMode = props.editMode

    const [number, numberSet] = useState(card.number)
    const [observation, observationSet] = useState(card.observation)

    const questions = card.questions
    // const [questions, questionsSet] = useState(card.questions)

    const classes = useStyles()

    const onChangeNumber = (value) => {
        numberSet(value)
        card.number = value
        props.changeCard(props.index, card)
    }

    const onChangeObservation = (value) => {
        observationSet(value)
        card.observation = value
        props.changeCard(props.index, card)
    }

    const questionSet = (questNumber, question) => {
        questions[questNumber] = question
    }


    return (
        <Card sx={{ minWidth: 400 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom />
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <TextField
                            value={number}
                            onChange={(event) => onChangeNumber(event.target.value)}
                            id='name'
                            label='Conjunto No'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            type='number'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={observation}
                            onChange={(event) => onChangeObservation(event.target.value)}
                            id='observation'
                            label='Observações'
                            fullWidth={true}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                            variant='outlined'
                            size='small'
                            type='text'
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardContent>
                <Grid container spacing={2} >
                    {questions.map((item, index) => (
                        <QuizQuestion
                            question={item}
                            changeQuestion={questionSet}
                            questionNumber={index}
                            editMode={editMode}
                            key={index}
                        />
                    ))}
                </Grid>
            </CardContent>
        </Card>)
}

export default QuizCard