import React, { useState } from 'react'
import {
    Grid, TextField
} from '@mui/material'
import { useStyles } from '../../services/stylemui'

const QuizQuestion = props => {

    const question = props.question
    const editMode = props.editMode

    const [dimension, dimensionSet] = useState(question.dimension)
    const [text, textSet] = useState(question.text)
    // const [questions, questionsSet] = useState(question.questions)

    const classes = useStyles()

    const onChangeDimension = (value) => {
        dimensionSet(value)
        question.dimension = value
        props.changeQuestion(props.index, question)
    }

    const onChangeText = (value) => {
        textSet(value)
        question.text = value
        props.changeQuestion(props.index, question)
    }

    return (
        <>
            <Grid item xs={2} key={props.index}>
                <TextField
                    value={dimension}
                    onChange={(event) => onChangeDimension(event.target.value)}
                    id='name'
                    label='Dim'
                    fullWidth={true}
                    disabled={true}
                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                    variant='outlined'
                    size='small'
                    type='text'
                />
            </Grid>
            <Grid item xs={10} key={props.index + 100}>
                <TextField
                    value={text}
                    onChange={(event) => onChangeText(event.target.value)}
                    id='text'
                    label='Texto'
                    fullWidth={true}
                    disabled={!editMode}
                    InputLabelProps={{ shrink: true, disabled: false, classes: { root: classes.labelRoot } }}
                    variant='outlined'
                    size='small'
                    type='text'
                />
            </Grid>
        </>
    )
}

export default QuizQuestion