import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'

import { Button, Box, Typography, Grid, TextField, } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { useStyles } from '../../services/stylemui'
import { getList, putRec } from '../../services/apiconnect'
import { customStyles1, paginationBr } from '../../services/datatablestyle'

const objectRef = 'respondent/'

const RespondentList = props => {

    const columns = [
        {
            name: 'Nome do Respondente',
            selector: row => row.name,
            sortable: true,
            width: '30vw',
            cell: row => (<Link to={`/respondent/${customerId}/${row._id}`} >{row.name}</Link>)
        },
    ];

    const classes = useStyles();
    const [list, setList] = useState([])
    const customerId = props.customerId

    useEffect(() => {
        getList(objectRef + customerId)
            .then(items => {
                setList(items.record)
            })
    }, [customerId])

    const refreshRec = () => {
        let recObj = {}
        recObj = JSON.stringify(recObj)
        putRec(objectRef, recObj)
            .then(items => {
                setList(items.record)
            })
    }

    const launchSearch = (e) => {
        if (e.key === 'Enter') {
            document.getElementById("searchButton").click();
        }
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
                />
            </div>
            <Box m={1}>
                <Button color="primary" size='small' variant='contained' startIcon={<OpenInNewIcon />}
                    disabled={customerId === '0'}
                    href={`/respondent/${customerId}/0`} >INCLUIR
                </Button>
            </Box>

        </div>
    )
}

export default RespondentList
