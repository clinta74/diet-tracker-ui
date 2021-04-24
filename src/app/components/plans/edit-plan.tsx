import { Box, Grid, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useCommonStyles } from '../common-styles';

export const EditPlan: React.FC = () => {
    const commonClasses = useCommonStyles();

    return (
        <Grid container justify="center">
            <Grid item md={10} lg={7} xl={5}>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Edit Plan</Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>

    );
}