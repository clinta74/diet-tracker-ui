import { Box, Typography } from '@material-ui/core';
import React from 'react';

export const Welcome: React.FC = () => {
    return (
        <Box display="flex" justifyContent="center" p={4}>
            <Box textAlign="center">
                <Typography variant="h3">Welcome to Diet Tracker</Typography>
                <Typography variant="h5">
                    Your digital tracking software to help you meet you goals.
                </Typography>
                <Typography variant="body1">Please login to take full advantage of the features that are offered here.</Typography>
            </Box>
        </Box>
    );
}