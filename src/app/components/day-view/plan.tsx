import { Box, Grid, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useCommonStyles } from '../common-styles';

export const Plan: React.FC = () => {
    const commonClasses = useCommonStyles();
    return (
        <Grid container justify="center">
            <Grid item md={10} lg={7} xl={5}>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Update Your Plan</Typography>
                        <p>Changing your plan will change the number of fuelings and meals you are shown each day going forward.</p>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}