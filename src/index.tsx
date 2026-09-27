import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
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

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>
);

registerBackgroundWorker();