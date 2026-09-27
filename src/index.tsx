import { createTheme, ThemeProvider } from "@mui/material/styles";
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
    components: {
        MuiListItemIcon: {
            styleOverrides: {
                // MUI v9 lowered the default from 56px to 36px; the collapsed side nav (56px wide)
                // relies on the old width to keep the item labels out of view.
                root: { minWidth: 56 },
            },
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

registerBackgroundWorker();