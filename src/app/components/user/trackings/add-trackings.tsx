import {
    Box,
    Button,
    CircularProgress,
    createStyles,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserTrackingType } from '../../../../api/endpoints/user-tracking';
import { useCommonStyles } from '../../common-styles';
import { TrackingForm } from './tracking-form';

const defaultTracking: UserTracking = {
    userTrackingId: 0,
    userId: '',
    title: '',
    disabled: false,
    description: '',
    occurrences: 0,
    order: 0,
    values: [{
        userTrackingValueId: 0,
        userTrackingId: 0,
        name: '',
        description: '',
        type: UserTrackingType.Number,
        order: 1,
        disabled: false,
    }],
}

const useStyles = makeStyles(() =>
    createStyles({
        buttonProgress: {
            position: 'absolute',
            left: '-100%',
            marginTop: -12,
            marginLeft: -12,
        },
    }),
);

export const AddTracking: React.FC = () => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const [tracking, setTracking] = useState<UserTracking>(defaultTracking);
    const [postingTracking, setPostingTracking] = useState(false);

    const onClickSaveTracking = () => {
        setPostingTracking(true);
        console.log('Save');
    }
    
    return (
        <Paper className={commonClasses.paper}>
            <Box>
                <Typography variant="h4">Edit Tracking</Typography>
                Please enter the information about the value you would like to track.
            </Box>
            {
                tracking &&
                <React.Fragment>
                    <TrackingForm tracking={tracking} setTracking={setTracking as React.Dispatch<React.SetStateAction<UserTracking>>} />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button color="primary" onClick={onClickSaveTracking} disabled={postingTracking}>Save</Button>
                                {postingTracking && <CircularProgress size={24} className={classes.buttonProgress}></CircularProgress>}
                            </Box>
                            <Link to="/trackings" className={commonClasses.link}>
                                <Button color="secondary" disabled={postingTracking}>Cancel</Button>
                            </Link>
                        </Box>
                    </Box>
                </React.Fragment>
            }
        </Paper>
    );
}