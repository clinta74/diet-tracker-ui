import { Box, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';

export const UserTrackings: React.FC = () => {
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();

    return (
        <Paper className={commonClasses.paper}>
            <Box mb={2}>
                <Typography variant="h4">Goals</Typography>
                <p>Setting goals is a great way to make sure that you feel like you are making progress.</p>
            </Box>
        </Paper>
    );
}