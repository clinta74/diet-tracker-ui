import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app/app";
import { registerBackgroundWorker } from './register-background-worker';


const theme = createTheme({
    palette: {
        primary: {
            main: '#4F662B',
            dark: '#2a3617',
        },
        secondary: {
            main: '#A13152',
        },
    },
});

ReactDOM.render(
    <React.Fragment>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.Fragment>,
    document.getElementById("root")
);

registerBackgroundWorker();