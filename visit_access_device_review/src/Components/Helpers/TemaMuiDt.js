import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';



export default function TemaMuiDt({children}){
    //ESTILO TABLA
    const theme = createMuiTheme({
        overrides:{
            MUIDataTableToolbar:{
                actions:{
                    '& .MuiButtonBase-root.MuiIconButton-root':{
                        color:"white"
                    }
                },
                left:{
                    '& .MuiSvgIcon-root':{
                        color:"white"
                    },
                    '& .MuiInputBase-root':{
                        color:"white",
                        marginTop: "5px"
                    }
                }
            },
            MuiToolbar:{
                root:{
                    background: "#c3251a"
                }
            },
            MuiTableFooter: {
                root: {
                '& .MuiToolbar-root': {
                    backgroundColor: 'white',
                },
                },
            },
            MuiTableCell:{
                root:{
                    padding: "0px !important"
                },
                head:{
                    paddingLeft: "10px !important"
                },
                body:{
                    border:"1px solid lightgray"
                }
            },
            MUIDataTableBodyCell:{
                stackedHeader:{
                    width:"40%",
                    paddingLeft:"10px",
                    paddingTop:"10px"
                }
            },
            MuiFormControl:{
                marginNormal:{
                    margin:"0px !important",
                    background:"white"
                }
            },
            MuiOutlinedInput:{
                root:{
                    padding:"0px !important"
                }
            }
        }
    });
    return (
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    )
}