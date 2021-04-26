import { Box, Button, createStyles, Divider, makeStyles, Portal, Theme, Toolbar } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { createContext, useState } from 'react';


interface AlertHandlers {
    addMessage: (message: string) => void;
    clearMessages: () => void;
    messages?: string[];
}

const defaultAlertHandlers = {
    addMessage: (message: string) => null,
    clearMessages: () => null,
}

const AlertContext = createContext<AlertHandlers>(defaultAlertHandlers);

export const AlertProvider: React.FunctionComponent = ({ children }) => {
    const [messages, setMessages] = useState<string[]>();

    const alertHandlers = {
        addMessage: (message: string) =>
            setMessages(_messages => _messages ? [..._messages, message] : [message]),
        clearMessages: () =>
            setMessages(undefined),
        messages,
    }

    return <AlertContext.Provider value={alertHandlers}>{children}</AlertContext.Provider>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            backgroundColor: theme.palette.background.paper,
        },
    })
);

export const AlertMessage: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <AlertContext.Consumer>
            {
                value => value.messages &&
                    <Portal>
                        <Box className={classes.root} boxShadow={2}>
                        <Box p={1} textAlign="right">
                            <Button onClick={value.clearMessages}>Clear</Button>
                        </Box>
                            {
                                value.messages.map((message, idx) =>
                                    <React.Fragment key={idx}>
                                        <Alert severity="error" >
                                            <AlertTitle>Error</AlertTitle>
                                            {message}
                                        </Alert>
                                        <Divider />
                                    </React.Fragment>
                                )
                            }
                        </Box>
                    </Portal>
            }
        </AlertContext.Consumer>
    );
}

export const useAlertMessage = () => {
    const context = React.useContext(AlertContext);

    if (context === undefined) {
        throw new Error('useAlertMessage must be used within a AlertProvider');
    }

    return { ...context };
}