import { Box, Grid, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useCommonStyles } from '../common-styles';

export const Goals: React.FC = () => {
    const commonClasses = useCommonStyles();
    
    return (
        <Grid container justify="center">
            <Grid item xs={12} md={10} xl={8}>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Goals</Typography>
                        <p>Setting goals is a great way to make sure that you feel like you are making progress.</p>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}