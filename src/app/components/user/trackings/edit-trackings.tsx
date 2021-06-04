import {
    Box,
    Button,
    CircularProgress,
    createStyles,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../../../api';
import { useAlertMessage } from '../../../providers/alert-provider';
import { useCommonStyles } from '../../common-styles';
import { TrackingForm } from './tracking-form';

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

interface Params {
    userTrackingId: string;
}

export const EditTracking: React.FC = () => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const params = useParams<Params>();
    const { Api } = useApi();
    const alert = useAlertMessage();

    const [tracking, setTracking] = useState<UserTracking>();
    const [postingTracking, setPostingTracking] = useState(false);

    useEffect(() => {
        const userTrackingId = Number(params.userTrackingId)
        Api.UserTracking.getUserTracking(userTrackingId)
            .then(({ data }) => setTracking(data))
            .catch(error => alert.addMessage(error));
    }, [params]);

    const onClickSaveTracking = () => {
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