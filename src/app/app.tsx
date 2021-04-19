import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Container, createStyles, CssBaseline, makeStyles, Paper, Theme } from '@material-ui/core';
import { ElevateAppBar } from './components/elevation-app-bar';
import { Fuelings } from './components/fuelings';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2, 4),
        }
    })
);

export const App: React.FC = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <ElevateAppBar />
            <Container >
                <Paper className={classes.paper} elevation={2}>
                    {
                        isAuthenticated &&
                        <Box>
                            <Fuelings />
                        </Box>
                        ||
                        <Box>
                            <Button onClick={loginWithRedirect}>Login</Button>
                        </Box>
                    }
                </Paper>
            </Container>
        </React.Fragment >
    );
}

