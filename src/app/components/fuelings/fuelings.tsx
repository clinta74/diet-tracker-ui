import React, { useEffect, useState } from 'react';
import { Box, Fab, List, ListItem, ListItemText, Paper, Typography, useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Api } from '../../../api';
import { useCommonStyles } from '../common-styles';

export const Fuelings: React.FC = () => {
    const commonClasses = useCommonStyles();
    const theme = useTheme();

    const [fuelings, setFuelings] = useState<Fueling[]>();

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => {
                setFuelings(data);
            });
    }, []);

    const onClickAddFueling = () => {
        console.log('Fuelings', fuelings);
    }

    return (
        <Box position="relative">
            <Box position="absolute" right={theme.spacing(1)} top={theme.spacing(2)}>
                <Fab color="primary" title="Create a Fueling" aria-label="add" onClick={onClickAddFueling}>
                    <AddIcon />
                </Fab>
            </Box>
            <Paper className={commonClasses.paper}>
                <Box mb={2}>
                    <Typography variant="h4">Fuelings</Typography>
                </Box>
                <List>
                    {
                        fuelings &&
                        fuelings.map(fueling =>
                            <ListItem key={fueling.fuelingId}>
                                <ListItemText primary={fueling.name} />
                            </ListItem>
                        )
                    }
                </List>
            </Paper>
        </Box>
    );
}