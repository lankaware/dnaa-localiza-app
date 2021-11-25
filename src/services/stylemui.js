import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
    toolButtons: {
      display: 'flex',
      'width': '45vw',
      'justify-content': 'flex-end',
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    bottomButtons: {
      'margin-top': '0px',
      'border-style': 'solid',
      'padding': '5px 15px 5px 15px',
      'border-width': '1px',
      'width': '95vw',
      'background-color': '#ffffff',
      'border-color':'#a0a0a0',
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    onlyButtons: {
      'margin-top': '0px',
      'padding': '5px 15px 5px 15px',
      'background-color': '#ffffff',
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    labelRoot: {
      color: '#000'
    },
    dataGrid: {
      backgroundColor: '#ffffff',
      'height': '50vh !important',
      'width': '95vw',
      'border-style': 'solid',
      'border-width': 'thin',
      'border-color': '#a0a0a0!important',
    },

    // Obs.: tootTitle was moved to App.cs to use @media
    // toolTitle: {
    //   marginTop: '5px',
    //   padding: '5px 15px 5px 0px',
    //   width: '20vw',
    // },

    toolTitleLg: {
      marginTop: '5px',
      padding: '5px 15px 5px 0px',
      width: '40vw'
    },
}));
