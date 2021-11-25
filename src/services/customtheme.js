import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        //  primary: {
        //      main: '#f00'
        //  },
        // secondary: {
        //     main: '#0f0'
        // },
        info: {
            main: '#f00'
        },
    },
    typography: {
        // fontFamily: 'Comic Sans MS'
    },
    shape: {
        // borderRadius: 30
    },
    spacing: 8,
    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none'
            },
        },
        MuiTableCell: {
            root: {
                borderBottom: 'none'
            }
        }
    },
    props: {
        // MuiButton: {
        //     color: '#0f0'
        // },
        MuiTextField: {
            color: 'primary'
        },
    },
})




// const GlobalStyle = createGlobalStyle `body {
//     font-family: sans-serif;
//   }
//   #root {
//     margin: 10%;
//   }
// `;

